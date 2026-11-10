// The stack as a hub-tools diagram card (diagrams.md): Hicaso at the core, the six tools it ships with
// on the spokes, each with its real colour icon (icons.mjs scan writes them to /assets/icons). The spec
// sits in a JSON script inside the element (a label with an apostrophe would end a quoted attribute).
const SPEC = {
  layout: "hub",
  alt: "Hicaso builds with React, Next.js, Flutter, Laravel, Node.js and OpenAI.",
  center: { label: "Hicaso" },
  spokes: [
    { label: "React", icon: "react" },
    { label: "Next.js", icon: "nextjs" },
    { label: "Flutter", icon: "flutter" },
    { label: "Laravel", icon: "laravel" },
    { label: "Node.js", icon: "nodejs" },
    { label: "OpenAI", icon: "openai" },
  ],
};

export default function StackSection() {
  return (
    <section className="section" id="stack" aria-labelledby="stack-h">
      <div className="wrap">
        <div className="grid fill">
          <div className="span-5 stack-5">
            <h2 id="stack-h">Tools we ship with</h2>
            <p className="t-lead">
              React and Next.js on the web, Flutter for phones, Laravel and Node.js behind them, and OpenAI models for
              the AI work.
            </p>
            <p>Kotlin, Swift, Python, PostgreSQL, MySQL and Firebase where a project needs them.</p>
          </div>
          <div className="panel frame--fill span-6 start-7" data-icon-base="/assets/icons/">
            <div className="dg" data-diagram="">
              <script type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SPEC) }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
