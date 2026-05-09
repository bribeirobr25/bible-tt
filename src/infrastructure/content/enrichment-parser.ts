import type {
  ClaimType,
  ConfidenceLevel,
  EnrichmentData,
  EnrichmentEntry,
  EnrichmentSection,
  IntroductionData,
} from "@/domain/content/types";

const SECTION_HEADER = /^## ([A-Z])(?:_\w+)?\.\s+(.+)$/;
const ENTRY_HEADER = /^### (.+)$/;
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
    normalized.includes("VERGLEICHENDE")
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
  let currentEntry: {
    title: string;
    claimType: ClaimType;
    confidence: ConfidenceLevel;
    contentLines: string[];
    source?: string;
  } | null = null;

  for (const line of lines) {
    const sectionMatch = line.match(SECTION_HEADER);
    if (sectionMatch) {
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

    if (currentEntry) {
      const labelMatch = line.match(LABEL_LINE);
      if (labelMatch) {
        currentEntry.claimType = parseClaimType(labelMatch[1]);
        currentEntry.confidence = parseConfidence(labelMatch[2]);
        continue;
      }

      const sourceMatch = line.match(SOURCE_LINE);
      if (sourceMatch) {
        currentEntry.source = sourceMatch[1].trim();
        continue;
      }

      if (line.trim() !== "---" && line.trim().length > 0) {
        currentEntry.contentLines.push(line);
      }
    }
  }

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

export function parseIntroductionMarkdown(
  raw: string,
  book: string,
): IntroductionData {
  const { disclaimer, sections } = parseMarkdownSections(
    raw,
    INTRODUCTION_SECTION_IDS,
  );
  return { book, disclaimer, sections };
}

const INLINE_LABEL = /\*?\*?\[[^\]]+\s*(?:—|--|–)\s*[^\]]+\]\*?\*?/g;

function finalizeEntry(raw: {
  title: string;
  claimType: ClaimType;
  confidence: ConfidenceLevel;
  contentLines: string[];
  source?: string;
}): EnrichmentEntry {
  const content = raw.contentLines
    .join("\n")
    .replace(INLINE_LABEL, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return {
    title: raw.title,
    claimType: raw.claimType,
    confidence: raw.confidence,
    content,
    source: raw.source,
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
