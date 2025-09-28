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
import { validatePost } from "../validators/postValidators.js";

const router = express.Router();

// Public routes
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// Protected routes
router.post("/", authMiddleware, validatePost, createPost);
router.put("/:id", authMiddleware, validatePost, updatePost);
router.delete("/:id", authMiddleware, validatePost, deletePost);

export default router;
