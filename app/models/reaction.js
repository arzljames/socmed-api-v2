const mongoose = require("mongoose");
const User = require("./user");
const Post = require("./post");

const ReactionSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Post,
      required: true,
    },
    reactor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    reaction: {
      type: String,
      required: true,
    },
    reaction_icon: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Reaction = mongoose.model("Reaction", ReactionSchema, "reactions");
module.exports = Reaction;
