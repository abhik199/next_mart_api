// Step 1: User Request for Password Reset

const resetPasswordTokenModel = require("../../models/authModels/forgotPassword");
const userModel = require("../../models/authModels/register");
const nodemailer = require("nodemailer");
const config = require("../../config/config");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const path = require("path");

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

    const message = {
      from: config.email,
      to: email,
      subject: "Forgot Password Mail",
      html: `
        <h1>Forgot Password</h1>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Please click the link below to reset your password:</p>
        <p>It will expire and become useless in 2 hours time.</p>
        <p>To reset your password, please visit the url below:</p>
        <a href="${resetPasswordLink}">${resetPasswordLink}</a>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Thank you,</p>
        <p>Your Website Team</p>
      `,
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  } catch (error) {
    console.log("Error sending email:", error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    // Check email id
    const findEmail = await userModel.findOne({ where: { email: email } });
    if (!findEmail) {
      return res.status(404).json({ msg: "Email is not found" });
    }
    const resetPasswordToken = generateVerificationToken();
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 120); // Set expiration time to 2 hours from now

    const storeToken = await resetPasswordTokenModel.create({
      key: resetPasswordToken,
      expirationTime: expirationTime,
    });
    if (!storeToken) {
      return res.status(400).json({ msg: "Something went wrong" });
    }
    // Email send Verified Email id
    Forgot(findEmail.name, findEmail.email, storeToken.key);
    return res.status(200).json({ msg: "Email sending" });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// ---------------------- New Password ------------------------
exports.newPassword = async (req, res, next) => {
  try {
    // verify token
    const { key, email } = req.query;

    const keyRecord = await resetPasswordTokenModel.findOne({
      where: { key: key },
    });

    if (!keyRecord || keyRecord.expirationTime < new Date()) {
      // OTP not found or expired
      res.status(400).send("Wrong & Expired Token ");
      return false;
    }
    if (req.query.password) {
      const { password } = req.query;
      console.log(password);
      const hashPassword = await bcrypt.hash(req.body.newPassword, 10);
      console.log(hashPassword);
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
      await resetPasswordTokenModel.destroy({ where: { key: key } });
      console.log("Password Reset Successfully");
      return res.status(200).send("Password Reset Successfully");
    }

    res.send("Verified url");
    console.log("Verified url");
    return;
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
