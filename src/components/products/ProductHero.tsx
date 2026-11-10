import type { CSSProperties } from "react";
import styles from "../home/HeroArt.module.css";

// The dealt collage hero (kit layout/hero-collage.html) without a moving ground: the product's window on the lit
// ground, a small result card over its lower-left corner. motion.js runs the entrance from data-enter, so
// the h1 stays plain text for its word masks. `theme` paints the section in a product's --p-* ground.
export default function ProductHero({
  h1,
  lead,
  secondary,
  windowHtml,
  label,
  card,
  theme,
}: {
  h1: string;
  lead: string;
  secondary: { label: string; href: string; external?: boolean };
  windowHtml: string;
  label: string;
  card: { title: string; chip: string; lines: [string, string][] };
  theme?: CSSProperties;
}) {
  return (
    <section className={theme ? "hero hero--collage ground-base" : "hero hero--collage"} style={theme} data-enter aria-labelledby="hero-h">
      <div className="wrap">
        <div className="hero-text grid hero__grid">
          <div className="hero__text span-5">
            <h1 id="hero-h">{h1}</h1>
            <p className="hero__lead">{lead}</p>
            <div className="btn-row">
              <a className="btn btn--primary" href="/contact">
                Start a project
              </a>
              <a
                className="btn btn--secondary"
                href={secondary.href}
                {...(secondary.external ? { rel: "noopener noreferrer" } : {})}
              >
                {secondary.label}
              </a>
            </div>
          </div>

          <div className={`hero__art span-6 start-7 ${styles.art}`} role="img" data-ui-pause-host aria-label={label}>
            <div className="ly-piece ly-piece--main" aria-hidden="true" dangerouslySetInnerHTML={{ __html: windowHtml }} />
            <div className={`ly-piece ly-piece--note ${styles.card}`} aria-hidden="true" data-ly-steps="700">
              <div className={styles.cardHead}>
                <b>{card.title}</b>
                <span className={styles.chip} data-step data-step-at="4">
                  {card.chip}
                </span>
              </div>
              {card.lines.map(([b, rest], i) => (
                <div key={b} className={styles.line} data-step>
                  <i>{i === 1 ? "!" : "✓"}</i>
                  <span>
                    <b>{b}</b> {rest}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
