require("dotenv").config();

module.exports = {
  REFRESH_SECRET: process.env.REFRESH_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  email: process.env.email,
  password: process.env.password,
};
