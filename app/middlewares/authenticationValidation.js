const { body } = require("express-validator");
const jwt = require("../helpers/jwtAuth");

exports.validateLoginBody = () => {
  const criterias = [body("username").notEmpty(), body("password").notEmpty()];

  return criterias;
};

exports.validateToken = (req, res, next) => {
  try {
    if (!req.headers.authorization)
      throw new Error("Unauthorized. Invalid token");

    const token = req.headers.authorization.split(" ")[1];
    const tokenPayload = jwt.verifyToken(token);
    if (!tokenPayload) {
      throw new Error("Invalid or expired token");
    }
    req.user = tokenPayload;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.validateRegiterBody = () => {
  const criterias = [
    body("first_name").notEmpty().isString(),
    body("last_name").notEmpty().isString(),
    body("email").notEmpty().isEmail(),
    body("username").notEmpty().isString().isLength({ min: 6, max: 20 }),
    body("password").notEmpty().isString().isLength({ min: 6, max: 20 }),
  ];

  return criterias;
};
