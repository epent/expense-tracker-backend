const request = require("supertest");
const db = require("../db/models");

const app = require("../app");

describe("PUT /expense", () => {
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
      const oldExpense = await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const newExpense = {
        ...oldExpense.body.expense,
        ...newForm,
      };

      const res = await request(app)
        .put("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send({
          old: oldExpense.body.expense,
          new: newExpense,
        });

      expect(res.statusCode).toEqual(200);
    });

    test("should update total and expenses Balance", async () => {
      const oldExpense = await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const before = await request(app)
        .get("/balances")
        .set("Authorization", `Bearer ${token}`);

      const newExpense = {
        ...oldExpense.body.expense,
        ...newForm,
      };

      await request(app)
        .put("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send({
          old: oldExpense.body.expense,
          new: newExpense,
        });

      const after = await request(app)
        .get("/balances")
        .set("Authorization", `Bearer ${token}`);

      expect(after.body.total).toBe(
        before.body.total + (oldExpense.body.expense.amount - newExpense.amount)
      );
      expect(after.body.expenses).toBe(
        before.body.expenses +
          (newExpense.amount - oldExpense.body.expense.amount)
      );
    });

    test("should update Account balance", async () => {
      const oldExpense = await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const oldAccountBefore = await db.account.findByPk(oldForm.From);

      const newAccountBefore = await db.account.findByPk(newForm.from);

      const newExpense = {
        ...oldExpense.body.expense,
        ...newForm,
      };

      await request(app)
        .put("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      const oldExpense = await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const oldCategoryBefore = await db.category.findByPk(oldForm.To);

      const newCategoryBefore = await db.category.findByPk(newForm.to);

      const newExpense = {
        ...oldExpense.body.expense,
        ...newForm,
      };

      await request(app)
        .put("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      const oldExpense = await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const newExpense = {
        ...oldExpense.body.expense,
        ...newForm,
      };

      await request(app)
        .put("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send({
          old: oldExpense.body.expense,
          new: newExpense,
        });

      const res = await db.expense.findByPk(oldExpense.body.expense.id);

      expect(res.dataValues.amount).toEqual(newForm.amount);
      expect(res.dataValues.accountName).toEqual(newForm.from);
      expect(res.dataValues.categoryName).toEqual(newForm.to);
    });
  });

  describe("negative tests", () => {
    test("should respond with status 422 - req.body content is missing", async () => {
      const oldExpense = await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const newExpense = {
        ...oldExpense.body.expense,
        ...newForm,
      };

      const res1 = await request(app)
        .put("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send({
          new: newExpense,
        });
      const res2 = await request(app)
        .put("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send({
          old: oldExpense.body.expense,
        });

      expect(res1.statusCode).toEqual(422);
      expect(res2.statusCode).toEqual(422);
    });

    test("should respond with status 422 - req.body.new content is missing", async () => {
      const oldExpense = await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      for (let key in newForm) {
        const newExpense = {
          ...oldExpense.body.expense,
          ...newForm,
        };
        delete newExpense[key];

        const response = await request(app)
          .put("/expense")
          .set("Authorization", `Bearer ${token}`)
          .send({
            old: oldExpense.body.expense,
            new: newExpense,
          });

        expect(response.statusCode).toEqual(422);
      }
    });

    test("should respond with status 422 - req.body.old content is missing", async () => {
      const expense = await request(app)
        .post("/expense")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const newExpense = {
        ...expense.body.expense,
        ...newForm,
      };

      for (let key in expense.body.expense) {
        if (key !== "updatedAt" && key !== "createdAt") {
          const oldExpense = {
            ...expense.body.expense,
          };
          delete oldExpense[key];

          const response = await request(app)
            .put("/expense")
            .set("Authorization", `Bearer ${token}`)
            .send({
              old: oldExpense,
              new: newExpense,
            });

          expect(response.statusCode).toEqual(422);
        }
      }
    });
  });
});

describe("PUT /income", () => {
  const oldForm = {
    Amount: 100,
    Date: new Date(),
    From: "Salary",
    To: "Bank",
  };

  const newForm = {
    amount: 500,
    from: "Other income",
    to: "Visa",
  };

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
      const oldIncome = await request(app)
        .post("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const newIncome = {
        ...oldIncome.body.income,
        ...newForm,
      };

      const res = await request(app)
        .put("/income")
        .set("Authorization", `Bearer ${token}`)
        .send({
          old: oldIncome.body.income,
          new: newIncome,
        });

      expect(res.statusCode).toEqual(200);
    });

    test("should update total and income Balance", async () => {
      const oldIncome = await request(app)
        .post("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const before = await request(app)
        .get("/balances")
        .set("Authorization", `Bearer ${token}`);

      const newIncome = {
        ...oldIncome.body.income,
        ...newForm,
      };

      await request(app)
        .put("/income")
        .set("Authorization", `Bearer ${token}`)
        .send({
          old: oldIncome.body.income,
          new: newIncome,
        });

      const after = await request(app)
        .get("/balances")
        .set("Authorization", `Bearer ${token}`);

      expect(after.body.total).toBe(
        before.body.total + (newIncome.amount - oldIncome.body.income.amount)
      );
      expect(after.body.income).toBe(
        before.body.income + (newIncome.amount - oldIncome.body.income.amount)
      );
    });

    test("should update Account balance", async () => {
      const oldIncome = await request(app)
        .post("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const oldAccountBefore = await db.account.findByPk(oldForm.To);

      const newAccountBefore = await db.account.findByPk(newForm.to);

      const newIncome = {
        ...oldIncome.body.income,
        ...newForm,
      };

      await request(app)
        .put("/income")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      const oldIncome = await request(app)
        .post("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const newIncome = {
        ...oldIncome.body.income,
        ...newForm,
      };

      await request(app)
        .put("/income")
        .set("Authorization", `Bearer ${token}`)
        .send({
          old: oldIncome.body.income,
          new: newIncome,
        });

      const res = await db.income.findByPk(oldIncome.body.income.id);

      expect(res.dataValues.amount).toEqual(newForm.amount);
      expect(res.dataValues.accountName).toEqual(newForm.to);
    });
  });

  describe("negative tests", () => {
    test("should respond with status 422 - req.body content is missing", async () => {
      const oldIncome = await request(app)
        .post("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const newIncome = {
        ...oldIncome.body.income,
        ...newForm,
      };

      const res1 = await request(app)
        .put("/income")
        .set("Authorization", `Bearer ${token}`)
        .send({
          new: newIncome,
        });
      const res2 = await request(app)
        .put("/income")
        .set("Authorization", `Bearer ${token}`)
        .send({
          old: oldIncome.body.income,
        });

      expect(res1.statusCode).toEqual(422);
      expect(res2.statusCode).toEqual(422);
    });

    test("should respond with status 422 - req.body.new content is missing", async () => {
      const oldIncome = await request(app)
        .post("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      for (let key in newForm) {
        const newIncome = {
          ...oldIncome.body.income,
          ...newForm,
        };
        delete newIncome[key];

        const response = await request(app)
          .put("/income")
          .set("Authorization", `Bearer ${token}`)
          .send({
            old: oldIncome.body.income,
            new: newIncome,
          });

        expect(response.statusCode).toEqual(422);
      }
    });

    test("should respond with status 422 - req.body.old content is missing", async () => {
      const income = await request(app)
        .post("/income")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const newIncome = {
        ...income.body.income,
        ...newForm,
      };

      for (let key in income.body.income) {
        if (key !== "updatedAt" && key !== "createdAt") {
          const oldIncome = {
            ...income.body.income,
          };
          delete oldIncome[key];

          const response = await request(app)
            .put("/income")
            .set("Authorization", `Bearer ${token}`)
            .send({
              old: oldIncome,
              new: newIncome,
            });

          expect(response.statusCode).toEqual(422);
        }
      }
    });
  });
});

describe("PUT /transfer", () => {
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
      const oldTransfer = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const newTransfer = {
        ...oldTransfer.body.transfer,
        ...newForm,
      };
      const res = await request(app)
        .put("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send({
          old: oldTransfer.body.transfer,
          new: newTransfer,
        });

      expect(res.statusCode).toEqual(200);
    });

    test("should update AccountFrom balance", async () => {
      const oldTransfer = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const oldAccountBefore = await db.account.findByPk(oldForm.From);

      const newAccountBefore = await db.account.findByPk(newForm.from);

      const newTransfer = {
        ...oldTransfer.body.transfer,
        ...newForm,
      };
      await request(app)
        .put("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      const oldTransfer = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const oldAccountBefore = await db.account.findByPk(oldForm.To);

      const newAccountBefore = await db.account.findByPk(newForm.to);

      const newTransfer = {
        ...oldTransfer.body.transfer,
        ...newForm,
      };

      await request(app)
        .put("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send({
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
      const oldTransfer = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const newTransfer = {
        ...oldTransfer.body.transfer,
        ...newForm,
      };

      await request(app)
        .put("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send({
          old: oldTransfer.body.transfer,
          new: newTransfer,
        });

      const res = await db.transfer.findByPk(oldTransfer.body.transfer.id);

      expect(res.dataValues.amount).toEqual(newForm.amount);
      expect(res.dataValues.accountFromName).toEqual(newForm.from);
      expect(res.dataValues.accountToName).toEqual(newForm.to);
    });
  });

  describe("negative tests", () => {
    test("should respond with status 422 - req.body content is missing", async () => {
      const oldTransfer = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const newTransfer = {
        ...oldTransfer.body.transfer,
        ...newForm,
      };

      const res1 = await request(app)
        .put("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send({
          new: newTransfer,
        });
      const res2 = await request(app)
        .put("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send({
          old: oldTransfer.body.income,
        });

      expect(res1.statusCode).toEqual(422);
      expect(res2.statusCode).toEqual(422);
    });

    test("should respond with status 422 - req.body.new content is missing", async () => {
      const oldTransfer = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      for (let key in newForm) {
        const newTransfer = {
          ...oldTransfer.body.transfer,
          ...newForm,
        };
        delete newTransfer[key];

        const response = await request(app)
          .put("/transfer")
          .set("Authorization", `Bearer ${token}`)
          .send({
            old: oldTransfer.body.transfer,
            new: newTransfer,
          });

        expect(response.statusCode).toEqual(422);
      }
    });

    test("should respond with status 422 - req.body.old content is missing", async () => {
      const transfer = await request(app)
        .post("/transfer")
        .set("Authorization", `Bearer ${token}`)
        .send(oldForm);

      const newTransfer = {
        ...transfer.body.transfer,
        ...newForm,
      };

      for (let key in transfer.body.transfer) {
        if (key !== "updatedAt" && key !== "createdAt") {
          const oldTransfer = {
            ...transfer.body.transfer,
          };
          delete oldTransfer[key];

          const response = await request(app)
            .put("/transfer")
            .set("Authorization", `Bearer ${token}`)
            .send({
              old: oldTransfer,
              new: newTransfer,
            });

          expect(response.statusCode).toEqual(422);
        }
      }
    });
  });
});
