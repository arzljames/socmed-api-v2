const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {},
  { timestamps: true, versionKey: false }
);

const Conversation = mongoose.model(
  "Conversation",
  ConversationSchema,
  "conversations"
);
module.exports = Conversation;
