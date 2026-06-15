import fs from "fs";
import path from "path";
import { parseFrontmatter } from "./frontmatter";
import { getLexiconQuarters } from "./lexicon";

export interface CacheEntry {
  slug: string;
  title: string;
  description?: string;
}

export interface CacheSection {
  id: string;
  label?: string;
  paragraphs: string[];
  items: string[];
}

const cacheDir = path.join(process.cwd(), "content/cache");

const slugOrder = ["lexicon", "music", "books"];

function parseBlock(text: string): { paragraphs: string[]; items: string[] } {
  const paragraphs: string[] = [];
  const items: string[] = [];
  let currentParagraph: string[] = [];

  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentParagraph.length) {
        paragraphs.push(currentParagraph.join(" "));
        currentParagraph = [];
      }
      continue;
    }

    if (trimmed.startsWith("- ")) {
      if (currentParagraph.length) {
        paragraphs.push(currentParagraph.join(" "));
        currentParagraph = [];
      }
      items.push(trimmed.slice(2).trim());
    } else {
      currentParagraph.push(trimmed);
    }
  }

  if (currentParagraph.length) {
    paragraphs.push(currentParagraph.join(" "));
  }

  return { paragraphs, items };
}

function readEntry(slug: string): {
  meta: Record<string, string>;
  content: string;
} | null {
  const filePath = path.join(cacheDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { meta, content } = parseFrontmatter(raw);

  return { meta, content };
}

export function getCacheSlugs(): string[] {
  if (!fs.existsSync(cacheDir)) return [];

  return fs
    .readdirSync(cacheDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.slice(0, -3));
}

export function getCacheEntries(): CacheEntry[] {
  const entries: CacheEntry[] = [];

  for (const slug of getCacheSlugs()) {
    const entry = readEntry(slug);
    if (!entry) continue;

    entries.push({
      slug,
      title: entry.meta.title ?? slug,
      description: entry.meta.description,
    });
  }

  return entries.sort((a, b) => {
      const aIndex = slugOrder.indexOf(a.slug);
      const bIndex = slugOrder.indexOf(b.slug);

      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;

      return a.title.localeCompare(b.title);
    });
}

export function getCacheEntry(slug: string): CacheEntry | null {
  const entry = readEntry(slug);
  if (!entry) return null;

  return {
    slug,
    title: entry.meta.title ?? slug,
    description: entry.meta.description,
  };
}

export function getCacheContent(slug: string): string {
  return readEntry(slug)?.content ?? "";
}

export function parseCacheSections(content: string): CacheSection[] {
  const trimmed = content.trim();
  if (!trimmed) return [];

  const blocks = trimmed.split(/^## /m).map((block) => block.trim()).filter(Boolean);
  const sections: CacheSection[] = [];

  if (!trimmed.startsWith("##")) {
    const intro = parseBlock(blocks[0] ?? "");
    if (intro.paragraphs.length || intro.items.length) {
      sections.push({
        id: "intro",
        paragraphs: intro.paragraphs,
        items: intro.items,
      });
    }

    for (const block of blocks.slice(1)) {
      const lines = block.split("\n");
      const label = lines[0]?.trim() ?? "";
      const body = parseBlock(lines.slice(1).join("\n"));

      sections.push({
        id: label,
        label,
        paragraphs: body.paragraphs,
        items: body.items,
      });
    }

    return sections;
  }

  for (const block of blocks) {
    const lines = block.split("\n");
    const label = lines[0]?.trim() ?? "";
    const body = parseBlock(lines.slice(1).join("\n"));

    sections.push({
      id: label,
      label,
      paragraphs: body.paragraphs,
      items: body.items,
    });
  }

  return sections;
}

export function getAllCacheListItems(): string[] {
  const items: string[] = [];

  for (const entry of getCacheEntries()) {
    if (entry.slug === "lexicon") {
      for (const quarter of getLexiconQuarters()) {
        items.push(...quarter.terms);
      }
      continue;
    }

    const content = getCacheContent(entry.slug);
    for (const section of parseCacheSections(content)) {
      items.push(...section.paragraphs, ...section.items);
    }
  }

  return items;
}
