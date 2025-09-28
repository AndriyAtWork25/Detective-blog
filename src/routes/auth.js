// src/routes/auth.js
import express from "express";
import { registerUser, loginUser } from "../controllers/authControllers.js";
import { validateRegister, validateLogin } from "../validators/authValidators.js";

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);

export default router;
