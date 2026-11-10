export default function NotFound() {
  return (
    <section className="section" aria-labelledby="nf-h">
      <div className="wrap">
        <div className="section-head stack-5">
          <h1 id="nf-h">Page not found</h1>
          <p className="t-lead">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
          <div className="btn-row">
            <a className="btn btn--primary" href="/">See the home page</a>
            <a className="btn btn--secondary" href="/services">See our services</a>
            <a className="btn btn--secondary" href="/products">See our products</a>
          </div>
        </div>
      </div>
    </section>
  );
}
