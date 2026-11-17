import React from "react";
import Logo from "../ui/Logo";
import { products } from "@/data/products";
import { services } from "@/data/services";
import { ENQUIRY_TO } from "@/lib/enquiry";
import { BOOKING_URL, PHONE, PROFILES, SOCIAL, httpsLinks } from "@/lib/site";
import { SOCIAL_ICONS } from "./socialIcons";

const social = httpsLinks(SOCIAL);
const profiles = httpsLinks(PROFILES);
const booking = httpsLinks([{ url: BOOKING_URL }])[0]?.url;

// the footer names six services; the menu and /services list all of them
const FOOTER_SERVICES = ["generative-ai", "agentic-ai", "mobile-app-development", "web-development", "mvp-development", "dedicated-team"];

// Kit footer.closing: row 1 is the site-wide close (close--type), row 2 the footer-statement links.
const cols = (blog: boolean) => [
  { title: "Services", links: [{ label: "All services", href: "/services" }, ...FOOTER_SERVICES.map((slug) => services.find((s) => s.slug === slug)!).map((s) => ({ label: s.name, href: `/services/${s.slug}` }))] },
  { title: "Products", links: [{ label: "All products", href: "/products" }, ...products.map((p) => ({ label: p.name, href: `/products/${p.slug}` }))] },
  { title: "Company", links: [{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Careers", href: "/careers" }, ...(blog ? [{ label: "Blog", href: "/blog" }] : []), { label: "Contact", href: "/contact" }] },
  { title: "Legal", links: [{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }, { label: ENQUIRY_TO, href: `mailto:${ENQUIRY_TO}` }, { label: PHONE.display, href: `tel:${PHONE.tel}` }] },
];

// CC BY 2.0 needs the licence and the source linked: both URLs are the ones in public/assets/photos/credits.json
const SHIXART = {
  page: "https://commons.wikimedia.org/wiki/File:Hands_of_a_woman_typing_on_the_Macbook_keyboard_and_write_on_note_book.jpg",
  licenceUrl: "https://creativecommons.org/licenses/by/2.0",
};

export const Footer: React.FC<{ blog?: boolean }> = ({ blog = false }) => (
  <footer className="footer closing g2m footer--statement" id="contact" aria-labelledby="close-h">
    <div className="wrap">
      <div className="closing__cta close--type">
        <div className="section-head">
          <h2 id="close-h">AI, mobile and web software, built to order</h2>
          {/* the kit's close--type row holds one big button, so the booking link sits in the line */}
          <p>
            Tell us what you need built.{" "}
            {booking ? (
              <a className="link" href={booking} target="_blank" rel="noopener noreferrer">Book a free 30-minute call</a>
            ) : (
              "The first 30-minute call is free"
            )}
            .
          </p>
        </div>
        <a className="btn btn--primary btn--xl btn--wide" href="/contact">
          Start a project
          <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true"><path className="m-arrow__stem" d="M1 6h8" /><path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" /></svg>
        </a>
      </div>
      <div className="closing__links">
        <div className="grid">
          <div className="span-4 stack-4">
            <Logo />
            <p className="footer__lede">Hicaso builds AI, mobile and web software for companies.</p>
            {profiles.length ? (
              <p className="t-small">
                Reviews on{" "}
                {profiles.map((p, i) => (
                  <React.Fragment key={p.url}>
                    {i ? (i === profiles.length - 1 ? " and " : ", ") : ""}
                    <a className="link" href={p.url} target="_blank" rel="noopener noreferrer">{p.label}</a>
                  </React.Fragment>
                ))}
              </p>
            ) : null}
          </div>
          {cols(blog).map((col) => (
            <div key={col.title} className="span-2 footer__col">
              <h3>{col.title}</h3>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer__legal">
          <span>&copy; {new Date().getFullYear()} Hicaso LLP</span>
          {social.length ? (
            <div className="socials">
              {social.map((s) => (
                <a key={s.url} href={s.url} rel="noopener noreferrer" aria-label={`Hicaso on ${s.label}`}
                  dangerouslySetInnerHTML={{ __html: SOCIAL_ICONS[s.icon] }} />
              ))}
            </div>
          ) : null}
          {/* the one credit line from `photos.mjs credits` (three stand-in photographs on about, careers and contact); its list opens under it */}
          <details className="credits" data-slot="photo-credit">
            <summary>Photographs via Wikimedia Commons</summary>
            <p>
              Photographs by Parker Byrd and Markus Spiske (CC0) and{" "}
              <a className="link" href={SHIXART.page} rel="noopener noreferrer">Shixart1985</a> (
              <a className="link" href={SHIXART.licenceUrl} rel="noopener noreferrer">CC BY 2.0</a>), via Wikimedia Commons.
            </p>
          </details>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
