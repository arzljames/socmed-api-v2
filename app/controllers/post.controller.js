const { validationResult } = require("express-validator");
const Reaction = require("../models/reaction");
const Post = require("../models/post");
const Comment = require("../models/comment");
const mongoose = require("mongoose");
const _ = require("lodash");
const Notification = require("../models/notification");

exports.postCreatePost = async (req, res) => {
  // data body validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { user } = req;
    const { _id } = user;
    const { privacy, message, attachments } = req.body;

    const createPost = await Post.create({
      author: _id,
      message,
      privacy,
      attachments,
    });
    if (!createPost) throw new Error("Unable to create post");

    res.status(200).json(createPost);
  } catch (error) {
    console.log(error);
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
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const findPosts = await Post.aggregate([
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
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "commentor",
                foreignField: "_id",
                as: "commentor",
                pipeline: [
                  {
                    $lookup: {
                      from: "profiles",
                      localField: "profile",
                      foreignField: "_id",
                      as: "profile",
                    },
                  },
                  { $unwind: "$profile" },
                  {
                    $project: {
                      "profile.createdAt": 0,
                      "profile.updatedAt": 0,
                    },
                  },
                ],
              },
            },

            { $unwind: "$commentor" },
            {
              $project: {
                "commentor.profile": 1,
                "commentor.status": 1,
                createdAt: 1,
                updatedAt: 1,
                comment: 1,
              },
            },
          ],
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

      {
        $facet: {
          total: [
            {
              $count: "notifications",
            },
          ],

          data: [
            {
              $addFields: {
                _id: "$_id",
              },
            },
          ],
        },
      },
      { $unwind: "$total" },

      {
        $project: {
          data: {
            $slice: [
              "$data",
              skip,
              {
                $ifNull: [limit, "$total.notifications"],
              },
            ],
          },
          meta: {
            total: "$total.notifications",
            limit: {
              $literal: limit,
            },

            page: {
              $literal: skip / limit + 1,
            },
            pages: {
              $ceil: {
                $divide: ["$total.notifications", limit],
              },
            },
          },
        },
      },
    ]).then((result) => {
      if (!result) return { data: [], meta: {} };

      return {
        data: result[0]?.data,
        meta: result[0]?.meta,
      };
    });

    res.status(200).json(findPosts);
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

exports.deleteDeletePost = async (req, res) => {
  try {
    // Post ID to delete
    const { id } = req.params;

    const isExisting = await Post.findOne({ _id: id });

    if (!isExisting)
      throw new Error(`Unable to find and delete Post with ID ${id}`);

    await Post.deleteMany({ _id: id });
    await Reaction.deleteMany({ postId: id });
    await Comment.deleteMany({ postId: id });
    await Notification.deleteMany({ post_id: id });

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};
