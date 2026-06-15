import Link from "next/link";
import { Fragment } from "react";

function pageHref(page: number) {
  return page === 1 ? "/satellite" : `/satellite?page=${page}`;
}

export function SatellitePagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      className="satellite-pagination"
      aria-label="Satellite feed pages"
    >
      {page > 1 ? (
        <Link
          href={pageHref(page - 1)}
          className="satellite-pagination-arrow link"
          aria-label="Previous page"
        >
          ←
        </Link>
      ) : (
        <span className="satellite-pagination-arrow text-muted" aria-hidden>
          ←
        </span>
      )}

      <span className="satellite-pagination-pages">
        {pages.map((pageNumber, index) => (
          <Fragment key={pageNumber}>
            {index > 0 ? (
              <span className="satellite-pagination-sep">/</span>
            ) : null}
            {pageNumber === page ? (
              <span className="satellite-pagination-current">{pageNumber}</span>
            ) : (
              <Link href={pageHref(pageNumber)} className="link">
                {pageNumber}
              </Link>
            )}
          </Fragment>
        ))}
      </span>

      {page < totalPages ? (
        <Link
          href={pageHref(page + 1)}
          className="satellite-pagination-arrow link"
          aria-label="Next page"
        >
          →
        </Link>
      ) : (
        <span className="satellite-pagination-arrow text-muted" aria-hidden>
          →
        </span>
      )}
    </nav>
  );
}
