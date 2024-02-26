const tableStreamHandler = async (redis, socket, groupName) => {
  const groupExists = await redis.xinfo(
    "STREAM",
    "table-stream",
    "GROUPS",
    (err, groups) => {
      if (err) {
        console.error("Failed to get stream info");
      }

      return groups.some((group) => group[1] === groupName);
    }
  );

  if (!groupExists) {
    await redis.xgroup("CREATE", "table-stream", groupName, "$", (err) => {
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
    "table-stream",
    ">",
    (err, stream) => {
      if (err) {
        console.error("Failed to read tables from stream");
      }

      console.log(1);
      const tables = stream[0][1].map((data) => JSON.parse(data[1][1]));

      socket.emit("tables", tables);
    }
  );
};

module.exports = tableStreamHandler;