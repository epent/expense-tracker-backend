const express = require("express");

const transactionController = require("../controllers/transaction");
const verifyToken = require("../middleware/verify_token");

const router = express.Router();

router.post("/expense", verifyToken, transactionController.postExpense);

router.post("/income", verifyToken, transactionController.postIncome);

router.post("/transfer", verifyToken, transactionController.postTransfer);

router.get("/expenses", verifyToken, transactionController.getExpenses);

router.get("/incomes", verifyToken, transactionController.getIncomes);

router.get("/transfers", verifyToken, transactionController.getTransfers);

router.delete("/expense", verifyToken, transactionController.deleteExpense);

router.delete("/income", verifyToken, transactionController.deleteIncome);

router.delete("/transfer", verifyToken, transactionController.deleteTransfer);

router.put("/expense", verifyToken, transactionController.updateExpense);

router.put("/income", verifyToken, transactionController.updateIncome);

router.put("/transfer", verifyToken, transactionController.updateTransfer);

module.exports = router;
