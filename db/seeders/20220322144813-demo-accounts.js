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
          userId: "b9698b4f-3d05-4b95-ba11-55814abe75d2",
        },
        {
          name: "Visa",
          category: "Credit card",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "b9698b4f-3d05-4b95-ba11-55814abe75d2",
        },
        {
          name: "Master card",
          category: "Credit card",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "b9698b4f-3d05-4b95-ba11-55814abe75d2",
        },
        {
          name: "Cash",
          category: "Cash",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "b9698b4f-3d05-4b95-ba11-55814abe75d2",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("accounts", null, {});
  },
};
