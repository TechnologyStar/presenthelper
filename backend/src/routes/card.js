import express from 'express';
import { getMyCards, getCardSets, getCheckInStatus, checkIn, getCheckInHistory } from '../controllers/cardController.js';
import { authenticate } from '../middlewares/auth.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// 集卡相关
router.get('/my-cards', authenticate, getMyCards);
router.get('/card-sets', authenticate, getCardSets);

// 签到相关
router.get('/checkin/status', authenticate, getCheckInStatus);
router.post('/checkin', authenticate, apiLimiter, checkIn);
router.get('/checkin/history', authenticate, getCheckInHistory);

export default router;
