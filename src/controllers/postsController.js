// src/controllers/postController.js
import Post from "../models/Post.js";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const newPost = await Post.create({
      title,
      content,
      category,
      author: req.user._id, 
    });

    res.status(201).json({
      _id: newPost._id,
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      author: newPost.author,
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Error creating post", error });
  }
};

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username email");
    res.json(posts);
  } catch (error) {
    console.error("Get all posts error:", error);
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username email"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({ message: "Error fetching post", error });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.user._id },
      { title, content, category },
      { new: true }
    );

    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found or user not authorized" });

    res.json(post);
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ message: "Error updating post", error });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id, 
    });

    if (!post)
      return res
        .status(404)
        .json({ message: "Post not found or user not authorized" });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ message: "Error deleting post", error });
  }
};
