import localFont from "next/font/local";

export const copernicus = localFont({
  src: [
    {
      path: "../public/fonts/Copernicus-Book.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Copernicus-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-copernicus",
  display: "swap",
});

export const cosmicaMono = localFont({
  src: [
    {
      path: "../public/fonts/Cosmica Mono/CosmicaMono-Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-cosmica-mono",
  display: "swap",
});
