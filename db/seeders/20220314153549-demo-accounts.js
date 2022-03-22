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
          userId: "4cc5127e-0b96-4d3e-a86b-f8a9cf03d0a6",
        },
        {
          name: "Visa",
          category: "Credit card",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "4cc5127e-0b96-4d3e-a86b-f8a9cf03d0a6",
        },
        {
          name: "Master card",
          category: "Credit card",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "4cc5127e-0b96-4d3e-a86b-f8a9cf03d0a6",
        },
        {
          name: "Cash",
          category: "Cash",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "4cc5127e-0b96-4d3e-a86b-f8a9cf03d0a6",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("accounts", null, {});
  },
};
