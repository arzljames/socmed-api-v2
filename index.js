const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 3001;
const dbInit = require("./config/db");
const app = express();
const authenticationRoute = require("./app/routes/authentication.route");
const postRoute = require("./app/routes/post.route");
const userRoute = require("./app/routes/user.route");
const notificationRoute = require("./app/routes/notification.route");
const commentRoute = require("./app/routes/comment.route");
const searchRoute = require("./app/routes/search.route");
const cors = require("cors");
const _ = require("lodash");
const http = require("http");
const server = http.createServer(app);
const socketInit = require("./app/helpers/socket");
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;

// init database connection
dbInit;

app.use(express.json());
app.use(
  cors({
    origin: ['*', 'https://api-creatve.onrender.com', 'https://api-creatve.onrender.com/', true],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "*"],
  })
);

// init socket connection
socketInit(server);

// routes
app.use("/api/auth", authenticationRoute);
app.use("/api/post", postRoute);
app.use("/api/user", userRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/comment", commentRoute);
app.use("/api/search", searchRoute);

server.listen(PORT, () => {
  console.log(`Running in PORT ${PORT}`);
});
