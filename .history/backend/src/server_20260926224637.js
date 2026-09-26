import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Dhaka Tesla Pool API' });
});

// Seeded Users list
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { tesla: true },
    });

    const serializedUsers = JSON.parse(
      JSON.stringify(users, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    res.json(serializedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`⚡ Driver & Passenger API running at http://localhost:${PORT}`);
});