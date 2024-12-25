const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

// login user

const allUsers = async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [
          {
            firstName: { $regex: req.query.search, $options: "i" },
          },
          {
            lastName: { $regex: req.query.search, $options: "i" },
          },
          {
            email: { $regex: req.query.search, $options: "i" },
          },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user.id } })
    .select("firstName lastName pic _id isActive");

  res.status(200).send({ users });
};

module.exports = { allUsers };
