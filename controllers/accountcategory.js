const Account = require("../models/account");
const Category = require("../models/category");
const Balance = require("../models/balance");

exports.postAccount = async (req, res, next) => {
  console.log(req.body);
  try {
    const name = req.body.Name;
    const category = req.body.Category;
    const balance = req.body.Balance;

    const account = await Account.create({
      name: name,
      category: category,
      balance: balance,
    });

    (await Balance.findOne()).increment({
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
  console.log(req.body);
  try {
    const name = req.body.Name;
    const balance = req.body.Balance;

    const category = await Category.create({
      name: name,
      balance: balance,
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
    const accounts = await Account.findAll();

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
    const categories = await Category.findAll();

    res.status(200).json(categories);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
