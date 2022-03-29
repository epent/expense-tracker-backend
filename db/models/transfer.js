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
  Transfer.associate = function (models) {
    Transfer.belongsTo(models.user);
    models.user.hasMany(Transfer);

    Transfer.belongsToMany(models.account, {
      through: models.account_transfer,
    });
  };

  return Transfer;
};
