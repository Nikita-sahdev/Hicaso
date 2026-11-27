import { products } from "@/data/products";
import { FRAMES } from "../products/fragments";
import ProductTabsMotion from "./ProductTabsMotion";

// app-frame (sections-library.md): each product as one app window across the .wrap, its list beside the
// open item, kit fragments (window, diff-review, doc) rewritten to the product's own subject. Two click
// tabs (system.js tabs: role=tablist, aria-controls) swap AppKavo and BillMinute; the open pane is the
// frame's one loop.

// BillMinute opens first: the hero already shows AppKavo's findings window
const OPEN = "billminute";

export default function Products() {
  return (
    <section className="section" id="products" aria-labelledby="products-h">
      <div className="wrap">
        <div className="grid">
          <h2 id="products-h" className="span-5">
            Two products we build and run
          </h2>
          <div className="span-6 start-7 stack-5">
            <p>
              AppKavo audits mobile app builds for security issues and store rejections. BillMinute sends invoices in
              your client&rsquo;s currency. Both run on the stack we use for clients.{" "}
              <a className="link" href="/products">
                See our products
              </a>
            </p>
            <div className="tabs" role="tablist" aria-label="Products">
              {products.map((p) => (
                <button
                  key={p.slug}
                  className="tab"
                  type="button"
                  role="tab"
                  id={`tab-${p.slug}`}
                  aria-selected={p.slug === OPEN}
                  aria-controls={`app-${p.slug}`}
                  tabIndex={p.slug === OPEN ? 0 : -1}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        {products.map((p) => {
          const f = FRAMES[p.slug];
          return (
            <div key={p.slug} className="fill app-tab" role="tabpanel" id={`app-${p.slug}`} aria-labelledby={`tab-${p.slug}`} hidden={p.slug !== OPEN}>
              <div className="ui app" role="img" aria-label={f.label} data-ui-pause-host="">
                <div className="app__pane app__pane--list" dangerouslySetInnerHTML={{ __html: f.list }} />
                <div className="app__pane app__pane--open" data-ui-loop="" dangerouslySetInnerHTML={{ __html: f.open }} />
              </div>
            </div>
          );
        })}
      </div>
      {/* the opening app window comes into focus on a tab switch (GSAP) */}
      <ProductTabsMotion />
    </section>
  );
}
