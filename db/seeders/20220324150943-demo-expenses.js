"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "expenses",
      [
        {
          id: uuidv4(),
          amount: 10,
          date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          accountId: "182db4c3-80eb-4331-a88d-c4331f69fc7e",
          categoryId: "1581cc18-ec42-4a01-bc96-9b6a8eea9cc5",
          userId: "b9698b4f-3d05-4b95-ba11-55814abe75d2",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("expenses", null, {});
  },
};
