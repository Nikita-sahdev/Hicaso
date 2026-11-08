import { services } from "@/data/services";

// features-2x2 (sections-library.md) as two screens (.g2): four .card--open tiles, each with one kit
// fragment (assets/ui/<name>/fragment.html) pasted and rewritten to Hicaso's and its products' own
// names. The first tile's chat is the group's one loop; system.js holds the others still.
const ICON = (id: string) => `<img data-icon="${id}" src="/assets/icons/${id}.svg" alt="">`;
const TICK = `<svg viewBox="0 0 16 16"><path d="m4.5 8.2 2.3 2.3 4.7-5"/></svg>`;
const STEP_TICK = `<span class="ui-pipe__ico"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 8.2 2.3 2.3 4.7-5"/></svg></span>`;

const chat = `<div class="stage stage--fade-b"><div class="at-rise fit to-edge" style="--fit-max:400px;--ax:max(24px, 50% - 200px);--ay:56px;--ay-sm:56px" data-ui-loop>
<div class="ui ui-panel ui-chat" data-ui="chat">
  <div class="ui-head"><span class="ui-agent" aria-hidden="true"></span><div class="ui-title">AppKavo help</div><span class="ui-chat__online">Online</span><span class="ui-spacer"></span></div>
  <div class="ui-chat__body">
    <div class="ui-chat__day">Today, 10:42</div>
    <div class="ui-msg ui-msg--me" data-chat-q><span class="ui-msg__text">Do you need our source code?</span></div>
    <div class="ui-msg ui-msg--bot" data-chat-a>
      <span class="ui-agent ui-msg__av" aria-hidden="true"></span>
      <span class="ui-msg__col">
        <span class="ui-chat__typing" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="ui-chat__answer">No. Upload the <b>APK, AAB or IPA</b> and the audit runs on the compiled build.</span>
        <span class="ui-chat__srcs"><span class="ui-chat__src"><svg class="ui-icon" viewBox="0 0 16 16"><path d="M4 2.5h5l3 3v8H4z"/><path d="M9 2.5v3h3"/></svg>Docs: Binary audit</span></span>
      </span>
    </div>
  </div>
  <div class="ui-chat__input"><span class="ui-chat__ph">Write a message</span><span class="ui-chat__send" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 13V3.5M3.8 7.5 8 3.3l4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>
</div></div></div>`;

const check = (label: string, done: boolean) =>
  `<li class="ui-check${done ? " is-done" : ""}"><span class="ui-check__box">${TICK}</span><span class="ui-check__label">${label}</span></li>`;
const agent = `<div class="stage stage--fade-b"><div class="at-rise fit" style="--fit-max:340px;--ax:32px;--ay:calc(100% - 180px);--ay-sm:calc(100% - 180px)">
<div class="ui ui-panel ui-checks" data-ui="checklist">
  <div class="ui-checks__head"><div class="ui-title">Agent run: overdue invoices</div><span class="ui-spacer"></span><div class="ui-meta" data-checks-count>3 of 5</div></div>
  <div class="ui-checks__bar"><i data-checks-bar style="--k:0.6"></i></div>
  <ul class="ui-checks__list">
    ${check("Found 4 overdue invoices", true)}
    ${check("Matched the bank transfers received", true)}
    ${check("Drafted 4 reminder emails", true)}
    ${check("Waiting for approval from finance", false)}
    ${check("Send the approved reminders", false)}
  </ul>
</div></div></div>`;

const toggle = (label: string, sub: string, on: boolean) =>
  `<li class="ui-tg"><span class="ui-tg__text"><span class="ui-tg__label">${label}</span><span class="ui-tg__sub">${sub}</span></span><button class="ui-switch${on ? " is-on" : ""}" type="button" role="switch" tabindex="-1" aria-checked="${on}" aria-label="${label}"><i></i></button></li>`;
// a phone (sections-library.md: a .device built in page CSS, 8px bezel, radius 32) holding the app's
// settings screen, cut by the panel's foot
const phone = `<div class="stage stage--fade-b"><div class="at-right" style="--ax:56px;--ay:40px;--ay-sm:24px">
<div class="ui ui-toggles device" data-ui="toggles" role="img" aria-label="An app's settings screen on a phone">
    <div class="device__status" aria-hidden="true"><span>9:41</span><span class="device__notch"></span><span>5G</span></div>
    <div class="ui-head"><svg class="ui-icon ui-toggles__ico" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="2.2"/><path d="M8 1.8v2M8 12.2v2M1.8 8h2M12.2 8h2M3.6 3.6 5 5M11 11l1.4 1.4M3.6 12.4 5 11M11 5l1.4-1.4"/></svg><div class="ui-title">Settings</div><span class="ui-spacer"></span><div class="ui-meta" data-tg-count>3 of 4 on</div></div>
    <ul class="ui-toggles__list">
      ${toggle("Sign in with Face ID", "Or a fingerprint on Android", true)}
      ${toggle("Push notifications", "Order and chat updates", true)}
      ${toggle("Offline mode", "Works without a signal", false)}
      ${toggle("Dark theme", "Follows the system", true)}
    </ul>
</div></div></div>`;

const step = (name: string, icon: string, nm: string, cmd: string, time: string) =>
  `<li class="ui-pipe__step is-done" data-step="${name}">${STEP_TICK}<span class="ui-pipe__name"><span class="ui-pipe__tool" aria-hidden="true">${ICON(icon)}</span><span class="ui-pipe__nm">${nm}</span></span><code class="ui-pipe__cmd">${cmd}</code><span class="ui-pipe__time" data-time>${time}</span><span class="ui-pipe__bar"><i></i></span></li>`;
const deploy = `<div class="stage"><div class="at-rise fit" style="--fit-max:420px;--ax:max(24px, 50% - 210px);--ay:36px;--ay-sm:24px">
<div class="ui ui-panel ui-pipe" data-ui="pipeline-board">
  <div class="ui-pipe__head">
    <svg class="ui-icon ui-pipe__branch" viewBox="0 0 16 16" aria-hidden="true"><circle cx="4.5" cy="3.5" r="1.5"/><circle cx="4.5" cy="12.5" r="1.5"/><circle cx="11.5" cy="5" r="1.5"/><path d="M4.5 5v6M11.5 6.5c0 2.6-2.2 3.6-5.6 4.6"/></svg>
    <span class="ui-pipe__repo">hicaso/web</span><i class="ui-pipe__slash">/</i><code class="ui-pipe__ref">main</code>
    <span class="ui-pipe__run">#212</span>
    <span class="ui-spacer"></span>
    <span class="ui-pipe__total"><svg class="ui-icon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8.5" r="5.5"/><path d="M8 5.5v3l2 1.25M6.5 1.75h3"/></svg><span data-pipe-total>2m 41s</span></span>
    <span class="ui-chip ui-chip--ink ui-pipe__chip" data-pipe-chip data-done="Passed">Passed</span>
  </div>
  <div class="ui-pipe__commit">
    <span class="ui-agent" aria-hidden="true"></span>
    <span class="ui-pipe__msg">Home page sections</span>
    <code class="ui-pipe__sha">6e7670f</code>
    <button class="ui-btn ui-btn--ghost ui-btn--sm ui-pipe__btn" type="button" tabindex="-1" data-pipe-btn data-done="Re-run">Re-run</button>
  </div>
  <ol class="ui-pipe__steps">
    ${step("checkout", "git", "Checkout", "git fetch --depth 1", "3s")}
    ${step("install", "npm", "Install", "npm ci", "41s")}
    ${step("test", "nodejs", "Test", "npm test", "18s")}
    ${step("build", "nextjs", "Build", "next build", "1m 12s")}
    ${step("image", "docker", "Image", "docker build .", "27s")}
  </ol>
</div></div></div>`;

const CARDS: Record<string, { title: string; line: string; panel: string }> = {
  "generative-ai": {
    title: "Adds generative AI to your product",
    line: "Answers, summaries and drafts from your own documents and data, with the source beside each answer.",
    panel: chat,
  },
  "agentic-ai": {
    title: "Builds AI agents that finish the task",
    line: "Agents call your APIs and tools step by step, and a person approves the actions you choose.",
    panel: agent,
  },
  "mobile-app-development": {
    title: "Builds Android and iOS apps",
    line: "Native in Kotlin and Swift, or one Flutter or React Native codebase, released to both stores.",
    panel: phone,
  },
  "web-development": {
    title: "Builds web apps and backends",
    line: "SaaS products, APIs and online stores in React, Next.js and Laravel, plus upgrades of older PHP apps.",
    panel: deploy,
  },
};

const Card = ({ slug }: { slug: string }) => {
  const c = CARDS[slug];
  return (
    <article className="card card--row card--open span-6">
      <h3>
        <a href={`/services/${slug}`}>{c.title}</a>
      </h3>
      <p>{c.line}</p>
      <div className="panel" dangerouslySetInnerHTML={{ __html: c.panel }} />
    </article>
  );
};

export default function ServicesGrid() {
  const [a, b, c, d] = services.map((s) => s.slug);
  return (
    <section className="section g2 ground-surface" id="services" aria-labelledby="services-h">
      <div className="wrap">
        <div className="group">
          <div className="section-head">
            <h2 id="services-h">
              Software we build for clients. <span className="muted">The same team ships our own products.</span>
            </h2>
          </div>
          <div className="grid">
            <Card slug={a} />
            <Card slug={b} />
          </div>
        </div>
        <div className="grid">
          <Card slug={c} />
          <Card slug={d} />
        </div>
      </div>
    </section>
  );
}
