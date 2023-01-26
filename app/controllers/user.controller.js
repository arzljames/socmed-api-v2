const User = require("../models/user");
const mongoose = require("mongoose");
const _ = require("lodash");

exports.getUser = async (req, res) => {
  const { user } = req;
  const _id = user._id;

  try {
    let user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(_id),
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
        $lookup: {
          from: "users",
          localField: "friend_list.friend",
          foreignField: "_id",
          as: "friends",
          pipeline: [
            {
              $project: {
                password: 0,
                friend_list: 0,
              },
            },
          ],
        },
      },
      { $unwind: "$profile" },
      {
        $project: {
          password: 0,
        },
      },
    ]);

    res.status(200).json(user[0]);
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { user } = req;
    const _id = user._id;
    let findUsers = await User.aggregate([
      {
        $match: {
          _id: { $ne: mongoose.Types.ObjectId(_id) },
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
      { $unwind: "$profile" },
    ]);

    res.status(200).json(findUsers);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.putUpdateNewUser = async (req, res) => {
  const { user } = req;

  const _id = user._id;

  try {
    const findUpdatedUser = await User.findByIdAndUpdate(
      { _id },
      { is_new_user: false }
    ).populate("profile");

    if (!findUpdatedUser) throw new Error("Unable to update user");
    res.status(200).json(findUpdatedUser);
  } catch (error) {
    res.status(400).json(error);
  }
};
