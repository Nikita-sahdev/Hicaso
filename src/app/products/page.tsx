import type { Metadata } from "next";
import ProductHero from "@/components/products/ProductHero";
import ProductPanel from "@/components/products/ProductPanel";
import { FRAMES } from "@/components/products/fragments";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Products — Hicaso",
  description: `Software built and run by Hicaso: ${products.map((p) => p.name).join(", ")}.`,
};

// hero (the dealt collage: AppKavo's window, a BillMinute invoice in the card) > both products as cards,
// the section that opens through iris-opens (the dealt moment); the cards' windows close the page (R5).
export default function ProductsPage() {
  return (
    <>
      <ProductHero
        h1="Mobile app security and invoicing software"
        lead="Hicaso builds and runs two products in India. AppKavo audits mobile apps before release, and BillMinute sends invoices in your client's currency."
        secondary={{ label: "See our services", href: "/services" }}
        windowHtml={FRAMES.appkavo.list}
        label="AppKavo's ranked findings for an iOS build, with a BillMinute invoice sent in euros"
        card={products[1].page.card}
      />
      <section
        className="section ground-surface"
        id="all-products"
        aria-labelledby="all-products-h"
        data-moment="iris-opens"
        data-moment-opts='{"from": "base"}'
      >
        <div className="wrap">
          <div className="section-head">
            <h2 id="all-products-h">AppKavo and BillMinute</h2>
            <p className="muted">Both are built and run by the team that builds software for clients.</p>
          </div>
          <div className="grid">
            {products.map((p) => (
              <ProductPanel key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
