import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import Logos from "@/components/home/Logos";
import Services from "@/components/home/Services";
import About from "@/components/home/About";
import CTA from "@/components/home/CTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        <Logos />
        <Services />
        <About />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
