"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("account_transfers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      accountId: {
        type: Sequelize.UUID,
      },
      transferId: {
        type: Sequelize.UUID,
      },
      accountType: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("account_transfers");
  },
};
