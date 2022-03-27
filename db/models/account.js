"use strict";
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define(
    "account",
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
  Account.associate = function (models) {
    Account.belongsTo(models.user);
    models.user.hasMany(Account);

    Account.belongsToMany(models.transfer, {
      through: models.account_transfer,
    });
  };

  return Account;
};
