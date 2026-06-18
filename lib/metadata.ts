import type { Metadata } from "next";
import { site } from "./site";

export const siteDescription =
  "Hello, with all my delight!";

export const ogImage = {
  url: "/images/sayu-mei.JPG",
  width: 1010,
  height: 1532,
  alt: "An empress with her wolf familiar and a crow under a full moon",
} as const;

export const siteMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: site.name,
    description: siteDescription,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: siteDescription,
    creator: site.x.handle,
    images: [ogImage.url],
  },
};

export function pageMetadata(
  title: string,
  description: string = siteDescription,
): Metadata {
  const shareTitle = `${title} — ${site.name}`;

  return {
    title,
    description,
    openGraph: {
      title: shareTitle,
      description,
      images: [ogImage],
    },
    twitter: {
      title: shareTitle,
      description,
      images: [ogImage.url],
    },
  };
}
