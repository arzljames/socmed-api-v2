const router = require("express").Router();
const authenticationValidation = require("../middlewares/authenticationValidation");
const userController = require("../controllers/user.controller");

/**
 * @api {GET} / - get user account
 */
router.get("/", authenticationValidation.validateToken, userController.getUser);

/**
 * @api {GET} / - get list of users
 */
router.get(
  "/users",
  authenticationValidation.validateToken,
  userController.getUsers
);

/**
 * @api {PUT} / - update new user account status to false
 */
router.put(
  "/new-user",
  authenticationValidation.validateToken,
  userController.putUpdateNewUser
);

module.exports = router;
