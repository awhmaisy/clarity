import Link from "next/link";
import { Nav } from "./nav";

export function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="site-header flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
      <Link href="/" className="site-logo text-ink">
        mei higashi
      </Link>
      <Nav active={active} />
    </header>
  );
}
