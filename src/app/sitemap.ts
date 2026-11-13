import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { products } from "@/data/products";
import { technologies } from "@/data/technologies";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
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
  return paths.map((p) => ({ url: `${SITE_URL}${p}` }));
}
