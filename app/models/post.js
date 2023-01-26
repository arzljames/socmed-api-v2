const mongoose = require("mongoose");
const User = require("./user");

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },

    privacy: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Post = mongoose.model("Post", PostSchema, "posts");
module.exports = Post;
