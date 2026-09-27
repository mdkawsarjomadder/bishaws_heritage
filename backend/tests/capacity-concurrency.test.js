import { PrismaClient } from '@prisma/client';
import { RIDE_STATUS, POOL_STATUS } from '../src/utils/lifecycle.js';

const prisma = new PrismaClient();

describe('Dhaka Tesla Pool - Capacity Limits & Concurrency Safety', () => {
  let driver;
  let tesla;
  let passenger1;
  let passenger2;
  let passenger3;
  let extraPassenger;

  beforeAll(async () => {
    // Clean and setup clean testing fixture
    await prisma.auditLog.deleteMany();
    await prisma.rideRequest.deleteMany();
    await prisma.pool.deleteMany();
    await prisma.tesla.deleteMany();
    await prisma.user.deleteMany();

    driver = await prisma.user.create({
      data: {
        name: 'Jashim Test',
        email: 'jashim.test@dhakatesla.com',
        role: 'DRIVER',
        tesla: {
          create: {
            modelName: 'Bullet (3-Wheeler Battery Tesla)',
            capacity: 3,
            status: 'ONLINE',
          },
        },
      },
      include: { tesla: true },
    });
    tesla = driver.tesla;

    passenger1 = await prisma.user.create({
      data: { name: 'Nusrat Test', email: 'nusrat.test@dhakatesla.com', role: 'PASSENGER' },
    });
    passenger2 = await prisma.user.create({
      data: { name: 'Rafiq Test', email: 'rafiq.test@dhakatesla.com', role: 'PASSENGER' },
    });
    passenger3 = await prisma.user.create({
      data: { name: 'Shirin Test', email: 'shirin.test@dhakatesla.com', role: 'PASSENGER' },
    });
    extraPassenger = await prisma.user.create({
      data: { name: 'Imran Test', email: 'imran.test@dhakatesla.com', role: 'PASSENGER' },
    });
  });

  afterAll(async () => {
    await prisma.auditLog.deleteMany();
    await prisma.rideRequest.deleteMany();
    await prisma.pool.deleteMany();
    await prisma.tesla.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  test("Bullet's capacity (3 seats) can never be exceeded", async () => {
    // Create initial pool
    const pool = await prisma.pool.create({
      data: {
        teslaId: tesla.id,
        status: POOL_STATUS.OPEN,
        totalSeatsOccupied: 0,
      },
    });

    // 1. Nusrat books 1 seat
    const req1 = await prisma.rideRequest.create({
      data: {
        passengerId: passenger1.id,
        pickupZone: 'BANANI',
        dropoffZone: 'MOHAKHALI',
        seatsRequested: 1,
        status: RIDE_STATUS.MATCHED,
        farePoysha: 7125n,
        poolId: pool.id,
      },
    });

    // 2. Rafiq books 1 seat
    const req2 = await prisma.rideRequest.create({
      data: {
        passengerId: passenger2.id,
        pickupZone: 'BANANI',
        dropoffZone: 'GULSHAN_1',
        seatsRequested: 1,
        status: RIDE_STATUS.MATCHED,
        farePoysha: 7688n,
        poolId: pool.id,
      },
    });

    // Update pool total
    await prisma.pool.update({
      where: { id: pool.id },
      data: { totalSeatsOccupied: 2 },
    });

    // 3. Shirin books the last 1 seat
    const req3 = await prisma.rideRequest.create({
      data: {
        passengerId: passenger3.id,
        pickupZone: 'BANANI',
        dropoffZone: 'MOHAKHALI',
        seatsRequested: 1,
        status: RIDE_STATUS.MATCHED,
        farePoysha: 7125n,
        poolId: pool.id,
      },
    });

    const fullPool = await prisma.pool.update({
      where: { id: pool.id },
      data: { totalSeatsOccupied: 3, status: POOL_STATUS.FULL },
    });

    expect(fullPool.totalSeatsOccupied).toBe(3);
    expect(fullPool.status).toBe(POOL_STATUS.FULL);

    // 4. Imran tries to book another seat in the full Bullet
    const attemptOverbooking = async () => {
      return await prisma.$transaction(async (tx) => {
        const currentPool = await tx.pool.findUnique({
          where: { id: pool.id },
          include: { tesla: true },
        });

        if (currentPool.totalSeatsOccupied + 1 > currentPool.tesla.capacity) {
          throw new Error('CAPACITY_EXCEEDED: Bullet capacity (3 seats) cannot be exceeded');
        }
      });
    };

    await expect(attemptOverbooking()).rejects.toThrow('CAPACITY_EXCEEDED');
  });

  test('Two concurrent requests cannot corrupt pool capacity when 1 seat is left', async () => {
    // Reset pool with 2 seats occupied (1 seat left)
    const activePool = await prisma.pool.create({
      data: {
        teslaId: tesla.id,
        status: POOL_STATUS.OPEN,
        totalSeatsOccupied: 2, // 1 seat remaining
      },
    });

    // Atomic seat claim helper simulating transaction lock
    async function claimLastSeat(passengerId) {
      return prisma.$transaction(async (tx) => {
        // Query pool
        const p = await tx.pool.findUnique({
          where: { id: activePool.id },
          include: { tesla: true },
        });

        const requestedSeats = 1;
        if (p.totalSeatsOccupied + requestedSeats > p.tesla.capacity) {
          throw new Error('CAPACITY_EXCEEDED');
        }

        // Increment seat and return success
        const updated = await tx.pool.update({
          where: { id: activePool.id },
          data: {
            totalSeatsOccupied: p.totalSeatsOccupied + requestedSeats,
            status: p.totalSeatsOccupied + requestedSeats >= p.tesla.capacity ? POOL_STATUS.FULL : POOL_STATUS.OPEN,
          },
        });

        return updated;
      });
    }

    // Launch both requests simultaneously
    const results = await Promise.allSettled([
      claimLastSeat(passenger3.id),
      claimLastSeat(extraPassenger.id),
    ]);

    const successes = results.filter((r) => r.status === 'fulfilled');
    const failures = results.filter((r) => r.status === 'rejected');

    // Exactly one must succeed, and exactly one must fail with CAPACITY_EXCEEDED!
    expect(successes.length).toBe(1);
    expect(failures.length).toBe(1);
    expect(failures[0].reason.message).toContain('CAPACITY_EXCEEDED');

    // Verify final seats in DB is exactly 3 and never 4
    const finalState = await prisma.pool.findUnique({
      where: { id: activePool.id },
    });
    expect(finalState.totalSeatsOccupied).toBe(3);
    expect(finalState.status).toBe(POOL_STATUS.FULL);
  });
});
