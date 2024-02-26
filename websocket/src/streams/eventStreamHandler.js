const eventStreamHandler = async (redis, socket, groupName) => {
  const groupExists = await redis.xinfo(
    "GROUPS",
    "event-stream",
    (err, groups) => {
      if (err) {
        console.error("Failed to get stream info");
      }

      return groups.some((group) => group[1] === groupName);
    }
  );

  if (!groupExists) {
    await redis.xgroup("CREATE", "event-stream", groupName, "$", (err) => {
      if (err) {
        console.error("Failed to create group");
      }
    });
  }

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
