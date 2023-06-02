const { DataTypes } = require("sequelize");
const userModel = require("../../models/authModels/register");
const bcrypt = require("bcrypt");
const joi = require("joi");
const multer = require("multer");
const { url } = require("../../config/config");
const folder = "profile/";
const nodemailer = require("nodemailer");
const customErrorHandler = require("../../error/customErrorHandler");
const config = require("../../config/config");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;

// Generate a verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

// ----- Multer Image Upload -------------------

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

    const message = {
      from: "next_mart",
      to: email,
      subject: "Verification Mail",
      // html: `<p>Hi ${name}, please click <a href="${url}verify-email/${verificationToken}">here</a> to verify your email.</p>`,
      html: `
        <h1>Email Verification</h1>
        <p>Hi ${name},</p>
        <p>Thank you for registering with our website. Please click the link below to verify your email address:</p>
        <p><a href="${url}verify-email/${verificationToken}">Verify Email</a></p>
        <p>If you did not sign up for an account, please ignore this email.</p>
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

// new user Registration

exports.userRegistration = async (req, res, next) => {
  try {
    const User = req.body;
    const findEmail = await userModel.findOne({
      where: { email: User.email },
    });
    if (findEmail) {
      return next(customErrorHandler.alreadyExist());
    }

    const hashPassword = await bcrypt.hash(User.password, 10);
    const verificationToken = generateVerificationToken();
    User.password = hashPassword;
    User.verificationToken = verificationToken;

    const Profile = {};

    let createUser;
    if (Object.keys(Profile).length !== 0) {
      createUser = await userModel.create(Object.assign(User, Profile));
    } else {
      createUser = await userModel.create(User);
    }

    if (!createUser) {
      res.status(409).json({
        success: false,
        message: "User insert failed",
      });

      return;
    }

    // Call the signup function to send the verification email
    signup(User.name, User.email, User.verificationToken);

    res.status(201).json({
      success: true,
      message: "User insert done",
    });
    if (req.files !== undefined) {
      const imageFile = req.files.profile;
      const imagePath = imageFile.tempFilePath;
      const profileUrl = await cloudinary.uploader.upload(imagePath, {
        folder: "Next_Mart/profile",
        resource_type: "image",
      });
      Profile.profile = profileUrl.secure_url;
    }
    return;
  } catch (error) {
    return next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const findToken = await userModel.findOne({
      where: { verificationToken: token },
    });

    if (!findToken) {
      return res.status(409).send("Email Token exp.");
    }

    const updateUser = await userModel.update(
      {
        isVerify: true,
        verificationToken: "null",
      },
      { where: { verificationToken: token } }
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
