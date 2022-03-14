"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Transfers", {
      fields: ["accountToName"],
      type: "foreign key",
      name: "transfer_account_association2",
      references: {
        table: "Accounts",
        field: "name",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "Transfers",
      "transfer_account_association2"
    );
  },
};
