import { jest } from "@jest/globals";
jest.setTimeout(20000);

process.env.JWT_SECRET = "testsecret";

import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;
let token; // JWT token for authenticated requests
let postId; // store ID of created post

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Register test user
  await request(app).post("/api/auth/register").send({
    username: "Test User",
    email: "testuser@example.com",
    password: "123456",
  });

  // Login test user to get JWT
  const loginRes = await request(app).post("/api/auth/login").send({
    email: "testuser@example.com",
    password: "123456",
  });

  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Posts Endpoints (CRUD)", () => {
  it("should create a new post", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Post",
        content: "This is a test post",
      });

    // debug
    if (res.statusCode !== 201) {
      console.error("Create post failed:", res.body);
    }

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("title", "Test Post");
    expect(res.body).toHaveProperty("_id");

    postId = res.body._id;
  });

  it("should fetch all posts", async () => {
    const res = await request(app)
      .get("/api/posts")
      .set("Authorization", `Bearer ${token}`);

    if (res.statusCode !== 200) {
      console.error("Fetch all posts failed:", res.body);
    }

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should fetch a single post by ID", async () => {
    const res = await request(app)
      .get(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    if (res.statusCode !== 200) {
      console.error("Fetch single post failed:", res.body);
    }

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("title", "Test Post");
  });

  it("should update the post", async () => {
    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Post",
        content: "This post has been updated",
      });

    if (res.statusCode !== 200) {
      console.error("Update post failed:", res.body);
    }

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("title", "Updated Post");
  });

  it("should delete the post", async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    if (res.statusCode !== 200) {
      console.error("Delete post failed:", res.body);
    }

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message");
  });
});
