// src/models/Post.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            minlength: 3,
            maxlength: 100,
        },
        content: {
            type: String,
            required: [true, "Content is required"],
            minlength: 10,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true}
);

const Post = mongoose.model("Post", postSchema);

export default Post;

       
        
        