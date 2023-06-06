const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connection");

const Category = sequelize.define("Category", {
  Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },

  category_name: {
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

// Create the table
Category.sync();

module.exports = Category;
