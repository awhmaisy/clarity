import fs from "fs";
import path from "path";
import { parseFrontmatter } from "./frontmatter";
import { site } from "./site";

export interface UploadingItem {
  id: string;
  text: string;
}

const uploadingPath = path.join(process.cwd(), "content/uploading.md");

export function getUploadingMeta(): { accountUrl: string } {
  if (!fs.existsSync(uploadingPath)) {
    return { accountUrl: site.uploading.url };
  }

  const raw = fs.readFileSync(uploadingPath, "utf8");
  const { meta } = parseFrontmatter(raw);

  return {
    accountUrl: meta.account ?? site.uploading.url,
  };
}

export function getUploadingItems(): UploadingItem[] {
  if (!fs.existsSync(uploadingPath)) return [];

  const raw = fs.readFileSync(uploadingPath, "utf8");
  const { content } = parseFrontmatter(raw);

  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line, index) => ({
      id: `uploading-${index}`,
      text: line.slice(2).trim(),
    }));
}
