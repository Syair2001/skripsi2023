'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NetworkResult extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Network)
    }
  }
  NetworkResult.init({
    result1: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'NetworkResult',
  });
  return NetworkResult;
};