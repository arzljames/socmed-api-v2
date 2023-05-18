const { Server } = require("socket.io");
const _ = require("lodash");
const User = require("../models/user");

const socketInit = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
      methods: ["PUT", "DELETE", "GET", "POST", "*"],
    },
  });

  const users = {};

  io.on("connection", (socket) => {
    socket.on("client:refresh_data", async (_data) => {
      io.emit("server:refresh_data", true);
    });

    // fetch active status of users
    socket.on("active_status", async (id) => {
      users[socket.id] = id;
      try {
        const findUser = await User.findOne({ _id: users[socket.id] });
        const { status } = findUser;

        if (status?.toLowerCase() === "busy") return;

        findUser.status = "Online";
        await findUser.save();
        socket.emit("get_status", findUser.status);
      } catch (error) {
        throw new Error(error);
      }
    });

    socket.on("disconnect", async () => {
      console.log(`${socket.id} disconnected`);
      try {
        const findUser = await User.findOne({ _id: users[socket.id] });
        if (!findUser) return;
        const { status } = findUser;

        if (status?.toLowerCase() === "busy") return;
        const newStatus = await User.findOneAndUpdate(
          { _id: users[socket.id] },
          {
            status: "Offline",
          }
        );
        socket.emit("get_status", newStatus?.status);
        delete users[socket.id];
      } catch (error) {
        throw new Error(error);
      }
    });

    socket.on("typing", (data) => {
      socket.broadcast.emit("typed", data);
    });
  });
};
module.exports = socketInit;
