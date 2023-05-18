const { body } = require("express-validator");

exports.validateCommentBody = () => {
  const criterias = [body("comment").notEmpty().isString()];

  return criterias;
};
