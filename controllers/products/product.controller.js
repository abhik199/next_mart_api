const path = require("path");
const fs = require("fs");
const { Op } = require("sequelize");

const customErrorHandler = require("../../error/customErrorHandler");
const {
  productModels,
  userModels,
  imagesModels,
  reviewModels,
  categoryModels,
  cardModels,
} = require("../../models/models");

//-------------------  Product Section ----------------------------------------

// CreateProduct

exports.createProducts = async (req, res, next) => {
  const { name, price, description, discount_price } = req.body;
  if (!name || !price || !description || !discount_price) {
    return next(customErrorHandler.requiredField());
  }
  try {
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

    if (req.files !== undefined && req.files.length > 0) {
      console.log(req.files);
      const imageFiles = req.files.filename;
      try {
        const productImages = [];
        for (let i = 0; i < imageFiles.length; i++) {
          const imagePath = `${imageFiles[i].filename}`;
          await imagesModels.create({
            productId: Product.id,
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

// Get Product
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

// Update  Product

exports.updateProduct = async (req, res) => {
  try {
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// --------------------------- Product Image Section   ----------------------------------------

exports.updateImage = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(customErrorHandler.requiredField());
  }
  try {
    if (req.files !== undefined && req.files.length === 0) {
      const imageFiles = req.files.filename;
      const fileNames = imageFiles.map((img) => {
        return img;
      });
      const folderPath = path.join(process.cwd(), "public/product");
      try {
        const imgFind = await imagesModels.findOne({ where: { id: id } });
        if (!imgFind) {
          return next(customErrorHandler.notFound());
        }
        fileNames.forEach((fileName) => {
          const filePath = path.join(folderPath, fileName);
          fs.unlink(filePath, (error) => {
            if (error) {
              console.log(`Failed to delete: ${error.message}`);
            }
          });
        });
        const updateImg = await imagesModels.update({
          images: imageFiles,
        });
      } catch (error) {
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

exports.deleteImage = async (req, res, next) => {
  const { ids } = req.params;
  const imageIds = ids.split("-");
  try {
    const images = await imagesModels.findAll({
      where: {
        id: imageIds,
      },
    });

    const fileUrl = images.map((img) => {
      return img.images;
    });

    const fileNames = fileUrl.map((imageUrl) => {
      return imageUrl;
    });
    console.log(fileNames);
    const folderPath = path.join(process.cwd(), "public/product"); // Adjust

    fileNames.forEach((fileName) => {
      const filePath = path.join(folderPath, fileName);

      fs.unlink(filePath, (error) => {
        if (error) {
          console.log(`Failed to delete ${fileName}: ${error.message}`);
        }
      });
    });

    if (!images || images.length === 0) {
      return next(customErrorHandler.notFound());
    }
    await imagesModels.destroy({
      where: {
        id: imageIds,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Images deleted successfully",
    });
  } catch (error) {
    return next(error);
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

//------------------------ pagination -----------------------------

exports.Pagination = async (req, res, next) => {
  const { page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const counts = await productModels.count();
    const { count, rows } = await productModels.findAndCountAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },

      include: [
        {
          model: imagesModels,
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
      offset,
      limit: +limit,
    });

    const totalPages = Math.ceil(counts / limit);

    res.json({
      products: rows,
      currentPage: +page,
      totalPages,
      totalData: count,
    });
  } catch (error) {
    return next(error);
  }
};

// ------------------- Product Search ------------------[-----]

exports.productSearch = async (req, res, next) => {
  const { query } = req.query;
  if (!query) {
    return next(customErrorHandler.requiredField());
  }
  try {
    const products = await productModels.findAll({
      where: {
        name: { [Op.like]: `%${query}%` },
      },
    });

    if (products.length === 0) {
      return next(customErrorHandler.notFound());
    }

    return res.status(200).json({ message: "Products found", products });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

// ---------------------Price Filter -----------------------------

exports.priceFilter = async (req, res, next) => {
  const { minPrice, maxPrice } = req.query;
  if (!minPrice || !maxPrice) {
    return next(customErrorHandler.requiredField());
  }
  try {
    const product = await productModels.findAll({
      where: { price: { [Op.between]: [minPrice, maxPrice] } },
    });
    if (!product || !product === 0) {
      return next(customErrorHandler.notFound());
    }
    return res.status(200).json({ message: "Products found", product });
  } catch (error) {
    return next(error);
  }
};

// ---------- Product Search by category ----------------------------

exports.productSearchByCategory = async (req, res, next) => {
  if (!req.query.query) {
    return next(customErrorHandler.requiredField());
  }
  try {
    const category = await categoryModels.findOne({
      where: { name: req.query.query },
    });
    if (!category || category.length === 0) {
      return next(customErrorHandler.notFound());
    }
    // Check product base on id
    const product = await productModels.findByPk(category.categoryId, {
      include: {
        model: categoryModels,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    });
    if (!product || !product.length === 0) {
      return next(customErrorHandler.notFound());
    }
    return res.status(200).json({ message: "Products found", product });
  } catch (error) {
    return next(error);
  }
};

// ------------------ Card Section ---------------------------------------

exports.createCard = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(customErrorHandler.requiredField());
  }
  try {
    const product = await productModels.findByPk(id, {
      attributes: ["id", "name", "price", "stock"],
    });
    if (!product || !product.length === 0) {
      return next(customErrorHandler.notFound());
    }
    if (!(req.body.quantity <= product.stock)) {
      return res.status(400).json({
        message: "Insufficient stock",
        available_Stock: product.stock,
      });
    }

    const createCard = await cardModels.create({
      name: product.name,
      price: product.price,
      stock: product.stock,
      quantity: req.body.quantity,
      subtotal: product.price * req.body.quantity,
      productId: product.id,
      userId: req.body.userId,
    });
    if (!createCard) {
      return res.status(400).json({ message: "Card Failed" });
    }
    const [affectedRows] = await productModels.update(
      {
        stock: product.stock - req.body.quantity,
      },
      { where: { id: product.id } }
    );

    const updatedProduct = await productModels.findByPk(product.id);

    if (updatedProduct.stock <= 5) {
      await productModels.update(
        {
          stock: 100,
        },
        { where: { id: product.id } }
      );
    }

    return res.send(createCard);
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

exports.updateCard = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(customErrorHandler.requiredField());
  }
  try {
    const user = await userModels.findOne({ where: { id: id } });
    if (!user) {
      return next(customErrorHandler.notFound());
    }
    const updateCard = await cardModels.update({
      quantity: req.body.quantity,
      subtotal: product.price * req.body.quantity,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getCard = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(customErrorHandler.requiredField());
  }
  try {
    const user = await userModels.findOne({ where: { id: id } });
    if (!user) {
      return next(customErrorHandler.notFound());
    }

    const product = await cardModels.findAll({
      model: userModels,
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!product || product.length === 0) {
      return next(customErrorHandler.notFound());
    }
    return res.status(200).json({
      product,
    });
  } catch (error) {
    return next(error);
  }
};

exports.deleteCard = async (req, res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};

// ------------------- getRelatedProducts ----------------

// category and price related product
exports.getRelatedProducts = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(customErrorHandler.requiredField());
  }
  try {
    const product = await productModels.findByPk(id);
    if (!product) {
      return next(customErrorHandler.notFound());
    }
    const relatedProducts = await productModels.findAll({
      where: {
        categoryId: product.categoryId,
        price: { [Op.gt]: [product.price] },
      },
      limit: 5,
    });
    if (!relatedProducts || !relatedProducts.length === 0) {
      return next(customErrorHandler.notFound());
    }
    return res.status(200).json({ relatedProducts });
  } catch (error) {
    return next(error);
  }
};

// -------------- Notification -----------
exports.getNotification = async (req, res, next) => {
  // Base On discount Price
  try {
    const products = await productModels.findAll({
      where: {
        discount_price: { [Op.ne]: 0 },
      },
    });
    if (!products || !products.length === 0) {
      return next(customErrorHandler.notFound());
    }
    return res.send(products);
  } catch (error) {
    return next(error);
  }
};

// Compare  with other product

exports.compareProduct = async (req, res, next) => {
  const { product1, product2 } = req.body;

  try {
  } catch (error) {
    return next(error);
  }
};

// ----------------wishlist----------------------

exports.createWishlist = async (req, res, next) => {
  try {
  } catch (error) {
    console.log(error);
  }
};

exports.updateWishlist = async (req, res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};

exports.deleteWishlist = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(customErrorHandler.requiredField());
  }
  try {
  } catch (error) {
    return next(error);
  }
};
