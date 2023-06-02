const userModel = require("../../models/authModels/register");
const bcrypt = require("bcrypt");

exports.changePassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const user = await userModel.findOne({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ msg: "Email not found" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateResult = await userModel.update(
      { password: hashedPassword },
      { where: { email: email } }
    );

    if (updateResult[0] === 0) {
      return res.status(500).json({ msg: "Failed to update password" });
    }

    return res.json({ msg: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "An error occurred while changing the password" });
  }
};
