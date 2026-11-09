import type { Metadata } from "next";
import ServiceHero from "@/components/services/ServiceHero";
import { chat } from "@/components/services/fragments";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services — Hicaso",
  description: "Generative AI, agentic AI, mobile and web software, built with clients worldwide.",
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

const LINKS: Record<string, string> = {
  "generative-ai": "See generative AI",
  "agentic-ai": "See agentic AI",
  "mobile-app-development": "See mobile apps",
  "web-development": "See web development",
};

export default function ServicesPage() {
  return (
    <>
      <ServiceHero
        h1="Software services for global teams"
        lead="Hicaso is a software company in India. We build generative AI, agentic AI, mobile and web software for clients worldwide."
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
              <ul className="rows">
                {services.map((s) => (
                  <li key={s.slug}>
                    <span className="rows__name">{s.name}</span>
                    <span className="rows__value">
                      <a className="ly-link" href={`/services/${s.slug}`}>
                        {LINKS[s.slug]}
                      </a>
                    </span>
                    <p>{s.tagline}</p>
                  </li>
                ))}
              </ul>
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
    </>
  );
}
