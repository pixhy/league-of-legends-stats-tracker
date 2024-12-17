import request from "supertest";
import app from "../server.js";
import mongoose from "mongoose";
import mongooseConnect from "../mongooseConnect.js";

beforeAll(async () => {
  await mongoose.connect(mongooseConnect);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

// register
describe("POST /api/register", () => {
  test("should register a new user successfully", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({ username: "testUser", password: "testUser123" });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User registered successfully");
  });

  test("should return error for duplicate username", async () => {
    const response = await request(app)
      .post("/api/register")
      .send({ username: "testUser", password: "testUser123" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Username already exists");
  });
});

//* login
describe("POST /api/login", () => {
  test("should log in successfully", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ username: "testUser", password: "testUser123" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
  });

  test("should fail to log in", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ username: "testUser", password: "wrongPassword" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Wrong password or username");
  });
});

//? change password
describe("POST /api/login", () => {
  test("should change the password successfully", async () => {
    const response = await request(app).post("/api/change-password").send({
      username: "testUser",
      currentPassword: "testUser123",
      newPassword: "newPassword123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Password changed");
  });

  test("should fail to change password with user not found", async () => {
    const response = await request(app).post("/api/change-password").send({
      username: "tesUser",
      currentPassword: "testUser123",
      newPassword: "newPassword123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User not found");
  });

  test("should fail to change password with wrong password", async () => {
    const response = await request(app).post("/api/change-password").send({
      username: "testUser",
      currentPassword: "wrongPassword",
      newPassword: "newPassword123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Wrong password");
  });
});

//! delete
describe("DELETE /api/delete-profile", () => {
  test("should delete user profile", async () => {
    const response = await request(app)
      .delete("/api/delete-profile")
      .send({ username: "testUser" });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Profile deleted successfully");
  });

  test("should not found user profile", async () => {
    const response = await request(app)
      .delete("/api/delete-profile")
      .send({ username: "testUser" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User not found");
  });
});
