// Fixture tests for the content sweep (PLAN_CONTENT_SWEEP.md §5): each check
// has positive and negative cases; the smoke test runs the real corpus.
import { describe, expect, it } from "vitest";
import { runSweep } from "../../content-sweep.mjs";
import * as C from "../checks.mjs";
import { esAccents, nameInventory, verseParity } from "../corpus.mjs";
import { extractNameTables } from "../name-tables.mjs";
import {
  classifyUseMention,
  divineCoverage,
  inCapsRun,
  isSentenceStart,
  italicSpans,
} from "../text.mjs";
import { ZoneError, zoneLines } from "../zones.mjs";

const SUP = "¹²³⁴⁵⁶⁷⁸⁹";
const CHAPTER = (verses, { continuous, locale = "en", notes } = {}) =>
  [
    "# JOHN 1",
    "## The Transparent Translation (TT)",
    "",
    "**Status:** provisional — pending reviewer sign-off (Rule 28)",
    "**Reviewers:** Hellenist: unassigned",
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
    continuous ?? verses.map((v, i) => `${SUP[i]}${v}`).join(" "),
    "## VERSE-BY-VERSE STUDY",
    ...verses.flatMap((v, i) => [
      `### **${locale === "de" ? "Vers" : "Verse"} ${i + 1}**`,
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
function run(fn, ctx, ...extra) {
  const hits = [];
  fn(ctx, (h) => hits.push(h), ...extra);
  return hits;
}
const cls = (hits) => hits.map((h) => h.cls).sort();

describe("zones", () => {
  const ctx = ctxOf(
    CHAPTER(["In *the* beginning was the word.", "He was with God."]),
    "en/john/CHAPTER-1.md",
  );
  const at = (needle) =>
    ctx.zones[ctx.lines.findIndex((l) => l.includes(needle))];
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
  it("non-chapter files: header not rendered (except the disclaimer); Sources after 4a; empty companion sections dropped", () => {
    const c = ctxOf(
      "# T\n## The Transparent Translation (TT)\n> **Disclaimer.**\n**Ruleset:** v3.3\n## A. Section\n### Entry\ntext\n## B. Empty\nprose\n## H. Sources Consulted\n- a book",
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
      "apparatus/after-4a",
      "apparatus/after-4a",
    ]);
  });
});

describe("text helpers", () => {
  it("classifyUseMention: negation, quotes, italics → mention; reading text always use", () => {
    expect(classifyUseMention('NOT "soul" here', 5, "note")).toBe("mention");
    expect(classifyUseMention("rather than eternal life", 12, "note")).toBe(
      "mention",
    );
    expect(classifyUseMention("the gospel says", 4, "note")).toBe("use");
    expect(classifyUseMention("not soul", 4, "main")).toBe("use");
    expect(classifyUseMention("not soul", 4, "cr")).toBe("use");
    expect(classifyUseMention("„nicht Seele“ und", 1, "note")).toBe("mention");
  });
  it("inCapsRun: typographic caps vs a rendering; acronyms are not a run", () => {
    expect(inCapsRun("THE EYES OF THE LORD", 16, 4)).toBe(true);
    expect(inCapsRun("on the LORD who", 7, 4)).toBe(false);
    expect(inCapsRun("the LORD (YHWH) said", 4, 4)).toBe(false);
  });
  it("isSentenceStart", () => {
    expect(isSentenceStart("Son of man", 0)).toBe(true);
    expect(isSentenceStart('He said. "Son', 10)).toBe(true);
    expect(isSentenceStart("the Son", 4)).toBe(false);
    expect(isSentenceStart("¹⁶Son", 2)).toBe(true);
  });
  it("italicSpans ignores bold", () => {
    expect(italicSpans("a *the* b **BOLD** *x y*")).toEqual(["the", "x y"]);
  });
  it("divineCoverage carries state across verses only when asked", () => {
    const chunks = [
      [1, 'He said @@"one'],
      [2, 'two"@@ done'],
    ];
    expect(divineCoverage(chunks, true).covered.get(2)).toBe("two");
    expect(divineCoverage(chunks, false).unbalanced).toEqual([1, 2]);
  });
  it("sentences: abbreviations and verse refs do not split", () => {
    expect(C.sentences("One. Two (cf. v. 3). Three. Four.")).toBe(4);
    expect(C.sentences("See Gen. 1 and vv. 2–3. Then done.")).toBe(2);
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
  it("S1c: quoted OT LORD is use; caps headings skipped; convention discussion is a mention", () => {
    const en = ctxOf(
      '# T\n## A. X\n"Cast your burden on the LORD" (Ps 55:22)\n> 🔴 **THE EYES OF THE LORD**\nMost translations substitute "the LORD" here',
      "en/1-peter/CONTEXT.md",
    );
    expect(cls(run(C.s1, en))).toEqual(["convention-mention", "use"]);
  });
  it("S2a: capitalized son of man counted once per verse (CR copy excluded); sentence-initial skipped; DE exempt", () => {
    const en = ctxOf(
      CHAPTER([
        "the Son of Man came; the son of man went.",
        "Son of man, rise.",
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
  it("S2b: capitalized Spirit mid-sentence", () => {
    expect(
      cls(
        run(
          C.s2b,
          ctxOf(CHAPTER(["and the Spirit came"]), "en/acts/CHAPTER-1.md"),
        ),
      ),
    ).toEqual(["Spirit:main"]);
  });
  it("S3: rejected rendering in main; mention in notes; πάσχα = Pesach; HB terms only in Genesis", () => {
    const c = ctxOf(
      CHAPTER(["They preached repentance at Passover."]),
      "en/luke/CHAPTER-1.md",
    );
    expect(cls(run(C.s3, c))).toEqual([
      "only-begotten:mention",
      "pascha:main",
      "repent:main",
    ]);
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
  it("S5d: redundant pair, stale policy, (not Jesus)", () => {
    const c = ctxOf(
      "# T\n## A. X\nSarai (Sarai) met Yeshua (not Jesus). Proper names follow TT transliteration.",
      "en/john/CONTEXT.md",
    );
    expect(cls(run(C.s5d, c, new Set(["Jesus"])))).toEqual([
      "redundant-pair",
      "stale-policy",
      "stale-policy",
    ]);
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
    expect(
      run(C.s6s7, spanCr, C.chapterModel(spanCr)).filter(
        (h) => h.check === "S6a",
      ),
    ).toEqual([]);
    const diff = ctxOf(
      CHAPTER(verses, {
        continuous: '¹He said "Come. ²And the man Yochanan (John) went."',
      }),
      "en/john/CHAPTER-1.md",
    );
    const checks = run(C.s6s7, diff, C.chapterModel(diff)).map(
      (h) => `${h.check}:${h.cls}`,
    );
    expect(checks).toEqual(
      expect.arrayContaining([
        "S6a:coverage-differs",
        "S7d:italics-differ",
        "S6e:words",
      ]),
    );
  });
  it("S6b: backticked markers; the bare legend is exempt; unbalanced @@ in notes", () => {
    const c = ctxOf(
      CHAPTER(['@@"x"@@'], { notes: ["God says @@ here"] }),
      "en/john/CHAPTER-1.md",
    );
    expect(
      run(C.s6b, c)
        .map((h) => `${h.check}:${h.cls}`)
        .sort(),
    ).toEqual(["S6b:backticked-marker", "S6d:unbalanced-note"]);
  });
  it("S6f: divine marking after a citation formula or in a messenger context", () => {
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
  });
  it("S7a: T-20 class classified by per-verse article accounting; other forms inventoried", () => {
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
    const ok = ctxOf(
      CHAPTER(["veio n*a* carne ao *ver*"]),
      "pt-br/john/CHAPTER-1.md",
    );
    expect(cls(run(C.s7a, ok, C.chapterModel(en)))).toEqual([
      "ao+infinitive",
      "form:intra-word",
      "outside-main:cr",
    ]);
  });
  it("S8: front-matter status, reviewers, ruleset", () => {
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
  });
  it("S9: IDs, paths (incl. backticked), process words; see-field and render state; literary 'pivot' is not a leak", () => {
    const c = ctxOf(
      "# T\n**Companion to:** `x` (P-001)\n## A. X\nsee P-009 and `docs/audit/X.md`; propaganda; the pivot of the sermon; on propagation (Rule 11)\n- **See:** acts/PEOPLE.md",
      "en/john/PEOPLE.md",
    );
    const hits = run(C.s9, c);
    expect(cls(hits)).toEqual([
      "editorial-id",
      "editorial-id",
      "process-word",
      "repo-path",
      "repo-path:see-field",
      "rule-ref",
    ]);
    expect(hits.find((h) => h.match === "P-001").render).toBe("no");
  });
  it("S10: stamp field vs citation vs prose", () => {
    const c = ctxOf(
      "# T\n**Ruleset:** v3.3\n## A. X\nper the v3.3.2 cross-book convention\nthe TT ruleset (v3.3) says\nv3.4 is current",
      "en/john/CONTEXT.md",
    );
    expect(run(C.s10, c).map((h) => h.cls)).toEqual([
      "stamp-field",
      "citation",
      "prose-stamp",
    ]);
  });
  it("S12: C1-control mojibake (one hit per run), but not PT â or Â in caps", () => {
    const c = ctxOf(
      "# T\n## A\nSummary â\u0080\u0094 Table, câmara, OBSERVÂNCIA, MatthÃ¤us",
      "en/genesis/PEOPLE.md",
    );
    expect(run(C.s12, c).length).toBe(2);
  });
  it("S13/S14/S15", () => {
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
        run(C.s14, ctxOf(CHAPTER(["vós e vocês"]), "pt-br/acts/CHAPTER-1.md")),
      ),
    ).toEqual(["voces", "vos"]);
    const c = ctxOf(
      "# T\n## A\n{a:x/y text\n| @@x@@ |\nA -> B\none *odd",
      "en/john/CONTEXT.md",
    );
    expect(cls(run(C.s15, c))).toEqual([
      "ascii-arrow",
      "marker-in-table",
      "odd-asterisk",
      "unbalanced-brace",
    ]);
  });
  it("S17: χριστός renderings per form, main text only", () => {
    const c = ctxOf(
      CHAPTER(["Yeshua the Messiah, the anointed one"], {
        notes: ["Christ in a note"],
      }),
      "en/1-peter/CHAPTER-1.md",
    );
    expect(cls(run(C.s17, c))).toEqual(["anointed", "messiah"]);
  });
  it("S18: Tier-2 note bullets over three sentences", () => {
    const c = ctxOf(
      CHAPTER(["x"], { notes: ["One. Two. Three. Four. Five. Six."] }),
      "en/john/CHAPTER-1.md",
    );
    expect(cls(run(C.s18, c))).toEqual(["sentences>5"]);
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
});

describe("corpus checks", () => {
  it("name tables parse; an empty table is a tool error", () => {
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
  it("name inventory: tabled, conflict, reversed, untabled; sentence-initial And stripped; non-names dropped", () => {
    const table = [{ translit: "Mosheh", familiar: { en: "Moses" } }];
    const c = ctxOf(
      "# T\n## A\nMosheh (Moses), Moshe (Moses), Moses (Mosheh), And Zavdai (Zebedee), CE (Temple destroyed), YHWH (Probable)",
      "en/mark/CONTEXT.md",
    );
    const inv = nameInventory([c], table, () => {});
    expect(Object.fromEntries(inv.map((e) => [e.translit, e.cls]))).toEqual({
      Mosheh: "tabled+multi-translit",
      Moshe: "conflict",
      Moses: "reversed",
      Zavdai: "untabled",
    });
  });
  it("verse parity: @@ count and italic delta vs EN", () => {
    const en = ctxOf(CHAPTER(['@@"a"@@ *x* *y*']), "en/john/CHAPTER-1.md");
    const pt = ctxOf(CHAPTER(['"a"']), "pt-br/john/CHAPTER-1.md");
    const models = new Map([
      [en.key, C.chapterModel(en)],
      [pt.key, C.chapterModel(pt)],
    ]);
    const ctxs = new Map([
      [en.key, en],
      [pt.key, pt],
    ]);
    const hits = [];
    verseParity(ctxs, models, (h) => hits.push(h));
    expect(hits.map((h) => h.check).sort()).toEqual(["S6c", "S7b"]);
  });
  it("ES accents: dominance, ambiguity, o/ó verbs, interrogatives, No sé, a el, exclusions", () => {
    const text = [
      "# T",
      "## A",
      "creación creación creación creacion. Gen Génesis Génesis Génesis.",
      "esta está está está. llamó llamó llamó llamo. a el. de El.",
      '¿Donde está? Y él dijo: "No se." No se registra nada.',
      "**Fuente:** Wenham, *Genesis 1–15* (creacion).",
      "[x](#creacion-vs-hizo)",
    ].join("\n");
    const hits = [];
    esAccents([ctxOf(text, "es/genesis/CONTEXT.md")], (h) => hits.push(h));
    expect(hits.map((h) => `${h.cls}:${h.match}`).sort()).toEqual([
      "a-el/de-el:a el",
      "ambiguous:esta→está",
      "interrogative:¿Donde",
      "missing-accent:creacion→creación",
      "no-se→no-sé:No se",
      "o/ó-verb:llamo→llamó",
    ]);
  });
});

describe("real corpus (smoke, anti-vacuous)", () => {
  const res = runSweep();
  it("scans every file with zero tool errors and every check fires somewhere", () => {
    expect(res.files).toBeGreaterThan(400);
    expect(res.chapters).toBeGreaterThan(100);
    expect(res.tableRows).toBeGreaterThan(50);
    const checks = new Set(res.hits.map((h) => h.check));
    for (const c of [
      "S1a",
      "S1b",
      "S1c",
      "S2a",
      "S3",
      "S4",
      "S5c",
      "S5d",
      "S6a",
      "S6f",
      "S7a",
      "S8",
      "S9",
      "S10",
      "S11",
      "S12",
      "S13",
      "S14",
      "S17",
      "S18",
    ])
      expect(checks, c).toContain(c);
  });
  it("recall anchors (PLAN §6.1)", () => {
    const has = (check, file, needle) =>
      res.hits.some(
        (h) =>
          h.check === check &&
          h.file.endsWith(file) &&
          (needle === undefined ||
            h.match.includes(needle) ||
            h.context.includes(needle)),
      );
    expect(has("S1a", "de/john/PEOPLE.md", "YHWHs")).toBe(true);
    expect(has("S1c", "en/1-peter/CHAPTER-5.md", "LORD")).toBe(true);
    expect(
      res.hits.filter(
        (h) => h.check === "S12" && h.file.endsWith("en/genesis/PEOPLE.md"),
      ).length,
    ).toBe(9);
    expect(
      has(
        "S5d",
        "en/john/CHAPTER-3.md",
        "Proper names follow TT transliteration",
      ),
    ).toBe(true);
    expect(has("S9", "en/1-peter/CHAPTER-1.md", "P-0")).toBe(true);
    expect(has("S11", "es/genesis/CHAPTER-4.md", "No se")).toBe(true);
    expect(
      new Set(res.hits.filter((h) => h.check === "S13").map((h) => h.file))
        .size,
    ).toBe(13);
    expect(has("S2a", "en/mark/CHAPTER-2.md", "Son of Man")).toBe(true);
    // playbook T-20 upper bound (whole-file regex count), reproduced exactly
    expect(
      res.hits.filter((h) => h.check === "S7a" && !h.cls.startsWith("form:"))
        .length,
    ).toBe(190);
  });
  it("is deterministic", () => {
    const again = runSweep();
    expect(again.hits.map((h) => JSON.stringify(h))).toEqual(
      res.hits.map((h) => JSON.stringify(h)),
    );
  }, 60_000);
});
