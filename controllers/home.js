const db = require("../db/models");
const Balance = db.balance;

exports.getBalances = async (req, res, next) => {
  try {
    const balances = await Balance.findOne();

    res.status(200).json(balances);
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
