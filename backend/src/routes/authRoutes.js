import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dhaka_tesla_secret_key_2026';

// Helper to serialize BigInt
export function serializeBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
}

// GET /api/users: List all users for demo selection
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        tesla: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(serializeBigInt(users));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/login: Simple auth for story cast or switch user
router.post('/auth/login', async (req, res) => {
  const { userId, email } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: userId ? { id: userId } : { email },
      include: { tesla: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found in system' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: serializeBigInt(user),
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
