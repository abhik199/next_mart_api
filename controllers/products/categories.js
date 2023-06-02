const cloudinary = require("cloudinary").v2;
const categoriesModels = require("../../models/productsModels/categories");

exports.productCategories = async (req, res, next) => {
  try {
    const category = req.body;

    const findCategoriesPromise = categoriesModels.findOne({
      where: { name: category.name },
    });

    const [findCategories, imageFile] = await Promise.all([
      findCategoriesPromise,
      req.files?.icon,
    ]);

    // if (findCategories) {
    //   return res.status(409).send({ msg: "This category already exists" });
    // }

    // Image Code using Cloudinary
    const Icon = {};
    if (imageFile) {
      const imagePath = imageFile.tempFilePath;
      const uploadOptions = {
        folder: "Next_Mart/category_icon",
        resource_type: "image",
      };

      const iconUrlPromise = cloudinary.uploader.upload(
        imagePath,
        uploadOptions
      );
      Icon.icon = (await iconUrlPromise).secure_url;
    }

    let createCategory;
    if (Object.keys(Icon).length !== 0) {
      createCategory = await categoriesModels.create(
        Object.assign(category, Icon)
      );
    } else {
      createCategory = await categoriesModels.create(category);
    }

    if (!createCategory) {
      return res.status(500).send({
        success: false,
        message: "Category addition failed",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Category addition successful",
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
