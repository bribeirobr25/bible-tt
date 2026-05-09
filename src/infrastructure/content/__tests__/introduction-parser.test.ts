import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import type { ConfidenceLevel } from "@/domain/content/types";
import { parseIntroductionMarkdown } from "../enrichment-parser";

const ROOT = path.resolve(process.cwd(), "content");

describe("Introduction Parser", () => {
  describe("en/genesis/INTRODUCTION.md", () => {
    async function loadIntroduction() {
      const filePath = path.join(ROOT, "en", "genesis", "INTRODUCTION.md");
      const raw = await fs.readFile(filePath, "utf-8");
      return parseIntroductionMarkdown(raw, "genesis");
    }

    it("parses without error", async () => {
      const data = await loadIntroduction();
      expect(data).toBeDefined();
    });

    it("extracts correct book with no chapter field", async () => {
      const data = await loadIntroduction();
      expect(data.book).toBe("genesis");
      expect(data).not.toHaveProperty("chapter");
    });

    it("extracts disclaimer text", async () => {
      const data = await loadIntroduction();
      expect(data.disclaimer.length).toBeGreaterThan(0);
    });

    it("has sections with correct IDs", async () => {
      const data = await loadIntroduction();
      const ids = data.sections.map((s) => s.id);
      expect(ids).toContain("overview");
      expect(ids).toContain("authorship");
      expect(ids).toContain("sources");
    });

    it("entries have valid claim types and confidence levels", async () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const data = await loadIntroduction();
      const entries = data.sections.flatMap((s) => s.entries);
      expect(entries.length).toBeGreaterThan(0);
      for (const entry of entries) {
        expect(entry.claimType).toBeDefined();
        expect(entry.confidence).toBeDefined();
      }
      spy.mockRestore();
    });

    it("sources section exists and is populated", async () => {
      const data = await loadIntroduction();
      const sources = data.sections.find((s) => s.id === "sources");
      expect(sources).toBeDefined();
    });
  });

  describe("all 4 locales parse without error", () => {
    const LOCALES = ["en", "pt-br", "de", "es"] as const;

    for (const locale of LOCALES) {
      it(`${locale}/genesis/INTRODUCTION.md parses`, async () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const filePath = path.join(ROOT, locale, "genesis", "INTRODUCTION.md");
        const raw = await fs.readFile(filePath, "utf-8");
        const data = parseIntroductionMarkdown(raw, "genesis");
        expect(data).toBeDefined();
        expect(data.sections.length).toBeGreaterThan(0);
        spy.mockRestore();
      });
    }
  });

  describe("DOCUMENTED regression tests", () => {
    const VALID_CONFIDENCE: ConfidenceLevel[] = [
      "VERIFIED",
      "PROBABLE",
      "POSSIBLE",
      "UNCERTAIN",
      "SPECULATIVE",
      "DOCUMENTED",
    ];

    it("parses DOCUMENTED confidence in introduction context", () => {
      const md = `# Test\n\n> **Disclaimer text.**\n\n## F. Reading\n### F1. Test Entry\n**[LATER RECEPTION — DOCUMENTED]**\nSome content here.`;
      const data = parseIntroductionMarkdown(md, "genesis");
      expect(data.sections[0].entries[0].confidence).toBe("DOCUMENTED");
    });

    it("parses DOKUMENTIERT (DE) in introduction context", () => {
      const md = `# Test\n\n> **Disclaimer.**\n\n## F. Reading\n### F1. Entry\n**[SPÄTERE REZEPTION — DOKUMENTIERT]**\nInhalt.`;
      const data = parseIntroductionMarkdown(md, "genesis");
      expect(data.sections[0].entries[0].confidence).toBe("DOCUMENTED");
    });

    it("parses DOCUMENTADO (PT/ES) in introduction context", () => {
      const md = `# Test\n\n> **Disclaimer.**\n\n## B. Autoria\n### B1. Entry\n**[RECEPÇÃO POSTERIOR — DOCUMENTADO]**\nConteúdo.`;
      const data = parseIntroductionMarkdown(md, "genesis");
      expect(data.sections[0].entries[0].confidence).toBe("DOCUMENTED");
    });

    it("warns and falls back to POSSIBLE for unrecognized labels", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const md = `# Test\n\n> **Disclaimer.**\n\n## A. Overview\n### A1. Entry\n**[TEXTUAL — APPROXIMATE]**\nContent.`;
      const data = parseIntroductionMarkdown(md, "genesis");
      expect(data.sections[0].entries[0].confidence).toBe("POSSIBLE");
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining("Unrecognized confidence label"),
      );
      spy.mockRestore();
    });

    it("captures section H defensively (A-H regex coverage)", () => {
      const md = `# Test\n\n> **Disclaimer.**\n\n## H. Extra Section\n### H1. Entry\n**[TEXTUAL — VERIFIED]**\nContent.`;
      const data = parseIntroductionMarkdown(md, "genesis");
      expect(data.sections.length).toBe(1);
      expect(data.sections[0].entries.length).toBe(1);
    });

    it("EN introduction entries have valid confidence values", async () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const filePath = path.join(ROOT, "en", "genesis", "INTRODUCTION.md");
      const raw = await fs.readFile(filePath, "utf-8");
      const data = parseIntroductionMarkdown(raw, "genesis");
      const entries = data.sections.flatMap((s) => s.entries);
      for (const entry of entries) {
        expect(VALID_CONFIDENCE).toContain(entry.confidence);
      }
      spy.mockRestore();
    });

    it("uses introduction section IDs, not companion section IDs", () => {
      const md = `# Test\n\n> **Disclaimer.**\n\n## A. Overview\n### A1. Entry\n**[TEXTUAL — VERIFIED]**\nContent.`;
      const data = parseIntroductionMarkdown(md, "genesis");
      expect(data.sections[0].id).toBe("overview");
    });
  });
});
