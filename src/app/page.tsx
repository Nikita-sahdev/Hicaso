import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import CTA from "@/components/home/CTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Hero />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
