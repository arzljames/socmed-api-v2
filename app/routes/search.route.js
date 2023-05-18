const router = require("express").Router();
const searchController = require("../controllers/search.controller");
const authenticationValidation = require("../middlewares/authenticationValidation");

router.get(
  "/",
  authenticationValidation.validateToken,
  searchController.getSearch
);

module.exports = router;
