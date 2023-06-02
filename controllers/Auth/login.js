const { DataTypes } = require("sequelize");
const userModel = require("../../models/authModels/register");
const bcrypt = require("bcrypt");
const customErrorHandler = require("../../error/customErrorHandler");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, REFRESH_SECRET } = require("../../config/config");
const refreshTokenModel = require("../../models/authModels/refreshToken");

// ------------------userLogin ------------------------------

exports.userLogin = async (req, res, next) => {
  try {
    // Verify User
    const verifyUser = await userModel.findOne({ where: { isVerify: 1 } });
    if (!verifyUser) {
      return next(
        customErrorHandler.alreadyExist("Please Verify email id before login")
      );
    }
    // verify Email account
    const verifyEmail = await userModel.findOne({
      where: { email: req.body.email },
    });
    if (!verifyEmail) {
      return next(customErrorHandler.wrongCredentials());
    }
    // Compare Password
    const match = await bcrypt.compare(req.body.password, verifyEmail.password);
    if (!match) {
      return next(customErrorHandler.wrongCredentials());
    }
    let clearToken;
    try {
      const token = req.cookies.access_token;
      clearToken = await jwt.verify(token, JWT_SECRET);
      console.log(clearToken);
    } catch (error) {
      console.log(error);
    }

    if (clearToken) {
      return res.status(200).json({
        msg: "User is Already login",
        username: verifyEmail.name,
        email: verifyEmail.email,
      });
    }

    const access_token = jwt.sign(
      { id: verifyEmail.id, email: verifyEmail.email },
      JWT_SECRET,
      {
        expiresIn: "10s",
      }
    );

    // Refresh Token
    const refresh_token = await jwt.sign(
      { id: verifyEmail.id, email: verifyEmail.email },
      REFRESH_SECRET,
      { expiresIn: "1y" }
    );
    const createToken = await refreshTokenModel.create({
      refreshToken: refresh_token,
    });
    if (!createToken) {
      return res.json({
        success: false,
        message: "User Login Failed",
      });
    }

    return res
      .cookie("access_token", access_token, {
        httpOnly: true,
      })
      .json({
        success: true,
        message: "User Login Successfully",
        access_token: access_token,
        refresh_token: refresh_token,
      });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
