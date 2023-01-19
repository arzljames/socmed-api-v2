const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 3001;

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
