import express from 'express';
import { PrismaClient } from '@prisma/client';
import { calculateFare } from '../utils/fare.js';
import { RIDE_STATUS, POOL_STATUS, canPassengerCancel } from '../utils/lifecycle.js';
import { serializeBigInt } from './authRoutes.js';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/rides/estimate: Calculate estimated fare preview
router.post('/estimate', (req, res) => {
  try {
    const { pickupZone, dropoffZone, seatsRequested = 1 } = req.body;
    if (!pickupZone || !dropoffZone) {
      return res.status(400).json({ error: 'pickupZone and dropoffZone are required' });
    }

    const soloEstimate = calculateFare({
      pickupZone,
      dropoffZone,
      seatsRequested: Number(seatsRequested),
      isPooled: false,
    });

    const pooledEstimate = calculateFare({
      pickupZone,
      dropoffZone,
      seatsRequested: Number(seatsRequested),
      isPooled: true,
    });

    res.json(serializeBigInt({
      distanceKm: soloEstimate.distanceKm,
      seatsRequested: Number(seatsRequested),
      solo: {
        baseFarePoysha: soloEstimate.baseFarePoysha,
        distanceChargePoysha: soloEstimate.distanceChargePoysha,
        finalFarePoysha: soloEstimate.finalFarePoysha,
        fareBDT: soloEstimate.finalFareBDT,
      },
      pooled: {
        baseFarePoysha: pooledEstimate.baseFarePoysha,
        distanceChargePoysha: pooledEstimate.distanceChargePoysha,
        poolDiscountPoysha: pooledEstimate.poolDiscountPoysha,
        finalFarePoysha: pooledEstimate.finalFarePoysha,
        fareBDT: pooledEstimate.finalFareBDT,
      },
    }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rides/request: Passenger requests a new ride
router.post('/request', async (req, res) => {
  try {
    const { passengerId, pickupZone, dropoffZone, seatsRequested = 1 } = req.body;

    if (!passengerId || !pickupZone || !dropoffZone) {
      return res.status(400).json({ error: 'passengerId, pickupZone, and dropoffZone are required' });
    }

    const seats = Number(seatsRequested);
    if (seats < 1 || seats > 3) {
      return res.status(400).json({ error: 'Seats requested must be between 1 and 3' });
    }

    // Verify passenger
    const passenger = await prisma.user.findUnique({
      where: { id: passengerId },
    });
    if (!passenger) {
      return res.status(404).json({ error: 'Passenger not found' });
    }

    // Check if passenger already has an active ride
    const existingActiveRide = await prisma.rideRequest.findFirst({
      where: {
        passengerId,
        status: {
          in: [
            RIDE_STATUS.REQUESTED,
            RIDE_STATUS.MATCHED,
            RIDE_STATUS.DRIVER_ARRIVED,
            RIDE_STATUS.STARTED,
          ],
        },
      },
    });

    if (existingActiveRide) {
      return res.status(400).json({
        error: 'You already have an active ride request in progress',
        activeRideId: existingActiveRide.id,
      });
    }

    // Calculate initial estimated solo fare in Poysha
    const fareDetails = calculateFare({
      pickupZone,
      dropoffZone,
      seatsRequested: seats,
      isPooled: false,
    });

    // Create RideRequest
    const newRequest = await prisma.rideRequest.create({
      data: {
        passengerId,
        pickupZone,
        dropoffZone,
        seatsRequested: seats,
        status: RIDE_STATUS.REQUESTED,
        farePoysha: fareDetails.finalFarePoysha,
      },
      include: {
        passenger: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        rideRequestId: newRequest.id,
        event: 'RIDE_REQUESTED',
        details: `${passenger.name} requested ride from ${pickupZone} to ${dropoffZone} (${seats} seat/s). Estimated solo fare: ৳${fareDetails.finalFareBDT}`,
      },
    });

    res.status(201).json(serializeBigInt({
      message: 'Ride requested successfully',
      ride: newRequest,
      fareBDT: fareDetails.finalFareBDT,
    }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/rides/passenger/:passengerId: Get passenger's active ride & history
router.get('/passenger/:passengerId', async (req, res) => {
  try {
    const { passengerId } = req.params;

    // Find active ride
    const activeRide = await prisma.rideRequest.findFirst({
      where: {
        passengerId,
        status: {
          in: [
            RIDE_STATUS.REQUESTED,
            RIDE_STATUS.MATCHED,
            RIDE_STATUS.DRIVER_ARRIVED,
            RIDE_STATUS.STARTED,
          ],
        },
      },
      include: {
        pool: {
          include: {
            tesla: {
              include: {
                driver: {
                  select: { id: true, name: true },
                },
              },
            },
          },
        },
      },
    });

    // Find past completed/cancelled rides
    const history = await prisma.rideRequest.findMany({
      where: {
        passengerId,
        status: {
          in: [RIDE_STATUS.COMPLETED, RIDE_STATUS.CANCELLED],
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Structure response: Passenger sees ONLY their own fare, seats, and vehicle status
    let activeRideView = null;
    if (activeRide) {
      activeRideView = {
        id: activeRide.id,
        pickupZone: activeRide.pickupZone,
        dropoffZone: activeRide.dropoffZone,
        seatsRequested: activeRide.seatsRequested,
        status: activeRide.status,
        farePoysha: activeRide.farePoysha,
        fareBDT: Number(activeRide.farePoysha) / 100,
        createdAt: activeRide.createdAt,
        poolId: activeRide.poolId,
        driver: activeRide.pool?.tesla?.driver?.name || null,
        vehicle: activeRide.pool?.tesla?.modelName || null,
        isPooled: !!activeRide.poolId,
      };
    }

    const historyView = history.map((item) => ({
      id: item.id,
      pickupZone: item.pickupZone,
      dropoffZone: item.dropoffZone,
      seatsRequested: item.seatsRequested,
      status: item.status,
      farePoysha: item.farePoysha,
      fareBDT: Number(item.farePoysha) / 100,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    res.json(serializeBigInt({
      activeRide: activeRideView,
      history: historyView,
    }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/rides/:id/cancel: Cancel ride request while valid
router.post('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const { passengerId } = req.body;

    const ride = await prisma.rideRequest.findUnique({
      where: { id },
      include: { pool: true },
    });

    if (!ride) {
      return res.status(404).json({ error: 'Ride request not found' });
    }

    // Ownership check: User cannot cancel someone else's ride
    if (passengerId && ride.passengerId !== passengerId) {
      return res.status(403).json({ error: 'Forbidden: You cannot modify another passenger\'s ride' });
    }

    // State machine check
    if (!canPassengerCancel(ride.status)) {
      return res.status(400).json({
        error: `Cancellation forbidden: Ride cannot be cancelled in state ${ride.status}. (Only allowed in REQUESTED or MATCHED)`,
      });
    }

    // Execute atomic cancellation
    await prisma.$transaction(async (tx) => {
      // If ride was matched in a pool, free up the seats
      if (ride.poolId && ride.pool) {
        const updatedSeats = Math.max(0, ride.pool.totalSeatsOccupied - ride.seatsRequested);
        await tx.pool.update({
          where: { id: ride.poolId },
          data: {
            totalSeatsOccupied: updatedSeats,
            // Re-open pool if it was full
            status: POOL_STATUS.OPEN,
          },
        });
      }

      // Mark request as CANCELLED
      await tx.rideRequest.update({
        where: { id },
        data: {
          status: RIDE_STATUS.CANCELLED,
          poolId: null,
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          rideRequestId: id,
          poolId: ride.poolId,
          event: 'RIDE_CANCELLED',
          details: `Ride ${id} cancelled by passenger. Freed ${ride.seatsRequested} seat/s.`,
        },
      });
    });

    res.json({ message: 'Ride successfully cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
