const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minLength: 4, maxLength: 255 },
    pic: { type: String },
    isActive: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
  },
  { timeStamps: true }
);

// check encrypted password
userSchema.methods.matchPassword = async function (enteredPassword) {
  const result = await bcrypt.compare(enteredPassword, this.password);
  return result;
};

// password encryption
userSchema.pre("save", async function (next) {
  // check password already encrypted or not
  if (!this.isModified("password")) {
    next();
  }
  // make salt
  const salt = await bcrypt.genSalt(10);
  // encrypt  password
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
