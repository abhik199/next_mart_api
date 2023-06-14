const refreshTokenModel = require("../models/auth.model/refreshToken.model");
const customErrorHandler = require("../error/customErrorHandler");

exports.logoutUser = async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return next(customErrorHandler.requiredField("token"));
  }

  try {
    const logOut = await refreshTokenModel.destroy({
      where: { refreshToken: token },
    });

    if (!logOut) {
      return res.status(400).json({ msg: "User logout failed" });
    }

    return res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Logout successful" });
  } catch (error) {
    next(error);
    return;
  }
};
