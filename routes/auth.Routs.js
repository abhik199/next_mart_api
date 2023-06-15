const auth = require("../middleware/Auth");
const router = require("express").Router();
const {
  registerController,
  loginController,
  updateProfileCtr,
  forgotPasswordCtr,
  changePassword,
  logOut,
  refreshTokenCtr,
} = require("../Auth/auth");
const { imageUpload } = require("../controllers/multer");

// POST REQUEST

router
  .route("/register")
  .post(imageUpload.single("profile"), registerController.userRegistration); // Registration
router.route("/login").post(loginController.userLogin); // Login
router.route("/forgot_password").post(forgotPasswordCtr.forgotPassword); // Forgot Password
router.route("/change_password").post(changePassword.changePassword); // Change Password
router.route("/refreshToken/:token").post(refreshTokenCtr.refreshToken); // Registration
router.route("/new_password").post(forgotPasswordCtr.newPaa); // Generate New Password

// GET REQUEST
router.get("/verify_email", registerController.verifyEmail); // send user account this email
router.get("/forgot_password", forgotPasswordCtr.newPassword); // Forgot Password
router.get("/logout/:id", auth, logOut.logoutUser); // Logout clean Access token and Delete Refresh Token

// PUT REQUEST
router.put("/update/:id", updateProfileCtr.userUpdate); // User Profile Update

module.exports = router;
