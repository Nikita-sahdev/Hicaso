import React from "react";
import Image from "next/image";
import styles from "./ProductPanel.module.css";
import Container from "../ui/Container";
import LinkButton from "../ui/LinkButton";
import { themeStyle } from "./themeStyle";
import { domainOf, type Product } from "@/data/products";

interface ProductPanelProps {
  product: Product;
}

export const ProductPanel: React.FC<ProductPanelProps> = ({ product }) => {
  const titleId = `${product.slug}-title`;
  return (
    <section className={styles.panel} style={themeStyle(product)} aria-labelledby={titleId}>
      <Container>
        <h2 id={titleId} className={`t-display ${styles.name}`}>
          {product.name}
        </h2>
        {product.status === "beta" && <p className={styles.status}>Beta</p>}
        <p className={`t-subhead ${styles.tagline}`}>{product.tagline}</p>
        <p className={styles.audience}>{product.audience}</p>
        <div className={styles.actions}>
          <LinkButton href={`/products/${product.slug}`}>Learn more</LinkButton>
          <LinkButton href={product.url} variant="outlined">
            Visit {domainOf(product)}
          </LinkButton>
        </div>
      </Container>
      {product.screenshot && (
        <Container wide>
          <Image
            src={product.screenshot.src}
            width={product.screenshot.width}
            height={product.screenshot.height}
            alt={`${product.name} app screen`}
            sizes="(min-width: 980px) 900px, 100vw"
            className={styles.shot}
          />
        </Container>
      )}
    </section>
  );
};

export default ProductPanel;
