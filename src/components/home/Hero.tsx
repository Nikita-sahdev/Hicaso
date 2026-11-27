import styles from "./Hero.module.css";
import SpecularButton from "../ui/SpecularButton";
import HeroAudit from "./HeroAudit";
import HeroDeal from "./HeroDeal";
import LightRays from "../ui/LightRays";
import { BOOKING_URL, PROFILES, httpsLinks } from "@/lib/site";

// the second button books the free call once a booking link is set (src/lib/site.ts)
const BOOKING = httpsLinks([{ url: BOOKING_URL }])[0]?.url;

// The home hero (owner's reference, 2026-11-24): the kit's centred hero for the words (layout.css, hero--centred,
// as the service pages use it), then a row of three real screens with the middle one raised: BillMinute's invoice
// editor, AppKavo's findings window (live: HeroAudit runs its audit once), AppKavo's site. No faces and no client
// logos (none are real yet): the proof is the review profiles and the stack we build with.
// motion.js runs the entrance from data-enter; the h1's accent span keeps its words (the word masks walk into it).

// AppKavo's findings for one build, ranked (the product's own subject: src/data/products.ts).
const FINDINGS = [
  { tone: 2, finding: "Cleartext HTTP allowed", file: "AndroidManifest.xml", status: "Blocker", cls: "is-you" },
  { tone: 4, finding: "Debuggable release build", file: "build.gradle", status: "Blocker", cls: "is-you" },
  { tone: 1, finding: "Exported activity", file: "AndroidManifest.xml", status: "Fix ready", cls: "" },
  { tone: 3, finding: "API key in resources", file: "strings.xml", status: "Fix ready", cls: "" },
  { tone: 5, finding: "OkHttp with a known CVE", file: "Dependencies", status: "Fix ready", cls: "" },
  { tone: 2, finding: "Data Safety entry missing", file: "Play Console", status: "Fix ready", cls: "" },
  { tone: 4, finding: "MD5 used for hashing", file: "CryptoUtil.kt", status: "Fixed", cls: "is-done" },
];

// what we build with (icons in public/assets/icons)
const STACK = [
  ["flutter", "Flutter"],
  ["nextjs", "Next.js"],
  ["openai", "OpenAI"],
  ["claude", "Claude"],
  ["python", "Python"],
  ["nodejs", "Node.js"],
  ["firebase", "Firebase"],
  ["aws", "AWS"],
] as const;

export default function Hero() {
  return (
    <section className={`hero hero--centred hero--showcase ${styles.hero}`} data-enter aria-labelledby="hero-h">
      {/* React Bits LightRays as the hero's ground (owner's request, 2026-11-24): blueprint-blue rays from the top
          centre, printed as soft ink on the white page (lightMode); no click pulse, so pressing a button doesn't
          flash the light. The component sets pointer-events: none and listens on window. */}
      <div className={styles.ground} aria-hidden="true">
        <LightRays
          raysOrigin="top-center"
          raysColor="#2456d6"
          lightMode
          atmosphere={0}
          lightSpread={0.6}
          rayLength={2}
          glow={0.5}
          haze={0.25}
          mouseInfluence={0.1}
          clickPulse={false}
        />
      </div>
      <div className="wrap">
        <div className="hero-text">
          <div className={`hero__c ${styles.c}`}>
            <h1 id="hero-h" className={styles.h1}>
              AI, mobile and web software <span className={styles.accent}>for global companies</span>
            </h1>
            <p className={`hero__lead ${styles.lead}`}>
              Hicaso is a custom software development company in India. The team that builds and runs our own products,
              AppKavo and BillMinute, builds your AI, mobile and web software.
            </p>
            <div className="btn-row">
              <SpecularButton
                href="/contact"
                size="md"
                radius={8}
                tint="#2456d6"
                tintOpacity={1}
                textColor="#ffffff"
                lineColor="#ffffff"
                baseColor="#525252"
                intensity={1}
                idleIntensity={0.35}
                shineSize={10}
                shineFade={34}
                thickness={1.2}
                glow={1}
                followMouse
                proximity={250}
              >
                Start a project
              </SpecularButton>
              {BOOKING ? (
                <a className="btn btn--secondary" href={BOOKING} target="_blank" rel="noopener noreferrer">
                  Book a free call
                </a>
              ) : (
                <a className="btn btn--secondary" href="/products">
                  See our products
                </a>
              )}
            </div>
            <p className="hero__proof">
              Hicaso on{" "}
              <a href={PROFILES[0].url} target="_blank" rel="noopener noreferrer">{PROFILES[0].label}</a> and{" "}
              <a href={PROFILES[1].url} target="_blank" rel="noopener noreferrer">{PROFILES[1].label}</a>.
            </p>
            <div className={styles.stack}>
              <p className={styles.stackLabel}>Built with</p>
              <ul className={styles.logos}>
                {STACK.map(([id, name]) => (
                  <li key={id}>
                    <img src={`/assets/icons/${id}.svg`} alt="" width={22} height={22} />
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.showcase} data-enter-media>
            <figure className={`${styles.screen} ${styles.side}`} data-deal="side">
              <img
                src="/images/products/billminute.png"
                alt="BillMinute's invoice editor: a USD invoice to a US client, with the tax invoice preview beside it"
                width={1080}
                height={810}
              />
            </figure>

            <div
              className={`${styles.screen} ${styles.main} ${styles.art}`}
              data-deal="main"
              role="img"
              data-ui-pause-host
              aria-label="AppKavo's ranked security findings for an Android build, with two blockers for Google Play review"
            >
              <div className="ui ui-panel ui-win ui-win--compact" aria-hidden="true">
                <div className="ui-win__bar">
                  <span className="ui-dots"><i></i><i></i><i></i></span>
                  <span className="ui-win__crumb">
                    AppKavo <i>/</i> <b>app-release.aab</b>
                  </span>
                  <span className="ui-spacer"></span>
                  <span className="ui-win__search">
                    <svg className="ui-icon" viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 3 3" /></svg>
                    <span className="ui-win__ph">Search</span>
                    <span className="ui-kbd">/</span>
                  </span>
                </div>
                <div className="ui-win__body">
                  <nav className="ui-win__side">
                    <span className="ui-win__nav is-on">
                      <svg className="ui-icon" viewBox="0 0 16 16"><path d="M8 2 3 4v4c0 3 2.2 5.2 5 6 2.8-.8 5-3 5-6V4z" /></svg>
                      Findings<em>{FINDINGS.length}</em>
                    </span>
                    <span className="ui-win__nav">
                      <svg className="ui-icon" viewBox="0 0 16 16"><path d="m3.5 8.4 2.8 2.8 6.2-6.4" /></svg>
                      Stores
                    </span>
                    <span className="ui-win__nav">
                      <svg className="ui-icon" viewBox="0 0 16 16"><path d="M4 2.5h5.5L12 5v8.5H4z" /><path d="M6 8h4M6 10.5h4" /></svg>
                      Privacy
                    </span>
                    <span className="ui-win__nav">
                      <svg className="ui-icon" viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.5" /><path d="M8 5v3l2 1.5" /></svg>
                      CVE watch
                    </span>
                    <span className="ui-win__label">Builds</span>
                    <span className="ui-win__nav"><span className="ui-win__hash">#</span>Android</span>
                    <span className="ui-win__nav"><span className="ui-win__hash">#</span>iOS</span>
                  </nav>
                  <div className="ui-win__main">
                    <ul className="ui-win__rows">
                      {FINDINGS.map((f, i) => (
                        <li key={f.finding} className={`ui-win__row${i === 0 ? " is-sel" : ""}`}>
                          <span className="ui-avatar" data-tone={f.tone}>{i + 1}</span>
                          <span className="ui-win__who">{f.finding}</span>
                          <span className="ui-win__sub">{f.file}</span>
                          <span className={`ui-win__st${f.cls ? ` ${f.cls}` : ""}`}>{f.status}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <figure className={`${styles.screen} ${styles.side}`} data-deal="side">
              <img
                src="/images/products/appkavo.jpg"
                alt="AppKavo's home page: find your app's security holes before attackers do"
                width={1080}
                height={810}
              />
            </figure>
          </div>
        </div>
      </div>
      {/* AppKavo audits the build in the findings window once, after the entrance (GSAP) */}
      <HeroAudit />
      {/* the three screens deal out on load, then lean with the pointer (GSAP) */}
      <HeroDeal />
    </section>
  );
}
