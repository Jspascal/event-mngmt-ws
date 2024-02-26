const guestStreamHandler = async (redis, socket, groupName) => {
  const groupExists = await redis.xinfo(
    "STREAM",
    "guest-stream",
    "GROUPS",
    (err, groups) => {
      if (err) {
        console.error("Failed to get stream info");
      }

      return groups.some((group) => group[1] === groupName);
    }
  );

  if (!groupExists) {
    await redis.xgroup("CREATE", "guest-stream", groupName, "$", (err) => {
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
    "guest-stream",
    ">",
    (err, stream) => {
      if (err) {
        console.error("Failed to read guests from stream");
      }

      console.log(1);
      const guests = stream[0][1].map((data) => JSON.parse(data[1][1]));

      socket.emit("guests", guests);
    }
  );
};

module.exports = guestStreamHandler;
