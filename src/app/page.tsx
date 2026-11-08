import Hero from "@/components/home/Hero";
import ServicesGrid from "@/components/home/ServicesGrid";
import Products from "@/components/home/Products";
import HowWeWork from "@/components/common/HowWeWork";
import StackSection from "@/components/home/StackSection";
import Proof from "@/components/home/Proof";
import FAQ from "@/components/common/FAQ";

const faqs = [
  { q: "Do you work with clients outside India?", a: "Yes. We work with clients worldwide. Our working hours overlap with Europe and the Middle East." },
  { q: "Who owns the software you build?", a: "You do. Once the project is paid for, the code, designs and IP are yours." },
  { q: "Who works on my product?", a: "The team that builds and runs AppKavo and BillMinute." },
  { q: "How often will I see the software?", a: "Every week, in a demo of working software you can try." },
  { q: "Can you work on existing apps?", a: "Yes. We take over, fix and extend web and mobile apps, including PHP and Laravel codebases." },
];

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <Products />
      <HowWeWork />
      <StackSection />
      <Proof />
      <FAQ items={faqs} lead="About code, hours and how a project starts." />
    </>
  );
}
