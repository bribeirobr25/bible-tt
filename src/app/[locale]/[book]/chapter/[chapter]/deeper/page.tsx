import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AVAILABLE_BOOKS } from "@/domain/books/registry";
import {
  getAvailableChapters,
  getChapterData,
  getDeeperChapterParams,
  getEnrichmentData,
  getPeopleData,
  getProphecyData,
} from "@/lib/content-loader";
import type { Locale } from "@/lib/i18n";
import {
  breadcrumbJsonLd,
  canonicalUrl,
  seoMetadata,
  truncateDescription,
} from "@/lib/seo";
import { DeeperView } from "@/ui/enrichment/deeper-view";
import { DoorPager } from "@/ui/navigation/door-pager";
import { ChapterShell } from "@/ui/shared/chapter-shell";
import { JsonLd } from "@/ui/shared/json-ld";

export async function generateStaticParams() {
  return getDeeperChapterParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; book: string; chapter: string }>;
}): Promise<Metadata> {
  const { locale, book, chapter } = await params;
  const n = Number.parseInt(chapter, 10);
  if (Number.isNaN(n) || !(AVAILABLE_BOOKS as readonly string[]).includes(book))
    return {};
  const t = await getTranslations({ locale });
  const title = `${t(`book.${book}`)} ${n} — ${t("nav.doorDeeper")}`;
  return seoMetadata({
    locale,
    path: `${book}/chapter/${n}/deeper`,
    title,
    description: truncateDescription(
      `${t("nav.doorDeeper")}: ${t(`book.${book}`)} ${n}. ${t("nav.bookContextDescription")}`,
    ),
  });
}

export default async function ChapterDeeperPage({
  params,
}: {
  params: Promise<{ locale: string; book: string; chapter: string }>;
}) {
  const { locale, book, chapter } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const chapterNum = Number.parseInt(chapter, 10);

  if (Number.isNaN(chapterNum)) {
    notFound();
  }

  const data = await getChapterData(locale as Locale, book, chapterNum);
  if (!data) {
    notFound();
  }

  const enrichment = await getEnrichmentData(
    locale as Locale,
    book,
    chapterNum,
  );
  const prophecy = await getProphecyData(locale as Locale, book, chapterNum);
  const hasBackground = !!enrichment && enrichment.sections.length > 0;
  const hasProphecy = !!prophecy && prophecy.entries.length > 0;

  // Deeper only exists where there is enrichment or prophecy.
  if (!hasBackground && !hasProphecy) {
    notFound();
  }

  const people = await getPeopleData(locale as Locale, book);
  const hasPeople = !!people && people.entries.length > 0;
  const chapters = await getAvailableChapters(locale, book);
  const totalChapters =
    chapters.length > 0 ? Math.max(...chapters) : chapterNum;

  const bookName = t(`book.${book}`);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("site.title"), url: canonicalUrl(locale, "") },
          { name: t("nav.selectBook"), url: canonicalUrl(locale, "books") },
          { name: bookName, url: canonicalUrl(locale, book) },
          {
            name: `${bookName} ${chapterNum}`,
            url: canonicalUrl(locale, `${book}/chapter/${chapterNum}`),
          },
          {
            name: t("nav.doorDeeper"),
            url: canonicalUrl(locale, `${book}/chapter/${chapterNum}/deeper`),
          },
        ])}
      />
      <ChapterShell
        locale={locale}
        book={book}
        chapterNum={chapterNum}
        totalChapters={totalChapters}
        data={data}
        active="deeper"
        hasDeeper={true}
        pager={
          <DoorPager
            left={{
              href: `/${book}/chapter/${chapterNum}`,
              label: t("nav.doorRead"),
            }}
            right={{ href: `/${book}/background`, label: t("nav.bookContext") }}
          />
        }
      >
        <DeeperView
          enrichment={enrichment}
          prophecy={prophecy}
          book={book}
          hasPeople={hasPeople}
        />
      </ChapterShell>
    </>
  );
}
