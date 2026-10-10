import styles from "@/styles/page.module.css";
import Container from "@/components/ui/Container";
import LinkButton from "@/components/ui/LinkButton";

export default function NotFound() {
  return (
    <section className={styles.hero}>
      <Container>
        <h1 className="t-display">Page not found.</h1>
        <p className="t-subhead">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div style={{ marginTop: 32 }}>
          <LinkButton href="/products">Explore products</LinkButton>
        </div>
      </Container>
    </section>
  );
}
