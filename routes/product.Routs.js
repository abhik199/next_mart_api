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
routes.route("/categoryProduct").get(productCtr.productSearchByCategory);
routes.route("/search").get(productCtr.productSearch);
routes.route("/priceFilter").get(productCtr.priceFilter);
routes.route("/getProduct").get(productCtr.Pagination);
routes.route("/related/:id").get(productCtr.getRelatedProducts);
routes.route("/notification").get(productCtr.getNotification);
// routes.route("/card/:id").get(productCtr.createCard);

// POST REQUESTs
routes
  .route("/category")
  .post(imageUpload.single("icon"), categoriesCtr.productCategories);
routes
  .route("/product")
  .post(imageUpload.array("product_images"), productCtr.createProducts);

routes.route("/review").post(productCtr.createReview);
routes.route("/card/:id").post(productCtr.createCard);

// Delete REQUEST
routes.route("/deleteCategory/:id").delete(categoriesCtr.deleteCategory);
routes.route("/deleteProduct/:id").delete();
routes.route("/deleteImage/:ids").delete(productCtr.deleteImage);

// Update Request
routes
  .route("/updateCategory/:id")
  .patch(imageUpload.single("icon"), categoriesCtr.updateCategory);
routes.route("/updateProduct/:id").patch();
routes.route("/updateImage/:id").patch();

module.exports = routes;
