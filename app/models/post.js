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
      required: false,
    },

    attachments: {
      url: { type: String, required: false },
      type: { type: String, required: false },
    },
    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const Post = mongoose.model("Post", PostSchema, "posts");
module.exports = Post;
