const customErrorHandler = require("../error/customErrorHandler");
const userModel = require("../models/auth.model/register.model");
const cloudinary = require("cloudinary").v2;

exports.userUpdate = async (req, res) => {
  const { name, address } = req.body;
  if (!req.params.id) {
    return res.status(400).json({ message: "ID is required." });
  }
  try {
    const userId = await userModel.findOne({ where: { id: req.params.id } });
    if (!userId) {
      return res.status(400).json({ message: "Id not valid" });
    }

    const [affectedRows, updatedRows] = await userModel.update(
      {
        name,
        address,
      },
      { where: { id: req.params.id }, returning: true }
    );
    if (!updatedRows) {
      return res.status(400).json({ message: "Update failed" });
    }
    res.status(200).json({ message: "Update successful" });

    if (req.files !== undefined) {
      // delete Old Image
      await cloudinary.uploader.destroy(userId.profile);
      const imageFile = req.files.profile;
      const imagePath = imageFile.tempFilePath;
      const profileUrl = await cloudinary.uploader.upload(imagePath, {
        folder: "Next_Mart/profile",
        resource_type: "image",
      });

      await userModel.update({
        profile: profileUrl.secure_url,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
