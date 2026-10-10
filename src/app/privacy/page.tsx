import type { Metadata } from "next";
import styles from "@/styles/page.module.css";
import Container from "@/components/ui/Container";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Privacy Policy — Hicaso",
  description: "How Hicaso LLP handles personal data on hicaso.com.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <h1 className="t-display">Privacy Policy</h1>
          <p className="t-subhead">Last updated: October 2026 · Hicaso LLP</p>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <div className={styles.prose}>
            <h2>1. Introduction</h2>
            <p>
              At Hicaso LLP (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, or
              &quot;us&quot;), we respect your privacy and are committed to protecting the personal
              data you share with us. This Privacy Policy explains how we collect, use, disclose,
              and safeguard your information when you visit hicaso.com or contact us.
            </p>
            <p>
              Each Hicaso product has its own privacy policy, which applies when you use that
              product:
            </p>
            <ul>
              {products.map((p) => (
                <li key={p.slug}>
                  <a href={p.privacyUrl}>{p.name} Privacy Policy</a>
                </li>
              ))}
            </ul>

            <h2>2. Information We Collect</h2>
            <p>We collect information that you voluntarily provide when you contact us directly:</p>
            <ul>
              <li>Personal identifiers (e.g., Name, Email Address, Phone Number).</li>
              <li>Professional details (e.g., Company Name, Job Title).</li>
              <li>
                Technical data automatically collected (e.g., IP address, browser type, device
                information).
              </li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use collected information for legitimate business purposes including:</p>
            <ul>
              <li>Responding to inquiries and messages you send us.</li>
              <li>Reviewing work samples and job applications you send us.</li>
              <li>Improving website user experience and security protocols.</li>
              <li>Complying with applicable legal obligations and industry standards.</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement industry-standard administrative, physical, and technical security
              measures—including TLS encryption and strict access controls—to protect your personal
              information against unauthorized access, loss, or alteration.
            </p>

            <h2>5. Contact Us</h2>
            <p>
              If you have questions or concerns regarding this Privacy Policy, please contact us at{" "}
              <a href="mailto:hello@hicaso.com">hello@hicaso.com</a>.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
