const Expense = require("../models/expense");

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

    res.status(201).json({ expense: expense });
  } catch (error) {
    console.log(error);
  }
};
