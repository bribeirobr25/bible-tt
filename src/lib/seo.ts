import type { Metadata } from "next";
import { locales } from "@/infrastructure/i18n/config";

/** Production origin. Override with NEXT_PUBLIC_SITE_URL when the domain/name changes. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bible-tt.vercel.app"
).replace(/\/+$/, "");

/** Brand name (provisional — see naming decision, Item-1 Q8). */
export const SITE_NAME = "The Transparent Translation";

const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  "pt-br": "pt_BR",
  de: "de_DE",
  es: "es_ES",
};

/** `path` is the logical path WITHOUT the locale prefix: "" | "books" | "genesis/chapter/1". */
function normalize(path: string): string {
  const trimmed = path.replace(/^\/+|\/+$/g, "");
  return trimmed ? `/${trimmed}` : "";
}

export function canonicalUrl(locale: string, path: string): string {
  return `${SITE_URL}/${locale}${normalize(path)}`;
}

/** hreflang map for all locales + x-default (→ en). */
export function languageAlternates(path: string): Record<string, string> {
  const p = normalize(path);
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${SITE_URL}/${l}${p}`;
  languages["x-default"] = `${SITE_URL}/en${p}`;
  return languages;
}

/** Strip markdown noise + collapse whitespace + clip for meta descriptions. */
export function truncateDescription(text: string, max = 155): string {
  const clean = text
    .replace(/[#>*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

/** Per-page Metadata: title/description + canonical + hreflang + OpenGraph + Twitter. */
export function seoMetadata(opts: {
  locale: string;
  path: string;
  title: string;
  description: string;
  /** Home page: don't apply the "%s · Brand" template. */
  absolute?: boolean;
}): Metadata {
  const { locale, path, title, description, absolute } = opts;
  const url = canonicalUrl(locale, path);
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale] ?? "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ── JSON-LD (schema.org) builders ───────────────────────────────────────────
type JsonLdObject = Record<string, unknown>;

export function websiteJsonLd(locale: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: canonicalUrl(locale, ""),
    inLanguage: locale,
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function bookJsonLd(opts: {
  locale: string;
  book: string;
  name: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: opts.name,
    url: canonicalUrl(opts.locale, opts.book),
    inLanguage: opts.locale,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: canonicalUrl(opts.locale, ""),
    },
  };
}

export function chapterJsonLd(opts: {
  locale: string;
  book: string;
  bookName: string;
  chapter: number;
  title: string;
  description?: string;
}): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Chapter",
    name: opts.title,
    url: canonicalUrl(opts.locale, `${opts.book}/chapter/${opts.chapter}`),
    inLanguage: opts.locale,
    ...(opts.description ? { description: opts.description } : {}),
    isPartOf: {
      "@type": "Book",
      name: opts.bookName,
      url: canonicalUrl(opts.locale, opts.book),
    },
  };
}
