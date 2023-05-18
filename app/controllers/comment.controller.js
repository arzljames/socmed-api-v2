const Comment = require("../models/comment");
const _ = require("lodash");
const { validationResult } = require("express-validator");

exports.getComments = async (req, res) => {
  const { id } = req.params;

  try {
    const findComments = await Comment.find({ postId: id })
      .populate("commentor")
      .populate({
        path: "commentor",
        populate: "profile",
      });

    if (!findComments) {
      return res.status(400).json({
        status: 0,
        message: "Invalid post; Unable to fetch comments",
      });
    }

    res.status(200).json(findComments);
  } catch (error) {
    return res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

exports.updateComment = async (req, res) => {
  const { id } = req.params;
  const comment = req.body.comment;

  // data body validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const updateComment = await Comment.findOneAndUpdate(
      { _id: id },
      { comment },
      { new: true }
    );

    if (!updateComment) {
      return res.status(400).json({
        status: 0,
        message: "Invalid comment; Unable to edit comment",
      });
    }

    res.status(200).json(updateComment);
  } catch (error) {
    return res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteComment = await Comment.findOneAndDelete({ _id: id });

    if (!deleteComment) {
      return res.status(400).json({
        status: 0,
        message: "Invalid comment; Unable to delete comment",
      });
    }

    res.status(200).json({ status: 1, message: "Deleted comment" });
  } catch (error) {
    return res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};
