// src/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
 const uri = process.env.MONGO_URI;

    if (!uri) {
        throw new Error("MONGO_URI is not defined. Add it to your .env file.");
    }
    
    try {
        mongoose.set("strictQuery", true);

        await mongoose.connect(uri);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error;
    }
};

export default connectDB;