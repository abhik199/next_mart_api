const productModels = require("../../models/productsModels/products");

exports.createProducts = async (req, res) => {
  try {
    const product = req.body;
    const insertProduct = await productModels.create(product);
    console.log(insertProduct);
    if (!insertProduct) {
      return res.send("failed");
    }
    return res.send(insertProduct);
  } catch (error) {
    console.log(error);
  }
};
