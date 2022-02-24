const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./util/database");
const Account = require("./models/account");
const Category = require("./models/category");
const Expense = require("./models/expense");
const Income = require("./models/income");
const Transfer = require("./models/transfer");

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
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
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
