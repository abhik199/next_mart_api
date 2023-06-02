const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connection");
const Category = require("./categories");

const Sub_Category = sequelize.define("Sub_Category", {
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
});

Sub_Category.belongsTo(Category, {
  foreignKey: "category_id",
});

Category.hasMany(Sub_Category, {
  foreignKey: "category_id",
});

sequelize
  .sync()
  .then(() => {
    console.log("Sub_Category table created");
  })
  .catch((error) => {
    console.log("Failed to create Sub_Category table:", error);
  });

module.exports = Sub_Category;
