// Step 1: User Request for Password Reset

const resetPasswordTokenModel = require("../../models/forgotPassword");
const userModel = require("../../models/register");
const nodemailer = require("nodemailer");
const config = require("../../config/config");
const crypto = require("crypto");
const url = "http://localhost:3200/";
const bcrypt = require("bcrypt");

// Generate a verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

// -------------------------Email Logic ------------------------------------

const Forgot = async (name, email, resetPasswordToken) => {
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
      from: config.email,
      to: email,
      subject: "Forgot Password Mail",
      html: `<p>Hi ${name}, 
      please click <a href="${url}forgot_password/${resetPasswordToken}">resetLink</a> to forgot your password.</p>`,
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
    const storeToken = await resetPasswordTokenModel.create({
      resetPasswordToken: resetPasswordToken,
    });
    if (!storeToken) {
      return res.status(400).json({ msg: "Something went wrong" });
    }
    // Email send Verified Email id
    Forgot(findEmail.name, findEmail.email, storeToken.resetPasswordToken);
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
    const { token } = req.params;
    const verifyToken = await resetPasswordTokenModel.findOne({
      where: { resetPasswordToken: token },
    });
    if (!verifyToken) {
      return res.status(400).json({ msg: "Token is not valid" });
    }

    const hashPassword = await bcrypt.hash(req.body.newPassword, 10);
    const updatePassword = await userModel.update(
      {
        password: hashPassword,
      },
      {
        where: {
          email: req.body.email,
        },
      }
    );
    // reset restToken
    const restToken = await resetPasswordTokenModel.update(
      {
        resetPasswordToken: "null",
      },
      { where: { resetPasswordToken: token } }
    );
    res.json(updatePassword);
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// const { email } = req.body;

//   // Step 2: Generate a Password Reset Token
//   const token = generatePasswordResetToken();

//   // Store the token with the user's identifier (email) in the database or cache

//   // Step 3: Send Password Reset Email
//   const resetLink = `http://example.com/reset-password?token=${token}`;
//   const mailOptions = {
//     to: email,
//     subject: "Password Reset",
//     html: `Click the following link to reset your password: <a href="${resetLink}">Reset Password</a>`,
//   };

//   // Send the email using a mailing library or service like Nodemailer

//   res.status(200).json({ message: "Password reset email sent successfully." });
// });

// // Step 4: Password Reset Verification
// app.get("/reset-password", async (req, res) => {
//   const { token } = req.query;

//   // Verify the token against the stored token in the database or cache

//   if (validToken) {
//     // Render a password reset page or redirect to a password reset form
//     res.render("reset-password", { token });
//   } else {
//     res.status(400).json({ message: "Invalid or expired token." });
//   }
// });

// // Step 5: Update User's Password
// app.post("/reset-password", async (req, res) => {
//   const { token, password } = req.body;

//   // Verify the token against the stored token in the database or cache again (for additional security)

//   if (validToken) {
//     // Update the user's password in the database with the new password
//     // Use appropriate hashing and salting techniques (e.g., bcrypt) to securely store the password

//     res.status(200).json({ message: "Password reset successful." });
//   } else {
//     res.status(400).json({ message: "Invalid or expired token." });
//   }
// });
