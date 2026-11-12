import type { MetadataRoute } from "next";
import { services } from "@/data/services";
import { products } from "@/data/products";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/services",
    ...services.map((s) => `/services/${s.slug}`),
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
