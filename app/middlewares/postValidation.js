const { body } = require("express-validator");

exports.validatePostBody = () => {
  const criterias = [body("privacy").notEmpty().isString()];

  return criterias;
};

exports.validateReactionBody = () => {
  const criterias = [
    body("reaction").notEmpty().isString(),
    body("reaction_icon").notEmpty().isString(),
    body("reactor").notEmpty().isString(),
    body("postId").notEmpty().isString(),
  ];

  return criterias;
};
