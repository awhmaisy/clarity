import { PINBOARD_FEED_URLS, PINBOARD_PROFILE_URL } from "./pinboard-config";
import { parseRss, type RssItem } from "./rss";
import { normalizeSatelliteTitle } from "./satellite-format";
import type { SatelliteItem } from "./satellite";

const PINBOARD_FETCH_TIMEOUT_MS = 12_000;
const PINBOARD_FEED_MAX = 400;
const PINBOARD_FETCH_RETRIES = 3;
const PINBOARD_FETCH_RETRY_DELAY_MS = 750;

const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

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

function withFeedCount(url: string): string {
  const parsed = new URL(url);
  if (!parsed.searchParams.has("count")) {
    parsed.searchParams.set("count", String(PINBOARD_FEED_MAX));
  }
  return parsed.toString();
}

function feedUrlToJson(url: string): string {
  const jsonUrl = url.includes("/json/")
    ? url
    : url.replace("/rss/", "/json/");
  return withFeedCount(jsonUrl);
}

function feedUrlToRss(url: string): string {
  const rssUrl = url.includes("/rss/")
    ? url
    : url.replace("/json/", "/rss/");
  return withFeedCount(rssUrl);
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPinboardFeedText(
  url: string,
  userAgent = "clarity-satellite/1.0",
): Promise<string> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < PINBOARD_FETCH_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        headers: {
          Accept:
            "application/rss+xml, application/xml, text/xml, application/json, text/plain, text/html",
          "User-Agent": userAgent,
        },
        signal: AbortSignal.timeout(PINBOARD_FETCH_TIMEOUT_MS),
      });

      const text = await response.text();
      if (!response.ok) {
        throw new Error(`Pinboard feed failed (${response.status})`);
      }

      if (text.includes("service is not available")) {
        throw new Error("Pinboard feed unavailable");
      }

      if (!text.trim()) {
        throw new Error("Pinboard feed empty");
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
  const trimmed = text.trim();
  if (!trimmed.startsWith("[") && !trimmed.startsWith("{")) {
    throw new Error("Pinboard JSON feed unavailable");
  }

  const data = JSON.parse(trimmed) as PinboardJsonPost[] | { posts?: PinboardJsonPost[] };
  const posts = Array.isArray(data) ? data : (data.posts ?? []);
  return parsePinboardPosts(posts);
}

async function fetchPinboardRss(url: string): Promise<SatelliteItem[]> {
  const text = await fetchPinboardFeedText(feedUrlToRss(url));
  return parsePinboardRssXml(text);
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

function parsePinboardProfileHtml(html: string): SatelliteItem[] {
  if (html.includes("annoying captcha")) return [];

  const items: SatelliteItem[] = [];
  const seen = new Set<string>();
  const bookmarkPattern =
    /<div class="bookmark" id="([^"]+)"[\s\S]*?<a class="bookmark_title\s*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;

  for (const match of html.matchAll(bookmarkPattern)) {
    const [, hash, url, rawTitle] = match;
    if (!url || seen.has(url)) continue;
    if (!url.startsWith("http")) continue;

    const title = rawTitle.replace(/<[^>]+>/g, "").trim();
    if (!title) continue;

    seen.add(url);
    items.push({
      id: `pinboard-${hash ?? url}-${items.length}`,
      source: "pinboard",
      title: normalizeSatelliteTitle(title),
      url,
      date: new Date(0),
    });
  }

  return items;
}

async function scrapePinboardProfile(
  profileUrl: string,
): Promise<SatelliteItem[]> {
  const html = await fetchPinboardFeedText(profileUrl, BROWSER_USER_AGENT);
  return parsePinboardProfileHtml(html);
}

export async function fetchPinboardItems(): Promise<SatelliteItem[]> {
  const items: SatelliteItem[] = [];
  const seen = new Set<string>();

  function addItems(fetched: SatelliteItem[]) {
    for (const item of fetched) {
      if (seen.has(item.url)) continue;
      seen.add(item.url);
      items.push(item);
    }
  }

  for (const url of PINBOARD_FEED_URLS) {
    try {
      const fetched = await fetchPinboardFromFeedUrl(url);
      addItems(fetched);
      if (items.length > 0) break;
    } catch {
      continue;
    }
  }

  if (items.length === 0) {
    try {
      addItems(await scrapePinboardProfile(PINBOARD_PROFILE_URL));
    } catch {
      // Profile scrape is a last resort when feeds fail.
    }
  }

  return items.sort((a, b) => b.date.getTime() - a.date.getTime());
}
