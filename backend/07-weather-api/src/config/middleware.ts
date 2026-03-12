import { rateLimit } from 'express-rate-limit';

export const rateLimiter = rateLimit({
  limit: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
  standardHeaders: 'draft-6',
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
