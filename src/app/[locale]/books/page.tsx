import { BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAvailableBooks } from "@/lib/content-loader";
import {
  breadcrumbJsonLd,
  canonicalUrl,
  seoMetadata,
  truncateDescription,
} from "@/lib/seo";
import { Link } from "@/ui/navigation/locale-link";
import { JsonLd } from "@/ui/shared/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return seoMetadata({
    locale,
    path: "books",
    title: t("nav.selectBook"),
    description: truncateDescription(t("site.subtitle")),
  });
}

export default async function BooksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const books = await getAvailableBooks(locale);

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("site.title"), url: canonicalUrl(locale, "") },
          { name: t("nav.selectBook"), url: canonicalUrl(locale, "books") },
        ])}
      />
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <h1 className="tt-h1">{t("nav.selectBook")}</h1>
        </div>

        {books.length > 0 ? (
          <nav className="space-y-3">
            {books.map((book) => (
              <Link
                key={book}
                href={`/${book}`}
                className="flex items-center gap-4 px-5 py-5 rounded-lg border border-border hover:border-accent/40 hover:bg-bg-surface transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-[0.99]"
              >
                <BookOpen
                  className="w-5 h-5 text-text-muted shrink-0"
                  strokeWidth={1.5}
                />
                <span className="font-[family-name:var(--font-reading)] text-lg font-light">
                  {t(`book.${book}`)}
                </span>
              </Link>
            ))}
          </nav>
        ) : (
          <p className="text-sm text-text-muted italic text-center">
            No books available yet.
          </p>
        )}
      </div>
    </main>
  );
}
