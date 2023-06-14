// const cloudinary = require("cloudinary").v2;
const categoriesModels = require("../../models/product.model/categories.model");
const productModels = require("../../models/product.model/products.model");
const productImages = require("../../models/product.model/productImage.model");
const customErrorHandler = require("../../error/customErrorHandler");
const path = require("path");
const fs = require("fs");

exports.productCategories = async (req, res, next) => {
  if (!req.body.name) {
    return next(customErrorHandler.requiredField());
  }
  try {
    // console.log(req.file);
    const insertCategory = await categoriesModels.create(req.body);
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
    if (req.file !== undefined && !req.file.length > 0) {
      const image_url = `${req.file.filename}`;
      try {
        await categoriesModels.update(
          {
            icon: image_url,
          },
          {
            where: {
              id: insertCategory.id,
            },
            returning: true,
          }
        );
      } catch (error) {
        console.log(error);
        const folderPath = path.join(process.cwd(), "public/icon");
        const filePath = path.join(folderPath, image_url);
        fs.unlink(filePath, (error) => {
          if (error) {
            console.log(`Failed to delete: ${error.message}`);
          }
        });
      }
    }
  } catch (error) {
    return next(error);
  }
};

// GET All Category
exports.getCategory = async (req, res, next) => {
  try {
    const getCat = await categoriesModels.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!getCat || !getCat.length === 0) {
      res.status(404).json({
        status: false,
        message: "Category not found",
      });
      return;
    }
    return res.status(200).json({
      status: true,
      message: "category found",
      category: getCat,
    });
  } catch (error) {
    return next(error);
  }
};

// Find product Category Base

// exports.categoryProducts = async (req, res) => {
//   const { id } = req.params;
//   if (!id) {
//     return res.status(400).json({ msg: "Category ID is required" });
//   }

//   try {
//     const category = await categoriesModels.findByPk(id, {
//       attributes: { exclude: ["createdAt", "updatedAt"] },
//       include: [
//         {
//           model: productModels,
//           attributes: { exclude: ["createdAt", "updatedAt"] },
//         },
//       ],
//     });

//     if (!category) {
//       return res.status(404).json({ msg: "Category not found" });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Products retrieved successfully",
//       category,
//     });
//   } catch (error) {
//     console.log(error.message);
//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//     });
//   }
// };

exports.categoryProducts = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(customErrorHandler.requiredField());
  }

  try {
    const category = await categoriesModels.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        {
          model: productModels,
          attributes: { exclude: ["createdAt", "updatedAt"] },
          include: [
            {
              model: productImages,
              attributes: { exclude: ["createdAt", "updatedAt"] },
            },
          ],
        },
      ],
    });

    if (!category) {
      return next(customErrorHandler.notFound());
    }

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      category,
    });
  } catch (error) {
    return next(error);
  }
};

// Delete Category

exports.deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(customErrorHandler.requiredField("ID is required"));
  }
  try {
    // Image Delete
    const fileName = await categoriesModels.findOne({ where: { id: id } });
    if (!fileName) {
      return next(customErrorHandler.notFound());
    }
    const folderPath = path.join(process.cwd(), "public/icon");
    const filePath = path.join(folderPath, fileName.icon);

    fs.unlink(filePath, (error) => {
      if (error) {
        console.log(`Failed to delete ${fileName}: ${error.message}`);
      }
    });
    const categoryDel = await categoriesModels.destroy({
      where: { id: fileName.id },
    });
    if (!categoryDel) {
      // return next(customErrorHandler.deleteFailed());
      return res.status(400).json({ message: "Failed Delete" });
    }
    // return next(customErrorHandler.deleteSuccess());
    return res.status(200).json({ message: "Delete Done" });
  } catch (error) {
    return next(error);
  }
};

// update Category

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return new (customErrorHandler.requiredField())();
  }
  try {
    const update = await categoriesModels.findByPk(id);

    if (!update) {
      return res.status(404).json({ msg: "Id not found" });
    }
    const [affectedRows] = await categoriesModels.update(req.body, {
      where: { id: update.id },
    });

    if (affectedRows === 0) {
      return res.status(400).json({ message: "Update failed" });
    }

    if (req.file !== undefined && !req.file.length > 0) {
      try {
        if (update.icon) {
          const folderPath = path.join(process.cwd(), "public/icon");
          const filePath = path.join(folderPath, update.icon);
          fs.unlink(filePath, (error) => {
            if (error) {
              console.log(`Failed to delete ${update.icon}: ${error.message}`);
            }
          });
        }
        await categoriesModels.update(
          {
            icon: req.file.filename,
          },
          { where: { id: update.id } }
        );
        return res.status(200).json({ message: "Update successful" });
      } catch (error) {
        const folderPath = path.join(process.cwd(), "public/icon");
        const filePath = path.join(folderPath, req.file.filename);
        fs.unlink(filePath, (error) => {
          if (error) {
            console.log(`Failed to delete: ${error.message}`);
          }
        });
      }
    }
    res.status(200).json({ message: "Update successful" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Get Product HashCode
