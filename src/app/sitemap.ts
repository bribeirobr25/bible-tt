import type { MetadataRoute } from "next";
import { locales } from "@/infrastructure/i18n/config";
import { getAvailableBooks, getAvailableChapters } from "@/lib/content-loader";
import { languageAlternates, SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  const add = (path: string) => {
    const suffix = path ? `/${path}` : "";
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${suffix}`,
        alternates: { languages: languageAlternates(path) },
      });
    }
  };

  add(""); // home
  add("books");
  add("rules");

  // Book availability is locale-independent (same files across locales); enumerate via "en".
  const books = await getAvailableBooks("en");
  for (const book of books) {
    add(book);
    add(`${book}/introduction`);
    add(`${book}/people`);
    add(`${book}/context`);
    const chapters = await getAvailableChapters("en", book);
    for (const ch of chapters) add(`${book}/chapter/${ch}`);
  }

  return entries;
}
