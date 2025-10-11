// src/controllers/authControllers.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendVerificationEmail } from "../emails/account.js";

// --------------------- REGISTER ---------------------
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    // Generate email verification token (короткий строк — 24 години)
    const emailToken = jwt.sign(
      { _id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Save token to DB
    newUser.verificationToken = emailToken;
    await newUser.save();

    // Send verification email (посилання з токеном)
    await sendVerificationEmail(newUser.email, emailToken);

    // Вітальний лист можна відправляти ПІСЛЯ верифікації (тому тимчасово закоментуємо)
    // await sendWelcomeEmail(newUser.email, newUser.username);

    // Не потрібно автоматично логінити користувача одразу після реєстрації
    // тому видаляємо частину з "token" при реєстрації
    res.status(201).json({
      message: "Registration successful. Please verify your email.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// --------------------- LOGIN ---------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid email or password" });

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    // Generate JWT for session
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

// --------------------- RESEND VERIFICATION EMAIL ---------------------
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Знайти користувача
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Якщо користувач вже верифікований
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    // Генеруємо новий токен верифікації
    const emailToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Зберігаємо токен у базі
    user.verificationToken = emailToken;
    await user.save();

    // Надсилаємо email
    await sendVerificationEmail(user.email, emailToken);

    res.status(200).json({ message: "Verification email resent successfully" });
  } catch (err) {
    console.error("Resend verification email error:", err);
    res.status(500).json({ message: "Error resending verification email" });
  }
};

// --------------------- VERIFY EMAIL ---------------------
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial; text-align: center; padding-top: 50px;">
            <h2 style="color: red;">❌ Missing verification token</h2>
            <p>Please check your email link again.</p>
          </body>
        </html>
      `);
    }

    // Перевіряємо токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Знаходимо користувача по _id
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial; text-align: center; padding-top: 50px;">
            <h2 style="color: red;">❌ User not found</h2>
            <p>The verification link might be invalid or expired.</p>
          </body>
        </html>
      `);
    }

    // Якщо вже підтверджений
    if (user.isVerified) {
      return res.status(200).send(`
        <html>
          <body style="font-family: Arial; text-align: center; padding-top: 50px;">
            <h2 style="color: green;">✅ Email already verified</h2>
            <p>You can now close this tab and log in to your account.</p>
          </body>
        </html>
      `);
    }

    // Підтверджуємо email
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Надсилаємо welcome email після верифікації
    await sendWelcomeEmail(user.email, user.username);

    // Відправляємо гарне підтвердження замість redirect
    res.status(200).send(`
      <html>
        <body style="font-family: Arial; text-align: center; padding-top: 50px; background: #f6f9fc;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h1 style="color: #28a745;">✅ Email Verified Successfully!</h1>
            <p style="font-size: 16px; color: #555;">Thank you, <strong>${user.username}</strong>.</p>
            <p style="font-size: 16px; color: #555;">Your email has been verified. You can now log in to your account.</p>
            <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; margin-top: 20px; padding: 12px 25px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
              Go to Login
            </a>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).send(`
      <html>
        <body style="font-family: Arial; text-align: center; padding-top: 50px;">
          <h2 style="color: red;">⚠️ Something went wrong</h2>
          <p>Please try again later.</p>
        </body>
      </html>
    `);
  }
};
