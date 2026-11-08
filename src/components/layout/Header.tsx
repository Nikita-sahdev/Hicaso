"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import styles from "./Header.module.css";
import Container from "../ui/Container";
import Logo from "../ui/Logo";
import LinkButton from "../ui/LinkButton";
import { products } from "@/data/products";
import { services } from "@/data/services";
import { ENQUIRY_TO } from "@/lib/enquiry";

type MenuName = "services" | "products";

const links = [
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
];

// Desktop shows Contact as the filled pill; the mobile list includes it as a link.
const mobileLinks = [...links, { label: "Contact", href: "/contact" }];

const menus: {
  name: MenuName;
  label: string;
  base: string;
  allLabel: string;
  items: { slug: string; name: string }[];
}[] = [
  { name: "services", label: "Services", base: "/services", allLabel: "All services", items: services },
  { name: "products", label: "Products", base: "/products", allLabel: "All products", items: products },
];

// Hover only applies to a real mouse: touch fires pointerenter too, then click would toggle it shut.
const onMouse = (fn: () => void) => (e: React.PointerEvent) => {
  if (e.pointerType === "mouse") fn();
};

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuName | null>(null);
  const [mobileSection, setMobileSection] = useState<MenuName | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const buttonRefs = useRef<Record<MenuName, HTMLButtonElement | null>>({ services: null, products: null });

  // Anything open: close on Escape (refocus what opened it) or a pointer-down outside the header.
  useEffect(() => {
    if (!openMenu && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      (openMenu ? buttonRefs.current[openMenu] : toggleRef.current)?.focus();
      setOpenMenu(null);
      setMobileOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current?.contains(e.target as Node)) return;
      setOpenMenu(null);
      setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openMenu, mobileOpen]);

  // Route changes close menus via `close` on every link click.
  const close = () => {
    setMobileOpen(false);
    setOpenMenu(null);
  };

  const linkClass = (href: string) =>
    `${styles.link} ${pathname.startsWith(href) ? styles.active : ""}`;

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${openMenu || mobileOpen ? styles.headerOpen : ""}`}
      onPointerLeave={onMouse(() => setOpenMenu(null))}
    >
      <Container className={styles.bar}>
        <Logo />

        <nav className={styles.desktopNav} aria-label="Main">
          {menus.map((m) => (
            <div
              key={m.name}
              onPointerEnter={onMouse(() => setOpenMenu(m.name))}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                  setOpenMenu((cur) => (cur === m.name ? null : cur));
                }
              }}
            >
              <button
                ref={(el) => {
                  buttonRefs.current[m.name] = el;
                }}
                type="button"
                className={linkClass(m.base)}
                aria-expanded={openMenu === m.name}
                aria-controls={`${m.name}-menu`}
                onClick={() => setOpenMenu((cur) => (cur === m.name ? null : m.name))}
              >
                {m.label}
                <ChevronDown size={12} className={styles.chevron} aria-hidden="true" />
                <span className={styles.caret} aria-hidden="true" />
              </button>
              {/* Always mounted so it can fade out. preventDefault keeps focus in the wrapper so Safari's blur can't close the menu before a click lands */}
              <div
                id={`${m.name}-menu`}
                className={`${styles.panel} ${openMenu === m.name ? styles.panelOpen : ""}`}
                onMouseDown={(e) => e.preventDefault()}
              >
                <Container>
                  <div className={styles.panelInner}>
                    <span className={styles.panelTitle}>{m.label}</span>
                    <div className={styles.panelLinks}>
                      {m.items.map((item) => (
                        <Link
                          key={item.slug}
                          href={`${m.base}/${item.slug}`}
                          className={styles.link}
                          onClick={close}
                        >
                          {item.name}
                        </Link>
                      ))}
                      <Link href={m.base} className={`${styles.link} ${styles.active}`} onClick={close}>
                        {m.allLabel}
                      </Link>
                    </div>
                  </div>
                </Container>
              </div>
            </div>
          ))}
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={linkClass(l.href)}
              onPointerEnter={onMouse(() => setOpenMenu(null))}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className={`${styles.cta} ${mobileOpen ? styles.ctaOpen : ""}`} onClick={close}>
          <LinkButton href="/contact" variant="filled">
            Start a project
          </LinkButton>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className={styles.toggle}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </Container>

      <nav
        id="mobile-menu"
        className={`${styles.mobileNav} ${mobileOpen ? styles.mobileNavOpen : ""}`}
        aria-label="Mobile"
      >
        <div className={styles.mobileList}>
          {menus.map((m) => (
            <div key={m.name}>
              <button
                type="button"
                className={styles.mobileLink}
                aria-expanded={mobileSection === m.name}
                aria-controls={`${m.name}-mobile`}
                onClick={() => setMobileSection((cur) => (cur === m.name ? null : m.name))}
              >
                {m.label}
                <ChevronDown size={20} className={styles.chevron} aria-hidden="true" />
              </button>
              <div
                id={`${m.name}-mobile`}
                className={`${styles.mobileSub} ${mobileSection === m.name ? styles.mobileSubOpen : ""}`}
              >
                <div className={styles.mobileSubInner}>
                  {m.items.map((item) => (
                    <Link
                      key={item.slug}
                      href={`${m.base}/${item.slug}`}
                      className={styles.mobileSubLink}
                      onClick={close}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link href={m.base} className={styles.mobileSubLink} onClick={close}>
                    {m.allLabel}
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {mobileLinks.map((l) => (
            <Link key={l.href} href={l.href} className={styles.mobileLink} onClick={close}>
              {l.label}
            </Link>
          ))}
        </div>
        <p className={styles.mobileContact}>
          <span>Email us</span>
          <a href={`mailto:${ENQUIRY_TO}`}>{ENQUIRY_TO}</a>
        </p>
      </nav>
    </header>
  );
};

export default Header;
