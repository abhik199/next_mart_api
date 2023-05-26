const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// Carousel Image Sliders

const Carousel = sequelize.define("Carousel", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subTitle: {
    type: DataTypes.STRING,
    allowNull: null,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize
  .sync()
  .then((res) => {
    console.log("Table Created");
  })
  .catch((err) => {
    console.log("Failed");
  });

module.exports = Carousel;
