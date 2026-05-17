import type {
  BookContextData,
  ChapterData,
  EnrichmentData,
  IntroductionData,
  PeopleData,
  ProphecyData,
} from "@/domain/content/types";
import {
  listBooks,
  listChapters,
  readBookContext,
  readChapter,
  readEnrichment,
  readIntroduction,
  readPeople,
  readProphecy,
} from "@/infrastructure/content/fs-content-repository";
import { type Locale, locales } from "@/infrastructure/i18n/config";

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

/**
 * Phase 5 (Book Introduction split, AUDIT §3.5): book landing page renders
 * Section A (Overview) only; the full introduction lives at /{book}/introduction.
 * Disclaimer is cleared because it belongs on the dedicated introduction page,
 * not the landing.
 */
export async function getIntroductionOverview(
  locale: Locale,
  book: string,
): Promise<IntroductionData | null> {
  const full = await readIntroduction(locale, book);
  if (!full) return null;
  return {
    ...full,
    disclaimer: "",
    sections: full.sections.filter((s) => s.id === "overview"),
  };
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

export async function getBookContextData(
  locale: Locale,
  book: string,
): Promise<BookContextData | null> {
  return readBookContext(locale, book);
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
