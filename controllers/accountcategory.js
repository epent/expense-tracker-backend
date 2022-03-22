const db = require("../db/models");
const Account = db.account;
const Category = db.category;
const Balance = db.balance;

exports.postAccount = async (req, res, next) => {
  try {
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === "") {
        const error = new Error("Input is empty string");
        error.statusCode = 422;
        throw error;
      }
    });
    if (Object.keys(req.body).length !== 3) {
      const error = new Error("Input is missing");
      error.statusCode = 422;
      throw error;
    }

    const name = req.body.Name;
    const category = req.body.Category;
    const balance = req.body.Balance;

    const account = await Account.create({
      name: name,
      category: category,
      balance: balance,
      userId: req.userId,
    });

    (
      await Balance.findOne({
        where: {
          userId: req.userId,
        },
      })
    ).increment({
      total: balance,
    });

    res.status(201).json({ account: account });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postCategory = async (req, res, next) => {
  try {
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === "") {
        const error = new Error("Input is empty string");
        error.statusCode = 422;
        throw error;
      }
    });
    if (Object.keys(req.body).length !== 2) {
      const error = new Error("Input is missing");
      error.statusCode = 422;
      throw error;
    }

    const name = req.body.Name;
    const balance = req.body.Balance;

    const category = await Category.create({
      name: name,
      balance: balance,
      userId: req.userId,
    });

    res.status(201).json({ category: category });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.findAll({
      where: {
        userId: req.userId,
      },
    });

    res.status(200).json(accounts);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: {
        userId: req.userId,
      },
    });

    res.status(200).json(categories);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
