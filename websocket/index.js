const express = require("express");
const http = require("http");
const Redis = require("ioredis");
const cors = require("cors");

const config = require("./config");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  username: config.redis.user,
});
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

const eventStreamHandler = require("./src/streams/eventStreamHandler");
const guestStreamHandler = require("./src/streams/guestStreamHandler");
const tableStreamHandler = require("./src/streams/tableStreamHandler");

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  eventStreamHandler(redis, socket, config.eventGroupName);

  guestStreamHandler(redis, socket, config.guestGroupName);

  tableStreamHandler(redis, socket, config.tableGroupName);

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the app on the port specified in the config file
server.listen(config.port, () => {
  console.log(`App is running on port ${config.port}`);
});
