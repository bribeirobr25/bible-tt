import fs from "node:fs/promises";
import path from "node:path";
import type {
  BookContextData,
  ChapterData,
  EnrichmentData,
  IntroductionData,
  PeopleData,
  ProphecyData,
} from "@/domain/content/types";
import type { Locale } from "@/infrastructure/i18n/config";
import { parseBookContextMarkdown } from "./book-context-parser";
import {
  parseEnrichmentMarkdown,
  parseIntroductionMarkdown,
} from "./enrichment-parser";
import { parseChapterMarkdown } from "./markdown-parser";
import { parsePeopleMarkdown } from "./people-parser";
import { parseProphecyMarkdown } from "./prophecy-parser";

const CONTENT_ROOT = path.join(process.cwd(), "content");

/** A missing file or directory is "no such content" (→ null / 404). */
function isAbsent(err: unknown): boolean {
  const code = (err as NodeJS.ErrnoException | null)?.code;
  return code === "ENOENT" || code === "ENOTDIR";
}

/**
 * Read a content file, or `null` when it does not exist. Any other I/O error is
 * rethrown, and parsing happens OUTSIDE this helper, so a parser bug fails the
 * build loudly instead of turning a page into a silent 404 (audit §3.2).
 */
async function readIfPresent(filePath: string): Promise<string | null> {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (err) {
    if (isAbsent(err)) return null;
    throw err;
  }
}

export async function readChapter(
  locale: Locale,
  book: string,
  chapter: number,
): Promise<ChapterData | null> {
  const filePath = path.join(
    CONTENT_ROOT,
    locale,
    book,
    `CHAPTER-${chapter}.md`,
  );
  const raw = await readIfPresent(filePath);
  return raw === null ? null : parseChapterMarkdown(raw, book, chapter);
}

export async function readEnrichment(
  locale: Locale,
  book: string,
  chapter: number,
): Promise<EnrichmentData | null> {
  const filePath = path.join(
    CONTENT_ROOT,
    locale,
    book,
    "study",
    `CHAPTER-${chapter}-CONTEXT.md`,
  );
  const raw = await readIfPresent(filePath);
  return raw === null ? null : parseEnrichmentMarkdown(raw, book, chapter);
}

export async function readIntroduction(
  locale: Locale,
  book: string,
): Promise<IntroductionData | null> {
  const filePath = path.join(CONTENT_ROOT, locale, book, "INTRODUCTION.md");
  const raw = await readIfPresent(filePath);
  return raw === null ? null : parseIntroductionMarkdown(raw, book);
}

export async function readProphecy(
  locale: Locale,
  book: string,
  chapter: number,
): Promise<ProphecyData | null> {
  const filePath = path.join(
    CONTENT_ROOT,
    locale,
    book,
    "study",
    `CHAPTER-${chapter}-PROPHECY.md`,
  );
  const raw = await readIfPresent(filePath);
  return raw === null ? null : parseProphecyMarkdown(raw, book, chapter);
}

export async function readPeople(
  locale: Locale,
  book: string,
): Promise<PeopleData | null> {
  const filePath = path.join(CONTENT_ROOT, locale, book, "PEOPLE.md");
  const raw = await readIfPresent(filePath);
  return raw === null ? null : parsePeopleMarkdown(raw, book);
}

export async function readBookContext(
  locale: Locale,
  book: string,
): Promise<BookContextData | null> {
  const filePath = path.join(CONTENT_ROOT, locale, book, "CONTEXT.md");
  const raw = await readIfPresent(filePath);
  return raw === null ? null : parseBookContextMarkdown(raw, book, locale);
}

export async function listBooks(locale: string): Promise<string[]> {
  const localePath = path.join(CONTENT_ROOT, locale);
  try {
    const entries = await fs.readdir(localePath, { withFileTypes: true });
    const books: string[] = [];
    for (const entry of entries) {
      if (
        entry.isDirectory() &&
        !entry.name.startsWith(".") &&
        entry.name !== "study"
      ) {
        const chapterFiles = await fs.readdir(
          path.join(localePath, entry.name),
        );
        if (chapterFiles.some((f) => /^CHAPTER-\d+\.md$/.test(f))) {
          books.push(entry.name);
        }
      }
    }
    return books.sort();
  } catch (err) {
    if (isAbsent(err)) return [];
    throw err;
  }
}

export async function listChapters(
  locale: string,
  book: string,
): Promise<number[]> {
  const dirPath = path.join(CONTENT_ROOT, locale, book);
  try {
    const files = await fs.readdir(dirPath);
    return files
      .filter((f) => /^CHAPTER-\d+\.md$/.test(f))
      .map((f) =>
        Number.parseInt(f.replace("CHAPTER-", "").replace(".md", ""), 10),
      )
      .sort((a, b) => a - b);
  } catch (err) {
    if (isAbsent(err)) return [];
    throw err;
  }
}
