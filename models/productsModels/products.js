const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connection");
const Sub_Category = require("./subCategory");

const Products = sequelize.define("Products", {
  products_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  subCategory_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Sub_Category,
      key: "SubCategory_id",
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Product name is required",
      },
    },
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Brand name is required",
      },
    },
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Product price is required",
      },
    },
  },
  discount_price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Discount price is required",
      },
    },
  },
  discount_percentage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Discount percentage is required",
      },
    },
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Products.belongsTo(Sub_Category, {
  foreignKey: "subCategory_id",
});

Sub_Category.hasMany(Products, {
  foreignKey: "subCategory_id",
});

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("Products table created");
  })
  .catch((error) => {
    console.log("Failed to create Products table:", error);
  });

module.exports = Products;
