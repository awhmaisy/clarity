function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function extractItemAbout(block: string): string | undefined {
  const match = block.match(/<item[^>]*rdf:about=["']([^"']+)["']/i);
  return match?.[1];
}

function extractTag(block: string, tag: string): string | undefined {
  const cdata = new RegExp(
    `<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`,
    "i",
  );
  const cdataMatch = block.match(cdata);
  if (cdataMatch) return decodeEntities(cdataMatch[1]);

  const plain = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const plainMatch = block.match(plain);
  if (plainMatch) return decodeEntities(plainMatch[1]);

  return undefined;
}

function extractLink(block: string): string | undefined {
  const resource = block.match(
    /<link[^>]*rdf:resource=["']([^"']+)["']/i,
  );
  if (resource) return resource[1];

  const alternate = block.match(
    /<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i,
  );
  if (alternate) return alternate[1];

  const href = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i);
  if (href) return href[1];

  const plain = extractTag(block, "link");
  if (plain?.startsWith("http")) return plain;

  return undefined;
}

function parseDate(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export interface RssItem {
  title: string;
  url?: string;
  summary?: string;
  date?: Date;
  author?: string;
  shelf?: string;
  tags?: string;
}

export function parseRss(xml: string, limit?: number): RssItem[] {
  const blocks =
    xml.match(/<item\b[\s\S]*?<\/item>/gi) ??
    xml.match(/<entry\b[\s\S]*?<\/entry>/gi) ??
    [];

  const items: RssItem[] = [];

  for (const block of blocks) {
    if (limit !== undefined && items.length >= limit) break;

    const title =
      extractTag(block, "title") ??
      extractTag(block, "description") ??
      extractTag(block, "dc:title");
    if (!title) continue;

    const url = extractLink(block) ?? extractItemAbout(block);
    const summary =
      extractTag(block, "description") ??
      extractTag(block, "summary") ??
      extractTag(block, "content");
    const author = extractTag(block, "author_name");
    const shelf = extractTag(block, "user_shelves");
    const tags = extractTag(block, "hash");
    const date =
      parseDate(extractTag(block, "user_date_added")) ??
      parseDate(extractTag(block, "dc:date")) ??
      parseDate(extractTag(block, "pubDate")) ??
      parseDate(extractTag(block, "published")) ??
      parseDate(extractTag(block, "updated"));

    items.push({ title, url, summary, date, author, shelf, tags });
  }

  return items;
}

export async function fetchRss(
  url: string,
  limit?: number,
  options?: { timeoutMs?: number; userAgent?: string },
): Promise<RssItem[]> {
  const response = await fetch(url, {
    next: { revalidate: 3600 },
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml, application/json",
      "User-Agent": options?.userAgent ?? "clarity-satellite/1.0",
    },
    signal: AbortSignal.timeout(options?.timeoutMs ?? 15000),
  });

  if (!response.ok) {
    throw new Error(`RSS fetch failed (${response.status})`);
  }

  const text = await response.text();
  if (!text.trim().startsWith("<")) {
    throw new Error("RSS feed unavailable");
  }

  return parseRss(text, limit);
}
