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
    socket.off();
    socket.on("sample", async ({ _id }) => {
      let posts = await Post.aggregate([
        {
          $match: {},
        },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
            pipeline: [
              {
                $project: {
                  password: 0,
                },
              },
              {
                $lookup: {
                  from: "profiles",
                  localField: "profile",
                  foreignField: "_id",
                  as: "profile",
                },
              },
              {
                $unwind: "$profile",
              },
            ],
          },
        },
        { $unwind: "$author" },
        {
          $lookup: {
            from: "reactions",
            localField: "reactions",
            foreignField: "_id",
            as: "reactions",
            pipeline: [
              {
                $addFields: {
                  reactions_count: {
                    $size: "$react",
                  },
                },
              },
            ],
          },
        },
        { $unwind: "$reactions" },
        {
          $match: {
            $or: [
              {
                $expr: {
                  $in: [
                    new mongoose.Types.ObjectId(_id),
                    "$author.friend_list.friend",
                  ],
                },
              },
              {
                "author._id": new mongoose.Types.ObjectId(_id),
              },
              {
                privacy: "Public",
              },
            ],
          },
        },
      ]);

      if (!posts) {
        posts = [];
      }

      socket.emit("test", posts);
    });
  });
};
module.exports = socketInit;
