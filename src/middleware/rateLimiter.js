// src/middleware/rateLimiter.js
import rateLimit from "express-rate-limit";

// Ліміт для логіну і реєстрації
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 хвилин
  max: 10, // максимум 10 спроб
  message: {
    success: false,
    message: "Too many attempts, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
