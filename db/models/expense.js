"use strict";

module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define(
    "expense",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
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
  Expense.associate = function (models) {
    Expense.belongsTo(models.account);
    models.account.hasMany(Expense);

    Expense.belongsTo(models.category);
    models.category.hasMany(Expense);

    Expense.belongsTo(models.user);
    models.user.hasMany(Expense);
  };

  return Expense;
};
