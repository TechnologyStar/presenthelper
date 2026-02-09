import express from 'express';
import authRoutes from './auth.js';
import linuxdoRoutes from './linuxdo.js';
import quizRoutes from './quiz.js';
import cardRoutes from './card.js';
import adminRoutes from './admin.js';
import checkinRoutes from './checkin.js';
import inviteRoutes from './invite.js';
import storyRoutes from './story.js';
import rankingRoutes from './ranking.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/linuxdo', linuxdoRoutes);
router.use('/quiz', quizRoutes);
router.use('/card', cardRoutes);
router.use('/admin', adminRoutes);
router.use('/checkin', checkinRoutes);
router.use('/invite', inviteRoutes);
router.use('/stories', storyRoutes);
router.use('/ranking', rankingRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
