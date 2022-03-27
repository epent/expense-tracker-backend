"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "categories",
      [
        {
          id: "1581cc18-ec42-4a01-bc96-9b6a8eea9cc5",
          name: "Food",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "b9698b4f-3d05-4b95-ba11-55814abe75d2",
        },
        {
          id: "7bf9a415-cd3a-4861-b50a-c32bb3fb6210",
          name: "Other",
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
    await queryInterface.bulkDelete("categories", null, {});
  },
};
