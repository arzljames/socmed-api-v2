const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },

    middle_name: {
      type: String,
      required: false,
    },

    initials: {
      type: String,
      required: true,
    },

    profile_color: {
      type: String,
      required: true,
    },

    profile_photo: {
      path: String,
      filename: String,
    },

    cover_photo: {
      path: String,
      filename: String,
    },

    contact_number: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const Profile = mongoose.model("Profile", ProfileSchema, "profiles");
module.exports = Profile;
