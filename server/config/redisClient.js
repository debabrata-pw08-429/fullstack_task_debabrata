// -------------------[ Cloud Setup with authentication ]-------------------------//

const redis = require("redis");

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  legacyMode: true,
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisClient.on("ready", () => {
  console.log("Redis client connected successfully");
});

redisClient.connect().catch(console.error);

module.exports = redisClient;

// -------------------[ Local Setup without authentication ]-------------------------//

// const redis = require("redis");

// const redisClient = redis.createClient({
//   url: `redis://127.0.0.1:6379`,
//   legacyMode: true,
// });

// redisClient.on("error", (err) => {
//   console.error("Redis connection error:", err);
// });

// redisClient.on("ready", () => {
//   console.log("Redis client connected successfully");
// });

// redisClient.connect().catch(console.error);

// module.exports = redisClient;
