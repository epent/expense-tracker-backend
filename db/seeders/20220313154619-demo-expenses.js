"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Expenses",
      [
        {
          id: uuidv4(),
          amount: 300,
          date: new Date(),
          accountName: "Bank",
          categoryName: "Flat",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          amount: 100,
          date: new Date(),
          accountName: "Visa One",
          categoryName: "Food",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Expenses", null, {});
  },
};
