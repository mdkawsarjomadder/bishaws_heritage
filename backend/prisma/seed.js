import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDatabase() {
  // Clear existing records
  await prisma.auditLog.deleteMany();
  await prisma.rideRequest.deleteMany();
  await prisma.pool.deleteMany();
  await prisma.tesla.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Driver: Jashim with vehicle Bullet (capacity 3)
  const jashim = await prisma.user.create({
    data: {
      name: 'Jashim',
      email: 'jashim@dhakatesla.com',
      role: 'DRIVER',
      walletBalancePoysha: 250000n, // 2500 BDT
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

  // 2. Create Passengers: Nusrat, Rafiq, Shirin
  const nusrat = await prisma.user.create({
    data: {
      name: 'Nusrat',
      email: 'nusrat@gmail.com',
      role: 'PASSENGER',
      walletBalancePoysha: 150000n, // 1500 BDT
    },
  });

  const rafiq = await prisma.user.create({
    data: {
      name: 'Rafiq',
      email: 'rafiq@gmail.com',
      role: 'PASSENGER',
      walletBalancePoysha: 120000n, // 1200 BDT
    },
  });

  const shirin = await prisma.user.create({
    data: {
      name: 'Shirin',
      email: 'shirin@gmail.com',
      role: 'PASSENGER',
      walletBalancePoysha: 100000n, // 1000 BDT
    },
  });

  // 3. Log initial audit entry
  await prisma.auditLog.create({
    data: {
      event: 'SYSTEM_SEEDED',
      details: '8:41 AM Banani Road 11 Rush Hour initialized: Driver Jashim (Bullet, 3 seats) and Passengers (Nusrat, Rafiq, Shirin)',
    },
  });

  console.log('✅ Seed completed successfully with Banani Rush-Hour cast:');
  console.log(`   - Driver: ${jashim.name} with ${jashim.tesla.modelName} (Cap: ${jashim.tesla.capacity})`);
  console.log(`   - Passengers: ${nusrat.name}, ${rafiq.name}, ${shirin.name}`);

  return { jashim, nusrat, rafiq, shirin };
}

seedDatabase()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });