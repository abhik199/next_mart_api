const { api_key, api_secret, cloud_name } = require("./config/config");
const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

cloudinary.config({
  cloud_name: cloud_name,
  api_key: api_key,
  api_secret: api_secret,
});

// routes
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/product", require("./routes/productRoutes"));

// Db connection
require("./config/connection");

app.use(require("./error/errorHandler"));

module.exports = app;
