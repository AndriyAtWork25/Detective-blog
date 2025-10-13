// src/routes/auth.js
import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerificationEmail,
  refreshToken,
  logoutUser
} from "../controllers/authControllers.js";
import {
  validateRegister,
  validateLogin,
} from "../validators/authValidators.js";

const router = express.Router();

// ---------------- REGISTER ----------------
router.post("/register", validateRegister, registerUser);

// ---------------- LOGIN ----------------
router.post("/login", validateLogin, loginUser);

// ---------------- VERIFY EMAIL ----------------
router.get("/verify-email", verifyEmail);

// ---------------- RESEND VERIFICATION EMAIL ----------------
router.post("/resend-verification", resendVerificationEmail); 

// ---------------- REFRESH TOKEN ----------------
router.post("/refresh-token", refreshToken);

// ---------------- LOGOUT ----------------
router.post("/logout", logoutUser);


export default router;
