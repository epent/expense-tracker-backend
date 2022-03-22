"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "categories",
      [
        {
          name: "Food",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "a8eab1dd-4f9d-43c3-99f0-8847ba42e6ce",
        },
        {
          name: "Other",
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
    await queryInterface.bulkDelete("categories", null, {});
  },
};
