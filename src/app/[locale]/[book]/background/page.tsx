import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AVAILABLE_BOOKS } from "@/domain/books/registry";
import type { Locale } from "@/infrastructure/i18n/config";
import {
  getAvailableBooks,
  getBookContextData,
  getPeopleData,
} from "@/lib/content-loader";
import {
  breadcrumbJsonLd,
  canonicalUrl,
  seoMetadata,
  truncateDescription,
} from "@/lib/seo";
import { BookContextView } from "@/ui/enrichment/book-context-view";
import { DoorPager } from "@/ui/navigation/door-pager";
import { Link } from "@/ui/navigation/locale-link";
import { JsonLd } from "@/ui/shared/json-ld";

const WRAP = "max-w-[1320px] mx-auto px-[clamp(18px,4vw,52px)]";

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
  return seoMetadata({
    locale,
    path: `${book}/background`,
    title: `${t(`book.${book}`)} — ${t("nav.bookContext")}`,
    description: truncateDescription(t("nav.bookContextDescription")),
  });
}

export default async function BookContextPage({
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
  const data = await getBookContextData(locale as Locale, book);
  const people = await getPeopleData(locale as Locale, book);
  const hasPeople = !!people && people.entries.length > 0;

  const bookName = t(`book.${book}`);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("site.title"), url: canonicalUrl(locale, "") },
          { name: t("nav.books"), url: canonicalUrl(locale, "books") },
          { name: bookName, url: canonicalUrl(locale, book) },
          {
            name: t("nav.bookContext"),
            url: canonicalUrl(locale, `${book}/background`),
          },
        ])}
      />
      <div className={`tt-chapter-head ${WRAP}`}>
        <nav className="tt-crumb" aria-label="Breadcrumb">
          <Link href="/">{t("nav.home")}</Link>
          <span className="sep">/</span>
          <Link href="/books">{t("nav.books")}</Link>
          <span className="sep">/</span>
          <Link href={`/${book}`}>{bookName}</Link>
          <span className="sep">/</span>
          <span>{t("nav.bookContext")}</span>
        </nav>
        <div className="tt-title-row">
          <div>
            <div className="tt-ref">{bookName}</div>
            <h1 className="tt-chapter-title">{t("nav.bookContext")}</h1>
          </div>
          <span className="tt-status-pill">
            <span className="dot" aria-hidden="true" />
            {t("people.provisional")}
          </span>
        </div>
        <hr className="tt-seam mt-[26px]" />
      </div>
      <main
        className={WRAP}
        style={{
          paddingTop: "clamp(36px,6vh,64px)",
          paddingBottom: "clamp(48px,8vh,90px)",
        }}
      >
        {data ? (
          <BookContextView data={data} />
        ) : (
          <div className="tt-deeper-section py-16 text-center">
            <p className="text-sm text-text-muted italic">
              {t("nav.comingSoon")}
            </p>
          </div>
        )}
        <DoorPager
          left={
            hasPeople
              ? { href: `/${book}/people`, label: t("people.title") }
              : { href: `/${book}`, label: bookName }
          }
          right={{ href: `/${book}/chapter/1`, label: `${bookName} 1` }}
        />
      </main>
    </>
  );
}
