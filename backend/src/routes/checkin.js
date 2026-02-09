import express from 'express';
import { getCheckInStatus, checkIn, getCheckInHistory } from '../controllers/cardController.js';
import { authenticate } from '../middlewares/auth.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.get('/status', authenticate, getCheckInStatus);
router.post('/', authenticate, apiLimiter, checkIn);
router.get('/history', authenticate, getCheckInHistory);

export default router;
