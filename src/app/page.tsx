import Hero from "@/components/home/Hero";
import ServicesGrid from "@/components/home/ServicesGrid";
import Products from "@/components/home/Products";
import HowWeWork from "@/components/common/HowWeWork";
import StackSection from "@/components/home/StackSection";
import Proof from "@/components/home/Proof";
import FAQ from "@/components/common/FAQ";
import { homeFaqs } from "@/data/faqs";

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <Products />
      <HowWeWork />
      <Proof />
      <FAQ items={homeFaqs} lead="About code, hours and how a project starts." />
      {/* R5: a text-only FAQ never closes <main>; the stack diagram does. */}
      <StackSection />
    </>
  );
}
