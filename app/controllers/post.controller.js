const { validationResult } = require("express-validator");
const Reaction = require("../models/reaction");
const Post = require("../models/post");
const Comment = require("../models/comment");
const mongoose = require("mongoose");
const _ = require("lodash");

exports.postCreatePost = async (req, res) => {
  // data body validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { user } = req;
    const { _id } = user;
    const { privacy, message } = req.body;

    const createPost = await Post.create({
      author: _id,
      message,
      privacy,
    });
    if (!createPost) throw new Error("Unable to create post");

    res.status(200).json(createPost);
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

exports.postRemoveReaction = async (req, res) => {
  try {
    const reactionId = req.params.id;

    const findReaction = await Reaction.findOneAndDelete({
      _id: reactionId,
    });

    res.status(200).json(findReaction);
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { user } = req;
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

      {
        $lookup: {
          from: "reactions",
          localField: "_id",
          foreignField: "postId",
          as: "reactions",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
        },
      },
      { $unwind: "$author" },
      {
        $project: {
          "comments.postId": 0,
          "reactions.postId": 0,
        },
      },
      {
        $match: {
          $or: [
            {
              $expr: {
                $in: [
                  new mongoose.Types.ObjectId(user._id),
                  "$author.friend_list.friend",
                ],
              },
            },
            {
              "author._id": new mongoose.Types.ObjectId(user._id),
            },
            {
              privacy: "Public",
            },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    if (!posts) {
      posts = [];
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

exports.postComment = async (req, res) => {
  try {
    const { postId, commentor, comment } = req.body;
    const createComment = await Comment.create({
      postId,
      commentor,
      comment,
    });

    res.status(200).json(createComment);
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, message: error.message });
  }
};

exports.postReaction = async (req, res) => {
  try {
    const { reaction, reaction_icon, postId, reactor } = req.body;

    const createUpdateReaction = await Reaction.findOneAndUpdate(
      { postId, reactor },
      { reaction, reaction_icon, postId, reactor },
      { upsert: true, new: true }
    );

    res.status(200).json(createUpdateReaction);
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, message: error.message });
  }
};
