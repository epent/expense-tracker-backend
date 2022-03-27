"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "accounts",
      [
        {
          id: "5c6c0027-5746-4669-95a7-688e78145493",
          name: "Bank",
          category: "Bank account",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "b9698b4f-3d05-4b95-ba11-55814abe75d2",
        },
        {
          id: "182db4c3-80eb-4331-a88d-c4331f69fc7e",
          name: "Visa",
          category: "Credit card",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "b9698b4f-3d05-4b95-ba11-55814abe75d2",
        },
        {
          id: "36ff7959-bd9d-40de-b43e-7f9ea813e121",
          name: "Master card",
          category: "Credit card",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "b9698b4f-3d05-4b95-ba11-55814abe75d2",
        },
        {
          id: "1b4a1a88-fe73-4ea4-ba02-16b3886eaf8f",
          name: "Cash",
          category: "Cash",
          balance: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "b9698b4f-3d05-4b95-ba11-55814abe75d2",
        },
        {
          id: "45186c45-d9c9-4bf3-af86-488ca2344f30",
          name: "Bank",
          category: "Bank account",
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
