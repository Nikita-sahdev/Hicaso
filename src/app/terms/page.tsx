import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions — Hicaso",
  description: "Terms for using the hicaso.com website.",
};

export default function TermsConditionsPage() {
  return (
    <LegalPage
      h1="Terms and conditions of the Hicaso software studio"
      lead="The terms for using hicaso.com, provided by Hicaso LLP. Last updated: November 2026."
      facts={[["Each product has its own terms of service", "Published on that product's website"], ["Client work follows the client agreement", "It takes precedence over these terms"], ["Governed by the laws of India", "Legal questions go to hello@hicaso.com"]]}
      label="Three facts from these terms: each product has its own terms, client work follows the client agreement, and the laws of India govern"
      closeTitle="Questions about these terms"
      closeLine="For legal inquiries regarding these terms, write to us."
      parts={[
        {
          id: "agreement",
          heading: "1. Agreement to Terms",
          body: (
            <>
              <p>
                By accessing or using the hicaso.com website provided by Hicaso LLP
                (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;), you agree to be bound by
                these Terms and Conditions. If you disagree with any part of these terms, you may not
                access the website. Each Hicaso product is governed by its own terms of service,
                published on that product&apos;s website.
              </p>
              <p>
                Software we build for clients is governed by the agreement signed with each client,
                which takes precedence over these terms for that work.
              </p>
            </>
          ),
        },
        {
          id: "ip",
          heading: "2. Intellectual Property",
          body: (
            <p>
              All website content, branding and proprietary materials remain the exclusive
              property of Hicaso LLP.
            </p>
          ),
        },
        {
          id: "conduct",
          heading: "3. User Obligations & Conduct",
          body: (
            <p>
              Users agree not to engage in any activity that interferes with or disrupts the
              integrity, security, or performance of our website or hosted server environments.
            </p>
          ),
        },
        {
          id: "liability",
          heading: "4. Limitation of Liability",
          body: (
            <p>
              In no event shall Hicaso LLP, its partners, employees, or agents be liable for
              indirect, incidental, special, consequential, or punitive damages arising from the
              use of or inability to use our digital channels.
            </p>
          ),
        },
        {
          id: "law",
          heading: "5. Governing Law & Contact",
          body: (
            <p>
              These terms are governed by and construed in accordance with the laws of India. For
              legal inquiries regarding these terms, please contact us at{" "}
              <a className="link" href="mailto:hello@hicaso.com">hello@hicaso.com</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
