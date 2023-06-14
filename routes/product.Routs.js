const routes = require("express").Router();
const {
  categoriesCtr,
  productCtr,
} = require("../controllers/products/controller");

const { imageUpload } = require("../controllers/multer");

// GET REQUEST
routes.route("/category").get(categoriesCtr.getCategory);
routes.route("/product").get(productCtr.getProduct);
routes.route("/categorys/:id").get(categoriesCtr.categoryProducts);

// POST REQUEST
routes
  .route("/category")
  .post(imageUpload.single("icon"), categoriesCtr.productCategories);
routes
  .route("/product")
  .post(imageUpload.array("product_images"), productCtr.createProducts);

routes.route("/review").post(productCtr.createReview);

// Delete REQUEST
routes.route("/deleteCategory/:id").delete(categoriesCtr.deleteCategory);
routes.route("/deleteProduct/:id").delete();
routes.route("/deleteImage/:id").delete();

// Update Request
routes
  .route("/updateCategory/:id")
  .patch(imageUpload.single("icon"), categoriesCtr.updateCategory);
routes.route("/updateProduct/:id").patch();
routes.route("/updateImage/:id").patch();

module.exports = routes;
