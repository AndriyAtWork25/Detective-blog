// src/app.js
import express from "express";
import morgan from "morgan"; 
import cors from "cors";
import postRoutes from "./routes/posts.js";
import authRoutes from "./routes/auth.js";
import path from "path";
import { fileURLToPath } from "url";
import { swaggerUi, swaggerSpec } from "./swagger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Middleware
app.use(express.json()); 
app.use(cors()); 
app.use(morgan("dev"));

// Swagger Docs - ставимо **першим**, щоб не перехоплювали інші middleware
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect routes
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, message: "Blog API is healthy" });
});

// Serve static frontend files **після всіх API та Swagger**
app.use(express.static(path.join(__dirname, "../public")));

// Root route for frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

export default app;
