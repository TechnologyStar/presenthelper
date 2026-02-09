import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate, schemas } from '../middlewares/validator.js';
import { strictLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/register', strictLimiter, validate(schemas.register), register);
router.post('/login', strictLimiter, validate(schemas.login), login);
router.get('/profile', authenticate, getProfile);

export default router;
