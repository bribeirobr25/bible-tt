import type {
  ClaimType,
  ConfidenceLevel,
  EnrichmentData,
  EnrichmentEntry,
  EnrichmentSection,
} from "@/domain/content/types";

const SECTION_HEADER = /^## ([A-H])\.\s+(.+)$/;
const ENTRY_HEADER = /^### (.+)$/;
const LABEL_LINE = /^\*\*\[(.+?)\s*(?:—|--)\s*(.+?)\]\*\*$/;
const SOURCE_LINE = /^\*\*(?:Source|Quelle|Fonte):\*\*\s*(.+)$/;

const SECTION_IDS: Record<string, string> = {
  A: "hebrew-text-features",
  B: "ane-parallels",
  C: "historical-archaeological",
  D: "linguistic-philological",
  E: "scientific",
  F: "later-reception",
  G: "curiosities",
  H: "sources",
};

function parseClaimType(raw: string): ClaimType {
  const normalized = raw.trim().toUpperCase();
  if (normalized.includes("TEXTUAL")) return "TEXTUAL";
  if (normalized.includes("STRONG INFERENCE")) return "STRONG INFERENCE";
  if (normalized.includes("POSSIBLE INFERENCE")) return "POSSIBLE INFERENCE";
  if (normalized.includes("COMPARATIVE")) return "COMPARATIVE PARALLEL";
  if (normalized.includes("LATER RECEPTION") || normalized.includes("DOCUMENTED")) return "LATER RECEPTION";
  if (normalized.includes("HISTORICAL") || normalized.includes("ARCHAEOLOGICAL")) return "HISTORICAL / ARCHAEOLOGICAL";
  if (normalized.includes("SCIENTIFIC")) return "SCIENTIFIC COMPARISON";
  if (normalized.includes("SPECULATION") || normalized.includes("SPECULATIVE")) return "SPECULATION";
  return "TEXTUAL";
}

function parseConfidence(raw: string): ConfidenceLevel {
  const normalized = raw.trim().toUpperCase();
  if (normalized.includes("VERIFIED") || normalized.includes("VERIFIZIERT") || normalized.includes("VERIFICADO")) return "VERIFIED";
  if (normalized.includes("PROBABLE") || normalized.includes("WAHRSCHEINLICH") || normalized.includes("PROVÁVEL") || normalized.includes("PROVAVEL")) return "PROBABLE";
  if (normalized.includes("POSSIBLE") || normalized.includes("MOEGLICH") || normalized.includes("MÖGLICH") || normalized.includes("POSSÍVEL") || normalized.includes("POSSIVEL")) return "POSSIBLE";
  if (normalized.includes("UNCERTAIN") || normalized.includes("UNGEWISS") || normalized.includes("INCERTO")) return "UNCERTAIN";
  if (normalized.includes("SPECULATIVE") || normalized.includes("SPEKULATIV") || normalized.includes("ESPECULATIVO")) return "SPECULATIVE";
  if (normalized.includes("EXPLICIT") || normalized.includes("EXPLIZIT") || normalized.includes("EXPLÍCITO") || normalized.includes("EXPLICITO")) return "VERIFIED";
  if (normalized.includes("DOCUMENTED") || normalized.includes("DOKUMENTIERT") || normalized.includes("DOCUMENTADO")) return "VERIFIED";
  return "POSSIBLE";
}

export function parseEnrichmentMarkdown(
  raw: string,
  book: string,
  chapter: number,
): EnrichmentData {
  const lines = raw.split("\n");

  let disclaimer = "";
  const disclaimerMatch = raw.match(/^>\s*\*\*(.+?)\*\*$/m);
  if (disclaimerMatch) {
    const start = raw.indexOf("> **");
    const end = raw.indexOf("\n\n", start);
    disclaimer = raw.slice(start, end > start ? end : start + 200).replace(/^>\s*/gm, "").trim();
  }

  const sections: EnrichmentSection[] = [];
  let currentSection: { letter: string; title: string; entries: EnrichmentEntry[] } | null = null;
  let currentEntry: { title: string; claimType: ClaimType; confidence: ConfidenceLevel; contentLines: string[]; source?: string } | null = null;

  for (const line of lines) {
    const sectionMatch = line.match(SECTION_HEADER);
    if (sectionMatch) {
      if (currentEntry && currentSection) {
        currentSection.entries.push(finalizeEntry(currentEntry));
        currentEntry = null;
      }
      if (currentSection) {
        sections.push(finalizeSection(currentSection));
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
    sections.push(finalizeSection(currentSection));
  }

  return { book, chapter, disclaimer, sections };
}

function finalizeEntry(raw: {
  title: string;
  claimType: ClaimType;
  confidence: ConfidenceLevel;
  contentLines: string[];
  source?: string;
}): EnrichmentEntry {
  return {
    title: raw.title,
    claimType: raw.claimType,
    confidence: raw.confidence,
    content: raw.contentLines.join("\n").trim(),
    source: raw.source,
  };
}

function finalizeSection(raw: {
  letter: string;
  title: string;
  entries: EnrichmentEntry[];
}): EnrichmentSection {
  return {
    id: SECTION_IDS[raw.letter] || raw.letter.toLowerCase(),
    title: raw.title,
    entries: raw.entries,
  };
}
