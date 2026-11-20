import type { Metadata } from "next";
import { orgRef } from "@/lib/schema";
import { notFound } from "next/navigation";
import ServiceHero from "@/components/services/ServiceHero";
import StackIcons from "@/components/services/StackIcons";
import { LinkRow } from "@/components/services/TechLinks";
import { content } from "@/components/services/content";
import HowWeWork from "@/components/common/HowWeWork";
import FAQ from "@/components/common/FAQ";
import { getService, serviceLink } from "@/data/services";
import { industries, getIndustry } from "@/data/industries";
import { siteFaqs } from "@/data/faqs";
import { SITE_URL, breadcrumbLd, ldJson } from "@/lib/site";

// An industry page, on the technology page's pattern (src/app/technologies/[slug]/page.tsx): its first service
// lends the hero fragment and tools diagram. hero > the four steps > FAQ > needs beside the diagram (R5).
export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const i = getIndustry((await params).slug);
  if (!i) return {};
  return { title: i.seoTitle, description: i.lead, alternates: { canonical: `/industries/${i.slug}` } };
}

export default async function IndustryPage({ params }: PageProps<"/industries/[slug]">) {
  const i = getIndustry((await params).slug);
  if (!i) notFound();
  const lead = getService(i.services[0])!;
  const c = content[lead.slug];

  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: i.h1,
    serviceType: `${i.name} software development`,
    description: i.lead,
    url: `${SITE_URL}/industries/${i.slug}`,
    audience: { "@type": "BusinessAudience", name: i.name },
    areaServed: "Worldwide",
    provider: orgRef,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(ld)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(breadcrumbLd([["Home", "/"], [i.name, `/industries/${i.slug}`]]))} />
      <ServiceHero
        h1={i.h1}
        lead={i.lead}
        secondary={{ label: `See ${lead.name.toLowerCase()}`, href: `/services/${lead.slug}` }}
        fragment={c.hero.html}
        label={c.hero.label}
        piece={c.hero.piece}
        contactHref={`/contact?service=${lead.slug}`}
      />
      <HowWeWork />
      <FAQ items={[...i.faqs, ...siteFaqs]} />
      {/* R5: a text-only FAQ never closes <main>; the tools diagram does (the service pages' order). */}
      <StackIcons title={i.needsTitle} lines={[lead.tagline]} spokes={c.spokes} alt={c.stackAlt} hm={2}>
        <ul className="rows">
          {i.needs.map((n) => (
            <li key={n.title}>
              <span className="rows__name">{n.title}</span>
              <p>{n.body}</p>
            </li>
          ))}
          <LinkRow label={`Services for ${i.name.toLowerCase()}`} links={i.services.map((s) => serviceLink(getService(s)!))} />
          <LinkRow
            label="Other industries"
            links={industries.filter((x) => x.slug !== i.slug).map((x) => ({ href: `/industries/${x.slug}`, name: x.name }))}
          />
        </ul>
      </StackIcons>
    </>
  );
}
