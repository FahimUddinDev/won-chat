const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const verificationSchema = mongoose.Schema(
  {
    email: { type: String, required: true },
    verificationCode: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 255,
    },
  },
  { timestamps: true }
);

// expire automatically after given time (TTL Index)
// verificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 6000 });
// check encrypted password
verificationSchema.methods.matchCode = async function (enteredCode) {
  const result = await bcrypt.compare(enteredCode, this.verificationCode);
  return result;
};

// code  encryption
verificationSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.verificationCode = await bcrypt.hash(this.verificationCode, salt);
});

const VerifyInfo = mongoose.model("VerifyInfo", verificationSchema);

module.exports = VerifyInfo;
