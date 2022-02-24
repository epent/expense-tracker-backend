const Account = require("../models/account");

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