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

describe("POST /transfer", () => {
  describe("positive tests", () => {
    test("should respond with status 201, transfer body", async () => {
      const res = await request(app).post("/transfer").send({
        Amount: 100,
        Date: new Date(),
        From: "Bank",
        To: "Visa",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("transfer");
    });

    test("should increase transfers length", async () => {
      const before = await request(app).get("/transfers");

      await request(app).post("/transfer").send({
        Amount: 100,
        Date: new Date(),
        From: "Bank",
        To: "Visa",
      });

      const after = await request(app).get("/transfers");

      expect(after.body.length).toBe(before.body.length + 1);
    });

    test("should update AccountFrom balance", async () => {
      const req = {
        Amount: 100,
        Date: new Date(),
        From: "Bank",
        To: "Visa",
      };
      const before = await db.account.findByPk(req.From);

      await request(app).post("/transfer").send(req);

      const after = await db.account.findByPk(req.From);

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance - req.Amount
      );
    });

    test("should update AccountTo balance", async () => {
      const req = {
        Amount: 100,
        Date: new Date(),
        From: "Bank",
        To: "Visa",
      };
      const before = await db.account.findByPk(req.To);

      await request(app).post("/transfer").send(req);

      const after = await db.account.findByPk(req.To);

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance + req.Amount
      );
    });
  });

  describe("negative tests", () => {
    test("should respond with status 422 - input is empty string", async () => {
      const res = await request(app).post("/transfer").send({
        Amount: 100,
        Date: "",
        From: "Bank",
        To: "Visa",
      });

      expect(res.statusCode).toEqual(422);
    });

    test("should respond with status 422 - input is missing", async () => {
      const res = await request(app).post("/transfer").send({
        Date: new Date(),
        From: "Bank",
        To: "Visa",
      });

      expect(res.statusCode).toEqual(422);
    });
  });
});

describe("DELETE /expense", () => {
  describe("positive tests", () => {
    test("should respond with status 204", async () => {
      const expense = await db.expense.create({
        amount: 10,
        date: new Date(),
        accountName: "Visa",
        categoryName: "Food",
      });

      const res = await request(app)
        .delete("/expense")
        .send(expense.dataValues);

      expect(res.statusCode).toEqual(204);
    });

    test("should update total and expenses Balance", async () => {
      const before = await request(app).get("/balances");

      const expense = await db.expense.create({
        amount: 10,
        date: new Date(),
        accountName: "Visa",
        categoryName: "Food",
      });

      await request(app).delete("/expense").send(expense.dataValues);

      const after = await request(app).get("/balances");

      expect(after.body.total).toBe(
        before.body.total + expense.dataValues.amount
      );
      expect(after.body.expenses).toBe(
        before.body.expenses - expense.dataValues.amount
      );
    });

    test("should update Account balance", async () => {
      const req = {
        amount: 10,
        date: new Date(),
        accountName: "Visa",
        categoryName: "Food",
      };
      const before = await db.account.findByPk(req.accountName);

      const expense = await db.expense.create(req);

      await request(app).delete("/expense").send(expense.dataValues);

      const after = await db.account.findByPk(req.accountName);

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance + req.amount
      );
    });

    test("should update Category balance", async () => {
      const req = {
        amount: 10,
        date: new Date(),
        accountName: "Visa",
        categoryName: "Food",
      };
      const before = await db.category.findByPk(req.categoryName);

      const expense = await db.expense.create(req);

      await request(app).delete("/expense").send(expense.dataValues);

      const after = await db.category.findByPk(req.categoryName);

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance - req.amount
      );
    });
  });

  describe("negative tests", () => {
    test("should fail to find the expense by id", async () => {
      const expense = await db.expense.create({
        amount: 10,
        date: new Date(),
        accountName: "Visa",
        categoryName: "Food",
      });

      await request(app).delete("/expense").send(expense.dataValues);

      const res = await db.expense.findByPk(expense.dataValues.id);

      expect(res).toBeNull();
    });
  });
});

describe("DELETE /income", () => {
  describe("positive tests", () => {
    test("should respond with status 204", async () => {
      const income = await db.income.create({
        amount: 100,
        date: new Date(),
        from: "Salary",
        accountName: "Bank",
      });

      const res = await request(app).delete("/income").send(income.dataValues);

      expect(res.statusCode).toEqual(204);
    });

    test("should update total and income Balance", async () => {
      const before = await request(app).get("/balances");

      const income = await db.income.create({
        amount: 100,
        date: new Date(),
        from: "Salary",
        accountName: "Bank",
      });

      await request(app).delete("/income").send(income.dataValues);

      const after = await request(app).get("/balances");

      expect(after.body.total).toBe(
        before.body.total - income.dataValues.amount
      );
      expect(after.body.income).toBe(
        before.body.income - income.dataValues.amount
      );
    });

    test("should update Account balance", async () => {
      const req = {
        amount: 100,
        date: new Date(),
        from: "Salary",
        accountName: "Bank",
      };
      const before = await db.account.findByPk(req.accountName);

      const income = await db.income.create(req);

      await request(app).delete("/income").send(income.dataValues);

      const after = await db.account.findByPk(req.accountName);

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance - req.amount
      );
    });
  });

  describe("negative tests", () => {
    test("should fail to find the income by id", async () => {
      const income = await db.income.create({
        amount: 100,
        date: new Date(),
        from: "Salary",
        accountName: "Bank",
      });

      await request(app).delete("/income").send(income.dataValues);

      const res = await db.income.findByPk(income.dataValues.id);

      expect(res).toBeNull();
    });
  });
});

describe("DELETE /transfer", () => {
  describe("positive tests", () => {
    test("should respond with status 204", async () => {
      const transfer = await db.transfer.create({
        amount: 100,
        date: new Date(),
        accountFromName: "Bank",
        accountToName: "Visa",
      });

      const res = await request(app)
        .delete("/transfer")
        .send(transfer.dataValues);

      expect(res.statusCode).toEqual(204);
    });

    test("should update AccountFrom balance", async () => {
      const req = {
        amount: 100,
        date: new Date(),
        accountFromName: "Bank",
        accountToName: "Visa",
      };

      const before = await db.account.findByPk(req.accountFromName);

      const transfer = await db.transfer.create(req);

      await request(app).delete("/transfer").send(transfer.dataValues);

      const after = await db.account.findByPk(req.accountFromName);

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance + req.amount
      );
    });

    test("should update AccountTo balance", async () => {
      const req = {
        amount: 100,
        date: new Date(),
        accountFromName: "Bank",
        accountToName: "Visa",
      };
      const before = await db.account.findByPk(req.accountToName);

      const transfer = await db.transfer.create(req);

      await request(app).delete("/transfer").send(transfer.dataValues);

      const after = await db.account.findByPk(req.accountToName);

      expect(after.dataValues.balance).toBe(
        before.dataValues.balance - req.amount
      );
    });
  });

  describe("negative tests", () => {
    test("should fail to find the transfer by id", async () => {
      const transfer = await db.transfer.create({
        amount: 100,
        date: new Date(),
        accountFromName: "Bank",
        accountToName: "Visa",
      });

      await request(app).delete("/transfer").send(transfer.dataValues);

      const res = await db.transfer.findByPk(transfer.dataValues.id);

      expect(res).toBeNull();
    });
  });
});
