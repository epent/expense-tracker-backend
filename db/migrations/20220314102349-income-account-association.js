"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("incomes", {
      fields: ["accountId"],
      type: "foreign key",
      name: "income_account_association",
      references: {
        table: "accounts",
        field: "id",
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
