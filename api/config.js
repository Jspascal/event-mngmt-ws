require("dotenv").config({ path: ".env" });

module.exports = {
  port: 3000,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    user: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
  },
};
