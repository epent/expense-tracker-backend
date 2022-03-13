"use strict";
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Accounts", [
      {
        id: uuidv4(),
        name: "Bank",
        category: "Bank account",
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Cash",
        category: "Cash",
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Visa One",
        category: "Credit card",
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Visa Two",
        category: "Credit card",
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Accounts", null, {});
  },
};
