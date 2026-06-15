import fs from "fs";
import path from "path";

const imagesDir = path.join(process.cwd(), "public/images");

const preferredNames = [
  "mei.jpg",
  "mei.jpeg",
  "me.jpg",
  "me.jpeg",
  "me.png",
  "me.webp",
];

export function getHomePhoto(): string | null {
  for (const name of preferredNames) {
    if (fs.existsSync(path.join(imagesDir, name))) {
      return `/images/${encodeURIComponent(name)}`;
    }
  }

  const file = fs
    .readdirSync(imagesDir)
    .find((name) => /\.(jpe?g|png|webp)$/i.test(name));

  return file ? `/images/${encodeURIComponent(file)}` : null;
}
