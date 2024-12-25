const jwt = require("jsonwebtoken");

const generateToken = (id, remember) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: remember ? "100000000000s" : process.env.JWT_EXPIRATION,
  });
};

module.exports = generateToken;
