"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "accounts",
      [
        {
          name: "Bank",
          category: "Bank account",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Visa",
          category: "Credit card",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Master card",
          category: "Credit card",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Cash",
          category: "Cash",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("accounts", null, {});
  },
};
