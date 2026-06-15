import type { Metadata } from "next";
import { SatelliteColumns } from "@/components/satellite-columns";
import { SatellitePagination } from "@/components/satellite-pagination";
import { SiteHeader } from "@/components/site-header";
import { getProfileLinks } from "@/lib/profiles";
import { getSatellitePage } from "@/lib/satellite";

export const metadata: Metadata = {
  title: "Satellite",
  description: "A live log of bookmarks and books.",
};

export const revalidate = 600;

export default async function SatellitePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const requestedPage = Number.parseInt(pageParam ?? "1", 10);
  const page = Number.isFinite(requestedPage) ? requestedPage : 1;
  const {
    pinboardItems,
    goodreadsItems,
    page: currentPage,
    totalPages,
    pinboardCount,
    goodreadsCount,
  } = await getSatellitePage(page);
  const profiles = getProfileLinks();

  return (
    <div className="page">
      <SiteHeader active="/satellite" />

      <main>
        <SatelliteColumns
          pinboardItems={pinboardItems}
          goodreadsItems={goodreadsItems}
          pinboardCount={pinboardCount}
          goodreadsCount={goodreadsCount}
          pinboardProfileUrl={profiles.pinboard}
          goodreadsProfileUrl={profiles.goodreads}
        />
        <SatellitePagination page={currentPage} totalPages={totalPages} />
      </main>
    </div>
  );
}
