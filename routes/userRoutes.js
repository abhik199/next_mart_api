const auth = require("../middleware/Auth");
const router = require("express").Router();
const {
  registerController,
  loginController,
  updateProfileCtr,
  forgotPasswordCtr,
  resetPasswordCtr,
  logOut,
} = require("../controllers/auth");

router.post(
  "/",
  registerController.imageUpload.single("profile"),
  registerController.userRegistration
);

// Login
router.post("/login", loginController.userLogin);
router.get("/verify-email/:token", registerController.verifyEmail);
router.put(
  "/update/:id",
  registerController.imageUpload.single("profile"),
  updateProfileCtr.userUpdate
);

// Forgot Password

router.post("/forgot_password", forgotPasswordCtr.forgotPassword);
router.get("/forgot_password/:token", forgotPasswordCtr.newPassword);

// reset password

router.post("/reset_password", resetPasswordCtr.resetPassword);

// logout
router.get("/logout/:id", auth, logOut.logoutUser);

// refresh token
router.post("/refresh_token");

module.exports = router;
