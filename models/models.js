// exports.refreshTokenCtr = require("./refreshToken.auth");
// All Product Sections
exports.productModels = require("./product.model/products.model");
exports.reviewModels = require("./product.model/review.model");
exports.imagesModels = require("./product.model/productImage.model");
exports.categoryModels = require("./product.model/categories.model");
exports.cardModels = require("./product.model/card.model");

// all Auth sections

exports.userModels = require("./auth.model/register.model");
exports.refreshTokenModels = require("./auth.model/refreshToken.model");
exports.ForgotModels = require("./auth.model/forgotPassword.model");
