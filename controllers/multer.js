const multer = require("multer");

exports.imageData = async (folder) => {
  try {
    const storage = multer.diskStorage({
      destination: "public/profile",
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
  } catch (error) {}
};
