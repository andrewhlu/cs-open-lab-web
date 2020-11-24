require("dotenv").config();

module.exports = {
  env: {
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    SESSION_COOKIE_SECRET:
      // A default value is defined for development and CI
      // For production, a secure value should be defined as
      // explained here: https://martinfowler.com/articles/session-secret.html
      process.env.SESSION_COOKIE_SECRET ||
      "viloxyf_z2GW6K4CT-KQD_MoLEA2wqv5jWuq4Jd0P7ymgG5GJGMpvMneXZzhK3sL",
    SESSION_COOKIE_LIFETIME: 7200, // 2 hours
  },
};
