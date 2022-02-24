const express = require("express");

const sequelize = require("./util/database");
const Account = require("./models/account");
const Category = require("./models/category");
const Expense = require("./models/expense");
const Income = require("./models/income");
const Transfer = require("./models/transfer");

const app = express();
const port = process.env.PORT || 8080;

app.get("/", (req, res, next) => {
  res.send("Hello world!!!");
});

Category.hasMany(Expense, {
  foreignKey: {
    allowNull: false,
  },
});
Expense.belongsTo(Category);

Account.hasMany(Expense, {
  foreignKey: {
    allowNull: false,
  },
});
Expense.belongsTo(Account);

Account.hasMany(Income, {
  foreignKey: {
    allowNull: false,
  },
});
Income.belongsTo(Account);

Account.hasMany(Transfer, {
  foreignKey: {
    allowNull: false,
  },
});
Transfer.belongsTo(Account);

sequelize
  .sync({ force: true })
  .then((result) => {
    app.listen(port);
  })
  .then(() => {
    Account.create({ name: "Visa", category: "Creadit card", balance: 100 });
  })
  .then(() => {
    console.log(sequelize.models);
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
