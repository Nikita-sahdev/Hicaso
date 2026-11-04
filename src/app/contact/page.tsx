import type { Metadata } from "next";
import styles from "@/styles/page.module.css";
import layout from "./contact.module.css";
import Container from "@/components/ui/Container";
import EnquiryForm from "@/components/contact/EnquiryForm";
import { services } from "@/data/services";
import { resolveService } from "@/lib/enquiry";

export const metadata: Metadata = {
  title: "Contact — Hicaso",
  description:
    "Tell Hicaso about your project: AI, mobile or web. Email, phone and address in Chandigarh, India.",
};

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const initialService = resolveService(
    (await searchParams).service,
    services.map((s) => s.slug),
  );
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <h1 className="t-display">Let&apos;s talk about your project.</h1>
          <p className="t-subhead">Tell us what you want to build.</p>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <div className={layout.grid}>
            <EnquiryForm
              services={services.map(({ slug, name }) => ({ slug, name }))}
              initialService={initialService}
            />
            <dl className={`${layout.facts} ${styles.facts}`}>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href="mailto:hello@hicaso.com">hello@hicaso.com</a>
                </dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  <a href="tel:+917009137936">+91 70091 37936</a>
                </dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>2646, Sector 52, Lig Housing Board, Sector 36 (Chandigarh)</dd>
              </div>
              <div>
                <dt>Hours</dt>
                <dd>Mon–Fri, 9:00 AM–6:00 PM IST</dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>
    </>
  );
}
