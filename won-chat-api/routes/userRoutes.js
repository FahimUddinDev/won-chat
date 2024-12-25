const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser,
  refreshUser,
  verifyUser,
  sendVerificationCode,
  resetPassword,
  changePassword,
} = require("../controllers/authControllers");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const router = express.Router();

router.route(`/signin`).post(uploadMiddleware, loginUser);
router.route(`/signup`).post(uploadMiddleware, registerUser);
router.route(`/refresh`).post(refreshUser);
router.route(`/verify`).post(uploadMiddleware, verifyUser);
router.route(`/sendVerificationCode/:email`).get(sendVerificationCode);
router.route(`/reset-password`).post(uploadMiddleware, resetPassword);
router
  .route(`/change-password`)
  .post(protect, uploadMiddleware, changePassword);

module.exports = router;
