const { validationResult } = require("express-validator");
const _ = require("lodash");
const User = require("../models/user");
const Profile = require("../models/profile");
const encryption = require("../helpers/encyption");
const jwt = require("../helpers/jwtAuth");
const userProfileHelper = require("../helpers/userProfile");

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;

  // data body validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const findUser = await User.findOne({ username });
    if (_.isNil(findUser)) throw new Error("Such user does not exist");

    const compare = await encryption.comparePassword(
      password,
      findUser.password
    );
    if (!compare) throw new Error("Incorrect username or password");

    const { _id, email, is_verified, status } = findUser;
    const payload = { _id, email };

    const access_token = jwt.createToken(payload);

    const response = {
      _id,
      email,
      username,
      is_verified,
      status,
      access_token,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

exports.postRegister = async (req, res) => {
  const { first_name, last_name, email, username, password } = req.body;

  // data body validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const hashedPassword = await encryption.hashPassword(password);
    const profileColor = userProfileHelper.profileColor();

    const findExistingUserByUsername = await User.findOne({ username });
    if (findExistingUserByUsername) throw new Error("Username already exist");

    const findExistingUserByEmail = await User.findOne({ email });
    if (findExistingUserByEmail) throw new Error("Email already exist");

    const newProfile = await Profile.create({
      first_name: userProfileHelper.capitalizeName(first_name),
      last_name: userProfileHelper.capitalizeName(last_name),
      initials: userProfileHelper.getInitials(first_name, last_name),
      profile_color: profileColor,
    });

    if (!newProfile) throw new Error("Unable to create user account");

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      profile: newProfile._id,
    });

    const createdUser = await User.findOne(
      { _id: newUser._id },
      { password: 0 }
    )
      .populate("profile")
      .lean();

    res.status(200).json(createdUser);
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
};
