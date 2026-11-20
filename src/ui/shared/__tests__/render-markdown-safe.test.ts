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

    it("converts **text** to <strong>", () => {
      const result = renderMarkdownSafe("**bold**", "prose");
      expect(result).toContain("<strong>bold</strong>");
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

  describe("nested emphasis (italic inside bold)", () => {
    it("mid-nest: **a *b* c** → strong wrapping em", () => {
      expect(renderMarkdownSafe("**a *b* c**", "note")).toContain(
        "<strong>a <em>b</em> c</strong>",
      );
      expect(renderMarkdownSafe("**a *b* c**", "prose")).toContain(
        "<strong>a <em>b</em> c</strong>",
      );
    });

    it("trailing-nest: **a *b*** → strong wrapping em (the *** shape)", () => {
      expect(renderMarkdownSafe("**The *waw* system:**", "prose")).toBe(
        "<strong>The <em>waw</em> system:</strong>",
      );
      expect(renderMarkdownSafe("**John 1:5 — *katelaben***", "note")).toBe(
        "<strong>John 1:5 — <em>katelaben</em></strong>",
      );
    });

    it("multiple nested italics inside one bold", () => {
      expect(renderMarkdownSafe("**a *b* c *d***", "prose")).toBe(
        "<strong>a <em>b</em> c <em>d</em></strong>",
      );
    });

    it("true bold-italic ***x*** → strong wrapping em", () => {
      expect(renderMarkdownSafe("***x***", "prose")).toBe(
        "<strong><em>x</em></strong>",
      );
    });

    it("plain bold and multi-span are unchanged (regression lock)", () => {
      expect(renderMarkdownSafe("**bold**", "prose")).toBe(
        "<strong>bold</strong>",
      );
      expect(renderMarkdownSafe("**a** and **b**", "prose")).toBe(
        "<strong>a</strong> and <strong>b</strong>",
      );
      expect(renderMarkdownSafe("*just italic*", "prose")).toBe(
        "<em>just italic</em>",
      );
    });

    it("nested inside divine speech keeps marker spans intact (Rule 30)", () => {
      expect(renderInlineSafe('@@"see *here*"@@ and **label *term***')).toBe(
        '<span class="divine">"see <em>here</em>"</span> and <strong>label <em>term</em></strong>',
      );
    });

    it("bold containing a transliteration marker (Rule 4) resolves cleanly", () => {
      expect(renderInlineSafe("**see {t:raqia} *here***")).toBe(
        '<strong>see <span class="term">raqia</span> <em>here</em></strong>',
      );
    });

    it("stays linear on long pathological input (delimiter stack + bottoms)", () => {
      // Each shape below was quadratic in a naive matcher (≈1.3 s at this size);
      // linear it takes milliseconds. The budget is generous so a loaded CI
      // worker never flakes, yet a quadratic regression still blows through it.
      const start = performance.now();
      renderInlineSafe(`**${"a*b ".repeat(20000)}`);
      renderInlineSafe(`${"*a ".repeat(20000)}${"b* ".repeat(20000)}`);
      renderInlineSafe(`${"**a ".repeat(20000)}`);
      expect(performance.now() - start).toBeLessThan(1000);
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

  describe("hardening (Step 4 batch 1: audit B3/B4, Decision L5)", () => {
    it("textual-criticism sigla never open an italic span (real corpus lines)", () => {
      // luke/INTRODUCTION.md:179, john/CHAPTER-1.md:336, luke CHAPTER-2-CONTEXT:157
      for (const line of [
        "genitive: א*, A, B*, D, W — the earlier reading",
        'supported by 𝔓66, 𝔓75, א*, B, C*; the "Son" reading',
        "better-attested reading (B*, ℵ*, A, D, W)",
        "absent from א*, Θ, 28; present in א¹, B",
      ]) {
        const out = renderMarkdownSafe(line, "note");
        expect(out).not.toContain("<em>");
        expect(out).toContain("*");
      }
      expect(
        renderMarkdownSafe(
          "by 𝔓5vid, א*, b, e. The reading is the *lectio difficilior*.",
          "note",
        ),
      ).toContain("<em>lectio difficilior</em>");
    });

    it("keeps intra-word and punctuation-adjacent italics and bold that authors use", () => {
      expect(renderInlineSafe("n*a* casa")).toBe("n<em>a</em> casa");
      expect(renderInlineSafe("E Kefa *disse-*lhes")).toBe(
        "E Kefa <em>disse-</em>lhes",
      );
      expect(renderInlineSafe("wie **Noach (Noah)**s Name")).toBe(
        "wie <strong>Noach (Noah)</strong>s Name",
      );
      expect(renderInlineSafe('**"so that (**ἐγκόπτεσθαι**)."**')).toBe(
        "<strong>&quot;so that (</strong>ἐγκόπτεσθαι<strong>).&quot;</strong>".replace(
          /&quot;/g,
          '"',
        ),
      );
    });

    it("emphasis and markers never cross a newline", () => {
      expect(renderMarkdownSafe("a *b\nc* d", "note")).toBe("a *b<br/>c* d");
      expect(renderMarkdownSafe("@@a\nb@@", "note")).toBe("@@a<br/>b@@");
      expect(renderMarkdownSafe("{t:a\nb}", "note")).toBe("{t:a<br/>b}");
    });

    it("keeps empty table cells in place (Genesis 8 chiasm shape)", () => {
      const html = renderMarkdownSafe(
        "| Before 8:1 | Pivot | After 8:1 |\n|---|---|---|\n| flood rises |  | flood falls |",
        "note",
      );
      const cells = [...html.matchAll(/<td[^>]*>(.*?)<\/td>/g)].map(
        (m) => m[1],
      );
      expect(cells).toEqual(["flood rises", "", "flood falls"]);
    });

    it("renders italics in table headers (Genesis 12 shape) and isolates cell asterisks", () => {
      const html = renderMarkdownSafe(
        "| Curse (*arar*) | Blessing (*barakh*) |\n|---|---|\n| א* | x |\ntail *text*",
        "note",
      );
      expect(html).toContain("<th");
      expect(html).toContain("Curse (<em>arar</em>)");
      expect(html).toContain(
        '<td class="px-3 py-2 border-b border-border-muted text-text-primary">א*</td>',
      );
      expect(html).toContain("tail <em>text</em>");
    });

    it("table cell text with $-patterns is inserted literally", () => {
      const html = renderMarkdownSafe(
        "| a | b |\n|---|---|\n| $& | $1 |",
        "note",
      );
      expect(html).toContain(">$&amp;<");
      expect(html).toContain(">$1<");
    });

    it("links Rule N references to the rules page only when a locale is given", () => {
      expect(renderInlineSafe("see (Rule 30) and Rule-3")).toBe(
        "see (Rule 30) and Rule-3",
      );
      expect(renderInlineSafe("see (Rule 30).", { locale: "en" })).toBe(
        'see (<a class="tt-ruleref" href="/en/rules#rule-30">Rule 30</a>).',
      );
      expect(
        renderInlineSafe("Regel 11 · Regra 25 · Regla 2 · Rule-3", {
          locale: "de",
        }),
      ).toBe(
        '<a class="tt-ruleref" href="/de/rules#rule-11">Regel 11</a> · ' +
          '<a class="tt-ruleref" href="/de/rules#rule-25">Regra 25</a> · ' +
          '<a class="tt-ruleref" href="/de/rules#rule-2">Regla 2</a> · ' +
          '<a class="tt-ruleref" href="/de/rules#rule-3">Rule-3</a>',
      );
      // out of range and repo names stay text; emphasis still applies around a link
      expect(
        renderInlineSafe("Rule 31, Rule 0, RULES-CORE", { locale: "en" }),
      ).toBe("Rule 31, Rule 0, RULES-CORE");
      expect(renderInlineSafe("*per Rule 11*", { locale: "pt-br" })).toBe(
        '<em>per <a class="tt-ruleref" href="/pt-br/rules#rule-11">Rule 11</a></em>',
      );
      expect(
        renderMarkdownSafe("| r |\n|---|\n| Rule 4 |", "note", {
          locale: "es",
        }),
      ).toContain('href="/es/rules#rule-4"');
    });

    it("a table cell's asterisk never pairs with one in another cell", () => {
      const html = renderMarkdownSafe(
        "| *x | y* |\n|---|---|\n| a | b |",
        "note",
      );
      expect(html).not.toContain("<em>");
      expect(html).toContain(">*x</th>");
    });
  });
});
