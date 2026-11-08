import { products } from "@/data/products";

// app-frame (sections-library.md): each product as one app window across the .wrap, its list beside the
// open item, kit fragments (window, diff-review, doc) rewritten to the product's own subject. Two click
// tabs (system.js tabs: role=tablist, aria-controls) swap AppKavo and BillMinute; the open pane is the
// frame's one loop.
const SEARCH = `<span class="ui-win__search" aria-hidden="true"><svg class="ui-icon" viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg><span class="ui-win__ph">Search</span><span class="ui-kbd">/</span></span>`;
const nav = (label: string, icon: string, count = "", on = false) =>
  `<span class="ui-win__nav${on ? " is-on" : ""}"><svg class="ui-icon" viewBox="0 0 16 16">${icon}</svg>${label}${count ? `<em>${count}</em>` : ""}</span>`;
const hash = (label: string) => `<span class="ui-win__nav"><span class="ui-win__hash">#</span>${label}</span>`;
const row = (i: number, who: string, sub: string, st: string, cls = "", av = String(i + 1)) =>
  `<li class="ui-win__row${i === 0 ? " is-sel" : ""}"><span class="ui-avatar" data-tone="${(i % 5) + 1}">${av}</span><span class="ui-win__who">${who}</span><span class="ui-win__sub">${sub}</span><span class="ui-win__st${cls ? ` ${cls}` : ""}">${st}</span></li>`;
const win = (crumb: string, side: string, rows: string) =>
  `<div class="ui ui-panel ui-win"><div class="ui-win__bar"><span class="ui-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="ui-win__crumb">${crumb}</span><span class="ui-spacer"></span>${SEARCH}</div><div class="ui-win__body"><nav class="ui-win__side" aria-hidden="true">${side}</nav><div class="ui-win__main"><ul class="ui-win__rows">${rows}</ul></div></div></div>`;

const SHIELD = `<path d="M8 2 3 4v4c0 3 2.2 5.2 5 6 2.8-.8 5-3 5-6V4z"/>`;
const CHECK = `<path d="m3.5 8.4 2.8 2.8 6.2-6.4"/>`;
const PAGE = `<path d="M4 2.5h5.5L12 5v8.5H4z"/><path d="M6 8h4M6 10.5h4"/>`;
const CLOCK = `<circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.5"/>`;

// AppKavo: the findings for an iOS build, ranked; the open item is the first one's fix as a diff
const FINDINGS: [string, string, string, string][] = [
  ["Plain HTTP allowed", "Info.plist", "Blocker", "is-you"],
  ["No privacy manifest", "PrivacyInfo.xcprivacy", "Blocker", "is-you"],
  ["Weak Keychain access", "AuthStore.swift", "Fix ready", ""],
  ["API key in bundle", "Config.swift", "Fix ready", ""],
  ["Alamofire CVE", "Package.resolved", "Fix ready", ""],
  ["Vague location reason", "InfoPlist.strings", "Fix ready", ""],
  ["Debug logs in release", "Logger.swift", "Fixed", "is-done"],
  ["Weak session ids", "Session.swift", "Fixed", "is-done"],
  ["Pasteboard read", "AppDelegate.swift", "Fixed", "is-done"],
];
const appkavoList = win(
  "AppKavo <i>/</i> <b>app-release.ipa</b>",
  nav("Findings", SHIELD, String(FINDINGS.length), true) + nav("Stores", CHECK) + nav("Privacy", PAGE) + nav("CVE watch", CLOCK) +
    `<span class="ui-win__label">Builds</span>` + hash("Android") + hash("iOS"),
  FINDINGS.map(([w, s, st, c], i) => row(i, w, s, st, c)).join(""),
);

const tag = (t: string) => `<span class="k">&lt;${t}&gt;</span>`;
const end = (t: string) => `<span class="k">&lt;/${t}&gt;</span>`;
const pair = (k: string, v: string) => `${tag(k)}${v}${end(k)}`;
const ln = (n: number, depth: number, code: string, cls = "") =>
  `<div class="ui-diff__ln${cls ? ` ${cls}` : ""}"><i>${n}</i><i>${n}</i><span class="ui-diff__code" data-i="${depth}">${depth ? `<span class="ui-diff__ind">${"  ".repeat(depth)}</span>` : ""}${code}</span></div>`;
const PLIST_TAIL: [number, string][] = [
  [1, pair("key", "UIBackgroundModes")], [1, tag("array")], [2, pair("string", `<span class="s">remote-notification</span>`)], [1, end("array")],
  [1, pair("key", "UILaunchStoryboardName")], [1, pair("string", `<span class="s">LaunchScreen</span>`)],
  [1, pair("key", "UIRequiredDeviceCapabilities")], [1, tag("array")], [2, pair("string", `<span class="s">arm64</span>`)], [1, end("array")],
  [1, pair("key", "UISupportedInterfaceOrientations")], [1, tag("array")], [2, pair("string", `<span class="s">UIInterfaceOrientationPortrait</span>`)], [1, end("array")],
  [1, pair("key", "UIStatusBarStyle")], [1, pair("string", `<span class="s">UIStatusBarStyleDefault</span>`)],
  [0, end("dict")], [0, end("plist")],
];
const appkavoOpen = `<div class="ui ui-panel ui-diff" data-ui="diff-review">
  <div class="ui-diff__head">
    <svg class="ui-icon ui-diff__fold" viewBox="0 0 16 16" aria-hidden="true"><path d="m4.5 6.25 3.5 3.5 3.5-3.5"/></svg>
    <span class="ui-diff__tool" aria-hidden="true"><img data-icon="xml" src="/assets/icons/xml.svg" alt=""></span>
    <span class="ui-diff__repo">app-release.ipa</span><i class="ui-diff__slash" aria-hidden="true">/</i>
    <span class="ui-diff__path"><b>Info.plist</b></span>
    <span class="ui-spacer"></span>
    <span class="ui-diff__stat"><b class="is-add"><span class="ui-diff__was">+0</span><span class="ui-diff__now">+1</span></b><b class="is-del"><span class="ui-diff__was">&minus;0</span><span class="ui-diff__now">&minus;1</span></b><span class="ui-diff__bar" aria-hidden="true"><i class="is-add"></i><i class="is-del"></i></span></span>
  </div>
  <div class="ui-diff__hunk"><span>@@ -9,26 +9,26 @@</span> <em class="ui-diff__sig">${pair("key", "NSAppTransportSecurity")}</em></div>
  <div class="ui-diff__lines">
    ${ln(9, 1, pair("key", "CFBundleShortVersionString"))}
    ${ln(10, 1, pair("string", `<span class="n">2.3.0</span>`))}
    ${ln(11, 1, pair("key", "NSAppTransportSecurity"))}
    ${ln(12, 1, tag("dict"))}
    ${ln(13, 2, pair("key", "NSAllowsArbitraryLoads"))}
    <div class="ui-diff__ln is-target" data-diff-target><i>14</i><i>14</i><span class="ui-diff__code" data-i="2"><span class="ui-diff__ind">    </span><mark class="ui-diff__w"><span class="k">&lt;true/&gt;</span></mark></span></div>
    <div class="ui-diff__sug" data-diff-sug><div class="ui-diff__ln is-add"><i></i><i>14</i><span class="ui-diff__code" data-i="2"><span class="ui-diff__ind">    </span><mark class="ui-diff__w"><span class="k">&lt;false/&gt;</span></mark></span></div></div>
    <div class="ui-diff__thread">
      <div class="ui-diff__by">
        <span class="ui-agent" aria-hidden="true"></span>
        <span class="ui-diff__name">AppKavo</span>
        <span class="ui-diff__time">now</span>
        <span class="ui-spacer"></span>
        <span class="ui-diff__act" data-diff-act>
          <button class="ui-btn ui-btn--sm ui-diff__apply" type="button" tabindex="-1" data-diff-apply><span class="ui-diff__lbl">Apply fix</span><i class="ui-diff__spin" aria-hidden="true"></i></button>
          <span class="ui-chip ui-diff__done"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 8.4 2.6 2.6L12 5.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Applied</span>
        </span>
      </div>
      <div class="ui-diff__msg">App Review blocks plain HTTP. Set this to <code>false</code> and the build passes.</div>
    </div>
    ${PLIST_TAIL.map(([d, code], i) => ln(15 + i, d, code)).join("\n    ")}
  </div>
</div>`;

// BillMinute: invoices in the client's currency; the open item is the selected invoice
const INVOICES: [string, string, string, string][] = [
  ["INV-0148", "€2,400.00 · due 20 Nov", "Sent", ""],
  ["INV-0147", "$1,850.00 · due 18 Nov", "Sent", ""],
  ["INV-0146", "£920.00 · due 12 Nov", "Overdue", "is-you"],
  ["INV-0145", "AED 6,300.00 · due 10 Nov", "Paid", "is-done"],
  ["INV-0144", "€640.00 · due 8 Nov", "Overdue", "is-you"],
  ["INV-0143", "₹84,000.00 · due 5 Nov", "Paid", "is-done"],
  ["INV-0142", "$3,200.00 · due 1 Nov", "Paid", "is-done"],
  ["INV-0141", "CHF 1,150.00 · due 28 Oct", "Paid", "is-done"],
  ["INV-0140", "€1,780.00 · due 24 Oct", "Paid", "is-done"],
];
const billminuteList = win(
  "BillMinute <i>/</i> <b>Invoices</b>",
  nav("Invoices", PAGE, String(INVOICES.length), true) + nav("Outstanding", CLOCK, "2") + nav("Paid", CHECK) +
    `<span class="ui-win__label">Currencies</span>` + hash("EUR") + hash("USD") + hash("GBP"),
  INVOICES.map(([w, s, st, c], i) => row(i, w, s, st, c, w.slice(-2))).join(""),
);
const billminuteOpen = `<div class="ui ui-doc" data-ui="doc">
  <article class="ui-doc__page">
    <div class="ui-doc__label">Invoice INV-0148</div>
    <div class="ui-doc__title">Design work, November</div>
    <div class="ui-doc__text">Issued 04.11.2026, due <mark class="ui-doc__mark" data-kind="Format" data-msg="Dates are written day first, the way your client reads them." data-where="Client settings, Germany">20.11.2026</mark>.</div>
    <div class="ui-doc__text">Logo and brand guide, two rounds: 1.600,00 €</div>
    <div class="ui-doc__text">Website design, six pages: 800,00 €</div>
    <div class="ui-doc__text">Total due: <mark class="ui-doc__mark is-on">2.400,00 €</mark></div>
    <div class="ui-doc__text">Pay by bank transfer to the account on this invoice. BillMinute never holds the money.</div>
    <div class="ui-doc__text">Line items, taxes and discounts come from your last invoice to this client.</div>
  </article>
  <aside class="ui-doc__note ui-panel is-on" aria-live="polite">
    <div class="ui-doc__kind"><span class="ui-doc__dot"></span><span data-doc-kind>Currency</span></div>
    <div class="ui-doc__msg" data-doc-msg>Shown in euros, your client's currency.</div>
    <div class="ui-doc__where" data-doc-where>Client settings, Germany</div>
  </aside>
</div>`;

const FRAMES: Record<string, { label: string; list: string; open: string }> = {
  appkavo: {
    label: "AppKavo's findings for an iOS build, with the first one's fix shown as a change to Info.plist",
    list: appkavoList,
    open: appkavoOpen,
  },
  billminute: {
    label: "BillMinute's invoice list in several currencies, with one invoice open in euros",
    list: billminuteList,
    open: billminuteOpen,
  },
};

export default function Products() {
  return (
    <section className="section ground-surface" id="products" aria-labelledby="products-h">
      <div className="wrap">
        <div className="grid">
          <h2 id="products-h" className="span-5">
            Two products we build and run
          </h2>
          <div className="span-6 start-7 stack-5">
            <p>
              AppKavo audits mobile app builds for security issues and store rejections. BillMinute sends invoices in
              your client&rsquo;s currency. Both run on the stack we use for clients.{" "}
              <a className="link" href="/products">
                See our products
              </a>
            </p>
            <div className="tabs" role="tablist" aria-label="Products">
              {products.map((p, i) => (
                <button
                  key={p.slug}
                  className="tab"
                  type="button"
                  role="tab"
                  id={`tab-${p.slug}`}
                  aria-selected={i === 0}
                  aria-controls={`app-${p.slug}`}
                  tabIndex={i === 0 ? 0 : -1}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        {products.map((p, i) => {
          const f = FRAMES[p.slug];
          return (
            <div key={p.slug} className="fill app-tab" role="tabpanel" id={`app-${p.slug}`} aria-labelledby={`tab-${p.slug}`} hidden={i > 0}>
              <div className="ui app" role="img" aria-label={f.label} data-ui-pause-host="">
                <div className="app__pane app__pane--list" dangerouslySetInnerHTML={{ __html: f.list }} />
                <div className="app__pane app__pane--open" data-ui-loop="" dangerouslySetInnerHTML={{ __html: f.open }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
