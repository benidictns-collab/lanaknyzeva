import type { MetadataRoute } from "next";
import { searchServices, siteUrl } from "@/lib/site/search";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/` },
    ...searchServices.map(({ slug }) => ({ url: `${siteUrl}/uslugi/${slug}` })),
  ];
}
