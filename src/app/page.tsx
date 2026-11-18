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
import Photo from "@/components/company/Photo";

export default async function Home() {
  const posts = await listLivePostsSafe();
  return (
    <>
      <Hero />
      <ServicesGrid />
      <Products />
      {/* the page's one dark band (backgrounds.md: middle of the page, one screen), no moment of its own: with
          pinned-chapters on the page every dealt second moment (letters-assemble, liquid-type, line-carries-colour,
          2026-11-18) was a second scroll moment, a second pointer effect beside the hero's button, or one that avoids
          pinned-chapters; counter-rolls needs proof figures the page does not have yet */}
      <section className="section ground-inverse" id="why" style={{ "--hm": 2 } as React.CSSProperties} aria-labelledby="why-h">
        <div className="wrap">
          <div className="grid fill">
            <div className="span-5 stack-5">
              <h2 id="why-h">Built by a product team</h2>
              <p className="t-lead">AppKavo and BillMinute, our own products, run on the stack we use for clients.</p>
              <ul className="rows">
                {WHY.map((p) => (
                  <li key={p.title}>
                    <span className="rows__name">{p.title}</span>
                    <p>{p.text}</p>
                  </li>
                ))}
              </ul>
            </div>
            {/* a photograph, not a third .frame--fill split (card-layout: one layout twice at most); the same stand-in
                as /about's "why" section, credited in the footer line */}
            <div className="frame frame--photo frame--split span-6 start-7">
              {/* the frame is taller than the 3:2 photograph, so cover scales it ~1.7x: sizes asks for that width */}
              <Photo photo="hands" className="frame__img" sizes="(max-width: 639px) 280vw, (max-width: 1023px) 170vw, 1100px" />
            </div>
          </div>
        </div>
      </section>
      <HowWeWork />
      <Proof />
      <LatestPosts posts={posts} title="Latest from the blog" />
      <FAQ items={homeFaqs} lead="How a project starts, NDAs, billing and working hours." />
      {/* R5: a text-only FAQ never closes <main>; the stack diagram does. */}
      <StackSection />
    </>
  );
}
