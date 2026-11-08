import Hero from "@/components/home/Hero";
import ServicesGrid from "@/components/home/ServicesGrid";
import StackSection from "@/components/home/StackSection";
import Products from "@/components/home/Products";
import HowWeWork from "@/components/common/HowWeWork";
import WhyHicaso from "@/components/home/WhyHicaso";
import FAQ from "@/components/common/FAQ";
import { ClientStrip, Stats, CaseStudies, Testimonials } from "@/components/home/Proof";

const faqs = [
  { q: "What does Hicaso do?", a: "We build generative AI, agentic AI, mobile and web software for clients, and we build and run our own products." },
  { q: "Do you work with clients outside India?", a: "Yes. We work with clients worldwide, and our hours overlap with Europe and the Middle East." },
  { q: "Do I own the code?", a: "Yes. Once the project is paid for, the code and IP are yours." },
  { q: "Can you work on an existing app?", a: "Yes. We can take over, fix and extend existing web and mobile apps, including PHP and Laravel codebases." },
  { q: "How do I start?", a: "Send us the enquiry form with a few details about your project, and we'll reply by email." },
];

export default function Home() {
  return (
    <>
      <Hero />
      <ClientStrip />
      <ServicesGrid />
      <Stats />
      <StackSection />
      <CaseStudies />
      <Products />
      <HowWeWork />
      <WhyHicaso />
      <Testimonials />
      <FAQ items={faqs} />
    </>
  );
}
