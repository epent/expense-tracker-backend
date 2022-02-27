const Expense = require("../models/expense");
const Income = require("../models/income");
const Transfer = require("../models/transfer");

exports.postExpense = async (req, res, next) => {
  console.log(req.body);
  try {
    const account = req.body.From;
    const category = req.body.To;
    const amount = req.body.Amount;
    const date = req.body.Date;

    const expense = await Expense.create({
      accountName: account,
      categoryName: category,
      amount: amount,
      date: date,
    });

    res.status(201).json({ expense: expense });
  } catch (error) {
    console.log(error);
  }
};

exports.postIncome = async (req, res, next) => {
  console.log(req.body);
  try {
    const from = req.body.From;
    const account = req.body.To;
    const amount = req.body.Amount;
    const date = req.body.Date;

    const income = await Income.create({
      from: from,
      accountName: account,
      amount: amount,
      date: date,
    });

    res.status(201).json({ income: income });
  } catch (error) {
    console.log(error);
  }
};

exports.postTransfer = async (req, res, next) => {
  console.log(req.body);
  try {
    const from = req.body.From;
    const to = req.body.To;
    const amount = req.body.Amount;
    const date = req.body.Date;

    const transfer = await Transfer.create({
      accountFromName: from,
      accountToName: to,
      amount: amount,
      date: date,
    });

    res.status(201).json({ transfer: transfer });
  } catch (error) {
    console.log(error);
  }
};
