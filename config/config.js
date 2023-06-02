require("dotenv").config();

module.exports = {
  REFRESH_SECRET: process.env.REFRESH_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
  email: process.env.email,
  password: process.env.password,
  url: process.env.url,
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
};
