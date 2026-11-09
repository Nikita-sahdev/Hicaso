import type { Card } from "./content";

// three cards (cards.md): .card--open, each a verb-and-object title, one line and a panel holding one
// kit fragment. span-4 from 1024 (system.css); the page's one --p-h is set in globals.css.
export default function ServiceFeatures({ title, cards }: { title: string; cards: Card[] }) {
  return (
    <section className="section" id="features" aria-labelledby="features-h">
      <div className="wrap">
        <div className="section-head">
          <h2 id="features-h">{title}</h2>
        </div>
        <div className="grid">
          {cards.map((c) => (
            <article key={c.title} className="card card--row card--open span-4 m-nolift">
              <h3>{c.title}</h3>
              <p>{c.line}</p>
              <div className="panel" dangerouslySetInnerHTML={{ __html: c.panel }} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
