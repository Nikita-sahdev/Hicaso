import type { Metadata } from "next";
import styles from "@/styles/page.module.css";
import Container from "@/components/ui/Container";
import LinkButton from "@/components/ui/LinkButton";

export const metadata: Metadata = {
  title: "Contact — Hicaso",
  description: "Contact Hicaso LLP: email, phone and address in Chandigarh, India.",
};

export default function ContactPage() {
  return (
    <>
      <section className={styles.hero}>
        <Container>
          <h1 className="t-display">Contact</h1>
          <p className="t-subhead">Questions about Hicaso or one of our products? Write to us.</p>
          <div className={styles.actions}>
            <LinkButton href="mailto:hello@hicaso.com">Email us</LinkButton>
            <LinkButton href="tel:+917009137936" variant="text">
              Call +91 70091 37936
            </LinkButton>
          </div>
        </Container>
      </section>

      <section className={styles.section}>
        <Container>
          <dl className={`${styles.card} ${styles.facts}`}>
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
        </Container>
      </section>
    </>
  );
}
