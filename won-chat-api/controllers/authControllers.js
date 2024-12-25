const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const VerificationInfo = require("../models/verificationModel");
const generateToken = require("../config/generateToken");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mailConfig");
const bcrypt = require("bcryptjs");
const { generateVerificationCode } = require("../helper/codeGenerator");
// register a user
const registerUser = async (req, res, next) => {
  const { firstName, lastName, email, password, pic } = req.body;
  // check data validation
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    password.length < 4 ||
    password.length > 255
  ) {
    return res.status(400).send("Invalid Information!");
  }
  // check user already exist or not
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).send("User already exists!");
  }

  // create new user
  const user = await User.create({ firstName, lastName, email, password, pic });
  // control verification
  // Set up email options

  if (user) {
    // generate verification code
    const verificationCode = generateVerificationCode();
    // save code in data base
    const savedCode = await VerificationInfo.create({
      email,
      verificationCode,
    });
    if (savedCode) {
      // create mail
      const mailOptions = {
        from: process.env.MAIL_USER,
        to: user.email,
        subject: "Chat app Registration - Verify Your Email",
        html: `Hi <b> ${user.firstName} </b><br/> Your verification code is <strong>${verificationCode}</strong>`,
      };
      // send mail
      const mailDelivered = await transporter.sendMail(mailOptions);
      if (mailDelivered) {
        return res
          .status(201)
          .send({ message: "Code sent your mail.", email: user.email });
      }
    } else {
      return res.status(201).send({
        message: "Message sending failed! Please resend mail",
        email: user.email,
      });
    }
  } else {
    // if there are any unknown error
    return res.status(500).send({ message: "Something went to wrong!" });
  }
};

// login user

const loginUser = async (req, res, next) => {
  const { email, password, rememberMe = false } = req.body;
  // get user information
  const user = await User.findOne({ email });
  // check user exist or not
  if (!user) {
    return res.status(400).send({ message: "User is not exist." });
  }
  // check password match or not
  if (user && !(await user.matchPassword(password))) {
    return res.status(400).send({ message: "Entire password is wrong " });
  }
  if (!user.verified) {
    return res.status(400).send({ message: "Email is not verified" });
  }

  // if everything is right send information
  return res.status(200).send({
    message: "Login successful",
    info: {
      id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id, rememberMe),
      refreshToken: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      }),
    },
  });
};

// verify user
const verifyUser = async (req, res) => {
  const {
    email,
    verificationCode,
    verificationType = "createAccount",
  } = req?.body;
  // get user information
  const user = await User.findOne({ email });

  // check user exist or not
  if (!user) {
    return res.status(400).send({ message: "User is not exist." });
  }
  // get sent verification from data base
  const verificationInfo = await VerificationInfo.findOne({ email });
  if (!verificationInfo) {
    return res
      .status(400)
      .send({ message: "Verification Expired. Please send code agin." });
  }
  // check code match or not
  if (
    user &&
    verificationInfo &&
    !(await verificationInfo.matchCode(verificationCode))
  ) {
    return res.status(400).send({ message: "Entire code is wrong " });
  }
  // update user verified
  if (verificationType === "createAccount") {
    await User.findByIdAndUpdate(user._id, { verified: true });
  }

  // verification code delete from data base
  await VerificationInfo.findByIdAndDelete(verificationInfo._id);
  // if everything is right send information
  if (verificationType === "createAccount") {
    return res.status(200).send({
      message: "Verification successful.",
      info: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
        refreshToken: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_REFRESH_EXPIRATION,
        }),
      },
    });
  } else {
    return res.status(200).send({
      message: "Verification successful.",
      info: {
        verificationToken: generateToken(user._id),
      },
    });
  }
};

// resend verification code
const sendVerificationCode = async (req, res) => {
  const email = req.params.email;
  // generate verification code
  verificationCode = generateVerificationCode();
  const user = await User.findOne({ email });
  // check email already in verify list or not
  const haveUser = await VerificationInfo.findOne({ email });
  let savedCode;
  // check user exist or not
  if (user) {
    // check email already exist in verify list or not
    if (haveUser) {
      // if already in verify list update it
      const salt = await bcrypt.genSalt(10);
      encryptVerificationCode = await bcrypt.hash(`${verificationCode}`, salt);
      savedCode = await VerificationInfo.findByIdAndUpdate(haveUser._id, {
        email,
        verificationCode: encryptVerificationCode,
      });
    } else {
      // if don't in verify list create new
      savedCode = await VerificationInfo.create({
        email,
        verificationCode,
      });
    }
    // check code save successfully
    if (savedCode) {
      // create mail
      const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Chat app - Verify Your Email",
        html: `Your verification code is <strong>${verificationCode}</strong>`,
      };
      // send mail
      const mailDelivered = await transporter.sendMail(mailOptions);
      // check mail sent or failed
      if (mailDelivered) {
        return res
          .status(200)
          .send({ message: "Send verification code in your email." });
      } else {
        return res.status(400).send({ message: "Message Sending failed!" });
      }
    } else {
      return res.status(400).send({ message: "code creating failed!" });
    }
  } else {
    return res.status(400).send({ message: "User not found!" });
  }

  return res.status(500).send({ message: "Internal server error!" });
};

const resetPassword = async (req, res) => {
  const { newPassword, verifyToken } = req.body;
  if (!newPassword) {
    res.status(400).send({ message: "Please provide valid password" });
  }
  try {
    const decoded = jwt.verify(verifyToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(400).send({ message: "Security error" });
    }
    // update user verified
    const salt = await bcrypt.genSalt(10);
    encryptPassword = await bcrypt.hash(`${newPassword}`, salt);
    await User.findOneAndUpdate(
      { _id: user._id },
      { password: encryptPassword }
    );

    return res.status(200).send({ message: "Password updated successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Token expired" });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if ((!oldPassword, !newPassword)) {
    return res.status(400).send({ message: "Invalid information" });
  }
  // check password match or not
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(400).send({ message: "User not found" });
  }
  const result = await bcrypt.compare(`${oldPassword}`, `${user.password}`);
  if (!result) {
    return res.status(400).send({ message: "Entire password is wrong " });
  }

  // update user verified
  const salt = await bcrypt.genSalt(10);
  encryptPassword = await bcrypt.hash(`${newPassword}`, salt);
  const updated = await User.findByIdAndUpdate(req.user._id, {
    password: encryptPassword,
  });
  if (updated) {
    return res.status(200).send({ message: "Password change successfully" });
  }
  return res.status(500).send({ message: "Internal server error." });
};

// login with refresh token
const refreshUser = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken)
    return res.status(403).json({ message: "Refresh token is required" });

  const decode = await jwt.verify(refreshToken, process.env.JWT_SECRET);
  return res.status(200).send({
    token: generateToken(decode.id, "1d"),
    refreshToken: jwt.sign({ id: decode.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    }),
  });
};

module.exports = {
  registerUser,
  loginUser,
  refreshUser,
  verifyUser,
  sendVerificationCode,
  resetPassword,
  changePassword,
};
