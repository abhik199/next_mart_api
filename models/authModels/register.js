const { DataTypes } = require("sequelize");
const sequelize = require("../../config/connection");

const Register = sequelize.define("Register", {
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
  profile: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "https://img.freepik.com/free-icon/user_318-159711.jpg",
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: [true, "Email is already exist"],
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verificationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isVerify: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

sequelize
  .sync()
  .then((res) => {
    console.log("table created");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = Register;
