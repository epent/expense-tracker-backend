const express = require("express");

const transactionController = require("../controllers/transaction");

const router = express.Router();

router.post("/expense", transactionController.postExpense);

router.post("/income", transactionController.postIncome);

module.exports = router;
