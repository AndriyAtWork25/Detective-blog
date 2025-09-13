// src/app.js
import express from "express";
import morgan from "morgan"; 
import cors from "cors";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Middleware

app.use(express.json()); 
app.use(cors()); 
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "../public")));

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Routes

app.get("/health", (req,res) => {
    res.json({ok: true, message: "Blog API is healthy" });
});

// Connect routes
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

export default app;