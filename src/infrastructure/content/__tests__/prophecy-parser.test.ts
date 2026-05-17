import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import type {
  ConfidenceLevel,
  FulfillmentStatus,
} from "@/domain/content/types";
import { parseProphecyMarkdown } from "../prophecy-parser";

const ROOT = path.resolve(process.cwd(), "content");

const VALID_FULFILLMENT_STATUSES: FulfillmentStatus[] = [
  "FULFILLED",
  "PARTIAL",
  "CLAIMED",
  "UNFULFILLED",
  "DEBATED",
  "MULTI_STAGE",
];

const VALID_CONFIDENCE_LEVELS: ConfidenceLevel[] = [
  "VERIFIED",
  "PROBABLE",
  "POSSIBLE",
  "UNCERTAIN",
  "SPECULATIVE",
  "DOCUMENTED",
];

describe("Prophecy Parser", () => {
  describe("en/genesis/study/CHAPTER-3-PROPHECY.md", () => {
    async function loadChapter3() {
      const filePath = path.join(
        ROOT,
        "en",
        "genesis",
        "study",
        "CHAPTER-3-PROPHECY.md",
      );
      const raw = await fs.readFile(filePath, "utf-8");
      return parseProphecyMarkdown(raw, "genesis", 3);
    }

    it("parses without error", async () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const data = await loadChapter3();
      expect(data).toBeDefined();
      spy.mockRestore();
    });

    it("extracts correct book and chapter", async () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const data = await loadChapter3();
      expect(data.book).toBe("genesis");
      expect(data.chapter).toBe(3);
      spy.mockRestore();
    });

    it("has entries with valid fulfillment status values", async () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const data = await loadChapter3();
      expect(data.entries.length).toBeGreaterThan(0);
      for (const entry of data.entries) {
        expect(VALID_FULFILLMENT_STATUSES).toContain(entry.fulfillmentStatus);
      }
      spy.mockRestore();
    });

    it("entries have readings arrays and any present readings have valid confidence levels", async () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const data = await loadChapter3();
      expect(data.entries.length).toBeGreaterThan(0);
      for (const entry of data.entries) {
        expect(Array.isArray(entry.readings)).toBe(true);
        for (const reading of entry.readings) {
          expect(VALID_CONFIDENCE_LEVELS).toContain(reading.confidence);
        }
      }
      spy.mockRestore();
    });
  });

  // Phase 11.5 — scholarlyNote field (audit Critical: verifies round-trip
  // through finalizeEntry; audit Minor 1: per-locale dispatch + absent-field invariant)
  describe("scholarlyNote field parsing (Phase 11.5)", () => {
    function makeEntry(scholarlyLine: string): string {
      return [
        "## Test Entry",
        "**Verse:** Genesis 1:1",
        "**Text says:** The text.",
        "**Context:** Some context.",
        "**Subject:** Some subject.",
        "**Fulfillment status:** CLAIMED",
        scholarlyLine,
        "**Readings:**",
        "- **Jewish**: test reading [DOCUMENTED]",
        "",
      ].join("\n");
    }

    it("EN: **Scholarly note:** populates scholarlyNote (round-trips through finalizeEntry)", () => {
      const data = parseProphecyMarkdown(
        makeEntry("**Scholarly note:** EN note."),
        "genesis",
        1,
      );
      expect(data.entries[0].scholarlyNote).toBe("EN note.");
    });

    it("PT-BR: **Nota acadêmica:** populates scholarlyNote", () => {
      const data = parseProphecyMarkdown(
        makeEntry("**Nota acadêmica:** Nota PT-BR."),
        "genesis",
        1,
      );
      expect(data.entries[0].scholarlyNote).toBe("Nota PT-BR.");
    });

    it("DE: **Wissenschaftliche Anmerkung:** populates scholarlyNote", () => {
      const data = parseProphecyMarkdown(
        makeEntry("**Wissenschaftliche Anmerkung:** DE-Anmerkung."),
        "genesis",
        1,
      );
      expect(data.entries[0].scholarlyNote).toBe("DE-Anmerkung.");
    });

    it("ES: **Nota académica:** populates scholarlyNote", () => {
      const data = parseProphecyMarkdown(
        makeEntry("**Nota académica:** Nota ES."),
        "genesis",
        1,
      );
      expect(data.entries[0].scholarlyNote).toBe("Nota ES.");
    });

    it("scholarlyNote is undefined when the field is absent (absent-field invariant)", () => {
      const noScholarly = [
        "## Test Entry",
        "**Verse:** Genesis 1:1",
        "**Text says:** The text.",
        "**Context:** Some context.",
        "**Subject:** Some subject.",
        "**Fulfillment status:** CLAIMED",
        "**Readings:**",
        "- **Jewish**: test reading [DOCUMENTED]",
        "",
      ].join("\n");
      const data = parseProphecyMarkdown(noScholarly, "genesis", 1);
      expect(data.entries[0].scholarlyNote).toBeUndefined();
    });
  });

  describe("fulfillment status parsing", () => {
    function makeEntry(status: string): string {
      return [
        "## Test Entry",
        "**Verse:** Genesis 1:1",
        "**Text says:** The text.",
        "**Context:** Some context.",
        "**Subject:** Some subject.",
        `**Fulfillment status:** ${status}`,
        "**Readings:** —",
        "- **Tradition**: A reading here. [POSSIBLE]",
      ].join("\n");
    }

    it("parses FULFILLED", () => {
      const data = parseProphecyMarkdown(makeEntry("FULFILLED"), "genesis", 1);
      expect(data.entries[0].fulfillmentStatus).toBe("FULFILLED");
    });

    it("parses PARTIAL", () => {
      const data = parseProphecyMarkdown(makeEntry("PARTIAL"), "genesis", 1);
      expect(data.entries[0].fulfillmentStatus).toBe("PARTIAL");
    });

    it("parses CLAIMED", () => {
      const data = parseProphecyMarkdown(makeEntry("CLAIMED"), "genesis", 1);
      expect(data.entries[0].fulfillmentStatus).toBe("CLAIMED");
    });

    it("parses UNFULFILLED", () => {
      // Note: parseFulfillmentStatus checks UNFULFILLED (and its localized forms
      // UNERFÜLLT, NO CUMPLIDA, NÃO CUMPRIDA) BEFORE FULFILLED, so the earlier
      // dispatch-order bug (FULFILLED-first matching UNFULFILLED's substring) is
      // resolved. Status correctly routes to UNFULFILLED.
      // Phase 11 (`docs/audit/archive/AUDIT_PHASE_11_PLAN.md` round-2 audit R2.3)
      // surfaced the stale comment; updated 2026-05-13.
      const data = parseProphecyMarkdown(
        makeEntry("UNFULFILLED"),
        "genesis",
        1,
      );
      expect(data.entries[0].fulfillmentStatus).toBe("UNFULFILLED");
    });

    it("parses DEBATED", () => {
      const data = parseProphecyMarkdown(makeEntry("DEBATED"), "genesis", 1);
      expect(data.entries[0].fulfillmentStatus).toBe("DEBATED");
    });

    it("parses MULTI_STAGE", () => {
      const data = parseProphecyMarkdown(
        makeEntry("MULTI_STAGE"),
        "genesis",
        1,
      );
      expect(data.entries[0].fulfillmentStatus).toBe("MULTI_STAGE");
    });
  });

  describe("localized confidence label parsing", () => {
    function makeEntryWithReading(confidenceLabel: string): string {
      // FIELD_LINE requires at least one char after the colon, so supply a
      // placeholder value to trigger inReadings = true in the parser.
      return [
        "## Test Entry",
        "**Verse:** Genesis 1:1",
        "**Text says:** The text.",
        "**Context:** Context.",
        "**Subject:** Subject.",
        "**Fulfillment status:** DEBATED",
        "**Readings:** —",
        `- **Tradition**: A reading here. [${confidenceLabel}]`,
      ].join("\n");
    }

    it("parses DOCUMENTED (EN)", () => {
      const data = parseProphecyMarkdown(
        makeEntryWithReading("DOCUMENTED"),
        "genesis",
        1,
      );
      expect(data.entries[0].readings[0].confidence).toBe("DOCUMENTED");
    });

    it("parses DOKUMENTIERT (DE)", () => {
      const data = parseProphecyMarkdown(
        makeEntryWithReading("DOKUMENTIERT"),
        "genesis",
        1,
      );
      expect(data.entries[0].readings[0].confidence).toBe("DOCUMENTED");
    });

    it("parses DOCUMENTADO (PT/ES)", () => {
      const data = parseProphecyMarkdown(
        makeEntryWithReading("DOCUMENTADO"),
        "genesis",
        1,
      );
      expect(data.entries[0].readings[0].confidence).toBe("DOCUMENTED");
    });

    it("parses VERIFIED", () => {
      const data = parseProphecyMarkdown(
        makeEntryWithReading("VERIFIED"),
        "genesis",
        1,
      );
      expect(data.entries[0].readings[0].confidence).toBe("VERIFIED");
    });

    it("parses PROBABLE", () => {
      const data = parseProphecyMarkdown(
        makeEntryWithReading("PROBABLE"),
        "genesis",
        1,
      );
      expect(data.entries[0].readings[0].confidence).toBe("PROBABLE");
    });

    it("parses POSSIBLE", () => {
      const data = parseProphecyMarkdown(
        makeEntryWithReading("POSSIBLE"),
        "genesis",
        1,
      );
      expect(data.entries[0].readings[0].confidence).toBe("POSSIBLE");
    });

    it("parses UNCERTAIN", () => {
      const data = parseProphecyMarkdown(
        makeEntryWithReading("UNCERTAIN"),
        "genesis",
        1,
      );
      expect(data.entries[0].readings[0].confidence).toBe("UNCERTAIN");
    });

    it("parses SPECULATIVE", () => {
      const data = parseProphecyMarkdown(
        makeEntryWithReading("SPECULATIVE"),
        "genesis",
        1,
      );
      expect(data.entries[0].readings[0].confidence).toBe("SPECULATIVE");
    });
  });

  describe("console.warn for unrecognized labels", () => {
    it("warns on unrecognized fulfillment status and falls back to DEBATED", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const md = [
        "## Test Entry",
        "**Verse:** Genesis 1:1",
        "**Text says:** The text.",
        "**Context:** Context.",
        "**Subject:** Subject.",
        "**Fulfillment status:** SUPERSEDED",
        "**Readings:** —",
        "- **Tradition**: A reading. [POSSIBLE]",
      ].join("\n");
      const data = parseProphecyMarkdown(md, "genesis", 1);
      expect(data.entries[0].fulfillmentStatus).toBe("DEBATED");
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining("Unrecognized fulfillment status"),
      );
      spy.mockRestore();
    });

    it("warns on unrecognized confidence label and falls back to POSSIBLE", () => {
      const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const md = [
        "## Test Entry",
        "**Verse:** Genesis 1:1",
        "**Text says:** The text.",
        "**Context:** Context.",
        "**Subject:** Subject.",
        "**Fulfillment status:** DEBATED",
        "**Readings:** —",
        "- **Tradition**: A reading. [APPROXIMATE]",
      ].join("\n");
      const data = parseProphecyMarkdown(md, "genesis", 1);
      expect(data.entries[0].readings[0].confidence).toBe("POSSIBLE");
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining("Unrecognized prophecy confidence label"),
      );
      spy.mockRestore();
    });
  });

  describe("all available EN prophecy files parse", () => {
    const CHAPTERS = [3, 9, 12] as const;

    for (const chapter of CHAPTERS) {
      it(`en/genesis/study/CHAPTER-${chapter}-PROPHECY.md parses without error`, async () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        const filePath = path.join(
          ROOT,
          "en",
          "genesis",
          "study",
          `CHAPTER-${chapter}-PROPHECY.md`,
        );
        const raw = await fs.readFile(filePath, "utf-8");
        const data = parseProphecyMarkdown(raw, "genesis", chapter);
        expect(data).toBeDefined();
        expect(data.book).toBe("genesis");
        expect(data.chapter).toBe(chapter);
        expect(data.entries.length).toBeGreaterThan(0);
        for (const entry of data.entries) {
          expect(VALID_FULFILLMENT_STATUSES).toContain(entry.fulfillmentStatus);
          for (const reading of entry.readings) {
            expect(VALID_CONFIDENCE_LEVELS).toContain(reading.confidence);
          }
        }
        spy.mockRestore();
      });
    }
  });
});
