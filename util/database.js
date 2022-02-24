const { Sequelize } = require("sequelize");

const { DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

const sequelize = new Sequelize("expense_tracker", DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "postgres",
});

module.exports = sequelize;
