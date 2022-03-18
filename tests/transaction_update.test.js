const request = require("supertest");
const db = require("../db/models");

const app = require("../app");

describe("PUT /expense", () => {
  describe("positive tests", () => {
    test("should respond with status 200", async () => {
      const oldExpense = await request(app).post("/expense").send({
        Amount: 10,
        Date: new Date(),
        From: "Visa",
        To: "Food",
      });

      const newExpense = {
        ...oldExpense.body.expense,
        amount: 100,
        from: "Bank",
        to: "Other",
      };

      const res = await request(app).put("/expense").send({
        old: oldExpense.body.expense,
        new: newExpense,
      });

      expect(res.statusCode).toEqual(200);
    });

    test("should update total and expenses Balance", async () => {
      const oldExpense = await request(app).post("/expense").send({
        Amount: 10,
        Date: new Date(),
        From: "Visa",
        To: "Food",
      });

      const before = await request(app).get("/balances");

      const newExpense = {
        ...oldExpense.body.expense,
        amount: 100,
        from: "Bank",
        to: "Other",
      };

      await request(app).put("/expense").send({
        old: oldExpense.body.expense,
        new: newExpense,
      });

      const after = await request(app).get("/balances");

      expect(after.body.total).toBe(
        before.body.total + (oldExpense.body.expense.amount - newExpense.amount)
      );
      expect(after.body.expenses).toBe(
        before.body.expenses +
          (newExpense.amount - oldExpense.body.expense.amount)
      );
    });

    test("should update Account balance", async () => {
      const oldForm = {
        Amount: 10,
        Date: new Date(),
        From: "Visa",
        To: "Food",
      };

      const newForm = {
        amount: 100,
        from: "Bank",
        to: "Other",
      };

      const oldExpense = await request(app).post("/expense").send(oldForm);

      const oldAccountBefore = await db.account.findByPk(oldForm.From);

      const newAccountBefore = await db.account.findByPk(newForm.from);

      const newExpense = {
        ...oldExpense.body.expense,
        ...newForm,
      };

      await request(app).put("/expense").send({
        old: oldExpense.body.expense,
        new: newExpense,
      });

      const oldAccountAfter = await db.account.findByPk(oldForm.From);

      const newAccountAfter = await db.account.findByPk(newForm.from);

      expect(oldAccountAfter.dataValues.balance).toBe(
        oldAccountBefore.dataValues.balance + oldForm.Amount
      );
      expect(newAccountAfter.dataValues.balance).toBe(
        newAccountBefore.dataValues.balance - newForm.amount
      );
    });

    test("should update Category balance", async () => {
      const oldForm = {
        Amount: 10,
        Date: new Date(),
        From: "Visa",
        To: "Food",
      };

      const newForm = {
        amount: 100,
        from: "Bank",
        to: "Other",
      };

      const oldExpense = await request(app).post("/expense").send(oldForm);

      const oldCategoryBefore = await db.category.findByPk(oldForm.To);

      const newCategoryBefore = await db.category.findByPk(newForm.to);

      const newExpense = {
        ...oldExpense.body.expense,
        ...newForm,
      };

      await request(app).put("/expense").send({
        old: oldExpense.body.expense,
        new: newExpense,
      });

      const oldCategoryAfter = await db.category.findByPk(oldForm.To);

      const newCategoryAfter = await db.category.findByPk(newForm.to);

      expect(oldCategoryAfter.dataValues.balance).toBe(
        oldCategoryBefore.dataValues.balance - oldForm.Amount
      );
      expect(newCategoryAfter.dataValues.balance).toBe(
        newCategoryBefore.dataValues.balance + newForm.amount
      );
    });

    test("should respond with updated expense transaction", async () => {
      const oldForm = {
        Amount: 10,
        Date: new Date(),
        From: "Visa",
        To: "Food",
      };

      const newForm = {
        amount: 100,
        from: "Bank",
        to: "Other",
      };

      const oldExpense = await request(app).post("/expense").send(oldForm);

      const newExpense = {
        ...oldExpense.body.expense,
        ...newForm,
      };

      await request(app).put("/expense").send({
        old: oldExpense.body.expense,
        new: newExpense,
      });

      const res = await db.expense.findByPk(oldExpense.body.expense.id);

      expect(res.dataValues.amount).toEqual(newForm.amount);
      expect(res.dataValues.accountName).toEqual(newForm.from);
      expect(res.dataValues.categoryName).toEqual(newForm.to);
    });
  });
});

describe("PUT /income", () => {
  describe("positive tests", () => {
    test("should respond with status 200", async () => {
      const oldForm = {
        Amount: 100,
        Date: new Date(),
        From: "Salary",
        To: "Bank",
      };

      const newForm = {
        amount: 500,
        to: "Visa",
      };

      const oldIncome = await request(app).post("/income").send(oldForm);

      const newIncome = {
        ...oldIncome.body.income,
        ...newForm,
      };

      const res = await request(app).put("/income").send({
        old: oldIncome.body.income,
        new: newIncome,
      });

      expect(res.statusCode).toEqual(200);
    });

    test("should update total and income Balance", async () => {
      const oldForm = {
        Amount: 100,
        Date: new Date(),
        From: "Salary",
        To: "Bank",
      };

      const newForm = {
        amount: 500,
        to: "Visa",
      };

      const oldIncome = await request(app).post("/income").send(oldForm);

      const before = await request(app).get("/balances");

      const newIncome = {
        ...oldIncome.body.income,
        ...newForm,
      };

      await request(app).put("/income").send({
        old: oldIncome.body.income,
        new: newIncome,
      });

      const after = await request(app).get("/balances");

      expect(after.body.total).toBe(
        before.body.total + (newIncome.amount - oldIncome.body.income.amount)
      );
      expect(after.body.income).toBe(
        before.body.income + (newIncome.amount - oldIncome.body.income.amount)
      );
    });

    test("should update Account balance", async () => {
      const oldForm = {
        Amount: 100,
        Date: new Date(),
        From: "Salary",
        To: "Bank",
      };

      const newForm = {
        amount: 500,
        to: "Visa",
      };

      const oldIncome = await request(app).post("/income").send(oldForm);

      const oldAccountBefore = await db.account.findByPk(oldForm.To);

      const newAccountBefore = await db.account.findByPk(newForm.to);

      const newIncome = {
        ...oldIncome.body.income,
        ...newForm,
      };

      await request(app).put("/income").send({
        old: oldIncome.body.income,
        new: newIncome,
      });

      const oldAccountAfter = await db.account.findByPk(oldForm.To);

      const newAccountAfter = await db.account.findByPk(newForm.to);

      expect(oldAccountAfter.dataValues.balance).toBe(
        oldAccountBefore.dataValues.balance - oldForm.Amount
      );
      expect(newAccountAfter.dataValues.balance).toBe(
        newAccountBefore.dataValues.balance + newForm.amount
      );
    });

    test("should respond with updated income transaction", async () => {
      const oldForm = {
        Amount: 100,
        Date: new Date(),
        From: "Salary",
        To: "Bank",
      };

      const newForm = {
        amount: 500,
        to: "Visa",
      };

      const oldIncome = await request(app).post("/income").send(oldForm);

      const newIncome = {
        ...oldIncome.body.income,
        ...newForm,
      };

      await request(app).put("/income").send({
        old: oldIncome.body.income,
        new: newIncome,
      });

      const res = await db.income.findByPk(oldIncome.body.income.id);

      expect(res.dataValues.amount).toEqual(newForm.amount);
      expect(res.dataValues.accountName).toEqual(newForm.to);
    });
  });
});

describe("PUT /transfer", () => {
  describe("positive tests", () => {
    test("should respond with status 200", async () => {
      const oldForm = {
        Amount: 100,
        Date: new Date(),
        From: "Bank",
        To: "Visa",
      };

      const newForm = {
        amount: 500,
        to: "Bank",
        from: "Visa",
      };

      const oldTransfer = await request(app).post("/transfer").send(oldForm);

      const newTransfer = {
        ...oldTransfer.body.transfer,
        ...newForm,
      };
      const res = await request(app).put("/transfer").send({
        old: oldTransfer.body.transfer,
        new: newTransfer,
      });

      expect(res.statusCode).toEqual(200);
    });

    test("should update AccountFrom balance", async () => {
      const oldForm = {
        Amount: 100,
        Date: new Date(),
        From: "Bank",
        To: "Visa",
      };

      const newForm = {
        amount: 500,
        from: "Cash",
        to: "Master card",
      };

      const oldTransfer = await request(app).post("/transfer").send(oldForm);

      const oldAccountBefore = await db.account.findByPk(oldForm.From);

      const newAccountBefore = await db.account.findByPk(newForm.from);

      const newTransfer = {
        ...oldTransfer.body.transfer,
        ...newForm,
      };
      await request(app).put("/transfer").send({
        old: oldTransfer.body.transfer,
        new: newTransfer,
      });

      const oldAccountAfter = await db.account.findByPk(oldForm.From);

      const newAccountAfter = await db.account.findByPk(newForm.from);

      expect(oldAccountAfter.dataValues.balance).toBe(
        oldAccountBefore.dataValues.balance + oldForm.Amount
      );
      expect(newAccountAfter.dataValues.balance).toBe(
        newAccountBefore.dataValues.balance - newForm.amount
      );
    });

    test("should update AccountTo balance", async () => {
      const oldForm = {
        Amount: 100,
        Date: new Date(),
        From: "Bank",
        To: "Visa",
      };

      const newForm = {
        amount: 500,
        from: "Cash",
        to: "Master card",
      };

      const oldTransfer = await request(app).post("/transfer").send(oldForm);

      const oldAccountBefore = await db.account.findByPk(oldForm.To);

      const newAccountBefore = await db.account.findByPk(newForm.to);

      const newTransfer = {
        ...oldTransfer.body.transfer,
        ...newForm,
      };

      await request(app).put("/transfer").send({
        old: oldTransfer.body.transfer,
        new: newTransfer,
      });

      const oldAccountAfter = await db.account.findByPk(oldForm.To);

      const newAccountAfter = await db.account.findByPk(newForm.to);

      expect(oldAccountAfter.dataValues.balance).toBe(
        oldAccountBefore.dataValues.balance - oldForm.Amount
      );
      expect(newAccountAfter.dataValues.balance).toBe(
        newAccountBefore.dataValues.balance + newForm.amount
      );
    });

    test("should respond with updated transfer transaction", async () => {
      const oldForm = {
        Amount: 100,
        Date: new Date(),
        From: "Bank",
        To: "Visa",
      };

      const newForm = {
        amount: 500,
        from: "Cash",
        to: "Master card",
      };

      const oldTransfer = await request(app).post("/transfer").send(oldForm);

      const newTransfer = {
        ...oldTransfer.body.transfer,
        ...newForm,
      };

      await request(app).put("/transfer").send({
        old: oldTransfer.body.transfer,
        new: newTransfer,
      });

      const res = await db.transfer.findByPk(oldTransfer.body.transfer.id);

      expect(res.dataValues.amount).toEqual(newForm.amount);
      expect(res.dataValues.accountFromName).toEqual(newForm.from);
      expect(res.dataValues.accountToName).toEqual(newForm.to);
    });
  });
});
