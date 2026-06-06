import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AVAILABLE_BOOKS } from "@/domain/books/registry";
import {
  getAllChapterParams,
  getAvailableChapters,
  getChapterData,
  hasDeeperContent,
} from "@/lib/content-loader";
import type { Locale } from "@/lib/i18n";
import {
  breadcrumbJsonLd,
  canonicalUrl,
  seoMetadata,
  truncateDescription,
} from "@/lib/seo";
import { ChapterShell } from "@/ui/shared/chapter-shell";
import { JsonLd } from "@/ui/shared/json-ld";
import { NotesView } from "@/ui/study/notes-view";

export async function generateStaticParams() {
  return getAllChapterParams();
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
  const title = `${t(`book.${book}`)} ${n} — ${t("nav.doorNotes")}`;
  return seoMetadata({
    locale,
    path: `${book}/chapter/${n}/notes`,
    title,
    description: truncateDescription(
      `${t("nav.doorNotes")}: ${t(`book.${book}`)} ${n}. ${t("site.subtitle")}`,
    ),
  });
}

export default async function ChapterNotesPage({
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

  const chapters = await getAvailableChapters(locale, book);
  const totalChapters =
    chapters.length > 0 ? Math.max(...chapters) : chapterNum;
  const hasDeeper = await hasDeeperContent(locale as Locale, book, chapterNum);

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
            name: t("nav.doorNotes"),
            url: canonicalUrl(locale, `${book}/chapter/${chapterNum}/notes`),
          },
        ])}
      />
      <ChapterShell
        locale={locale}
        book={book}
        chapterNum={chapterNum}
        totalChapters={totalChapters}
        data={data}
        active="notes"
        hasDeeper={hasDeeper}
      >
        <NotesView data={data} />
      </ChapterShell>
    </>
  );
}
