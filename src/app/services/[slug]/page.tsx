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
import { siteFaqs } from "@/data/faqs";
import { technologies } from "@/data/technologies";
import TechLinks from "@/components/services/TechLinks";
import LatestPosts from "@/components/common/LatestPosts";
import { listLivePostsSafe } from "@/lib/blog/store";
import { BOOKING_URL, httpsLinks } from "@/lib/site";

const BOOKING = httpsLinks([{ url: BOOKING_URL }])[0]?.url;
// which blog category (src/lib/blog/post.ts CATEGORIES) holds each service's guides
const POST_CATEGORY: Record<string, string> = {
  "generative-ai": "ai",
  "agentic-ai": "ai",
  "ai-chatbot-development": "ai",
  "ai-automation": "ai",
  "ai-consulting": "ai",
  "mobile-app-development": "mobile",
  "web-development": "web",
  "mvp-development": "web",
  "saas-development": "web",
  "ecommerce-development": "web",
};

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
  return { title: `${service.name} — Hicaso`, description: service.description, alternates: { canonical: `/services/${service.slug}` } };
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
    provider: { "@type": "Organization", name: "Hicaso", url: SITE_URL },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(ld)} />
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
      <LatestPosts posts={posts.filter((p) => p.category === POST_CATEGORY[service.slug])} title={`${service.name} guides`} />
      <FAQ items={[...service.faqs, ...siteFaqs]} />
      {/* R5: a text-only FAQ never closes <main>; the tools diagram does. */}
      <StackIcons title={c.stackTitle} lines={c.stackLines} spokes={c.spokes} alt={c.stackAlt}>
        <TechLinks items={technologies.filter((t) => t.service === service.slug)} />
      </StackIcons>
    </>
  );
}
