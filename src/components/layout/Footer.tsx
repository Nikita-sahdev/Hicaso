import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";
import Container from "../ui/Container";
import LinkButton from "../ui/LinkButton";
import { products } from "@/data/products";
import { services } from "@/data/services";

const columns = [
  {
    title: "Services",
    links: services.map((s) => ({ label: s.name, href: `/services/${s.slug}` })),
  },
  {
    title: "Products",
    links: products.map((p) => ({ label: p.name, href: `/products/${p.slug}` })),
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "hello@hicaso.com", href: "mailto:hello@hicaso.com" },
      { label: "+91 70091 37936", href: "tel:+917009137936" },
    ],
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <h2 className="t-heading-sm">Have a project in mind?</h2>
          <LinkButton href="/contact" variant="filled">
            Start a project
          </LinkButton>
        </div>
        <div className={styles.columns}>
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className={`t-eyebrow ${styles.heading}`}>{col.title}</h2>
              <ul className={styles.list}>
                {col.links.map((l) => (
                  <li key={l.href}>
                    {l.href.startsWith("/") ? (
                      <Link href={l.href}>{l.label}</Link>
                    ) : (
                      <a href={l.href}>{l.label}</a>
                    )}
                  </li>
                ))}
                {col.title === "Contact" && (
                  <>
                    <li>2646, Sector 52, Lig Housing Board, Sector 36 (Chandigarh)</li>
                    <li>Mon–Fri, 9:00 AM–6:00 PM IST</li>
                  </>
                )}
              </ul>
            </div>
          ))}
        </div>
        <p className={styles.fine}>© {new Date().getFullYear()} Hicaso LLP</p>
      </Container>
    </footer>
  );
};

export default Footer;
