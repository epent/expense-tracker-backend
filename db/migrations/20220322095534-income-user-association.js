"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("incomes", {
      fields: ["userId"],
      type: "foreign key",
      name: "income_user_association",
      references: {
        table: "users",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("incomes", "income_user_association");
  },
};
