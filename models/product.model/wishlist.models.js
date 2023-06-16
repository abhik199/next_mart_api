const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connection");
const User = require("../auth.model/register.model");
const Product = require("./products.model");

const Wishlist = sequelize.define("Wishlist", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: "id",
      ss,
    },
  },
});

Wishlist.sync();

Wishlist.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Wishlist, { foreignKey: "userId" });

Wishlist.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Wishlist, { foreignKey: "productId" });
module.exports = Wishlist;
