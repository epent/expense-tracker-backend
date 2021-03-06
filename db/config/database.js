require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "expense_tracker_development",
    host: process.env.DB_HOST,
    dialect: "postgres",
    seederStorage: "sequelize",
    logging: false,
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "expense_tracker_test",
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "expense_tracker_production",
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  },
};
