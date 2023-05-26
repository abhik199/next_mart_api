const refreshTokenModel = require("../../models/refreshToken");

exports.logoutUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const logOut = await refreshTokenModel.destroy({ where: { id: id } });
    if (!logOut) {
      res.status(400).json({ msg: "User logout failed" });
      return;
    }
    return res.status(200).json({ msg: "User logout Successfully" });
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
};
