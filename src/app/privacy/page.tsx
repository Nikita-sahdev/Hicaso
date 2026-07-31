"use client";

import React from "react";
import styles from "./legal.module.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className={styles.hero}>
          <Container>
            <motion.div
              className={styles.heroContent}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className={styles.badge}>Legal</Badge>
              <h1 className={styles.title}>Privacy Policy</h1>
              <p className={styles.subtitle}>
                Last updated: January 2026 • Hicaso LLP
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Policy Content */}
        <section className={styles.section}>
          <Container>
            <motion.div
              className={styles.contentCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={styles.block}>
                <h2 className={styles.heading}>1. Introduction</h2>
                <p className={styles.paragraph}>
                  At Hicaso LLP (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we respect your privacy and are committed to protecting the personal data you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or engage our consulting and software development services.
                </p>
              </div>

              <div className={styles.block}>
                <h2 className={styles.heading}>2. Information We Collect</h2>
                <p className={styles.paragraph}>
                  We collect information that you voluntarily provide to us when you fill out contact forms, request consultations, or communicate with us directly:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Personal identifiers (e.g., Name, Email Address, Phone Number).</li>
                  <li className={styles.listItem}>Professional details (e.g., Company Name, Job Title, Project Requirements).</li>
                  <li className={styles.listItem}>Technical data automatically collected (e.g., IP address, browser type, device information).</li>
                </ul>
              </div>

              <div className={styles.block}>
                <h2 className={styles.heading}>3. How We Use Your Information</h2>
                <p className={styles.paragraph}>
                  We use collected information for legitimate business purposes including:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>Responding to project inquiries and scheduling technical consultations.</li>
                  <li className={styles.listItem}>Delivering and managing enterprise software development agreements.</li>
                  <li className={styles.listItem}>Improving website user experience and security protocols.</li>
                  <li className={styles.listItem}>Complying with applicable legal obligations and industry standards.</li>
                </ul>
              </div>

              <div className={styles.block}>
                <h2 className={styles.heading}>4. Data Security</h2>
                <p className={styles.paragraph}>
                  We implement industry-standard administrative, physical, and technical security measures—including TLS encryption and strict access controls—to protect your personal information against unauthorized access, loss, or alteration.
                </p>
              </div>

              <div className={styles.block}>
                <h2 className={styles.heading}>5. Contact Us</h2>
                <p className={styles.paragraph}>
                  If you have questions or concerns regarding this Privacy Policy, please contact our data protection team at <strong>hello@hicasollp.com</strong>.
                </p>
              </div>
            </motion.div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}
