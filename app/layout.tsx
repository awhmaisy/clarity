import type { Metadata } from "next";
import { DevToolsNote } from "@/components/devtools-note";
import { copernicus, cosmicaMono } from "@/lib/fonts";
import { elementsNoteScript } from "@/lib/console-note";
import { siteMetadata } from "@/lib/metadata";
import "./globals.css";

export const metadata: Metadata = siteMetadata;

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
        <script dangerouslySetInnerHTML={{ __html: elementsNoteScript }} />
        <DevToolsNote />
        {children}
      </body>
    </html>
  );
}
