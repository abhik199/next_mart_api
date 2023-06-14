// Step 1: User Request for Password Reset

const resetPasswordTokenModel = require("../models/auth.model/forgotPassword.model");
const userModel = require("../models/auth.model/register.model");
const nodemailer = require("nodemailer");
const config = require("../config/config");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const path = require("path");
const ejs = require("ejs");
const { url } = require("../config/config");
const customErrorHandler = require("../error/customErrorHandler");

// Generate a verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

// -------------------------Email Logic ------------------------------------

const Forgot = async (name, email, key) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: config.email,
        pass: config.password,
      },
    });
    const resetPasswordLink = `${url}forgot_password?key=${key}&email=${email}`;

    ejs.renderFile(
      __dirname + "/../../views/forgot.ejs",
      { resetPasswordLink, name },
      (err, data) => {
        if (err) {
          console.log(err);
        }
        const message = {
          from: config.email,
          to: email,
          subject: "Forgot Password Mail",
          html: data,
        };
        transporter.sendMail(message, (error, info) => {
          if (error) {
            console.log("Error sending email:", error);
          } else {
            console.log("Email sent:", info.response);
          }
        });
      }
    );
  } catch (error) {
    console.log("Error sending email:", error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(customErrorHandler.requiredField());
  }
  try {
    // Check email id
    const user = await userModel.findOne({ where: { email: email } });
    if (!findEmail) {
      return next(customErrorHandler.notFound());
    }
    const resetPasswordToken = generateVerificationToken();
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 60); // Set

    const storeToken = await resetPasswordTokenModel.create({
      key: resetPasswordToken,
      expirationTime: expirationTime,
    });
    if (!storeToken) {
      return res.status(400).json({
        success: false,
        message: "Something Went Wrong",
      });
    }
    // Email send Verified Email id
    Forgot(user.name, user.email, storeToken.key);
    return res.status(200).json({
      success: true,
      message:
        "The password reset process has now been started. Please check your email for instructions on what to do next",
    });
  } catch (error) {
    return next(error);
  }
};

// ---------------------- New Password ------------------------
exports.newPassword = async (req, res, next) => {
  const { key, email } = req.query;
  if (!key || !email) {
    return next(customErrorHandler.requiredField());
  }
  try {
    const keyRecord = await resetPasswordTokenModel.findOne({
      where: { key: key },
    });

    if (!keyRecord || keyRecord.expirationTime < new Date()) {
      // OTP not found or expired
      res.status(400).send("Wrong & Expired Token ");
      return false;
    }
    res.render("password", { email: email });
    await resetPasswordTokenModel.destroy({ where: { key: key } });
    return;
  } catch (error) {
    return next(error);
  }
};

exports.newPaa = async (req, res) => {
  const { newPassword, email } = req.body;
  if (!newPassword || email) {
    return next(customErrorHandler.requiredField());
  }
  try {
    const hashPassword = await bcrypt.hash(newPassword, 10);
    const updatePassword = await userModel.update(
      {
        password: hashPassword,
      },
      {
        where: {
          email: email,
        },
      }
    );
    if (!updatePassword) {
      return res.send("Update failed");
      res.end();
    }
    return res.send("Update done");
    res.end();
  } catch (error) {
    return next(error);
  }
};
