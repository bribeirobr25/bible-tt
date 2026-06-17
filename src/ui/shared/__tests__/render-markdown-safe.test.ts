import { describe, expect, it } from "vitest";
import { renderInlineSafe, renderMarkdownSafe } from "../render-markdown-safe";

describe("renderMarkdownSafe", () => {
  describe("HTML escaping", () => {
    it("escapes < and > before applying transforms", () => {
      const result = renderMarkdownSafe(
        "The phrase <Hebrew> is uncommon",
        "prose",
      );
      expect(result).toContain("&lt;Hebrew&gt;");
      expect(result).not.toContain("<Hebrew>");
    });

    it("escapes & to &amp;", () => {
      const result = renderMarkdownSafe("A & B", "prose");
      expect(result).toContain("A &amp; B");
    });

    it("escapes script tags", () => {
      const result = renderMarkdownSafe("<script>alert(1)</script>", "prose");
      expect(result).not.toContain("<script>");
      expect(result).toContain("&lt;script&gt;");
    });
  });

  describe("prose subset", () => {
    it("converts *text* to <em>", () => {
      const result = renderMarkdownSafe("*emphasis*", "prose");
      expect(result).toBe("<em>emphasis</em>");
    });

    it("does not convert **text** to <strong>", () => {
      const result = renderMarkdownSafe("**bold**", "prose");
      expect(result).not.toContain("<strong>");
    });

    it("collapses newlines to spaces", () => {
      const result = renderMarkdownSafe("line one\nline two", "prose");
      expect(result).toBe("line one line two");
    });
  });

  describe("note subset", () => {
    it("converts **text** to <strong>", () => {
      const result = renderMarkdownSafe("**bold**", "note");
      expect(result).toContain("<strong>bold</strong>");
    });

    it("converts *text* to <em>", () => {
      const result = renderMarkdownSafe("*italic*", "note");
      expect(result).toContain("<em>italic</em>");
    });

    it("converts list items", () => {
      const result = renderMarkdownSafe(
        "intro\n- item one\n- item two",
        "note",
      );
      expect(result).toContain("• item one");
      expect(result).toContain("• item two");
    });

    it("converts newlines to <br/>", () => {
      const result = renderMarkdownSafe("line one\nline two", "note");
      expect(result).toContain("<br/>");
    });
  });

  describe("TT highlight markers (Rules 2/4/11/30)", () => {
    it("{t:…} → .term span (transliteration, Rule 4)", () => {
      expect(renderMarkdownSafe("the {t:raqia} above", "prose")).toBe(
        'the <span class="term">raqia</span> above',
      );
    });

    it("{a:…} → .ambig span (preserved ambiguity, Rule 2)", () => {
      expect(renderMarkdownSafe("{a:wind/spirit} of God", "prose")).toBe(
        '<span class="ambig">wind/spirit</span> of God',
      );
    });

    it("@@…@@ → .divine span (divine speech, Rule 30)", () => {
      expect(renderMarkdownSafe('God said, @@"light"@@.', "prose")).toBe(
        'God said, <span class="divine">"light"</span>.',
      );
    });

    it("resolves a transliteration + added word nested inside divine speech", () => {
      const out = renderMarkdownSafe('@@"Shall be *a* {t:raqia}"@@', "prose");
      expect(out).toBe(
        '<span class="divine">"Shall be <em>a</em> <span class="term">raqia</span>"</span>',
      );
    });

    it("escapes HTML inside marker content", () => {
      expect(renderMarkdownSafe("{t:<x>}", "prose")).toBe(
        '<span class="term">&lt;x&gt;</span>',
      );
    });

    it("markers also work in renderInlineSafe and the note subset", () => {
      expect(renderInlineSafe("{t:raqia}")).toBe(
        '<span class="term">raqia</span>',
      );
      expect(renderMarkdownSafe("{a:sin/punishment}", "note")).toContain(
        '<span class="ambig">sin/punishment</span>',
      );
    });
  });

  describe("combined escaping + markdown", () => {
    it("escapes HTML inside italic markers", () => {
      const result = renderMarkdownSafe("*<tag>*", "prose");
      expect(result).toBe("<em>&lt;tag&gt;</em>");
    });

    it("handles editorial markers like <lacuna>", () => {
      const result = renderMarkdownSafe("The text reads <...> here", "prose");
      expect(result).toContain("&lt;...&gt;");
    });
  });
});
