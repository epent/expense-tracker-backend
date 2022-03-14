"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("transfers", {
      fields: ["accountFromName"],
      type: "foreign key",
      name: "transfer_account_association",
      references: {
        table: "accounts",
        field: "name",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "transfers",
      "transfer_account_association"
    );
  },
};
