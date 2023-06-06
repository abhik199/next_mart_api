const productModels = require("../../models/product.model/products.model");
const cloudinary = require("cloudinary").v2;

exports.createProducts = async (req, res) => {
  try {
    const product = req.body;
    const insertProduct = await productModels.create(product);
    if (!insertProduct || insertProduct.length === 0) {
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

    // Image Logic
    if (req.files !== undefined) {
      const imageFiles = req.files.product_image; // Assuming multiple files are uploaded
      const productImages = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const imagePath = imageFiles[i].tempFilePath;
        const productImage = await cloudinary.uploader.upload(imagePath, {
          folder: "Next_Mart/Products",
          resource_type: "image",
        });
        productImages.push(productImage.secure_url);
      }
      console.log(productImages);

      await productModels.update(
        {
          product_image: productImages,
        },
        {
          where: { productId: insertProduct.productId },
          returning: true,
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

// {
//     "subcategoryId":2,
//     "name":"Heirloom Tomatoes",
//     "brand":"hello4",
//     "price":450,
//     "discount_price":796,
//     "discount_percentage":1500,
//     "tag":"very nice product"
// }
