"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("balances", {
      name: {
        primaryKey: true,
        type: Sequelize.STRING,
        allowNull: false,
      },
      total: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      income: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      expenses: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable("balances");
  },
};
