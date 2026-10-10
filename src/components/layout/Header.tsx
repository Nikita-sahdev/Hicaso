"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import styles from "./Header.module.css";
import Container from "../ui/Container";
import Logo from "../ui/Logo";
import { products } from "@/data/products";

const links = [
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const productsButtonRef = useRef<HTMLButtonElement>(null);

  // Products menu: close on Escape or a click outside it.
  useEffect(() => {
    if (!productsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProductsOpen(false);
        productsButtonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!productsRef.current?.contains(e.target as Node)) setProductsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [productsOpen]);

  const close = () => {
    setMobileOpen(false);
    setProductsOpen(false);
  };

  const linkClass = (href: string) =>
    `${styles.link} ${pathname.startsWith(href) ? styles.active : ""}`;

  return (
    <header className={styles.header}>
      <Container wide className={styles.bar}>
        <Logo />

        <nav className={styles.desktopNav} aria-label="Main">
          <div className={styles.products} ref={productsRef}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setProductsOpen(false);
          }}
        >
            <button
              ref={productsButtonRef}
              type="button"
              className={linkClass("/products")}
              aria-expanded={productsOpen}
              aria-controls="products-menu"
              onClick={() => setProductsOpen((open) => !open)}
            >
              Products <ChevronDown size={12} aria-hidden="true" />
            </button>
            {productsOpen && (
              <div id="products-menu" className={styles.menu}>
                {products.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className={styles.menuItem}
                    onClick={close}
                  >
                    <span className={styles.menuName}>{p.name}</span>
                    <span className={styles.menuTagline}>{p.tagline}</span>
                  </Link>
                ))}
                <Link href="/products" className={styles.menuAll} onClick={close}>
                  All products
                </Link>
              </div>
            )}
          </div>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

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
          <Link href="/products" className={styles.mobileLink} onClick={close}>
            Products
          </Link>
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className={styles.mobileSubLink}
              onClick={close}
            >
              {p.name}
            </Link>
          ))}
          {links.map((l) => (
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
