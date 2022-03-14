"use strict";
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define(
    "account",
    {
      name: {
        primaryKey: true,
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
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {}
  );
  Account.associate = function (models) {};

  return Account;
};
