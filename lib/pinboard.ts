import { parseRss, type RssItem } from "./rss";
import { normalizeSatelliteTitle } from "./satellite-format";
import type { SatelliteItem } from "./satellite";

const PINBOARD_FETCH_TIMEOUT_MS = 120_000;
const PINBOARD_FEED_MAX = 400;
const PINBOARD_FETCH_RETRIES = 12;
const PINBOARD_FETCH_RETRY_DELAY_MS = 2000;

interface PinboardJsonPost {
  href?: string;
  u?: string;
  description?: string;
  d?: string;
  time?: string;
  dt?: string;
  hash?: string;
  h?: string;
}

interface PinboardApiResponse {
  posts?: PinboardJsonPost[];
}

function normalizePinboardJsonPost(post: PinboardJsonPost) {
  const url = post.href ?? post.u;
  const description = post.description ?? post.d;
  if (!url || !description) return null;

  let date = new Date(0);
  if (post.time) {
    date = new Date(Number.parseInt(post.time, 10) * 1000);
  } else if (post.dt) {
    const parsed = new Date(post.dt);
    if (!Number.isNaN(parsed.getTime())) date = parsed;
  }

  return {
    url,
    description,
    hash: post.hash ?? post.h,
    date,
  };
}
type PinboardPostList = PinboardJsonPost[];
function parsePinboardPosts(posts: PinboardPostList): SatelliteItem[] {
  const items: SatelliteItem[] = [];

  for (const [index, post] of posts.entries()) {
    const normalized = normalizePinboardJsonPost(post);
    if (!normalized) continue;

    items.push({
      id: `pinboard-${normalized.hash ?? normalized.url}-${index}`,
      source: "pinboard",
      title: normalizeSatelliteTitle(normalized.description),
      url: normalized.url,
      date: normalized.date,
    });
  }

  return items.sort((a, b) => b.date.getTime() - a.date.getTime());
}

function feedUrlToJson(url: string): string {
  const jsonUrl = url.includes("/json/")
    ? url
    : url.replace("/rss/", "/json/");

  const parsed = new URL(jsonUrl);
  if (!parsed.searchParams.has("count")) {
    parsed.searchParams.set("count", String(PINBOARD_FEED_MAX));
  }

  return parsed.toString();
}

function feedUrlToRss(url: string): string {
  const rssUrl = url.includes("/rss/")
    ? url
    : url.replace("/json/", "/rss/");

  const parsed = new URL(rssUrl);
  if (!parsed.searchParams.has("count")) {
    parsed.searchParams.set("count", String(PINBOARD_FEED_MAX));
  }

  return parsed.toString();
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPinboardFeedText(url: string): Promise<string> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < PINBOARD_FETCH_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        headers: {
          Accept:
            "application/rss+xml, application/xml, text/xml, application/json, text/plain",
          "User-Agent": "clarity-satellite/1.0",
        },
        signal: AbortSignal.timeout(PINBOARD_FETCH_TIMEOUT_MS),
      });

      const text = await response.text();
      if (!response.ok) {
        throw new Error(`Pinboard feed failed (${response.status})`);
      }

      if (!text.trim().startsWith("<") && !text.trim().startsWith("[")) {
        throw new Error("Pinboard feed unavailable");
      }

      return text;
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error("Pinboard feed failed");
      if (attempt < PINBOARD_FETCH_RETRIES - 1) {
        await sleep(PINBOARD_FETCH_RETRY_DELAY_MS);
      }
    }
  }

  throw lastError ?? new Error("Pinboard feed failed");
}

function normalizePinboardRssItem(
  item: RssItem,
  index: number,
): SatelliteItem | null {
  const url = item.url;
  if (!url) return null;

  const title =
    item.title ||
    (() => {
      try {
        return new URL(url).hostname.replace(/^www\./, "");
      } catch {
        return url;
      }
    })();

  return {
    id: `pinboard-${url}-${index}`,
    source: "pinboard",
    title: normalizeSatelliteTitle(title),
    url,
    date: item.date ?? new Date(0),
  };
}

function parsePinboardRssXml(xml: string): SatelliteItem[] {
  const items = parseRss(xml)
    .map((item, index) => normalizePinboardRssItem(item, index))
    .filter((item): item is SatelliteItem => item !== null);

  if (items.length > 0) return items;

  const resources =
    xml.match(/<rdf:li[^>]*rdf:resource=["']([^"']+)["']/gi) ?? [];

  const fallbackItems: SatelliteItem[] = [];

  for (const [index, line] of resources.entries()) {
    const match = line.match(/rdf:resource=["']([^"']+)["']/i);
    const url = match?.[1];
    if (!url) continue;

    try {
      const hostname = new URL(url).hostname.replace(/^www\./, "");
      fallbackItems.push({
        id: `pinboard-${url}-${index}`,
        source: "pinboard",
        title: normalizeSatelliteTitle(hostname),
        url,
        date: new Date(0),
      });
    } catch {
      continue;
    }
  }

  return fallbackItems;
}

async function fetchPinboardJson(url: string): Promise<SatelliteItem[]> {
  const text = await fetchPinboardFeedText(feedUrlToJson(url));
  const data = JSON.parse(text) as PinboardJsonPost[] | PinboardApiResponse;
  const posts = Array.isArray(data) ? data : (data.posts ?? []);
  return parsePinboardPosts(posts);
}

async function fetchPinboardRss(url: string): Promise<SatelliteItem[]> {
  const text = await fetchPinboardFeedText(feedUrlToRss(url));
  return parsePinboardRssXml(text);
}

async function fetchPinboardApi(authToken: string): Promise<SatelliteItem[]> {
  const url = new URL("https://api.pinboard.in/v1/posts/all");
  url.searchParams.set("format", "json");
  url.searchParams.set("auth_token", authToken);

  const response = await fetch(url.toString(), {
    cache: "no-store",
    headers: { "User-Agent": "clarity-satellite/1.0" },
    signal: AbortSignal.timeout(PINBOARD_FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Pinboard API failed (${response.status})`);
  }

  const data = (await response.json()) as PinboardApiResponse;
  return parsePinboardPosts(data.posts ?? []);
}

async function fetchPinboardFromFeedUrl(url: string): Promise<SatelliteItem[]> {
  try {
    const jsonItems = await fetchPinboardJson(url);
    if (jsonItems.length > 0) return jsonItems;
  } catch {
    // Fall through to RSS if JSON is unavailable.
  }

  return fetchPinboardRss(url);
}

export async function fetchPinboardItems(): Promise<SatelliteItem[]> {
  const apiToken = process.env.PINBOARD_API_TOKEN?.trim();
  const feedUrls = (process.env.PINBOARD_RSS_URL ?? "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  if (apiToken) {
    try {
      return await fetchPinboardApi(apiToken);
    } catch {
      // Fall through to feed URLs if the API is rate-limited or unavailable.
    }
  }

  if (feedUrls.length === 0) return [];

  const items: SatelliteItem[] = [];
  const seen = new Set<string>();

  for (const url of feedUrls) {
    try {
      const fetched = await fetchPinboardFromFeedUrl(url);
      for (const item of fetched) {
        if (seen.has(item.url)) continue;
        seen.add(item.url);
        items.push(item);
      }
    } catch {
      continue;
    }
  }

  return items.sort((a, b) => b.date.getTime() - a.date.getTime());
}
