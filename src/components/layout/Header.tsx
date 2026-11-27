import React from "react";
import Logo from "../ui/Logo";
import NavMotion from "./NavMotion";
import { products } from "@/data/products";
import { SERVICE_GROUPS, services } from "@/data/services";
import { technologies } from "@/data/technologies";
import { industries } from "@/data/industries";
import { proof, showProof } from "@/data/proof";
import { BOOKING_URL, httpsLinks } from "@/lib/site";

// Kit nav-mega markup in a floating card (owner's reference, 2026-11-24): a label over each column, each link a name
// and a short line, a grey side panel on the right. The menu opens on hover/focus (CSS), the phone sheet is wired by
// /assets/system.js, and NavMotion adds the GSAP motion (the sliding pill, the card and its rows).
const blurb: Record<string, string> = {
  appkavo: "Security audit for mobile apps",
  billminute: "Invoices in under a minute",
};

// a one-line version of each service's tagline for the menu (a new service falls back to its tagline)
const line: Record<string, string> = {
  "generative-ai": "Language models in your product",
  "agentic-ai": "Agents that finish multi-step work",
  "ai-chatbot-development": "Answers from your own data",
  "ai-automation": "Routine work between your tools",
  "ai-consulting": "Where AI fits, and what it takes",
  "mobile-app-development": "Android and iOS apps",
  "web-development": "Web apps, sites and backends",
  "mvp-development": "A first version, in front of users",
  "saas-development": "Subscription software, built and run",
  "ecommerce-development": "Shopify, WooCommerce or custom",
  "ui-ux-design": "App and web interfaces in Figma",
  "qa-testing": "Testing, security and store audits",
  "maintenance-support": "Fixes and updates for live apps",
  "app-modernization": "Older apps moved to a current stack",
  "cloud-devops": "Servers, deploys and backups",
  "dedicated-team": "Developers only on your product",
};

const BOOKING = httpsLinks([{ url: BOOKING_URL }])[0]?.url;

const Chev = () => (
  <svg className="chev" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Header: React.FC<{ blog?: boolean }> = ({ blog = false }) => (
  <header className="nav nav--card">
    <div className="wrap nav__bar">
      <a className="skip-link" href="#main">Skip to content</a>
      <Logo />
      <nav className="nav__links" aria-label="Main">
        <span className="nav__pill" aria-hidden="true" />
        <div className="nav__item">
          <a className="nav__link" href="/services">Services <Chev /></a>
          <div className="nav__menu">
            <div className="wrap">
              <div className="nav__card">
                {SERVICE_GROUPS.map((g) => (
                  <div key={g} className="menu-col">
                    <p className="t-label">{g}</p>
                    {services.filter((s) => s.group === g).map((s) => (
                      <a key={s.slug} href={`/services/${s.slug}`}>{s.name}<span>{line[s.slug] ?? s.tagline}</span></a>
                    ))}
                  </div>
                ))}
                <div className="nav__aside">
                  <div className="menu-col">
                    <p className="t-label">Industries</p>
                    {industries.map((i) => (
                      <a key={i.slug} href={`/industries/${i.slug}`}>{i.name}</a>
                    ))}
                  </div>
                  <div className="menu-col nav__tech">
                    <p className="t-label">Technologies</p>
                    {technologies.map((t) => (
                      <a key={t.slug} href={`/technologies/${t.slug}`}>{t.name}</a>
                    ))}
                  </div>
                  <div className="menu-col">
                    <a href="/services">All services</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="nav__item nav__item--sm">
          <a className="nav__link" href="/products">Products <Chev /></a>
          <div className="nav__menu">
            <div className="wrap">
              <div className="nav__card">
                <div className="menu-col">
                  <p className="t-label">Our products</p>
                  {products.map((p) => (
                    <a key={p.slug} href={`/products/${p.slug}`}>{p.name}<span>{blurb[p.slug] ?? p.tagline}</span></a>
                  ))}
                </div>
                <div className="nav__aside">
                  <div className="menu-col">
                    <p className="t-label">Get started</p>
                    <a href="/products">All products</a>
                    <a href="/contact">Start a project</a>
                    {BOOKING ? <a href={BOOKING} target="_blank" rel="noopener noreferrer">Book a free call</a> : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showProof(proof.demo) ? <div className="nav__item"><a className="nav__link" href="/case-studies">Case studies</a></div> : null}
        <div className="nav__item"><a className="nav__link" href="/about">About</a></div>
        <div className="nav__item"><a className="nav__link" href="/careers">Careers</a></div>
        {blog ? <div className="nav__item"><a className="nav__link" href="/blog">Blog</a></div> : null}
      </nav>
      <div className="nav__actions">
        {BOOKING ? (
          <a className="btn btn--secondary" href={BOOKING} target="_blank" rel="noopener noreferrer">Book a call</a>
        ) : null}
        <a className="btn btn--primary" href="/contact">Start a project</a>
      </div>
      <button className="nav__toggle" type="button" aria-expanded="false" aria-label="Menu">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 5h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      </button>
    </div>
    <NavMotion />
  </header>
);

export default Header;
