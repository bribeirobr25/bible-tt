import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { AVAILABLE_BOOKS } from "@/domain/books/registry";
import { locales } from "@/infrastructure/i18n/config";
import { parseEnrichmentMarkdown } from "../enrichment-parser";
import { parseChapterMarkdown } from "../markdown-parser";
import { parsePeopleMarkdown } from "../people-parser";
import { parseProphecyMarkdown } from "../prophecy-parser";

/**
 * Step 2 (PLAN_SAFETY_NET.md WS4.2) — raw-count reconciliation.
 *
 * The conservation gate proves the parser → structured-layer derivation loses
 * nothing, but its expected values come from the parsed objects themselves, so
 * it cannot see content the PARSER never captured. This test is an independent
 * oracle: it counts headings in the raw markdown with its own simple rules (not
 * the parser's) and requires the parser to return the same number, per file.
 * Plus a fixed canonical verse-count table, so a verse dropped in EN and
 * copied to every locale is still caught (cross-locale parity can't see that).
 */

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const read = (...p: string[]) =>
  readFileSync(path.join(CONTENT, ...p), "utf-8");
const lines = (s: string, re: RegExp) =>
  s.split("\n").filter((l) => re.test(l));

/** NA28 / BHS versification of every authored chapter (source of truth: the base texts). */
const CANONICAL_VERSES: Record<string, number[]> = {
  genesis: [31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20],
  matthew: [25, 23, 17],
  mark: [45, 28, 35],
  luke: [80, 52, 38],
  john: [51, 25, 36],
  acts: [26, 47, 26],
  "1-peter": [25, 25, 22, 19, 14],
};

const chapterFiles = (locale: string, book: string) =>
  readdirSync(path.join(CONTENT, locale, book))
    .filter((f) => /^CHAPTER-\d+\.md$/.test(f))
    .sort((a, b) => Number(a.match(/\d+/)?.[0]) - Number(b.match(/\d+/)?.[0]));
const studyFiles = (locale: string, book: string, suffix: string) => {
  const d = path.join(CONTENT, locale, book, "study");
  return existsSync(d) ? readdirSync(d).filter((f) => f.endsWith(suffix)) : [];
};

describe("raw-count reconciliation (independent of the parsers)", () => {
  it("every activated book has a canonical verse table", () => {
    for (const book of AVAILABLE_BOOKS)
      expect(
        CANONICAL_VERSES[book],
        `add NA28/BHS verse counts for ${book}`,
      ).toBeDefined();
  });

  it("EN chapters match the canonical verse counts (1..n, none missing)", () => {
    for (const book of AVAILABLE_BOOKS) {
      const files = chapterFiles("en", book);
      expect(files.length, `${book}: chapter count vs canonical table`).toBe(
        CANONICAL_VERSES[book].length,
      );
      files.forEach((f, i) => {
        const nums = lines(read("en", book, f), /^### \*\*Verse \d+\*\*$/).map(
          (l) => Number(l.match(/\d+/)?.[0]),
        );
        const n = CANONICAL_VERSES[book][i];
        expect(nums, `en/${book}/${f}`).toEqual(
          Array.from({ length: n }, (_, k) => k + 1),
        );
      });
    }
  });

  it("parsed verses = raw verse headers (every chapter, every locale)", () => {
    const bad: string[] = [];
    for (const l of locales)
      for (const book of AVAILABLE_BOOKS)
        for (const f of chapterFiles(l, book)) {
          const raw = read(l, book, f);
          const rawN = lines(
            raw,
            /^### \*\*(?:Verse|Versículo|Versiculo|Vers) \d+\*\*$/,
          ).length;
          const ch = Number(f.match(/\d+/)?.[0]);
          const parsed = parseChapterMarkdown(raw, book, ch).verses.length;
          if (rawN !== parsed)
            bad.push(`${l}/${book}/${f}: raw ${rawN} parsed ${parsed}`);
        }
    expect(bad).toEqual([]);
  });

  it("parsed companion entries = raw `### ` headings (every companion)", () => {
    const bad: string[] = [];
    for (const l of locales)
      for (const book of AVAILABLE_BOOKS)
        for (const f of studyFiles(l, book, "-CONTEXT.md")) {
          const raw = read(l, book, "study", f);
          const rawN = lines(raw, /^### /).length;
          const ch = Number(f.match(/\d+/)?.[0]);
          const parsed = parseEnrichmentMarkdown(raw, book, ch).sections.reduce(
            (a, s) => a + s.entries.length,
            0,
          );
          if (rawN !== parsed)
            bad.push(`${l}/${book}/${f}: raw ${rawN} parsed ${parsed}`);
        }
    expect(bad).toEqual([]);
  });

  it("parsed prophecy entries = raw `## ` entry headings (every prophecy file)", () => {
    // Non-entry H2s, by this test's own rule: the edition title, the §H sources
    // block, and the "Note on … mode of allusion" header.
    const NON_ENTRY =
      /^## (?:.*(?:Transparent|Tradução|Traducción|Übersetzung)|H\. |(?:Note|Nota|Anmerkung) )/;
    const bad: string[] = [];
    for (const l of locales)
      for (const book of AVAILABLE_BOOKS)
        for (const f of studyFiles(l, book, "-PROPHECY.md")) {
          const raw = read(l, book, "study", f);
          const rawN = lines(raw, /^## /).filter(
            (x) => !NON_ENTRY.test(x),
          ).length;
          const ch = Number(f.match(/\d+/)?.[0]);
          const parsed = parseProphecyMarkdown(raw, book, ch).entries.length;
          if (rawN !== parsed)
            bad.push(`${l}/${book}/${f}: raw ${rawN} parsed ${parsed}`);
        }
    expect(bad).toEqual([]);
  });

  it("parsed persons = raw `## ` person headings (every PEOPLE.md)", () => {
    // Non-person H2s, by this test's own rule: the §H sources block and the
    // genealogy summary tables.
    const NON_PERSON = /^## (?:H\. |.*Genealog)/;
    const bad: string[] = [];
    for (const l of locales)
      for (const book of AVAILABLE_BOOKS) {
        if (!existsSync(path.join(CONTENT, l, book, "PEOPLE.md"))) continue;
        const raw = read(l, book, "PEOPLE.md");
        const rawN = lines(raw, /^## /).filter(
          (x) => !NON_PERSON.test(x),
        ).length;
        const parsed = parsePeopleMarkdown(raw, book).entries.length;
        if (rawN !== parsed)
          bad.push(`${l}/${book}: raw ${rawN} parsed ${parsed}`);
      }
    expect(bad).toEqual([]);
  });
});
