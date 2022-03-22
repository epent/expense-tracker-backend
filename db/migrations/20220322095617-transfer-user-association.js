"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("transfers", {
      fields: ["userId"],
      type: "foreign key",
      name: "transfer_user_association",
      references: {
        table: "users",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "transfers",
      "transfer_user_association"
    );
  },
};
