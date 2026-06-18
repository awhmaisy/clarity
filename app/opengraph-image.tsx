import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteDescription } from "@/lib/metadata";

export const alt = "Mei Higashi — narrative architect and persona designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [copernicus, cosmicaMono] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/Copernicus-Book.otf")),
    readFile(
      join(process.cwd(), "public/fonts/Cosmica Mono/CosmicaMono-Regular.otf"),
    ),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#f7f6f3",
          color: "#1c1c1a",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px 96px",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#e4e3de",
            height: 1,
            width: "100%",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div
            style={{
              fontFamily: "Copernicus",
              fontSize: 72,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
            }}
          >
            mei higashi
          </div>
          <div
            style={{
              color: "#6e6e6a",
              fontFamily: "Copernicus",
              fontSize: 30,
              letterSpacing: "-0.03em",
              lineHeight: 1.45,
              maxWidth: 760,
            }}
          >
            {siteDescription}
          </div>
        </div>

        <div
          style={{
            alignItems: "flex-end",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            width: "100%",
          }}
        >
          <div
            style={{
              background: "#e4e3de",
              height: 1,
              width: "100%",
            }}
          />
          <div
            style={{
              color: "#6e6e6a",
              fontFamily: "Cosmica Mono",
              fontSize: 22,
              letterSpacing: "0.02em",
            }}
          >
            meihigashi.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Copernicus",
          data: copernicus,
          style: "normal",
          weight: 400,
        },
        {
          name: "Cosmica Mono",
          data: cosmicaMono,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
