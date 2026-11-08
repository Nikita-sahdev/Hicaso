import LogoMarquee from "../ui/LogoMarquee";
import { proof, showProof } from "@/data/proof";

// icon ids (icons.mjs) for the stack names in proof.ts; a name without a mark stays a plain chip
const ICONS: Record<string, string> = {
  Claude: "claude", "Next.js": "nextjs", Python: "python", Flutter: "flutter", Firebase: "firebase",
  "Node.js": "nodejs", Laravel: "laravel", MySQL: "mysql", React: "react", OpenAI: "openai",
};

// DEMO proof (src/data/proof.ts): rendered only while showProof allows it (development), never in a
// production build. One section on the kit's classes: the client strip, the figures, and each case
// with its client's quote.
export default function Proof() {
  if (!showProof(proof.demo)) return null;
  return (
    <section className="section" id="clients" style={{ "--hm": 2 } as React.CSSProperties} aria-labelledby="clients-h">
      <div className="wrap">
        <div className="section-head">
          <h2 id="clients-h">Projects for customers</h2>
        </div>
        <LogoMarquee
          label="client names"
          items={proof.clients.map((name) => ({ id: name, content: <span className="t-lead muted">{name}</span> }))}
        />
        <dl className="stats proof-stats">
          {proof.stats.map((s) => (
            <div key={s.label}>
              <dt className="t-small muted">{s.label}</dt>
              <dd className="t-stat">{s.value}</dd>
            </div>
          ))}
        </dl>
        <div className="grid proof-cases">
          {proof.caseStudies.map((c) => {
            const t = proof.testimonials.find((x) => x.company === c.client);
            return (
              <article key={c.client} className="card m-nolift span-4">
                <h3>{c.client}</h3>
                <p>{c.summary}</p>
                {t ? (
                  <figure className="quote">
                    <blockquote>{t.quote}</blockquote>
                    <figcaption>
                      {t.name}, {t.role}
                    </figcaption>
                  </figure>
                ) : null}
                <div className="ic-chip-row proof-stack">
                  {c.stack.map((t) => (
                    <span key={t} className="ic-chip">
                      {/* eslint-disable-next-line @next/next/no-img-element -- a kit icon file, as the fragments use */}
                      {ICONS[t] ? <img className="ic" data-icon={ICONS[t]} src={`/assets/icons/${ICONS[t]}.svg`} alt="" width="18" height="18" /> : null}
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
