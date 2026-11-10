// Headless-Chrome smoke test, no dependencies. Run: npm run smoke (dev server on :3000).
// Extend ROUTES (string, or { path, status } for a non-200 route); add per-route cases in checkRoute.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SERVICE_SLUGS = ["generative-ai", "agentic-ai", "mobile-app-development", "web-development"];
const PRODUCT_SLUGS = ["appkavo", "billminute"];
const ROUTES = ["/", "/services", ...SERVICE_SLUGS.map((s) => `/services/${s}`), "/products", ...PRODUCT_SLUGS.map((s) => `/products/${s}`), "/about", "/careers", "/contact", "/privacy", "/terms", { path: "/this-page-does-not-exist", status: 404 }];
const BASE = process.env.SMOKE_BASE ?? "http://localhost:3000";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];
const FONT_READY = `document.fonts.ready.then(() => [...document.fonts].some(f => f.family.replace(/["']/g, "") === "Instrument Sans" && f.status === "loaded"))`;

// Every CDP call and every page load has a timeout that names the route and step; the whole run has one too.
const STEP_MS = 30000;
const RUN_MS = Number(process.env.SMOKE_RUN_MS) || 540000;
let where = "start";
const port = 9300 + Math.floor(Math.random() * 500);
const dir = mkdtempSync(join(tmpdir(), "smoke-"));
const chrome = spawn(CHROME, [
  "--headless=new", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
  `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`, "--no-first-run", "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const failures = [];
const fail = (route, vp, msg) => failures.push(`${route} [${vp}] ${msg}`);

async function connect() {
  let target;
  for (let i = 0; i < 50 && !target; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      target = list.find((t) => t.type === "page");
    } catch {}
    if (!target) await sleep(200);
  }
  if (!target) throw new Error("Chrome did not start");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
    else listeners.forEach((l) => l(m));
  };
  const send = (method, params = {}) => new Promise((res, rej) => {
    const i = ++id;
    const t = setTimeout(() => { pending.delete(i); rej(new Error(`${method}: no answer in ${STEP_MS / 1000}s at ${where}`)); }, STEP_MS);
    pending.set(i, (m) => { clearTimeout(t); if (m.error) rej(new Error(`${method}: ${m.error.message}`)); else res(m.result); });
    ws.send(JSON.stringify({ id: i, method, params }));
  });
  const evaluate = async (expression) => {
    const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + " " + (r.exceptionDetails.exception?.description ?? ""));
    return r.result.value;
  };
  return { send, evaluate, on: (l) => listeners.push(l), ws };
}

async function load(c, url) {
  let status = 0;
  const off = (m) => {
    if (m.method === "Network.responseReceived" && m.params.type === "Document" && !status) status = m.params.response.status;
  };
  c.on(off);
  const loaded = new Promise((r, j) => {
    const t = setTimeout(() => j(new Error(`load of ${url} did not fire in ${STEP_MS / 1000}s`)), STEP_MS);
    c.on((m) => { if (m.method === "Page.loadEventFired") { clearTimeout(t); r(); } });
  });
  loaded.catch(() => {});
  where = url;
  await c.send("Page.navigate", { url });
  await loaded;
  await sleep(1200);
  return status;
}

async function checkRoute(c, route, vp, errors) {
  const { path, status = 200 } = typeof route === "string" ? { path: route } : route;
  errors.length = 0;
  await c.send("Emulation.setScriptExecutionDisabled", { value: false });
  await c.send("Emulation.setDeviceMetricsOverride", { width: vp.width, height: vp.height, deviceScaleFactor: 1, mobile: vp.mobile });
  if (process.env.SMOKE_VERBOSE) console.error("route", path, vp.name);
  const got = await load(c, BASE + path);
  const t = `${path}`;
  if (got !== status) fail(t, vp.name, `HTTP ${got}, expected ${status}`);
  const type = await c.evaluate(`document.documentElement.dataset.type`);
  if (type !== "software") fail(t, vp.name, `data-type is ${type}`);
  const bg = await c.evaluate(`getComputedStyle(document.body).backgroundColor`);
  if (bg !== "rgb(255, 255, 255)") fail(t, vp.name, `body background ${bg}`);
  if (!(await c.evaluate(FONT_READY))) fail(t, vp.name, "Instrument Sans not loaded");
  const h1 = await c.evaluate(`document.querySelectorAll("h1").length`);
  if (h1 !== 1) fail(t, vp.name, `${h1} h1 elements`);
  const overflow = await c.evaluate(`document.documentElement.scrollWidth - innerWidth`);
  if (overflow > 0) fail(t, vp.name, `horizontal overflow ${overflow}px`);
  // the browser itself logs "Failed to load resource ... status of 404" for an expected 404 document
  errors.filter((e) => !(status !== 200 && e.includes(`status of ${status}`) && e.includes(path))).forEach((e) => fail(t, vp.name, `console error: ${e}`));
}

async function checkNoJs(c, route) {
  const { path } = typeof route === "string" ? { path: route } : route;
  if (process.env.SMOKE_VERBOSE) console.error("nojs", path);
  await c.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await c.send("Emulation.setScriptExecutionDisabled", { value: true });
  await load(c, BASE + path);
  await c.send("Emulation.setScriptExecutionDisabled", { value: false });
  // scripts are off during load; evaluate re-enabled only to read the static result
  const r = await c.evaluate(`(() => { const h = document.querySelector("h1"); if (!h) return null; const b = h.getBoundingClientRect(); return { h: b.height, o: getComputedStyle(h).opacity, enter: document.documentElement.className }; })()`);
  if (!r || r.h <= 0 || r.o !== "1") fail(path, "no-js", `h1 hidden: ${JSON.stringify(r)}`);
}

async function setViewport(c, w, h, mobile) {
  await c.send("Emulation.setScriptExecutionDisabled", { value: false });
  await c.send("Emulation.setDeviceMetricsOverride", { width: w, height: h, deviceScaleFactor: 1, mobile });
}

// Nav, closing footer and click-navigation (Review Focus 2). The mega menu opens on hover/focus (system.js).
async function checkNav(c) {
  await setViewport(c, 1440, 900, false);
  await load(c, BASE + "/");
  const svc = `[...document.querySelectorAll(".nav__item")].find(i => i.querySelector(":scope > .nav__link")?.textContent.trim() === "Services")`;
  const menuState = `(() => { const i = ${svc}; const m = i?.querySelector(":scope > .nav__menu"); if (!m) return null; const b = m.getBoundingClientRect(); const cs = getComputedStyle(m); return { visible: cs.visibility === "visible" && +cs.opacity > 0.5 && b.height > 0, vis: cs.visibility, op: cs.opacity }; })()`;
  const pos = await c.evaluate(`(() => { const a = ${svc}?.querySelector(":scope > .nav__link"); if (!a) return null; const b = a.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; })()`);
  const before = await c.evaluate(menuState);
  if (!pos || !before) fail("/", "nav", "no Services .nav__item with a .nav__menu");
  else {
    if (before.visible) fail("/", "nav", `Services menu already visible before hover: ${JSON.stringify(before)}`);
    await c.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: pos.x, y: pos.y });
    await sleep(1000);
    const after = await c.evaluate(menuState);
    if (!after.visible) fail("/", "nav", `Services menu not visible on hover: ${JSON.stringify(after)}`);
    await c.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: 5, y: 700 });
  }
  const cta = await c.evaluate(`(() => { const a = document.querySelector("footer.closing .close--type a.btn--primary"); return a && { t: a.textContent.trim(), h: a.getAttribute("href") }; })()`);
  if (!cta || cta.t !== "Start a project" || cta.h !== "/contact") fail("/", "footer", `close button ${JSON.stringify(cta)}`);
  const about = await c.evaluate(`(() => { const a = [...document.querySelectorAll(".nav__link")].find(l => l.textContent.trim() === "About"); if (!a) return false; a.click(); return true; })()`);
  if (!about) fail("/", "nav", "no About link");
  else {
    await sleep(2500);
    const r = await c.evaluate(`({ p: location.pathname, c: document.documentElement.className })`);
    if (r.p !== "/about" || !r.c.includes("m-enter-done")) fail("/about", "click-nav", `after click: ${JSON.stringify(r)}`);
  }
  await setViewport(c, 390, 844, true);
  await load(c, BASE + "/");
  const exp = () => c.evaluate(`document.querySelector(".nav__toggle")?.getAttribute("aria-expanded")`);
  const sheet = () => c.evaluate(`(() => { const l = document.querySelector(".nav__links"); const b = l.getBoundingClientRect(); const cs = getComputedStyle(l); return { shown: cs.display !== "none" && cs.visibility === "visible" && b.height > 0 && b.width > 0 && b.bottom > 0 && b.top < innerHeight, open: document.querySelector(".nav").classList.contains("is-open") }; })()`);
  if ((await exp()) !== "false") fail("/", "mobile", "nav__toggle aria-expanded not false");
  const s0 = await sheet();
  if (s0.shown || s0.open) fail("/", "mobile", `phone sheet visible before tap: ${JSON.stringify(s0)}`);
  const t = await c.evaluate(`(() => { const b = document.querySelector(".nav__toggle").getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; })()`);
  for (const type of ["mousePressed", "mouseReleased"]) await c.send("Input.dispatchMouseEvent", { type, x: t.x, y: t.y, button: "left", clickCount: 1 });
  await sleep(400);
  if ((await exp()) !== "true") fail("/", "mobile", "nav__toggle aria-expanded not true after tap");
  const s1 = await sheet();
  if (!s1.shown || !s1.open) fail("/", "mobile", `phone sheet not visible after tap: ${JSON.stringify(s1)}`);
}

// The home sections (Task 4): each section's h2 is its first heading and its only h2, every FAQ answer is
// open, the product tabs swap the app frames, the dealt moment mounts, and no kit sample name is left.
// HOME_SECTIONS is in page order, and #stack must close <main> (R5: a text-only FAQ never does).
const HOME_SECTIONS = ["services", "products", "how", "faq", "stack"];
async function checkHome(c) {
  await setViewport(c, 1440, 900, false);
  await load(c, BASE + "/");
  await sleep(1500);
  const r = await c.evaluate(`(() => {
    const ids = ${JSON.stringify(HOME_SECTIONS)};
    const sections = ids.map((id) => {
      const s = document.getElementById(id);
      if (!s) return { id, missing: true };
      const h = s.querySelectorAll("h2");
      const first = s.querySelector("h1, h2, h3");
      return { id, h2: h.length, firstIsH2: first?.tagName === "H2", main: s.parentElement?.tagName === "MAIN" };
    });
    const answers = [...document.querySelectorAll("#faq .faq__item > p")].map((p) => {
      const b = p.getBoundingClientRect(); const cs = getComputedStyle(p);
      return b.height > 0 && cs.visibility === "visible" && +cs.opacity === 1;
    });
    const text = document.querySelector("main").innerText;
    const order = [...document.querySelectorAll("main > section")].map((s) => s.id).filter((id) => ids.includes(id));
    return {
      sections, answers, order, last: [...document.querySelectorAll("main > section")].pop()?.id,
      leftovers: ["Relay", "harbor", "Mara Okafor", "Lena Fischer", "Tom Keller", "Returns policy", "Launch checklist"].filter((w) => text.includes(w)),
      moment: document.querySelector("#how")?.dataset.moment, ready: document.documentElement.hasAttribute("data-moments-ready"),
    };
  })()`);
  for (const s of r.sections) {
    if (s.missing) fail("/", "home", `no section #${s.id}`);
    else if (s.h2 !== 1 || !s.firstIsH2 || !s.main) fail("/", "home", `#${s.id}: ${JSON.stringify(s)}`);
  }
  if (r.order.join() !== HOME_SECTIONS.join()) fail("/", "home", `section order ${r.order.join(" > ")}`);
  if (r.last !== "stack") fail("/", "home", `last section in main is #${r.last}, not #stack`);
  if (r.answers.length < 3 || r.answers.some((v) => !v)) fail("/", "faq", `answers not all open: ${JSON.stringify(r.answers)}`);
  if (r.leftovers.length) fail("/", "home", `kit sample text left: ${r.leftovers.join(", ")}`);
  if (r.moment !== "pinned-chapters" || !r.ready) fail("/", "moment", `pinned-chapters not mounted: ${JSON.stringify({ m: r.moment, ready: r.ready })}`);
  const tabs = `(() => ({ a: document.getElementById("app-appkavo")?.hidden, b: document.getElementById("app-billminute")?.hidden, sel: document.getElementById("tab-billminute")?.getAttribute("aria-selected") }))()`;
  const t0 = await c.evaluate(tabs);
  if (t0.a !== false || t0.b !== true) fail("/", "tabs", `initial panels ${JSON.stringify(t0)}`);
  await c.evaluate(`document.getElementById("tab-billminute").click()`);
  await sleep(400);
  const t1 = await c.evaluate(tabs);
  if (t1.a !== true || t1.b !== false || t1.sel !== "true") fail("/", "tabs", `after BillMinute click ${JSON.stringify(t1)}`);
}

// The collage hero on "/" (Task 3): kit entrance, gradient-mesh ground + window in the art frame, one screen, h1 <= 3 lines.
const HERO_STATE = `(() => {
  const hero = document.querySelector("main section.hero");
  if (!hero) return null;
  const h1 = hero.querySelector("h1");
  const tops = [];
  const walk = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
  for (let n; (n = walk.nextNode()); ) {
    for (const m of n.textContent.matchAll(/\\S+/g)) {
      const r = document.createRange();
      r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
      const t = r.getBoundingClientRect().top;
      if (!tops.some((x) => Math.abs(x - t) < 4)) tops.push(t);
    }
  }
  const art = hero.querySelector(".hero__art");
  const main = hero.querySelector("a.btn--primary, a[href='/contact']");
  return {
    enter: hero.hasAttribute("data-enter"),
    canvas: !!art?.querySelector("canvas"),
    win: !!art?.querySelector(".ui-win"),
    bottom: hero.getBoundingClientRect().bottom + scrollY,
    vh: innerHeight,
    lines: tops.length,
    main: main && { t: main.textContent.trim(), h: main.getAttribute("href") },
  };
})()`;

// Canvas motion (rAF, invisible to getAnimations): two clips of the art frame's top strip, where only the
// ground shows (the window starts 64px down), 700ms apart. true when they are byte-identical.
async function groundStill(c) {
  const clip = await c.evaluate(`(() => { const b = document.querySelector("main .hero__art").getBoundingClientRect(); return { x: b.x, y: b.y + scrollY, width: b.width, height: 56, scale: 1 }; })()`);
  const shot = async () => (await c.send("Page.captureScreenshot", { format: "png", clip, captureBeyondViewport: false })).data;
  const a = await shot();
  await sleep(700);
  return a === (await shot());
}
const DISC = `(() => { const d = document.querySelector("main .hero__art > .loop-pause"); if (!d) return null; const b = d.getBoundingClientRect(); const f = d.parentElement.getBoundingClientRect(); const cs = getComputedStyle(d); return { x: b.x + b.width / 2, y: b.y + b.height / 2, label: d.getAttribute("aria-label"), shown: cs.display !== "none" && b.width > 0, inside: b.left >= f.left && b.right <= f.right && b.top >= f.top && b.bottom <= f.bottom }; })()`;

async function checkHero(c) {
  for (const vp of VIEWPORTS) {
    await setViewport(c, vp.width, vp.height, vp.mobile);
    await load(c, BASE + "/");
    await sleep(800);
    const r = await c.evaluate(HERO_STATE);
    if (!r) { fail("/", vp.name, "no main section.hero"); continue; }
    if (!r.enter) fail("/", vp.name, "hero has no data-enter");
    if (!r.canvas) fail("/", vp.name, "no ground canvas in .hero__art");
    if (!r.win) fail("/", vp.name, "no .ui-win window in .hero__art");
    if (Math.abs(r.bottom - r.vh) > 2) fail("/", vp.name, `hero bottom ${r.bottom}, innerHeight ${r.vh}`);
    if (r.lines > 3) fail("/", vp.name, `h1 on ${r.lines} lines`);
    if (!r.main || r.main.t !== "Start a project" || r.main.h !== "/contact") fail("/", vp.name, `hero main action ${JSON.stringify(r.main)}`);
    // a phone holds the ground on its finished picture, so no disc covers the window's chips
    if (vp.mobile) {
      if (!(await groundStill(c))) fail("/", vp.name, "hero ground canvas moving on a phone");
      if ((await c.evaluate(DISC))?.shown) fail("/", vp.name, "pause disc shown on a phone");
    }
  }
  // The ground moves (baseline: the clip method sees motion), and the frame's pause disc stops it
  await setViewport(c, 1440, 900, false);
  await load(c, BASE + "/");
  await sleep(1500);
  if (await groundStill(c)) fail("/", "ground", "hero ground canvas did not change in 700ms with normal motion (baseline)");
  const disc = await c.evaluate(DISC);
  if (!disc || !disc.shown || !disc.inside || disc.label !== "Pause animation") fail("/", "ground", `pause disc ${JSON.stringify(disc)}`);
  else {
    for (const type of ["mousePressed", "mouseReleased"]) await c.send("Input.dispatchMouseEvent", { type, x: disc.x, y: disc.y, button: "left", clickCount: 1 });
    await sleep(400);
    const after = await c.evaluate(DISC);
    if (after?.label !== "Play animation") fail("/", "ground", `disc label after click: ${after?.label}`);
    if (!(await groundStill(c))) fail("/", "ground", "hero ground canvas still moving after the pause disc was clicked");
  }
  // Review Focus 4: under reduced motion nothing in the hero keeps animating and nothing stays hidden
  await setViewport(c, 1440, 900, false);
  await c.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await load(c, BASE + "/");
  await sleep(2000);
  const rm = await c.evaluate(`(() => {
    const hero = document.querySelector("main section.hero");
    const running = document.getAnimations().filter((a) => a.playState === "running" && hero?.contains(a.effect?.target))
      .map((a) => (a.animationName || a.transitionProperty || a.constructor.name) + " on " + a.effect.target.className);
    const h1 = hero?.querySelector("h1");
    return { running, h1: h1 ? getComputedStyle(h1).opacity : null };
  })()`);
  const rmStill = await groundStill(c);
  const rmDisc = await c.evaluate(DISC);
  await c.send("Emulation.setEmulatedMedia", { features: [] });
  if (!rmStill) fail("/", "reduced-motion", "hero ground canvas changed in 700ms under reduced motion");
  if (rmDisc?.shown) fail("/", "reduced-motion", "pause disc shown under reduced motion");
  if (rm.running.length) fail("/", "reduced-motion", `running animations in hero: ${rm.running.join(", ")}`);
  if (rm.h1 !== "1") fail("/", "reduced-motion", `h1 opacity ${rm.h1}`);
}


// Services (Task 5): one dealt hero per page (centred, data-enter, a UI fragment in its window); a service page
// runs hero > features > how > faq > stack, and R5 holds: the last main > section holds a visual, never text only.
async function checkServices(c) {
  for (const path of ["/services", ...SERVICE_SLUGS.map((s) => `/services/${s}`)]) {
    for (const vp of VIEWPORTS) {
      await setViewport(c, vp.width, vp.height, vp.mobile);
      await load(c, BASE + path);
      const r = await c.evaluate(`(() => {
        const secs = [...document.querySelectorAll("main > section")];
        const heroes = document.querySelectorAll("main section.hero");
        const last = secs[secs.length - 1];
        const hero = heroes[0];
        return {
          heroes: heroes.length, enter: hero?.hasAttribute("data-enter"), centred: hero?.classList.contains("hero--centred"),
          frag: !!hero?.querySelector(".hero__window .ui"), first: secs[0] === hero, ids: secs.map((s) => s.id).join(">"),
          visual: !!last?.querySelector(".dg svg, .dg canvas, [data-diagram], .panel .ui, .frame img"),
          main: hero?.querySelector("a.btn--primary")?.textContent.trim(), href: hero?.querySelector("a.btn--primary")?.getAttribute("href"),
          moment: document.querySelector("#how")?.dataset.moment, olds: document.querySelectorAll("[class*='services-module'], [class*='service-module']").length,
        };
      })()`);
      const t = `${path} [${vp.name}]`;
      const slug = path !== "/services";
      if (r.heroes !== 1 || !r.first) failures.push(`${t} ${r.heroes} heroes, first=${r.first}`);
      if (!r.enter || !r.centred || !r.frag) failures.push(`${t} hero is not the dealt centred hero with a fragment: ${JSON.stringify(r)}`);
      if (r.main !== "Start a project") failures.push(`${t} hero main action "${r.main}"`);
      const want = slug ? `/contact?service=${path.split("/").pop()}` : "/contact";
      if (r.href !== want) failures.push(`${t} hero main action href "${r.href}", expected "${want}"`);
      if (r.olds) failures.push(`${t} old CSS-module classes still render`);
      if (!r.visual) failures.push(`${t} last section holds no visual (R5): ${r.ids}`);
      if (slug && !r.ids.endsWith(">features>how>faq>stack")) failures.push(`${t} section order ${r.ids}`);
      if (slug && r.moment !== "pinned-chapters") failures.push(`${t} #how moment ${r.moment}`);
    }
  }
}

// Products (Task 6): the index and both product pages open on the dealt collage hero with the product's window,
// the main action is "Start a project" (/contact), R5 holds (the last main > section holds a visual), a detail page
// runs hero > features > steps > faq > window with iris-opens on #steps, and the page wears the product's own ground.
const PRODUCT_GROUND = { appkavo: "rgb(10, 10, 12)", billminute: "rgb(255, 255, 255)" };
async function checkProducts(c) {
  for (const path of ["/products", ...PRODUCT_SLUGS.map((s) => `/products/${s}`)]) {
    const slug = path === "/products" ? null : path.split("/").pop();
    for (const vp of VIEWPORTS) {
      await setViewport(c, vp.width, vp.height, vp.mobile);
      await load(c, BASE + path);
      const r = await c.evaluate(`(() => {
        const secs = [...document.querySelectorAll("main > section")];
        const heroes = document.querySelectorAll("main section.hero");
        const hero = heroes[0];
        const last = secs[secs.length - 1];
        const a = hero?.querySelector("a.btn--primary, a[href^='/contact']");
        return {
          heroes: heroes.length, first: secs[0] === hero, enter: hero?.hasAttribute("data-enter"), collage: hero?.classList.contains("hero--collage"),
          win: !!hero?.querySelector(".hero__art .ui-win"), canvas: !!hero?.querySelector("canvas"), ids: secs.map((s) => s.id).join(">"),
          ground: hero && getComputedStyle(hero).backgroundColor, main: a?.textContent.trim(), href: a?.getAttribute("href"),
          visual: !!last?.querySelector(".dg svg, .dg canvas, [data-diagram], .panel .ui, .frame img"),
          primaries: document.querySelectorAll("main .btn--primary").length,
          moment: document.querySelector("[data-moment]")?.dataset.moment,
          olds: document.querySelectorAll("[class*='products-module'], [class*='product-module'], [class*='ProductPanel-module']").length,
        };
      })()`);
      const t = `${path} [${vp.name}]`;
      if (r.heroes !== 1 || !r.first) failures.push(`${t} ${r.heroes} heroes, first=${r.first}`);
      if (!r.enter || !r.collage || !r.win) failures.push(`${t} hero is not the dealt collage hero with a window: ${JSON.stringify(r)}`);
      if (r.canvas) failures.push(`${t} hero holds a canvas (no moving ground on product pages)`);
      if (r.main !== "Start a project" || r.href !== "/contact") failures.push(`${t} hero main action "${r.main}" -> "${r.href}"`);
      if (r.olds) failures.push(`${t} old CSS-module classes still render`);
      if (r.primaries !== 1) failures.push(`${t} ${r.primaries} btn--primary in main, expected only the hero's`);
      if (!r.visual) failures.push(`${t} last section holds no visual (R5): ${r.ids}`);
      if (r.moment !== "iris-opens") failures.push(`${t} dealt moment ${r.moment}`);
      if (slug) {
        if (!r.ids.endsWith(">features>steps>faq>window")) failures.push(`${t} section order ${r.ids}`);
        if (r.ground !== PRODUCT_GROUND[slug]) failures.push(`${t} hero ground ${r.ground}, expected ${PRODUCT_GROUND[slug]}`);
      } else if (r.ids !== ">all-products") failures.push(`${t} section order ${r.ids}`);
    }
  }
}

// About, careers, contact (Task 7): each opens on its own dealt hero, holds one dealt moment, carries one filled
// button at most, and (R5) closes on a visual. /contact is the starter's booking-form: an action, a visible label
// on every field, a submit that starts with a verb, and ?service=<slug> preselects that service.
const COMPANY = {
  "/about": { hero: "hero--film", moment: "counter-rolls" },
  "/careers": { hero: "hero--centred", moment: "giant-type-pass" },
  "/contact": { hero: "hero--split", moment: "pinned-chapters" },
};
const VERBS = ["send", "book", "start", "request", "contact", "email", "get", "join", "ask", "tell"];
async function checkCompany(c) {
  for (const [path, want] of Object.entries(COMPANY)) {
    for (const vp of VIEWPORTS) {
      await setViewport(c, vp.width, vp.height, vp.mobile);
      await load(c, BASE + path);
      const r = await c.evaluate(`(() => {
        const secs = [...document.querySelectorAll("main > section")];
        const heroes = document.querySelectorAll("main section.hero");
        const hero = heroes[0];
        return {
          heroes: heroes.length, first: secs[0] === hero, enter: hero?.hasAttribute("data-enter"), cls: hero?.className ?? "",
          moments: [...document.querySelectorAll("[data-moment]")].map((m) => m.dataset.moment).join(),
          primaries: document.querySelectorAll("main .btn--primary").length, ids: secs.map((s) => s.id).join(">"),
          olds: document.querySelectorAll("[class*='about-module'], [class*='contact-module'], [class*='EnquiryForm-module'], [class*='WhyHicaso-module']").length,
        };
      })()`);
      const t = `${path} [${vp.name}]`;
      if (r.heroes !== 1 || !r.first) failures.push(`${t} ${r.heroes} heroes, first=${r.first}`);
      if (!r.enter || !r.cls.split(" ").includes(want.hero)) failures.push(`${t} hero is not the dealt ${want.hero} with data-enter: ${r.cls}`);
      if (r.moments !== want.moment) failures.push(`${t} dealt moment "${r.moments}", expected ${want.moment}`);
      // contact holds the hero's "Start a project" (to #enquiry) and the form's submit, a screen apart; the others one
      if (r.primaries > (path === "/contact" ? 2 : 1)) failures.push(`${t} ${r.primaries} btn--primary in main, expected ${path === "/contact" ? "the hero's and the form's" : "one at most"}`);
      if (r.olds) failures.push(`${t} old CSS-module classes still render`);
    }
  }
  await setViewport(c, 1440, 900, false);
  await load(c, BASE + "/contact");
  const f = await c.evaluate(`(() => {
    const form = document.querySelector("main form");
    if (!form) return null;
    const fields = [...form.querySelectorAll("input, select, textarea")].filter((e) => e.type !== "hidden" && e.type !== "submit");
    const unlabelled = fields.filter((e) => { const l = e.id && form.querySelector('label[for="' + e.id + '"]'); const b = l?.getBoundingClientRect(); return !l || !l.textContent.trim() || !(b.width > 0 && b.height > 0); }).map((e) => e.name);
    const submit = form.querySelector('button[type="submit"]');
    return { action: form.getAttribute("action"), method: form.getAttribute("method"), fields: fields.length, unlabelled, submit: submit?.textContent.trim(), cls: form.className, service: form.querySelector("select[name=service]")?.value };
  })()`);
  if (!f) failures.push("/contact no form in main");
  else {
    if (!f.action) failures.push(`/contact form[action] is empty`);
    if (f.method !== "post") failures.push(`/contact form method ${f.method}`);
    if (f.fields < 6) failures.push(`/contact only ${f.fields} fields`);
    if (f.unlabelled.length) failures.push(`/contact fields without a visible label: ${f.unlabelled.join(", ")}`);
    if (!VERBS.includes((f.submit ?? "").split(" ")[0].toLowerCase())) failures.push(`/contact submit "${f.submit}" does not start with a verb`);
    if (!/\bform\b/.test(f.cls)) failures.push(`/contact form lacks the kit's .form class: ${f.cls}`);
    if (f.service !== "") failures.push(`/contact preselects "${f.service}" with no ?service`);
  }
  // an empty submit (scripts on) stops at system.js's check: each required field is marked and gives its reason under it
  const inv = await c.evaluate(`(() => { const f = document.querySelector("main form"); f.requestSubmit(); const bad = [...f.querySelectorAll("[aria-invalid=true]")].map((e) => e.name); const errs = [...f.querySelectorAll(".field__error")].filter((e) => !e.hidden && e.textContent.trim()).length; return { bad: bad.join(), errs, status: f.querySelector("[data-form-status]")?.textContent }; })()`);
  if (inv.bad !== "name,email,message" || inv.errs !== 3) failures.push(`/contact empty submit: ${JSON.stringify(inv)}`);
  await load(c, BASE + "/contact?service=generative-ai");
  const pre = await c.evaluate(`document.querySelector("main form select[name=service]")?.value`);
  if (pre !== "generative-ai") failures.push(`/contact?service=generative-ai preselects "${pre}"`);
}

// R5 on every page: the last main > section holds a visual (a picture, diagram, canvas or UI), never text only.
async function checkLastVisual(c) {
  for (const route of ROUTES) {
    const path = typeof route === "string" ? route : route.path;
    if (typeof route !== "string" && route.status && route.status !== 200) continue; // an error page is not a content page
    for (const vp of VIEWPORTS) {
      await setViewport(c, vp.width, vp.height, vp.mobile);
      await load(c, BASE + path);
      const ok = await c.evaluate(`!![...document.querySelectorAll("main > section")].pop()?.querySelector(".dg svg, .dg canvas, [data-diagram], .ui, picture img, .frame img, .mo-pc__visuals")`);
      if (!ok) failures.push(`${path} [${vp.name}] last main > section holds no visual (R5)`);
    }
  }
}

const guard = setTimeout(() => { console.error(`SMOKE FAIL\n  - whole run exceeded ${RUN_MS / 1000}s, last at ${where}`); try { chrome.kill(); } catch {} try { rmSync(dir, { recursive: true, force: true }); } catch {} process.exit(1); }, RUN_MS);
try {
  const c = await connect();
  const errors = [];
  c.on((m) => {
    if (m.method === "Runtime.exceptionThrown") errors.push(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text);
    if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error") errors.push(m.params.args.map((a) => a.value ?? a.description).join(" "));
    if (m.method === "Log.entryAdded" && m.params.entry.level === "error") errors.push(m.params.entry.text + " " + (m.params.entry.url ?? ""));
  });
  for (const d of ["Page", "Runtime", "Network", "Log"]) await c.send(`${d}.enable`);
  for (const route of ROUTES) {
    for (const vp of VIEWPORTS) await checkRoute(c, route, vp, errors);
    await checkNoJs(c, route);
  }
  await checkNav(c);
  await checkHero(c);
  await checkHome(c);
  await checkServices(c);
  await checkProducts(c);
  await checkCompany(c);
  await checkLastVisual(c);
  c.ws.close();
} catch (e) {
  failures.push(`smoke crashed: ${e.message}`);
} finally {
  clearTimeout(guard);
  chrome.kill();
  await sleep(300);
  rmSync(dir, { recursive: true, force: true });
}

if (failures.length) {
  console.error("SMOKE FAIL\n" + failures.map((f) => "  - " + f).join("\n"));
  process.exit(1);
}
console.log(`SMOKE PASS (${ROUTES.length} route(s))`);
