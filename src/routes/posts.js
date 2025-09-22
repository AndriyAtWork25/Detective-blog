// src/routes/posts.js
import express from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postsController.js"; // назва контролера має бути точно як файл
import { authMiddleware } from "../middleware/authMiddleware.js"; // named export

const router = express.Router();

// Public routes
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// Protected routes
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;
