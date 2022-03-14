"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Expenses", {
      fields: ["accountName"],
      type: "foreign key",
      name: "expense_account_association",
      references: {
        table: "Accounts",
        field: "name",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "Expenses",
      "expense_account_association"
    );
  },
};
