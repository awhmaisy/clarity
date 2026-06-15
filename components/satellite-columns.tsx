import { SatelliteStream } from "@/components/satellite-stream";
import type { SatelliteItem } from "@/lib/satellite";

export function SatelliteColumns({
  pinboardItems,
  goodreadsItems,
  pinboardCount,
  goodreadsCount,
  pinboardProfileUrl,
  goodreadsProfileUrl,
}: {
  pinboardItems: SatelliteItem[];
  goodreadsItems: SatelliteItem[];
  pinboardCount: number;
  goodreadsCount: number;
  pinboardProfileUrl: string;
  goodreadsProfileUrl: string;
}) {
  return (
    <div className="satellite-columns">
      <section className="satellite-column">
        <h2 className="section-label">
          <a
            href={pinboardProfileUrl}
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pinboard
          </a>{" "}
          [{pinboardCount}]
        </h2>
        <SatelliteStream
          items={pinboardItems}
          emptyMessage="No bookmarks loaded yet."
        />
      </section>

      <section className="satellite-column">
        <h2 className="section-label">
          <a
            href={goodreadsProfileUrl}
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Goodreads
          </a>{" "}
          [{goodreadsCount}]
        </h2>
        <SatelliteStream
          items={goodreadsItems}
          emptyMessage="No books loaded yet."
        />
      </section>
    </div>
  );
}
