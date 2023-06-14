const jwt = require("jsonwebtoken");
const { REFRESH_SECRET, JWT_SECRET } = require("../config/config");
const userModel = require("../models/auth.model/register.model");
const refreshTokenModel = require("../models/auth.model/refreshToken.model");
const customErrorHandler = require("../error/customErrorHandler");

exports.refreshToken = async (req, res, next) => {
  const { refresh_Token } = req.body;
  if (!refresh_Token) {
    return next(customErrorHandler.requiredField("refresh_Token"));
  }

  try {
    const findToken = await refreshTokenModel.findOne({
      where: { refreshToken: refresh_Token },
    });

    if (!findToken) {
      return next(customErrorHandler.notFound("Token"));
    }

    // Verify the refresh token
    const decodedToken = jwt.verify(findToken.refreshToken, REFRESH_SECRET);
    const userEmail = decodedToken.email;

    // Find the user
    const user = await userModel.findOne({ where: { email: userEmail } });
    if (!user) {
      return next(customErrorHandler.notFound("User"));
    }

    // Generate new access token
    const access_token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Generate new refresh token
    const refresh_token = jwt.sign({ email: user.email }, REFRESH_SECRET, {
      expiresIn: "1y",
    });

    // Store the new refresh token in the database
    const createdToken = await refreshTokenModel.create({
      refreshToken: refresh_token,
    });

    if (!createdToken) {
      return next(customErrorHandler.databaseError());
    }

    return res.status(200).json({ access_token, refresh_token });
  } catch (error) {
    return next(error);
  }
};
