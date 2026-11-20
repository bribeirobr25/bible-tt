import { describe, expect, it } from "vitest";
import { parseEnrichmentMarkdown } from "../enrichment-parser";
import { extractStatus } from "../front-matter";
import { parseChapterMarkdown } from "../markdown-parser";
import { parsePeopleMarkdown, personSlug } from "../people-parser";
import { parseProphecyMarkdown } from "../prophecy-parser";
import { cleanSourcesBlock, isSourcesHeading } from "../sources-block";

describe("isSourcesHeading — heading words, anchored, never the letter", () => {
  it.each([
    "H. Sources Consulted",
    "G. Fontes Consultadas",
    "H. Fuentes consultadas",
    "H. Konsultierte Quellen",
    "H. Herangezogene Quellen",
    "Quellen",
    "Sources",
  ])("matches %s", (h) => expect(isSourcesHeading(h)).toBe(true));
  it.each([
    "G. Curiosities and Open Questions",
    "A. Source Text Features Exposed by TT",
    "A. Características do Texto-Fonte",
    "5. AT-Quellenbreite — die kanonische Oberfläche",
    "Psalm 2 (unresolved source)",
    "The Sources of the Flood Story",
  ])("rejects %s", (h) => expect(isSourcesHeading(h)).toBe(false));
});

describe("cleanSourcesBlock", () => {
  it("drops horizontal rules, collapses blank runs, strips > and normalizes bullets", () => {
    expect(
      cleanSourcesBlock([
        "",
        "| Source | Type |",
        "|---|---|",
        "| A | B |",
        "",
        "---",
        "",
        "> **Editorial provenance:**",
        "- Drafted by: x",
        "* Date: y",
        "",
        "---",
        "",
      ]),
    ).toBe(
      "| Source | Type |\n|---|---|\n| A | B |\n\n**Editorial provenance:**\n• Drafted by: x\n• Date: y",
    );
  });
  it("returns undefined for an empty or rules-only capture", () => {
    expect(cleanSourcesBlock(["", "---", "  "])).toBeUndefined();
    expect(cleanSourcesBlock([])).toBeUndefined();
  });
});

describe("Sources capture closes at the next H2 (no file relies on Sources being last)", () => {
  it("PROPHECY: an entry after Sources is still an entry, not Sources text", () => {
    const d = parseProphecyMarkdown(
      [
        "## Psalm 2 — the anointed",
        "**Verse:** Acts 4:25",
        "**Text says:** quoted",
        "## H. Sources Consulted",
        "| S | T |",
        "|---|---|",
        "| a | b |",
        "## Joel 2 — the spirit poured",
        "**Verse:** Acts 2:17",
        "**Text says:** poured",
      ].join("\n"),
      "acts",
      2,
    );
    expect(d.entries.map((e) => e.verseRef)).toEqual([
      "Acts 4:25",
      "Acts 2:17",
    ]);
    expect(d.sources).toBe("| S | T |\n|---|---|\n| a | b |");
  });

  it("PEOPLE: Sources lines survive a later H2 and the later person still parses", () => {
    const d = parsePeopleMarkdown(
      [
        "## Avram (Abram)",
        "**First mention:** Gn 11:26",
        "## H. Sources Consulted",
        "- Wenham, *Genesis*",
        "## Sarai",
        "**First mention:** Gn 11:29",
      ].join("\n"),
      "genesis",
    );
    expect(d.entries.map((e) => e.name)).toEqual(["Avram", "Sarai"]);
    expect(d.sources).toBe("• Wenham, *Genesis*");
  });

  it("companion: a lettered section after Sources stays a section", () => {
    const d = parseEnrichmentMarkdown(
      [
        "## G. Curiosities",
        "### G1. One",
        "**[TEXTUAL — VERIFIED]**",
        "body",
        "## H. Sources Consulted",
        "| S |",
        "|---|",
        "| a |",
        "## I. The World at the Time",
        "### IA. Scenario",
        "**[HISTORICAL — POSSIBLE]**",
        "world",
      ].join("\n"),
      "genesis",
      1,
    );
    expect(d.sections.map((s) => s.id)).toEqual([
      "curiosities",
      "world-at-the-time",
    ]);
    expect(d.sources).toBe("| S |\n|---|\n| a |");
  });
});

describe("extractStatus", () => {
  it("reads Status and the ES labels Estado / Estatus", () => {
    expect(extractStatus("# T\n**Status:** provisional — pending")).toBe(
      "provisional — pending",
    );
    expect(extractStatus("**Estado:** provisorio")).toBe("provisorio");
    expect(extractStatus("**Estatus:** provisorio")).toBe("provisorio");
    expect(extractStatus("no status here")).toBeUndefined();
  });
});

describe("personSlug — clean URL fragments", () => {
  it("drops ASCII and typographic quotes and slash/paren punctuation", () => {
    expect(personSlug("Ya'aqov")).toBe("yaaqov");
    expect(personSlug("Ya’aqov ʼben")).toBe("yaaqov-ben");
    expect(personSlug("“She” «in» „Babylon“")).toBe("she-in-babylon");
    expect(personSlug("Yosef Barsabbas / Justus")).toBe(
      "yosef-barsabbas-justus",
    );
    expect(personSlug("Herodes (Herod) the tetrarch")).toBe(
      "herodes-herod-the-tetrarch",
    );
    expect(personSlug("Shimon the Kena'ani")).toBe("shimon-the-kenaani");
  });
});

describe("verse blocks — notes vs verse text", () => {
  const chapter = (verse: string) =>
    [
      "# Genesis 1",
      "## The Transparent Translation (TT)",
      "## VERSE-BY-VERSE STUDY",
      "### **Verse 1**",
      verse,
    ].join("\n");

  it("a `>` line after a `---` is still a note, never scripture", () => {
    const d = parseChapterMarkdown(
      chapter("In the beginning.\n---\n> 🔵 **LATE NOTE**\n> - body"),
      "genesis",
      1,
    );
    expect(d.verses[0].mainText).toBe("In the beginning.");
    expect(d.verses[0].notes.map((n) => n.title)).toEqual(["LATE NOTE"]);
  });

  it("an unprefixed line directly under a note line is a lazy continuation of the note", () => {
    const d = parseChapterMarkdown(
      chapter("In the beginning.\n\n> 🔵 **NOTE**\n> - first\nwrapped tail"),
      "genesis",
      1,
    );
    expect(d.verses[0].mainText).toBe("In the beginning.");
    expect(d.verses[0].notes[0].content).toBe("- first\nwrapped tail");
  });
});
