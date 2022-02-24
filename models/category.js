const { DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Category = sequelize.define("category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  balance: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Category;
