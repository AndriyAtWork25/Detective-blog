// src/middleware/rateLimiter.js
import rateLimit from "express-rate-limit";

// limit for auth routes (login, register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 tries
  message: {
    success: false,
    message: "Too many attempts, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
