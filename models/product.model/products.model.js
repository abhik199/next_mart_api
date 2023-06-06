const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connection");
const subCategory = require("./subcategory.model");

const Products = sequelize.define("Product", {
  Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discount_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discount_percentage: {
    type: DataTypes.FLOAT,
  },
  tag: {
    type: DataTypes.STRING,
  },
  product_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  Id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: subCategory,
      key: "subcategoryId",
    },
  },
});

Products.sync();
module.exports = Products;
