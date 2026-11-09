import { products } from "@/data/products";
import { FRAMES } from "../products/fragments";

// app-frame (sections-library.md): each product as one app window across the .wrap, its list beside the
// open item, kit fragments (window, diff-review, doc) rewritten to the product's own subject. Two click
// tabs (system.js tabs: role=tablist, aria-controls) swap AppKavo and BillMinute; the open pane is the
// frame's one loop.

export default function Products() {
  return (
    <section className="section ground-surface" id="products" aria-labelledby="products-h">
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
              {products.map((p, i) => (
                <button
                  key={p.slug}
                  className="tab"
                  type="button"
                  role="tab"
                  id={`tab-${p.slug}`}
                  aria-selected={i === 0}
                  aria-controls={`app-${p.slug}`}
                  tabIndex={i === 0 ? 0 : -1}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        {products.map((p, i) => {
          const f = FRAMES[p.slug];
          return (
            <div key={p.slug} className="fill app-tab" role="tabpanel" id={`app-${p.slug}`} aria-labelledby={`tab-${p.slug}`} hidden={i > 0}>
              <div className="ui app" role="img" aria-label={f.label} data-ui-pause-host="">
                <div className="app__pane app__pane--list" dangerouslySetInnerHTML={{ __html: f.list }} />
                <div className="app__pane app__pane--open" data-ui-loop="" dangerouslySetInnerHTML={{ __html: f.open }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
