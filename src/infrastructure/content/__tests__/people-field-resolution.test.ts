import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { AVAILABLE_BOOKS, PILOT_BOOKS } from "@/domain/books/registry";
import type { PersonEntry } from "@/domain/content/types";
import { locales } from "@/infrastructure/i18n/config";
import { resolveField } from "../people-fields";
import { parsePeopleMarkdown } from "../people-parser";

/**
 * Step 2 (PLAN_SAFETY_NET.md WS4.3, review F3). PEOPLE.md field labels are
 * resolved to typed fields by `resolveField`; a label a locale spells
 * differently silently stays untyped, and the old substring fallback even
 * matched aliases INSIDE words (Luke's "Note — divergence from Matthew" became
 * a cross-book pointer and was dropped from the card). These tests read the
 * real content, so a new locale spelling that fails to resolve turns red.
 */

const ROOT = process.cwd();

/** Typed (non-display) fields a person resolves — compared across locales. */
function typedFields(p: PersonEntry): string[] {
  const skip = new Set([
    "slug",
    "name",
    "familiarName",
    "suffix",
    "rawFields",
    "note",
    "mentionedIn",
    "originType",
  ]);
  // Empty values count as absent: required fields (e.g. firstMention) default
  // to "" / [] when their label fails to resolve, so `!== undefined` alone
  // would let a misspelled label pass (caught by mutation-testing this test).
  const present = (v: unknown) =>
    v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0);
  return Object.keys(p)
    .filter(
      (k) =>
        !skip.has(k) && present((p as unknown as Record<string, unknown>)[k]),
    )
    .sort();
}

function people(locale: string, book: string): PersonEntry[] | null {
  const f = path.join(ROOT, "content", locale, book, "PEOPLE.md");
  if (!existsSync(f)) return null;
  return parsePeopleMarkdown(readFileSync(f, "utf-8"), book).entries;
}

/**
 * Typed fields an EN person has that its locale twin legitimately lacks,
 * keyed `book|index|locale`. Must stay exact: fixing a gap means deleting it.
 * - genesis #15 regionsByText: the regions-by-text data was authored in EN only.
 */
const KNOWN_FIELD_GAPS: Record<string, string[]> = {
  "genesis|15|pt-br": ["regionsByText"],
  "genesis|15|de": ["regionsByText"],
  "genesis|15|es": ["regionsByText"],
};

const books = AVAILABLE_BOOKS.filter(
  (b) => !(PILOT_BOOKS as readonly string[]).includes(b),
);

describe("people field resolution", () => {
  it("rejects aliases found inside other words (regression: review F3)", () => {
    expect(
      resolveField(
        "Note — divergence from Matthew (crux, flagged for Hellenist review)",
      ),
    ).toBeUndefined();
    expect(resolveField("Querverweis")).toBeUndefined();
    expect(resolveField("Redaktionelle Herkunft")).toBeUndefined();
  });

  it("still resolves start-anchored labels and the Step-2 locale aliases", () => {
    expect(resolveField("Key events in 1 Peter")).toBe("keyEvents");
    expect(resolveField("Erstnennung in Matthäus")).toBe("firstMention");
    expect(resolveField("Erstnennung")).toBe("firstMention");
    expect(resolveField("In der Apostelgeschichte")).toBe("inBook");
    expect(resolveField("Esposo/a(s)")).toBe("spouses");
    expect(resolveField("Sterbejahr")).toBe("deathYear");
    expect(resolveField("Status der Historizität")).toBe("historicityStatus");
    expect(resolveField("Bücher in denen er vorkommt")).toBe(
      "booksAppearingIn",
    );
  });

  it("every locale person resolves the same typed fields as its EN twin", () => {
    const gaps: Record<string, string[]> = {};
    for (const book of books) {
      const en = people("en", book);
      expect(en, `content/en/${book}/PEOPLE.md missing`).not.toBeNull();
      for (const locale of locales.filter((l) => l !== "en")) {
        const loc = people(locale, book);
        expect(
          loc,
          `content/${locale}/${book}/PEOPLE.md missing`,
        ).not.toBeNull();
        expect(
          loc?.length,
          `${locale}/${book}: person count differs from EN`,
        ).toBe(en?.length);
        en?.forEach((p, i) => {
          const mine = new Set(typedFields(loc?.[i] as PersonEntry));
          const missing = typedFields(p).filter((k) => !mine.has(k));
          if (missing.length) gaps[`${book}|${i}|${locale}`] = missing;
        });
      }
    }
    expect(gaps).toEqual(KNOWN_FIELD_GAPS);
  });

  it("every cross-book see-stub carries a typed in-book role (B11 class)", () => {
    const missing: string[] = [];
    for (const book of books)
      for (const locale of locales)
        for (const p of people(locale, book) ?? [])
          if (p.crossBookSee && !p.inBook)
            missing.push(`${locale}/${book}: ${p.name}`);
    expect(missing).toEqual([]);
  });
});
