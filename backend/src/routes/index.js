import express from 'express';
import authRoutes from './auth.js';

const router = express.Router();

router.use('/auth', authRoutes);

// 占位路由，后续实现
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
