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
  const eventId = req.params.eventId;

  const name = req.body.name;
  const capacity = req.body.capacity;

  if (!name || typeof name !== "string") {
    return sendError(res, "Invalid table name");
  }

  if (!capacity || typeof capacity !== "number" || capacity < 1) {
    return sendError(res, "Invalid table capacity");
  }

  const id = generateId();

  const table = { id, name, capacity, eventId };

  redis.hset(
    "tables",
    "table:" + table.id + ":" + table.name,
    JSON.stringify(table),
    (err) => {
      if (err) {
        console.log("failed to save");
        return sendError(res, "Failed to save table");
      }

      redis.xadd("table-stream", "*", "data", JSON.stringify(table), (err) => {
        if (err) {
          console.log("failed to publish");
          return sendError(res, "Failed to publish table");
        }
      });

      return res.status(201).json(table);
    }
  );
});

router.get("/", (req, res) => {
  const eventId = req.params.eventId;
  const tableList = [];
  let cursor = 0;
  //  const match = "table:*";

  function scanHash() {
    redis.hscan("tables", cursor, (err, reply) => {
      if (err) {
        return sendError(res, "Failed to get events");
      }
      console.log(reply);
      cursor = reply[0];
      for (let i = 0; i < reply[1].length; i += 2) {
        //        const field = reply[1][i];
        const value = reply[1][i + 1];
        const event = JSON.parse(value);
        tableList.push(event);
      }
      const eventTables = tableList.filter(
        (table) => table.eventId === eventId
      );
      if (cursor === "0") {
        return res.status(200).json(eventTables);
      } else {
        scanHash();
      }
    });
  }

  scanHash();
});

router.get("/:tableId/guests", (req, res) => {
  const eventId = req.params.eventId;
  const tableId = req.params.tableId;
  const guestList = [];
  let cursor = 0;
  //  const match = "guest:*";

  function scanHash() {
    redis.hscan("guests", cursor, (err, reply) => {
      if (err) {
        return sendError(res, "Failed to get events");
      }
      console.log(reply);
      cursor = reply[0];
      for (let i = 0; i < reply[1].length; i += 2) {
        //        const field = reply[1][i];
        const value = reply[1][i + 1];
        const event = JSON.parse(value);
        guestList.push(event);
      }
      const tableGuests = guestList.filter(
        (guest) => guest.eventId === eventId && guest.tableId === tableId
      );
      if (cursor === "0") {
        return res.status(200).json(tableGuests);
      } else {
        scanHash();
      }
    });
  }

  scanHash();
});

module.exports = router;
