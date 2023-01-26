const mongoose = require("mongoose");
require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;
const _ = require("lodash");

const dbInit = mongoose
  .set("strictQuery", false)
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((_err) => {
    throw new Error("Unable to connect to database");
  });

module.exports = dbInit;
