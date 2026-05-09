import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import type { ConfidenceLevel } from "@/domain/content/types";
import { parseEnrichmentMarkdown } from "../enrichment-parser";

const ROOT = path.resolve(process.cwd(), "content");

describe("Enrichment Parser", () => {
  describe("en/genesis/study/CHAPTER-1-CONTEXT.md", () => {
    async function loadEnrichment() {
      const filePath = path.join(
        ROOT,
        "en",
        "genesis",
        "study",
        "CHAPTER-1-CONTEXT.md",
      );
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
      const sectionA = data.sections.find(
        (s) => s.id === "source-text-features",
      );
      expect(sectionA).toBeDefined();
      expect(sectionA?.entries.length).toBeGreaterThan(0);
    });

    it("section B is ANE Parallels", async () => {
      const data = await loadEnrichment();
      const sectionB = data.sections.find((s) => s.id === "ane-parallels");
      expect(sectionB).toBeDefined();
      expect(sectionB?.entries.length).toBeGreaterThan(0);
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
          expect(entry.source?.length).toBeGreaterThan(0);
        }
      }
    });

    it("sources section exists", async () => {
      const data = await loadEnrichment();
      const sources = data.sections.find((s) => s.id === "sources");
      expect(sources).toBeDefined();
    });
  });

  describe("es/genesis/study/CHAPTER-1-CONTEXT.md", () => {
    async function loadEnrichment() {
      const filePath = path.join(
        ROOT,
        "es",
        "genesis",
        "study",
        "CHAPTER-1-CONTEXT.md",
      );
      const raw = await fs.readFile(filePath, "utf-8");
      return parseEnrichmentMarkdown(raw, "genesis", 1);
    }

    it("parses without error", async () => {
      const data = await loadEnrichment();
      expect(data).toBeDefined();
    });

    it("extracts disclaimer text in Spanish", async () => {
      const data = await loadEnrichment();
      expect(data.disclaimer.length).toBeGreaterThan(0);
    });

    it("extracts multiple sections", async () => {
      const data = await loadEnrichment();
      expect(data.sections.length).toBeGreaterThanOrEqual(7);
    });

    it("entries have claim types and confidence levels", async () => {
      const data = await loadEnrichment();
      const allEntries = data.sections.flatMap((s) => s.entries);
      expect(allEntries.length).toBeGreaterThan(0);
      for (const entry of allEntries) {
        expect(entry.claimType).toBeDefined();
        expect(entry.confidence).toBeDefined();
      }
    });
  });

  describe("confidence tier parsing", () => {
    const ALL_LEVELS: ConfidenceLevel[] = [
      "VERIFIED",
      "PROBABLE",
      "POSSIBLE",
      "UNCERTAIN",
      "SPECULATIVE",
      "DOCUMENTED",
    ];

    it("parses all 6 EN confidence tiers", () => {
      for (const level of ALL_LEVELS) {
        const md = `## A. Test\n### A1. Entry\n**[TEXTUAL — ${level}]**\nContent here.`;
        const data = parseEnrichmentMarkdown(md, "genesis", 1);
        expect(data.sections[0].entries[0].confidence).toBe(level);
      }
    });

    it("parses DOCUMENTED without coercing to VERIFIED", () => {
      const md = `## F. Reception\n### F1. Entry\n**[LATER RECEPTION — DOCUMENTED]**\nSome reception content.`;
      const data = parseEnrichmentMarkdown(md, "genesis", 1);
      expect(data.sections[0].entries[0].confidence).toBe("DOCUMENTED");
    });

    it("parses DE confidence labels", () => {
      const deMap: [string, ConfidenceLevel][] = [
        ["VERIFIZIERT", "VERIFIED"],
        ["WAHRSCHEINLICH", "PROBABLE"],
        ["MÖGLICH", "POSSIBLE"],
        ["UNGEWISS", "UNCERTAIN"],
        ["SPEKULATIV", "SPECULATIVE"],
        ["DOKUMENTIERT", "DOCUMENTED"],
      ];
      for (const [label, expected] of deMap) {
        const md = `## A. Test\n### A1. Entry\n**[TEXTUAL — ${label}]**\nContent.`;
        const data = parseEnrichmentMarkdown(md, "genesis", 1);
        expect(data.sections[0].entries[0].confidence).toBe(expected);
      }
    });

    it("parses PT-BR confidence labels", () => {
      const ptMap: [string, ConfidenceLevel][] = [
        ["VERIFICADO", "VERIFIED"],
        ["PROVÁVEL", "PROBABLE"],
        ["POSSÍVEL", "POSSIBLE"],
        ["INCERTO", "UNCERTAIN"],
        ["ESPECULATIVO", "SPECULATIVE"],
        ["DOCUMENTADO", "DOCUMENTED"],
      ];
      for (const [label, expected] of ptMap) {
        const md = `## A. Test\n### A1. Entry\n**[TEXTUAL — ${label}]**\nContent.`;
        const data = parseEnrichmentMarkdown(md, "genesis", 1);
        expect(data.sections[0].entries[0].confidence).toBe(expected);
      }
    });

    it("parses ES confidence labels", () => {
      const esMap: [string, ConfidenceLevel][] = [
        ["VERIFICADO", "VERIFIED"],
        ["PROBABLE", "PROBABLE"],
        ["POSIBLE", "POSSIBLE"],
        ["INCIERTO", "UNCERTAIN"],
        ["ESPECULATIVO", "SPECULATIVE"],
        ["DOCUMENTADO", "DOCUMENTED"],
      ];
      for (const [label, expected] of esMap) {
        const md = `## A. Test\n### A1. Entry\n**[TEXTUAL — ${label}]**\nContent.`;
        const data = parseEnrichmentMarkdown(md, "genesis", 1);
        expect(data.sections[0].entries[0].confidence).toBe(expected);
      }
    });

    it("warns on unrecognized labels and falls back to POSSIBLE", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const md = `## A. Test\n### A1. Entry\n**[TEXTUAL — APPROXIMATE]**\nContent.`;
      const data = parseEnrichmentMarkdown(md, "genesis", 1);
      expect(data.sections[0].entries[0].confidence).toBe("POSSIBLE");
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining("Unrecognized confidence label"),
      );
      spy.mockRestore();
    });
  });

  describe("claim type parsing", () => {
    it("parses localized claim types without silent coercion", () => {
      const cases: [string, string][] = [
        ["TEXTUELL", "TEXTUAL"],
        ["VERGLEICHENDE PARALLELE", "COMPARATIVE PARALLEL"],
        ["HISTORISCH / ARCHÄOLOGISCH", "HISTORICAL / ARCHAEOLOGICAL"],
        ["SPÄTERE REZEPTION", "LATER RECEPTION"],
        ["WISSENSCHAFTLICHER VERGLEICH", "SCIENTIFIC COMPARISON"],
        ["MÖGLICHE SCHLUSSFOLGERUNG", "POSSIBLE INFERENCE"],
        ["STARKE SCHLUSSFOLGERUNG", "STRONG INFERENCE"],
        ["PARALELO COMPARATIVO", "COMPARATIVE PARALLEL"],
        ["INFERÊNCIA POSSÍVEL", "POSSIBLE INFERENCE"],
        ["INFERÊNCIA FORTE", "STRONG INFERENCE"],
        ["INFERENCIA POSIBLE", "POSSIBLE INFERENCE"],
        ["INFERENCIA FUERTE", "STRONG INFERENCE"],
        ["RECEPÇÃO POSTERIOR", "LATER RECEPTION"],
        ["RECEPCIÓN POSTERIOR", "LATER RECEPTION"],
        ["HISTÓRICO / ARQUEOLÓGICO", "HISTORICAL / ARCHAEOLOGICAL"],
        ["COMPARAÇÃO CIENTÍFICA", "SCIENTIFIC COMPARISON"],
        ["COMPARACIÓN CIENTÍFICA", "SCIENTIFIC COMPARISON"],
        ["ESPECULAÇÃO", "SPECULATION"],
        ["ESPECULACIÓN", "SPECULATION"],
        ["SPEKULATION", "SPECULATION"],
      ];
      for (const [input, expected] of cases) {
        const md = `## A. Test\n### A1. Entry\n**[${input} — VERIFIED]**\nContent`;
        const data = parseEnrichmentMarkdown(md, "genesis", 1);
        expect(data.sections[0].entries[0].claimType).toBe(expected);
      }
    });

    it("warns on unrecognized claim type and falls back to TEXTUAL", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const md = `## A. Test\n### A1. Entry\n**[UNKNOWN TYPE — VERIFIED]**\nContent`;
      const data = parseEnrichmentMarkdown(md, "genesis", 1);
      expect(data.sections[0].entries[0].claimType).toBe("TEXTUAL");
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining("Unrecognized claim type label"),
      );
      spy.mockRestore();
    });
  });

  describe("all locales × all chapters", () => {
    const LOCALES = ["en", "pt-br", "de", "es"] as const;
    const CHAPTERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

    const VALID_CONFIDENCE: ConfidenceLevel[] = [
      "VERIFIED",
      "PROBABLE",
      "POSSIBLE",
      "UNCERTAIN",
      "SPECULATIVE",
      "DOCUMENTED",
    ];

    for (const locale of LOCALES) {
      for (const chapter of CHAPTERS) {
        const label = `${locale}/genesis/study/CHAPTER-${chapter}-CONTEXT.md`;

        it(`${label} parses without error`, async () => {
          const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
          const filePath = path.join(
            ROOT,
            locale,
            "genesis",
            "study",
            `CHAPTER-${chapter}-CONTEXT.md`,
          );
          const raw = await fs.readFile(filePath, "utf-8");
          const data = parseEnrichmentMarkdown(raw, "genesis", chapter);
          expect(data).toBeDefined();
          expect(data.sections.length).toBeGreaterThan(0);
          spy.mockRestore();
        });

        it(`${label} entries have valid confidence levels`, async () => {
          const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
          const filePath = path.join(
            ROOT,
            locale,
            "genesis",
            "study",
            `CHAPTER-${chapter}-CONTEXT.md`,
          );
          const raw = await fs.readFile(filePath, "utf-8");
          const data = parseEnrichmentMarkdown(raw, "genesis", chapter);
          const entries = data.sections.flatMap((s) => s.entries);
          for (const entry of entries) {
            expect(VALID_CONFIDENCE).toContain(entry.confidence);
          }
          spy.mockRestore();
        });
      }
    }
  });
});
