import { describe, it, expect } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { parseChapterMarkdown } from "../markdown-parser";

const ROOT = path.resolve(process.cwd());

const LOCALES = ["en", "pt-br", "de"] as const;
const CHAPTERS = [1, 2, 3] as const;

const EXPECTED_VERSE_COUNTS: Record<number, number> = { 1: 31, 2: 25, 3: 24 };

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
          const totalNotes = data.verses.reduce((sum, v) => sum + v.notes.length, 0);
          expect(totalNotes).toBeGreaterThan(0);
        });

        it("every note has a valid type", async () => {
          const data = await loadChapter(locale, chapter);
          const validTypes = ["CRITICAL", "LEXICAL", "GRAMMATICAL", "THEOLOGICAL"];
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

        it("continuous reading contains verse number markers", async () => {
          const data = await loadChapter(locale, chapter);
          const allText = data.continuousReading.map((p) => p.text).join(" ");
          expect(allText).toContain("¹");
        });

        it("extracts glossary entries", async () => {
          const data = await loadChapter(locale, chapter);
          expect(data.glossary.length).toBeGreaterThan(0);
        });

        it("every glossary entry has hebrew and translation", async () => {
          const data = await loadChapter(locale, chapter);
          for (const entry of data.glossary) {
            expect(entry.hebrew.trim().length).toBeGreaterThan(0);
            expect(entry.translation.trim().length).toBeGreaterThan(0);
          }
        });
      });
    }
  }
});
