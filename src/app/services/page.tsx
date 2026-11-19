import type { Metadata } from "next";
import ServiceHero from "@/components/services/ServiceHero";
import { chat } from "@/components/services/fragments";
import { SERVICE_GROUPS, groupId, services } from "@/data/services";
import { technologies } from "@/data/technologies";
import TechLinks from "@/components/services/TechLinks";

export const metadata: Metadata = {
  alternates: { canonical: "/services" },
  title: "Custom Software Development Services — Hicaso",
  description:
    "Custom software development from India: generative and agentic AI, mobile and web apps, MVPs, SaaS, eCommerce, cloud and DevOps, and dedicated developers.",
};

// The hub: Hicaso with the four services, each beside one tool it ships with (real colour icons).
const SPEC = {
  layout: "hub",
  alt: "Hicaso's four services: generative AI, agentic AI, mobile apps and web apps.",
  center: { label: "Hicaso" },
  spokes: [
    { label: "Generative AI", icon: "openai" },
    { label: "Agentic AI", icon: "claude" },
    { label: "Mobile apps", icon: "flutter" },
    { label: "Web apps", icon: "nextjs" },
  ],
};

// the hero's window: a client asking which service fits, answered with the four pages it can open
const HERO = chat({
  title: "Hicaso team",
  q: "Can you build the AI feature and the app together?",
  a: "Yes. One team builds <b>the AI, the Android and iOS apps</b> and the web backend.",
  srcs: ["Generative AI", "Mobile App Development"],
});

const FORMATS = [
  "Chat assistants",
  "AI agents",
  "MCP servers",
  "Android apps",
  "iOS apps",
  "SaaS products",
  "APIs",
  "Online stores",
  "PHP upgrades",
];

// How a project runs, in the owner's facts only: NDA on request, a plan by email, project or dedicated developers billed
// monthly or hourly, weekly demos, code and IP the client's once paid, maintenance after launch (src/data/faqs.ts,
// why.ts, services.ts). No price model or timeline is promised here.
const STEPS = [
  { name: "Tell us what you need", text: "Send the enquiry form or plan the project with our planner. We sign your NDA first if you ask." },
  { name: "Get our plan by email", text: "We reply by email with how we would build it." },
  { name: "Choose how to work", text: "A project, or dedicated developers billed monthly or by the hour." },
  { name: "Build with weekly demos", text: "You see working software every week, not just status updates." },
  { name: "Launch", text: "We release to the web or the app stores. Once the project is paid for, the code and IP are yours." },
  { name: "Support after launch", text: "Bug fixes, updates and support, Monday to Friday, 9:00 AM to 6:00 PM IST." },
];

const MODELS = [
  { name: "A project", text: "Tell us what you need and we reply with how we would build it.", href: "/contact#enquiry", link: "Send an enquiry" },
  { name: "Dedicated developers", text: "Developers who work only on your product, billed monthly or by the hour.", href: "/services/dedicated-team", link: "Hire a dedicated team" },
];

export default function ServicesPage() {
  return (
    <>
      <ServiceHero
        h1="Custom software development services"
        lead="Hicaso is a custom software development company in India. We build AI, mobile and web software for clients worldwide, and run it after launch."
        secondary={{ label: "See our products", href: "/products" }}
        fragment={HERO}
        label="A client asking Hicaso whether one team can build an AI feature and a mobile app together"
        piece="ly-piece--chat"
      />
      <section className="section" id="services" style={{ "--h": 2 } as React.CSSProperties} aria-labelledby="services-h">
        <div className="wrap">
          <div className="grid fill">
            <div className="span-5 stack-5">
              <h2 id="services-h">Services, from first prototype to production</h2>
              <p className="t-lead">Pick one, or combine them. The team that builds our own products builds yours.</p>
              {/* one row per group (src/data/services.ts SERVICE_GROUPS): every service, each with its own page */}
              <ul className="rows">
                {SERVICE_GROUPS.map((g) => (
                  <li key={g} id={groupId(g)}>
                    <span className="rows__name">{g}</span>
                    <p className="link-list">
                      {services
                        .filter((s) => s.group === g)
                        .map((s) => (
                          <a key={s.slug} className="link" href={`/services/${s.slug}`}>{s.name}</a>
                        ))}
                    </p>
                  </li>
                ))}
              </ul>
              <TechLinks items={technologies} />
            </div>
            <div className="panel frame--fill span-6 start-7" data-icon-base="/assets/icons/">
              <div className="dg" data-diagram="">
                <script type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SPEC) }} />
              </div>
            </div>
          </div>
          {/* marquee-row (dealt moment): the formats we deliver, real words from the services data */}
          <div className="mo-host" data-moment="marquee-row" data-moment-opts='{"speed": 36}'>
            <ul className="mo-mq__track">
              {FORMATS.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="section" id="how-we-work" style={{ "--h": 1 } as React.CSSProperties} aria-labelledby="how-h">
        <div className="wrap">
          <div className="grid">
            <div className="span-6 stack-5">
              <h2 id="how-h">How we work, from first message to launch</h2>
              <ol className="rows">
                {STEPS.map((st) => (
                  <li key={st.name}>
                    <span className="rows__name">{st.name}</span>
                    <p>{st.text}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="span-5 start-8 stack-5">
              <h3 className="t-h3">Two ways to work with us</h3>
              <ul className="rows">
                {MODELS.map((m) => (
                  <li key={m.name}>
                    <span className="rows__name">{m.name}</span>
                    <p>{m.text}</p>
                    <p>
                      <a className="link" href={m.href}>{m.link}</a>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
