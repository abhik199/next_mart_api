const carouselModel = require("../../models/carousel");
const multer = require("multer");
const url = "http://localhost:3200/";

// --------------- Image Upload code ---------------------------------

const storage = multer.diskStorage({
  destination: "public/carousel",
  filename: (req, file, cb) => {
    // Customize the file name with the current date and original file extension
    const date = Date.now();
    const fileName = `${date}_${file.originalname}`;
    cb(null, fileName);
  },
});
exports.imageUpload = multer({
  storage: storage,
  limits: {
    fileSize: 5000000, // 5000000 Bytes = 5 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
});

// ----------------------------------Insert Carousel  -----------------------

exports.insertCarousel = async (req, res, next) => {
  try {
    const carousel = req.body;
    const Profile = {};

    if (req.file !== undefined) {
      Profile.profile = `${url}$carousel/${req.file.filename}`;
    }

    let createUser;
    if (Object.keys(Profile).length !== 0) {
      createUser = await carouselModel.create(Object.assign(carousel, Profile));
    } else {
      createUser = await carouselModel.create(User);
    }

    if (createUser.length === 0) {
      res.status(409).json({
        success: false,
        message: "Failed",
      });
      return;
    }
    return res.status(201).json({
      success: true,
      message: "created",
    });
  } catch (error) {
    return next(error);
  }
};
