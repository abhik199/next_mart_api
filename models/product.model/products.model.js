const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connection");
const Category = require("./categories.model");
const userModel = require("../../models/auth.model/register.model");

const Product = sequelize.define("Product", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
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
    allowNull: false,
  },
  stock: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 50,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: "id",
    },
  },
});

Category.hasMany(Product, {
  foreignKey: "categoryId",
});
Product.belongsTo(Category, {
  foreignKey: "categoryId",
});

Product.sync({ alter: true })
  .then((res) => {
    console.log("Created");
  })
  .catch((err) => {
    console.log(err.message);
  });
module.exports = Product;
