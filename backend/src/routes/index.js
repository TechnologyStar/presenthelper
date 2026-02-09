import express from 'express';
import authRoutes from './auth.js';
import linuxdoRoutes from './linuxdo.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/linuxdo', linuxdoRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
