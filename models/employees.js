'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    get age() {
      return new Date().getFullYear() - this.dateOfBirth.getFullYear()
    }
    get formatdate() {
      return this.dateOfBirth.toISOString().slice(0, 10)
    }
    static associate(models) {
      // define association here
      Employees.belongsTo(models.Stores)
    }
    static getEmployeesByPosition(position) {
      return Employees.findAll({
        where: {
          position: position
        },
        include: {
          model: sequelize.models.Stores,
          attributes: ['code', 'id']
        }
      })
    }
  }
  Employees.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'FirstName cant be null' },
        notEmpty: { msg: 'First Name cant be Empty' },
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Lastname cant be null' },
        notEmpty: { msg: 'Last Name cant be Empty' },
      }
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: 'dateOfBirth cant be null' },
        notEmpty: { msg: 'Date Of Birth cant be Empty' },
        minAge(value) {
          let ages = new Date().getFullYear() - value.getFullYear()
          if (ages < 17) {
            throw new Error('Minimum Age are 17!')
          }
        }
      }
    },
    education: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Education cant be null' },
        notEmpty: { msg: 'Education cant be Empty' }
      }
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Position cant be null' },
        notEmpty: { msg: 'Position cant be Empty' },
        position(value) {
          if (this.education === "S2" || this.education === "S3") {
            if (value !== "Manager" && value !== "CEO") {
              throw new Error(`Education ${this.education} Must Be Manager/CEO!`)
            }
          }
        }
      }
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Salary cant be Empty' },
      }
    },
    StoreId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Employees',
  });
  return Employees;
};