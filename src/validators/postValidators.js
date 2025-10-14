// src/validators/postValidator.js
import { body, validationResult } from "express-validator";

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = {};
    errors.array().forEach(err => {
      extractedErrors[err.param] = err.msg;
    });
    return res.status(400).json({ errors: extractedErrors });
  }
  next();
};

export const validatePost = [
  body("title")
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),
  body("content")
    .notEmpty().withMessage("Content is required")
    .isLength({ min: 5 }).withMessage("Content must be at least 5 characters"),
  handleValidationErrors
];
