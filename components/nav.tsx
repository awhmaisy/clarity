import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/", label: "home" },
  { href: "/cache", label: "cache" },
  { href: "/satellite", label: "satellite" },
  { href: "/upload", label: "upload" },
] as const;

export function Nav({ active }: { active?: string }) {
  return (
    <nav aria-label="Main">
      <ul className="site-nav flex flex-wrap items-baseline gap-x-4 gap-y-2">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={
                active === href
                  ? "text-ink italic"
                  : "text-muted transition-colors hover:text-ink"
              }
              aria-current={active === href ? "page" : undefined}
            >
              {label}
            </Link>
          </li>
        ))}
        <li>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}
