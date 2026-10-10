import Hero from "@/components/home/Hero";
import CTA from "@/components/home/CTA";
import Principles from "@/components/common/Principles";
import ProductPanel from "@/components/products/ProductPanel";
import { products } from "@/data/products";

export default function Home() {
  return (
    <>
      <Hero />
      {products.map((p) => (
        <ProductPanel key={p.slug} product={p} />
      ))}
      <Principles />
      <CTA />
    </>
  );
}
