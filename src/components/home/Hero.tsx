import styles from "./HeroArt.module.css";
import Orb from "../ui/Orb";
import SpecularButton from "../ui/SpecularButton";

// The dealt collage hero (kit layout/hero-collage.html). motion.js runs the entrance from data-enter,
// so the h1 stays plain text for its word masks.
// The art frame's ground is html[data-ground="sand"] (--ground-bg #d9ccb7): the Orb draws on the same
// colour so its shader blends into the frame.
const GROUND = "#d9ccb7";

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

export default function Hero() {
  return (
    <section className="hero hero--collage" data-enter aria-labelledby="hero-h">
      <div className="wrap">
        <div className="hero-text grid hero__grid">
          <div className="hero__text span-5">
            <h1 id="hero-h">AI, mobile and web software for global companies</h1>
            <p className="hero__lead">
              Hicaso is a software company and product studio in India, building generative and agentic AI for
              clients and running products of our own.
            </p>
            <div className="btn-row">
              <SpecularButton
                href="/contact"
                size="md"
                radius={8}
                tint="#0a0a0a"
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
              <a className="btn btn--secondary" href="/products">
                See our products
              </a>
            </div>
            <p className={styles.proof}>Our working hours overlap with Europe and the Middle East.</p>
          </div>

          <div
            className={`hero__art span-6 start-7 ${styles.art}`}
            role="img"
            aria-label="AppKavo's ranked security findings for an Android build, with two blockers for Google Play review"
          >
            <div className={styles.ground} aria-hidden="true">
              <Orb
                colors={["#9c43fe", "#4cc2e9", "#101499"]}
                hoverIntensity={1}
                trail={1}
                rotateOnHover
                followCursor
                hue={0}
                size={1.3}
                glow={1}
                bleed={1}
                wobble={1}
                highlight={1}
                tiltX={0}
                tiltY={0}
                speed={1}
                backgroundColor={GROUND}
                forceHoverState={false}
                clickPulse
                intro
              />
            </div>

            <div className="ly-piece ly-piece--main" aria-hidden="true">
              <div className="ui ui-panel ui-win ui-win--compact">
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

            <div className={`ly-piece ly-piece--note ${styles.card}`} aria-hidden="true" data-ly-steps="700">
              <div className={styles.cardHead}>
                <b>Audit of app-release.aab</b>
                <span className={styles.chip} data-step data-step-at="4">Done</span>
              </div>
              <div className={styles.line} data-step><i>✓</i><span><b>{FINDINGS.length} findings</b> ranked, with fixes to paste</span></div>
              <div className={styles.line} data-step><i>!</i><span><b>2 blockers</b> for Google Play review</span></div>
              <div className={styles.line} data-step><i>✓</i><span><b>Data Safety</b> form drafted</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
