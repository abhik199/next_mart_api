const sequelize = require("../config/connection");
const { DataTypes } = require("sequelize");

const forgotPassword = sequelize.define("ForgotPassword", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
});

sequelize
  .sync()
  .then((res) => {
    console.log("Table created");
  })
  .catch((err) => {
    console.log("Failed");
  });

module.exports = forgotPassword;
