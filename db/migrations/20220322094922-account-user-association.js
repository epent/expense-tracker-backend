"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("accounts", {
      fields: ["userId"],
      type: "foreign key",
      name: "account_user_association",
      references: {
        table: "users",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "accounts",
      "account_user_association"
    );
  },
};
