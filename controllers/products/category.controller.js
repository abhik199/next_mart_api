const cloudinary = require("cloudinary").v2;
const categoriesModels = require("../../models/product.model/categories.model");

exports.productCategories = async (req, res, next) => {
  try {
    const category = req.body;
    const insertCategory = await categoriesModels.create(category);
    if (!insertCategory || insertCategory.length === 0) {
      res.status(400).json({
        status: false,
        message: "Category create failed",
      });
    }
    res.status(201).json({
      status: true,
      message: "category create successfully",
    });

    // Image Upload
    if (req.files !== undefined) {
      const imageFile = req.files.icon;
      const imagePath = imageFile.tempFilePath;
      const iconImage = await cloudinary.uploader.upload(imagePath, {
        folder: "Next_Mart/category_icon",
        resource_type: "image",
      });
      console.log(iconImage);
      await categoriesModels.update(
        {
          icon: iconImage.secure_url,
        },
        {
          where: {
            categoryId: insertCategory.categoryId,
          },
          returning: true,
        }
      );
    }
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
