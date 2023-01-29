const { Server } = require("socket.io");
const Post = require("../models/post");
const mongoose = require("mongoose");

const socketInit = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
      methods: ["PUT", "DELETE", "GET", "POST", "*"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client with ID of ${socket.id} connected!`);
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
module.exports = socketInit;
