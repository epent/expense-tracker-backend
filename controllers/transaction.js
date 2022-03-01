const Account = require("../models/account");
const Category = require("../models/category");
const Balance = require("../models/balance");
const Expense = require("../models/expense");
const Income = require("../models/income");
const Transfer = require("../models/transfer");

exports.postExpense = async (req, res, next) => {
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

exports.deleteIncome = async (req, res, next) => {
  try {
    await Income.destroy({
      where: {
        id: req.body.id,
      },
    });

    (await Account.findByPk(req.body.accountName)).decrement({
      balance: req.body.amount,
    });

    (await Balance.findOne()).decrement({
      total: req.body.amount,
      income: req.body.amount,
    });

    res.status(200).json(`Transaction ${req.body.id} was deleted`);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteTransfer = async (req, res, next) => {
  try {
    await Transfer.destroy({
      where: {
        id: req.body.id,
      },
    });

    (await Account.findByPk(req.body.accountFromName)).increment({
      balance: req.body.amount,
    });

    (await Account.findByPk(req.body.accountToName)).decrement({
      balance: req.body.amount,
    });

    res.status(201).json(`Transaction ${req.body.id} was deleted`);
  } catch (error) {
    console.log(error);
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const oldExpense = req.body.old;
    const newExpense = req.body.new;

    await Expense.update(
      {
        accountName: newExpense.from,
        categoryName: newExpense.to,
        amount: newExpense.amount,
        date: newExpense.date,
      },
      {
        where: {
          id: newExpense.id,
        },
      }
    );

    //update amount
    if (oldExpense.amount !== newExpense.amount) {
      (await Account.findByPk(oldExpense.accountName)).increment({
        balance: oldExpense.amount - newExpense.amount,
      });

      (await Category.findByPk(oldExpense.categoryName)).increment({
        balance: newExpense.amount - oldExpense.amount,
      });

      (await Balance.findOne()).increment({
        total: oldExpense.amount - newExpense.amount,
        expenses: newExpense.amount - oldExpense.amount,
      });
    }

    //update account
    if (oldExpense.accountName !== newExpense.from) {
      //old account
      (await Account.findByPk(oldExpense.accountName)).increment({
        balance: newExpense.amount,
      });

      //new account
      (await Account.findByPk(newExpense.from)).decrement({
        balance: newExpense.amount,
      });
    }

    //update category
    if (oldExpense.categoryName !== newExpense.to) {
      //old category
      (await Category.findByPk(oldExpense.categoryName)).decrement({
        balance: newExpense.amount,
      });

      //new category
      (await Category.findByPk(newExpense.to)).increment({
        balance: newExpense.amount,
      });
    }

    res.status(200).json(`Transaction ${newExpense.id} was updated`);
  } catch (error) {
    console.log(error);
  }
};
