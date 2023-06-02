const customErrorHandler = require("../../error/customErrorHandler");
const userModel = require("../../models/authModels/register");
const cloudinary = require("cloudinary").v2;

exports.userUpdate = async (req, res, next) => {
  try {
    const user = req.body;
    const { id } = req.body;
    const Profile = {};

    if (req.files !== undefined) {
      // Remove Old Profile Image
      const findUrl = await userModel.findOne({ where: { id: id } });
      const removeOldProfile = await cloudinary.uploader.destroy(
        findUrl.profile
      );
      console.log(removeOldProfile);

      const imageFile = req.files.profile;
      const imagePath = imageFile.tempFilePath;
      const profileUrl = await cloudinary.uploader.upload(imagePath, {
        folder: "Next_Mart/profile",
        resource_type: "image",
      });
      Profile.profile = profileUrl.secure_url;
    }

    const User = {
      name: user.name,
      address: user.address,
    };

    let updateUser;
    if (Object.keys(Profile).length !== 0) {
      updateUser = await userModel.update(
        { ...User, ...Profile },
        {
          where: { id: id },
          returning: true, // Specify returning option to get the updated user details
        }
      );
    } else {
      updateUser = await userModel.update(
        { ...User },
        {
          where: {
            id: id,
          },
          returning: true, // Specify returning option to get the updated user details
        }
      );
    }
    if (!updateUser) {
      res.status(500).json({
        success: false,
        message: "User Updated failed",
      });
      return;
    }
    return res.status(200).json({
      success: true,
      message: "User updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};
