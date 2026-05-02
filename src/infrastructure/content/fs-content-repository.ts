import fs from "node:fs/promises";
import path from "node:path";
import type { ChapterData, EnrichmentData, IntroductionData, ProphecyData, PeopleData } from "@/domain/content/types";
import type { Locale } from "@/infrastructure/i18n/config";
import { parseChapterMarkdown } from "./markdown-parser";
import { parseEnrichmentMarkdown, parseIntroductionMarkdown } from "./enrichment-parser";
import { parseProphecyMarkdown } from "./prophecy-parser";
import { parsePeopleMarkdown } from "./people-parser";

const CONTENT_ROOT = path.join(process.cwd(), "content");

export async function readChapter(
  locale: Locale,
  book: string,
  chapter: number,
): Promise<ChapterData | null> {
  const filePath = path.join(CONTENT_ROOT, locale, book, `CHAPTER-${chapter}.md`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return parseChapterMarkdown(raw, book, chapter);
  } catch {
    return null;
  }
}

export async function readEnrichment(
  locale: Locale,
  book: string,
  chapter: number,
): Promise<EnrichmentData | null> {
  const filePath = path.join(CONTENT_ROOT, locale, book, "study", `CHAPTER-${chapter}-CONTEXT.md`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return parseEnrichmentMarkdown(raw, book, chapter);
  } catch {
    return null;
  }
}

export async function readIntroduction(
  locale: Locale,
  book: string,
): Promise<IntroductionData | null> {
  const filePath = path.join(CONTENT_ROOT, locale, book, "INTRODUCTION.md");
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return parseIntroductionMarkdown(raw, book);
  } catch {
    return null;
  }
}

export async function readProphecy(
  locale: Locale,
  book: string,
  chapter: number,
): Promise<ProphecyData | null> {
  const filePath = path.join(CONTENT_ROOT, locale, book, "study", `CHAPTER-${chapter}-PROPHECY.md`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return parseProphecyMarkdown(raw, book, chapter);
  } catch {
    return null;
  }
}

export async function readPeople(
  locale: Locale,
  book: string,
): Promise<PeopleData | null> {
  const filePath = path.join(CONTENT_ROOT, locale, book, "PEOPLE.md");
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return parsePeopleMarkdown(raw, book);
  } catch {
    return null;
  }
}

export async function listBooks(locale: string): Promise<string[]> {
  const localePath = path.join(CONTENT_ROOT, locale);
  try {
    const entries = await fs.readdir(localePath, { withFileTypes: true });
    const books: string[] = [];
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith(".") && entry.name !== "study") {
        const chapterFiles = await fs.readdir(path.join(localePath, entry.name));
        if (chapterFiles.some((f) => /^CHAPTER-\d+\.md$/.test(f))) {
          books.push(entry.name);
        }
      }
    }
    return books.sort();
  } catch {
    return [];
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
      .map((f) => Number.parseInt(f.replace("CHAPTER-", "").replace(".md", ""), 10))
      .sort((a, b) => a - b);
  } catch {
    return [];
  }
}
