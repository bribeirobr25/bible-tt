import type {
  BookCardField,
  ClaimType,
  ConfidenceLevel,
  EnrichmentData,
  EnrichmentEntry,
  EnrichmentSection,
  IntroductionData,
} from "@/domain/content/types";

const SECTION_HEADER = /^## ([A-Z])(?:_\w+)?\.\s+(.+)$/;
const ENTRY_HEADER = /^### (.+)$/;
const SUBENTRY_HEADER = /^#### (.+)$/;
const LABEL_LINE = /^\*\*\[(.+?)\s*(?:—|--)\s*(.+?)\]\*\*$/;
const SOURCE_LINE = /^\*\*(?:Source|Quelle|Fonte|Fuente):\*\*\s*(.+)$/;

const SECTION_IDS: Record<string, string> = {
  A: "source-text-features",
  B: "ane-parallels",
  C: "historical-archaeological",
  D: "linguistic-philological",
  E: "scientific",
  F: "later-reception",
  G: "curiosities",
  H: "sources",
  I: "world-at-the-time",
};

const INTRODUCTION_SECTION_IDS: Record<string, string> = {
  A: "overview",
  B: "authorship",
  C: "dating",
  D: "historical-setting",
  E: "manuscript-transmission",
  F: "reading-in-tt",
  G: "sources",
};

function parseClaimType(raw: string): ClaimType {
  const normalized = raw.trim().toUpperCase();
  if (normalized.includes("TEXTUAL") || normalized.includes("TEXTUELL"))
    return "TEXTUAL";
  if (
    normalized.includes("STRONG INFERENCE") ||
    normalized.includes("INFERÊNCIA FORTE") ||
    normalized.includes("INFERENCIA FUERTE") ||
    normalized.includes("STARKE SCHLUSSFOLGERUNG")
  )
    return "STRONG INFERENCE";
  if (
    normalized.includes("POSSIBLE INFERENCE") ||
    normalized.includes("INFERÊNCIA POSSÍVEL") ||
    normalized.includes("INFERENCIA POSIBLE") ||
    normalized.includes("MÖGLICHE SCHLUSSFOLGERUNG") ||
    normalized.includes("MOGLICHE SCHLUSSFOLGERUNG")
  )
    return "POSSIBLE INFERENCE";
  if (
    normalized.includes("COMPARATIVE") ||
    normalized.includes("COMPARATIVO") ||
    normalized.includes("VERGLEICHENDE") ||
    normalized.includes("KOMPARATIV")
  )
    return "COMPARATIVE PARALLEL";
  if (
    normalized.includes("LATER RECEPTION") ||
    normalized.includes("RECEPÇÃO POSTERIOR") ||
    normalized.includes("RECEPCIÓN POSTERIOR") ||
    normalized.includes("RECEPCION POSTERIOR") ||
    normalized.includes("SPÄTERE REZEPTION") ||
    normalized.includes("SPATERE REZEPTION")
  )
    return "LATER RECEPTION";
  if (
    normalized.includes("HISTORICAL") ||
    normalized.includes("ARCHAEOLOGICAL") ||
    normalized.includes("HISTÓRICO") ||
    normalized.includes("HISTORICO") ||
    normalized.includes("ARQUEOLÓGICO") ||
    normalized.includes("ARQUEOLOGICO") ||
    normalized.includes("HISTORISCH") ||
    normalized.includes("ARCHÄOLOGISCH") ||
    normalized.includes("ARCHAOLOGISCH")
  )
    return "HISTORICAL / ARCHAEOLOGICAL";
  if (
    normalized.includes("SCIENTIFIC") ||
    normalized.includes("CIENTÍFICA") ||
    normalized.includes("CIENTIFICA") ||
    normalized.includes("CIENTÍFICO") ||
    normalized.includes("CIENTIFICO") ||
    normalized.includes("WISSENSCHAFTLICH")
  )
    return "SCIENTIFIC COMPARISON";
  if (
    normalized.includes("SPECULATION") ||
    normalized.includes("SPECULATIVE") ||
    normalized.includes("ESPECULAÇÃO") ||
    normalized.includes("ESPECULACIÓN") ||
    normalized.includes("SPEKULATION")
  )
    return "SPECULATION";
  console.warn(
    `Unrecognized claim type label: "${raw}", falling back to TEXTUAL`,
  );
  return "TEXTUAL";
}

function parseConfidence(raw: string): ConfidenceLevel {
  const normalized = raw.trim().toUpperCase();
  if (
    normalized.includes("VERIFIED") ||
    normalized.includes("VERIFIZIERT") ||
    normalized.includes("VERIFICADO")
  )
    return "VERIFIED";
  if (
    normalized.includes("PROBABLE") ||
    normalized.includes("WAHRSCHEINLICH") ||
    normalized.includes("PROVÁVEL") ||
    normalized.includes("PROVAVEL")
  )
    return "PROBABLE";
  if (
    normalized.includes("POSSIBLE") ||
    normalized.includes("MOEGLICH") ||
    normalized.includes("MÖGLICH") ||
    normalized.includes("MOGLICH") ||
    normalized.includes("POSSÍVEL") ||
    normalized.includes("POSSIVEL") ||
    normalized.includes("POSIBLE")
  )
    return "POSSIBLE";
  if (
    normalized.includes("UNCERTAIN") ||
    normalized.includes("UNGEWISS") ||
    normalized.includes("UNSICHER") ||
    normalized.includes("INCERTO") ||
    normalized.includes("INCIERTO")
  )
    return "UNCERTAIN";
  if (
    normalized.includes("SPECULATIVE") ||
    normalized.includes("SPEKULATIV") ||
    normalized.includes("ESPECULATIVO")
  )
    return "SPECULATIVE";
  if (
    normalized.includes("DOCUMENTED") ||
    normalized.includes("DOKUMENTIERT") ||
    normalized.includes("DOCUMENTADO")
  )
    return "DOCUMENTED";
  console.warn(
    `Unrecognized confidence label: "${raw}", falling back to POSSIBLE`,
  );
  return "POSSIBLE";
}

function parseMarkdownSections(
  raw: string,
  sectionIds: Record<string, string>,
): { disclaimer: string; sections: EnrichmentSection[] } {
  const lines = raw.split("\n");

  let disclaimer = "";
  const disclaimerMatch = raw.match(/^>\s*\*\*(.+?)\*\*$/m);
  if (disclaimerMatch) {
    const start = raw.indexOf("> **");
    const end = raw.indexOf("\n\n", start);
    disclaimer = raw
      .slice(start, end > start ? end : start + 200)
      .replace(/^>\s*/gm, "")
      .trim();
  }

  const sections: EnrichmentSection[] = [];
  let currentSection: {
    letter: string;
    title: string;
    entries: EnrichmentEntry[];
  } | null = null;
  let currentEntry: RawEntry | null = null;
  // `#### IA-x` sub-dimension currently being accumulated under currentEntry
  // (the §I "World at the Time" two-level structure). null outside §I.
  let currentSub: RawEntry | null = null;

  // Fold the open sub-entry into its parent group entry.
  const flushSub = () => {
    if (currentEntry && currentSub) {
      currentEntry.subEntries ??= [];
      currentEntry.subEntries.push(finalizeEntry(currentSub));
      currentSub = null;
    }
  };

  for (const line of lines) {
    const sectionMatch = line.match(SECTION_HEADER);
    if (sectionMatch) {
      flushSub();
      if (currentEntry && currentSection) {
        currentSection.entries.push(finalizeEntry(currentEntry));
        currentEntry = null;
      }
      if (currentSection) {
        sections.push(finalizeSection(currentSection, sectionIds));
      }
      currentSection = {
        letter: sectionMatch[1],
        title: sectionMatch[2].trim(),
        entries: [],
      };
      continue;
    }

    const entryMatch = line.match(ENTRY_HEADER);
    if (entryMatch && currentSection) {
      flushSub();
      if (currentEntry) {
        currentSection.entries.push(finalizeEntry(currentEntry));
      }
      currentEntry = {
        title: entryMatch[1].trim(),
        claimType: "TEXTUAL",
        confidence: "POSSIBLE",
        contentLines: [],
      };
      continue;
    }

    const subMatch = line.match(SUBENTRY_HEADER);
    if (subMatch && currentEntry) {
      flushSub();
      currentSub = {
        title: subMatch[1].trim(),
        claimType: "TEXTUAL",
        confidence: "POSSIBLE",
        contentLines: [],
      };
      continue;
    }

    // Route label/source/content to the open sub-entry if there is one,
    // otherwise to the open entry.
    const target = currentSub ?? currentEntry;
    if (target) {
      const labelMatch = line.match(LABEL_LINE);
      if (labelMatch) {
        target.claimType = parseClaimType(labelMatch[1]);
        target.confidence = parseConfidence(labelMatch[2]);
        continue;
      }

      const sourceMatch = line.match(SOURCE_LINE);
      if (sourceMatch) {
        target.source = sourceMatch[1].trim();
        continue;
      }

      if (line.trim() !== "---" && line.trim().length > 0) {
        target.contentLines.push(line);
      }
    }
  }

  flushSub();
  if (currentEntry && currentSection) {
    currentSection.entries.push(finalizeEntry(currentEntry));
  }
  if (currentSection) {
    sections.push(finalizeSection(currentSection, sectionIds));
  }

  return { disclaimer, sections };
}

export function parseEnrichmentMarkdown(
  raw: string,
  book: string,
  chapter: number,
): EnrichmentData {
  const { disclaimer, sections } = parseMarkdownSections(raw, SECTION_IDS);
  return { book, chapter, disclaimer, sections };
}

// Phase 5b — extract the book "tight card" from a language-neutral
// HTML-comment block (`<!-- CARD --> **Label:** value … <!-- /CARD -->`).
// Parsed by position so it never depends on a localized heading.
function parseBookCard(raw: string): BookCardField[] | undefined {
  const block = raw.match(/<!--\s*CARD\s*-->([\s\S]*?)<!--\s*\/CARD\s*-->/);
  if (!block) return undefined;
  const fields: BookCardField[] = [];
  for (const line of block[1].split("\n")) {
    const m = line.match(/^\s*\*\*(.+?):\*\*\s*(.+?)\s*$/);
    if (m) fields.push({ label: m[1].trim(), value: m[2].trim() });
  }
  return fields.length > 0 ? fields : undefined;
}

export function parseIntroductionMarkdown(
  raw: string,
  book: string,
): IntroductionData {
  const { disclaimer, sections } = parseMarkdownSections(
    raw,
    INTRODUCTION_SECTION_IDS,
  );
  return { book, disclaimer, sections, card: parseBookCard(raw) };
}

const INLINE_LABEL = /\*?\*?\[[^\]]+\s*(?:—|--|–)\s*[^\]]+\]\*?\*?/g;

// Some entries author the citation inline at the END of the body paragraph —
// "… prose. **Source:** <cite>. **[PEER-REVIEWED — …]**" — instead of on its own
// line. We lift such a trailing citation into the source field ONLY when the
// entry has a single source marker that runs to the very end on one line
// (`(.+)$`, no newline after). Composite entries with several per-item
// "**Source:**" lines (e.g. Genesis §I scenario blobs) keep them inline — they
// cannot collapse into one source field. TRAILING_LABEL drops the optional
// source-quality bracket tag (never rendered).
const SOURCE_MARKER = /\*\*(?:Source|Quelle|Fonte|Fuente):\*\*/g;
const SOURCE_INLINE =
  /^([\s\S]*?)\*\*(?:Source|Quelle|Fonte|Fuente):\*\*\s*(.+)$/;
const TRAILING_LABEL = /\s*\*\*\[[^\]]*\]\*\*\s*$/;

interface RawEntry {
  title: string;
  claimType: ClaimType;
  confidence: ConfidenceLevel;
  contentLines: string[];
  source?: string;
  subEntries?: EnrichmentEntry[];
}

function finalizeEntry(raw: RawEntry): EnrichmentEntry {
  let body = raw.contentLines.join("\n");
  let source = raw.source;

  // Own-line "**Source:**" is captured at parse time (raw.source). Only when it
  // is absent do we look for an inline trailing citation and lift it out, so the
  // 1000+ well-formed own-line sources are left exactly as before.
  if (!source) {
    const markers = body.match(SOURCE_MARKER);
    if (markers && markers.length === 1) {
      const m = body.match(SOURCE_INLINE);
      if (m) {
        source = m[2].replace(TRAILING_LABEL, "").trim();
        body = m[1];
      }
    }
  }

  const content = body
    .replace(INLINE_LABEL, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return {
    title: raw.title,
    claimType: raw.claimType,
    confidence: raw.confidence,
    content,
    source,
    ...(raw.subEntries && raw.subEntries.length > 0
      ? { subEntries: raw.subEntries }
      : {}),
  };
}

function finalizeSection(
  raw: {
    letter: string;
    title: string;
    entries: EnrichmentEntry[];
  },
  sectionIds: Record<string, string>,
): EnrichmentSection {
  return {
    id: sectionIds[raw.letter] || raw.letter.toLowerCase(),
    title: raw.title,
    entries: raw.entries,
  };
}
