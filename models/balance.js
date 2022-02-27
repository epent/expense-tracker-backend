const { DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Balance = sequelize.define("balance", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  income: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expenses: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Balance;
