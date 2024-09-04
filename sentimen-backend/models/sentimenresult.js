'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SentimenResult extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Sentimen)
    }
  }
  SentimenResult.init({
    sentimen_id: DataTypes.INTEGER,
    result1: DataTypes.STRING,
    result2: DataTypes.STRING,
    result3: DataTypes.STRING,
    result4: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SentimenResult',
  });
  return SentimenResult;
};