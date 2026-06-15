const DEFAULT_PINBOARD_PROFILE = "https://pinboard.in/u:maisy/";
const DEFAULT_GOODREADS_PROFILE =
  "https://www.goodreads.com/user/show/144475056-mei";

export function getProfileLinks() {
  return {
    pinboard: process.env.PINBOARD_PROFILE_URL ?? DEFAULT_PINBOARD_PROFILE,
    goodreads:
      process.env.GOODREADS_PROFILE_URL ?? DEFAULT_GOODREADS_PROFILE,
  };
}
