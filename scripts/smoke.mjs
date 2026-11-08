// Headless-Chrome smoke test, no dependencies. Run: npm run smoke (dev server on :3000).
// Extend ROUTES (string, or { path, status } for a non-200 route); add per-route cases in checkRoute.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROUTES = ["/"];
const BASE = process.env.SMOKE_BASE ?? "http://localhost:3000";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "mobile", width: 390, height: 844, mobile: true },
];
const FONT_READY = `document.fonts.ready.then(() => [...document.fonts].some(f => f.family.replace(/["']/g, "") === "Instrument Sans" && f.status === "loaded"))`;

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
    pending.set(i, (m) => (m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result)));
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
  const loaded = new Promise((r) => c.on((m) => m.method === "Page.loadEventFired" && r()));
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
  const got = await load(c, BASE + path);
  const t = `${path}`;
  if (got !== status) fail(t, vp.name, `HTTP ${got}, expected ${status}`);
  const type = await c.evaluate(`document.documentElement.dataset.type`);
  if (type !== "software") fail(t, vp.name, `data-type is ${type}`);
  const bg = await c.evaluate(`getComputedStyle(document.body).backgroundColor`);
  if (bg !== "rgb(222, 218, 211)") fail(t, vp.name, `body background ${bg}`);
  if (!(await c.evaluate(FONT_READY))) fail(t, vp.name, "Instrument Sans not loaded");
  const h1 = await c.evaluate(`document.querySelectorAll("h1").length`);
  if (h1 !== 1) fail(t, vp.name, `${h1} h1 elements`);
  const overflow = await c.evaluate(`document.documentElement.scrollWidth - innerWidth`);
  if (overflow > 0) fail(t, vp.name, `horizontal overflow ${overflow}px`);
  errors.forEach((e) => fail(t, vp.name, `console error: ${e}`));
}

async function checkNoJs(c, route) {
  const { path } = typeof route === "string" ? { path: route } : route;
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
  c.ws.close();
} catch (e) {
  failures.push(`smoke crashed: ${e.message}`);
} finally {
  chrome.kill();
  await sleep(300);
  rmSync(dir, { recursive: true, force: true });
}

if (failures.length) {
  console.error("SMOKE FAIL\n" + failures.map((f) => "  - " + f).join("\n"));
  process.exit(1);
}
console.log(`SMOKE PASS (${ROUTES.length} route(s))`);
