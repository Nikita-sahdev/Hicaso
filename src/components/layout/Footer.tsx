import React from "react";
import Link from "next/link";
import styles from "./Footer.module.css";
import Container from "../ui/Container";
import { products } from "@/data/products";

const columns = [
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
      <Container wide>
        <div className={styles.columns}>
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className={styles.heading}>{col.title}</h2>
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
                  <li>2646, Sector 52, Lig Housing Board, Sector 36 (Chandigarh)</li>
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
