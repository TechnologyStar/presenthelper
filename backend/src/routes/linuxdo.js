import express from 'express';
import { getAuthUrl, handleCallback } from '../controllers/linuxdoController.js';
import { strictLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.get('/auth-url', getAuthUrl);
router.post('/callback', strictLimiter, handleCallback);

export default router;
