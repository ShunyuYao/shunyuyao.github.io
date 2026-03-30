import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://shunyuyao.github.io";

const locales = ["zh", "en"];
const pages = [
  "",
  "/now",
  "/work",
  "/papers",
  "/press",
  "/awards",
  "/about",
  "/archive",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const page of pages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: page === "" ? 1.0 : 0.8,
      });
    }
  }

  return entries;
}
