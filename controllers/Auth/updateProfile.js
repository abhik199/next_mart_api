const customErrorHandler = require("../../error/customErrorHandler");
const userModel = require("../../models/register");
const url = "http://localhost:3200/";
const folder = "profile/";

//-------Profile Update ---------------------

exports.userUpdate = async (req, res, next) => {
  try {
    const { name, address } = req.body;
    const { id } = req.params;
    const existingUser = await userModel.findOne({
      where: { id: id },
    });

    if (!existingUser) {
      return next(customErrorHandler.alreadyExist());
    }

    const updatedUser = await userModel.update(
      {
        name,
        address,
      },
      { where: { id }, returning: true }
    );

    if (updatedUser[0] === 0 || !updatedUser[1][0]) {
      return res.status(409).json({
        success: false,
        message: "User update failed.",
      });
    }

    const updatedUserProfile = {};

    if (req.file !== undefined) {
      updatedUserProfile.profile = `${url}${folder}${req.file.filename}`;
    }

    if (Object.keys(updatedUserProfile).length !== 0) {
      await userModel.update(updatedUserProfile, { where: { id } });
    }

    res.status(200).json({
      success: true,
      message: "User update done.",
    });
  } catch (error) {
    return next(error);
  }
};
