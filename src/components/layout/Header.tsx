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
  items: { slug: string; name: string; eyebrow?: string; tagline: string }[];
}[] = [
  { name: "services", label: "Services", base: "/services", allLabel: "All services", items: services },
  { name: "products", label: "Products", base: "/products", allLabel: "All products", items: products },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuName | null>(null);
  const wrapperRefs = useRef<Record<MenuName, HTMLDivElement | null>>({ services: null, products: null });
  const buttonRefs = useRef<Record<MenuName, HTMLButtonElement | null>>({ services: null, products: null });

  // Open menu: close on Escape (refocus its button) or a pointer-down outside it.
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        buttonRefs.current[openMenu]?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!wrapperRefs.current[openMenu]?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openMenu]);

  // Route changes close menus via `close` on every link click.
  const close = () => {
    setMobileOpen(false);
    setOpenMenu(null);
  };

  const linkClass = (href: string) =>
    `${styles.link} ${pathname.startsWith(href) ? styles.active : ""}`;

  return (
    <header className={styles.header}>
      <Container className={styles.bar}>
        <Logo />

        <nav className={styles.desktopNav} aria-label="Main">
          {menus.map((m) => (
            <div
              key={m.name}
              className={`${styles.menuWrap} ${m.name === "products" ? styles.alignRight : ""}`}
              ref={(el) => {
                wrapperRefs.current[m.name] = el;
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenMenu(null);
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
                {m.label} <ChevronDown size={12} aria-hidden="true" />
              </button>
              {openMenu === m.name && (
                // preventDefault keeps focus in the wrapper so Safari's blur can't close the menu before a click lands
                <div id={`${m.name}-menu`} className={styles.menu} onMouseDown={(e) => e.preventDefault()}>
                  {m.items.map((item) => (
                    <Link
                      key={item.slug}
                      href={`${m.base}/${item.slug}`}
                      className={styles.menuItem}
                      onClick={close}
                    >
                      {item.eyebrow && <span className={`t-eyebrow ${styles.menuEyebrow}`}>{item.eyebrow}</span>}
                      <span className={styles.menuName}>{item.name}</span>
                      <span className={styles.menuTagline}>{item.tagline}</span>
                    </Link>
                  ))}
                  <Link href={m.base} className={styles.menuAll} onClick={close}>
                    {m.allLabel}
                  </Link>
                </div>
              )}
            </div>
          ))}
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className={styles.cta}>
          <LinkButton href="/contact" variant="filled">
            Start a project
          </LinkButton>
        </div>

        <button
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

      {mobileOpen && (
        <nav id="mobile-menu" className={styles.mobileNav} aria-label="Mobile">
          {menus.map((m) => (
            <React.Fragment key={m.name}>
              <Link href={m.base} className={styles.mobileLink} onClick={close}>
                {m.label}
              </Link>
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
            </React.Fragment>
          ))}
          {mobileLinks.map((l) => (
            <Link key={l.href} href={l.href} className={styles.mobileLink} onClick={close}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
