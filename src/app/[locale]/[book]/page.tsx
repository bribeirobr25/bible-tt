import { ArrowRight, BookOpen, Layers, Users } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AVAILABLE_BOOKS } from "@/domain/books/registry";
import type { Locale } from "@/infrastructure/i18n/config";
import {
  getAvailableBooks,
  getAvailableChapters,
  getIntroductionData,
  getPeopleData,
} from "@/lib/content-loader";
import {
  bookJsonLd,
  breadcrumbJsonLd,
  canonicalUrl,
  seoMetadata,
  truncateDescription,
} from "@/lib/seo";
import { BookCard } from "@/ui/enrichment/book-card";
import { Link } from "@/ui/navigation/locale-link";
import { JsonLd } from "@/ui/shared/json-ld";

export async function generateStaticParams() {
  const books = await getAvailableBooks("en");
  return books.map((book) => ({ book }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; book: string }>;
}): Promise<Metadata> {
  const { locale, book } = await params;
  if (!(AVAILABLE_BOOKS as readonly string[]).includes(book)) return {};
  const t = await getTranslations({ locale });
  const title = t(`book.${book}`);
  const intro = await getIntroductionData(locale as Locale, book);
  const what = intro?.card?.[0]?.value;
  return seoMetadata({
    locale,
    path: book,
    title,
    description: truncateDescription(
      what ? `${title} — ${what}` : `${title} — ${t("site.subtitle")}`,
    ),
  });
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string; book: string }>;
}) {
  const { locale, book } = await params;
  setRequestLocale(locale);

  const books = await getAvailableBooks(locale);
  if (!books.includes(book)) {
    notFound();
  }

  const t = await getTranslations();
  const chapters = await getAvailableChapters(locale, book);
  // Phase 5b: landing leads with the tight "card" (What·When·Who·To-whom·Why)
  // + a link to the full introduction; the long overview dump is gone.
  const intro = await getIntroductionData(locale as Locale, book);
  const card = intro?.card;
  const hasFullIntroduction = intro != null;
  const people = await getPeopleData(locale as Locale, book);

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12">
      <JsonLd
        data={[
          bookJsonLd({ locale, book, name: t(`book.${book}`) }),
          breadcrumbJsonLd([
            { name: t("site.title"), url: canonicalUrl(locale, "") },
            { name: t("nav.selectBook"), url: canonicalUrl(locale, "books") },
            { name: t(`book.${book}`), url: canonicalUrl(locale, book) },
          ]),
        ]}
      />
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-reading)] text-3xl md:text-4xl font-light">
            {t(`book.${book}`)}
          </h1>
        </div>

        {card && card.length > 0 && (
          <div className="space-y-3">
            <BookCard fields={card} title={t("nav.atAGlance")} />
            {hasFullIntroduction && (
              <Link
                href={`/${book}/introduction`}
                className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
              >
                {t("nav.readFullIntroduction")}
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            )}
          </div>
        )}

        {chapters.length > 0 && (
          <Link
            href={`/${book}/chapter/${chapters[0]}`}
            className="flex items-center justify-center gap-2 min-h-12 px-6 py-3 rounded-lg bg-accent text-bg-paper font-medium hover:bg-accent-hover transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-[0.99]"
          >
            <BookOpen size={18} strokeWidth={1.5} className="shrink-0" />
            {t("nav.startReading")}
          </Link>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {people && people.entries.length > 0 && (
            <Link
              href={`/${book}/people`}
              className="flex-1 flex items-center gap-3 min-h-11 px-4 py-3 rounded-lg border border-border hover:border-accent/40 hover:bg-bg-surface transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <Users
                size={18}
                strokeWidth={1.5}
                className="text-text-muted shrink-0"
              />
              <span className="font-[family-name:var(--font-ui)] text-sm font-medium text-text-primary">
                {t("people.title")}
              </span>
              <span className="text-xs text-text-muted ml-auto">
                {people.entries.length}
              </span>
            </Link>
          )}
          <Link
            href={`/${book}/background`}
            className="flex-1 flex items-center gap-3 min-h-11 px-4 py-3 rounded-lg border border-border hover:border-accent/40 hover:bg-bg-surface transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <Layers
              size={18}
              strokeWidth={1.5}
              className="text-text-muted shrink-0"
            />
            <span className="font-[family-name:var(--font-ui)] text-sm font-medium text-text-primary">
              {t("nav.bookContext")}
            </span>
          </Link>
        </div>

        <div>
          <p className="text-sm text-text-muted mb-3">
            {t("nav.selectChapter")}
          </p>
          <nav className="space-y-3">
            {chapters.map((ch) => (
              <Link
                key={ch}
                href={`/${book}/chapter/${ch}`}
                className="block px-5 py-4 rounded-lg border border-border hover:border-accent/40 hover:bg-bg-surface transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-[0.99]"
              >
                <span className="font-medium">
                  {t("chapter.chapterN", { n: ch })}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </main>
  );
}
