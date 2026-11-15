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
  primaryLabel = "Start a project",
  id,
  meta,
}: {
  h1: string;
  lead: string;
  secondary: { label: string; href: string };
  fragment: string;
  label: string;
  piece?: string;
  contactHref?: string;
  primaryLabel?: string; // the page's own main action (careers: "Send your work"); the default is the site's
  meta?: string; // a small line under the lead (a blog post's date, author and category)
  id?: string; // a page whose text makes its own ids (a blog post's headings) names the hero apart from them
}) {
  return (
    <section className="hero hero--centred" id={id} data-enter aria-labelledby="hero-h">
      <div className="wrap">
        <div className="hero-text">
          <div className="hero__c">
            <h1 id="hero-h">{h1}</h1>
            <p className="hero__lead">{lead}</p>
            {meta ? <p className="t-small muted">{meta}</p> : null}
            <div className="btn-row">
              <a className="btn btn--primary" href={contactHref}>
                {primaryLabel}
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
