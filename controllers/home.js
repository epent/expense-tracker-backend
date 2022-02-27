const Balance = require("../models/balance");

exports.getBalances = async (req, res, next) => {
  try {
    const balances = await Balance.findOne();

    res.status(200).json({
      balances: balances,
    });
  } catch (error) {
    console.log(error);
  }
};
