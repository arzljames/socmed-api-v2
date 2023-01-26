const router = require("express").Router();
const Post = require("../models/post");
const postController = require("../controllers/post.controller");
const authenticationValidation = require("../middlewares/authenticationValidation");
const postValidation = require("../middlewares/postValidation");

/**
 * @api {GET} /api/post/ - List of posts
 */
router.get(
  "/",
  authenticationValidation.validateToken,
  postController.getPosts
);

/**
 * @api {POST} /api/post/create - Create a post
 *
 * @param  {String} [privacy] Privacy of post (public/friends)
 * @param  {String} [message] Context of post
 */
router.post(
  "/create",
  [authenticationValidation.validateToken, postValidation.validatePostBody()],
  postController.postCreatePost
);

/**
 * @api {POST} /api/post/reaction - Add reaction to post
 *
 * @param  {Number} [reaction] Reaction id (1-5)
 * @param  {String} [reaction_icon] Reaction emoji
 * @param  {String} [postId] MongoDB ID of post
 * @param  {String} [reactor] MongoDB ID of user who react
 */
router.post(
  "/reaction",
  [
    authenticationValidation.validateToken,
    postValidation.validateReactionBody(),
  ],
  postController.postReaction
);

/**
 * @api {DELETE} /api/post/remove-reaction/:id - Remove reaction to post
 */
router.delete(
  "/remove-reaction/:id",
  authenticationValidation.validateToken,
  postController.postRemoveReaction
);

/**
 * @api {POST} /api/post/comment - Add comment to post
 *
 * @param  {String} [postId] MongoDB ID of post
 * @param  {String} [Commentor] MongoDB ID of user reactor
 * @param  {String} [Comment] Comment
 */
router.post(
  "/comment",
  authenticationValidation.validateToken,
  postController.postComment
);

module.exports = router;
