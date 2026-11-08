// faq (sections-library.md): the page's split, the h2 and a grey line on the left, every answer open
// on the right (system.css .faq: no accordion).
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
