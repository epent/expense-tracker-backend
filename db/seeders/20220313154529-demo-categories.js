"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Categories",
      [
        {
          name: "Food",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Flat",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Other",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
