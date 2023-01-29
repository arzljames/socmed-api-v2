const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.hashPassword = async (password) => {
  if (password) {
    const hashedPasword = await bcrypt.hash(password, saltRounds);
    return hashedPasword;
  }
};

exports.comparePassword = async (password, hashedPassword) => {
  if (password && hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }
};
