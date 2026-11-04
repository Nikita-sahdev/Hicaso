import styles from "@/styles/page.module.css";
import Container from "@/components/ui/Container";
import LinkButton from "@/components/ui/LinkButton";
import Eyebrow from "@/components/common/Eyebrow";

export default function NotFound() {
  return (
    <section className={styles.hero}>
      <Container>
        <Eyebrow>404</Eyebrow>
        <h1 className="t-display">Page not found.</h1>
        <p className="t-subhead">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className={styles.actions}>
          <LinkButton href="/">Home</LinkButton>
          <LinkButton href="/services" variant="light">Services</LinkButton>
          <LinkButton href="/products" variant="light">Products</LinkButton>
        </div>
      </Container>
    </section>
  );
}
