import {
  emitBookContext,
  emitChapter,
  emitEnrichment,
  emitIntroduction,
  emitPeople,
  emitProphecy,
  type StructuredUnit,
} from "@/domain/content/structured";
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

/**
 * Phase 2 — structured layer (P2-Q2/Q3). Assembles every {@link StructuredUnit}
 * for a book in a locale by reusing the existing parsers + emitters. Derived,
 * additive, and locale-keyed; markdown stays the source of truth. Consumed by
 * future phases (addressable views, build-time search index). Faithfulness is
 * guarded by `infrastructure/content/__tests__/conservation.test.ts`.
 */
export async function getStructuredBook(
  locale: Locale,
  book: string,
): Promise<StructuredUnit[]> {
  const units: StructuredUnit[] = [];

  const chapters = await listChapters(locale, book);
  for (const ch of chapters) {
    const chapter = await readChapter(locale, book, ch);
    if (chapter) units.push(...emitChapter(chapter));
    const enrichment = await readEnrichment(locale, book, ch);
    if (enrichment) units.push(...emitEnrichment(enrichment));
    const prophecy = await readProphecy(locale, book, ch);
    if (prophecy) units.push(...emitProphecy(prophecy));
  }

  const introduction = await readIntroduction(locale, book);
  if (introduction) units.push(...emitIntroduction(introduction));
  const people = await readPeople(locale, book);
  if (people) units.push(...emitPeople(people));
  const bookContext = await readBookContext(locale, book);
  if (bookContext) units.push(...emitBookContext(bookContext));

  return units;
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

/**
 * Phase 3 — chapters that have a "Deeper" door, i.e. enrichment sections or
 * prophecy entries. Used by the deeper route's generateStaticParams so we only
 * build pages that have content (gated like the old `availableModes`).
 */
export async function hasDeeperContent(
  locale: Locale,
  book: string,
  chapter: number,
): Promise<boolean> {
  const enrichment = await readEnrichment(locale, book, chapter);
  if (enrichment && enrichment.sections.length > 0) return true;
  const prophecy = await readProphecy(locale, book, chapter);
  return !!prophecy && prophecy.entries.length > 0;
}

export async function getDeeperChapterParams(): Promise<
  { locale: string; book: string; chapter: string }[]
> {
  const all = await getAllChapterParams();
  const out: { locale: string; book: string; chapter: string }[] = [];
  for (const p of all) {
    if (await hasDeeperContent(p.locale as Locale, p.book, Number(p.chapter))) {
      out.push(p);
    }
  }
  return out;
}
