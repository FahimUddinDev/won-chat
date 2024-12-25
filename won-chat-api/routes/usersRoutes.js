const express = require("express");
const { allUsers } = require("../controllers/usersControllers");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.route(`/`).get(authMiddleware, allUsers);

module.exports = router;
