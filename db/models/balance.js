'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Balance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Balance.init({
    name: DataTypes.STRING,
    total: DataTypes.INTEGER,
    income: DataTypes.INTEGER,
    expenses: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Balance',
  });
  return Balance;
};