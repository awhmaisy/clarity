import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      {
        source: "/uploading",
        destination: "/upload",
        permanent: true,
      },
      {
        source: "/reading",
        destination: "/satellite",
        permanent: true,
      },
      {
        source: "/lexicon",
        destination: "/cache",
        permanent: true,
      },
      {
        source: "/cache/:slug",
        destination: "/cache",
        permanent: true,
      },
      {
        source: "/writing",
        destination: "https://www.meihigashi.com/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
