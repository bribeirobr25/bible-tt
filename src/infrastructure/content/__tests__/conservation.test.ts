import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
  emitBookContext,
  emitChapter,
  emitEnrichment,
  emitIntroduction,
  emitPeople,
  emitProphecy,
  type StructuredKind,
  type StructuredUnit,
} from "@/domain/content/structured";
import { getStructuredBook } from "@/lib/content-loader";
import { parseBookContextMarkdown } from "../book-context-parser";
import {
  parseEnrichmentMarkdown,
  parseIntroductionMarkdown,
} from "../enrichment-parser";
import { parseChapterMarkdown } from "../markdown-parser";
import { parsePeopleMarkdown } from "../people-parser";
import { parseProphecyMarkdown } from "../prophecy-parser";

/**
 * Phase 2 — Conservation gate.
 *
 * Proves the structured layer (src/domain/content/structured.ts) puts EVERYTHING
 * under the new structure with nothing lost or forgotten. Four gates over every
 * content file on disk:
 *   1. Inventory       — every .md is classified to a parser and yields ≥1 unit.
 *   2. Count           — emitted unit counts equal the parser's domain arrays.
 *   3. Content         — emitted text multiset equals the parser's field multiset.
 *   4. ID integrity    — IDs unique per locale, deterministic on re-emit.
 *
 * Gates 2 & 3 recompute expectations directly from the parsed domain object
 * (independent of the emitter's id logic), so an emitter that drops or mangles
 * a unit fails the build.
 */

const CONTENT_ROOT = path.join(process.cwd(), "content");

type FileKind =
  | "chapter"
  | "enrichment"
  | "prophecy"
  | "people"
  | "introduction"
  | "book-context";

interface ContentFile {
  absPath: string;
  relPath: string;
  locale: string;
  book: string;
  chapter: number | null;
  fileKind: FileKind;
}

const norm = (s: string): string => s.replace(/\s+/g, " ").trim();

function multiset(values: string[]): string[] {
  return values.map(norm).sort();
}

function textsOf(units: StructuredUnit[], kind: StructuredKind): string[] {
  return units.filter((u) => u.kind === kind).map((u) => u.text);
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

/** Classify a content file by its path. Returns null if unrecognized (Gate 1). */
function classify(absPath: string): ContentFile | null {
  const relPath = path.relative(CONTENT_ROOT, absPath);
  const parts = relPath.split(path.sep);
  // expected: {locale}/{book}/[study/]{FILE}.md
  if (parts.length < 3) return null;
  const [locale, book] = parts;
  const fileName = parts[parts.length - 1];
  const inStudy = parts[2] === "study";

  const base = { absPath, relPath, locale, book };

  if (!inStudy) {
    const ch = /^CHAPTER-(\d+)\.md$/.exec(fileName);
    if (ch) return { ...base, chapter: Number(ch[1]), fileKind: "chapter" };
    if (fileName === "PEOPLE.md")
      return { ...base, chapter: null, fileKind: "people" };
    if (fileName === "INTRODUCTION.md")
      return { ...base, chapter: null, fileKind: "introduction" };
    if (fileName === "CONTEXT.md")
      return { ...base, chapter: null, fileKind: "book-context" };
    return null;
  }

  const ctx = /^CHAPTER-(\d+)-CONTEXT\.md$/.exec(fileName);
  if (ctx) return { ...base, chapter: Number(ctx[1]), fileKind: "enrichment" };
  const prophecy = /^CHAPTER-(\d+)-PROPHECY\.md$/.exec(fileName);
  if (prophecy)
    return { ...base, chapter: Number(prophecy[1]), fileKind: "prophecy" };
  return null;
}

/** Parse + emit a classified file. Returns its units and the per-kind expected
 *  text multisets recomputed straight from the parsed domain object. */
async function emitFile(file: ContentFile): Promise<{
  units: StructuredUnit[];
  expected: Partial<Record<StructuredKind, string[]>>;
}> {
  const raw = await fs.readFile(file.absPath, "utf-8");

  switch (file.fileKind) {
    case "chapter": {
      const d = parseChapterMarkdown(raw, file.book, file.chapter as number);
      return {
        units: emitChapter(d),
        expected: {
          "chapter-overview": d.overview?.trim() ? [d.overview] : [],
          "reading-guide": d.readingGuide?.trim() ? [d.readingGuide] : [],
          paragraph: d.continuousReading.map((p) => p.text),
          verse: d.verses.map((v) => v.mainText),
          note: d.verses.flatMap((v) => v.notes.map((n) => n.content)),
          glossary: d.glossary.map((g) => g.notes),
          supplementary: d.supplementarySections.map((s) => s.content),
        },
      };
    }
    case "enrichment": {
      const d = parseEnrichmentMarkdown(raw, file.book, file.chapter as number);
      return {
        units: emitEnrichment(d),
        expected: {
          "enrichment-disclaimer": d.disclaimer.trim() ? [d.disclaimer] : [],
          "enrichment-section": d.sections.map((s) => s.title),
          // §I group entries conserve their scenario heading (no own prose);
          // single-level entries conserve their body.
          "enrichment-entry": d.sections.flatMap((s) =>
            s.entries.map((e) =>
              e.subEntries && e.subEntries.length > 0 ? e.title : e.content,
            ),
          ),
          "enrichment-subentry": d.sections.flatMap((s) =>
            s.entries.flatMap((e) =>
              (e.subEntries ?? []).map((se) => se.content),
            ),
          ),
        },
      };
    }
    case "introduction": {
      const d = parseIntroductionMarkdown(raw, file.book);
      return {
        units: emitIntroduction(d),
        expected: {
          "intro-disclaimer": d.disclaimer.trim() ? [d.disclaimer] : [],
          "intro-section": d.sections.map((s) => s.title),
          "intro-entry": d.sections.flatMap((s) =>
            s.entries.map((e) => e.content),
          ),
        },
      };
    }
    case "prophecy": {
      const d = parseProphecyMarkdown(raw, file.book, file.chapter as number);
      return {
        units: emitProphecy(d),
        expected: {
          "prophecy-entry": d.entries.map((e) => e.textSays),
          "prophecy-reading": d.entries.flatMap((e) =>
            e.readings.map((r) => r.reading),
          ),
        },
      };
    }
    case "people": {
      const d = parsePeopleMarkdown(raw, file.book);
      return {
        units: emitPeople(d),
        expected: {
          person: d.entries.map((p) => p.name),
          "person-curiosity": d.entries.flatMap((p) =>
            (p.curiosities ?? []).map((c) => c.content),
          ),
          "person-generation": d.entries.flatMap((p) =>
            (p.generationsFrom ?? []).map((g) => g.reference),
          ),
          "person-region": d.entries.flatMap((p) =>
            (p.regionsByText ?? []).map((r) => r.region),
          ),
        },
      };
    }
    case "book-context": {
      const d = parseBookContextMarkdown(raw, file.book, file.locale);
      return {
        units: emitBookContext(d),
        expected: {
          "book-context-disclaimer": d.disclaimer.trim() ? [d.disclaimer] : [],
          motif: d.motifs.map((m) => m.body),
        },
      };
    }
  }
}

describe("Phase 2 conservation gate", () => {
  it("Gate 1 — inventory: every .md is classified and yields ≥1 structured unit", async () => {
    const allMd = await walk(CONTENT_ROOT);
    expect(allMd.length).toBeGreaterThan(0);

    const unclassified: string[] = [];
    const empty: string[] = [];

    for (const absPath of allMd) {
      const file = classify(absPath);
      if (!file) {
        unclassified.push(path.relative(CONTENT_ROOT, absPath));
        continue;
      }
      const { units } = await emitFile(file);
      if (units.length === 0) empty.push(file.relPath);
    }

    expect(unclassified, "unclassified/forgotten files").toEqual([]);
    expect(empty, "files producing zero structured units").toEqual([]);
  });

  it("Gate 2 & 3 — count + content conservation across every file", async () => {
    const allMd = await walk(CONTENT_ROOT);
    for (const absPath of allMd) {
      const file = classify(absPath);
      if (!file) continue; // Gate 1 owns this failure
      const { units, expected } = await emitFile(file);

      let expectedTotal = 0;
      for (const [kind, expectedTexts] of Object.entries(expected) as [
        StructuredKind,
        string[],
      ][]) {
        expectedTotal += expectedTexts.length;
        const emitted = textsOf(units, kind);
        // Gate 2 — count
        expect(emitted.length, `${file.relPath} :: ${kind} count`).toBe(
          expectedTexts.length,
        );
        // Gate 3 — content multiset (whitespace-normalized)
        expect(multiset(emitted), `${file.relPath} :: ${kind} content`).toEqual(
          multiset(expectedTexts),
        );
      }

      // Gate 2b — totality: every emitted unit belongs to a verified kind, so
      // no unit can escape the per-kind checks above (e.g. an emitter that
      // started producing a kind absent from `expected`).
      expect(
        units.length,
        `${file.relPath} :: every emitted unit accounted for`,
      ).toBe(expectedTotal);
    }
  });

  it("Gate 4 — ID integrity: unique per locale + deterministic on re-emit", async () => {
    const allMd = await walk(CONTENT_ROOT);
    const idsByLocale = new Map<string, Map<string, string>>();

    for (const absPath of allMd) {
      const file = classify(absPath);
      if (!file) continue;
      const first = (await emitFile(file)).units;
      const second = (await emitFile(file)).units;

      // Deterministic: same input → identical ids in identical order.
      expect(
        second.map((u) => u.id),
        `${file.relPath} :: ids deterministic`,
      ).toEqual(first.map((u) => u.id));

      const seen = idsByLocale.get(file.locale) ?? new Map<string, string>();
      for (const u of first) {
        const prior = seen.get(u.id);
        expect(
          prior,
          `duplicate id "${u.id}" in ${file.locale}: ${prior} vs ${file.relPath}`,
        ).toBeUndefined();
        seen.set(u.id, file.relPath);
      }
      idsByLocale.set(file.locale, seen);
    }

    // Sanity: we actually exercised all four locales.
    expect([...idsByLocale.keys()].sort()).toEqual(["de", "en", "es", "pt-br"]);
  });

  it("reports the structured-unit inventory (no silent caps)", async () => {
    const allMd = await walk(CONTENT_ROOT);
    const byKind = new Map<string, number>();
    let total = 0;
    let files = 0;
    for (const absPath of allMd) {
      const file = classify(absPath);
      if (!file) continue;
      files += 1;
      const { units } = await emitFile(file);
      for (const u of units) {
        byKind.set(u.kind, (byKind.get(u.kind) ?? 0) + 1);
        total += 1;
      }
    }
    const breakdown = [...byKind.entries()]
      .sort()
      .map(([k, n]) => `${k}=${n}`)
      .join(" ");
    console.log(
      `[conservation] ${files} files → ${total} units :: ${breakdown}`,
    );
    expect(total).toBeGreaterThan(0);
  });
});

describe("getStructuredBook seam (pilot: John)", () => {
  it("assembles a non-empty, unit-typed structured layer for en/john", async () => {
    const units = await getStructuredBook("en", "john");
    expect(units.length).toBeGreaterThan(0);

    // Pilot book exercises every parser → expect the marquee kinds present.
    const kinds = new Set(units.map((u) => u.kind));
    for (const expected of [
      "verse",
      "note",
      "enrichment-entry",
      "intro-section",
      "prophecy-entry",
      "person",
      "motif",
    ] as const) {
      expect(kinds.has(expected), `missing kind: ${expected}`).toBe(true);
    }
  });

  it("produces unique ids within the assembled book", async () => {
    const units = await getStructuredBook("en", "john");
    const ids = units.map((u) => u.id);
    expect(new Set(ids).size, "duplicate ids in getStructuredBook").toBe(
      ids.length,
    );
  });

  it("returns an empty layer for an unknown book (no throw)", async () => {
    const units = await getStructuredBook("en", "nonexistent-book");
    expect(units).toEqual([]);
  });
});

describe("Phase 4 — chapter completeness guard", () => {
  it("every CHAPTER-N.md parses ≥1 verse, ≥1 paragraph, and an overview", async () => {
    // Guards against a localized section-header typo silently emptying a door
    // (e.g. ES John's unaccented "VERSICULO" header → 0 verses → empty Notes).
    const allMd = await walk(CONTENT_ROOT);
    const emptyVerses: string[] = [];
    const emptyContinuous: string[] = [];
    const missingOverview: string[] = [];
    const titleLeak: string[] = [];
    const emptyMetadata: string[] = [];
    // A title/edition block leaking into supplementary (e.g. an unrecognized
    // localized "TT" title) would render as a junk study card.
    const TITLE_RE =
      /Transparent Translation|Tradução Transparente|Transparente Übersetzung|Traducción Transparente/i;

    for (const absPath of allMd) {
      const file = classify(absPath);
      if (!file || file.fileKind !== "chapter") continue;
      const raw = await fs.readFile(absPath, "utf-8");
      const d = parseChapterMarkdown(raw, file.book, file.chapter as number);
      if (d.verses.length === 0) emptyVerses.push(file.relPath);
      if (d.continuousReading.length === 0) emptyContinuous.push(file.relPath);
      if (!d.overview) missingOverview.push(file.relPath);
      if (d.supplementarySections.some((s) => TITLE_RE.test(s.title))) {
        titleLeak.push(file.relPath);
      }
      // Metadata block lives in the title section; guard against it silently
      // not parsing (Base Text / Methodology must be populated).
      if (!d.metadata.baseText || !d.metadata.methodology) {
        emptyMetadata.push(file.relPath);
      }
    }

    expect(emptyVerses, "chapters with 0 parsed verses").toEqual([]);
    expect(emptyContinuous, "chapters with 0 parsed paragraphs").toEqual([]);
    expect(missingOverview, "chapters with no parsed overview").toEqual([]);
    expect(titleLeak, "title block leaked into supplementary sections").toEqual(
      [],
    );
    expect(
      emptyMetadata,
      "chapters with empty Base Text / Methodology metadata",
    ).toEqual([]);
  });

  it("no enrichment/introduction file has an unrecognized claim-type or confidence label", async () => {
    // parseClaimType / parseConfidence each warn + fall back on an unknown label
    // (e.g. a localized variant the parser doesn't know). Fail if any warn — the
    // two label dimensions are checked symmetrically so neither can drift.
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const allMd = await walk(CONTENT_ROOT);
    for (const absPath of allMd) {
      const file = classify(absPath);
      if (!file) continue;
      const raw = await fs.readFile(absPath, "utf-8");
      if (file.fileKind === "enrichment") {
        parseEnrichmentMarkdown(raw, file.book, file.chapter as number);
      } else if (file.fileKind === "introduction") {
        parseIntroductionMarkdown(raw, file.book);
      }
    }
    const messages = warn.mock.calls.map((c) => String(c[0]));
    const unrecognizedClaim = messages.filter((m) =>
      m.includes("Unrecognized claim type label"),
    );
    const unrecognizedConfidence = messages.filter((m) =>
      m.includes("Unrecognized confidence label"),
    );
    warn.mockRestore();
    expect(unrecognizedClaim, unrecognizedClaim.join("\n")).toEqual([]);
    expect(unrecognizedConfidence, unrecognizedConfidence.join("\n")).toEqual(
      [],
    );
  });
});
