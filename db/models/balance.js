"use strict";

module.exports = (sequelize, DataTypes) => {
  const Balance = sequelize.define(
    "Balance",
    {
      name: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false,
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

  return Balance;
};
