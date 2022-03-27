"use strict";

module.exports = (sequelize, DataTypes) => {
  const AccountTransfer = sequelize.define(
    "account_transfer",
    {
      accountId: {
        type: DataTypes.UUID,
        references: {
          model: "account",
          key: "id",
        },
      },
      transferId: {
        type: DataTypes.UUID,
        references: {
          model: "transfer",
          key: "id",
        },
      },
      accountType: DataTypes.STRING,
    },
    {}
  );
  AccountTransfer.associate = function (models) {
    AccountTransfer.belongsTo(models.account);
    AccountTransfer.belongsTo(models.transfer);
  };

  return AccountTransfer;
};
