import rateLimit from 'express-rate-limit';
import { errorResponse, ERROR_CODES } from '../utils/response.js';

export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 10,
  message: errorResponse(ERROR_CODES.RATE_LIMIT_EXCEEDED, '操作过于频繁，请稍后再试'),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json(errorResponse(ERROR_CODES.RATE_LIMIT_EXCEEDED, '操作过于频繁，请稍后再试'));
  }
});

export const strictLimiter = rateLimit({
  windowMs: 60000,
  max: 5,
  message: errorResponse(ERROR_CODES.RATE_LIMIT_EXCEEDED, '操作过于频繁，请稍后再试'),
  handler: (req, res) => {
    res.status(429).json(errorResponse(ERROR_CODES.RATE_LIMIT_EXCEEDED, '操作过于频繁，请稍后再试'));
  }
});
