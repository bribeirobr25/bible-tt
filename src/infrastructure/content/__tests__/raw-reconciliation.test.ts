import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { AVAILABLE_BOOKS } from "@/domain/books/registry";
import { locales } from "@/infrastructure/i18n/config";
import {
  parseEnrichmentMarkdown,
  parseIntroductionMarkdown,
} from "../enrichment-parser";
import { parseChapterMarkdown } from "../markdown-parser";
import { parsePeopleMarkdown } from "../people-parser";
import { parseProphecyMarkdown } from "../prophecy-parser";

/**
 * Step 2 (PLAN_SAFETY_NET.md WS4.2) — raw-count reconciliation.
 * Independence (implementation review R2): genuinely independent for prophecy
 * (H2 titles vs the parser's **Verse:** field) and people (own non-person
 * rule); routing-only for verses and companions (same header regex as the
 * parser — proves headers land in the right section). Those two are
 * backstopped by the canonical verse table and cross-locale parity.
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
  !existsSync(path.join(CONTENT, locale, book))
    ? [] // an EN-only PILOT book has no locale dir (implementation review R2)
    : readdirSync(path.join(CONTENT, locale, book))
        .filter((f) => /^CHAPTER-\d+\.md$/.test(f))
        .sort(
          (a, b) => Number(a.match(/\d+/)?.[0]) - Number(b.match(/\d+/)?.[0]),
        );
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
  it("parsed Sources blocks = raw Sources sections, line for line (every file)", () => {
    // Independent rule: a lettered G/H heading whose words name the sources
    // (companion §G is Curiosities, so the letter alone never decides). The
    // raw lines run to the next `## `; blank lines and `---` rules carry no
    // text. Each raw line must reappear, as itself, in the parsed block
    // (modulo the documented `>`/bullet cleaning) — no line lost or invented.
    const RAW_SOURCES =
      /^## [GH]\. (?:Sources|Fontes|Fuentes|Konsultierte Quellen|Herangezogene Quellen)\b/;
    const norm = (l: string) =>
      l
        .replace(/^>\s?/, "")
        .replace(/^(?:[-*]|•)\s+/, "• ")
        .trim();
    const rawBlock = (raw: string): string[] | null => {
      const ls = raw.split("\n");
      const at = ls.findIndex((l) => RAW_SOURCES.test(l));
      if (at < 0) return null;
      const out: string[] = [];
      for (const l of ls.slice(at + 1)) {
        if (/^## /.test(l)) break;
        if (l.trim() && !/^\s*-{3,}\s*$/.test(l)) out.push(norm(l));
      }
      return out;
    };
    const bad: string[] = [];
    const perLocale = new Map<string, number>();
    for (const l of locales) {
      let n = 0;
      const check = (rel: string, raw: string, parsed: string | undefined) => {
        const want = rawBlock(raw);
        if (want) n++;
        const got = parsed
          ? parsed
              .split("\n")
              .map(norm)
              .filter((x) => x.length > 0)
          : null;
        if (JSON.stringify(want) !== JSON.stringify(got))
          bad.push(
            `${l}/${rel}: raw ${want?.length ?? "none"} lines, parsed ${got?.length ?? "none"}`,
          );
      };
      for (const book of AVAILABLE_BOOKS) {
        for (const f of studyFiles(l, book, "-CONTEXT.md")) {
          const raw = read(l, book, "study", f);
          const ch = Number(f.match(/\d+/)?.[0]);
          check(
            `${book}/${f}`,
            raw,
            parseEnrichmentMarkdown(raw, book, ch).sources,
          );
        }
        for (const f of studyFiles(l, book, "-PROPHECY.md")) {
          const raw = read(l, book, "study", f);
          const ch = Number(f.match(/\d+/)?.[0]);
          check(
            `${book}/${f}`,
            raw,
            parseProphecyMarkdown(raw, book, ch).sources,
          );
        }
        const intro = read(l, book, "INTRODUCTION.md");
        check(
          `${book}/INTRODUCTION.md`,
          intro,
          parseIntroductionMarkdown(intro, book).sources,
        );
        if (existsSync(path.join(CONTENT, l, book, "PEOPLE.md"))) {
          const raw = read(l, book, "PEOPLE.md");
          check(
            `${book}/PEOPLE.md`,
            raw,
            parsePeopleMarkdown(raw, book).sources,
          );
        }
      }
      perLocale.set(l, n);
    }
    expect(bad).toEqual([]);
    // Every locale carries the same Sources blocks (59 each on 2026-11-20); a
    // content batch adding one must add it in all four locales.
    expect(new Set(perLocale.values()).size).toBe(1);
  });
  it("every companion keeps ≥ 1 section besides Sources (the Deeper door set is unchanged)", () => {
    // Sources stopped being a section in Step 4 batch 1; hasDeeperContent and
    // the Deeper tabs count `sections`, so a companion whose only section was
    // Sources would silently lose its Deeper page.
    const empty: string[] = [];
    for (const l of locales)
      for (const book of AVAILABLE_BOOKS)
        for (const f of studyFiles(l, book, "-CONTEXT.md")) {
          const ch = Number(f.match(/\d+/)?.[0]);
          const d = parseEnrichmentMarkdown(
            read(l, book, "study", f),
            book,
            ch,
          );
          if (d.sections.length === 0) empty.push(`${l}/${book}/${f}`);
        }
    expect(empty).toEqual([]);
  });
});
