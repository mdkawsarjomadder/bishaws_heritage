import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// All origins allow করতে CORS মিডলওয়্যার
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Users API
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