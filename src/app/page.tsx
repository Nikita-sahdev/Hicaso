import Hero from "@/components/home/Hero";
import ServicesGrid from "@/components/home/ServicesGrid";
import Products from "@/components/home/Products";
import HowWeWork from "@/components/common/HowWeWork";
import StackSection from "@/components/home/StackSection";
import Proof from "@/components/home/Proof";
import FAQ from "@/components/common/FAQ";
import LatestPosts from "@/components/common/LatestPosts";
import { homeFaqs } from "@/data/faqs";
import { WHY } from "@/data/why";
import { listLivePostsSafe } from "@/lib/blog/store";

export default async function Home() {
  const posts = await listLivePostsSafe();
  return (
    <>
      <Hero />
      <ServicesGrid />
      <Products />
      <section className="section" id="why" aria-labelledby="why-h">
        <div className="wrap">
          <div className="grid">
            <h2 id="why-h" className="span-5">
              Why companies work with Hicaso
            </h2>
            <ul className="rows span-6 start-7">
              {WHY.map((p) => (
                <li key={p.title}>
                  <span className="rows__name">{p.title}</span>
                  <p>{p.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <HowWeWork />
      <Proof />
      <LatestPosts posts={posts} title="Latest from the blog" />
      <FAQ items={homeFaqs} lead="About code, hours and how a project starts." />
      {/* R5: a text-only FAQ never closes <main>; the stack diagram does. */}
      <StackSection />
    </>
  );
}
