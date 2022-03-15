const request = require("supertest");
const db = require("../db/models");

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

describe("POST /expense", () => {
  describe("positive tests", () => {
    test("should respond with status 201, expense body", async () => {
      const res = await request(app).post("/expense").send({
        Amount: 10,
        Date: new Date(),
        From: "Visa",
        To: "Food",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("expense");
    });

    test("should increase expenses length", async () => {
      const before = await request(app).get("/expenses");

      await request(app).post("/expense").send({
        Amount: 10,
        Date: new Date(),
        From: "Visa",
        To: "Food",
      });

      const after = await request(app).get("/expenses");

      expect(after.body.length).toBe(before.body.length + 1);
    });

    test("should update total and expenses Balance", async () => {
      const before = await request(app).get("/balances");

      const req = {
        Amount: 10,
        Date: new Date(),
        From: "Visa",
        To: "Food",
      };

      await request(app).post("/expense").send(req);

      const after = await request(app).get("/balances");

      expect(after.body.total).toBe(before.body.total - req.Amount);
      expect(after.body.expenses).toBe(before.body.expenses + req.Amount);
    });

    test("should update Account balance", async () => {
      const req = {
        Amount: 10,
        Date: new Date(),
        From: "Visa",
        To: "Food",
      };
      const before = await db.account.findByPk(req.From);

      await request(app).post("/expense").send(req);

      const after = await db.account.findByPk(req.From);

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance - req.Amount
      );
    });

    test("should update Category balance", async () => {
      const req = {
        Amount: 10,
        Date: new Date(),
        From: "Visa",
        To: "Food",
      };
      const before = await db.category.findByPk(req.To);

      await request(app).post("/expense").send(req);

      const after = await db.category.findByPk(req.To);

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance + req.Amount
      );
    });
  });

  describe("negative tests", () => {
    test("should respond with status 422 - input is empty string", async () => {
      const res = await request(app).post("/expense").send({
        Amount: 10,
        Date: new Date(),
        From: "",
        To: "Food",
      });

      expect(res.statusCode).toEqual(422);
    });

    test("should respond with status 422 - input is missing", async () => {
      const res = await request(app).post("/expense").send({
        Amount: 10,
        Date: new Date(),
        From: "Visa",
      });

      expect(res.statusCode).toEqual(422);
    });
  });
});

describe("POST /income", () => {
  describe("positive tests", () => {
    test("should respond with status 201, income body", async () => {
      const res = await request(app).post("/income").send({
        Amount: 100,
        Date: new Date(),
        From: "Salary",
        To: "Bank",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("income");
    });

    test("should increase incomes length", async () => {
      const before = await request(app).get("/incomes");

      await request(app).post("/income").send({
        Amount: 100,
        Date: new Date(),
        From: "Salary",
        To: "Bank",
      });

      const after = await request(app).get("/incomes");

      expect(after.body.length).toBe(before.body.length + 1);
    });

    test("should update total and income Balance", async () => {
      const before = await request(app).get("/balances");

      const req = {
        Amount: 100,
        Date: new Date(),
        From: "Salary",
        To: "Bank",
      };

      await request(app).post("/income").send(req);

      const after = await request(app).get("/balances");

      expect(after.body.total).toBe(before.body.total + req.Amount);
      expect(after.body.income).toBe(before.body.income + req.Amount);
    });

    test("should update Account balance", async () => {
      const req = {
        Amount: 100,
        Date: new Date(),
        From: "Salary",
        To: "Bank",
      };
      const before = await db.account.findByPk(req.To);

      await request(app).post("/income").send(req);

      const after = await db.account.findByPk(req.To);

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance + req.Amount
      );
    });
  });

  describe("negative tests", () => {
    test("should respond with status 422 - input is empty string", async () => {
      const res = await request(app).post("/income").send({
        Amount: "",
        Date: new Date(),
        From: "Salary",
        To: "Bank",
      });

      expect(res.statusCode).toEqual(422);
    });

    test("should respond with status 422 - input is missing", async () => {
      const res = await request(app).post("/income").send({
        Amount: 100,
        Date: new Date(),
        To: "Bank",
      });

      expect(res.statusCode).toEqual(422);
    });
  });
});
