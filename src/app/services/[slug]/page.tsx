import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceHero from "@/components/services/ServiceHero";
import ServiceFeatures from "@/components/services/ServiceFeatures";
import StackIcons from "@/components/services/StackIcons";
import { content } from "@/components/services/content";
import HowWeWork from "@/components/common/HowWeWork";
import FAQ from "@/components/common/FAQ";
import { services, getService } from "@/data/services";

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

  return (
    <>
      <ServiceHero
        h1={c.h1}
        lead={c.lead}
        secondary={{ label: "See all services", href: "/services" }}
        fragment={c.hero.html}
        label={c.hero.label}
        piece={c.hero.piece}
      />
      <ServiceFeatures title={c.featuresTitle} cards={c.cards} />
      <HowWeWork />
      <FAQ items={service.faqs} />
      {/* R5: a text-only FAQ never closes <main>; the tools diagram does. */}
      <StackIcons title={c.stackTitle} lines={c.stackLines} spokes={c.spokes} alt={c.stackAlt} />
    </>
  );
}
