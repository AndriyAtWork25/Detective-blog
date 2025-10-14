// src/models/User.js
import mongoose from "mongoose";

//Create User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },

  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false, // first time false
  },

  refreshTokens: {
  type: [String],
  default: [],
}

}, { timestamps: true });

// Export User model
const User = mongoose.model("User", userSchema);
export default User;
