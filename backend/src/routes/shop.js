import express from 'express';
import {
  getShopItems,
  redeemItem,
  getMyRedemptions
} from '../controllers/shopController.js';
import { authenticate } from '../middlewares/auth.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.get('/items', authenticate, getShopItems);
router.post('/redeem', authenticate, apiLimiter, redeemItem);
router.get('/my-redemptions', authenticate, getMyRedemptions);

export default router;
