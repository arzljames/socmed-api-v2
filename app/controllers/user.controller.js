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
          localField: "followers",
          foreignField: "_id",
          as: "followers",
          pipeline: [
            {
              $project: {
                password: 0,
                friend_list: 0,
                createdAt: 0,
                updatedAt: 0,
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
    const findUserRequester = await User.findOne({ _id });
    let exemptedUsers = [mongoose.Types.ObjectId(_id)];

    // you might know people aggregation
    // this will filter users who are already friends with the requestor
    _.map(findUserRequester?.followers, (user) => {
      exemptedUsers.push(mongoose.Types.ObjectId(user._id));
      return exemptedUsers;
    });

    let findUsers = await User.aggregate([
      {
        $match: {
          _id: {
            $nin: exemptedUsers,
          },
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
    res.status(400).json({ ok: false, message: error.message });
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
    res.status(400).json({ ok: false, message: error.message });
  }
};

exports.getStatus = async (req, res) => {
  const { user } = req;
  if (!user) throw new Error("Invalid token!");

  const _id = user._id;

  try {
    const findUser = await User.findOne({ _id });
    if (!findUser) throw new Error("Invalid user");
    res.status(200).json(findUser.status);
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

exports.updatedStatus = async (req, res) => {
  const { user } = req;
  const { status } = req.body;
  if (!user) throw new Error("Invalid token!");

  const _id = user._id;

  try {
    const updateUser = await User.findOneAndUpdate({ _id }, { status });
    if (!updateUser) throw new Error("Unable to update user");
    res.status(200).json(updateUser.status);
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};
