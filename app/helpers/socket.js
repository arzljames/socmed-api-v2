const { Server } = require("socket.io");
const _ = require("lodash");

const socketInit = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
      methods: ["PUT", "DELETE", "GET", "POST", "*"],
    },
  });
  io.on("connection", (socket) => {
    socket.on("client:refresh_data", async (_data) => {
      io.emit("server:refresh_data", true);
    });

    socket.on("disconnect", () => {
      console.log(`${socket.id} disconnected`);
    });
  });
};
module.exports = socketInit;
