import { FRAMES } from "./fragments";
import { RISE } from "../services/content";
import type { Product } from "@/data/products";

// A product as a card on the index:  name, tagline, audience, two links, and
// the product's window in a panel (a kit fragment from ./fragments).
export default function ProductPanel({ product }: { product: Product }) {
  const titleId = `${product.slug}-title`;
  return (
    <article className="card card--row card--open span-6 m-nolift" aria-labelledby={titleId}>
      <h3 id={titleId}>
        <a href={`/products/${product.slug}`}>{product.name}</a>
      </h3>
      <p>
        {product.tagline} {product.audience}.
      </p>
      <div className="btn-row">
        <a className="btn btn--primary" href={`/products/${product.slug}`}>
          See {product.name}
        </a>
        <a className="btn btn--secondary" href={product.url} rel="noopener noreferrer">
          Try {product.name}
        </a>
      </div>
      <div className="panel" dangerouslySetInnerHTML={{ __html: RISE(FRAMES[product.slug].list, 520, "48px") }} />
    </article>
  );
}
