const { DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Account = sequelize.define("account", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  balance: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Account;
