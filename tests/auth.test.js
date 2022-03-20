const request = require("supertest");

const app = require("../app");

describe("POST /signup", () => {
  describe("positive tests", () => {
    test("should respond with status 201, user body", async () => {
      const res = await request(app).post("/signup").send({
        FirstName: "Test",
        LastName: "Test",
        Email: "unique@mail.com",
        Password: "1234567",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("user");
    });
  });

  describe("negative tests", () => {
    test("should respond with status 422 - user exists", async () => {
      await request(app).post("/signup").send({
        FirstName: "Test",
        LastName: "Test",
        Email: "unique@mail.com",
        Password: "1234567",
      });

      const res = await request(app).post("/signup").send({
        FirstName: "Test",
        LastName: "Test",
        Email: "notunique@mail.com",
        Password: "1234567",
      });

      expect(res.statusCode).toEqual(422);
    });
  });
});
