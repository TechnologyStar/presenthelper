import express from 'express';
import {
  getStories,
  getStoryDetail,
  markStoryRead
} from '../controllers/storyController.js';
import { authenticate } from '../middlewares/auth.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.get('/', authenticate, getStories);
router.get('/:id', authenticate, getStoryDetail);
router.post('/:id/read', authenticate, apiLimiter, markStoryRead);

export default router;
