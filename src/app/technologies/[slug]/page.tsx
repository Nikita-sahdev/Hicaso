import type { Metadata } from "next";
import { orgRef } from "@/lib/schema";
import { notFound } from "next/navigation";
import ServiceHero from "@/components/services/ServiceHero";
import StackIcons from "@/components/services/StackIcons";
import { content } from "@/components/services/content";
import HowWeWork from "@/components/common/HowWeWork";
import FAQ from "@/components/common/FAQ";
import { getService } from "@/data/services";
import { technologies, getTechnology } from "@/data/technologies";
import { siteFaqs } from "@/data/faqs";
import { SITE_URL, breadcrumbLd, ldJson } from "@/lib/site";

// A technology page borrows its parent service's hero fragment and tools diagram (src/components/services/content.ts):
// hero > the four steps > FAQ > uses beside the tools diagram, which closes the page on a visual (R5).
export const dynamicParams = false;

export function generateStaticParams() {
  return technologies.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/technologies/[slug]">): Promise<Metadata> {
  const t = getTechnology((await params).slug);
  if (!t) return {};
  return { title: `${t.h1} — Hicaso`, description: t.lead, alternates: { canonical: `/technologies/${t.slug}` } };
}

export default async function TechnologyPage({ params }: PageProps<"/technologies/[slug]">) {
  const t = getTechnology((await params).slug);
  if (!t) notFound();
  const service = getService(t.service)!;
  const c = content[t.service];

  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t.h1,
    serviceType: `${t.name} development`,
    description: t.lead,
    url: `${SITE_URL}/technologies/${t.slug}`,
    areaServed: "Worldwide",
    provider: orgRef,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(ld)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(breadcrumbLd([["Home", "/"], [t.name, `/technologies/${t.slug}`]]))} />
      <ServiceHero
        h1={t.h1}
        lead={t.lead}
        secondary={{ label: `See ${service.name.toLowerCase()}`, href: `/services/${service.slug}` }}
        fragment={c.hero.html}
        label={c.hero.label}
        piece={c.hero.piece}
        contactHref={`/contact?service=${service.slug}`}
      />
      <HowWeWork />
      <FAQ items={[...t.faqs, ...siteFaqs]} />
      {/* R5: a text-only FAQ never closes <main>; the tools diagram does (the service pages' order). */}
      <StackIcons title={t.usesTitle} lines={[service.tagline]} spokes={c.spokes} alt={c.stackAlt} hm={2}>
        <ul className="rows">
          {t.uses.map((u) => (
            <li key={u.title}>
              <span className="rows__name">{u.title}</span>
              <p>{u.body}</p>
            </li>
          ))}
        </ul>
      </StackIcons>
    </>
  );
}
