// src/validators/authValidator.js
import { body, validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format errors as an object with field names as keys
    const extractedErrors = {};
    errors.array().forEach(err => {
      extractedErrors[err.param] = err.msg;
    });
    return res.status(400).json({ errors: extractedErrors });
  }
  next();
};

export const validateRegister = [
  body("username")
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
  body("email")
    .isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  handleValidationErrors
];

export const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors
];

