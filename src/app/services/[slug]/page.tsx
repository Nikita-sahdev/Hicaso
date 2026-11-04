import type { Metadata } from "next";
import { notFound } from "next/navigation";
import page from "@/styles/page.module.css";
import styles from "./service.module.css";
import Container from "@/components/ui/Container";
import LinkButton from "@/components/ui/LinkButton";
import Eyebrow from "@/components/common/Eyebrow";
import StackGrid from "@/components/common/StackGrid";
import HowWeWork from "@/components/common/HowWeWork";
import FAQ from "@/components/common/FAQ";
import ClosingCTA from "@/components/common/ClosingCTA";
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
  const contact = `/contact?service=${service.slug}`;

  return (
    <>
      <section className={page.hero}>
        <Container>
          <Eyebrow>{service.eyebrow}</Eyebrow>
          <h1 className="t-display">{service.name}</h1>
          <p className="t-subhead">{service.description}</p>
          <div className={page.actions}>
            <LinkButton href={contact}>Start your project</LinkButton>
            <LinkButton href="/services" variant="light">
              All services
            </LinkButton>
          </div>
        </Container>
      </section>

      <section className={page.section}>
        <Container>
          <h2 className={`t-heading ${page.sectionTitle}`}>What we build</h2>
          <div className={styles.grid}>
            {service.offerings.map((o) => (
              <div key={o.title} className={styles.offering}>
                <h3 className="t-heading-sm">{o.title}</h3>
                <p>{o.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className={page.section}>
        <Container>
          <h2 className={`t-heading ${page.sectionTitle}`}>Technologies</h2>
          <StackGrid groups={service.stack} />
        </Container>
      </section>

      <HowWeWork />
      <FAQ items={service.faqs} />
      <ClosingCTA href={contact} />
    </>
  );
}
