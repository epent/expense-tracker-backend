"use strict";

module.exports = (sequelize, DataTypes) => {
  const Balance = sequelize.define(
    "balance",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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

  Balance.associate = function (models) {
    Balance.belongsTo(models.user);
    models.user.hasMany(Balance);
  };

  return Balance;
};
