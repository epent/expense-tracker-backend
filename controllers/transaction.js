const db = require("../db/models");
const Expense = db.expense;
const Income = db.income;
const Transfer = db.transfer;
const Account = db.account;
const Category = db.category;
const Balance = db.balance;

exports.postExpense = async (req, res, next) => {
  try {
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === "") {
        const error = new Error("Input is empty string");
        error.statusCode = 422;
        throw error;
      }
    });
    if (Object.keys(req.body).length !== 4) {
      const error = new Error("Input is missing");
      error.statusCode = 422;
      throw error;
    }

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
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postIncome = async (req, res, next) => {
  try {
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === "") {
        const error = new Error("Input is empty string");
        error.statusCode = 422;
        throw error;
      }
    });
    if (Object.keys(req.body).length !== 4) {
      const error = new Error("Input is missing");
      error.statusCode = 422;
      throw error;
    }

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
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postTransfer = async (req, res, next) => {
  try {
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === "") {
        const error = new Error("Input is empty string");
        error.statusCode = 422;
        throw error;
      }
    });
    if (Object.keys(req.body).length !== 4) {
      const error = new Error("Input is missing");
      error.statusCode = 422;
      throw error;
    }

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
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.findAll({
      where: {
        userId: req.userId,
      },
    });

    res.status(200).json(expenses);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getIncomes = async (req, res, next) => {
  try {
    const incomes = await Income.findAll({
      where: {
        userId: req.userId,
      },
    });

    res.status(200).json(incomes);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getTransfers = async (req, res, next) => {
  try {
    const transfers = await Transfer.findAll({
      where: {
        userId: req.userId,
      },
    });

    res.status(200).json(transfers);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
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

    res.status(204).json(`Transaction ${req.body.id} was deleted`);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
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

    res.status(204).json(`Transaction ${req.body.id} was deleted`);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
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

    res.status(204).json(`Transaction ${req.body.id} was deleted`);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    if (!req.body.old || !req.body.new) {
      const error = new Error("req.body content is missing");
      error.statusCode = 422;
      throw error;
    }
    if (
      !req.body.old.hasOwnProperty("id") ||
      !req.body.old.hasOwnProperty("accountName") ||
      !req.body.old.hasOwnProperty("categoryName") ||
      !req.body.old.hasOwnProperty("amount") ||
      !req.body.old.hasOwnProperty("date")
    ) {
      const error = new Error("req.body.old content is missing");
      error.statusCode = 422;
      throw error;
    }
    if (
      !req.body.new.hasOwnProperty("id") ||
      !req.body.new.hasOwnProperty("from") ||
      !req.body.new.hasOwnProperty("to") ||
      !req.body.new.hasOwnProperty("amount") ||
      !req.body.new.hasOwnProperty("date")
    ) {
      const error = new Error("req.body.new content is missing");
      error.statusCode = 422;
      throw error;
    }

    const oldExpense = req.body.old;
    const newExpense = req.body.new;

    const result = await Expense.update(
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

    if (!result[0]) {
      throw new Error("Updating expense failed");
    }

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
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateIncome = async (req, res, next) => {
  try {
    if (!req.body.old || !req.body.new) {
      const error = new Error("req.body content is missing");
      error.statusCode = 422;
      throw error;
    }
    if (
      !req.body.old.hasOwnProperty("id") ||
      !req.body.old.hasOwnProperty("from") ||
      !req.body.old.hasOwnProperty("accountName") ||
      !req.body.old.hasOwnProperty("amount") ||
      !req.body.old.hasOwnProperty("date")
    ) {
      const error = new Error("req.body.old content is missing");
      error.statusCode = 422;
      throw error;
    }
    if (
      !req.body.new.hasOwnProperty("id") ||
      !req.body.new.hasOwnProperty("from") ||
      !req.body.new.hasOwnProperty("to") ||
      !req.body.new.hasOwnProperty("amount") ||
      !req.body.new.hasOwnProperty("date")
    ) {
      const error = new Error("req.body.new content is missing");
      error.statusCode = 422;
      throw error;
    }

    const oldIncome = req.body.old;
    const newIncome = req.body.new;

    const result = await Income.update(
      {
        from: newIncome.from,
        accountName: newIncome.to,
        amount: newIncome.amount,
        date: newIncome.date,
      },
      {
        where: {
          id: newIncome.id,
        },
      }
    );

    if (!result[0]) {
      throw new Error("Updating income failed");
    }

    //update amount
    if (oldIncome.amount !== newIncome.amount) {
      (await Account.findByPk(oldIncome.accountName)).increment({
        balance: newIncome.amount - oldIncome.amount,
      });

      (await Balance.findOne()).increment({
        total: newIncome.amount - oldIncome.amount,
        income: newIncome.amount - oldIncome.amount,
      });
    }

    //update account
    if (oldIncome.accountName !== newIncome.to) {
      //old account
      (await Account.findByPk(oldIncome.accountName)).decrement({
        balance: newIncome.amount,
      });

      //new account
      (await Account.findByPk(newIncome.to)).increment({
        balance: newIncome.amount,
      });
    }

    res.status(200).json(`Transaction ${newIncome.id} was updated`);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateTransfer = async (req, res, next) => {
  try {
    if (!req.body.old || !req.body.new) {
      const error = new Error("req.body content is missing");
      error.statusCode = 422;
      throw error;
    }
    if (
      !req.body.old.hasOwnProperty("id") ||
      !req.body.old.hasOwnProperty("accountFromName") ||
      !req.body.old.hasOwnProperty("accountToName") ||
      !req.body.old.hasOwnProperty("amount") ||
      !req.body.old.hasOwnProperty("date")
    ) {
      const error = new Error("req.body.old content is missing");
      error.statusCode = 422;
      throw error;
    }
    if (
      !req.body.new.hasOwnProperty("id") ||
      !req.body.new.hasOwnProperty("from") ||
      !req.body.new.hasOwnProperty("to") ||
      !req.body.new.hasOwnProperty("amount") ||
      !req.body.new.hasOwnProperty("date")
    ) {
      const error = new Error("req.body.new content is missing");
      error.statusCode = 422;
      throw error;
    }

    const oldTransfer = req.body.old;
    const newTransfer = req.body.new;

    const result = await Transfer.update(
      {
        accountFromName: newTransfer.from,
        accountToName: newTransfer.to,
        amount: newTransfer.amount,
        date: newTransfer.date,
      },
      {
        where: {
          id: newTransfer.id,
        },
      }
    );

    if (!result[0]) {
      throw new Error("Updating transfer failed");
    }

    //update amount
    if (oldTransfer.amount !== newTransfer.amount) {
      (await Account.findByPk(oldTransfer.accountFromName)).increment({
        balance: oldTransfer.amount - newTransfer.amount,
      });

      (await Account.findByPk(oldTransfer.accountToName)).increment({
        balance: newTransfer.amount - oldTransfer.amount,
      });
    }

    //update account "from"
    if (oldTransfer.accountFromName !== newTransfer.from) {
      //old account
      (await Account.findByPk(oldTransfer.accountFromName)).increment({
        balance: newTransfer.amount,
      });

      //new account
      (await Account.findByPk(newTransfer.from)).decrement({
        balance: newTransfer.amount,
      });
    }

    //update account "to"
    if (oldTransfer.accountToName !== newTransfer.to) {
      //old account
      (await Account.findByPk(oldTransfer.accountToName)).decrement({
        balance: newTransfer.amount,
      });

      //new account
      (await Account.findByPk(newTransfer.to)).increment({
        balance: newTransfer.amount,
      });
    }

    res.status(200).json(`Transaction ${newTransfer.id} was updated`);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
