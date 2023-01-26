const router = require("express").Router();
const authenticationController = require("../controllers/authentication.controller");
const authenticationValidation = require("../middlewares/authenticationValidation");

/**
 * @api {POST} /login - Login account
 *
 * @param  {String} [username] Username
 * @param  {String} [password] Password
 */
router.post(
  "/login",
  authenticationValidation.validateLoginBody(),
  authenticationController.postLogin
);

/**
 * @api {POST} /register - Create user account
 *
 * @param  {String} [firstname] First name
 * @param  {String} [lastname] Last name
 * @param  {String} [email] Email
 * @param  {String} [username] Username
 * @param  {String} [password] Password
 */
router.post(
  "/register",
  authenticationValidation.validateRegiterBody(),
  authenticationController.postRegister
);

module.exports = router;
