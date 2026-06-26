import { parseClaimType, parseConfidence } from "@/domain/content/labels";
import type {
  CuriosityEntry,
  GenealogyTable,
  PeopleData,
  PersonEntry,
} from "@/domain/content/types";
import {
  type FieldId,
  normalizeLabel,
  parseGenerationsFrom,
  parseHistoricityStatus,
  parseInt10,
  parseOriginType,
  parseRegionsByText,
  resolveField,
} from "./people-fields";

const ENTRY_HEADER = /^## (.+)$/;
const FIELD_LINE = /^\*\*(.+?):\*\*\s*(.*)$/;
const SUBSECTION_HEADER = /^### (.+)$/;
const CURIOSITY_HEADER = /^#### (.+)$/;

// An H2 heading that introduces a genealogy summary table (all 4 locales) — not
// a person. Matches "Genealogy/Genealogia/Genealogie/Genealogía …" and the
// localized "… Summary Table" qualifiers.
const GENEALOGY_HEADING =
  /genealog|stammbaum|summary table|tabela resumida|übersichtstabelle|tabla resumen/i;

// An H2 heading that introduces the "Sources Consulted" section (all 4 locales).
// Authored as "## H. Sources Consulted" / "## H. Fontes Consultadas" / etc.
const SOURCES_HEADING =
  /^h\.\s|sources consulted|fontes consultadas|konsultierte quellen|fuentes consultadas|^(?:sources|fontes|quellen|fuentes)\b/i;

// Trailing "— Summary Table" qualifier to strip from a genealogy title so it
// matches the clean prototype title. The leading char class eats whatever
// separator precedes the phrase — an em/en dash, hyphen, or its mojibake
// (the EN file has "â\x80\x94", a mis-decoded em-dash) — but never "(" or ")".
const GENEALOGY_TITLE_SUFFIX =
  /\s*[^A-Za-z0-9()]*\s*(?:summary table|tabela resumida|übersichtstabelle|tabla resumen)\s*$/i;

// "Note" field label across locales — lifted to its own `note` slot, not a field.
const NOTE_LABELS = new Set(["note", "nota", "anmerkung", "hinweis", "notiz"]);

// A markdown table separator row, e.g. "|---|---|" or "| :-- | --: |".
const isTableSeparator = (cells: string[]): boolean =>
  cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c.trim()));

// Split a markdown table row "| a | b |" into trimmed cells.
function parseTableRow(line: string): string[] {
  const trimmed = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return trimmed.split("|").map((c) => c.trim());
}

// H2 names matching any of these patterns are NOT person entries.
const SKIP_NAME_PATTERNS: RegExp[] = [
  /^H\./,
  /Summary Table/i,
  /Genealogy \(Gen/i,
  /^Sources/i,
  /^Quellen/i,
  /^Fuentes/i,
  /Tabela/i,
  /Genealogia/i,
  /Stammbaum/i,
  /Transparent Translation/i, // Phase 1A — even if the H2 has not been stripped yet
  /Tradução Transparente/i,
  /Transparente Übersetzung/i,
  /Traducción Transparente/i,
];

function isSkipName(name: string): boolean {
  return SKIP_NAME_PATTERNS.some((re) => re.test(name));
}

// Curiosity heading match across locales (via flexible text match)
function isCuriosityHeading(headingText: string): boolean {
  const n = headingText.trim().toLowerCase();
  return (
    n === "curiosities" ||
    n === "curiosidades" ||
    n === "kuriositäten" ||
    n === "kuriositaeten"
  );
}

// Strip surrounding asterisks from a value (e.g. **TEXTUAL** → TEXTUAL)
function stripBold(s: string): string {
  return s.replace(/^\*+|\*+$/g, "").trim();
}

interface ParseState {
  current: Partial<PersonEntry> | null;
  inCuriosities: boolean;
  curiosity: Partial<CuriosityEntry> | null;
  // Genealogy-table accumulation (between a genealogy H2 and the next H2).
  gen: {
    title: string;
    caption?: string;
    headers: string[];
    rows: string[][];
    note?: string;
  } | null;
  // Sources-section accumulation (raw markdown lines after the sources H2).
  sourcesLines: string[] | null;
}

function flushGenealogy(
  state: ParseState,
  genealogies: GenealogyTable[],
): void {
  const g = state.gen;
  state.gen = null;
  if (!g || g.headers.length === 0) return;
  genealogies.push({
    title: g.title,
    caption: g.caption,
    headers: g.headers,
    rows: g.rows,
    note: g.note,
  });
}

function applyField(
  current: Partial<PersonEntry>,
  field: FieldId,
  value: string,
): void {
  switch (field) {
    case "nameMeaning":
      current.nameMeaning = value;
      break;
    case "originType":
      current.originType = parseOriginType(value);
      break;
    case "birthYear":
      current.birthYear = value;
      break;
    case "deathYear":
      current.deathYear = value;
      break;
    case "lifespan":
      current.lifespan = value;
      break;
    case "ageAtFatherhood":
      current.ageAtFatherhood = value;
      break;
    case "father":
      current.father = value;
      break;
    case "mother":
      current.mother = value;
      break;
    case "spouses":
      current.spouses = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "children":
      current.children = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "siblings":
      current.siblings = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "inLaws":
      current.inLaws = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "locations":
      current.locations = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "firstMention":
      current.firstMention = value;
      break;
    case "mentionedIn":
      current.mentionedIn = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "keyEvents":
      current.keyEvents = value
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "familiarName":
      current.familiarName = value;
      break;
    case "profession":
      current.profession = value;
      break;
    case "socialClass":
      current.socialClass = value;
      break;
    case "hometown":
      current.hometown = value;
      break;
    case "placesLived":
      current.placesLived = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "causeOfDeath":
      current.causeOfDeath = value;
      break;
    case "languagesSpoken":
      current.languagesSpoken = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "archaeologicalEvidence":
      current.archaeologicalEvidence = value;
      break;
    case "extraBiblicalMentions":
      current.extraBiblicalMentions = value;
      break;
    case "historicityStatus":
      current.historicityStatus = parseHistoricityStatus(value);
      break;
    case "booksAppearingIn":
      current.booksAppearingIn = value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "keySpeeches":
      current.keySpeeches = value
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);
      break;
    case "characterArc":
      current.characterArc = value;
      break;
    case "yearFromCreation":
      current.yearFromCreation = parseInt10(value);
      current.timelineAnchor = "creation";
      break;
    case "yearFromCreationEnd":
      current.yearFromCreationEnd = parseInt10(value);
      break;
    case "historicalYear":
      current.historicalYear = parseInt10(value);
      current.timelineAnchor = "historical";
      break;
    case "historicalYearEnd":
      current.historicalYearEnd = parseInt10(value);
      break;
    case "generationsFrom":
      current.generationsFrom = parseGenerationsFrom(value);
      break;
    case "regionsByText":
      current.regionsByText = parseRegionsByText(value);
      break;
    case "crossBookSee": {
      current.crossBookSee = value;
      const seeMatch = value
        .trim()
        .match(/^([a-z0-9][a-z0-9-]*)\/PEOPLE\.md$/i);
      current.crossBookSeeBook = seeMatch
        ? seeMatch[1].toLowerCase()
        : undefined;
      break;
    }
    case "inBook":
      current.inBook = value;
      break;
  }
}

function flushCuriosity(state: ParseState): void {
  if (!state.curiosity || !state.current) return;
  const c = state.curiosity;
  if (!c.title || !c.claimType || !c.confidence || !c.content) {
    state.curiosity = null;
    return;
  }
  if (!state.current.curiosities) state.current.curiosities = [];
  state.current.curiosities.push({
    title: c.title,
    claimType: c.claimType,
    confidence: c.confidence,
    content: c.content,
    source: c.source,
  });
  state.curiosity = null;
}

function flushEntry(state: ParseState, entries: PersonEntry[]): void {
  flushCuriosity(state);
  if (state.current?.name) {
    const entry = finalizeEntry(state.current);
    if (entries.some((existing) => existing.slug === entry.slug)) {
      console.warn(
        `[people-parser] Duplicate slug "${entry.slug}" — entries "${entry.name}" and an earlier homonym will collide on slug-derived React keys and cross-references. Disambiguate by using a different transliteration form in the heading (e.g., source-language form for one + familiar form in parentheses).`,
      );
    }
    entries.push(entry);
  }
  state.current = null;
  state.inCuriosities = false;
}

export function parsePeopleMarkdown(raw: string, book: string): PeopleData {
  const lines = raw.split("\n");
  const entries: PersonEntry[] = [];
  const genealogies: GenealogyTable[] = [];
  const seenSlugs = new Set<string>();
  const state: ParseState = {
    current: null,
    inCuriosities: false,
    curiosity: null,
    gen: null,
    sourcesLines: null,
  };

  for (const line of lines) {
    // Entry boundary (H2) — also routes genealogy-table and sources sections.
    const entryMatch = line.match(ENTRY_HEADER);
    if (entryMatch) {
      const heading = entryMatch[1].trim();
      // Close whatever section was open before opening the next.
      flushEntry(state, entries);
      flushGenealogy(state, genealogies);
      state.sourcesLines = null;

      if (SOURCES_HEADING.test(heading)) {
        state.sourcesLines = [];
        continue;
      }
      if (GENEALOGY_HEADING.test(heading)) {
        state.gen = {
          title: heading.replace(GENEALOGY_TITLE_SUFFIX, "").trim(),
          headers: [],
          rows: [],
        };
        continue;
      }
      if (isSkipName(heading)) continue;

      // Parse "Name (Familiar) — Suffix" → name + familiarName + suffix.
      // Explicit `**Familiar name:**` field, if present below, overrides via line order.
      const suffixMatch = heading.match(/^(.+?)\s+[—–]\s+(.+)$/);
      const core = suffixMatch ? suffixMatch[1].trim() : heading;
      const suffix = suffixMatch ? suffixMatch[2].trim() : undefined;
      const parenMatch = core.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
      const name = parenMatch ? parenMatch[1].trim() : core;
      const familiarName = parenMatch ? parenMatch[2].trim() : undefined;
      // Disambiguate homonyms (e.g. two "Lemekh") via the suffix so slugs stay
      // unique. A true collision with no suffix to disambiguate is left to the
      // flushEntry duplicate-slug warning (authors fix it via the heading) —
      // do not silently auto-slug, which would mask the authoring issue.
      const baseSlug = name.toLowerCase().replace(/\s+/g, "-");
      let slug = baseSlug;
      if (suffix && seenSlugs.has(slug)) {
        slug = `${baseSlug}-${suffix
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")}`;
      }
      seenSlugs.add(slug);
      state.current = {
        name,
        familiarName,
        suffix,
        slug,
        originType: "UNCERTAIN",
        mentionedIn: [],
        rawFields: [],
      };
      continue;
    }

    // Accumulate the sources section verbatim until the next H2 / EOF.
    if (state.sourcesLines) {
      state.sourcesLines.push(line);
      continue;
    }

    // Accumulate a genealogy summary table.
    if (state.gen) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const noteMatch = line.match(FIELD_LINE);
      if (noteMatch && NOTE_LABELS.has(normalizeLabel(noteMatch[1]))) {
        state.gen.note = noteMatch[2].trim();
        continue;
      }
      if (trimmed.startsWith("|")) {
        const cells = parseTableRow(line);
        if (isTableSeparator(cells)) continue;
        if (state.gen.headers.length === 0) state.gen.headers = cells;
        else state.gen.rows.push(cells);
        continue;
      }
      // First plain-text line before the table is the caption ("All dates AM …").
      if (state.gen.headers.length === 0 && !state.gen.caption) {
        state.gen.caption = trimmed;
      }
      continue;
    }

    if (!state.current) continue;

    // H3 — subsection within an entry
    const subMatch = line.match(SUBSECTION_HEADER);
    if (subMatch) {
      flushCuriosity(state);
      state.inCuriosities = isCuriosityHeading(subMatch[1]);
      continue;
    }

    // H4 — only meaningful inside a Curiosities subsection
    const curMatch = line.match(CURIOSITY_HEADER);
    if (curMatch) {
      if (state.inCuriosities) {
        flushCuriosity(state);
        state.curiosity = { title: curMatch[1].trim() };
      }
      continue;
    }

    // Field line
    const fieldMatch = line.match(FIELD_LINE);
    if (!fieldMatch) continue;
    const labelRaw = fieldMatch[1];
    const value = fieldMatch[2].trim();

    // Inside a curiosity, fields populate the curiosity, not the entry
    if (state.inCuriosities && state.curiosity) {
      const norm = normalizeLabel(labelRaw);
      if (
        norm === "claim type" ||
        norm === "tipo de afirmação" ||
        norm === "anspruchstyp" ||
        norm === "tipo de afirmación"
      ) {
        state.curiosity.claimType = parseClaimType(stripBold(value));
      } else if (
        norm === "confidence" ||
        norm === "confiança" ||
        norm === "konfidenz" ||
        norm === "confianza"
      ) {
        state.curiosity.confidence = parseConfidence(stripBold(value));
      } else if (
        norm === "content" ||
        norm === "conteúdo" ||
        norm === "inhalt" ||
        norm === "contenido"
      ) {
        state.curiosity.content = value;
      } else if (
        norm === "source" ||
        norm === "fonte" ||
        norm === "quelle" ||
        norm === "fuente"
      ) {
        state.curiosity.source = value;
      }
      continue;
    }

    // The "Note" field is lifted to its own slot (rendered as a wide field),
    // matching the prototype — not part of the generic field list.
    if (NOTE_LABELS.has(normalizeLabel(labelRaw))) {
      state.current.note = value;
      continue;
    }

    // Otherwise, dispatch to the typed field (drives timeline/sort) …
    const fieldId = resolveField(labelRaw);
    if (fieldId) {
      applyField(state.current, fieldId, value);
    }
    // … and preserve it verbatim for the generic card render. The cross-book
    // "See:" pointer renders as a link from its typed slot, so keep it out of
    // the generic list to avoid a duplicate raw row.
    if (fieldId !== "crossBookSee") {
      if (!state.current.rawFields) state.current.rawFields = [];
      state.current.rawFields.push({ label: labelRaw.trim(), value });
    }
  }

  // Flush trailing entry/curiosity/genealogy/sources.
  flushEntry(state, entries);
  flushGenealogy(state, genealogies);

  // Emit the Sources section pre-cleaned (blockquote markers stripped, bullets
  // normalized to "• ") so consumers render it directly — no UI/route munging.
  const sourcesRaw = state.sourcesLines?.join("\n").trim();
  const sources = sourcesRaw
    ? sourcesRaw.replace(/^>\s?/gm, "").replace(/^[-*]\s+/gm, "• ")
    : undefined;

  return {
    book,
    entries,
    genealogies: genealogies.length > 0 ? genealogies : undefined,
    sources,
  };
}

function finalizeEntry(raw: Partial<PersonEntry>): PersonEntry {
  return {
    slug: raw.slug || raw.name?.toLowerCase().replace(/\s+/g, "-") || "",
    name: raw.name || "",
    familiarName: raw.familiarName,
    suffix: raw.suffix,
    rawFields: raw.rawFields,
    note: raw.note,
    nameMeaning: raw.nameMeaning,
    originType: raw.originType || "UNCERTAIN",
    birthYear: raw.birthYear,
    deathYear: raw.deathYear,
    lifespan: raw.lifespan,
    father: raw.father,
    mother: raw.mother,
    spouses: raw.spouses,
    children: raw.children,
    siblings: raw.siblings,
    locations: raw.locations,
    firstMention: raw.firstMention || "",
    mentionedIn: raw.mentionedIn || [],
    keyEvents: raw.keyEvents,
    profession: raw.profession,
    socialClass: raw.socialClass,
    hometown: raw.hometown,
    placesLived: raw.placesLived,
    ageAtFatherhood: raw.ageAtFatherhood,
    causeOfDeath: raw.causeOfDeath,
    languagesSpoken: raw.languagesSpoken,
    inLaws: raw.inLaws,
    archaeologicalEvidence: raw.archaeologicalEvidence,
    extraBiblicalMentions: raw.extraBiblicalMentions,
    historicityStatus: raw.historicityStatus,
    booksAppearingIn: raw.booksAppearingIn,
    keySpeeches: raw.keySpeeches,
    verseCount: raw.verseCount,
    characterArc: raw.characterArc,
    timelineAnchor: raw.timelineAnchor,
    yearFromCreation: raw.yearFromCreation,
    yearFromCreationEnd: raw.yearFromCreationEnd,
    historicalYear: raw.historicalYear,
    historicalYearEnd: raw.historicalYearEnd,
    curiosities: raw.curiosities,
    generationsFrom: raw.generationsFrom,
    regionsByText: raw.regionsByText,
    crossBookSee: raw.crossBookSee,
    crossBookSeeBook: raw.crossBookSeeBook,
    inBook: raw.inBook,
  };
}
