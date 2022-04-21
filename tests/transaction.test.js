const request = require("supertest");
const db = require("../db/models");

const app = require("../app");

describe("GET /expenses", () => {
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
        .get("/expenses")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });

    test("should respond with json type", async () => {
      await request(app)
        .get("/expenses")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/);
    });
  });
});

describe("GET /incomes", () => {
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
        .get("/incomes")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });

    test("should respond with json type", async () => {
      await request(app)
        .get("/incomes")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/);
    });
  });
});

describe("GET /transfers", () => {
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
        .get("/transfers")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });

    test("should respond with json type", async () => {
      await request(app)
        .get("/transfers")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/);
    });
  });
});

describe("POST /expense", () => {
  let token, userId;
  beforeAll(async () => {
    const res = await request(app).post("/login").send({
      Email: "unique@user.com",
      Password: "1234567",
    });
    token = res.body.token;
    userId = res.body.user.id;
  });

  describe("positive tests", () => {
    const req = {
      Amount: 10,
      Date: new Date(),
      From: "Visa",
      To: "Food",
    };

    test("should respond with status 201, expense body", async () => {
      const res = await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("expense");
    });

    test("should increase expenses length", async () => {
      const before = await request(app)
        .get("/expenses")
        .set("Authorization", `Bearer ${token}`);

      await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const after = await request(app)
        .get("/expenses")
        .set("Authorization", `Bearer ${token}`);

      expect(after.body.length).toBe(before.body.length + 1);
    });

    test("should update total and expenses Balance", async () => {
      const before = await request(app)
        .get("/balances")
        .set("Authorization", `Bearer ${token}`);

      await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const after = await request(app)
        .get("/balances")
        .set("Authorization", `Bearer ${token}`);

      expect(after.body.total).toBe(before.body.total - req.Amount);
      expect(after.body.expenses).toBe(before.body.expenses + req.Amount);
    });

    test("should update Account balance", async () => {
      const before = await db.account.findOne({
        where: { userId: userId, name: req.From },
      });

      await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const after = await db.account.findOne({
        where: { userId: userId, name: req.From },
      });

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance - req.Amount
      );
    });

    test("should update Category balance", async () => {
      const before = await db.category.findOne({
        where: { userId: userId, name: req.To },
      });

      await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const after = await db.category.findOne({
        where: { userId: userId, name: req.To },
      });

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance + req.Amount
      );
    });
  });

  describe("negative tests", () => {
    test("should respond with status 422 - input is empty string", async () => {
      const res = await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Amount: 10,
          Date: new Date(),
          From: "",
          To: "Food",
        });

      expect(res.statusCode).toEqual(422);
    });

    test("should respond with status 422 - input is missing", async () => {
      const res = await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Amount: 10,
          Date: new Date(),
          From: "Visa",
        });

      expect(res.statusCode).toEqual(422);
    });
  });
});

describe("POST /income", () => {
  let token, userId;
  beforeAll(async () => {
    const res = await request(app).post("/login").send({
      Email: "unique@user.com",
      Password: "1234567",
    });
    token = res.body.token;
    userId = res.body.user.id;
  });

  describe("positive tests", () => {
    const req = {
      Amount: 100,
      Date: new Date(),
      From: "Salary",
      To: "Bank",
    };

    test("should respond with status 201, income body", async () => {
      const res = await request(app)
        .post("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(req);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("income");
    });

    test("should increase incomes length", async () => {
      const before = await request(app)
        .get("/incomes")
        .set("Authorization", `Bearer ${token}`);

      await request(app)
        .post("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const after = await request(app)
        .get("/incomes")
        .set("Authorization", `Bearer ${token}`);

      expect(after.body.length).toBe(before.body.length + 1);
    });

    test("should update total and income Balance", async () => {
      const before = await request(app)
        .get("/balances")
        .set("Authorization", `Bearer ${token}`);

      await request(app)
        .post("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const after = await request(app)
        .get("/balances")
        .set("Authorization", `Bearer ${token}`);

      expect(after.body.total).toBe(before.body.total + req.Amount);
      expect(after.body.income).toBe(before.body.income + req.Amount);
    });

    test("should update Account balance", async () => {
      const before = await db.account.findOne({
        where: { userId: userId, name: req.To },
      });

      await request(app)
        .post("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const after = await db.account.findOne({
        where: { userId: userId, name: req.To },
      });

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance + req.Amount
      );
    });
  });

  describe("negative tests", () => {
    test("should respond with status 422 - input is empty string", async () => {
      const res = await request(app)
        .post("/income")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Amount: "",
          Date: new Date(),
          From: "Salary",
          To: "Bank",
        });

      expect(res.statusCode).toEqual(422);
    });

    test("should respond with status 422 - input is missing", async () => {
      const res = await request(app)
        .post("/income")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Amount: 100,
          Date: new Date(),
          To: "Bank",
        });

      expect(res.statusCode).toEqual(422);
    });
  });
});

describe("POST /transfer", () => {
  let token, userId;
  beforeAll(async () => {
    const res = await request(app).post("/login").send({
      Email: "unique@user.com",
      Password: "1234567",
    });
    token = res.body.token;
    userId = res.body.user.id;
  });

  describe("positive tests", () => {
    const req = {
      Amount: 100,
      Date: new Date(),
      From: "Bank",
      To: "Visa",
    };

    test("should respond with status 201, transfer body", async () => {
      const res = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("transfer");
    });

    test("should increase transfers length", async () => {
      const before = await request(app)
        .get("/transfers")
        .set("Authorization", `Bearer ${token}`);

      await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const after = await request(app)
        .get("/transfers")
        .set("Authorization", `Bearer ${token}`);

      expect(after.body.length).toBe(before.body.length + 1);
    });

    test("should update AccountFrom balance", async () => {
      const before = await db.account.findOne({
        where: { userId: userId, name: req.From },
      });

      await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const after = await db.account.findOne({
        where: { userId: userId, name: req.From },
      });

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance - req.Amount
      );
    });

    test("should update AccountTo balance", async () => {
      const before = await db.account.findOne({
        where: { userId: userId, name: req.To },
      });

      await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const after = await db.account.findOne({
        where: { userId: userId, name: req.To },
      });

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance + req.Amount
      );
    });
  });

  describe("negative tests", () => {
    test("should respond with status 422 - input is empty string", async () => {
      const res = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Amount: 100,
          Date: "",
          From: "Bank",
          To: "Visa",
        });

      expect(res.statusCode).toEqual(422);
    });

    test("should respond with status 422 - input is missing", async () => {
      const res = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send({
          Date: new Date(),
          From: "Bank",
          To: "Visa",
        });

      expect(res.statusCode).toEqual(422);
    });
  });
});

describe("DELETE /expense", () => {
  const req = {
    Amount: 10,
    Date: new Date(),
    From: "Visa",
    To: "Food",
  };
  let token, userId;
  beforeAll(async () => {
    const res = await request(app).post("/login").send({
      Email: "unique@user.com",
      Password: "1234567",
    });
    token = res.body.token;
    userId = res.body.user.id;
  });

  describe("positive tests", () => {
    test("should respond with status 204", async () => {
      const expense = await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const res = await request(app)
        .delete("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(expense.body.expense);

      expect(res.statusCode).toEqual(204);
    });

    test("should decrease expenses length", async () => {
      const expense = await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const before = await request(app)
        .get("/expenses")
        .set("Authorization", `Bearer ${token}`);

      await request(app)
        .delete("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(expense.body.expense);

      const after = await request(app)
        .get("/expenses")
        .set("Authorization", `Bearer ${token}`);

      expect(after.body.length).toBe(before.body.length - 1);
    });

    test("should update total and expenses Balance", async () => {
      const expense = await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const before = await request(app)
        .get("/balances")
        .set("Authorization", `Bearer ${token}`);

      await request(app)
        .delete("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(expense.body.expense);

      const after = await request(app)
        .get("/balances")
        .set("Authorization", `Bearer ${token}`);

      expect(after.body.total).toBe(
        before.body.total + expense.body.expense.amount
      );
      expect(after.body.expenses).toBe(
        before.body.expenses - expense.body.expense.amount
      );
    });

    test("should update Account balance", async () => {
      const expense = await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const before = await db.account.findOne({
        where: { userId: userId, name: req.From },
      });

      await request(app)
        .delete("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(expense.body.expense);

      const after = await db.account.findOne({
        where: { userId: userId, name: req.From },
      });

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance + req.Amount
      );
    });

    test("should update Category balance", async () => {
      const expense = await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const before = await db.category.findOne({
        where: { userId: userId, name: req.To },
      });

      await request(app)
        .delete("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(expense.body.expense);

      const after = await db.category.findOne({
        where: { userId: userId, name: req.To },
      });

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance - req.Amount
      );
    });
  });

  describe("negative tests", () => {
    test("should fail to find the expense by id", async () => {
      const expense = await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      await request(app)
        .delete("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(expense.body.expense);

      const res = await db.expense.findByPk(expense.body.expense.id);

      expect(res).toBeNull();
    });
  });
});

describe("DELETE /income", () => {
  const req = {
    Amount: 100,
    Date: new Date(),
    From: "Salary",
    To: "Bank",
  };

  let token, userId;
  beforeAll(async () => {
    const res = await request(app).post("/login").send({
      Email: "unique@user.com",
      Password: "1234567",
    });
    token = res.body.token;
    userId = res.body.user.id;
  });

  describe("positive tests", () => {
    test("should respond with status 204", async () => {
      const income = await request(app)
        .post("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const res = await request(app)
        .delete("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(income.body.income);

      expect(res.statusCode).toEqual(204);
    });

    test("should decrease incomes length", async () => {
      const income = await request(app)
        .post("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const before = await request(app)
        .get("/incomes")
        .set("Authorization", `Bearer ${token}`);

      await request(app)
        .delete("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(income.body.income);

      const after = await request(app)
        .get("/incomes")
        .set("Authorization", `Bearer ${token}`);

      expect(after.body.length).toBe(before.body.length - 1);
    });

    test("should update total and income Balance", async () => {
      const income = await request(app)
        .post("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const before = await request(app)
        .get("/balances")
        .set("Authorization", `Bearer ${token}`);

      await request(app)
        .delete("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(income.body.income);

      const after = await request(app)
        .get("/balances")
        .set("Authorization", `Bearer ${token}`);

      expect(after.body.total).toBe(
        before.body.total - income.body.income.amount
      );
      expect(after.body.income).toBe(
        before.body.income - income.body.income.amount
      );
    });

    test("should update Account balance", async () => {
      const income = await request(app)
        .post("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const before = await db.account.findOne({
        where: { userId: userId, name: req.To },
      });

      await request(app)
        .delete("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(income.body.income);

      const after = await db.account.findOne({
        where: { userId: userId, name: req.To },
      });

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance - req.Amount
      );
    });
  });

  describe("negative tests", () => {
    test("should fail to find the income by id", async () => {
      const income = await request(app)
        .post("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      await request(app)
        .delete("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(income.body.income);

      const res = await db.income.findByPk(income.body.income.id);

      expect(res).toBeNull();
    });
  });
});

describe("DELETE /transfer", () => {
  const req = {
    Amount: 100,
    Date: new Date(),
    From: "Bank",
    To: "Visa",
  };

  let token, userId;
  beforeAll(async () => {
    const res = await request(app).post("/login").send({
      Email: "unique@user.com",
      Password: "1234567",
    });
    token = res.body.token;
    userId = res.body.user.id;
  });

  describe("positive tests", () => {
    test("should respond with status 204", async () => {
      const transfer = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const res = await request(app)
        .delete("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(transfer.body.transfer);

      expect(res.statusCode).toEqual(204);
    });

    test("should decrease transfers length", async () => {
      const transfer = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const before = await request(app)
        .get("/transfers")
        .set("Authorization", `Bearer ${token}`);

      await request(app)
        .delete("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(transfer.body.transfer);

      const after = await request(app)
        .get("/transfers")
        .set("Authorization", `Bearer ${token}`);

      expect(after.body.length).toBe(before.body.length - 1);
    });

    test("should update AccountFrom balance", async () => {
      const transfer = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const before = await db.account.findOne({
        where: { userId: userId, name: req.From },
      });

      await request(app)
        .delete("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(transfer.body.transfer);

      const after = await db.account.findOne({
        where: { userId: userId, name: req.From },
      });

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance + req.Amount
      );
    });

    test("should update AccountTo balance", async () => {
      const transfer = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      const before = await db.account.findOne({
        where: { userId: userId, name: req.To },
      });

      await request(app)
        .delete("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(transfer.body.transfer);

      const after = await db.account.findOne({
        where: { userId: userId, name: req.To },
      });

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance - req.Amount
      );
    });
  });

  describe("negative tests", () => {
    test("should fail to find the transfer by id", async () => {
      const transfer = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(req);

      await request(app)
        .delete("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(transfer.body.transfer);

      const res = await db.transfer.findByPk(transfer.body.transfer.id);

      expect(res).toBeNull();
    });
  });
});
