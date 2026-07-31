"use client";

import React, { useState, useEffect } from "react";
import styles from "./Header.module.css";
import Container from "../ui/Container";
import Logo from "../ui/Logo";
import Button from "../ui/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About Us", href: "/about" },
    { label: "Our Work", href: "/work" },
    { label: "Careers", href: "/careers" },
    { label: "Contact Us", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <Container className={styles.container}>
        <Logo />

        {/* Desktop Nav */}
        <nav className={styles.desktopNav}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`${styles.navLink} ${isActive(link.href) ? styles.activeLink : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.ctaWrapper}>
          <Button variant="primary" className={styles.headerButton}>
            Get in Touch
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className={styles.mobileToggle}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </Container>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className={styles.mobileNavOverlay}>
          <nav className={styles.mobileNav}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`${styles.mobileNavLink} ${isActive(link.href) ? styles.activeMobileLink : ""}`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button
              variant="primary"
              className={styles.mobileCta}
              onClick={() => setIsOpen(false)}
            >
              Get in Touch
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
