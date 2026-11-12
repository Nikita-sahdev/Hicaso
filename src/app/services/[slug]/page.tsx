import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceFeatures from "@/components/services/ServiceFeatures";
import StackIcons from "@/components/services/StackIcons";
import { content } from "@/components/services/content";
import HowWeWork from "@/components/common/HowWeWork";
import FAQ from "@/components/common/FAQ";
import { services, getService } from "@/data/services";
import { SITE_URL, ldJson } from "@/lib/site";

// Site-wide answers (the home FAQ's own wording) that fill a service's FAQ out to five questions.
const SITE_FAQS = [
  { q: "Who works on my product?", a: "The team that builds and runs AppKavo and BillMinute." },
  { q: "How often will I see the software?", a: "Every week, in a demo of working software you can try." },
];

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
  return { title: `${service.name} — Hicaso`, description: service.description };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const c = content[service.slug];

  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.description,
    url: `${SITE_URL}/services/${service.slug}`,
    areaServed: "Worldwide",
    provider: { "@type": "Organization", name: "Hicaso", url: SITE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(ld)} />
      <ServiceHero
        h1={c.h1}
        lead={c.lead}
        secondary={{ label: "See all services", href: "/services" }}
        fragment={c.hero.html}
        label={c.hero.label}
        piece={c.hero.piece}
        contactHref={`/contact?service=${service.slug}`}
      />
      <ServiceFeatures title={c.featuresTitle} cards={c.cards} />
      <HowWeWork />
      <FAQ items={[...service.faqs, ...SITE_FAQS]} />
      {/* R5: a text-only FAQ never closes <main>; the tools diagram does. */}
      <StackIcons title={c.stackTitle} lines={c.stackLines} spokes={c.spokes} alt={c.stackAlt} />
    </>
  );
}
