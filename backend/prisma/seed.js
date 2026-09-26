import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.rideRequest.deleteMany();
  await prisma.pool.deleteMany();
  await prisma.tesla.deleteMany();
  await prisma.user.deleteMany();

  // Create Driver Jashim with Bullet
  await prisma.user.create({
    data: {
      name: 'Jashim',
      email: 'jashim@dhakatesla.com',
      role: 'DRIVER',
      tesla: {
        create: {
          modelName: 'Bullet (3-Wheeler Battery Tesla)',
          capacity: 3,
          status: 'ONLINE',
        },
      },
    },
  });

  // Create Passengers
  await prisma.user.createMany({
    data: [
      { name: 'Nusrat', email: 'nusrat@gmail.com', role: 'PASSENGER' },
      { name: 'Rafiq', email: 'rafiq@gmail.com', role: 'PASSENGER' },
      { name: 'Shirin', email: 'shirin@gmail.com', role: 'PASSENGER' },
    ],
  });

  console.log('✅ Seed completed with story cast: Jashim, Nusrat, Rafiq, Shirin');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });