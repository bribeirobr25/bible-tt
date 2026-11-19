// Zone model for the content sweep (PLAN_CONTENT_SWEEP.md §3).
// Every line of a content file gets a zone (where it sits) and a render state
// (whether a reader sees it), because the same string can be a defect in the
// reading text and legitimate in a note that rejects it, and a leak only
// matters where it renders.
//
// Chapter files mirror the parser's own section sets
// (src/infrastructure/content/markdown-parser.ts — keep in sync); other files
// split into the unrendered header block and reader prose, with the
// enrichment/people parsers' dropped sections tagged.

// zones: front · toc · guide · overview · cr (continuous reading prose) ·
// main (verse translation) · note (verse notes) · apparatus (everything else rendered)
export const ZONES = [
  "front",
  "toc",
  "guide",
  "overview",
  "cr",
  "main",
  "note",
  "apparatus",
];

const SECTION_HEADER = /^## (.+)$/;
export const VERSE_HEADER =
  /^### \*\*(?:Verse|Versículo|Versiculo|Vers) (\d+)\*\*$/;

const CONTINUOUS = new Set([
  "CONTINUOUS READING",
  "LEITURA CONTÍNUA",
  "FORTLAUFENDE LESUNG",
  "LECTURA CONTINUA",
]);
const STUDY = new Set([
  "VERSE-BY-VERSE STUDY",
  "ESTUDO VERSO A VERSO",
  "VERS-FÜR-VERS-STUDIE",
  "ESTUDIO VERSÍCULO POR VERSÍCULO",
]);
/** markdown-parser SKIPPED_SECTIONS — exactly; a TOC title missing here RENDERS (as a supplementary section). */
const PARSER_SKIPPED = new Set([
  "TABLE OF CONTENTS",
  "SUMÁRIO",
  "INHALTSVERZEICHNIS",
  "INDICE",
  "ÍNDICE",
]);
const TOC_LIKE =
  /CONTENTS|SUMÁRIO|INHALTSVERZEICHNIS|[IÍ]NDICE|TABLA DE CONTENIDOS/i;
const OVERVIEW = new Set([
  "CHAPTER OVERVIEW",
  "VISÃO GERAL DO CAPÍTULO",
  "KAPITELÜBERSICHT",
  "VISIÓN GENERAL DEL CAPÍTULO",
]);
const GUIDE =
  /READING GUIDE|GUIA DE LEITURA|LESEANLEITUNG|GUIA DE LECTURA|GUÍA DE LECTURA/i;
/** The edition-title H2 under the H1 ("## The Transparent Translation (TT)") — part of the header. */
const TITLE_H2 = /Transparent|Transparente|Übersetzung \(TT\)|\(TT\)\s*$/;
/** "Sources Consulted" blocks: dropped by the enrichment/people parsers today; must render after Step 4a (D2 / audit B2). */
const SOURCES_H2 =
  /^(?:[GH]\.\s|.*(?:Sources Consulted|Fontes Consultadas|Konsultierte Quellen|Fuentes Consultadas))|^(?:Sources|Fontes|Quellen|Fuentes)\b/i;
/** Companion section heading as the enrichment parser reads it. */
const LETTER_H2 = /^## ([A-Z])(?:_\w+)?\.\s+(.+)$/;
const CHAPTER_STATUS = /^\*\*(?:Status|Estado):\*\*/;

const SUP_RUN = /[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g;
export const SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹";
export const supToInt = (s) =>
  Number([...s].map((c) => SUPERSCRIPT.indexOf(c)).join(""));

export class ZoneError extends Error {}

export const isChapterFile = (rel) => /(^|\/)CHAPTER-\d+\.md$/.test(rel);
const isCompanion = (rel) =>
  /\/study\/CHAPTER-\d+-CONTEXT\.md$/.test(rel) ||
  /(^|\/)INTRODUCTION\.md$/.test(rel);

/**
 * @param {string} text  file content
 * @param {string} rel   path relative to content/ (e.g. "en/john/CHAPTER-3.md")
 * @returns {{zone:string, render:"now"|"after-4a"|"no", verse:number|null, section:string, heading?:boolean}[]}
 */
export function zoneLines(text, rel) {
  const lines = text.split("\n");
  return isChapterFile(rel) ? chapterZones(lines, rel) : otherZones(lines, rel);
}

function chapterZones(lines, rel) {
  const out = [];
  let zone = "front";
  let render = "no";
  let section = "";
  let started = false; // a recognized H2 has been seen
  let verse = null;
  let inNotes = false;
  const seen = { cr: false, study: false };
  for (const line of lines) {
    const h = line.match(SECTION_HEADER);
    if (h) {
      const t = h[1].trim();
      verse = null;
      inNotes = false;
      let z = null;
      if (PARSER_SKIPPED.has(t)) z = "toc";
      else if (TOC_LIKE.test(t))
        z = "toc-rendered"; // a TOC the parser does not skip (S16)
      else if (GUIDE.test(t)) z = "guide";
      else if (OVERVIEW.has(t)) z = "overview";
      else if (CONTINUOUS.has(t)) {
        z = "cr";
        seen.cr = true;
      } else if (STUDY.has(t)) {
        z = "study";
        seen.study = true;
      } else if (started) z = "apparatus";
      if (z) {
        started = true;
        zone = z;
        section = t;
      } else if (!started) section = t;
      render = zone === "front" || zone === "toc" ? "no" : "now";
      out.push({
        zone: zoneName(zone),
        render,
        verse: null,
        section,
        heading: true,
      });
      continue;
    }
    if (zone === "cr") {
      // The italic one-line description under the heading is removed by the
      // parser (extractContinuousReading); verse prose is the reading text.
      const desc =
        /^\*[^*].*\*$/.test(line.trim()) && !/[⁰¹²³⁴⁵⁶⁷⁸⁹]/.test(line);
      out.push({
        zone: desc || line.trim() === "---" ? "apparatus" : "cr",
        render: desc ? "no" : "now",
        verse: null,
        section,
      });
      continue;
    }
    if (zone === "study") {
      const v = line.match(VERSE_HEADER);
      if (v) {
        verse = Number(v[1]);
        inNotes = false;
        out.push({
          zone: "apparatus",
          render: "now",
          verse,
          section,
          heading: true,
        });
        continue;
      }
      if (line.startsWith(">")) inNotes = true;
      const z =
        verse === null || line.trim() === "---"
          ? "apparatus"
          : inNotes
            ? "note"
            : "main";
      out.push({ zone: z, render: "now", verse, section });
      continue;
    }
    const r =
      zone === "front" ? (CHAPTER_STATUS.test(line) ? "now" : "no") : render;
    out.push({ zone: zoneName(zone), render: r, verse: null, section });
  }
  if (!seen.cr || !seen.study)
    throw new ZoneError(
      `${rel}: cannot resolve zones (continuous=${seen.cr}, study=${seen.study})`,
    );
  return out;
}
const zoneName = (z) =>
  z === "toc-rendered" ? "toc" : z === "study" ? "apparatus" : z;

function otherZones(lines, rel) {
  const companion = isCompanion(rel);
  // Companion/intro sections with no `### ` entries are dropped by the enrichment parser.
  const entriesPerSection = new Map();
  if (companion) {
    let cur = null;
    for (const l of lines) {
      const m = l.match(LETTER_H2);
      if (m) cur = l;
      else if (cur && /^### /.test(l))
        entriesPerSection.set(cur, (entriesPerSection.get(cur) ?? 0) + 1);
    }
  }
  const out = [];
  let zone = "front";
  let render = "no";
  let section = "";
  for (const line of lines) {
    const h = line.match(SECTION_HEADER);
    if (h) {
      section = h[1].trim();
      if (zone === "front" && !TITLE_H2.test(section)) zone = "apparatus";
      if (zone === "apparatus") {
        if (SOURCES_H2.test(section)) render = "after-4a";
        else if (
          companion &&
          LETTER_H2.test(line) &&
          !entriesPerSection.get(line)
        )
          render = "no";
        else if (companion && !LETTER_H2.test(line))
          render = "no"; // non-lettered H2 in a companion: not parsed
        else render = "now";
      }
    }
    // the companion disclaimer blockquote renders even though it sits in the header block
    const r = zone === "front" && /^>\s*\*\*/.test(line) ? "now" : render;
    out.push({ zone, render: r, verse: null, section, heading: Boolean(h) });
  }
  return out;
}

/**
 * Continuous-reading prose split per verse by superscript verse numbers.
 * Returns Map<verse, string>. Markers spanning verse boundaries are kept as-is
 * (callers that compare marker coverage track open/close state themselves).
 */
export function continuousByVerse(lines, zones) {
  const text = lines.filter((_, i) => zones[i].zone === "cr").join("\n");
  const map = new Map();
  let last = null;
  let lastIdx = 0;
  for (const m of text.matchAll(SUP_RUN)) {
    if (last !== null)
      map.set(last, (map.get(last) ?? "") + text.slice(lastIdx, m.index));
    last = supToInt(m[0]);
    lastIdx = m.index + m[0].length;
  }
  if (last !== null) map.set(last, (map.get(last) ?? "") + text.slice(lastIdx));
  return map;
}

/** Verse-by-verse translation paragraphs. Returns Map<verse, string>. */
export function studyByVerse(lines, zones) {
  const map = new Map();
  lines.forEach((l, i) => {
    const z = zones[i];
    if (z.zone === "main" && z.verse !== null)
      map.set(z.verse, `${map.get(z.verse) ?? ""}${l}\n`);
  });
  return map;
}
