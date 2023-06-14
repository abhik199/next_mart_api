const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/auth.model/register.model");
const customErrorHandler = require("../error/customErrorHandler");
const { JWT_SECRET, REFRESH_SECRET } = require("../config/config");
const refreshTokenModel = require("../models/auth.model/refreshToken.model");

// ------------------userLogin ------------------------------

exports.userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(customErrorHandler.requiredField());
  }

  try {
    const user = await userModel.findOne({
      where: { email: email },
    });
    if (!user) {
      return next(customErrorHandler.notFound());
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return next(customErrorHandler.wrongCredentials());
    }
    if (user.isVerify !== true) {
      return res.status(404).json({ message: "User is not verified" });
    }
    let clearToken;
    try {
      const token = req.cookies.access_token;
      clearToken = await jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return next(new Error("Failed to verify token"));
    }

    if (clearToken) {
      return res.status(403).json({ error: "User is already logged in" });
    }

    const access_token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Refresh Token
    const refresh_token = await jwt.sign(
      { id: user.id, email: user.email },
      REFRESH_SECRET,
      { expiresIn: "1y" }
    );
    const createToken = await refreshTokenModel.create({
      refreshToken: refresh_token,
    });
    if (!createToken) {
      return res.status(500).json({ error: "Failed to create refresh token" });
    }

    return res
      .cookie("access_token", access_token, {
        httpOnly: true,
      })
      .json({
        success: true,
        access_token: access_token,
        refresh_token: refresh_token,
      });
  } catch (error) {
    return next(error);
  }
};
