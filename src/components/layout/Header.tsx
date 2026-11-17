import React from "react";
import Logo from "../ui/Logo";
import { products } from "@/data/products";
import { SERVICE_GROUPS, services } from "@/data/services";
import { technologies } from "@/data/technologies";

// Kit nav-mega markup. The menu opens on hover/focus and the phone sheet is wired by /assets/system.js.
const blurb: Record<string, string> = {
  appkavo: "Security audit for mobile apps",
  billminute: "Invoices in under a minute",
};

const Chev = () => (
  <svg className="chev" viewBox="0 0 12 12" aria-hidden="true">
    <path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Header: React.FC<{ blog?: boolean }> = ({ blog = false }) => (
  <header className="nav">
    <div className="wrap nav__bar">
      <a className="skip-link" href="#top">Skip to content</a>
      <Logo />
      <nav className="nav__links" aria-label="Main">
        <div className="nav__item">
          <a className="nav__link" href="/services">Services <Chev /></a>
          <div className="nav__menu">
            <div className="wrap grid">
              {SERVICE_GROUPS.map((g) => (
                <div key={g} className="menu-col span-3">
                  <p className="t-label">{g}</p>
                  {services.filter((s) => s.group === g).map((s) => (
                    <a key={s.slug} href={`/services/${s.slug}`}>{s.name}</a>
                  ))}
                  {g === SERVICE_GROUPS[SERVICE_GROUPS.length - 1] ? <a href="/services">All services</a> : null}
                </div>
              ))}
              <div className="menu-col span-3">
                <p className="t-label">Technologies</p>
                {technologies.map((t) => (
                  <a key={t.slug} href={`/technologies/${t.slug}`}>{t.name}</a>
                ))}
              </div>
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
        {blog ? <div className="nav__item"><a className="nav__link" href="/blog">Blog</a></div> : null}
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
