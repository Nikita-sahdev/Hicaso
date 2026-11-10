// steps with the dealt pinned-chapters moment, mounted as SK/assets/moments/_demo/in-page-service.html
// does: the section is the host, two screens tall; moment.js holds it while the steps open one at a time
// and moves each step's figure into the shared frame. Each figure is a drawn kit fragment (static
// markup, no data-ui) on the lit ground (.mo-pc__visual--lit).
const ICON = (id: string) => `<img data-icon="${id}" src="/assets/icons/${id}.svg" alt="">`;
const CHECK = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 8.2 2.3 2.3 4.7-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const TICK = `<svg class="ui-term__tick" viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.4 2.8 2.8 6.2-6.4"/></svg>`;

const scope = `<div class="ui ui-doc">
  <article class="ui-doc__page">
    <div class="ui-doc__label">Scope, first release</div>
    <div class="ui-doc__title">What ships in version 1</div>
    <div class="ui-doc__text">Android and iOS from one Flutter codebase, with sign-in, profile and payments.</div>
    <div class="ui-doc__text">Payments by card in the app. <mark class="ui-doc__mark is-on">Offline mode waits for version 2.</mark></div>
    <div class="ui-doc__text">An admin page on the web for the support team, built in Next.js.</div>
  </article>
  <aside class="ui-doc__note ui-panel is-on">
    <div class="ui-doc__kind"><span class="ui-doc__dot"></span><span>Agreed</span></div>
    <div class="ui-doc__msg">Moved to version 2 so payments ship first.</div>
    <div class="ui-doc__where">Kick-off call</div>
  </aside>
</div>`;

const file = (name: string, kind: string, icon: string) =>
  `<li class="ui-file is-done"><span class="ui-file__icon">${icon}</span><span class="ui-file__name">${name}</span><span class="ui-file__kind">${kind}</span><span class="ui-file__bar"><i></i></span><span class="ui-file__check">${CHECK}</span></li>`;
const PDF = `<svg class="ui-file__glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.25 2.75h8L18.75 7.25v14H6.25z"/><path d="M14 2.75v4.75h4.75M9 12.5h6.5M9 15.5h6.5M9 18.5h4"/></svg>`;
const designs = `<div class="ui ui-files">
  <div class="ui-files__status"><span class="ui-dot"></span><span>6 files agreed</span></div>
  <ul class="ui-files__grid">
    ${file("Sign-in screens", "Figma", ICON("figma"))}
    ${file("Home and profile", "Figma", ICON("figma"))}
    ${file("Payments flow", "Figma", ICON("figma"))}
    ${file("Design system", "Figma", ICON("figma"))}
    ${file("Copy for every screen", "Google Docs", ICON("google-docs"))}
    ${file("Scope v1.pdf", "PDF", PDF)}
  </ul>
</div>`;

const test = (path: string, n: string, t: string) =>
  `<div class="ui-term__ln ui-term__log">${TICK}<span class="ui-term__path">${path}</span><span class="ui-term__n">${n}</span><span class="ui-term__t">${t}</span></div>`;
const build = `<div class="ui ui-panel ui-term">
  <div class="ui-term__head"><span class="ui-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="ui-term__title">mobile/app</span><span class="ui-meta">zsh</span><span class="ui-spacer"></span><span class="ui-chip ui-chip--plain ui-term__branch">demo-week-3</span></div>
  <div class="ui-term__screen"><div class="ui-term__track">
    <div class="ui-term__ln ui-term__cmd"><span class="ui-term__cwd">~/<span class="ui-term__up">mobile/</span>app</span><span class="ui-term__sig">$</span><span class="ui-term__typed">flutter test</span></div>
    <div class="ui-term__ln ui-term__meter"><span class="ui-term__bar" style="--p:1"><i></i></span><span class="ui-term__count">4 of 4 files</span></div>
    ${test("test/auth_test.dart", "18 tests", "1.4s")}
    ${test("test/profile_test.dart", "12 tests", "0.9s")}
    ${test("test/payments_test.dart", "26 tests", "2.1s")}
    ${test("test/settings_test.dart", "9 tests", "0.6s")}
    <div class="ui-term__ln ui-term__gap" aria-hidden="true"></div>
    <div class="ui-term__ln ui-term__sum"><span class="ui-term__key">Test files</span><span class="ui-term__val">4 passed</span><span class="ui-term__dim">(4)</span></div>
    <div class="ui-term__ln ui-term__sum"><span class="ui-term__key">Tests</span><span class="ui-term__val">65 passed</span><span class="ui-term__dim">(65)</span></div>
    <div class="ui-term__ln ui-term__done"><span class="ui-term__ok"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 8.3 2.4 2.4 4.6-5"/></svg></span><b>Done</b><span class="ui-term__dim">in 5.0s</span></div>
  </div></div>
</div>`;

const note = (icon: string, title: string, time: string, body: string) =>
  `<li class="ui-note"><span class="ui-note__ico">${ICON(icon)}</span><span class="ui-note__text"><span class="ui-note__title">${title}<time>${time}</time></span><span class="ui-note__body">${body}</span></span></li>`;
const launch = `<div class="ui ui-notify"><ul class="ui-notify__list">
  ${note("google-play", "Version 1.0 is live on Google Play", "now", "Rolled out to every user")}
  ${note("app-store", "App Store review passed", "2h", "Version 1.0 is ready for sale")}
  ${note("apple", "Version 1.0.1 is in TestFlight", "1d", "Fixes a crash on the sign-in screen")}
</ul></div>`;

const STEPS = [
  {
    title: "Pick the features to build first",
    text: "We learn your goals, users and limits, and write down the first release with you.",
    label: "A scope document for the first release, with offline mode moved to version 2",
    visual: scope,
  },
  {
    title: "Design the product with you",
    text: "Flows and screens are agreed before any code, while a change still costs little.",
    label: "Six design files agreed, four of them screens in Figma",
    visual: designs,
  },
  {
    title: "Build the software, with a weekly demo",
    text: "We build in short cycles, and you try working software in a demo each week.",
    label: "A test run in a terminal: 65 tests passed before the week's demo",
    visual: build,
  },
  {
    title: "Launch, then support and improve",
    text: "We release to production or the app stores, then fix and improve. The code and IP are yours.",
    label: "Release notices: live on Google Play, App Store review passed, a fix in TestFlight",
    visual: launch,
  },
];

export default function HowWeWork() {
  return (
    <section className="section" id="how" style={{ "--h": 2 } as React.CSSProperties} data-moment="pinned-chapters" aria-labelledby="how-h">
      <div className="wrap mo-pc__grid">
        <div className="mo-pc__text">
          <h2 id="how-h">How a project runs, in four steps</h2>
          <ol className="mo-pc__steps">
            {STEPS.map((s) => (
              <li key={s.title} className="mo-pc__step">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <figure
                  className="mo-pc__visual mo-pc__visual--lit"
                  role="img"
                  aria-label={s.label}
                  dangerouslySetInnerHTML={{ __html: s.visual }}
                />
              </li>
            ))}
          </ol>
        </div>
        <div className="mo-pc__visuals frame"></div>
      </div>
    </section>
  );
}
