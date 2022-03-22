"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: uuidv4(),
          firstName: "John",
          lastName: "Doe",
          email: "john@doe.com",
          password:
            "$2a$10$gIOIoKvZ6d9p0EpnShPSpe7AM51rmpYQRERqQ7CWpaMgdP9lFOfn2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          firstName: "Unique",
          lastName: "User",
          email: "unique@user.com",
          password:
            "$2b$10$eYwDDbQ5sx2NiRlBcyfGxOjZ6GJMNifsVs3syAPX2iqDvzEdBlxfy",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
