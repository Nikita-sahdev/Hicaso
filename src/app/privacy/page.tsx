import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Privacy Policy — Hicaso",
  description: "How Hicaso LLP handles personal data on hicaso.com.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      h1="Privacy policy of the Hicaso software studio"
      lead="How Hicaso LLP handles personal data on hicaso.com. Last updated: November 2026."
      facts={[["The contact form sends nothing to our servers", "It opens your own email app"], ["Each product has its own privacy policy", "AppKavo and BillMinute"], ["Client work follows the client agreement", "It takes precedence over this policy"]]}
      label="Three facts from this policy: the contact form sends nothing to our servers, each product has its own policy, and client work follows the client agreement"
      closeTitle="Questions about this policy"
      closeLine="If you have questions or concerns regarding this Privacy Policy, write to us."
      parts={[
        {
          id: "intro",
          heading: "1. Introduction",
          body: (
            <>
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
                    <a className="link" href={p.privacyUrl}>{p.name} Privacy Policy</a>
                  </li>
                ))}
              </ul>
              <p>
                Software we build for clients is governed by the agreement signed with each client,
                which takes precedence over this policy for that work.
              </p>
              <p>
                The project enquiry form on our contact page does not send your details to our
                servers. It opens your own email app with a message addressed to hello@hicaso.com,
                and nothing is sent until you send that email.
              </p>
            </>
          ),
        },
        {
          id: "collect",
          heading: "2. Information We Collect",
          body: (
            <>
              <p>We collect information that you voluntarily provide when you contact us directly:</p>
              <ul>
                <li>Personal identifiers (e.g., Name, Email Address, Phone Number).</li>
                <li>Professional details (e.g., Company Name, Job Title).</li>
                <li>
                  Technical data automatically collected (e.g., IP address, browser type, device
                  information).
                </li>
              </ul>
            </>
          ),
        },
        {
          id: "use",
          heading: "3. How We Use Your Information",
          body: (
            <>
              <p>We use collected information for legitimate business purposes including:</p>
              <ul>
                <li>Responding to inquiries and messages you send us.</li>
                <li>Reviewing work samples and job applications you send us.</li>
                <li>Improving website user experience and security protocols.</li>
                <li>Complying with applicable legal obligations and industry standards.</li>
              </ul>
            </>
          ),
        },
        {
          id: "security",
          heading: "4. Data Security",
          body: (
            <p>
              We implement industry-standard administrative, physical, and technical security
              measures—including TLS encryption and strict access controls—to protect your personal
              information against unauthorized access, loss, or alteration.
            </p>
          ),
        },
        {
          id: "contact",
          heading: "5. Contact Us",
          body: (
            <p>
              If you have questions or concerns regarding this Privacy Policy, please contact us at{" "}
              <a className="link" href="mailto:hello@hicaso.com">hello@hicaso.com</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
