const { REFRESH_SECRET } = require("../../config/config");
const jwt = require("jsonwebtoken");
const refreshTokenModel = require("../../models/refreshToken");

exports.refreshToken = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};
