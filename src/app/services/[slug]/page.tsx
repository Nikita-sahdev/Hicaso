import type { Metadata } from "next";
import { orgRef } from "@/lib/schema";
import { notFound } from "next/navigation";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceFeatures from "@/components/services/ServiceFeatures";
import StackIcons from "@/components/services/StackIcons";
import { content } from "@/components/services/content";
import HowWeWork from "@/components/common/HowWeWork";
import FAQ from "@/components/common/FAQ";
import { services, getService, serviceLink, POST_CATEGORY } from "@/data/services";
import { SITE_URL, breadcrumbLd, ldJson } from "@/lib/site";
import { siteFaqs } from "@/data/faqs";
import { technologies } from "@/data/technologies";
import { LinkRow } from "@/components/services/TechLinks";
import LatestPosts from "@/components/common/LatestPosts";
import { listLivePostsSafe } from "@/lib/blog/store";
import { BOOKING_URL, httpsLinks } from "@/lib/site";

const BOOKING = httpsLinks([{ url: BOOKING_URL }])[0]?.url;

// Only slugs from the data file exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return { title: service.seoTitle, description: service.description, alternates: { canonical: `/services/${service.slug}` } };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const c = content[service.slug];
  const posts = await listLivePostsSafe();

  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.description,
    url: `${SITE_URL}/services/${service.slug}`,
    areaServed: "Worldwide",
    provider: orgRef,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(ld)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ldJson(breadcrumbLd([["Home", "/"], ["Services", "/services"], [service.name, `/services/${service.slug}`]]))}
      />
      <ServiceHero
        h1={c.h1}
        lead={c.lead}
        secondary={BOOKING ? { label: "Book a free 30-minute call", href: BOOKING } : { label: "See all services", href: "/services" }}
        fragment={c.hero.html}
        label={c.hero.label}
        piece={c.hero.piece}
        contactHref={`/contact?service=${service.slug}`}
      />
      <ServiceFeatures title={c.featuresTitle} cards={c.cards} />
      <HowWeWork />
      <LatestPosts posts={posts.filter((p) => p.category === POST_CATEGORY[service.slug])} title="Guides from our blog" />
      <FAQ items={[...service.faqs, ...siteFaqs]} />
      {/* R5: a text-only FAQ never closes <main>; the tools diagram does. */}
      <StackIcons title={c.stackTitle} lines={c.stackLines} spokes={c.spokes} alt={c.stackAlt}>
        {/* its technology pages, then the other services in its group (every group has 5 or 6) */}
        <ul className="rows">
          <LinkRow
            label="Technologies"
            links={technologies.filter((t) => t.service === service.slug).map((t) => ({ href: `/technologies/${t.slug}`, name: t.name }))}
          />
          <LinkRow label="Related services" links={services.filter((s) => s.group === service.group && s.slug !== service.slug).map(serviceLink)} />
        </ul>
      </StackIcons>
    </>
  );
}
