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
    </>
  );
}
