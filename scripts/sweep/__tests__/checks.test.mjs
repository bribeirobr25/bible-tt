// Fixture tests for the content sweep (PLAN_CONTENT_SWEEP.md §5): each check has
// positive and negative cases. Recall is proven on FROZEN real lines
// (fixtures/recall-anchors.json, copied from content/ at f157960 with their
// file:line), never on the live corpus — Step 4 fixes the live defects, and a test
// that needs a defect to exist would turn the gate red (impl. review R4-4/R5-1).
// The live-corpus test asserts tool health only.
import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import {
  CHECK_IDS,
  parseArgs,
  runSweep,
  selects,
} from "../../content-sweep.mjs";
import * as C from "../checks.mjs";
import {
  esAccents,
  nameInventory,
  repeatedGlosses,
  verseParity,
} from "../corpus.mjs";
import { extractNameTables, extractTableCells } from "../rule-tables.mjs";
import {
  classifyUseMention,
  divineCoverage,
  inCapsRun,
  isSentenceStart,
  italicSpans,
  word,
} from "../text.mjs";
import { ZoneError, zoneLines } from "../zones.mjs";

const SUP = (n) => [...String(n)].map((d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(d)]).join("");
/**
 * A minimal chapter file. `start` numbers the first verse (default 1).
 * @param {string[]} verses
 * @param {{continuous?: string, locale?: string, notes?: string[], start?: number, status?: string, reviewers?: boolean}} [opts]
 */
const CHAPTER = (verses, opts = {}) => {
  const { continuous, locale = "en", notes, start = 1 } = opts;
  return [
    "# JOHN 1",
    "## The Transparent Translation (TT)",
    "",
    `**Status:** ${opts.status ?? "provisional — pending reviewer sign-off (Rule 28)"}`,
    ...(opts.reviewers === false
      ? []
      : ["**Reviewers:** Hellenist: unassigned"]),
    "**Methodology:** 30-Rule Governance System (Ruleset v3.4)",
    "",
    "## TABLE OF CONTENTS",
    "- [Reading Guide](#reading-guide)",
    "## READING GUIDE",
    '- @@"…"@@ — direct speech of God or Yeshua (legend)',
    '- `@@"…"@@` — a backticked legend',
    "## CHAPTER OVERVIEW",
    "**What happens:** the Son of Man arrives.",
    "## CONTINUOUS READING",
    "*Prose-flow view of the full chapter.*",
    continuous ?? verses.map((v, i) => `${SUP(start + i)}${v}`).join(" "),
    "## VERSE-BY-VERSE STUDY",
    ...verses.flatMap((v, i) => [
      `### **${locale === "de" ? "Vers" : "Verse"} ${start + i}**`,
      "",
      v,
      "",
      "> **NOTES**",
      `> - ${notes?.[i] ?? 'Greek *logos*, NOT "only-begotten" (P-009).'}`,
      "",
      "---",
    ]),
    "## GLOSSARY — JOHN 1",
    "| term | gloss |",
  ].join("\n");
};

function ctxOf(text, rel) {
  const lines = text.split("\n");
  const [locale, book] = rel.split("/");
  return {
    path: `content/${rel}`,
    key: rel,
    locale,
    book,
    lines,
    zones: zoneLines(text, rel),
  };
}
/** Every check id produced by any fixture below — the final test requires all of CHECK_IDS. */
const SEEN = new Set();
const sink = (hits) => (h) => {
  hits.push(h);
  SEEN.add(h.check);
};
function run(fn, ctx, ...extra) {
  const hits = [];
  fn(ctx, sink(hits), ...extra);
  return hits;
}
const cls = (hits) => hits.map((h) => h.cls).sort();
const only = (hits, check) => hits.filter((h) => h.check === check);

describe("zones", () => {
  const ctx = ctxOf(
    CHAPTER(["In *the* beginning was the word.", "He was with God."]),
    "en/john/CHAPTER-1.md",
  );
  const at = (needle, c = ctx) =>
    c.zones[c.lines.findIndex((l) => l.includes(needle))];
  it("assigns zones and render state", () => {
    expect(at("**Status:**")).toMatchObject({ zone: "front", render: "now" }); // the status pill
    expect(at("**Reviewers:**")).toMatchObject({ zone: "front", render: "no" });
    expect(at("[Reading Guide]")).toMatchObject({ zone: "toc", render: "no" });
    expect(at("(legend)")).toMatchObject({ zone: "guide", render: "now" });
    expect(at("What happens")).toMatchObject({ zone: "overview" });
    expect(at("¹In")).toMatchObject({ zone: "cr" });
    expect(at("Prose-flow view")).toMatchObject({
      zone: "apparatus",
      render: "no",
    }); // parser drops it
    expect(at('NOT "only-begotten"')).toMatchObject({ zone: "note" });
    expect(at("| term")).toMatchObject({ zone: "apparatus" });
    expect(ctx.zones[ctx.lines.indexOf("He was with God.")]).toMatchObject({
      zone: "main",
      verse: 2,
    });
  });
  it("an all-italic continuous-reading line with verse numbers is reading text, not the description", () => {
    const c = ctxOf(
      CHAPTER(["x"], { continuous: "*¹In the beginning*" }),
      "en/john/CHAPTER-1.md",
    );
    expect(at("*¹In the beginning*", c)).toMatchObject({ zone: "cr" });
  });
  it("a TOC title the parser does not skip renders (S16)", () => {
    const c = ctxOf(
      CHAPTER(["x"]).replace("## TABLE OF CONTENTS", "## TABLA DE CONTENIDOS"),
      "es/john/CHAPTER-1.md",
    );
    expect(c.zones[c.lines.indexOf("## TABLA DE CONTENIDOS")]).toMatchObject({
      zone: "toc",
      render: "now",
    });
    expect(cls(run(C.s16, c))).toEqual(["toc-renders-as-supplementary"]);
    expect(run(C.s16, ctxOf(CHAPTER(["x"]), "en/john/CHAPTER-1.md"))).toEqual(
      [],
    );
  });
  it("throws (tool error) when a chapter's zones cannot be resolved", () => {
    expect(() =>
      zoneLines("# X\n## SOMETHING\ntext", "en/john/CHAPTER-9.md"),
    ).toThrow(ZoneError);
  });
  it("companions: header not rendered (except the disclaimer); empty and non-lettered sections dropped; Sources decided by heading words", () => {
    const c = ctxOf(
      "# T\n## The Transparent Translation (TT)\n> **Disclaimer.**\n**Ruleset:** v3.3\n## A. Section\n### Entry\ntext\n## B. Empty\nprose\n## Notes\nx\n## G. Curiosities and Open Questions\n### Q\ny\n## H. Sources Consulted\n- a book",
      "en/john/study/CHAPTER-1-CONTEXT.md",
    );
    expect(c.zones.map((z) => `${z.zone}/${z.render}`)).toEqual([
      "front/no",
      "front/no",
      "front/now",
      "front/no",
      "apparatus/now",
      "apparatus/now",
      "apparatus/now",
      "apparatus/no",
      "apparatus/no",
      "apparatus/no",
      "apparatus/no",
      "apparatus/now", // G. is Curiosities in a companion (impl. review R1-1)
      "apparatus/now",
      "apparatus/now",
      "apparatus/after-4a",
      "apparatus/after-4a",
    ]);
    const intro = ctxOf(
      "# T\n## The Transparent Translation (TT)\n**Status:** provisional\n<!-- CARD -->\n**What:** Volume 2 of Luke\n<!-- /CARD -->\n## A. Overview\n### E\nt\n## G. Konsultierte Quellen\n- x\n## H. Herangezogene Quellen\n- y",
      "de/acts/INTRODUCTION.md",
    );
    expect(at("**What:**", intro)).toMatchObject({
      zone: "apparatus",
      render: "now",
    }); // the book card renders on the landing page (R1-4)
    expect(at("<!-- CARD -->", intro)).toMatchObject({ zone: "front" });
    expect(at("- x", intro).render).toBe("after-4a");
    expect(at("- y", intro).render).toBe("after-4a");
  });
  it("PROPHECY files: only entries with a Verse field render, and only their recognized fields and readings", () => {
    const c = ctxOf(
      [
        "# Acts 1 — Prophecy Tracking",
        "## The Transparent Translation (TT)",
        "> **This file tracks…**",
        "**Ruleset:** v3.4",
        "## Note on Acts 1's mode of allusion",
        "intro prose",
        "## Psalm 69:25 — desolate",
        "**Verse:** Acts 1:20a",
        "**Text says:** quoted",
        "**Aside:** an unrecognized field",
        "free prose inside the entry",
        "**Readings:**",
        "- **Jewish**: a reading [PROBABLE]",
        "- not a reading line",
        "",
        "- **Late**: after the blank [POSSIBLE]",
        "## H. Sources Consulted",
        "- a book",
      ].join("\n"),
      "en/acts/study/CHAPTER-1-PROPHECY.md",
    );
    const r = (needle) => at(needle, c).render;
    expect(r("> **This file")).toBe("no");
    expect(r("intro prose")).toBe("no");
    expect(r("## Psalm 69")).toBe("now");
    expect(r("**Verse:**")).toBe("now");
    expect(r("**Text says:**")).toBe("now");
    expect(r("**Aside:**")).toBe("no");
    expect(r("free prose")).toBe("no");
    expect(r("**Jewish**")).toBe("now");
    expect(r("not a reading")).toBe("no");
    expect(r("**Late**")).toBe("no"); // the blank line ended the readings
    expect(r("- a book")).toBe("after-4a");
  });
});

describe("text helpers", () => {
  it("word(): Unicode boundaries; a digit blocks, a verse superscript does not", () => {
    expect("é soul".match(word("soul"))).toHaveLength(1);
    expect("1soul".match(word("soul"))).toBeNull();
    expect("¹soul".match(word("soul"))).toHaveLength(1);
    expect("soulé".match(word("soul"))).toBeNull();
  });
  it("classifyUseMention: negation, quotes, italics → mention; reading text always use", () => {
    expect(classifyUseMention('NOT "soul" here', 5, "note")).toBe("mention");
    expect(classifyUseMention("rather than eternal life", 12, "note")).toBe(
      "mention",
    );
    expect(classifyUseMention("the gospel says", 4, "note")).toBe("use");
    expect(classifyUseMention("not soul", 4, "main")).toBe("use");
    expect(classifyUseMention("not soul", 4, "cr")).toBe("use");
    expect(classifyUseMention("„nicht Seele“ und", 1, "note")).toBe("mention");
    // the negator's reach ends at a comma (impl. review R1)
    expect(classifyUseMention("not the body, but the soul", 22, "note")).toBe(
      "use",
    );
  });
  it("inCapsRun: typographic caps vs a rendering; acronyms are not a run", () => {
    expect(inCapsRun("THE EYES OF THE LORD", 16, 4)).toBe(true);
    expect(inCapsRun("on the LORD who", 7, 4)).toBe(false);
    expect(inCapsRun("the LORD (YHWH) said", 4, 4)).toBe(false);
  });
  it("isSentenceStart", () => {
    expect(isSentenceStart("Son of man", 0)).toBe(true);
    expect(isSentenceStart('He said. "Son', 10)).toBe(true);
    expect(isSentenceStart("He said: Son", 9)).toBe(true);
    expect(isSentenceStart("the Son", 4)).toBe(false);
    expect(isSentenceStart("¹⁶Son", 2)).toBe(true);
    expect(isSentenceStart("dijo. ¡Espíritu", 7)).toBe(true);
  });
  it("italicSpans ignores bold; a bold-italic run never pairs with a later italic", () => {
    expect(italicSpans("a *the* b **BOLD** *x y*")).toEqual(["the", "x y"]);
    expect(italicSpans("***both*** and *one*")).toEqual(["one"]);
  });
  it("divineCoverage carries state across verses only when asked", () => {
    const chunks = [
      [1, 'He said @@"one'],
      [2, 'two"@@ done'],
    ];
    expect(divineCoverage(chunks, true).covered.get(2)).toBe("two");
    expect(divineCoverage(chunks, false).unbalanced).toEqual([1, 2]);
  });
  it("sentences: abbreviations, verse refs and openers", () => {
    expect(C.sentences("One. Two (cf. v. 3). Three. Four.")).toBe(4);
    expect(C.sentences("See Gen. 1 and vv. 2–3. Then done.")).toBe(2);
    expect(C.sentences("Compare cf. Matthew here. Done.")).toBe(2);
    // a sentence may open with italics, bold or ¿/¡ (impl. review R1-5)
    expect(C.sentences("One. *Two* here. ¿Three? ¡Four!")).toBe(4);
  });
});

describe("per-file checks", () => {
  it("S1a/S1b: DE YHWH, JHWH outside DE, convention explanations and leaks classified", () => {
    const de = ctxOf(
      "# T\n## A. X\nvor dem Tag YHWHs\nEN *YHWH*; DE *JHWH*\nDE→JHWH, PT→YHWH in der Propagierung",
      "de/john/PEOPLE.md",
    );
    expect(cls(run(C.s1, de))).toEqual([
      "convention-explanation",
      "de-yhwh",
      "meta-leak",
    ]);
    const en = ctxOf("# T\n## A. X\nJHWH alone", "en/acts/CONTEXT.md");
    expect(cls(run(C.s1, en))).toEqual(["jhwh-outside-de"]);
  });
  it("S1c: quoted OT LORD is use; caps titles and headings are a review class; convention discussion is a mention in every locale; DE inflections", () => {
    const en = ctxOf(
      '# T\n## A. X\n"Cast your burden on the LORD" (Ps 55:22)\n> 🔴 **THE EYES OF THE LORD**\nMost translations substitute "the LORD" here\n## Proverbs 16:33 — the lot is the LORD\'s',
      "en/1-peter/CONTEXT.md",
    );
    expect(cls(run(C.s1, en))).toEqual([
      "caps-title",
      "caps-title",
      "convention-mention",
      "use",
    ]);
    const de = ctxOf(
      '# T\n## A. X\nder Knecht des HERRN\nJHWH, nicht als „der HERR" oder „Jahwe"\n(JHWH, nicht "der HERR") gemäss Regel 25',
      "de/genesis/INTRODUCTION.md",
    );
    expect(cls(run(C.s1, de))).toEqual([
      "convention-mention",
      "convention-mention",
      "use",
    ]);
    const pt = ctxOf(
      '# T\n## A. X\nO nome divino aparece como YHWH, não como "o SENHOR"\nsem substituir por "SENHOR."',
      "pt-br/genesis/INTRODUCTION.md",
    );
    expect(cls(run(C.s1, pt))).toEqual([
      "convention-mention",
      "convention-mention",
    ]);
  });
  it("S2a: capitalized son of man once per verse (CR excluded); sentence-initial skipped; whole words only; DE exempt", () => {
    const en = ctxOf(
      CHAPTER([
        "the Son of Man came; the son of man went.",
        "Son of man, rise. The Son of Manasseh",
      ]),
      "en/john/CHAPTER-1.md",
    );
    expect(cls(run(C.s2a, en))).toEqual(["main", "tt-voice"]);
    expect(
      run(
        C.s2a,
        ctxOf(
          CHAPTER(["der Sohn des Menschen"], { locale: "de" }),
          "de/john/CHAPTER-1.md",
        ),
      ),
    ).toEqual([]);
  });
  it("S2b: capitalized Spirit mid-sentence; sentence start, bibliography and grammatical 'Verbo' excluded; table cells classed", () => {
    expect(
      cls(
        run(
          C.s2b,
          ctxOf(
            CHAPTER(["and the Spirit came. Spirit moved."]),
            "en/acts/CHAPTER-1.md",
          ),
        ),
      ),
    ).toEqual(["Spirit:main"]);
    const c = ctxOf(
      "# T\n## A. X\nsee the Word Biblical Commentary\n**Sources:** Word, 1987\n| Verbo | Hebraico |\n| x | Verbo raro |\nthe Verbo principal of the clause",
      "pt-br/genesis/CONTEXT.md",
    );
    expect(cls(run(C.s2b, c))).toEqual([
      "Verbo:table-cell",
      "Verbo:table-cell",
    ]);
  });
  it("S3: rejected rendering in main; mention in notes; πάσχα, πίστις, Ἰουδαῖοι, μετάνοια (DE Umkehr); HB terms only in Genesis", () => {
    const c = ctxOf(
      CHAPTER(["They preached repentance at Passover to the Jews by faith."]),
      "en/luke/CHAPTER-1.md",
    );
    expect(cls(run(C.s3, c))).toEqual([
      "ioudaioi-jews:main",
      "only-begotten:mention",
      "pascha:main",
      "pistis-faith:main",
      "repent:main",
    ]);
    const de = ctxOf(
      CHAPTER(["eine Eintauchung der Umkehr"], { locale: "de" }),
      "de/luke/CHAPTER-3.md",
    );
    expect(
      cls(run(C.s3, de)).filter((x) => !x.startsWith("only-begotten")),
    ).toEqual(["baptisma-variant:main", "repent:main"]);
    expect(
      cls(
        run(C.s3, ctxOf(CHAPTER(["into the boat"]), "en/genesis/CHAPTER-6.md")),
      ),
    ).toEqual(["tebah-boat:main"]);
    expect(
      run(
        C.s3,
        ctxOf(CHAPTER(["into the boat"]), "en/mark/CHAPTER-1.md"),
      ).filter((h) => h.cls.startsWith("tebah")),
    ).toEqual([]);
  });
  it("S4: soul in main vs TT voice vs mention", () => {
    const c = ctxOf(
      CHAPTER(["my soul magnifies"], {
        notes: ['the soul here; NOT "soul" there'],
      }),
      "en/luke/CHAPTER-1.md",
    );
    expect(cls(run(C.s4, c))).toEqual(["main", "mention", "tt-voice"]);
  });
  it("S5d: redundant pair (also modulo accents/case), stale policy, (not Jesus) only for tabled familiar names", () => {
    const c = ctxOf(
      "# T\n## A. X\nSarai (Sarai) met Natan (Natán) and Yeshua (not Jesus), not (not Banana). Proper names follow TT transliteration.",
      "en/john/CONTEXT.md",
    );
    expect(cls(run(C.s5d, c, new Set(["Jesus"])))).toEqual([
      "redundant-pair",
      "redundant-pair",
      "stale-policy",
      "stale-policy",
    ]);
  });
  it("S5d: a gloss repeated in the continuous reading (its own name section) is reported", () => {
    const c = ctxOf(
      CHAPTER(["Kefa (Peter) went.", "Peter came."], {
        continuous: "¹Kefa (Peter) went. ²Kefa (Peter) came.",
      }),
      "en/acts/CHAPTER-1.md",
    );
    const hits = [];
    repeatedGlosses([c], sink(hits));
    expect(cls(hits)).toEqual(["repeated-gloss:cr"]);
  });
  it("S6a/S6e/S7d: renderings compared per verse (glosses collapsed, multi-verse quote allowed)", () => {
    const verses = ['He said @@"Come.@@', 'And *the* man went."'];
    const same = ctxOf(
      CHAPTER(verses, {
        continuous: '¹He said @@"Come.@@ ²And *the* man went."',
      }),
      "en/john/CHAPTER-1.md",
    );
    expect(run(C.s6s7, same, C.chapterModel(same))).toEqual([]);
    const spanCr = ctxOf(
      CHAPTER(['He said @@"Come.@@', '@@Go."@@'], {
        continuous: '¹He said @@"Come. ²Go."@@',
      }),
      "en/john/CHAPTER-1.md",
    );
    expect(only(run(C.s6s7, spanCr, C.chapterModel(spanCr)), "S6a")).toEqual(
      [],
    );
    const diff = ctxOf(
      CHAPTER(verses, {
        continuous: '¹He said "Come. ²And the man and his wife went."',
      }),
      "en/john/CHAPTER-1.md",
    );
    expect(
      run(C.s6s7, diff, C.chapterModel(diff)).map((h) => `${h.check}:${h.cls}`),
    ).toEqual(
      expect.arrayContaining([
        "S6a:coverage-differs",
        "S7d:italics-differ",
        "S6e:words",
      ]),
    );
    const punct = ctxOf(
      CHAPTER(["He went."], { continuous: "¹He went!" }),
      "en/john/CHAPTER-1.md",
    );
    expect(cls(only(run(C.s6s7, punct, C.chapterModel(punct)), "S6e"))).toEqual(
      ["punctuation-or-markup"],
    );
  });
  it("S6e: a first-occurrence gloss is not a word difference — the real Gen 4:4 (impl. review R2-1)", () => {
    const study =
      "And Hevel (Abel), he also brought from the firstborn of his flock and from their fat. And YHWH regarded Abel and his offering,";
    const cr =
      "And Abel, he also brought from the firstborn of his flock and from their fat. And YHWH regarded Abel and his offering,";
    const c = ctxOf(
      CHAPTER([study], { continuous: `⁴${cr}`, start: 4 }),
      "en/genesis/CHAPTER-4.md",
    );
    expect(cls(only(run(C.s6s7, c, C.chapterModel(c)), "S6e"))).toEqual([
      "gloss-in-study-only",
    ]);
    expect(C.collapseGlosses("deine Frau Elisheva (Elisabeth)")).toBe(
      "deine Frau Elisabeth",
    );
    expect(C.collapseGlosses("Shimon Kefa (Simon Peter) said")).toBe(
      "Simon Peter said",
    );
    const crOnly = ctxOf(
      CHAPTER(["Abel kept sheep."], {
        continuous: "²Hevel (Abel) kept sheep.",
        start: 2,
      }),
      "es/genesis/CHAPTER-4.md",
    );
    expect(
      cls(only(run(C.s6s7, crOnly, C.chapterModel(crOnly)), "S6e")),
    ).toEqual(["gloss-in-cr-only"]);
  });
  it("S6b/S6d/S7c: backticked markers; legends exempt; unbalanced @@ in notes and continuous reading; bold in verse text", () => {
    const c = ctxOf(
      CHAPTER(['@@"x"@@ and **bold**'], {
        notes: ["God says @@ here"],
        continuous: '¹@@"x and **bold**',
      }).replace(
        "## CHAPTER OVERVIEW",
        '- @@"…"@@ — divine speech opens with @@\n## CHAPTER OVERVIEW',
      ),
      "en/john/CHAPTER-1.md",
    );
    expect(
      run(C.s6b, c)
        .map((h) => `${h.check}:${h.cls}`)
        .sort(),
    ).toEqual(["S6b:backticked-marker", "S6d:unbalanced-note"]);
    expect(
      run(C.s6s7, c, C.chapterModel(c))
        .filter((h) => h.check === "S6d" || h.check === "S7c")
        .map((h) => `${h.check}:${h.cls}`)
        .sort(),
    ).toEqual(["S6d:unbalanced-continuous", "S7c:bold-in-main"]);
  });
  it("S6f: citation formula, messenger, human quote (straight and DE quotes), logged unresolved boundary", () => {
    const c = ctxOf(
      CHAPTER([
        'because it is written, @@"Be holy"@@',
        'the angel said, @@"Fear not"@@',
        'Yeshua said, @@"Come"@@',
      ]),
      "en/1-peter/CHAPTER-1.md",
    );
    expect(cls(run(C.s6f, c, C.chapterModel(c)))).toEqual([
      "after-citation-formula",
      "messenger-context",
    ]);
    const quoted = ctxOf(
      CHAPTER(['He said "as God says @@come@@"'], {
        continuous: '¹He said "as God says @@come@@"',
      }),
      "en/acts/CHAPTER-2.md",
    );
    expect(cls(run(C.s6f, quoted, C.chapterModel(quoted)))).toEqual([
      "inside-human-quote",
    ]);
    // DE closes „…" with a straight quote: the speaker's quote is over before @@
    const de = ctxOf(
      CHAPTER(['Er sagte „gut" und @@komm@@'], {
        locale: "de",
        continuous: '¹Er sagte „gut" und @@komm@@',
      }),
      "de/acts/CHAPTER-2.md",
    );
    expect(run(C.s6f, de, C.chapterModel(de))).toEqual([]);
    // John 3:16 (J-007: the speaker boundary is logged as unresolved)
    const j = ctxOf(
      CHAPTER(
        [
          '@@"For God so loved the world that he gave the only-born son, so that everyone trusting in him should not perish but have life of the age."@@',
        ],
        { start: 16 },
      ),
      "en/john/CHAPTER-3.md",
    );
    expect(cls(run(C.s6f, j, C.chapterModel(j)))).toEqual([
      "logged-unresolved-speaker",
    ]);
  });
  it("S7a: PT T-20 class by per-verse article accounting; possessives and doubled articles; other forms inventoried", () => {
    const pt = ctxOf(
      CHAPTER(["veio na *carne* e à *casa*"]),
      "pt-br/john/CHAPTER-1.md",
    );
    const en = ctxOf(CHAPTER(["came in *the* flesh"]), "en/john/CHAPTER-1.md");
    expect(cls(run(C.s7a, pt, C.chapterModel(en)))).toEqual([
      "outside-main:cr",
      "outside-main:cr",
      "pivot-likely",
      "pivot-likely",
    ]);
    const notCr = (x) => !x.startsWith("outside");
    // equal article counts → review, not pivot-likely
    const even = ctxOf(
      CHAPTER(["veio na *carne* e *a* casa"]),
      "pt-br/john/CHAPTER-1.md",
    );
    expect(cls(run(C.s7a, even, C.chapterModel(en))).filter(notCr)).toEqual([
      "review",
    ]);
    const ok = ctxOf(
      CHAPTER(["veio n*a* carne ao *ver* pelos *vossos* d*uma* vez"]),
      "pt-br/john/CHAPTER-1.md",
    );
    expect(cls(run(C.s7a, ok, C.chapterModel(en))).filter(notCr)).toEqual([
      "ao+infinitive",
      "form:intra-word",
      "form:intra-word",
      "possessive",
    ]);
    const de = ctxOf(
      CHAPTER(["getauft im *dem* heiligen Geist, *zum* Haus"], {
        locale: "de",
      }),
      "de/acts/CHAPTER-1.md",
    );
    expect(cls(run(C.s7a, de, C.chapterModel(en))).filter(notCr)).toEqual([
      "doubled-article",
      "form:whole-contraction",
    ]);
  });
  it("S8: status, reviewers, ruleset; the chapter pill word vs the i18n badge term", () => {
    expect(run(C.s8, ctxOf(CHAPTER(["x"]), "en/john/CHAPTER-1.md"))).toEqual(
      [],
    );
    const bad = ctxOf(
      "# T\n**Status:** reviewed\n**Ruleset:** v3.3\n## A. X\nt",
      "en/john/CONTEXT.md",
    );
    expect(cls(run(C.s8, bad))).toEqual([
      "ruleset-v3.3",
      "status-not-provisional",
    ]);
    expect(
      cls(
        run(
          C.s8,
          ctxOf(CHAPTER(["x"], { reviewers: false }), "en/john/CHAPTER-1.md"),
        ),
      ),
    ).toEqual(["no-reviewers"]);
    const de = ctxOf(
      CHAPTER(["x"], {
        locale: "de",
        status: "provisorisch — ausstehende Prüfung",
      }),
      "de/acts/CHAPTER-1.md",
    );
    expect(cls(run(C.s8, de))).toEqual(["pill-word≠badge-term"]);
    const deOk = ctxOf(
      CHAPTER(["x"], { locale: "de", status: "vorläufig (Regel 28)" }),
      "de/acts/CHAPTER-1.md",
    );
    expect(run(C.s8, deOk)).toEqual([]);
  });
  it("S9: IDs, paths (incl. backticked), process words, propagation, provenance, tier jargon, rule refs; see-field and render state", () => {
    const c = ctxOf(
      "# T\n**Companion to:** `x` (P-001)\n## A. X\nsee P-009 and `docs/audit/X.md`; propaganda; the pivot of the sermon; on propagation (Rule 11)\n- **See:** acts/PEOPLE.md\n- Drafted by: Claude Opus 4.8 (AI assistant); a Tier 2 note; Rules 11 and 30",
      "en/john/PEOPLE.md",
    );
    const hits = run(C.s9, c);
    expect(cls(hits)).toEqual([
      "ai-provenance",
      "ai-provenance",
      "ai-provenance",
      "editorial-id",
      "editorial-id",
      "propagation-word",
      "repo-path",
      "repo-path:see-field",
      "rule-ref",
      "rule-ref",
      "tier-jargon",
    ]);
    expect(hits.find((h) => h.match === "P-001").render).toBe("no");
  });
  it("S10: stamp field vs citation vs prose (a stamp field wins over an amendment word)", () => {
    const c = ctxOf(
      "# T\n**Ruleset:** v3.3\n**Ruleset:** v3.3 cross-book convention\n## A. X\nper the v3.3.2 cross-book convention\nthe TT ruleset (v3.3) says\nv3.4 is current",
      "en/john/CONTEXT.md",
    );
    expect(run(C.s10, c).map((h) => h.cls)).toEqual([
      "stamp-field",
      "stamp-field",
      "citation",
      "prose-stamp",
    ]);
  });
  it("S12: mojibake — C1 controls (one hit per run), Win-1252 capitals, U+FFFD; not PT â or Â in caps", () => {
    const c = ctxOf(
      "# T\n## A\nSummary â\u0080\u0094 Table, câmara, OBSERVÂNCIA, MatthÃ¤us\nAÃ‡ÃƒO and �",
      "en/genesis/PEOPLE.md",
    );
    expect(run(C.s12, c).length).toBe(5);
  });
  it("S13: DE Yehudim; lowercase yehudim elsewhere", () => {
    expect(
      cls(
        run(
          C.s13,
          ctxOf(
            "# T\n## A\ndie Yehudim, ein Yehudi und Jehudim",
            "de/john/CONTEXT.md",
          ),
        ),
      ),
    ).toEqual(["yehudi-other", "yehudim"]);
    expect(
      cls(
        run(
          C.s13,
          ctxOf(
            CHAPTER(["os yehudim e os Yehudim"]),
            "pt-br/john/CHAPTER-2.md",
          ),
        ),
      ),
    ).toEqual(["yehudim-lowercase"]);
  });
  it("S14: PT register — pronouns and vós verb forms, verse text only; names in -ai skipped", () => {
    const c = ctxOf(
      CHAPTER(
        ["vós e vocês; Preparai o caminho, recebeis e sabíeis no Sinai"],
        { notes: ["vós in a note"] },
      ),
      "pt-br/luke/CHAPTER-3.md",
    );
    expect(cls(run(C.s14, c))).toEqual([
      "voces",
      "vos",
      "vos-verb?",
      "vos-verb?",
      "vos-verb?",
    ]);
  });
  it("S15: renderer-hostile markup", () => {
    const c = ctxOf(
      "# T\n## A\n{a:x/y text\n| @@x@@ |\nA -> B\none *odd\nthe first hand א* reads",
      "en/john/CONTEXT.md",
    );
    expect(cls(run(C.s15, c))).toEqual([
      "ascii-arrow",
      "marker-in-table",
      "odd-asterisk",
      "siglum-asterisk",
      "unbalanced-brace",
    ]);
  });
  it("S17: χριστός renderings per form, main text only; John 1:41 renders Μεσσίας", () => {
    const c = ctxOf(
      CHAPTER(["Yeshua the Messiah, the anointed one"], {
        notes: ["Christ in a note"],
      }),
      "en/1-peter/CHAPTER-1.md",
    );
    expect(cls(run(C.s17, c))).toEqual(["anointed", "messiah"]);
    const j = ctxOf(
      CHAPTER(['"We have found the Messiah"'], { start: 41 }),
      "en/john/CHAPTER-1.md",
    );
    expect(cls(run(C.s17, j))).toEqual(["messias-source"]);
  });
  it("S18: Tier-2 note bodies (bullets and paragraphs) of 3+ sentences", () => {
    const c = ctxOf(
      CHAPTER(["x", "y", "z"], {
        notes: [
          "One. Two. Three. Four. Five. Six.",
          "One. Two. Three.",
          "One. Two.",
        ],
      }).replace(
        "> - One. Two.\n",
        "> - One. Two.\n> Para one. Para two. Para three. Para four.\n",
      ),
      "en/john/CHAPTER-1.md",
    );
    expect(cls(run(C.s18, c))).toEqual([
      "sentences=3",
      "sentences=4-5",
      "sentences>5",
    ]);
  });
  it("S19: hinneh cited in a Genesis note requires the locked form", () => {
    const en = ctxOf(
      CHAPTER(["and behold, it was good", "see, it was good"], {
        notes: ["*hinneh* here", "*hinneh* again"],
      }),
      "en/genesis/CHAPTER-1.md",
    );
    expect(run(C.s19, en, C.chapterModel(en)).map((h) => h.match)).toEqual([
      "v1",
    ]);
  });
  it("S20: Rule 20 titular nouns lowercase in verse text; capitalized added words", () => {
    const c = ctxOf(
      CHAPTER([
        "the Father loves the Son; the Son of Man came. Father, hear.",
        "the Mighty *One* did it",
      ]),
      "en/john/CHAPTER-3.md",
    );
    expect(cls(run(C.s20, c))).toEqual(["Father", "Son", "added-capitalized"]);
    expect(
      run(
        C.s20,
        ctxOf(CHAPTER(["der Vater"], { locale: "de" }), "de/john/CHAPTER-3.md"),
      ),
    ).toEqual([]);
  });
  it("S21: marker values outside the glossary tables; bare slash renderings", () => {
    const cells = extractTableCells(
      "| G | EN |\n|---|---|\n| x | **tebah** (ark/vessel) |\n| y | wind/spirit |",
      "t",
    );
    expect(cells.has("tebah")).toBe(true);
    expect(cells.has("ark/vessel")).toBe(true);
    const c = ctxOf(
      CHAPTER([
        "the {a:wind/spirit} and {t:tebah} and {a:rising/dawn} and {t:Hades}; in wind/spirit and fire",
      ]),
      "en/matthew/CHAPTER-3.md",
    );
    expect(cls(run(C.s21, c, cells))).toEqual([
      "a-value-not-in-glossary",
      "bare-slash",
      "t-value-not-in-glossary",
    ]);
    expect(() => extractTableCells("no tables", "t")).toThrow();
  });
  it("S22: EN dual labels against the registry; note icons", () => {
    const c = ctxOf(
      "# T\n## A. X\n### E\n**[HISTORICAL / ARCHAEOLOGICAL — PROBABLE]** ok **[HISTORICAL — PROBABLE]** **[TEXTUAL — POSSIBLE INFERENCE]** **[TEXTUAL / HISTORICAL — VERIFIED]** **[PROBABLE]** **[PEER-REVIEWED — DOCUMENTED]**",
      "en/acts/INTRODUCTION.md",
    );
    expect(cls(run(C.s22, c))).toEqual([
      "claim-off-list",
      "combined-claim-types",
      "confidence-off-list",
      "label-without-confidence",
    ]);
    const icons = ctxOf(
      CHAPTER(["x"], { notes: ["n"] }).replace(
        "> **NOTES**",
        "> **NOTES**\n> ⚠️ **TITLE**\n> 🟡 **TITLE**",
      ),
      "pt-br/genesis/CHAPTER-9.md",
    );
    expect(cls(run(C.s22, icons))).toEqual(["note-icon-off-list"]);
  });
});

describe("corpus checks", () => {
  it("rule tables parse; an empty name table is a tool error", () => {
    const md =
      "## PROPER-NAME TABLE — X\n### Person Names\n| Hebrew | Transliterated | EN Familiar | PT Familiar | DE Familiar | ES Familiar |\n|---|---|---|---|---|---|\n| x | Mosheh | Moses | Moisés | Mose | Moisés |";
    expect(extractNameTables(md, "t")[0]).toMatchObject({
      translit: "Mosheh",
      familiar: { en: "Moses", de: "Mose" },
    });
    expect(() =>
      extractNameTables(
        "## PROPER-NAME TABLE\n| a | Transliterated |\n|---|---|",
        "t",
      ),
    ).toThrow();
    expect(() => extractNameTables("## OTHER", "t")).toThrow();
  });
  it("name inventory: tabled, conflict, reversed, untabled; lead words stripped; tail and DE genitive tabled; non-names dropped", () => {
    const table = [
      { translit: "Mosheh", familiar: { en: "Moses" } },
      { translit: "Kenaan", familiar: { en: "Canaan", de: "Kanaan" } },
      { translit: "Yochanan", familiar: { de: "Johannes" } },
    ];
    const c = ctxOf(
      "# T\n## A\nMosheh (Moses), Moshe (Moses), Moses (Mosheh), And Zavdai (Zebedee), Cursed Kenaan (Canaan), CE (Temple destroyed), YHWH (Probable)",
      "en/mark/CONTEXT.md",
    );
    const de = ctxOf(
      "# T\n## A\nYochanans (Johannes) Taufe",
      "de/mark/CONTEXT.md",
    );
    const inv = nameInventory([c, de], table, sink([]));
    expect(Object.fromEntries(inv.map((e) => [e.translit, e.cls]))).toEqual({
      Mosheh: "tabled+multi-translit",
      Moshe: "conflict",
      Moses: "reversed",
      Zavdai: "untabled",
      "Cursed Kenaan": "tabled",
      Yochanans: "tabled",
    });
  });
  it("verse parity: @@ count and italic delta vs EN", () => {
    const pair = (enV, ptV) => {
      const en = ctxOf(CHAPTER([enV]), "en/john/CHAPTER-1.md");
      const pt = ctxOf(CHAPTER([ptV]), "pt-br/john/CHAPTER-1.md");
      const hits = [];
      verseParity(
        new Map([
          [en.key, en],
          [pt.key, pt],
        ]),
        new Map([
          [en.key, C.chapterModel(en)],
          [pt.key, C.chapterModel(pt)],
        ]),
        sink(hits),
      );
      return hits.map((h) => `${h.check}:${h.cls}`).sort();
    };
    expect(pair('@@"a"@@ *x* *y*', '"a"')).toEqual([
      "S6c:divine-count",
      "S7b:delta>=2",
    ]);
    expect(pair("*x* b", "*x* *y* *z*")).toEqual(["S7b:delta>=2"]);
    expect(pair("*x* b", "*x* *y*")).toEqual([]);
  });
  it("ES accents: dominance (≥3), ambiguity, o/ó verbs, interrogatives, No sé, a el, spurious accents, generative rules", () => {
    const text = [
      "# T",
      "## A",
      "creación creación creación creacion. Gen Génesis Génesis Génesis.",
      "esta está está está. llamó llamó llamó llamo. a el. de El.",
      '¿Donde está? Y él dijo: "No se." No se registra nada.',
      "**Fuente:** Wenham, *Genesis 1–15* (creacion).",
      "[x](#creacion-vs-hizo)",
      "pájaro pájaro pajaro. Día día día Dia.",
      `${"generaciones ".repeat(20)}generaciónes.`,
      "la glorificacion; lo levantare; levantar; tecnicamente; técnica técnica; *habia* en nota",
    ].join("\n");
    const hits = [];
    esAccents([ctxOf(text, "es/genesis/CONTEXT.md")], sink(hits));
    expect(hits.map((h) => `${h.cls}:${h.match}`).sort()).toEqual([
      "a-el/de-el:a el",
      "ambiguous:esta→está",
      "interrogative:¿Donde",
      "missing-accent:adverb:tecnicamente→técnicamente",
      "missing-accent:creacion→creación",
      "missing-accent:future:levantare→levantaré",
      "missing-accent:glorificacion→glorificación",
      "no-se→no-sé:No se",
      "o/ó-verb:llamo→llamó",
      "spurious-accent?:generaciónes→generaciones",
    ]);
  });
  it("ES accents: italics are TT prose in verse text (Rule 11 additions), titles elsewhere (impl. review R1-6)", () => {
    const verse = ctxOf(
      CHAPTER(["*habia* una vez; había había había"]),
      "es/genesis/CHAPTER-8.md",
    );
    const vh = [];
    esAccents([verse], sink(vh));
    expect(vh.map((h) => h.match)).toContain("habia→había");
  });
});

const ANCHORS = JSON.parse(
  readFileSync(
    new URL("./fixtures/recall-anchors.json", import.meta.url),
    "utf8",
  ),
);
describe("recall on frozen real lines (fixtures/recall-anchors.json)", () => {
  /** Put a real line back in the zone it came from, inside a minimal file of the same kind. */
  const shell = (a) => {
    const [locale, book, ...rest] = a.source.split(":")[0].split("/");
    const file = rest.join("/");
    const rel = `${locale}/${book}/${file}`;
    if (!/^CHAPTER-\d+\.md$/.test(file))
      return ctxOf(`# T\n## A. Section\n### Entry\n${a.text}`, rel);
    const base = CHAPTER(["x"], { locale });
    if (a.zone === "main") return ctxOf(CHAPTER([a.text], { locale }), rel);
    if (a.zone === "note")
      return ctxOf(base.replace("> **NOTES**", `> **NOTES**\n${a.text}`), rel);
    if (a.zone === "front")
      return ctxOf(base.replace(/^\*\*Status:\*\*.*$/m, a.text), rel);
    return ctxOf(
      base.replace("## CHAPTER OVERVIEW", `## CHAPTER OVERVIEW\n${a.text}`),
      rel,
    );
  };
  it("has the anchors", () => {
    expect(ANCHORS.length).toBeGreaterThan(15);
  });
  for (const a of ANCHORS)
    it(`${a.check} ${a.cls} — ${a.source}`, () => {
      const ctx = shell(a);
      const hits = [];
      const add = sink(hits);
      for (const fn of C.PER_FILE) fn(ctx, add);
      C.s5d(ctx, add, new Set());
      C.s7a(ctx, add, null);
      C.s21(ctx, add, new Set());
      if (ctx.locale === "es") esAccents([ctx], add);
      expect(
        hits.some((h) => h.check === a.check && h.cls === a.cls),
        JSON.stringify(hits.map((h) => `${h.check}:${h.cls}`)),
      ).toBe(true);
    });
});

describe("CLI", () => {
  it("--check validates ids and selects families exactly", () => {
    expect(parseArgs([])).toEqual({ only: null, stdout: false });
    expect(parseArgs(["--check", "S3,S1"]).only).toEqual(["S3", "S1"]);
    expect(() => parseArgs(["--check"])).toThrow(/needs/);
    expect(() => parseArgs(["--check", "--stdout"])).toThrow(/needs/);
    expect(() => parseArgs(["--check", "S99"])).toThrow(/unknown/);
    expect(() => parseArgs(["--check", "s3"])).toThrow(/unknown/);
    expect(selects("S1", "S1c")).toBe(true);
    expect(selects("S1", "S10")).toBe(false);
    expect(selects("S1c", "S1c")).toBe(true);
  });
});

describe("live corpus (tool health only — never the presence of a defect)", () => {
  /** @type {ReturnType<typeof runSweep>} */
  let res;
  // scan in a hook, not at collection (collection has no timeout and blocks the worker)
  beforeAll(() => {
    res = runSweep();
  }, 60_000);
  it("scans every file with zero tool errors; every per-file check ran on every file; only known check ids", () => {
    expect(res.files).toBeGreaterThan(400);
    expect(res.chapters).toBeGreaterThan(100);
    expect(res.tableRows).toBeGreaterThan(50);
    for (const fn of C.PER_FILE) expect(res.ran.get(fn.name)).toBe(res.files);
    expect(new Set(res.hits.map((h) => h.check))).toSatisfy((ids) =>
      [...ids].every((id) => CHECK_IDS.includes(id)),
    );
  });
  it("is deterministic", () => {
    const again = runSweep();
    expect(again.hits.map((h) => JSON.stringify(h))).toEqual(
      res.hits.map((h) => JSON.stringify(h)),
    );
  }, 60_000);
});

describe("anti-vacuity", () => {
  it("every check id is produced by at least one fixture above", () => {
    expect(CHECK_IDS.filter((c) => !SEEN.has(c))).toEqual([]);
  });
});
