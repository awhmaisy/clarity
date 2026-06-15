import fs from "fs";
import path from "path";
import { parseFrontmatter } from "./frontmatter";

export interface LexiconQuarter {
  id: string;
  label: string;
  terms: string[];
}

const lexiconPath = path.join(process.cwd(), "content/cache/lexicon.md");

export function getLexiconTitle(): string {
  if (!fs.existsSync(lexiconPath)) return "lexicon";

  const raw = fs.readFileSync(lexiconPath, "utf8");
  const { meta } = parseFrontmatter(raw);
  return meta.title ?? "lexicon";
}

export function getLexiconQuarters(): LexiconQuarter[] {
  if (!fs.existsSync(lexiconPath)) return [];

  const raw = fs.readFileSync(lexiconPath, "utf8");
  const { content } = parseFrontmatter(raw);

  return content
    .split(/^## /m)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, index) => {
      const lines = block.split("\n");
      const label = lines[0]?.trim() ?? "";
      const terms = lines
        .slice(1)
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- "))
        .map((line) => line.slice(2).trim());

      return {
        id: `lexicon-${index}-${label}`,
        label,
        terms,
      };
    });
}
