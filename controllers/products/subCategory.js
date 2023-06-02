const subCategory = require("../../models/productsModels/subCategory");

exports.createSubCategory = async (req, res) => {
  try {
    const subCat = req.body;

    //   const exist = await subCategory.findOne({ name: subCat.name });
    //   if (exist) {
    //       return res.status(400).json({msg:'subCategory is already exist'})
    //   }

    const createSubCat = await subCategory.create(subCat);
    if (!createSubCat) {
      return res.send("Failed");
    }
    return res.send(createSubCat);
  } catch (error) {
    console.log(error);
  }
};
