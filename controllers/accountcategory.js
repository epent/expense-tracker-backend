const Account = require("../models/account");
const Category = require("../models/category");

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

    res.status(201).json({ account: account });
  } catch (error) {
    console.log(error);
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
    console.log(error);
  }
};