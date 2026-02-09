import express from 'express';
import { getPointsRanking, getQuizRanking } from '../controllers/rankingController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/points', authenticate, getPointsRanking);
router.get('/quiz', authenticate, getQuizRanking);

export default router;
