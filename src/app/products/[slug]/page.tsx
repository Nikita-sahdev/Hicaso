import type { Metadata } from "next";
import { notFound } from "next/navigation";
import styles from "./product.module.css";
import Container from "@/components/ui/Container";
import LinkButton from "@/components/ui/LinkButton";
import { themeStyle } from "@/components/products/themeStyle";
import { products, getProduct, domainOf } from "@/data/products";

// Only slugs from the data file exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = getProduct((await params).slug);
  if (!product) return {};
  return { title: `${product.name} — a Hicaso product`, description: product.tagline };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const domain = domainOf(product);

  return (
    <>
      <section className={styles.hero} style={themeStyle(product)}>
        <Container>
          <h1 className={`t-display ${styles.name}`}>{product.name}</h1>
          <p className={`t-subhead ${styles.tagline}`}>{product.tagline}</p>
          <p className={styles.audience}>{product.audience}</p>
          <div className={styles.actions}>
            <LinkButton href={product.url}>Visit {domain}</LinkButton>
            <LinkButton href="/products" variant="text">
              All products
            </LinkButton>
          </div>
        </Container>
      </section>

      <section className={styles.details}>
        <Container>
          <p className={`t-subhead ${styles.description}`}>{product.description}</p>
          <ul className={styles.highlights}>
            {product.highlights.map((h) => (
              <li key={h.title} className={styles.highlight}>
                <h2 className="t-subheading">{h.title}</h2>
                <p className={styles.highlightBody}>{h.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className={styles.closingSection}>
        <Container wide>
          <div className={styles.closing} style={themeStyle(product)}>
            <h2 className={`t-heading ${styles.name}`}>Ready to try {product.name}?</h2>
            <div className={styles.actions}>
              <LinkButton href={product.url}>Visit {domain}</LinkButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
