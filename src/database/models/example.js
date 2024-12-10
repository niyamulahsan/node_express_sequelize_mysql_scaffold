'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Example extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Foreign_table_name }) {
      // define association here
      // this.hasMany(Foreign_table_name, {as: "example", foreignKey: "foreign_id" });
    }
  }
  Example.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT.UNSIGNED
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    tableName: 'examples',
    modelName: 'Example',
  });
  return Example;
};