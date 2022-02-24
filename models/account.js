const { DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Account = sequelize.define("account", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
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
