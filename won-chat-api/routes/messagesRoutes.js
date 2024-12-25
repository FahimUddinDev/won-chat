const express = require("express");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const protect = require("../middleware/authMiddleware");
const {
  sendMessages,
  getMessages,
} = require("../controllers/messagesControllers");
const router = express.Router();

router.route(`/`).post(protect, uploadMiddleware, sendMessages);
router.route(`/:chatId`).get(protect, getMessages);

module.exports = router;
