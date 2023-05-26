const { DataTypes } = require("sequelize");
const userModel = require("../../models/register");
const bcrypt = require("bcrypt");
const joi = require("joi");
const multer = require("multer");
const url = "http://localhost:3200/";
const folder = "profile/";
const nodemailer = require("nodemailer");
const customErrorHandler = require("../../error/customErrorHandler");
const config = require("../../config/config");
const crypto = require("crypto");

// Generate a verification token

// Generate a verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

// ----- Multer Image Upload -------------------
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
      html: `<p>Hi ${name}, please click <a href="${url}verify-email/${verificationToken}">here</a> to verify your email.</p>`,
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
    const findEmail = await userModel.findOne({
      where: { email: req.body.email },
    });
    if (findEmail) {
      return next(customErrorHandler.alreadyExist());
    }
    const User = req.body;
    const hashPassword = await bcrypt.hash(User.password, 10);
    // Generate a verification token
    const verificationToken = generateVerificationToken();
    User.password = hashPassword;
    User.verificationToken = verificationToken;

    const Profile = {};

    if (req.file !== undefined) {
      Profile.profile = `${url}${folder}${req.file.filename}`;
    }

    let createUser;
    if (Object.keys(Profile).length !== 0) {
      createUser = await userModel.create(Object.assign(User, Profile));
    } else {
      createUser = await userModel.create(User);
    }

    if (createUser.length === 0) {
      res.status(409).json({
        success: false,
        message: "user insert failed",
      });
      return;
    }
    signup(User.name, User.email, User.verificationToken);
    res.status(201).json({
      success: true,
      message: "user insert done",
    });
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
