import type { Technology } from "@/data/technologies";

// One rows line naming pages as plain links, wrapped without commas; nothing when the list is empty.
// Callers put it inside a <ul className="rows">.
export function LinkRow({ label, links }: { label: string; links: { href: string; name: string }[] }) {
  if (!links.length) return null;
  return (
    <li>
      <span className="rows__name">{label}</span>
      <p className="link-list">
        {links.map((l) => (
          <a key={l.href} className="link" href={l.href}>{l.name}</a>
        ))}
      </p>
    </li>
  );
}

// The technology pages as one rows line; nothing when the list is empty.
export default function TechLinks({ items }: { items: Technology[] }) {
  if (!items.length) return null;
  return (
    <ul className="rows">
      <LinkRow label="Technologies" links={items.map((t) => ({ href: `/technologies/${t.slug}`, name: t.name }))} />
    </ul>
  );
}
