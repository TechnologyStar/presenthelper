import express from 'express';
import { getDailyQuiz, submitAnswer, completeQuiz, getQuizHistory } from '../controllers/quizController.js';
import { authenticate } from '../middlewares/auth.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.get('/daily', authenticate, getDailyQuiz);
router.post('/submit', authenticate, apiLimiter, submitAnswer);
router.post('/complete', authenticate, apiLimiter, completeQuiz);
router.get('/history', authenticate, getQuizHistory);

export default router;
