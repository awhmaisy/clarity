import { unstable_cache } from "next/cache";
import { GOODREADS_RSS_URL } from "./goodreads-config";
import { fetchPinboardItems } from "./pinboard";
import { fetchRss, type RssItem } from "./rss";
import { normalizeSatelliteTitle } from "./satellite-format";

export type SatelliteSource = "pinboard" | "goodreads";

export interface SatelliteItem {
  id: string;
  source: SatelliteSource;
  title: string;
  url: string;
  date: Date;
}

export const SATELLITE_PAGE_SIZE = 8;
const SATELLITE_FETCH_BUDGET_MS = 8_000;

function parseGoodreadsTitle(raw: string): string {
  const patterns = [
    /^.+ reviewed (.+)$/i,
    /^.+ is currently reading (.+)$/i,
    /^.+ read (.+)$/i,
    /^.+ rated (.+)$/i,
    /^.+ wants to read (.+)$/i,
    /^.+ added (.+)$/i,
  ];

  for (const regex of patterns) {
    const match = raw.match(regex);
    if (match) return match[1].trim();
  }

  return raw;
}

function normalizeGoodreads(
  item: RssItem,
  index: number,
): SatelliteItem | null {
  if (!item.title || !item.url) return null;

  const title = item.shelf
    ? item.title
    : parseGoodreadsTitle(item.title);
  const date = item.date ?? new Date(0);

  return {
    id: `goodreads-${item.url}-${index}`,
    source: "goodreads",
    title: normalizeSatelliteTitle(title),
    url: item.url,
    date,
  };
}

async function loadSource(
  urls: string[],
  normalize: (item: RssItem, index: number) => SatelliteItem | null,
): Promise<SatelliteItem[]> {
  if (urls.length === 0) return [];

  const results = await Promise.allSettled(
    urls.map((url) => fetchRss(url)),
  );

  const items: SatelliteItem[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") continue;

    result.value.forEach((item, index) => {
      const normalized = normalize(item, index);
      if (normalized) items.push(normalized);
    });
  }

  return items.sort((a, b) => b.date.getTime() - a.date.getTime());
}

function deserializeItems(
  items: Array<Omit<SatelliteItem, "date"> & { date: number }>,
): SatelliteItem[] {
  return items.map((item) => ({
    ...item,
    date: new Date(item.date),
  }));
}

function serializeItems(items: SatelliteItem[]) {
  return items.map((item) => ({
    ...item,
    date: item.date.getTime(),
  }));
}

async function withFetchBudget<T>(
  label: string,
  fetcher: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await Promise.race([
      fetcher(),
      new Promise<T>((resolve) => {
        setTimeout(() => resolve(fallback), SATELLITE_FETCH_BUDGET_MS);
      }),
    ]);
  } catch (error) {
    console.error(`[satellite] ${label} failed`, error);
    return fallback;
  }
}

const getCachedPinboardItems = unstable_cache(
  async () => serializeItems(await fetchPinboardItems()),
  ["satellite-pinboard-v5"],
  { revalidate: 600 },
);

const getCachedGoodreadsItems = unstable_cache(
  async () =>
    serializeItems(
      await loadSource([GOODREADS_RSS_URL], normalizeGoodreads),
    ),
  ["satellite-goodreads-v3"],
  { revalidate: 3600 },
);

async function getPinboardItems(): Promise<SatelliteItem[]> {
  const cached = await withFetchBudget(
    "pinboard cache",
    () => getCachedPinboardItems(),
    [],
  );
  return deserializeItems(cached);
}

async function getGoodreadsItems(): Promise<SatelliteItem[]> {
  const cached = await withFetchBudget(
    "goodreads cache",
    () => getCachedGoodreadsItems(),
    [],
  );
  return deserializeItems(cached);
}

function paginateItems(items: SatelliteItem[], page: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / SATELLITE_PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * SATELLITE_PAGE_SIZE;

  return {
    items: items.slice(start, start + SATELLITE_PAGE_SIZE),
    totalPages,
    currentPage,
  };
}

export async function getSatellitePage(page = 1) {
  const [pinboard, goodreads] = await Promise.all([
    getPinboardItems(),
    getGoodreadsItems(),
  ]);

  const pinboardPage = paginateItems(pinboard, page);
  const goodreadsPage = paginateItems(goodreads, page);
  const totalPages = Math.max(
    pinboardPage.totalPages,
    goodreadsPage.totalPages,
  );

  return {
    pinboardItems: pinboardPage.items,
    goodreadsItems: goodreadsPage.items,
    page: Math.min(Math.max(1, page), totalPages),
    totalPages,
    pinboardCount: pinboard.length,
    goodreadsCount: goodreads.length,
    totalItems: pinboard.length + goodreads.length,
  };
}
