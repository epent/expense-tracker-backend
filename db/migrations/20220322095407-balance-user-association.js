"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("balances", {
      fields: ["userId"],
      type: "foreign key",
      name: "balance_user_association",
      references: {
        table: "users",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "balances",
      "balance_user_association"
    );
  },
};
