// The dealt centred hero (kit layout/hero-centred.html): centred h1, grey line, two buttons, then the
// lit frame (the page's ground, no effect) holding one kit UI fragment, fading at the hero's foot.
// layout.js/motion.js run the entrance from data-enter, so the h1 stays plain text for its word masks.
export default function ServiceHero({
  h1,
  lead,
  secondary,
  fragment,
  label,
  piece = "",
  contactHref = "/contact",
}: {
  h1: string;
  lead: string;
  secondary: { label: string; href: string };
  fragment: string;
  label: string;
  piece?: string;
  contactHref?: string;
}) {
  return (
    <section className="hero hero--centred" data-enter aria-labelledby="hero-h">
      <div className="wrap">
        <div className="hero-text">
          <div className="hero__c">
            <h1 id="hero-h">{h1}</h1>
            <p className="hero__lead">{lead}</p>
            <div className="btn-row">
              <a className="btn btn--primary" href={contactHref}>
                Start a project
              </a>
              <a className="btn btn--secondary" href={secondary.href}>
                {secondary.label}
              </a>
            </div>
          </div>
          <div className="hero__window" role="img" aria-label={label}>
            <div className={`ly-piece ${piece}`} aria-hidden="true" dangerouslySetInnerHTML={{ __html: fragment }} />
          </div>
        </div>
      </div>
    </section>
  );
}
