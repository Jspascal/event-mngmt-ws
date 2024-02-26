const express = require("express");
const createClient = require("redis").createClient;
const { generateId, sendError } = require("../helpers");
const config = require("../../config");

const router = express.Router();
const client = createClient({
  password: config.redis.password,
  socket: {
    host: config.redis.host,
    port: config.redis.port,
  },
});

router.post("/", (req, res) => {
  const eventId = req.params.eventId;

  const name = req.body.name;
  const email = req.body.email;

  if (!name || typeof name !== "string") {
    return sendError(res, "Invalid guest name");
  }

  if (!email || typeof email !== "string") {
    return sendError(res, "Invalid guest email");
  }

  const id = generateId();

  const guest = { id, name, email, eventId };

  client.hSet("guests", id, JSON.stringify(guest), (err) => {
    if (err) {
      return sendError(res, "Failed to save guest");
    }

    client.xAdd("guest-stream", "*", "action", "create", "guest", id, (err) => {
      if (err) {
        return sendError(res, "Failed to push guest to stream");
      }

      res.status(201).json(guest);
    });
  });
});

router.get("/", (req, res) => {
  const eventId = req.params.eventId;

  client.hGetAll("guests", (err, guests) => {
    if (err) {
      return sendError(res, "Failed to get guests");
    }

    const guestList = Object.values(guests).map((guest) => JSON.parse(guest));

    const eventGuests = guestList.filter((guest) => guest.eventId === eventId);

    res.status(200).json(eventGuests);
  });
});

router.post("/:tableId/guests/:guestId", (req, res) => {
  const eventId = req.params.eventId;
  const tableId = req.params.tableId;
  const guestId = req.params.guestId;

  client.hGet("tables", tableId, (err, table) => {
    if (err) {
      return sendError(res, "Failed to get table");
    }

    const tableObj = JSON.parse(table);

    if (tableObj.eventId !== eventId) {
      return sendError(res, "Table does not belong to event");
    }

    if (tableObj.capacity < 1) {
      return sendError(res, "Table is full");
    }

    client.hGet("guests", guestId, (err, guest) => {
      if (err) {
        return sendError(res, "Failed to get guest");
      }

      const guestObj = JSON.parse(guest);

      if (guestObj.eventId !== eventId) {
        return sendError(res, "Guest does not belong to event");
      }

      guestObj.tableId = tableId;

      client.hSet("guests", guestId, JSON.stringify(guestObj), (err) => {
        if (err) {
          return sendError(res, "Failed to update guest");
        }

        tableObj.capacity--;

        client.hSet("tables", tableId, JSON.stringify(tableObj), (err) => {
          if (err) {
            return sendError(res, "Failed to update table");
          }

          client.xAdd(
            "guest-stream",
            "*",
            "action",
            "assign",
            "table",
            tableId,
            "guest",
            guestId,
            (err) => {
              if (err) {
                return sendError(res, "Failed to push assignment to stream");
              }

              res.status(200).json(guestObj);
            }
          );
        });
      });
    });
  });
});

module.exports = router;
