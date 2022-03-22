"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("expenses", {
      fields: ["userId"],
      type: "foreign key",
      name: "expense_user_association",
      references: {
        table: "users",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "expenses",
      "expense_user_association"
    );
  },
};
