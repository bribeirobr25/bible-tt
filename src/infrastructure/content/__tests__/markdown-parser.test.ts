import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseChapterMarkdown } from "../markdown-parser";

const ROOT = path.resolve(process.cwd(), "content");

const LOCALES = ["en", "pt-br", "de", "es"] as const;
const CHAPTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

const EXPECTED_VERSE_COUNTS: Record<number, number> = {
  1: 31,
  2: 25,
  3: 24,
  4: 26,
  5: 32,
  6: 22,
  7: 24,
  8: 22,
  9: 29,
  10: 32,
  11: 32,
  12: 20,
};

async function loadChapter(locale: string, chapter: number) {
  const filePath = path.join(ROOT, locale, "genesis", `CHAPTER-${chapter}.md`);
  const raw = await fs.readFile(filePath, "utf-8");
  return parseChapterMarkdown(raw, "genesis", chapter);
}

describe("Markdown Parser", () => {
  for (const locale of LOCALES) {
    for (const chapter of CHAPTERS) {
      describe(`${locale}/genesis/CHAPTER-${chapter}`, () => {
        it("parses without error", async () => {
          const data = await loadChapter(locale, chapter);
          expect(data).toBeDefined();
        });

        it("extracts correct chapter number in metadata", async () => {
          const data = await loadChapter(locale, chapter);
          expect(data.metadata.chapter).toBe(chapter);
          expect(data.metadata.book).toBe("genesis");
        });

        it("extracts edition as Transparent", async () => {
          const data = await loadChapter(locale, chapter);
          expect(data.metadata.edition.toLowerCase()).toContain("transparen");
        });

        it(`extracts ${EXPECTED_VERSE_COUNTS[chapter]} verses`, async () => {
          const data = await loadChapter(locale, chapter);
          expect(data.verses.length).toBe(EXPECTED_VERSE_COUNTS[chapter]);
        });

        it("every verse has non-empty mainText", async () => {
          const data = await loadChapter(locale, chapter);
          for (const verse of data.verses) {
            expect(verse.mainText.trim().length).toBeGreaterThan(0);
          }
        });

        it("verse numbers are sequential", async () => {
          const data = await loadChapter(locale, chapter);
          for (let i = 0; i < data.verses.length; i++) {
            expect(data.verses[i].number).toBe(i + 1);
          }
        });

        it("extracts at least one note across all verses", async () => {
          const data = await loadChapter(locale, chapter);
          const totalNotes = data.verses.reduce(
            (sum, v) => sum + v.notes.length,
            0,
          );
          expect(totalNotes).toBeGreaterThan(0);
        });

        it("every note has a valid type", async () => {
          const data = await loadChapter(locale, chapter);
          const validTypes = [
            "CRITICAL",
            "LEXICAL",
            "GRAMMATICAL",
            "THEOLOGICAL",
          ];
          for (const verse of data.verses) {
            for (const note of verse.notes) {
              expect(validTypes).toContain(note.type);
            }
          }
        });

        it("extracts continuous reading paragraphs", async () => {
          const data = await loadChapter(locale, chapter);
          expect(data.continuousReading.length).toBeGreaterThan(0);
        });

        it("continuous reading contains text content", async () => {
          const data = await loadChapter(locale, chapter);
          const allText = data.continuousReading.map((p) => p.text).join(" ");
          expect(allText.length).toBeGreaterThan(100);
        });

        it("extracts glossary entries", async () => {
          const data = await loadChapter(locale, chapter);
          expect(data.glossary.length).toBeGreaterThan(0);
        });

        it("every glossary entry has sourceWord and translation", async () => {
          const data = await loadChapter(locale, chapter);
          for (const entry of data.glossary) {
            expect(entry.sourceWord.trim().length).toBeGreaterThan(0);
            expect(entry.translation.trim().length).toBeGreaterThan(0);
          }
        });
      });
    }
  }
});

describe("Step 4 batch 1 — parser latent risks", () => {
  const chapter = (body: {
    cr?: string;
    verse?: string;
    glossary?: string;
    extra?: string;
  }) =>
    [
      "# Genesis 1",
      "## The Transparent Translation (TT)",
      "**Status:** provisional",
      "## TABLA DE CONTENIDOS",
      "- a link",
      "## CONTINUOUS READING",
      "*Prose view of the whole chapter. The text is identical to the",
      "verse-by-verse study below.*",
      "",
      body.cr ?? "In the beginning.",
      "## VERSE-BY-VERSE STUDY",
      "### **Verse 1**",
      body.verse ?? "In the beginning.",
      "## GLOSSARY — GENESIS 1",
      body.glossary ??
        "| Hebrew | TT | Notes |\n|---|---|---|\n| *bara* | create | x |",
      body.extra ?? "",
    ].join("\n");

  it("keeps a scripture paragraph that starts with an added word (Rule 11 / L1)", () => {
    const d = parseChapterMarkdown(
      chapter({ cr: "*The* man said to *him*: go.\n\n*Na* carne, ele." }),
      "genesis",
      1,
    );
    expect(d.continuousReading.map((p) => p.text)).toEqual([
      "*The* man said to *him*: go.",
      "*Na* carne, ele.",
    ]);
  });

  it("drops only the wrapped editorial note paragraph", () => {
    const d = parseChapterMarkdown(chapter({}), "genesis", 1);
    expect(d.continuousReading.map((p) => p.text)).toEqual([
      "In the beginning.",
    ]);
  });

  it("keeps verse text authored after the notes or after a rule", () => {
    const d = parseChapterMarkdown(
      chapter({
        verse:
          "In the beginning.\n\n> 🔵 **NOTE**\n> - a note\n\nlater text\n---\nafter rule",
      }),
      "genesis",
      1,
    );
    expect(d.verses[0].mainText).toBe(
      "In the beginning.\nlater text\nafter rule",
    );
    expect(d.verses[0].notes).toHaveLength(1);
  });

  it("a note title ending in bold-italic keeps its italic and leaves no stray star", () => {
    const d = parseChapterMarkdown(
      chapter({
        verse:
          'Grace.\n\n> 🔵 **"GRACE AND PEACE" — *PLĒTHYNTHEIĒ***\n> - **χάρις** (*charis*) = grace.',
      }),
      "genesis",
      1,
    );
    const note = d.verses[0].notes[0];
    expect(note.title).toBe('"GRACE AND PEACE" — *PLĒTHYNTHEIĒ*');
    expect(note.content.startsWith("- **χάρις**")).toBe(true);
  });

  it("keeps empty glossary cells in their column", () => {
    const d = parseChapterMarkdown(
      chapter({
        glossary:
          "| Hebrew | TT | Notes |\n|---|---|---|\n|  | create | only notes |",
      }),
      "genesis",
      1,
    );
    expect(d.glossary[0]).toMatchObject({
      sourceWord: "",
      translation: "create",
      notes: "only notes",
    });
  });

  it("skips the ES 'TABLA DE CONTENIDOS' table of contents (sweep S16)", () => {
    const d = parseChapterMarkdown(chapter({}), "genesis", 1);
    expect(
      d.supplementarySections.map((s) => s.title.toUpperCase()),
    ).not.toContain("TABLA DE CONTENIDOS");
  });
});
