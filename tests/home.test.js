const request = require("supertest");

const app = require("../app");

describe("GET /balances", () => {
  let token;
  beforeAll(async () => {
    const res = await request(app).post("/login").send({
      Email: "unique@user.com",
      Password: "1234567",
    });
    token = res.body.token;
  });

  describe("positive tests", () => {
    test("should respond with status 200", async () => {
      await request(app)
        .get("/balances")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });

    test("should respond with json type", async () => {
      await request(app)
        .get("/balances")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/);
    });

    test("should respond with 1 balance entry with name 'total_balances' ", async () => {
      const res = await request(app)
        .get("/balances")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.name).toBe("total_balances");
    });
  });
});
