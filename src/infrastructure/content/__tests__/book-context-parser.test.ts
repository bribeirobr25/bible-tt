import { describe, expect, it } from "vitest";
import { deriveSlug, parseBookContextMarkdown } from "../book-context-parser";

const MINIMAL_FRONTMATTER = `# Genesis — Book Context

**Book:** Genesis
**Language:** English
**Scope:** Cross-chapter motifs in Genesis 1-12
**Ruleset:** v3.3
**Status:** provisional

---

> **About this surface:** This page surfaces patterns that span multiple chapters within Genesis. For per-chapter world-context, see each chapter's Context companion.

---

`;

describe("book-context-parser", () => {
  describe("slug derivation (§5.2.1 algorithm + R2.3 Unicode normalization)", () => {
    it("derives 'toledot-spine' from '1. Toledot spine'", () => {
      expect(deriveSlug("1. Toledot spine")).toBe("toledot-spine");
    });

    it("derives 'the-eretz-semantic-shift' from '2. The *eretz* semantic shift'", () => {
      expect(deriveSlug("2. The *eretz* semantic shift")).toBe(
        "the-eretz-semantic-shift",
      );
    });

    it("normalizes Unicode 'ō' to 'o' in '3. *Anōthen* / \"born from above\"'", () => {
      // Per round-2 R2.3 — NFD decomposition + strip combining diacritics.
      // "Anōthen" becomes "anothen"; the parenthesized "(double meaning)" suffix
      // would be stripped if present, but here only the slash/quote structure exists.
      expect(deriveSlug('3. *Anōthen* / "born from above"')).toBe(
        "anothen-born-from-above",
      );
    });

    it("strips parenthesized content (e.g., '(motif)')", () => {
      expect(deriveSlug('4. "Hour has not yet come" (motif)')).toBe(
        "hour-has-not-yet-come",
      );
    });
  });

  describe("file-level parsing", () => {
    it("returns empty motif list for a file with only frontmatter", () => {
      const data = parseBookContextMarkdown(
        MINIMAL_FRONTMATTER,
        "genesis",
        "en",
      );
      expect(data.book).toBe("genesis");
      expect(data.locale).toBe("en");
      expect(data.motifs).toHaveLength(0);
      // Disclaimer captured from quote-block.
      expect(data.disclaimer).toMatch(/patterns that span multiple chapters/);
    });

    it("parses a file with a single motif", () => {
      const raw =
        MINIMAL_FRONTMATTER +
        `## 1. Toledot spine
**[TEXTUAL — VERIFIED]**
**Chapters:** 2, 5, 6, 10, 11

The *toledot* formula opens each new narrative unit in Genesis.

**Source:** Westermann, *Genesis 1-11*.
`;
      const data = parseBookContextMarkdown(raw, "genesis", "en");
      expect(data.motifs).toHaveLength(1);
      const m = data.motifs[0];
      expect(m.slug).toBe("toledot-spine");
      expect(m.title).toBe("Toledot spine");
      expect(m.claimType).toBe("TEXTUAL");
      expect(m.confidence).toBe("VERIFIED");
      expect(m.chapters).toEqual([2, 5, 6, 10, 11]);
      expect(m.body).toMatch(/The \*toledot\* formula/);
      expect(m.source).toMatch(/Westermann/);
    });

    it("parses a file with multiple motifs and preserves authoring order (no sortByConfidence)", () => {
      const raw =
        MINIMAL_FRONTMATTER +
        `## 1. First motif
**[TEXTUAL — POSSIBLE]**
**Chapters:** 1

Body A.

---

## 2. Second motif
**[TEXTUAL — VERIFIED]**
**Chapters:** 2

Body B.

---

## 3. Third motif
**[COMPARATIVE PARALLEL — PROBABLE]**
**Chapters:** 3

Body C.
`;
      const data = parseBookContextMarkdown(raw, "genesis", "en");
      expect(data.motifs).toHaveLength(3);
      // Authoring order — NOT confidence-sorted (VERIFIED would come first if sorted).
      expect(data.motifs.map((m) => m.title)).toEqual([
        "First motif",
        "Second motif",
        "Third motif",
      ]);
      expect(data.motifs[0].confidence).toBe("POSSIBLE");
      expect(data.motifs[1].confidence).toBe("VERIFIED");
      expect(data.motifs[2].confidence).toBe("PROBABLE");
    });

    it("handles missing optional **Source:** field", () => {
      const raw =
        MINIMAL_FRONTMATTER +
        `## 1. Sourceless motif
**[TEXTUAL — POSSIBLE]**
**Chapters:** 1

A motif without a source citation.
`;
      const data = parseBookContextMarkdown(raw, "genesis", "en");
      expect(data.motifs).toHaveLength(1);
      expect(data.motifs[0].source).toBeUndefined();
    });

    it("returns empty motif list (graceful degradation pattern) when no motifs present after disclaimer", () => {
      const raw =
        MINIMAL_FRONTMATTER +
        `Some narrative prose with no H2 motif header.

More text.
`;
      const data = parseBookContextMarkdown(raw, "genesis", "en");
      expect(data.motifs).toHaveLength(0);
    });

    it("skips the disclaimer quote-block as non-motif content", () => {
      const raw =
        MINIMAL_FRONTMATTER +
        `## 1. Real motif
**[TEXTUAL — VERIFIED]**
**Chapters:** 1

The disclaimer text from the quote-block above should NOT appear in this motif's body.
`;
      const data = parseBookContextMarkdown(raw, "genesis", "en");
      expect(data.motifs).toHaveLength(1);
      expect(data.motifs[0].body).not.toMatch(/About this surface/i);
      expect(data.motifs[0].body).not.toMatch(/patterns that span/);
    });
  });

  describe("locale-aware field labels", () => {
    it("accepts PT-BR **Capítulos:** for chapters and **Fonte:** for source", () => {
      const ptbrFrontmatter = `# Gênesis — Contexto do Livro\n\n`;
      const raw =
        ptbrFrontmatter +
        `## 1. Espinha *toledot*
**[TEXTUAL — VERIFIED]**
**Capítulos:** 2, 5, 6

Corpo do motivo.

**Fonte:** Westermann, *Genesis 1-11*.
`;
      const data = parseBookContextMarkdown(raw, "genesis", "pt-br");
      expect(data.motifs).toHaveLength(1);
      expect(data.motifs[0].chapters).toEqual([2, 5, 6]);
      expect(data.motifs[0].source).toMatch(/Westermann/);
    });

    it("accepts DE **Kapitel:** for chapters and **Quelle:** for source", () => {
      const raw = `# Genesis — Buchkontext\n\n## 1. Toledot-Wirbelsäule
**[TEXTUAL — VERIFIED]**
**Kapitel:** 2, 5, 6

Motivkörper.

**Quelle:** Westermann, *Genesis 1-11*.
`;
      const data = parseBookContextMarkdown(raw, "genesis", "de");
      expect(data.motifs).toHaveLength(1);
      expect(data.motifs[0].chapters).toEqual([2, 5, 6]);
      expect(data.motifs[0].source).toMatch(/Westermann/);
    });
  });

  describe("slug collision handling", () => {
    it("appends -2, -3 suffixes to motifs whose titles produce identical slugs", () => {
      const raw =
        MINIMAL_FRONTMATTER +
        `## 1. Duplicate title
**[TEXTUAL — POSSIBLE]**
**Chapters:** 1

First.

---

## 2. Duplicate title
**[TEXTUAL — POSSIBLE]**
**Chapters:** 2

Second.

---

## 3. Duplicate title
**[TEXTUAL — POSSIBLE]**
**Chapters:** 3

Third.
`;
      const data = parseBookContextMarkdown(raw, "genesis", "en");
      expect(data.motifs.map((m) => m.slug)).toEqual([
        "duplicate-title",
        "duplicate-title-2",
        "duplicate-title-3",
      ]);
    });
  });

  describe("invalid claim-type fallback", () => {
    it("falls back to TEXTUAL when claim type is not recognized", () => {
      const raw =
        MINIMAL_FRONTMATTER +
        `## 1. Motif with bogus claim type
**[FAKE_CATEGORY — VERIFIED]**
**Chapters:** 1

Body.
`;
      const data = parseBookContextMarkdown(raw, "genesis", "en");
      expect(data.motifs[0].claimType).toBe("TEXTUAL");
      expect(data.motifs[0].confidence).toBe("VERIFIED");
    });
  });

  describe("markdown emphasis preserved in body", () => {
    it("preserves italics and bold in motif body text", () => {
      const raw =
        MINIMAL_FRONTMATTER +
        `## 1. Wordplay motif
**[TEXTUAL — VERIFIED]**
**Chapters:** 2

The *adam* / *adamah* wordplay is **structurally significant**.
`;
      const data = parseBookContextMarkdown(raw, "genesis", "en");
      expect(data.motifs[0].body).toContain("*adam*");
      expect(data.motifs[0].body).toContain("*adamah*");
      expect(data.motifs[0].body).toContain("**structurally significant**");
    });
  });
});
