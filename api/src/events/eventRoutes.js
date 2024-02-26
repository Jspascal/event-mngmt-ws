const express = require("express");
const { generateId, sendError } = require("../helpers");
const config = require("../../config");
const Redis = require("ioredis");

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  username: config.redis.user,
});

const router = express.Router();

router.post("/", (req, res) => {
  const name = req.body.name;

  console.log(req.body.name);

  if (!name || typeof name !== "string") {
    return sendError(res, "Invalid event name");
  }

  const id = generateId();

  const event = { id, name };
  //    client.connect().catch(console.error);

  redis.hset(
    "events",
    "event:" + event.id + ":" + event.name,
    JSON.stringify(event),
    (err) => {
      if (err) {
        console.log("failed to save");
        return sendError(res, "Failed to save event");
      }

      redis.xadd("event-stream", "*", "data", JSON.stringify(event), (err) => {
        if (err) {
          console.log("failed to publish");
          return sendError(res, "Failed to publish event");
        }
      });

      return res.status(201).json(event);
    }
  );
});

router.get("/", (req, res) => {
  const eventList = [];
  let cursor = 0;
  //  const match = "event:*";

  function scanHash() {
    redis.hscan("events", cursor, (err, reply) => {
      if (err) {
        return sendError(res, "Failed to get events");
      }
      console.log(reply);
      cursor = reply[0];
      for (let i = 0; i < reply[1].length; i += 2) {
        //        const field = reply[1][i];
        const value = reply[1][i + 1];
        const event = JSON.parse(value);
        eventList.push(event);
      }
      if (cursor === "0") {
        return res.status(200).json(eventList);
      } else {
        scanHash();
      }
    });
  }

  scanHash();
});

module.exports = router;
