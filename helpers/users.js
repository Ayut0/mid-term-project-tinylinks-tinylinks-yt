const { genSalt, hash } = require("bcrypt");

const hashPassword = (password) => {
  const salt = genSalt(12);
  const hashedPassword = hash(password, salt);
  return hashedPassword;
};

module.exports = { hashPassword };
