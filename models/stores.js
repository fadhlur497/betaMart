'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Stores.hasMany(models.Employees, {
        foreignKey: 'StoreId'
      })
    }
  }
  Stores.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'stores cant be null' },
        notEmpty: { msg: 'name cant be Empty' },
      }
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'code cant be null' },
        notEmpty: { msg: 'code cant be Empty' },
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Location cant be null' },
        notEmpty: { msg: 'location cant be Empty' },
      }
    },
    category: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Stores',
  });
  Stores.beforeCreate(data => {
    let code = ""
    let date = data.createdAt.getTime()
    if (data.category === "Mart") {
      code = "001"
    }
    if (data.category === "Midi") {
      code = "002"
    }
    if (data.category === "Express") {
      code = "003"
    }
    data.code = `${code}-${date}`
  })
  return Stores;
};