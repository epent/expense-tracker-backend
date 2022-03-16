const request = require("supertest");

const app = require("../app");

describe("GET /balances", () => {
  describe("positive tests", () => {
    test("should respond with status 200", async () => {
      await request(app).get("/balances").expect(200);
    });

    test("should respond with json type", async () => {
      await request(app).get("/balances").expect("Content-Type", /json/);
    });

    test("should respond with 0 balances", async () => {
      const res = await request(app).get("/balances");
      console.log(res.body);

      expect(res.body.length).toBe(1);
    });
  });
});
