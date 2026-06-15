export const PINBOARD_USER = "maisy";

export const PINBOARD_PROFILE_URL = `https://pinboard.in/u:${PINBOARD_USER}/`;

/** Private feed token — required for bookmarks when the public feed is empty. */
const PINBOARD_FEED_SECRET = "b688182543b27bbda542";

export const PINBOARD_FEED_URLS = [
  `https://feeds.pinboard.in/json/secret:${PINBOARD_FEED_SECRET}/u:${PINBOARD_USER}/`,
  `https://feeds.pinboard.in/rss/secret:${PINBOARD_FEED_SECRET}/u:${PINBOARD_USER}/`,
  `https://feeds.pinboard.in/json/u:${PINBOARD_USER}/`,
  `https://feeds.pinboard.in/rss/u:${PINBOARD_USER}/`,
] as const;
