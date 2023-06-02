const { REFRESH_SECRET, JWT_SECRET } = require("../../config/config");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/authModels/register");
const refreshTokenModel = require("../../models/authModels/refreshToken");

exports.refreshToken = async (req, res, next) => {
  try {
    // get body
    const { refresh_Token } = req.body;
    const findToken = await refreshTokenModel.findOne({
      where: { refreshToken: refresh_Token },
    });

    if (!findToken) {
      return res.status(400).json({
        msg: "Token is invalid",
      });
    }
    // find out token stored in jwt token
    const { email } = await jwt.verify(findToken.refreshToken, REFRESH_SECRET);
    const userEmail = email;

    // find out user
    const user = await userModel.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    const access_token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const refresh_token = jwt.sign({ email: user.email }, REFRESH_SECRET, {
      expiresIn: "1y",
    });

    // database whitelist
    const createdToken = await refreshTokenModel.create({
      refreshToken: refresh_token,
    });

    if (!createdToken) {
      return res.status(500).json({
        msg: "new token create failed",
      });
    }

    return res
      .status(200)
      .json({ msg: "new token created", access_token, refresh_token });
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};
