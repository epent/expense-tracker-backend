"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("expenses", {
      fields: ["categoryId"],
      type: "foreign key",
      name: "expense_category_association",
      references: {
        table: "categories",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "expenses",
      "expense_category_association"
    );
  },
};
