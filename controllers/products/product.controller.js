const customErrorHandler = require("../../error/customErrorHandler");
const {
  productModels,
  userModels,
  imagesModels,
  reviewModels,
  categoryModels,
} = require("../../models/models");
const path = require("path");
const fs = require("fs");

exports.createProducts = async (req, res, next) => {
  const { name, price, description, discount_price } = req.body;
  if (!name || !price || !description || !discount_price) {
    return next(customErrorHandler.requiredField());
  }
  try {
    req.body;
    const selling_price = price;
    const discounted_price = discount_price;
    const discounted_percentage =
      ((selling_price - discounted_price) / selling_price) * 100;
    const Product = await productModels.create({
      name,
      price,
      description,
      discount_price,
      discount_percentage: discounted_percentage,
      categoryId: req.body.categoryId,
    });
    if (!Product || !Product.length === 0) {
      res.status(400).json({
        status: false,
        message: "product create Failed",
      });
      return;
    }
    res.status(201).json({
      status: true,
      message: "product create successfully",
    });

    if (req.files !== undefined && !req.files.length > 0) {
      const imageFiles = req.files;
      try {
        const productImages = [];
        for (let i = 0; i < imageFiles.length; i++) {
          const imagePath = `${imageFiles[i].filename}`;
          await imagesModels.create({
            productId: insertProduct.id,
            images: imagePath,
          });
          productImages.push(imagePath);
        }
      } catch (error) {
        const fileNames = imageFiles.map((img) => {
          return img;
        });
        const folderPath = path.join(process.cwd(), "public/product");
        fileNames.forEach((fileName) => {
          const filePath = path.join(folderPath, fileName);
          fs.unlink(filePath, (error) => {
            if (error) {
              console.log(`Failed to delete: ${error.message}`);
            }
          });
        });
      }
    }
  } catch (error) {
    return next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const products = await productModels.findAll({
      include: [
        {
          model: categoryModels,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: reviewModels,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        {
          model: imagesModels,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
    });

    if (!products || products.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No products found",
      });
    }

    const productData = products.map((product) => ({
      Product: {
        id: product.id,
        name: product.name,
        price: product.price,
        discount_price: product.discount_price,
        discount_percentage: product.discount_percentage,
        // stock: product.stock,
        // description: product.description,
        Reviews: product.Reviews,
        ProductImages: product.ProductImages,
        Category: product.Category, // Including the Category association
      },
    }));

    return res.status(200).json(productData);
  } catch (error) {
    return next(error);
  }
};

// Update Image

exports.updateProduct = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// Update Image Single Or Multiple Image

exports.updateImage = async (req, res) => {
  try {
  } catch (error) {}
};

exports.deleteProduct = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

//------------------------ Review  Sections -------------------------------

// Create Reviews || POST
exports.createReview = async (req, res, next) => {
  const { message, rating, productId, userId } = req.body;
  if (!message || !rating || !productId) {
    return next(customErrorHandler.requiredField());
  }
  try {
    const review = await reviewModels.create({
      message,
      rating,
      productId,
    });
    if (!review || !review.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to create review",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    return next(error);
  }
};

// Update Reviews || Fetch
exports.updateReview = async (req, res, next) => {
  if (!req.params.id) {
    return next(customErrorHandler.requiredField());
  }

  try {
    // Check if the review exists
    const review = await reviewModels.findOne({ where: { id: req.params.id } });
    if (!review) {
      return next(customErrorHandler.notFound());
    }

    // Update the review in the database
    const updatedReview = await reviewModels.update(
      {
        message: req.body.message,
        rating: req.body.rating,
      },
      { where: { id: review.id }, returning: true }
    );

    if (!updatedReview[0]) {
      return res.status(500).json({
        success: false,
        message: "Failed to update review",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: updatedReview[1][0], // The updated review
    });
  } catch (error) {
    return next(error);
  }
};

// Delete Review

exports.deleteReview = async (req, res, next) => {
  if (req.params.id) {
    return next(customErrorHandler.requiredField());
  }
  try {
    const review = await reviewModels.findOne({ where: { id: req.params.id } });
    if (!review) {
      return next(customErrorHandler.notFound());
    }
    const delete_review = await reviewModels.destroy({
      where: { id: review.id },
    });
    if (!delete_review) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete review",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

// get review
