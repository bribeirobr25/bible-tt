import { notFound } from "next/navigation";
import { getChapterData, getEnrichmentData, getAvailableChapters, getAllChapterParams } from "@/lib/content-loader";
import type { Locale } from "@/lib/i18n";
import { ChapterView } from "@/ui/shared/chapter-view";

export async function generateStaticParams() {
  return getAllChapterParams();
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ locale: string; book: string; chapter: string }>;
}) {
  const { locale, book, chapter } = await params;
  const chapterNum = Number.parseInt(chapter, 10);

  if (Number.isNaN(chapterNum)) {
    notFound();
  }

  const data = await getChapterData(locale as Locale, book, chapterNum);

  if (!data) {
    notFound();
  }

  const enrichment = await getEnrichmentData(locale as Locale, book, chapterNum);
  const chapters = await getAvailableChapters(locale, book);
  const totalChapters = chapters.length > 0 ? Math.max(...chapters) : chapterNum;

  return <ChapterView data={data} enrichment={enrichment} locale={locale} book={book} chapterNum={chapterNum} totalChapters={totalChapters} />;
}
