import type { CSSProperties } from "react";
import type { Card } from "./content";

// three cards (cards.md): .card--open, each a verb-and-object title, one line and a panel holding one
// kit fragment. span-4 from 1024 (system.css); the page's one --p-h is set in globals.css.
// `span` is the card width (span-6 for four cards, two a row); `theme` puts the section on a product's --p-* ground.
export default function ServiceFeatures({
  title,
  cards,
  span = "span-4",
  theme,
}: {
  title: string;
  cards: Card[];
  span?: string;
  theme?: CSSProperties;
}) {
  const card = (c: Card) => (
    <article key={c.title} className={`card card--row card--open ${span} m-nolift`}>
      <h3>{c.title}</h3>
      <p>{c.line}</p>
      <div className="panel" dangerouslySetInnerHTML={{ __html: c.panel }} />
    </article>
  );
  const head = (
    <div className="section-head">
      <h2 id="features-h">{title}</h2>
    </div>
  );
  // four cards are a 2x2 on two screens (.g2, as the home's services): the h2 and two cards, then two more
  const two = cards.length === 4;
  return (
    <section className={`section${two ? " g2" : ""}${theme ? " ground-base" : ""}`} style={theme} id="features" aria-labelledby="features-h">
      <div className="wrap">
        {two ? (
          <>
            <div className="group">
              {head}
              <div className="grid">{cards.slice(0, 2).map(card)}</div>
            </div>
            <div className="grid">{cards.slice(2).map(card)}</div>
          </>
        ) : (
          <>
            {head}
            <div className="grid">{cards.map(card)}</div>
          </>
        )}
      </div>
    </section>
  );
}
