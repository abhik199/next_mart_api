const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connection");
const userModel = require("../../models/auth.model/register.model");
const productModel = require("../../models/product.model/products.model");

const Review = sequelize.define("Review", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      len: [0, 5], //  only allow values with length between 0 and 5
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: productModel,
      key: "id",
    },
  },
  //   userId: {
  //     type: DataTypes.INTEGER,
  //     allowNull: false,
  //     references: {
  //       model: userModel,
  //       key: "id",
  //     },
  //   },
});
productModel.hasMany(Review, {
  foreignKey: "productId",
});

Review.sync({ alter: true });
module.exports = Review;
