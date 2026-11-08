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
