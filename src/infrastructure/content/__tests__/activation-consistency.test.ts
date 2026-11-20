import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { AVAILABLE_BOOKS, PILOT_BOOKS } from "@/domain/books/registry";
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

  it("content-lint generates its book lists from content/ (no per-book hardcoding)", () => {
    // Step 2: lists are derived from content/en/*/ so a new book is linted with
    // no script edit. Guard the generator itself (a refactor back to hardcoded
    // lists would silently stop linting new books).
    expect(contentLintSrc).toMatch(/for d in content\/en\/\*\/; do/);
    expect(contentLintSrc).toMatch(/CONTENT_DIRS="\$CONTENT_DIRS \$d"/);
    expect(contentLintSrc).not.toMatch(/CONTENT_DIRS="content\//);
  });

  it("content-lint HB_BOOKS equals the app's HEBREW_BIBLE set", () => {
    const m = contentLintSrc.match(/^HB_BOOKS="([^"]*)"/m);
    expect(
      m,
      "HB_BOOKS definition not found in content-lint.sh",
    ).not.toBeNull();
    const hb = (m?.[1] ?? "").split(/\s+/).filter(Boolean).sort();
    expect(hb).toEqual([...HEBREW_HUB].sort());
  });

  // ── Step 2 (PLAN_SAFETY_NET.md WS4.3): the remaining activation touchpoints ──

  it("people page bookLabels has every activated book (cross-book link labels)", () => {
    const src = read("src/app/[locale]/[book]/people/page.tsx");
    const m = src.match(/bookLabels[^=]*=\s*\{([\s\S]*?)\};/);
    expect(m, "bookLabels map not found").not.toBeNull();
    const keys = [...(m?.[1] ?? "").matchAll(/^\s*"?([a-z0-9-]+)"?\s*:/gm)].map(
      (x) => x[1],
    );
    for (const book of active)
      expect(keys, `bookLabels missing "${book}"`).toContain(book);
  });

  it("RULES-CORE see-target allow-list lists every activated book (scoped to the allow-list table)", () => {
    const rules = read("docs/rules/RULES-CORE.md");
    // Stable anchor prefix (the parenthetical after it may be reworded).
    const anchor = "**Allow-list of valid `**See:**` target slugs";
    const at = rules.indexOf(anchor);
    expect(at, "allow-list anchor not found in RULES-CORE").toBeGreaterThan(-1);
    const lines = rules.slice(at).split("\n").slice(1);
    const start = lines.findIndex((l) => l.startsWith("|"));
    expect(
      start,
      "allow-list table not found after the anchor",
    ).toBeGreaterThan(-1);
    const table: string[] = [];
    for (const l of lines.slice(start)) {
      if (!l.startsWith("|")) break;
      table.push(l);
    }
    const rows = new Map(
      table
        .map((l) => l.match(/^\|\s*`([a-z0-9-]+)`\s*\|\s*([^|]*)\|/))
        .filter((m): m is RegExpMatchArray => !!m)
        .map((m) => [m[1], m[2].trim()] as const),
    );
    expect(rows.size).toBeGreaterThanOrEqual(active.length);
    for (const book of active) {
      expect(
        [...rows.keys()],
        `RULES-CORE allow-list missing \`${book}\``,
      ).toContain(book);
      expect(
        rows.get(book),
        `RULES-CORE allow-list: \`${book}\` is activated, so its status must be "Currently authored …"`,
      ).toMatch(/^Currently authored/);
    }
  });

  // ── Step 4 batch 2 (PLAN_LAUNCH_FIXES §B2.8, PLAN_SAFETY_NET I19) ──

  it("books.heroTagline names every activated book with its chapter range, in every locale", () => {
    const maxChapter = (book: string) =>
      Math.max(
        ...readdirSync(path.join(ROOT, "content", "en", book))
          .map((f) => f.match(/^CHAPTER-(\d+)\.md$/)?.[1])
          .filter((x): x is string => !!x)
          .map(Number),
      );
    for (const locale of locales) {
      const messages = JSON.parse(
        read(`src/infrastructure/i18n/messages/${locale}.json`),
      );
      const tagline: string = messages.books.heroTagline;
      const books = tagline.split(" — ")[0].split(" · ");
      expect(books, `${locale} heroTagline book count`).toHaveLength(
        active.length,
      );
      for (const book of active)
        expect(
          books,
          `${locale} heroTagline missing "${messages.book[book]} 1–${maxChapter(book)}"`,
        ).toContain(`${messages.book[book]} 1–${maxChapter(book)}`);
    }
  });

  it("books.sectionKick counts the activated books, in every locale", () => {
    const NUMBER_WORDS: Record<string, string[]> = {
      en: [
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
      ],
      "pt-br": [
        "Um",
        "Dois",
        "Três",
        "Quatro",
        "Cinco",
        "Seis",
        "Sete",
        "Oito",
        "Nove",
        "Dez",
        "Onze",
        "Doze",
      ],
      de: [
        "Ein",
        "Zwei",
        "Drei",
        "Vier",
        "Fünf",
        "Sechs",
        "Sieben",
        "Acht",
        "Neun",
        "Zehn",
        "Elf",
        "Zwölf",
      ],
      es: [
        "Un",
        "Dos",
        "Tres",
        "Cuatro",
        "Cinco",
        "Seis",
        "Siete",
        "Ocho",
        "Nueve",
        "Diez",
        "Once",
        "Doce",
      ],
    };
    // The words agree with the current nouns (EN books, PT livros, DE Bücher,
    // ES libros — masculine/neuter); a reworded noun may need other forms.
    expect(
      active.length,
      "NUMBER_WORDS covers 1–12 books; extend it",
    ).toBeLessThanOrEqual(12);
    for (const locale of locales) {
      const messages = JSON.parse(
        read(`src/infrastructure/i18n/messages/${locale}.json`),
      );
      const first = (messages.books.sectionKick as string).split(/\s/)[0];
      expect(first, `${locale} sectionKick`).toBe(
        NUMBER_WORDS[locale][active.length - 1],
      );
    }
  });

  it("every activated book has a source-analysis stub, except the known gaps (which may only shrink)", () => {
    const KNOWN_SOURCE_STUB_GAPS = ["john", "matthew"];
    const HEBREW = new Set(HEBREW_HUB);
    const missing = active
      .filter((book) => {
        const dir = path.join(
          ROOT,
          "docs",
          "source-analysis",
          HEBREW.has(book) ? "hebrew" : "greek",
        );
        const re = new RegExp(`^${book.replace(/-/g, "\\-")}(-.*)?\\.md$`);
        return !readdirSync(dir).some((f) => re.test(f));
      })
      .sort();
    expect(missing).toEqual(KNOWN_SOURCE_STUB_GAPS);
  });

  it("no doc names the non-existent people.inBook.{slug} i18n key", () => {
    for (const doc of [
      "docs/rules/RULES-CORE.md",
      "docs/guides/AUTHORING-PLAYBOOK.md",
    ])
      expect(read(doc), doc).not.toMatch(/people\.inBook/);
  });

  it("every activated book has an editorial log", () => {
    for (const book of active)
      expect(
        existsSync(path.join(ROOT, "docs", "editorial-log", `${book}.md`)),
        `docs/editorial-log/${book}.md missing`,
      ).toBe(true);
  });

  it("every activated, non-pilot book exists in every locale", () => {
    for (const book of active) {
      if ((PILOT_BOOKS as readonly string[]).includes(book)) continue;
      for (const locale of locales)
        expect(
          existsSync(path.join(ROOT, "content", locale, book, "CHAPTER-1.md")),
          `content/${locale}/${book}/CHAPTER-1.md missing (or add "${book}" to PILOT_BOOKS)`,
        ).toBe(true);
    }
  });

  it("PILOT_BOOKS only lists activated books", () => {
    for (const book of PILOT_BOOKS) expect(active).toContain(book);
  });
});
