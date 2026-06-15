import type { Metadata } from "next";
import { copernicus, cosmicaMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mei Higashi",
    template: "%s — Mei Higashi",
  },
  description:
    "Narrative architect and design internet personas. Stream of consciousness, worldview, and writing.",
};

const themeScript = `
(function () {
  try {
    var theme = localStorage.getItem("theme");
    if (
      theme === "dark" ||
      (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.dataset.theme = "dark";
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${copernicus.variable} ${cosmicaMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-serif antialiased">
        {children}
      </body>
    </html>
  );
}
