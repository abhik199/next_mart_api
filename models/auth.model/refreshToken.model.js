const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connection");

// Date and Time

const RefreshToken = sequelize.define("RefreshToken", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

sequelize
  .sync()
  .then((res) => {
    console.log("table created");
  })
  .catch((err) => {
    console.log("failed");
  });

module.exports = RefreshToken;
