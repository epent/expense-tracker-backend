const Account = require("../models/account");
const Category = require("../models/category");
const Balance = require("../models/balance");
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

    (await Account.findByPk(account)).decrement({
      balance: amount,
    });

    (await Category.findByPk(category)).increment({
      balance: amount,
    });

    (await Balance.findOne()).decrement({
      total: amount,
    });

    (await Balance.findOne()).increment({
      expenses: amount,
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

    (await Account.findByPk(account)).increment({
      balance: amount,
    });

    (await Balance.findOne()).increment({
      total: amount,
      income: amount,
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

    (await Account.findByPk(from)).decrement({
      balance: amount,
    });

    (await Account.findByPk(to)).increment({
      balance: amount,
    });

    res.status(201).json({ transfer: transfer });
  } catch (error) {
    console.log(error);
  }
};

exports.getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll();

    res.status(200).json(expenses);
  } catch (error) {
    console.log(error);
  }
};

exports.getIncomes = async (req, res, next) => {
  try {
    const incomes = await Income.findAll();

    res.status(200).json(incomes);
  } catch (error) {
    console.log(error);
  }
};

exports.getTransfers = async (req, res, next) => {
  try {
    const transfers = await Transfer.findAll();

    res.status(200).json(transfers);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    await Expense.destroy({
      where: {
        id: req.body.id,
      },
    });

    (await Account.findByPk(req.body.accountName)).increment({
      balance: req.body.amount,
    });

    (await Category.findByPk(req.body.categoryName)).decrement({
      balance: req.body.amount,
    });

    (await Balance.findOne()).increment({
      total: req.body.amount,
    });

    (await Balance.findOne()).decrement({
      expenses: req.body.amount,
    });

    res.status(200).json(`Transaction ${req.body.id} was deleted`);
  } catch (error) {
    console.log(error);
  }
};
