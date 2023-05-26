const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/", require("./routes/userRoutes"));

app.use(express.static("public"));
// Db connection
require("./config/connection");

app.use(require("./error/errorHandler"));
module.exports = app;
