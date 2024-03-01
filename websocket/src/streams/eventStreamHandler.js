const eventStreamHandler = async (redis, socket, groupName) => {
  /*await redis.xgroup(
    "CREATE",
    "table-stream",
    groupName,
    "$",
    "MKSTREAM",
    (err) => {
      if (err) {
        console.error("Failed to create group");
      }
    }
  );*/

  await redis.xreadgroup(
    "GROUP",
    groupName,
    socket.id,
    "BLOCK",
    0,
    "STREAMS",
    "event-stream",
    ">",
    (err, stream) => {
      if (err) {
        console.error("Failed to read events from stream");
      }

      console.log(1);
      const events = stream[0][1].map((data) => JSON.parse(data[1][1]));

      socket.emit("events", events);
    }
  );
};

module.exports = eventStreamHandler;
