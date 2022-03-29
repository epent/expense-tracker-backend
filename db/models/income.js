"use strict";

module.exports = (sequelize, DataTypes) => {
  const Income = sequelize.define(
    "income",
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
      from: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      to: {
        allowNull: false,
        type: DataTypes.STRING,
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
  Income.associate = function (models) {
    Income.belongsTo(models.account);
    models.account.hasMany(Income);

    Income.belongsTo(models.user);
    models.user.hasMany(Income);
  };

  return Income;
};
