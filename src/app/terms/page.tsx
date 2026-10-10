import type { Metadata } from "next";
import styles from "@/styles/page.module.css";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms & Conditions — Hicaso",
  description: "Terms for using the hicaso.com website.",
};

export default function TermsConditionsPage() {
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <h1 className="t-display">Terms &amp; Conditions</h1>
          <p className="t-subhead">Last updated: October 2026 · Hicaso LLP</p>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <div className={styles.prose}>
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing or using the hicaso.com website provided by Hicaso LLP
              (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;), you agree to be bound by
              these Terms and Conditions. If you disagree with any part of these terms, you may not
              access the website. Each Hicaso product is governed by its own terms of service,
              published on that product&apos;s website.
            </p>

            <h2>2. Intellectual Property</h2>
            <p>
              All website content, branding and proprietary materials remain the exclusive
              property of Hicaso LLP.
            </p>

            <h2>3. User Obligations &amp; Conduct</h2>
            <p>
              Users agree not to engage in any activity that interferes with or disrupts the
              integrity, security, or performance of our website or hosted server environments.
            </p>

            <h2>4. Limitation of Liability</h2>
            <p>
              In no event shall Hicaso LLP, its partners, employees, or agents be liable for
              indirect, incidental, special, consequential, or punitive damages arising from the
              use of or inability to use our digital channels.
            </p>

            <h2>5. Governing Law &amp; Contact</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of India. For
              legal inquiries regarding these terms, please contact us at{" "}
              <a href="mailto:hello@hicaso.com">hello@hicaso.com</a>.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
