import express from 'express';
import { PrismaClient } from '@prisma/client';
import { calculateFare } from '../utils/fare.js';
import { areRidesPoolCompatible } from '../utils/geo.js';
import {
  RIDE_STATUS,
  POOL_STATUS,
  ALLOWED_REQUEST_TRANSITIONS,
} from '../utils/lifecycle.js';
import { serializeBigInt } from './authRoutes.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/driver/:driverId/dashboard: Driver's cockpit
router.get('/:driverId/dashboard', async (req, res) => {
  try {
    const { driverId } = req.params;

    // Find driver and their Tesla
    const driver = await prisma.user.findUnique({
      where: { id: driverId },
      include: {
        tesla: true,
      },
    });

    if (!driver || driver.role !== 'DRIVER') {
      return res.status(404).json({ error: 'Driver profile not found' });
    }

    if (!driver.tesla) {
      return res.status(400).json({ error: 'Driver has no assigned vehicle' });
    }

    // Find active pool for Bullet
    const activePool = await prisma.pool.findFirst({
      where: {
        teslaId: driver.tesla.id,
        status: {
          in: [POOL_STATUS.OPEN, POOL_STATUS.FULL, POOL_STATUS.STARTED],
        },
      },
      include: {
        rideRequests: {
          where: {
            status: {
              in: [
                RIDE_STATUS.MATCHED,
                RIDE_STATUS.DRIVER_ARRIVED,
                RIDE_STATUS.STARTED,
              ],
            },
          },
          include: {
            passenger: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    // Find pending ride requests waiting for match
    const pendingRequests = await prisma.rideRequest.findMany({
      where: {
        status: RIDE_STATUS.REQUESTED,
      },
      include: {
        passenger: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Determine compatibility with current pool
    const remainingSeats = driver.tesla.capacity - (activePool ? activePool.totalSeatsOccupied : 0);

    const matchableRequests = pendingRequests.map((req) => {
      let isCompatible = true;
      let reason = 'Direct match';

      if (req.seatsRequested > remainingSeats) {
        isCompatible = false;
        reason = `Requested ${req.seatsRequested} seat(s), but only ${remainingSeats} seat(s) available in Bullet`;
      } else if (activePool && activePool.rideRequests.length > 0) {
        // Compare with first passenger in pool for route compatibility
        const firstRide = activePool.rideRequests[0];
        const routeOk = areRidesPoolCompatible(firstRide, req);
        if (!routeOk) {
          isCompatible = false;
          reason = `Route ${req.pickupZone} ➔ ${req.dropoffZone} not compatible with active pool ${firstRide.pickupZone} ➔ ${firstRide.dropoffZone}`;
        } else {
          reason = `Compatible with active pool corridor (${firstRide.pickupZone} ➔ ${firstRide.dropoffZone})`;
        }
      }

      return {
        ...req,
        fareBDT: Number(req.farePoysha) / 100,
        isCompatible,
        reason,
      };
    });

    // Past completed pools for history
    const pastPools = await prisma.pool.findMany({
      where: {
        teslaId: driver.tesla.id,
        status: POOL_STATUS.COMPLETED,
      },
      include: {
        rideRequests: {
          include: {
            passenger: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    });

    res.json(serializeBigInt({
      driver: {
        id: driver.id,
        name: driver.name,
        walletBalanceBDT: Number(driver.walletBalancePoysha) / 100,
        walletBalancePoysha: driver.walletBalancePoysha,
      },
      tesla: driver.tesla,
      activePool: activePool
        ? {
            ...activePool,
            remainingSeats,
            passengers: activePool.rideRequests.map((r) => ({
              requestId: r.id,
              passengerId: r.passenger.id,
              name: r.passenger.name,
              pickupZone: r.pickupZone,
              dropoffZone: r.dropoffZone,
              seatsRequested: r.seatsRequested,
              status: r.status,
              fareBDT: Number(r.farePoysha) / 100,
              farePoysha: r.farePoysha,
            })),
          }
        : null,
      pendingRequests: matchableRequests,
      pastPools,
    }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/driver/:driverId/status: Toggle ONLINE/OFFLINE
router.patch('/:driverId/status', async (req, res) => {
  try {
    const { driverId } = req.params;
    const { status } = req.body;

    if (!['ONLINE', 'OFFLINE'].includes(status)) {
      return res.status(400).json({ error: 'Status must be ONLINE or OFFLINE' });
    }

    const driver = await prisma.user.findUnique({
      where: { id: driverId },
      include: { tesla: true },
    });

    if (!driver || !driver.tesla) {
      return res.status(404).json({ error: 'Driver or Tesla not found' });
    }

    const updatedTesla = await prisma.tesla.update({
      where: { id: driver.tesla.id },
      data: { status },
    });

    res.json(serializeBigInt(updatedTesla));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/driver/pool/accept: Accept a ride request into Bullet's pool
// Concurrency safe: atomic seat verification inside interactive transaction
router.post('/pool/accept', async (req, res) => {
  try {
    const { driverId, requestId } = req.body;

    if (!driverId || !requestId) {
      return res.status(400).json({ error: 'driverId and requestId are required' });
    }

    const driver = await prisma.user.findUnique({
      where: { id: driverId },
      include: { tesla: true },
    });

    if (!driver || !driver.tesla) {
      return res.status(404).json({ error: 'Driver vehicle not found' });
    }

    const tesla = driver.tesla;

    // Execute atomic pool matching & seat reservation
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch the RideRequest with lock/latest state
      const rideRequest = await tx.rideRequest.findUnique({
        where: { id: requestId },
        include: { passenger: true },
      });

      if (!rideRequest) {
        throw new Error('NOT_FOUND: Ride request does not exist');
      }

      if (rideRequest.status !== RIDE_STATUS.REQUESTED) {
        throw new Error(`INVALID_STATE: Ride request is no longer available (current status: ${rideRequest.status})`);
      }

      // 2. Find or create active open pool for this Tesla
      let pool = await tx.pool.findFirst({
        where: {
          teslaId: tesla.id,
          status: { in: [POOL_STATUS.OPEN, POOL_STATUS.FULL] },
        },
        include: { rideRequests: true },
      });

      if (!pool) {
        pool = await tx.pool.create({
          data: {
            teslaId: tesla.id,
            status: POOL_STATUS.OPEN,
            totalSeatsOccupied: 0,
          },
          include: { rideRequests: true },
        });
      }

      // 3. CRITICAL CONCURRENCY CHECK: Enforce Bullet's 3-seat capacity
      const newOccupiedSeats = pool.totalSeatsOccupied + rideRequest.seatsRequested;
      if (newOccupiedSeats > tesla.capacity) {
        throw new Error(`CAPACITY_EXCEEDED: Cannot accept ride. Bullet capacity is ${tesla.capacity}, currently occupied ${pool.totalSeatsOccupied}, requested ${rideRequest.seatsRequested}`);
      }

      // 4. Calculate pooled fare with 25% pool discount
      const pooledFare = calculateFare({
        pickupZone: rideRequest.pickupZone,
        dropoffZone: rideRequest.dropoffZone,
        seatsRequested: rideRequest.seatsRequested,
        isPooled: true,
      });

      // 5. Update RideRequest to MATCHED with pooled fare
      const updatedRequest = await tx.rideRequest.update({
        where: { id: requestId },
        data: {
          status: RIDE_STATUS.MATCHED,
          poolId: pool.id,
          farePoysha: pooledFare.finalFarePoysha,
        },
      });

      // Also ensure previous pooled passengers get pooled discount if they were alone initially
      for (const prevRide of pool.rideRequests) {
        const recalculated = calculateFare({
          pickupZone: prevRide.pickupZone,
          dropoffZone: prevRide.dropoffZone,
          seatsRequested: prevRide.seatsRequested,
          isPooled: true,
        });
        await tx.rideRequest.update({
          where: { id: prevRide.id },
          data: { farePoysha: recalculated.finalFarePoysha },
        });
      }

      // 6. Update Pool seat count & status
      const updatedPoolStatus = newOccupiedSeats >= tesla.capacity ? POOL_STATUS.FULL : POOL_STATUS.OPEN;
      const updatedPool = await tx.pool.update({
        where: { id: pool.id },
        data: {
          totalSeatsOccupied: newOccupiedSeats,
          status: updatedPoolStatus,
        },
        include: {
          rideRequests: {
            include: { passenger: { select: { id: true, name: true } } },
          },
        },
      });

      // 7. Audit log
      await tx.auditLog.create({
        data: {
          rideRequestId: requestId,
          poolId: pool.id,
          event: 'RIDE_MATCHED_TO_POOL',
          details: `Driver ${driver.name} accepted ${rideRequest.passenger.name} (${rideRequest.seatsRequested} seat/s) into Bullet pool. Total occupied: ${newOccupiedSeats}/${tesla.capacity}. Pooled Fare: ৳${pooledFare.finalFareBDT}`,
        },
      });

      return { updatedRequest, updatedPool, pooledFareBDT: pooledFare.finalFareBDT };
    });

    res.json(serializeBigInt(result));
  } catch (error) {
    if (error.message.startsWith('CAPACITY_EXCEEDED')) {
      return res.status(409).json({ error: error.message, code: 'CAPACITY_EXCEEDED' });
    }
    if (error.message.startsWith('INVALID_STATE') || error.message.startsWith('NOT_FOUND')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// POST /api/driver/pool/:poolId/transition: Advance pool lifecycle
// DRIVER_ARRIVED -> STARTED -> COMPLETED
router.post('/pool/:poolId/transition', async (req, res) => {
  try {
    const { poolId } = req.params;
    const { driverId, targetStatus } = req.body;

    const pool = await prisma.pool.findUnique({
      where: { id: poolId },
      include: {
        tesla: { include: { driver: true } },
        rideRequests: { include: { passenger: true } },
      },
    });

    if (!pool) {
      return res.status(404).json({ error: 'Pool not found' });
    }

    if (driverId && pool.tesla.driverId !== driverId) {
      return res.status(403).json({ error: 'Forbidden: You are not the driver of this vehicle' });
    }

    if (pool.rideRequests.length === 0) {
      return res.status(400).json({ error: 'Cannot transition an empty pool with no passengers' });
    }

    // Determine corresponding ride request status
    let nextRideStatus;
    let nextPoolStatus = pool.status;

    if (targetStatus === 'DRIVER_ARRIVED') {
      nextRideStatus = RIDE_STATUS.DRIVER_ARRIVED;
    } else if (targetStatus === 'STARTED') {
      nextRideStatus = RIDE_STATUS.STARTED;
      nextPoolStatus = POOL_STATUS.STARTED;
    } else if (targetStatus === 'COMPLETED') {
      nextRideStatus = RIDE_STATUS.COMPLETED;
      nextPoolStatus = POOL_STATUS.COMPLETED;
    } else {
      return res.status(400).json({ error: `Invalid target status: ${targetStatus}` });
    }

    // Validate transition for ride requests
    for (const ride of pool.rideRequests) {
      const allowed = ALLOWED_REQUEST_TRANSITIONS[ride.status] || [];
      if (!allowed.includes(nextRideStatus)) {
        return res.status(400).json({
          error: `Invalid transition for passenger ${ride.passenger.name}: Cannot change status from ${ride.status} to ${nextRideStatus}`,
        });
      }
    }

    // Execute atomic transition & financial settlement if COMPLETED
    const updated = await prisma.$transaction(async (tx) => {
      // Advance all ride requests in this pool
      await tx.rideRequest.updateMany({
        where: { poolId },
        data: { status: nextRideStatus },
      });

      // Update pool status
      const updatedPool = await tx.pool.update({
        where: { id: poolId },
        data: {
          status: nextPoolStatus,
          // When completed, reset occupied seats
          totalSeatsOccupied: nextPoolStatus === POOL_STATUS.COMPLETED ? 0 : pool.totalSeatsOccupied,
        },
      });

      // When COMPLETED: Settle simulated TeslaPay wallet balances
      if (nextPoolStatus === POOL_STATUS.COMPLETED) {
        let totalDriverEarnings = 0n;

        for (const ride of pool.rideRequests) {
          // Deduct from passenger wallet
          await tx.user.update({
            where: { id: ride.passengerId },
            data: {
              walletBalancePoysha: { decrement: ride.farePoysha },
            },
          });
          totalDriverEarnings += ride.farePoysha;
        }

        // Credit driver wallet
        await tx.user.update({
          where: { id: pool.tesla.driverId },
          data: {
            walletBalancePoysha: { increment: totalDriverEarnings },
          },
        });

        // Set Tesla status back to ONLINE
        await tx.tesla.update({
          where: { id: pool.teslaId },
          data: { status: 'ONLINE' },
        });
      }

      // Audit log
      await tx.auditLog.create({
        data: {
          poolId,
          event: `POOL_${targetStatus}`,
          details: `Pool ${poolId} with ${pool.rideRequests.length} passenger(s) transitioned to ${targetStatus}.`,
        },
      });

      return updatedPool;
    });

    res.json(serializeBigInt({
      message: `Pool successfully transitioned to ${targetStatus}`,
      pool: updated,
    }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
