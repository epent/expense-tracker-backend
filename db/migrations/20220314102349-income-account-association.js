"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("incomes", {
      fields: ["accountName"],
      type: "foreign key",
      name: "income_account_association",
      references: {
        table: "accounts",
        field: "name",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "incomes",
      "income_account_association"
    );
  },
};
