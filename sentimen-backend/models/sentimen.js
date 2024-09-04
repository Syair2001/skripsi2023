'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sentimen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.SentimenResult, {
        foreignKey: 'sentimen_id'
      })
    }
  }
  Sentimen.init({
    query: DataTypes.STRING,
    tanggal: DataTypes.STRING,
    csv: DataTypes.STRING,
    gambar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sentimen',
  });
  return Sentimen;
};