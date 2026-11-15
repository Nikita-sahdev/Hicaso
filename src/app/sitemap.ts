import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { products } from "@/data/products";
import { technologies } from "@/data/technologies";
import { SITE_URL } from "@/lib/site";
import { listLivePostsSafe } from "@/lib/blog/store";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listLivePostsSafe();
  const paths = [
    "",
    "/services",
    ...services.map((s) => `/services/${s.slug}`),
    ...technologies.map((t) => `/technologies/${t.slug}`),
    "/products",
    ...products.map((p) => `/products/${p.slug}`),
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
