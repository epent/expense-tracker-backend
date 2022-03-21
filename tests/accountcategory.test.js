const request = require("supertest");

const { v4: uuidv4 } = require("uuid");

const app = require("../app");

describe("GET /accounts", () => {
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
        .get("/accounts")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });

    test("should respond with json type", async () => {
      await request(app)
        .get("/accounts")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/);
    });

    test("should respond with 4 accounts", async () => {
      const res = await request(app)
        .get("/accounts")
        .set("Authorization", `Bearer ${token}`);

      expect(res.body.length).toBe(4);
    });
  });
});

describe("GET /categories", () => {
  describe("positive tests", () => {
    test("should respond with status 200", async () => {
      await request(app).get("/categories").expect(200);
    });

    test("should respond with json type", async () => {
      await request(app).get("/categories").expect("Content-Type", /json/);
    });

    test("should respond with 2 categories", async () => {
      const res = await request(app).get("/categories");

      expect(res.body.length).toBe(2);
    });
  });
});

describe("POST /account", () => {
  let token;
  beforeAll(async () => {
    const res = await request(app).post("/login").send({
      Email: "unique@user.com",
      Password: "1234567",
    });
    token = res.body.token;
  });

  describe("positive tests", () => {
    test("should respond with status 201, account body", async () => {
      const res = await request(app)
        .post("/account")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Name: "New 1",
          Category: "Bank account",
          Balance: 100,
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("account");
    });

    test("should increase accounts length", async () => {
      const before = await request(app)
        .get("/accounts")
        .set("Authorization", `Bearer ${token}`);

      await request(app)
        .post("/account")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Name: "New 2",
          Category: "Bank account",
          Balance: 100,
        });

      const after = await request(app)
        .get("/accounts")
        .set("Authorization", `Bearer ${token}`);

      expect(after.body.length).toBe(before.body.length + 1);
    });

    test("should update total Balance", async () => {
      const before = await request(app)
        .get("/balances")
        .set("Authorization", `Bearer ${token}`);

      const req = {
        Name: "New account3",
        Category: "Bank account",
        Balance: 100,
      };

      await request(app)
        .post("/account")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const after = await request(app)
        .get("/balances")
        .set("Authorization", `Bearer ${token}`);

      expect(after.body.total).toBe(before.body.total + req.Balance);
    });
  });

  describe("negative tests", () => {
    test("should respond with status 422 - input is empty string", async () => {
      const res = await request(app)
        .post("/account")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Name: "New 3",
          Category: "",
          Balance: 100,
        });

      expect(res.statusCode).toEqual(422);
    });

    test("should respond with status 422 - input is missing", async () => {
      const res = await request(app)
        .post("/account")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Name: "New 4",
          Balance: 100,
        });

      expect(res.statusCode).toEqual(422);
    });
  });
});

describe("POST /category", () => {
  describe("positive tests", () => {
    test("should respond with status 201, category body", async () => {
      const res = await request(app).post("/category").send({
        Name: "New 1",
        Balance: 0,
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("category");
    });

    test("should increase categories length", async () => {
      const before = await request(app).get("/categories");

      await request(app).post("/category").send({
        Name: "New 2",
        Balance: 0,
      });

      const after = await request(app).get("/categories");

      expect(after.body.length).toBe(before.body.length + 1);
    });
  });

  describe("negative tests", () => {
    test("should respond with status 422 - input is empty string", async () => {
      const res = await request(app).post("/category").send({
        Name: "",
        Balance: 100,
      });

      expect(res.statusCode).toEqual(422);
    });

    test("should respond with status 422 - input is missing", async () => {
      const res = await request(app).post("/category").send({
        Name: "New 4",
      });

      expect(res.statusCode).toEqual(422);
    });
  });
});
