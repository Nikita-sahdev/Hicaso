import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductHero from "@/components/products/ProductHero";
import ServiceFeatures from "@/components/services/ServiceFeatures";
import FAQ from "@/components/common/FAQ";
import { FRAMES, PANELS } from "@/components/products/fragments";
import { themeStyle } from "@/components/products/themeStyle";
import { RISE } from "@/components/services/content";
import { products, getProduct } from "@/data/products";

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

// hero > features > steps (iris-opens, the dealt moment) > faq > the product's open item. Every section
// carries the product's --p-* tokens, so its ground, ink, accent and buttons are the product's own.
export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const product = getProduct((await params).slug);
  if (!product) notFound();
  const theme = themeStyle(product);
  const { page, name } = product;
  const frame = FRAMES[product.slug];
  const cards = product.highlights.map((h, i) => ({ title: h.title, line: h.body, panel: PANELS[product.slug][i] }));

  return (
    <>
      <ProductHero
        h1={page.h1}
        lead={page.lead}
        secondary={{ label: `Try ${name}`, href: product.url, external: true }}
        windowHtml={frame.list}
        label={frame.label}
        card={page.card}
        theme={theme}
      />
      <ServiceFeatures title={`What ${name} does`} cards={cards} span="span-6" theme={theme} />
      <section
        className="section ground-surface"
        style={theme}
        id="steps"
        aria-labelledby="steps-h"
        data-moment="iris-opens"
        data-moment-opts='{"from": "base"}'
      >
        <div className="wrap">
          <div className="grid grid--top">
            <div className="span-5 section-head">
              <h2 id="steps-h">{page.stepsTitle}</h2>
              <p className="muted">{page.stepsLead}</p>
            </div>
            <ol className="rows span-6 start-7">
              {page.steps.map((s, i) => (
                <li key={s.title}>
                  <span className="rows__name">{s.title}</span>
                  <span className="rows__value">{i + 1}</span>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <FAQ items={page.faqs} title={`${name} questions`} theme={theme} />
      {/* R5: a text-only FAQ never closes <main>; the product's open item does. */}
      <section className="section ground-base" style={theme} id="window" aria-labelledby="window-h">
        <div className="wrap">
          <div className="grid fill">
            <div className="span-5 stack-5">
              <h2 id="window-h">{page.closeTitle}</h2>
              <p className="t-lead">{page.closeLine}</p>
            </div>
            <div className="panel frame--fill span-6 start-7" role="img" aria-label={frame.openLabel}>
              <div aria-hidden="true" dangerouslySetInnerHTML={{ __html: RISE(frame.open, 600, "40px") }} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
