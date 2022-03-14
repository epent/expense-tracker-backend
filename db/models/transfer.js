"use strict";

module.exports = (sequelize, DataTypes) => {
  const Transfer = sequelize.define(
    "transfer",
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
  Transfer.associate = function (models) {
    models.account.hasMany(Transfer, {
      as: "AccountFrom",
      foreignKey: {
        name: "accountFromName",
        allowNull: false,
      },
    });
    models.account.hasMany(Transfer, {
      as: "AccountTo",
      foreignKey: {
        name: "accountToName",
        allowNull: false,
      },
    });
  };

  return Transfer;
};
