import { PINBOARD_PROFILE_URL } from "./pinboard-config";
import { GOODREADS_PROFILE_URL } from "./goodreads-config";

export function getProfileLinks() {
  return {
    pinboard: PINBOARD_PROFILE_URL,
    goodreads: GOODREADS_PROFILE_URL,
  };
}
