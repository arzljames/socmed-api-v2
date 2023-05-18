const router = require("express").Router();
const commentController = require("../controllers/comment.controller");
const authenticationValidation = require("../middlewares/authenticationValidation");
const commentValidation = require("../middlewares/commentValidation");

router.get(
  "/:id",
  authenticationValidation.validateToken,
  commentController.getComments
);

router.put(
  "/:id",
  [
    authenticationValidation.validateToken,
    commentValidation.validateCommentBody(),
  ],
  commentController.updateComment
);

router.delete(
  "/:id",
  authenticationValidation.validateToken,
  commentController.deleteComment
);

module.exports = router;
