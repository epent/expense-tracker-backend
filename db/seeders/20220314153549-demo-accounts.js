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
          userId: "a8eab1dd-4f9d-43c3-99f0-8847ba42e6ce",
        },
        {
          name: "Visa",
          category: "Credit card",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "a8eab1dd-4f9d-43c3-99f0-8847ba42e6ce",
        },
        {
          name: "Master card",
          category: "Credit card",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "a8eab1dd-4f9d-43c3-99f0-8847ba42e6ce",
        },
        {
          name: "Cash",
          category: "Cash",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "a8eab1dd-4f9d-43c3-99f0-8847ba42e6ce",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("accounts", null, {});
  },
};
