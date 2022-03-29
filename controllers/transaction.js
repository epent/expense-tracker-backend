const db = require("../db/models");
const Expense = db.expense;
const Income = db.income;
const Transfer = db.transfer;
const Account = db.account;
const Category = db.category;
const Balance = db.balance;
const AccountTransfer = db.account_transfer;

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

    const from = req.body.From;
    const to = req.body.To;
    const amount = req.body.Amount;
    const date = req.body.Date;

    const account = await Account.findOne({
      where: {
        userId: req.userId,
        name: from,
      },
    });

    const category = await Category.findOne({
      where: {
        userId: req.userId,
        name: to,
      },
    });

    const balance = await Balance.findOne({
      where: {
        userId: req.userId,
      },
    });

    const expense = await Expense.create({
      amount: amount,
      date: date,
      from: from,
      to: to,
      accountId: account.id,
      categoryId: category.id,
      userId: req.userId,
    });

    account.decrement({
      balance: amount,
    });

    category.increment({
      balance: amount,
    });

    balance.increment({
      total: -amount,
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
    const to = req.body.To;
    const amount = req.body.Amount;
    const date = req.body.Date;

    const account = await Account.findOne({
      where: {
        userId: req.userId,
        name: to,
      },
    });

    const balance = await Balance.findOne({
      where: {
        userId: req.userId,
      },
    });

    const income = await Income.create({
      amount: amount,
      date: date,
      from: from,
      to: to,
      accountId: account.id,
      userId: req.userId,
    });

    account.increment({
      balance: amount,
    });

    balance.increment({
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
      amount: amount,
      date: date,
      from: from,
      to: to,
      userId: req.userId,
    });

    const accountFrom = await Account.findOne({
      where: {
        userId: req.userId,
        name: from,
      },
    });

    const accountTo = await Account.findOne({
      where: {
        userId: req.userId,
        name: to,
      },
    });

    transfer.addAccount(accountFrom, { through: { accountType: "from" } });
    transfer.addAccount(accountTo, { through: { accountType: "to" } });

    accountFrom.decrement({
      balance: amount,
    });

    accountTo.increment({
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
        userId: req.userId,
      },
    });

    (
      await Account.findOne({
        where: {
          id: req.body.accountId,
          userId: req.userId,
        },
      })
    ).increment({
      balance: req.body.amount,
    });

    (
      await Category.findOne({
        where: {
          id: req.body.categoryId,
          userId: req.userId,
        },
      })
    ).decrement({
      balance: req.body.amount,
    });

    (
      await Balance.findOne({
        where: {
          userId: req.userId,
        },
      })
    ).increment({
      total: req.body.amount,
      expenses: -req.body.amount,
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
        userId: req.userId,
      },
    });

    (
      await Account.findOne({
        where: {
          id: req.body.accountId,
          userId: req.userId,
        },
      })
    ).decrement({
      balance: req.body.amount,
    });

    (
      await Balance.findOne({
        where: {
          userId: req.userId,
        },
      })
    ).decrement({
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
        userId: req.userId,
      },
    });

    await AccountTransfer.destroy({
      where: {
        transferId: req.body.id,
      },
    });

    (
      await Account.findOne({
        where: {
          name: req.body.from,
          userId: req.userId,
        },
      })
    ).increment({
      balance: req.body.amount,
    });

    (
      await Account.findOne({
        where: {
          name: req.body.to,
          userId: req.userId,
        },
      })
    ).decrement({
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
      !req.body.old.hasOwnProperty("from") ||
      !req.body.old.hasOwnProperty("to") ||
      !req.body.old.hasOwnProperty("accountId") ||
      !req.body.old.hasOwnProperty("categoryId") ||
      !req.body.old.hasOwnProperty("amount") ||
      !req.body.old.hasOwnProperty("date") ||
      !req.body.old.hasOwnProperty("userId")
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

    const oldAccount = await Account.findOne({
      where: {
        id: oldExpense.accountId,
        userId: req.userId,
      },
    });

    const oldCategory = await Category.findOne({
      where: {
        id: oldExpense.categoryId,
        userId: req.userId,
      },
    });

    const newAccount = await Account.findOne({
      where: {
        userId: req.userId,
        name: newExpense.from,
      },
    });

    const newCategory = await Category.findOne({
      where: {
        userId: req.userId,
        name: newExpense.to,
      },
    });

    const balance = await Balance.findOne({
      where: {
        userId: req.userId,
      },
    });

    const result = await Expense.update(
      {
        amount: newExpense.amount,
        date: newExpense.date,
        from: newExpense.from,
        to: newExpense.to,
        accountId: newAccount.id,
        categoryId: newCategory.id,
      },
      {
        where: {
          id: newExpense.id,
          userId: req.userId,
        },
      }
    );

    if (!result[0]) {
      throw new Error("Updating expense failed");
    }

    //update amount
    if (oldExpense.amount !== newExpense.amount) {
      oldAccount.increment({
        balance: oldExpense.amount - newExpense.amount,
      });

      oldCategory.increment({
        balance: newExpense.amount - oldExpense.amount,
      });

      balance.increment({
        total: oldExpense.amount - newExpense.amount,
        expenses: newExpense.amount - oldExpense.amount,
      });
    }

    //update account
    if (oldExpense.from !== newExpense.from) {
      //old account
      oldAccount.increment({
        balance: newExpense.amount,
      });

      //new account
      newAccount.decrement({
        balance: newExpense.amount,
      });
    }

    //update category
    if (oldExpense.to !== newExpense.to) {
      //old category
      oldCategory.decrement({
        balance: newExpense.amount,
      });

      //new category
      newCategory.increment({
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
      !req.body.old.hasOwnProperty("to") ||
      !req.body.old.hasOwnProperty("accountId") ||
      !req.body.old.hasOwnProperty("amount") ||
      !req.body.old.hasOwnProperty("date") ||
      !req.body.old.hasOwnProperty("userId")
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

    const oldAccount = await Account.findOne({
      where: {
        id: oldIncome.accountId,
        userId: req.userId,
      },
    });

    const newAccount = await Account.findOne({
      where: {
        userId: req.userId,
        name: newIncome.to,
      },
    });

    const balance = await Balance.findOne({
      where: {
        userId: req.userId,
      },
    });

    const result = await Income.update(
      {
        amount: newIncome.amount,
        date: newIncome.date,
        from: newIncome.from,
        to: newIncome.to,
        accountId: newAccount.id,
      },
      {
        where: {
          id: newIncome.id,
          userId: req.userId,
        },
      }
    );

    if (!result[0]) {
      throw new Error("Updating income failed");
    }

    //update amount
    if (oldIncome.amount !== newIncome.amount) {
      oldAccount.increment({
        balance: newIncome.amount - oldIncome.amount,
      });

      balance.increment({
        total: newIncome.amount - oldIncome.amount,
        income: newIncome.amount - oldIncome.amount,
      });
    }

    //update account
    if (oldIncome.from !== newIncome.to) {
      //old account
      oldAccount.decrement({
        balance: newIncome.amount,
      });

      //new account
      newAccount.increment({
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
      !req.body.old.hasOwnProperty("from") ||
      !req.body.old.hasOwnProperty("to") ||
      !req.body.old.hasOwnProperty("amount") ||
      !req.body.old.hasOwnProperty("date") ||
      !req.body.old.hasOwnProperty("userId")
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

    const oldFrom = await Account.findOne({
      where: {
        name: oldTransfer.from,
        userId: req.userId,
      },
    });

    const oldTo = await Account.findOne({
      where: {
        name: oldTransfer.to,
        userId: req.userId,
      },
    });

    const newFrom = await Account.findOne({
      where: {
        userId: req.userId,
        name: newTransfer.from,
      },
    });

    const newTo = await Account.findOne({
      where: {
        userId: req.userId,
        name: newTransfer.to,
      },
    });

    const result = await Transfer.update(
      {
        amount: newTransfer.amount,
        date: newTransfer.date,
        from: newTransfer.from,
        to: newTransfer.to,
      },
      {
        where: {
          id: newTransfer.id,
          userId: req.userId,
        },
      }
    );

    if (!result[0]) {
      throw new Error("Updating transfer failed");
    }

    //update amount
    if (oldTransfer.amount !== newTransfer.amount) {
      oldFrom.increment({
        balance: oldTransfer.amount - newTransfer.amount,
      });

      oldTo.increment({
        balance: newTransfer.amount - oldTransfer.amount,
      });
    }

    //update account "from"
    if (oldTransfer.accountFromName !== newTransfer.from) {
      //old account
      oldFrom.increment({
        balance: newTransfer.amount,
      });

      //new account
      newFrom.decrement({
        balance: newTransfer.amount,
      });

      AccountTransfer.update(
        { accountId: newFrom.id },
        {
          where: {
            transferId: newTransfer.id,
            accountType: "from",
          },
        }
      );
    }

    //update account "to"
    if (oldTransfer.accountToName !== newTransfer.to) {
      //old account
      oldTo.decrement({
        balance: newTransfer.amount,
      });

      //new account
      newTo.increment({
        balance: newTransfer.amount,
      });

      AccountTransfer.update(
        { accountId: newTo.id },
        {
          where: {
            transferId: newTransfer.id,
            accountType: "to",
          },
        }
      );
    }

    res.status(200).json(`Transaction ${newTransfer.id} was updated`);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
