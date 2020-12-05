if (typeof window === "undefined") {
  /**
   * Settings exposed to the server.
   */
  module.exports = {
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    DISCORD_BOT_PERMISSION: process.env.DISCORD_BOT_PERMISSION,
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID,
    MONGODB_URI: process.env.MONGODB_URI,
    SESSION_COOKIE_SECRET: process.env.SESSION_COOKIE_SECRET,
    SESSION_COOKIE_LIFETIME: process.env.SESSION_COOKIE_LIFETIME,
  };
} else {
  /**
   * Settings exposed to the client.
   */
  module.exports = {
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  };
}
