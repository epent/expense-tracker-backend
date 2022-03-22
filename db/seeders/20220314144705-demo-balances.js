"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "balances",
      [
        {
          name: "total_balances",
          total: 0,
          income: 0,
          expenses: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "4cc5127e-0b96-4d3e-a86b-f8a9cf03d0a6",
        },
        {
          name: "total_balances2",
          total: 0,
          income: 0,
          expenses: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "ca1cbe4e-ce5d-4a05-afc4-023735d18772",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("balances", null, {});
  },
};
