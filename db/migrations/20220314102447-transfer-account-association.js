"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Transfers", {
      fields: ["accountFromName"],
      type: "foreign key",
      name: "transfer_account_association",
      references: {
        table: "Accounts",
        field: "name",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "Transfers",
      "transfer_account_association"
    );
  },
};
