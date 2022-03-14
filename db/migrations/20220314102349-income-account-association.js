"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Incomes", {
      fields: ["accountName"],
      type: "foreign key",
      name: "income_account_association",
      references: {
        table: "Accounts",
        field: "name",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "Incomes",
      "income_account_association"
    );
  },
};
