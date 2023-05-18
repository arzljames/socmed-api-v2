const User = require("../models/user");
const _ = require("lodash");

exports.getSearch = async (req, res) => {
  const { search_key } = req.query;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const skip = req.query.skip ? parseInt(req.query.skip) : 0;
  try {
    const searchResult = await User.aggregate([
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
      {
        $project: {
          username: {
            $concat: ["@", "$username"],
          },
          full_name: {
            $concat: ["$profile.first_name", " ", "$profile.last_name"],
          },
          profile_photo: "$profile.profile_photo",
          followers: 1,
          initials: "$profile.initials",
          profile_color: "$profile.profile_color",
        },
      },
      {
        $match: {
          $or: [
            {
              full_name: {
                $regex: _.toString(search_key),
                $options: "i",
              },
            },
          ],
        },
      },
      {
        $facet: {
          total: [
            {
              $count: "result",
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
                $ifNull: [limit, "$total.result"],
              },
            ],
          },
          meta: {
            total: "$total.result",
            limit: {
              $literal: limit,
            },

            page: {
              $literal: skip / limit + 1,
            },
            pages: {
              $ceil: {
                $divide: ["$total.result", limit],
              },
            },
          },
        },
      },
    ]).then(([result]) => {
      if (!result)
        return {
          data: [],
          meta: {},
        };

      return result;
    });

    res.status(200).json(searchResult);
  } catch (error) {
    return res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};
