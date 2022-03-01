const express = require("express");

const transactionController = require("../controllers/transaction");

const router = express.Router();

router.post("/expense", transactionController.postExpense);

router.post("/income", transactionController.postIncome);

router.post("/transfer", transactionController.postTransfer);

router.get("/expenses", transactionController.getExpenses);

router.get("/incomes", transactionController.getIncomes);

router.get("/transfers", transactionController.getTransfers);

router.delete("/expense", transactionController.deleteExpense);

module.exports = router;
