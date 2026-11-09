// Kit UI fragments (SK/assets/ui/<name>/fragment.html) rewritten to each service's subject. Hero pieces
// sit whole in the centred hero's window; card pieces sit in a .stage inside a card panel. Marks are real
// icons from /assets/icons (icons.mjs scan), as <img data-icon>.
const ICON = (id: string) => `<img data-icon="${id}" src="/assets/icons/${id}.svg" alt="">`;
const TICK = `<svg viewBox="0 0 16 16"><path d="m4.5 8.2 2.3 2.3 4.7-5"/></svg>`;
const DOC = `<svg class="ui-icon" viewBox="0 0 16 16"><path d="M4 2.5h5l3 3v8H4z"/><path d="M9 2.5v3h3"/></svg>`;
const STEP_TICK = `<span class="ui-pipe__ico"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 8.2 2.3 2.3 4.7-5"/></svg></span>`;

export const chat = (o: { title: string; q: string; a: string; srcs: string[] }) => `<div class="ui ui-panel ui-chat" data-ui="chat">
  <div class="ui-head"><span class="ui-agent" aria-hidden="true"></span><div class="ui-title">${o.title}</div><span class="ui-chat__online">Online</span><span class="ui-spacer"></span></div>
  <div class="ui-chat__body">
    <div class="ui-msg ui-msg--me" data-chat-q><span class="ui-msg__text">${o.q}</span></div>
    <div class="ui-msg ui-msg--bot" data-chat-a>
      <span class="ui-agent ui-msg__av" aria-hidden="true"></span>
      <span class="ui-msg__col">
        <span class="ui-chat__typing" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="ui-chat__answer">${o.a}</span>
        <span class="ui-chat__srcs">${o.srcs.map((s) => `<span class="ui-chat__src">${DOC}${s}</span>`).join("")}</span>
      </span>
    </div>
  </div>
  <div class="ui-chat__input"><span class="ui-chat__ph">Write a message</span><span class="ui-chat__send" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 13V3.5M3.8 7.5 8 3.3l4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>
</div>`;

export const checklist = (title: string, items: [string, boolean][]) => {
  const done = items.filter(([, d]) => d).length;
  return `<div class="ui ui-panel ui-checks" data-ui="checklist">
  <div class="ui-checks__head"><div class="ui-title">${title}</div><span class="ui-spacer"></span><div class="ui-meta" data-checks-count>${done} of ${items.length}</div></div>
  <div class="ui-checks__bar"><i data-checks-bar style="--k:${(done / items.length).toFixed(2)}"></i></div>
  <ul class="ui-checks__list">
    ${items.map(([l, d]) => `<li class="ui-check${d ? " is-done" : ""}"><span class="ui-check__box">${TICK}</span><span class="ui-check__label">${l}</span></li>`).join("\n    ")}
  </ul>
</div>`;
};

const toggle = (label: string, sub: string, on: boolean) =>
  `<li class="ui-tg"><span class="ui-tg__text"><span class="ui-tg__label">${label}</span><span class="ui-tg__sub">${sub}</span></span><button class="ui-switch${on ? " is-on" : ""}" type="button" role="switch" tabindex="-1" aria-checked="${on}" aria-label="${label}"><i></i></button></li>`;
const GEAR = `<svg class="ui-icon ui-toggles__ico" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="2.2"/><path d="M8 1.8v2M8 12.2v2M1.8 8h2M12.2 8h2M3.6 3.6 5 5M11 11l1.4 1.4M3.6 12.4 5 11M11 5l1.4-1.4"/></svg>`;
export const toggles = (title: string, rows: [string, string, boolean][], extra = "") => {
  const on = rows.filter((r) => r[2]).length;
  return `<div class="ui ui-toggles${extra}" data-ui="toggles">
    ${extra ? `<div class="device__status" aria-hidden="true"><span>9:41</span><span class="device__notch"></span><span>5G</span></div>` : ""}
    <div class="ui-head">${GEAR}<div class="ui-title">${title}</div><span class="ui-spacer"></span><div class="ui-meta" data-tg-count>${on} of ${rows.length} on</div></div>
    <ul class="ui-toggles__list">
      ${rows.map(([l, s, o]) => toggle(l, s, o)).join("\n      ")}
    </ul>
</div>`;
};

// Rows with a real app icon are static markup (no data-ui): the kit's notify script, given <img> marks, never settles.
export const notify = (rows: { ico: string; title: string; time: string; body: string }[]) =>
  `<div class="ui ui-notify"${rows.every((r) => r.ico === "tick") ? ' data-ui="notify"' : ""}><ul class="ui-notify__list" data-notify-list>
  ${rows.map((r) => `<li class="ui-note"><span class="ui-note__ico">${r.ico === "tick" ? TICK.replace("<svg ", '<svg class="ui-icon" ') : ICON(r.ico)}</span><span class="ui-note__text"><span class="ui-note__title">${r.title}<time>${r.time}</time></span><span class="ui-note__body">${r.body}</span></span></li>`).join("\n  ")}
</ul></div>`;

export const terminal = (o: { title: string; branch: string; cmd: string; files: [string, string, string][]; passed: string; total: string; time: string }) => {
  const t = (p: string, n: string, s: string) =>
    `<div class="ui-term__ln ui-term__log" data-term-out data-term-step><svg class="ui-term__tick" viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.4 2.8 2.8 6.2-6.4"/></svg><span class="ui-term__path">${p}</span><span class="ui-term__n">${n}</span><span class="ui-term__t">${s}</span></div>`;
  return `<div class="ui ui-panel ui-term" data-ui="terminal-run">
  <div class="ui-term__head"><span class="ui-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="ui-term__title">${o.title}</span><span class="ui-meta">zsh</span><span class="ui-spacer"></span><span class="ui-chip ui-chip--plain ui-term__branch">${o.branch}</span></div>
  <div class="ui-term__screen" data-term-screen><div class="ui-term__track" data-term-track>
    <div class="ui-term__ln ui-term__cmd"><span class="ui-term__cwd">~/<span class="ui-term__up">${o.title.split("/")[0]}/</span>${o.title.split("/")[1]}</span><span class="ui-term__sig">$</span><span class="ui-term__typed" data-term-cmd>${o.cmd}</span></div>
    <div class="ui-term__ln ui-term__meter" data-term-out data-term-meter><span class="ui-term__bar" style="--p:1"><i></i></span><span class="ui-term__count" data-term-count>${o.files.length} of ${o.files.length} files</span></div>
    ${o.files.map((f) => t(...f)).join("\n    ")}
    <div class="ui-term__ln ui-term__gap" data-term-out aria-hidden="true"></div>
    <div class="ui-term__ln ui-term__sum" data-term-out><span class="ui-term__key">Tests</span><span class="ui-term__val">${o.passed} passed</span><span class="ui-term__dim">(${o.total})</span></div>
    <div class="ui-term__ln ui-term__done" data-term-out data-term-done><span class="ui-term__ok"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 8.3 2.4 2.4 4.6-5"/></svg></span><b>Done</b><span class="ui-term__dim">in ${o.time}</span></div>
    <div class="ui-term__ln ui-term__cmd" data-term-next><span class="ui-term__cwd">~/<span class="ui-term__up">${o.title.split("/")[0]}/</span>${o.title.split("/")[1]}</span><span class="ui-term__sig">$</span><span class="ui-term__typed"></span><i class="ui-term__caret" aria-hidden="true"></i></div>
  </div></div>
</div>`;
};

const step = (name: string, icon: string, nm: string, cmd: string, time: string) =>
  `<li class="ui-pipe__step is-done" data-step="${name}">${STEP_TICK}<span class="ui-pipe__name"><span class="ui-pipe__tool" aria-hidden="true">${ICON(icon)}</span><span class="ui-pipe__nm">${nm}</span></span><code class="ui-pipe__cmd">${cmd}</code><span class="ui-pipe__time" data-time>${time}</span><span class="ui-pipe__bar"><i></i></span></li>`;
// a deploy log: the run's steps, all done, so the picture rests on "Passed"
export const deploy = `<div class="ui ui-panel ui-pipe" data-ui="pipeline-board">
  <div class="ui-pipe__head">
    <svg class="ui-icon ui-pipe__branch" viewBox="0 0 16 16" aria-hidden="true"><circle cx="4.5" cy="3.5" r="1.5"/><circle cx="4.5" cy="12.5" r="1.5"/><circle cx="11.5" cy="5" r="1.5"/><path d="M4.5 5v6M11.5 6.5c0 2.6-2.2 3.6-5.6 4.6"/></svg>
    <span class="ui-pipe__repo">store/web</span><i class="ui-pipe__slash">/</i><code class="ui-pipe__ref">main</code>
    <span class="ui-pipe__run">#48</span>
    <span class="ui-spacer"></span>
    <span class="ui-pipe__total"><svg class="ui-icon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8.5" r="5.5"/><path d="M8 5.5v3l2 1.25M6.5 1.75h3"/></svg><span data-pipe-total>2m 19s</span></span>
    <span class="ui-chip ui-chip--ink ui-pipe__chip" data-pipe-chip data-done="Deployed">Deployed</span>
  </div>
  <div class="ui-pipe__commit">
    <span class="ui-agent" aria-hidden="true"></span>
    <span class="ui-pipe__msg">Checkout page and order emails</span>
    <code class="ui-pipe__sha">a41c9e2</code>
    <button class="ui-btn ui-btn--ghost ui-btn--sm ui-pipe__btn" type="button" tabindex="-1" data-pipe-btn data-done="Re-run">Re-run</button>
  </div>
  <ol class="ui-pipe__steps">
    ${step("checkout", "git", "Checkout", "git fetch --depth 1", "3s")}
    ${step("install", "npm", "Install", "npm ci", "36s")}
    ${step("test", "nodejs", "Test", "npm test", "22s")}
    ${step("build", "nextjs", "Build", "next build", "58s")}
    ${step("image", "docker", "Deploy", "docker push", "20s")}
  </ol>
</div>`;
