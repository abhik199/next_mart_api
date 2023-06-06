const routes = require("express").Router();

const {
  categoriesCtr,
  SubcategoriesCtr,
  productCtr,
} = require("../controllers/products/controller");

// POST REQUEST

routes.route("/category").post(categoriesCtr.productCategories);
routes.route("/subCat").post(SubcategoriesCtr.createSubCategory);
routes.route("/product").post(productCtr.createProducts);

// Testing routes

module.exports = routes;
