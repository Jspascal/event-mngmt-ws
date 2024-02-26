require("dotenv").config({ path: ".env" });

module.exports = {
  port: 3001,

  eventGroupName: "event-group",
  guestGroupName: "guest-group",
  tableGroupName: "table-group",
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    user: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
  },
};
