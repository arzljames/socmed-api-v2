const mongoose = require("mongoose");
const Profile = require("./profile");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    is_verified: {
      type: Boolean,
      required: true,
      default: false,
    },

    is_new_user: {
      type: Boolean,
      required: true,
      default: true,
    },

    status: {
      type: String,
      required: true,
      default: "OFFLINE",
    },

    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Profile,
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      { default: [] },
    ],
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model("User", UserSchema, "users");
module.exports = User;
