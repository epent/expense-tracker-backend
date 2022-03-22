"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "balances",
      [
        {
          id: uuidv4(),
          total: 0,
          income: 0,
          expenses: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "a8eab1dd-4f9d-43c3-99f0-8847ba42e6ce",
        },
        {
          id: uuidv4(),
          total: 0,
          income: 0,
          expenses: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "b9698b4f-3d05-4b95-ba11-55814abe75d2",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("balances", null, {});
  },
};
