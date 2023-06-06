// All Import Module
const { DataTypes } = require("sequelize");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const nodemailer = require("nodemailer");

// Import Folder
const userModel = require("../models/auth.model/register.model");
const { url } = require("../config/config");
const customErrorHandler = require("../error/customErrorHandler");
const config = require("../config/config");

// Generate a verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

// new user Registration

exports.userRegistration = async (req, res, next) => {
  const { name, email, password, address } = req.body;
  if (!name && !email && !password && !address) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const user = await userModel.findOne({
      where: { email: email },
    });
    if (!user) {
      return res.status(404).json({ message: "email not found" });
    }

    const hashPassword = await bcrypt.hash(user.password, 10);
    const verificationToken = generateVerificationToken();
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 30); // 30 minute
    user.password = hashPassword;
    user.verificationToken = verificationToken;
    user.expirationTime = expirationTime;

    const createUser = await userModel.create(user);
    if (!createUser || !createUser.length === 0) {
      res.status(400).json({
        status: false,
        message: "User Registration Failed",
      });
      return;
    }
    res.status(201).json({
      status: true,
      message: "User Registration successfully",
    });
    // Call the signup function to send the verification email
    signup(user.name, user.email, user.verificationToken);

    // User Profile
    if (req.files !== undefined) {
      const imageFile = req.files.profile;
      const imagePath = imageFile.tempFilePath;
      const profileUrl = await cloudinary.uploader.upload(imagePath, {
        folder: "Next_Mart/profile",
        resource_type: "image",
      });
      await userModel.update(
        {
          profile: profileUrl.secure_url,
        },
        { where: { id: createUser.id }, returning: true }
      );
    }
  } catch (error) {
    return next(error);
  }
};
// Nodemailer Email Send
const signup = async (name, email, verificationToken) => {
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
    const email_url = `${url}verify_email?verificationToken=${verificationToken}&email=${email}`;
    ejs.renderFile(
      __dirname + "/../../views/email.ejs",
      { email_url, name },
      (err, data) => {
        if (err) {
          console.log(err);
        }

        const message = {
          from: "next_mart",
          to: email,
          subject: "Verification Mail",
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

exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, verificationToken } = req.query;

    const findToken = await userModel.findOne({
      where: { verificationToken: verificationToken },
    });

    if (!findToken || findToken.expirationTime < new Date()) {
      res.status(400).send("Wrong & Expired Token");
    }

    const updateUser = await userModel.update(
      {
        isVerify: true,
        verificationToken: "null",
      },
      { where: { verificationToken: verificationToken } }
    );

    if (!updateUser) {
      return res.status(409).send("Email Verification failed");
    }
    return res.status(200).send("email verification successfully");
  } catch (error) {
    console.log("Error verifying email:", error);
    return res.status(500).json({ message: "Error verifying email." });
  }
};