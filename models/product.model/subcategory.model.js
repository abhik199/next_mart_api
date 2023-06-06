const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connection");
const Category = require("./categories.model");

const SubCategory = sequelize.define("SubCategory", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  subcategory_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: "categoryId",
    },
  },
});

SubCategory.sync();

module.exports = SubCategory;
