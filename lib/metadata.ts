import type { Metadata } from "next";
import { site } from "./site";

export const siteDescription =
  "Narrative architect and persona designer. Stream of consciousness, references, and other occupants of my room on the web.";

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
  },
  twitter: {
    card: "summary",
    title: site.name,
    description: siteDescription,
    creator: site.x.handle,
  },
};

export function pageMetadata(
  title: string,
  description: string = siteDescription,
): Metadata {
  return { title, description };
}
