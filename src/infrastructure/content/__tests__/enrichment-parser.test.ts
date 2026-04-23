import { describe, it, expect } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { parseEnrichmentMarkdown } from "../enrichment-parser";

const ROOT = path.resolve(process.cwd());

describe("Enrichment Parser", () => {
  describe("en/genesis/study/CHAPTER-1-CONTEXT.md", () => {
    async function loadEnrichment() {
      const filePath = path.join(ROOT, "en", "genesis", "study", "CHAPTER-1-CONTEXT.md");
      const raw = await fs.readFile(filePath, "utf-8");
      return parseEnrichmentMarkdown(raw, "genesis", 1);
    }

    it("parses without error", async () => {
      const data = await loadEnrichment();
      expect(data).toBeDefined();
    });

    it("extracts correct book and chapter", async () => {
      const data = await loadEnrichment();
      expect(data.book).toBe("genesis");
      expect(data.chapter).toBe(1);
    });

    it("extracts disclaimer text", async () => {
      const data = await loadEnrichment();
      expect(data.disclaimer.length).toBeGreaterThan(0);
      expect(data.disclaimer).toContain("does not redefine");
    });

    it("extracts multiple sections", async () => {
      const data = await loadEnrichment();
      expect(data.sections.length).toBeGreaterThanOrEqual(7);
    });

    it("section A is Hebrew Text Features", async () => {
      const data = await loadEnrichment();
      const sectionA = data.sections.find((s) => s.id === "hebrew-text-features");
      expect(sectionA).toBeDefined();
      expect(sectionA!.entries.length).toBeGreaterThan(0);
    });

    it("section B is ANE Parallels", async () => {
      const data = await loadEnrichment();
      const sectionB = data.sections.find((s) => s.id === "ane-parallels");
      expect(sectionB).toBeDefined();
      expect(sectionB!.entries.length).toBeGreaterThan(0);
    });

    it("entries have claim types and confidence levels", async () => {
      const data = await loadEnrichment();
      const allEntries = data.sections.flatMap((s) => s.entries);
      expect(allEntries.length).toBeGreaterThan(0);
      for (const entry of allEntries) {
        expect(entry.claimType).toBeDefined();
        expect(entry.confidence).toBeDefined();
        expect(entry.title.length).toBeGreaterThan(0);
      }
    });

    it("ANE entries have sources", async () => {
      const data = await loadEnrichment();
      const ane = data.sections.find((s) => s.id === "ane-parallels");
      if (ane) {
        for (const entry of ane.entries) {
          expect(entry.source).toBeDefined();
          expect(entry.source!.length).toBeGreaterThan(0);
        }
      }
    });

    it("sources section exists", async () => {
      const data = await loadEnrichment();
      const sources = data.sections.find((s) => s.id === "sources");
      expect(sources).toBeDefined();
    });
  });
});
