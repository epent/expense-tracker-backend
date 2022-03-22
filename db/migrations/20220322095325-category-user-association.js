"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("categories", {
      fields: ["userId"],
      type: "foreign key",
      name: "category_user_association",
      references: {
        table: "users",
        field: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "categories",
      "category_user_association"
    );
  },
};
