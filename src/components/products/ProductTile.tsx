import React from "react";
import Link from "next/link";
import styles from "./ProductTile.module.css";
import { themeStyle } from "./themeStyle";
import type { Product } from "@/data/products";

interface ProductTileProps {
  product: Product;
}

export const ProductTile: React.FC<ProductTileProps> = ({ product }) => {
  return (
    <Link href={`/products/${product.slug}`} className={styles.tile} style={themeStyle(product)}>
      <h2 className={`t-heading-sm ${styles.name}`}>{product.name}</h2>
      <p className={styles.tagline}>{product.tagline}</p>
      <span className={styles.more}>Learn more ›</span>
    </Link>
  );
};

export default ProductTile;
