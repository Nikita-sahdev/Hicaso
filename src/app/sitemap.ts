import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { products } from "@/data/products";
import { technologies } from "@/data/technologies";
import { industries } from "@/data/industries";
import { SITE_URL } from "@/lib/site";
import { proof } from "@/data/proof";
import { listLivePostsSafe } from "@/lib/blog/store";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listLivePostsSafe();
  const paths = [
    "",
    "/services",
    ...services.map((s) => `/services/${s.slug}`),
    ...technologies.map((t) => `/technologies/${t.slug}`),
    ...industries.map((i) => `/industries/${i.slug}`),
    "/products",
    ...products.map((p) => `/products/${p.slug}`),
    // sample case studies (proof.demo) stay out of the sitemap; real ones go in
    ...(proof.demo ? [] : ["/case-studies", ...proof.caseStudies.map((c) => `/case-studies/${c.slug}`)]),
    "/about",
    "/careers",
    "/contact",
    "/privacy",
    "/terms",
  ];
  return [
    ...paths.map((p) => ({ url: `${SITE_URL}${p}` })),
    ...(posts.length
      ? [{ url: `${SITE_URL}/blog` }, ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.updatedAt }))]
      : []),
  ];
}
