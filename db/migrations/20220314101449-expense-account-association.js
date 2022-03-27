"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("expenses", {
      fields: ["accountId"],
      type: "foreign key",
      name: "expense_account_association",
      references: {
        table: "accounts",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "expenses",
      "expense_account_association"
    );
  },
};
