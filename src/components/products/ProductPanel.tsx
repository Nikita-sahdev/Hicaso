import React from "react";
import Image from "next/image";
import styles from "./ProductPanel.module.css";
import LinkButton from "../ui/LinkButton";
import { themeStyle } from "./themeStyle";
import { domainOf, type Product } from "@/data/products";

interface ProductPanelProps {
  product: Product;
}

// A large card in the product's own colors (home page product grid).
export const ProductPanel: React.FC<ProductPanelProps> = ({ product }) => {
  const titleId = `${product.slug}-title`;
  return (
    <article className={styles.card} style={themeStyle(product)} aria-labelledby={titleId}>
      <h3 id={titleId} className={`t-heading-sm ${styles.name}`}>
        {product.name}
      </h3>
      {product.status === "beta" && <p className={styles.status}>Beta</p>}
      <p className={styles.tagline}>{product.tagline}</p>
      <p className={styles.audience}>{product.audience}</p>
      <div className={styles.actions}>
        <LinkButton href={`/products/${product.slug}`}>Learn more</LinkButton>
        <LinkButton href={product.url} variant="text">
          Visit {domainOf(product)}
        </LinkButton>
      </div>
      {product.screenshot && (
        <Image
          src={product.screenshot.src}
          width={product.screenshot.width}
          height={product.screenshot.height}
          alt={`${product.name} app screen`}
          sizes="(min-width: 900px) 560px, 100vw"
          className={styles.shot}
        />
      )}
    </article>
  );
};

export default ProductPanel;
