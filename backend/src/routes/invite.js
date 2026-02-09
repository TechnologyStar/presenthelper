import express from 'express';
import { getMyInvites } from '../controllers/inviteController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/my', authenticate, getMyInvites);

export default router;
