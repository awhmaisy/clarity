"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function SatelliteError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="page">
      <SiteHeader active="/satellite" />

      <main className="home-copy prose">
        <p>feeds took too long or failed to load.</p>
        <p>
          <button type="button" className="home-photo-toggle" onClick={reset}>
            try again
          </button>
          {" · "}
          <Link href="/" className="link">
            home
          </Link>
        </p>
      </main>
    </div>
  );
}
