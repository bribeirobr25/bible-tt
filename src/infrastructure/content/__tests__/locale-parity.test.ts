import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { AVAILABLE_BOOKS, PILOT_BOOKS } from "@/domain/books/registry";
import { locales } from "@/infrastructure/i18n/config";

/**
 * Step 2 (PLAN_SAFETY_NET.md WS4.1) — cross-locale parity. PT-BR/DE/ES are
 * mirror-propagated from EN; propagation agents have silently dropped markers
 * and companion entries before (playbook T-17/T-18). Deterministic structural
 * checks only. Known gaps are listed EXACTLY (file × locale): the test fails
 * if a gap changes in either direction, so fixing one forces its removal here.
 */

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content");
const NON_EN = locales.filter((l) => l !== "en");
const books = AVAILABLE_BOOKS.filter(
  (b) => !(PILOT_BOOKS as readonly string[]).includes(b),
);

function listMd(dir: string, base = dir): string[] {
  if (!existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) out.push(...listMd(p, base));
    else if (name.endsWith(".md")) out.push(path.relative(base, p));
  }
  return out.sort();
}
const read = (locale: string, book: string, rel: string) =>
  readFileSync(path.join(CONTENT, locale, book, rel), "utf-8");
const count = (s: string, re: RegExp) => (s.match(re) ?? []).length;

const VERSE_HEADER = /^### \*\*(?:Verse|Versículo|Versiculo|Vers) (\d+)\*\*$/gm;
const DUAL_LABEL = /^\*\*\[(.+?)\s*(?:—|–|--)\s*(.+?)\]\*\*\s*$/gm;

/** Companion `### ` entries missing in a locale — [EN count, locale count]. Step 4b D12. */
const KNOWN_ENTRY_GAPS: Record<string, [number, number]> = {
  "genesis/study/CHAPTER-1-CONTEXT.md|pt-br": [55, 53],
  "genesis/study/CHAPTER-1-CONTEXT.md|de": [55, 53],
  "genesis/study/CHAPTER-1-CONTEXT.md|es": [55, 53],
  "genesis/study/CHAPTER-7-CONTEXT.md|pt-br": [33, 32],
  "genesis/study/CHAPTER-7-CONTEXT.md|de": [33, 32],
  "genesis/study/CHAPTER-7-CONTEXT.md|es": [33, 32],
  "genesis/study/CHAPTER-9-CONTEXT.md|pt-br": [39, 38],
  "genesis/study/CHAPTER-9-CONTEXT.md|es": [39, 38],
  "genesis/study/CHAPTER-11-CONTEXT.md|pt-br": [27, 26],
  "genesis/study/CHAPTER-11-CONTEXT.md|de": [27, 26],
  "genesis/study/CHAPTER-11-CONTEXT.md|es": [27, 26],
  "john/study/CHAPTER-1-CONTEXT.md|pt-br": [34, 25],
  "john/study/CHAPTER-1-CONTEXT.md|de": [34, 25],
  "john/study/CHAPTER-1-CONTEXT.md|es": [34, 25],
  "john/study/CHAPTER-2-CONTEXT.md|pt-br": [20, 19],
  "john/study/CHAPTER-2-CONTEXT.md|de": [20, 19],
  "john/study/CHAPTER-2-CONTEXT.md|es": [20, 19],
  "john/study/CHAPTER-3-CONTEXT.md|pt-br": [20, 19],
  "john/study/CHAPTER-3-CONTEXT.md|de": [20, 19],
  "john/study/CHAPTER-3-CONTEXT.md|es": [20, 19],
  "matthew/study/CHAPTER-1-CONTEXT.md|pt-br": [27, 21],
  "matthew/study/CHAPTER-1-CONTEXT.md|de": [27, 21],
  "matthew/study/CHAPTER-1-CONTEXT.md|es": [27, 21],
  "matthew/study/CHAPTER-2-CONTEXT.md|pt-br": [17, 15],
  "matthew/study/CHAPTER-2-CONTEXT.md|de": [17, 15],
  "matthew/study/CHAPTER-2-CONTEXT.md|es": [17, 15],
  "matthew/study/CHAPTER-3-CONTEXT.md|pt-br": [18, 17],
  "matthew/study/CHAPTER-3-CONTEXT.md|de": [18, 17],
  "matthew/study/CHAPTER-3-CONTEXT.md|es": [18, 17],
};

/** Companion dual-label line counts that differ — [EN, locale]. Mostly follow the entry gaps. */
const KNOWN_LABEL_GAPS: Record<string, [number, number]> = {
  "genesis/study/CHAPTER-1-CONTEXT.md|pt-br": [95, 93],
  "genesis/study/CHAPTER-1-CONTEXT.md|de": [95, 93],
  "genesis/study/CHAPTER-1-CONTEXT.md|es": [95, 93],
  "genesis/study/CHAPTER-7-CONTEXT.md|pt-br": [47, 46],
  "genesis/study/CHAPTER-7-CONTEXT.md|de": [47, 46],
  "genesis/study/CHAPTER-7-CONTEXT.md|es": [47, 46],
  "genesis/study/CHAPTER-9-CONTEXT.md|pt-br": [54, 53],
  "genesis/study/CHAPTER-9-CONTEXT.md|es": [54, 53],
  "genesis/study/CHAPTER-11-CONTEXT.md|pt-br": [39, 38],
  "genesis/study/CHAPTER-11-CONTEXT.md|de": [39, 38],
  "genesis/study/CHAPTER-11-CONTEXT.md|es": [39, 38],
  "genesis/study/CHAPTER-12-CONTEXT.md|pt-br": [40, 41],
  "john/study/CHAPTER-1-CONTEXT.md|pt-br": [52, 43],
  "john/study/CHAPTER-1-CONTEXT.md|de": [52, 43],
  "john/study/CHAPTER-1-CONTEXT.md|es": [52, 43],
  "john/study/CHAPTER-2-CONTEXT.md|pt-br": [26, 25],
  "john/study/CHAPTER-2-CONTEXT.md|de": [26, 25],
  "john/study/CHAPTER-2-CONTEXT.md|es": [26, 25],
  "john/study/CHAPTER-3-CONTEXT.md|pt-br": [25, 24],
  "john/study/CHAPTER-3-CONTEXT.md|de": [25, 24],
  "john/study/CHAPTER-3-CONTEXT.md|es": [25, 24],
  "matthew/study/CHAPTER-1-CONTEXT.md|pt-br": [31, 25],
  "matthew/study/CHAPTER-1-CONTEXT.md|de": [31, 25],
  "matthew/study/CHAPTER-1-CONTEXT.md|es": [31, 25],
  "matthew/study/CHAPTER-2-CONTEXT.md|pt-br": [22, 20],
  "matthew/study/CHAPTER-2-CONTEXT.md|de": [22, 20],
  "matthew/study/CHAPTER-2-CONTEXT.md|es": [22, 20],
  "matthew/study/CHAPTER-3-CONTEXT.md|pt-br": [24, 23],
  "matthew/study/CHAPTER-3-CONTEXT.md|de": [24, 23],
  "matthew/study/CHAPTER-3-CONTEXT.md|es": [24, 23],
};

describe("cross-locale parity (EN ↔ PT-BR / DE / ES)", () => {
  it("has books to check (guards against a vacuous run)", () => {
    expect(books.length).toBeGreaterThan(0);
  });

  it("every locale has exactly EN's file set per book", () => {
    for (const book of books) {
      const en = listMd(path.join(CONTENT, "en", book));
      expect(en.length, `content/en/${book} is empty`).toBeGreaterThan(0);
      for (const l of NON_EN)
        expect(
          listMd(path.join(CONTENT, l, book)),
          `${l}/${book} file set`,
        ).toEqual(en);
    }
  });

  it("every chapter has EN's verse-number sequence in every locale", () => {
    for (const book of books)
      for (const rel of listMd(path.join(CONTENT, "en", book)).filter((r) =>
        /^CHAPTER-\d+\.md$/.test(r),
      )) {
        const seq = (l: string) =>
          [...read(l, book, rel).matchAll(VERSE_HEADER)].map((m) =>
            Number(m[1]),
          );
        const en = seq("en");
        expect(en.length, `en/${book}/${rel} has no verses`).toBeGreaterThan(0);
        for (const l of NON_EN)
          expect(seq(l), `${l}/${book}/${rel}`).toEqual(en);
      }
  });

  it("every file has EN's @@ / {a: / {t: marker counts", () => {
    const diffs: string[] = [];
    for (const book of books)
      for (const rel of listMd(path.join(CONTENT, "en", book))) {
        const c = (l: string) => {
          const s = read(l, book, rel);
          return [count(s, /@@/g), count(s, /\{a:/g), count(s, /\{t:/g)].join(
            "/",
          );
        };
        const en = c("en");
        for (const l of NON_EN)
          if (c(l) !== en)
            diffs.push(`${l}/${book}/${rel}: ${c(l)} vs EN ${en}`);
      }
    expect(diffs).toEqual([]);
  });

  it("INTRODUCTION / book CONTEXT / PROPHECY entry + dual-label counts match EN exactly", () => {
    // Implementation review R2: whole-entry deletions in these file kinds were
    // not caught (only companions were compared). All at parity today.
    const kinds: [RegExp, RegExp][] = [
      [/^INTRODUCTION\.md$/, /^### /gm],
      [/^CONTEXT\.md$/, /^## /gm],
      [/-PROPHECY\.md$/, /^## /gm],
    ];
    const diffs: string[] = [];
    for (const book of books)
      for (const rel of listMd(path.join(CONTENT, "en", book)))
        for (const [file, heading] of kinds) {
          if (!file.test(path.basename(rel))) continue;
          const en = read("en", book, rel);
          const want = `${count(en, heading)}/${count(en, DUAL_LABEL)}`;
          for (const l of NON_EN) {
            const t = read(l, book, rel);
            const got = `${count(t, heading)}/${count(t, DUAL_LABEL)}`;
            if (got !== want)
              diffs.push(`${l}/${book}/${rel}: ${got} vs EN ${want}`);
          }
        }
    expect(diffs).toEqual([]);
  });

  it("companion entry and dual-label counts match EN except the listed gaps", () => {
    const entry: Record<string, [number, number]> = {};
    const label: Record<string, [number, number]> = {};
    for (const book of books)
      for (const rel of listMd(path.join(CONTENT, "en", book)).filter((r) =>
        r.endsWith("-CONTEXT.md"),
      )) {
        const en = read("en", book, rel);
        const enE = count(en, /^### /gm);
        const enL = count(en, DUAL_LABEL);
        for (const l of NON_EN) {
          const t = read(l, book, rel);
          const e = count(t, /^### /gm);
          const lb = count(t, DUAL_LABEL);
          if (e !== enE) entry[`${book}/${rel}|${l}`] = [enE, e];
          if (lb !== enL) label[`${book}/${rel}|${l}`] = [enL, lb];
        }
      }
    expect(entry).toEqual(KNOWN_ENTRY_GAPS);
    expect(label).toEqual(KNOWN_LABEL_GAPS);
  });
});
