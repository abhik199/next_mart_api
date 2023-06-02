const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connection");

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

// Create the table
Category.sync()
  .then(() => {
    console.log("Category table created");
  })
  .catch((error) => {
    console.log("Failed to create Category table:", error);
  });

module.exports = Category;
