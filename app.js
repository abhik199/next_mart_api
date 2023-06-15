const { api_key, api_secret, cloud_name } = require("./config/config");
const express = require("express");
const cookieParser = require("cookie-parser");
// const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
// const cloudinary = require("cloudinary").v2;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(cookieParser());
app.use(cors());

app.use("/api/v1/auth", require("./routes/auth.Routs"));
app.use("/api/v1/product", require("./routes/product.Routs"));

// Db connection
require("./config/connection");

app.use(require("./error/errorHandler"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

module.exports = app;
