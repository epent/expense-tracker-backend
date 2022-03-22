"use strict";

const { v4: uuidv4 } = require("uuid");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          id: "a8eab1dd-4f9d-43c3-99f0-8847ba42e6ce",
          firstName: "John",
          lastName: "Doe",
          email: "john@doe.com",
          password:
            "$2a$10$gIOIoKvZ6d9p0EpnShPSpe7AM51rmpYQRERqQ7CWpaMgdP9lFOfn2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "b9698b4f-3d05-4b95-ba11-55814abe75d2",
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
