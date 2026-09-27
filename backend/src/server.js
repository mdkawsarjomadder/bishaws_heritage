import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import demoRoutes from './routes/demoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Root & Health check
app.get('/', (req, res) => {
  res.json({
    app: 'Dhaka Tesla Pool API',
    tagline: 'Share a seat. Split the fare. Survive Dhaka traffic.',
    status: 'ONLINE',
    version: '1.0.0',
    story: '8:41 AM, Banani Road 11 - Jashim, Bullet, Nusrat, Rafiq, Shirin',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mount modular API routers
app.use('/api', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/demo', demoRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Explicitly bind to 0.0.0.0 for cross-environment compatibility
app.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ Dhaka Tesla Pool API running at http://0.0.0.0:${PORT}`);
  console.log(`🚗 Story cast ready: Driver Jashim (Bullet, 3 seats) and Passengers Nusrat, Rafiq, Shirin`);
});

export default app;