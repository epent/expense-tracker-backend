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
      console.log(oldAccountAfter.dataValues);

      const newAccountAfter = await db.account.findByPk(newForm.from);
      console.log(newAccountAfter.dataValues);

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
