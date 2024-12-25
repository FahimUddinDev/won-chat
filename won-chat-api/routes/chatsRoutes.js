const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatsControllers");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const router = express.Router();

router
  .route(`/`)
  .post(uploadMiddleware, protect, accessChat)
  .get(protect, fetchChats);
router.route(`/group`).post(protect, createGroupChat);
router.route(`/rename`).put(protect, renameGroup);
router.route(`/group-remove`).put(protect, removeFromGroup);
router.route(`/group-add`).put(protect, addToGroup);

module.exports = router;
