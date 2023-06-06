const subCategory = require("../../models/productsModels/subcategory");

exports.createSubCategory = async (req, res) => {
  try {
    const subCat = req.body;
    const createSubCat = await subCategory.create(subCat);
    if (!createSubCat) {
      return res.send("Failed");
    }
    return res.send(createSubCat);
  } catch (error) {
    console.log(error);
  }
};
