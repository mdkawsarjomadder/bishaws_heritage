import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// CORS সেটআপ - সব অরিজিন এলাউ করা হয়েছে
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Test Health Route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', time: new Date() });
});

// Users List Route
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { tesla: true },
    });

    // BigInt serialization handle
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

// Explicitly listen on 0.0.0.0 to fix IPv6/IPv4 binding issues
app.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ Driver & Passenger API running at http://localhost:${PORT}`);
});