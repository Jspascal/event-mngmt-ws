const express = require("express");
const createClient = require("redis").createClient;

const config = require("./config");

const eventRoutes = require("./src/events/eventRoutes");
const tableRoutes = require("./src/tables/tableRoutes");
const guestRoutes = require("./src/guests/guestRoutes");
//const stream = require("node:stream");

const app = express();
console.log(config.redis.host.toString());
const client = createClient({
  password: config.redis.password,
  //  username: config.redis.user,
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
});
client.connect().catch(console.error);
client.on("connection", (/*stream*/) => {
  console.log("someone connected");
});

app.use(express.json());

app.use("/events", eventRoutes);
app.use("/events/:eventId/tables", tableRoutes);
app.use("/events/:eventId/guests", guestRoutes);

app.listen(config.port, () => {
  console.log(`App is running on port ${config.port}`);
});
