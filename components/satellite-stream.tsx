import type { SatelliteItem } from "@/lib/satellite";

export function SatelliteStream({
  items,
  emptyMessage = "No recent activity.",
}: {
  items: SatelliteItem[];
  emptyMessage?: string;
}) {
  if (items.length === 0) {
    return <p className="text-muted prose">{emptyMessage}</p>;
  }

  return (
    <ul className="prose social-list">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.url}
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
}
