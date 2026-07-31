import React from "react";
import styles from "./Footer.module.css";
import Container from "../ui/Container";
import Logo from "../ui/Logo";
import Link from "next/link";
import { Mail, Phone, MapPin, Linkedin, Twitter, Dribbble, Instagram } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.topGrid}>
          {/* Col 1 */}
          <div className={styles.brandCol}>
            <Logo className={styles.logo} />
            <p className={styles.brandDesc}>
              Building ideas. Delivering solutions. Growing together.
            </p>
          </div>

          {/* Col 2 */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <ul className={styles.linksList}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/work">Our Work</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Services</h4>
            <ul className={styles.linksList}>
              <li><Link href="/services/web-development">Web Development</Link></li>
              <li><Link href="/services/mobile-development">Mobile Development</Link></li>
              <li><Link href="/services/cloud-solutions">Cloud Solutions</Link></li>
              <li><Link href="/services/digital-consulting">Digital Consulting</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Company</h4>
            <ul className={styles.linksList}>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Col 5 */}
          <div className={styles.contactCol}>
            <h4 className={styles.colTitle}>Contact</h4>
            <ul className={styles.contactList}>
              <li>
                <Mail size={16} className={styles.contactIcon} />
                <a href="mailto:hello@hicaso.com">hello@hicaso.com</a>
              </li>
              <li>
                <Phone size={16} className={styles.contactIcon} />
                <a href="tel:+917009137936">+91 70091 37936</a>
              </li>
              <li>
                <MapPin size={16} className={styles.contactIcon} />
                <span>2646, Sector 52, Lig Housing Board, Sector 36 (Chandigarh)</span>
              </li>
            </ul>
            <div className={styles.socialsRow}>
              <a href="#" aria-label="LinkedIn" className={styles.socialIcon}><Linkedin size={16} /></a>
              <a href="#" aria-label="Twitter" className={styles.socialIcon}><Twitter size={16} /></a>
              <a href="#" aria-label="Dribbble" className={styles.socialIcon}><Dribbble size={16} /></a>
              <a href="#" aria-label="Instagram" className={styles.socialIcon}><Instagram size={16} /></a>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Hicaso LLP. All Rights Reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
