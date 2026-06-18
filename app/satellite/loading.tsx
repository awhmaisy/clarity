import { SiteHeader } from "@/components/site-header";

export default function SatelliteLoading() {
  return (
    <div className="page">
      <SiteHeader active="/satellite" />

      <main>
        <p className="page-lead text-muted">loading feeds…</p>
      </main>
    </div>
  );
}
