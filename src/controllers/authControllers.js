import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Register a new user
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
    });

    // Generate JWT with _id
    const token = jwt.sign(
      { _id: newUser._id, email: newUser.email }, // <-- тут _id
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return token and _id
    res.status(201).json({ token, userId: newUser._id });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login user
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

    // Generate JWT with _id
    const token = jwt.sign(
      { _id: user._id, email: user.email }, // <-- тут _id
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

