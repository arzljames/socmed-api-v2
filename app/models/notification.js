const mongoose = require("mongoose");
const User = require("./user");
const Post = require("./post");

const NotificationSchema = new mongoose.Schema(
  {
    notification_type: {
      type: String,
      required: true,
    },
    notification: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "UNREAD",
    },
    notify_to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    notify_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    link: {
      type: String,
      required: true,
      default: "/",
    },
    reaction_icon: {
      type: String,
      required: false,
    },

    post_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Post,
      required: false,
    },
  },
  { timestamps: true, versionKey: false }
);

const Notification = mongoose.model(
  "Notification",
  NotificationSchema,
  "notifications"
);
module.exports = Notification;
