"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("transfers", {
      fields: ["accountToName"],
      type: "foreign key",
      name: "transfer_account_association2",
      references: {
        table: "accounts",
        field: "name",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "transfers",
      "transfer_account_association2"
    );
  },
};
