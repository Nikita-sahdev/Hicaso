import { Fragment } from "react";
import type { Technology } from "@/data/technologies";

// One rows line naming technology pages as plain links ("Flutter, React Native"); nothing when the list is empty.
export default function TechLinks({ items }: { items: Technology[] }) {
  if (!items.length) return null;
  return (
    <ul className="rows">
      <li>
        <span className="rows__name">Technologies</span>
        <p>
          {items.map((t, i) => (
            <Fragment key={t.slug}>
              {i ? ", " : ""}
              <a className="link" href={`/technologies/${t.slug}`}>{t.name}</a>
            </Fragment>
          ))}
        </p>
      </li>
    </ul>
  );
}
