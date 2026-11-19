import type { Technology } from "@/data/technologies";

// One rows line naming technology pages as plain links, wrapped without commas; nothing when the list is empty.
export default function TechLinks({ items }: { items: Technology[] }) {
  if (!items.length) return null;
  return (
    <ul className="rows">
      <li>
        <span className="rows__name">Technologies</span>
        <p className="link-list">
          {items.map((t) => (
            <a key={t.slug} className="link" href={`/technologies/${t.slug}`}>{t.name}</a>
          ))}
        </p>
      </li>
    </ul>
  );
}
