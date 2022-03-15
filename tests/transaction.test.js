const request = require("supertest");

const { v4: uuidv4 } = require("uuid");

const app = require("../app");

describe("GET /expenses", () => {
  describe("positive tests", () => {
    test("should respond with status 200", async () => {
      await request(app).get("/expenses").expect(200);
    });

    test("should respond with json type", async () => {
      await request(app).get("/expenses").expect("Content-Type", /json/);
    });

    test("should respond with 0 expenses", async () => {
      const res = await request(app).get("/expenses");

      expect(res.body.length).toBe(0);
    });
  });
});

describe("GET /incomes", () => {
  describe("positive tests", () => {
    test("should respond with status 200", async () => {
      await request(app).get("/incomes").expect(200);
    });

    test("should respond with json type", async () => {
      await request(app).get("/incomes").expect("Content-Type", /json/);
    });

    test("should respond with 0 expenses", async () => {
      const res = await request(app).get("/incomes");

      expect(res.body.length).toBe(0);
    });
  });
});

describe("GET /transfers", () => {
  describe("positive tests", () => {
    test("should respond with status 200", async () => {
      await request(app).get("/transfers").expect(200);
    });

    test("should respond with json type", async () => {
      await request(app).get("/transfers").expect("Content-Type", /json/);
    });

    test("should respond with 0 expenses", async () => {
      const res = await request(app).get("/transfers");

      expect(res.body.length).toBe(0);
    });
  });
});
