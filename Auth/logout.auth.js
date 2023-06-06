const refreshTokenModel = require("../models/auth.model/refreshToken.model");

exports.logoutUser = async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return res.status(400).json({ message: "Token is required." });
  }
  try {
    const logOut = await refreshTokenModel.destroy({
      where: { refreshToken: token },
    });
    if (!logOut) {
      res.status(400).json({ msg: "User logout failed" });
      return;
    }
    return res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Successfully logged out 😏 🍀" });
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};
