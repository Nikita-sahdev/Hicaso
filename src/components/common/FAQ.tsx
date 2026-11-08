// faq (sections-library.md): the page's split, the h2 and a grey line on the left, every answer open
// on the right (system.css .faq: no accordion). Under the line, a still timeline diagram (diagrams.md)
// of how a project starts, so the page's closing section is not text alone.
const START = {
  layout: "timeline",
  alt: "A project starts with the enquiry form, a reply by email, a first call and an agreed scope.",
  ground: "none",
  motion: { pulse: "none" },
  steps: [
    { label: "Enquiry form", sub: "A few lines", icon: "ui:send" },
    { label: "Reply by email", sub: "From the team", icon: "ui:mail" },
    { label: "First call", sub: "Goals and users", icon: "ui:messages-square" },
    { label: "Scope agreed", sub: "First release", icon: "ui:file-check" },
  ],
};
export default function FAQ({
  items,
  title = "Questions",
  lead,
}: {
  items: { q: string; a: string }[];
  title?: string;
  lead?: string;
}) {
  return (
    <section className="section" id="faq" aria-labelledby="faq-h">
      <div className="wrap">
        <div className="grid grid--top">
          <div className="span-5 section-head">
            <h2 id="faq-h">{title}</h2>
            {lead ? <p className="muted">{lead}</p> : null}
            <div className="panel faq-start" data-icon-base="/assets/icons/">
              <div className="dg" data-diagram="">
                <script type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(START) }} />
              </div>
            </div>
          </div>
          <div className="faq span-6 start-7">
            {items.map((item) => (
              <div key={item.q} className="faq__item">
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { FAQ };
