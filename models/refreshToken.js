const { DataTypes } = require("sequelize");
const sequelize = require("../config/connection");

// Date and Time
const date = require("date-and-time");
const now = new Date();
const value = date.format(now, "YYYY/MM/DD HH:mm");

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
  current_time: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: value,
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
