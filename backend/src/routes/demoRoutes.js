import express from 'express';
import { PrismaClient } from '@prisma/client';
import { seedDatabase } from '../../prisma/seed.js';
import { serializeBigInt } from './authRoutes.js';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/demo/reset: Reset system to 8:41 AM Banani Rush-Hour initial state
router.post('/reset', async (req, res) => {
  try {
    const cast = await seedDatabase();
    res.json(serializeBigInt({
      message: 'System successfully reset to 8:41 AM Banani Road 11 initial state.',
      cast,
    }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/demo/audit-logs: Audit logs explaining system history
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50,
    });
    res.json(serializeBigInt(logs));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
