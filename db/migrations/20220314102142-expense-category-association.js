"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Expenses", {
      fields: ["categoryName"],
      type: "foreign key",
      name: "expense_category_association",
      references: {
        table: "Categories",
        field: "name",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "Expenses",
      "expense_category_association"
    );
  },
};
