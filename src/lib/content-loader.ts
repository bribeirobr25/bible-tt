import { locales, type Locale } from "@/infrastructure/i18n/config";
import { readChapter, readEnrichment, readIntroduction, readProphecy, readPeople, listBooks, listChapters } from "@/infrastructure/content/fs-content-repository";
import type { ChapterData, EnrichmentData, IntroductionData, ProphecyData, PeopleData } from "@/domain/content/types";

export async function getChapterData(
  locale: Locale,
  book: string,
  chapter: number,
): Promise<ChapterData | null> {
  return readChapter(locale, book, chapter);
}

export async function getEnrichmentData(
  locale: Locale,
  book: string,
  chapter: number,
): Promise<EnrichmentData | null> {
  return readEnrichment(locale, book, chapter);
}

export async function getIntroductionData(
  locale: Locale,
  book: string,
): Promise<IntroductionData | null> {
  return readIntroduction(locale, book);
}

export async function getProphecyData(
  locale: Locale,
  book: string,
  chapter: number,
): Promise<ProphecyData | null> {
  return readProphecy(locale, book, chapter);
}

export async function getPeopleData(
  locale: Locale,
  book: string,
): Promise<PeopleData | null> {
  return readPeople(locale, book);
}

export async function getAvailableBooks(locale: string): Promise<string[]> {
  return listBooks(locale);
}

export async function getAvailableChapters(
  locale: string,
  book: string,
): Promise<number[]> {
  return listChapters(locale, book);
}

export async function getAllChapterParams(): Promise<
  { locale: string; book: string; chapter: string }[]
> {
  const params: { locale: string; book: string; chapter: string }[] = [];

  for (const locale of locales) {
    const books = await listBooks(locale);
    for (const book of books) {
      const chapters = await listChapters(locale, book);
      for (const ch of chapters) {
        params.push({ locale, book, chapter: String(ch) });
      }
    }
  }

  return params;
}
