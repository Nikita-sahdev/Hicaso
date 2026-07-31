"use client";

import React from "react";
import styles from "../privacy/legal.module.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import { motion } from "framer-motion";

export default function TermsConditionsPage() {
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
              <h1 className={styles.title}>Terms & Conditions</h1>
              <p className={styles.subtitle}>
                Last updated: January 2026 • Hicaso LLP
              </p>
            </motion.div>
          </Container>
        </section>

        {/* Terms Content */}
        <section className={styles.section}>
          <Container>
            <motion.div
              className={styles.contentCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={styles.block}>
                <h2 className={styles.heading}>1. Agreement to Terms</h2>
                <p className={styles.paragraph}>
                  By accessing or using the website and services provided by Hicaso LLP (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;), you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our services.
                </p>
              </div>

              <div className={styles.block}>
                <h2 className={styles.heading}>2. Professional Services & Intellectual Property</h2>
                <p className={styles.paragraph}>
                  All software code, designs, graphics, and documentation produced by Hicaso LLP under client master service agreements shall be governed by specific contractual project statements of work (SOW). All website branding and proprietary materials remain the exclusive property of Hicaso LLP.
                </p>
              </div>

              <div className={styles.block}>
                <h2 className={styles.heading}>3. User Obligations & Conduct</h2>
                <p className={styles.paragraph}>
                  Users agree not to engage in any activity that interferes with or disrupts the integrity, security, or performance of our website or hosted server environments.
                </p>
              </div>

              <div className={styles.block}>
                <h2 className={styles.heading}>4. Limitation of Liability</h2>
                <p className={styles.paragraph}>
                  In no event shall Hicaso LLP, its partners, employees, or agents be liable for indirect, incidental, special, consequential, or punitive damages arising from the use of or inability to use our digital channels.
                </p>
              </div>

              <div className={styles.block}>
                <h2 className={styles.heading}>5. Governing Law & Contact</h2>
                <p className={styles.paragraph}>
                  These terms are governed by and construed in accordance with the laws of India. For legal inquiries regarding these terms, please contact us at <strong>hello@hicasollp.com</strong>.
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
