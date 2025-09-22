// tests/auth.test.js
// у tests/post.test.js і tests/auth.test.js на початку файлу
process.env.JWT_SECRET = "supersecretkey123";

import { jest } from "@jest/globals";

jest.setTimeout(20000);


import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

beforeAll(async () => {
  // start in-memory mongo and connect mongoose
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  // cleanup: drop DB, close mongoose and stop in-memory mongo
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Auth Endpoints", () => {

  it("should successfully register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "Test User",
        email: "testuser@example.com",
        password: "123456"
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token"); // expecting JWT token in response
  });

  it("should login a user with correct credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@example.com",
        password: "123456"
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token"); // JWT returned on login
  });

});
