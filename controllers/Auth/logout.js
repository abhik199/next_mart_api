const refreshTokenModel = require("../../models/authModels/refreshToken");

exports.logoutUser = async (req, res, next) => {
  try {
    const { token } = req.params;
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
