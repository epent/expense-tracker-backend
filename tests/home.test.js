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

    test("should respond with correct userId' ", async () => {
      const res = await request(app)
        .get("/balances")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.userId).toBe("b9698b4f-3d05-4b95-ba11-55814abe75d2");
    });
  });
});
