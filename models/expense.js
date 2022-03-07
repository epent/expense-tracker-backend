const { DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Expense = sequelize.define("expense", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});

module.exports = Expense;
