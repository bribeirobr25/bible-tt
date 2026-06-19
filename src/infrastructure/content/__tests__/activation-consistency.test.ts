import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { AVAILABLE_BOOKS } from "@/domain/books/registry";
import { locales } from "@/infrastructure/i18n/config";

/**
 * Phase 0 — activation-consistency gate.
 *
 * `AVAILABLE_BOOKS` is the single source of truth for what is *published*
 * (see `content-loader.ts`: `getAvailableBooks`/`getAllChapterParams` filter
 * through it). Drafted-but-not-activated books may sit in `content/` and stay
 * invisible. But the moment a slug IS activated, it must be wired into every
 * other place a book is referenced — otherwise it ships half-built (e.g. a
 * Hebrew book mislabelled "Greek Scriptures", or content that escapes linting).
 *
 * This test fails loudly on any such partial activation, so a new book is a red
 * build, not an invisible one. It is the machine backstop for the §5 activation
 * checklist in docs/audit/MULTI_BOOK_EXPANSION_PLAN.md.
 */

const ROOT = process.cwd();
const read = (p: string) => readFileSync(path.join(ROOT, p), "utf8");

function extractArrayLiteral(src: string, name: string): string[] {
  const m = src.match(new RegExp(`${name}\\s*=\\s*\\[([^\\]]*)\\]`));
  if (!m) return [];
  return [...m[1].matchAll(/["']([^"']+)["']/g)].map((x) => x[1]);
}

function extractSetLiteral(src: string, name: string): string[] {
  const m = src.match(new RegExp(`${name}\\s*=\\s*new Set\\(\\[([^\\]]*)\\]`));
  if (!m) return [];
  return [...m[1].matchAll(/["']([^"']+)["']/g)].map((x) => x[1]);
}

const active = [...AVAILABLE_BOOKS];

const booksPageSrc = read("src/app/[locale]/books/page.tsx");
const bookHubSrc = read("src/app/[locale]/[book]/page.tsx");
const contentLintSrc = read("scripts/content-lint.sh");

const BOOK_ORDER = extractArrayLiteral(booksPageSrc, "BOOK_ORDER");
const HEBREW_INDEX = extractSetLiteral(booksPageSrc, "HEBREW_BIBLE");
const HEBREW_HUB = extractSetLiteral(bookHubSrc, "HEBREW_BIBLE");

describe("Phase 0 — activation consistency", () => {
  it("found the constants it audits (guards against a refactor silently disabling this test)", () => {
    expect(BOOK_ORDER.length).toBeGreaterThan(0);
    expect(HEBREW_INDEX.length).toBeGreaterThan(0);
    expect(HEBREW_HUB.length).toBeGreaterThan(0);
  });

  it("every activated book has content (content/en/<slug>/CHAPTER-1.md)", () => {
    for (const book of active) {
      expect(
        existsSync(path.join(ROOT, "content", "en", book, "CHAPTER-1.md")),
        `activated book "${book}" has no content/en/${book}/CHAPTER-1.md`,
      ).toBe(true);
    }
  });

  it("every activated book is in /books BOOK_ORDER", () => {
    for (const book of active) {
      expect(
        BOOK_ORDER,
        `"${book}" missing from BOOK_ORDER in books/page.tsx`,
      ).toContain(book);
    }
  });

  it("BOOK_ORDER lists only activated books", () => {
    for (const book of BOOK_ORDER) {
      expect(
        active,
        `BOOK_ORDER lists "${book}" which is not in AVAILABLE_BOOKS`,
      ).toContain(book);
    }
  });

  it("the two HEBREW_BIBLE corpus-label sets agree", () => {
    expect([...HEBREW_INDEX].sort()).toEqual([...HEBREW_HUB].sort());
  });

  it("every HEBREW_BIBLE entry is an activated book", () => {
    for (const book of HEBREW_HUB) {
      expect(
        active,
        `HEBREW_BIBLE tags "${book}" which is not activated`,
      ).toContain(book);
    }
  });

  it("every activated book has a book.<slug> label in all locales", () => {
    for (const locale of locales) {
      const messages = JSON.parse(
        read(`src/infrastructure/i18n/messages/${locale}.json`),
      );
      for (const book of active) {
        expect(
          messages?.book?.[book],
          `missing i18n book.${book} in ${locale}.json`,
        ).toBeTruthy();
      }
    }
  });

  it("every activated book is covered by content-lint (CONTENT_DIRS)", () => {
    for (const book of active) {
      expect(
        contentLintSrc.includes(`content/en/${book}`),
        `content-lint.sh does not reference content/en/${book} — new book would be silently unlinted`,
      ).toBe(true);
    }
  });
});
