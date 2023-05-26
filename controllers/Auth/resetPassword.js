const userModel = require("../../models/register");
const bcrypt = require("bcrypt");

exports.resetPassword = async (req, res, next) => {
  try {
    // verify old password

    const { email, oldPassword, newPassword } = req.body;
    const user = await userModel.findOne({
      where: { email: email },
    });
    if (!user) {
      return res.status(409).json({ msg: "Email is not found" });
    }
    const verifyPassword = await bcrypt.compare(oldPassword, user.password);
    if (!verifyPassword) {
      return res.status(409).json({ msg: "Password is not find" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    const updatePassword = await userModel.update(
      {
        password: hashPassword,
      },
      { where: { email: email } }
    );
    if (!updatePassword) {
      return res.status(401).json({ msg: "update Failed" });
    }
    return res.json({ msg: "Password Done" });
  } catch (error) {
    console.log(error);
  }
};
