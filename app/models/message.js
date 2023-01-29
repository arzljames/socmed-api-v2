const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {},
  { timestamps: true, versionKey: false }
);

const Message = mongoose.model("Message", MessageSchema, "message");
module.exports = Message;
