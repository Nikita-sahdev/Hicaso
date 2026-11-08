import React from "react";
import Logo from "../ui/Logo";
import { products } from "@/data/products";
import { services } from "@/data/services";

// Kit nav-mega markup. The menu opens on hover/focus and the phone sheet is wired by /assets/system.js.
const blurb: Record<string, string> = {
  "generative-ai": "LLM features in your product",
  "agentic-ai": "Agents that finish the work",
  "mobile-app-development": "Android and iOS apps",
  "web-development": "Web apps and backends",
  appkavo: "Security audit for mobile apps",
  billminute: "Invoices in under a minute",
};

const Chev = () => (
  <svg className="chev" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const appkavo = products.find((p) => p.slug === "appkavo")!;

export const Header: React.FC = () => (
  <header className="nav">
    <div className="wrap nav__bar">
      <a className="skip-link" href="#top">Skip to content</a>
      <Logo />
      <nav className="nav__links" aria-label="Main">
        <div className="nav__item">
          <a className="nav__link" href="/services">Services <Chev /></a>
          <div className="nav__menu">
            <div className="wrap grid">
              <div className="menu-col span-3">
                <p className="t-label">Services</p>
                {services.slice(0, 2).map((s) => (
                  <a key={s.slug} href={`/services/${s.slug}`}>{s.name}<span>{blurb[s.slug]}</span></a>
                ))}
              </div>
              <div className="menu-col span-3">
                <p className="t-label">&nbsp;</p>
                {services.slice(2).map((s) => (
                  <a key={s.slug} href={`/services/${s.slug}`}>{s.name}<span>{blurb[s.slug]}</span></a>
                ))}
                <a href="/services">All services</a>
              </div>
              <a className="menu-card span-3 start-10" href={`/products/${appkavo.slug}`}>
                <div className="panel">
                  <div className="stage stage--fade-br">
                    <div className="at-corner">
                      <div className="ui ui-panel">
                        <div className="ui-head"><div className="ui-title">{appkavo.name}</div></div>
                        <p className="t-small muted">{blurb.appkavo}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="t-card">{appkavo.name}</span>
                <span className="t-small muted">{appkavo.audience}</span>
              </a>
            </div>
          </div>
        </div>
        <div className="nav__item">
          <a className="nav__link" href="/products">Products <Chev /></a>
          <div className="nav__menu">
            <div className="wrap grid">
              <div className="menu-col span-3">
                <p className="t-label">Products</p>
                {products.map((p) => (
                  <a key={p.slug} href={`/products/${p.slug}`}>{p.name}<span>{blurb[p.slug]}</span></a>
                ))}
                <a href="/products">All products</a>
              </div>
            </div>
          </div>
        </div>
        <div className="nav__item"><a className="nav__link" href="/about">About</a></div>
        <div className="nav__item"><a className="nav__link" href="/careers">Careers</a></div>
      </nav>
      <div className="nav__actions">
        <a className="btn btn--primary" href="/contact">Start a project</a>
      </div>
      <button className="nav__toggle" type="button" aria-expanded="false" aria-label="Menu">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 5h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      </button>
    </div>
  </header>
);

export default Header;
