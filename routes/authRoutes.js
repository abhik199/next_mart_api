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
} = require("../controllers/Auth/auth");

// POST REQUEST
router.post("/register", registerController.userRegistration); // Registration
router.post("/login", loginController.userLogin); // Login
router.post("/forgot_password", forgotPasswordCtr.forgotPassword); // Forgot Password
router.post("/change_password", changePassword.changePassword); // Change Password
router.post("/refreshToken/:token", refreshTokenCtr.refreshToken); // Refresh Token

// GET REQUEST
router.get("/verify-email/:token", registerController.verifyEmail); // send user account this email
router.get("/forgot_password", forgotPasswordCtr.newPassword); // Forgot Password
router.get("/logout/:id", auth, logOut.logoutUser); // Logout clean Access token and Delete Refresh Token

// PUT REQUEST
router.put("/update/:id", updateProfileCtr.userUpdate); // User Profile Update

module.exports = router;
