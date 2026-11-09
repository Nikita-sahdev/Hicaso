// The service's tools as a hub diagram card (diagrams.md, hub-tools) with each tool's real colour icon
// (icons.mjs scan writes them to /assets/icons). Same section as the home page's stack; closes the page (R5).
// The spec sits in a JSON script inside the element (a label with an apostrophe would end a quoted attribute).
export default function StackIcons({
  title,
  lines,
  spokes,
  alt,
  center = "Hicaso",
}: {
  title: string;
  lines: string[];
  spokes: { label: string; icon: string }[];
  alt: string;
  center?: string;
}) {
  const spec = { layout: "hub", alt, center: { label: center }, spokes };
  return (
    <section className="section" id="stack" aria-labelledby="stack-h">
      <div className="wrap">
        <div className="grid fill">
          <div className="span-5 stack-5">
            <h2 id="stack-h">{title}</h2>
            <p className="t-lead">{lines[0]}</p>
            {lines.slice(1).map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
          <div className="panel frame--fill span-6 start-7" data-icon-base="/assets/icons/">
            <div className="dg" data-diagram="">
              <script type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(spec) }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
