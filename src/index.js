// src/index.js
import dotenv from "dotenv";
dotenv.config();

console.log("✅ ENV loaded:", process.env.SENDGRID_API_KEY ? "Found" : "Missing");
console.log("SendGrid Key loaded:", process.env.SENDGRID_API_KEY ? "Yes ✅" : "No ❌");

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on: http://localhost:${PORT}`);
      console.log(`📚 Swagger docs available at: http://localhost:${PORT}/swagger`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
    process.exit(1); // Exit the process with failure
  });

