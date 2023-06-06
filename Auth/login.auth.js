const { DataTypes } = require("sequelize");
const userModel = require("../models/auth.model/register.model");
const bcrypt = require("bcrypt");
const customErrorHandler = require("../error/customErrorHandler");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, REFRESH_SECRET } = require("../config/config");
const refreshTokenModel = require("../models/auth.model/refreshToken.model");

// ------------------userLogin ------------------------------

exports.userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const user = await userModel.findOne({
      where: { email: email },
    });
    if (!user) {
      return res.status(404).json({ message: "email not found" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }
    console.log(user, match);

    if (user.isVerify !== true) {
      return res.status(404).json({ message: "User is not verified" });
    }
    let clearToken;
    try {
      const token = req.cookies.access_token;
      clearToken = await jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.log(error);
    }

    if (clearToken) {
      return res.status(200).json({
        msg: "User is Already login",
        username: user.name,
        email: user.email,
      });
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
