const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connection");
const product = require("./products.model");

const productImage = sequelize.define("ProductImage", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  images: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: product,
      key: "id",
    },
  },
});

product.hasMany(productImage, {
  foreignKey: "productId",
});
productImage.belongsTo(product, {
  foreignKey: "productId",
});

productImage
  .sync({ alter: true })
  .then((res) => {
    console.log("Created");
  })
  .catch((err) => {
    console.log("failed");
  });

module.exports = productImage;
