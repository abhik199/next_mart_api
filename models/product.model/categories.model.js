const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connection");
const Register = require("../auth.model/register.model");

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "Category is required",
      },
    },
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Register.hasMany(Category, {
  foreignKey: "id",
});

// Create the table
Category.sync({ alter: false });

module.exports = Category;
