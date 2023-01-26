const mongoose = require("mongoose");
const User = require("./user");
const Post = require("./post");

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Post,
      required: true,
    },
    commentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Comment = mongoose.model("Comment", CommentSchema, "comments");
module.exports = Comment;
