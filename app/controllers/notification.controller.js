const { validationResult } = require("express-validator");
const Notification = require("../models/notification");
const mongoose = require("mongoose");
const _ = require("lodash");

exports.createNotification = async (req, res) => {
  // data body validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      notification_type,
      notification,
      notify_to,
      notify_by,
      link,
      reaction_icon,
      post_id,
    } = req.body;

    const createNotification = await Notification.create({
      notification_type,
      notification,
      notify_to,
      notify_by,
      link,
      reaction_icon,
      post_id,
    });

    if (!createNotification) throw new Error("Unable to create notification");

    res.status(200).json(createNotification);
  } catch (error) {
    console.log(error);
    res.status(400).json({ ok: false, message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  const { user } = req;
  const { _id } = user;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const skip = req.query.skip ? parseInt(req.query.skip) : 0;

  try {
    let countUnread = await Notification.aggregate([
      {
        $match: {
          $and: [
            { notify_to: new mongoose.Types.ObjectId(_id) },
            {
              notify_by: {
                $ne: new mongoose.Types.ObjectId(_id),
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    countUnread = _.filter(countUnread, { _id: "UNREAD" });

    const findNotifications = await Notification.aggregate([
      {
        $match: {
          $and: [
            { notify_to: new mongoose.Types.ObjectId(_id) },
            {
              notify_by: {
                $ne: new mongoose.Types.ObjectId(_id),
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "notify_by",
          foreignField: "_id",
          as: "notify_by",
          pipeline: [
            {
              $lookup: {
                from: "profiles",
                localField: "profile",
                foreignField: "_id",
                as: "profile",
              },
            },
          ],
        },
      },
      { $unwind: "$notify_by" },
      { $unwind: "$notify_by.profile" },

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
        meta: {
          ...result[0]?.meta,
          total_unread: countUnread[0]?.count ? countUnread[0]?.count : 0,
        },
      };
    });

    res.status(200).json(findNotifications);
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

exports.undoReactNotification = async (req, res) => {
  try {
    const { post_id, notify_by } = req.params;

    const deleteNotification = await Notification.deleteMany({
      notify_by,
      post_id,
    });

    if (!deleteNotification) throw new Error("Unable to delete notifications");
    res.status(200).json(deleteNotification);
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};
