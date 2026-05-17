import type {
  BookContextData,
  BookContextMotif,
  ClaimType,
  ConfidenceLevel,
} from "@/domain/content/types";

const H1_HEADER = /^# (.+)$/;
const MOTIF_HEADER = /^## (.+)$/;
const CLAIM_LINE = /^\*\*\[(.+?)\s*—\s*(.+?)\]\*\*\s*$/;
const FIELD_LINE = /^\*\*(.+?):\*\*\s*(.*)$/;
const DISCLAIMER_LINE = /^>\s*\*\*About this surface:\*\*/i;

// Locale-aware field aliases for "Chapters" (per plan §8 conventions)
const CHAPTERS_LABELS = ["chapters", "capítulos", "capitulos", "kapitel"];
const SOURCE_LABELS = ["source", "fonte", "quelle", "fuente"];

function parseClaimType(raw: string): ClaimType {
  const n = raw.trim().toUpperCase();
  if (n.includes("TEXTUAL") || n.includes("TEXTUELL")) return "TEXTUAL";
  if (
    n.includes("STRONG INFERENCE") ||
    n.includes("INFERÊNCIA FORTE") ||
    n.includes("INFERENCIA FUERTE") ||
    n.includes("STARKE SCHLUSSFOLGERUNG")
  )
    return "STRONG INFERENCE";
  if (
    n.includes("POSSIBLE INFERENCE") ||
    n.includes("INFERÊNCIA POSSÍVEL") ||
    n.includes("INFERENCIA POSIBLE") ||
    n.includes("MÖGLICHE SCHLUSSFOLGERUNG")
  )
    return "POSSIBLE INFERENCE";
  if (
    n.includes("COMPARATIVE") ||
    n.includes("COMPARATIVO") ||
    n.includes("VERGLEICHENDE")
  )
    return "COMPARATIVE PARALLEL";
  if (
    n.includes("LATER RECEPTION") ||
    n.includes("RECEPÇÃO POSTERIOR") ||
    n.includes("RECEPCIÓN POSTERIOR") ||
    n.includes("SPÄTERE REZEPTION")
  )
    return "LATER RECEPTION";
  if (
    n.includes("HISTORICAL") ||
    n.includes("HISTÓRICO") ||
    n.includes("HISTORICO") ||
    n.includes("HISTORISCH")
  )
    return "HISTORICAL / ARCHAEOLOGICAL";
  if (
    n.includes("SCIENTIFIC") ||
    n.includes("CIENTÍFICA") ||
    n.includes("CIENTIFICA") ||
    n.includes("WISSENSCHAFTLICH")
  )
    return "SCIENTIFIC COMPARISON";
  if (
    n.includes("SPECULATION") ||
    n.includes("ESPECULAÇÃO") ||
    n.includes("ESPECULACIÓN") ||
    n.includes("SPEKULATION")
  )
    return "SPECULATION";
  console.warn(
    `Unrecognized book-context claim type: "${raw}", falling back to TEXTUAL`,
  );
  return "TEXTUAL";
}

function parseConfidence(raw: string): ConfidenceLevel {
  const n = raw.trim().toUpperCase();
  if (
    n.includes("VERIFIED") ||
    n.includes("VERIFIZIERT") ||
    n.includes("VERIFICADO")
  )
    return "VERIFIED";
  if (
    n.includes("PROBABLE") ||
    n.includes("WAHRSCHEINLICH") ||
    n.includes("PROVÁVEL") ||
    n.includes("PROVAVEL")
  )
    return "PROBABLE";
  if (
    n.includes("POSSIBLE") ||
    n.includes("MÖGLICH") ||
    n.includes("POSSÍVEL") ||
    n.includes("POSSIVEL") ||
    n.includes("POSIBLE")
  )
    return "POSSIBLE";
  if (
    n.includes("UNCERTAIN") ||
    n.includes("UNSICHER") ||
    n.includes("INCERTO") ||
    n.includes("INCIERTO")
  )
    return "UNCERTAIN";
  if (
    n.includes("SPECULATIVE") ||
    n.includes("SPEKULATIV") ||
    n.includes("ESPECULATIVO")
  )
    return "SPECULATIVE";
  if (
    n.includes("DOCUMENTED") ||
    n.includes("DOKUMENTIERT") ||
    n.includes("DOCUMENTADO")
  )
    return "DOCUMENTED";
  console.warn(
    `Unrecognized book-context confidence label: "${raw}", falling back to POSSIBLE`,
  );
  return "POSSIBLE";
}

// Slug derivation per PHASE_9_PLAN.md §5.2.1 (round-2 R2.3 Unicode normalization).
export function deriveSlug(title: string): string {
  let s = title;
  // Step 2: strip leading "N. " index prefix
  s = s.replace(/^\d+\.\s*/, "");
  // Step 3: strip markdown emphasis markers
  s = s.replace(/(\*\*|__|\*|_)/g, "");
  // Step 4: strip parenthesized content
  s = s.replace(/\s*\([^)]*\)\s*/g, " ");
  // Step 5: Unicode-normalize to ASCII (NFD + strip combining diacritics)
  s = s.normalize("NFD").replace(/[̀-ͯ]/g, "");
  // Step 6: lowercase
  s = s.toLowerCase();
  // Step 7: replace non-alphanumeric runs with single hyphen
  s = s.replace(/[^a-z0-9]+/g, "-");
  // Step 8: trim leading/trailing hyphens
  s = s.replace(/^-+|-+$/g, "");
  return s;
}

function ensureUniqueSlug(slug: string, seen: Set<string>): string {
  if (!seen.has(slug)) {
    seen.add(slug);
    return slug;
  }
  let i = 2;
  while (seen.has(`${slug}-${i}`)) i++;
  const unique = `${slug}-${i}`;
  seen.add(unique);
  return unique;
}

function parseChapters(raw: string): number[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .map((s) => Number.parseInt(s, 10))
    .filter((n) => Number.isFinite(n));
}

interface MotifDraft {
  title: string;
  slug: string;
  claimType?: ClaimType;
  confidence?: ConfidenceLevel;
  chapters: number[];
  bodyLines: string[];
  source?: string;
}

function finalizeMotif(draft: MotifDraft): BookContextMotif {
  return {
    slug: draft.slug,
    title: draft.title,
    claimType: draft.claimType ?? "TEXTUAL",
    confidence: draft.confidence ?? "POSSIBLE",
    chapters: draft.chapters,
    body: draft.bodyLines.join("\n").trim(),
    source: draft.source,
  };
}

export function parseBookContextMarkdown(
  raw: string,
  book: string,
  locale: string,
): BookContextData {
  const lines = raw.split("\n");
  const motifs: BookContextMotif[] = [];
  const seenSlugs = new Set<string>();
  let disclaimer = "";
  let current: MotifDraft | null = null;
  let inDisclaimerBlock = false;

  for (const line of lines) {
    // Skip page-level H1 entirely.
    if (H1_HEADER.test(line)) {
      continue;
    }

    // Detect disclaimer quote-block opener.
    if (DISCLAIMER_LINE.test(line)) {
      inDisclaimerBlock = true;
      disclaimer = line.replace(/^>\s*/, "").trim();
      continue;
    }

    // Continue / end disclaimer block.
    if (inDisclaimerBlock) {
      if (line.startsWith(">")) {
        const cont = line.replace(/^>\s*/, "").trim();
        if (cont) disclaimer = disclaimer ? `${disclaimer} ${cont}` : cont;
        continue;
      }
      // Blank line or new content ends disclaimer block.
      inDisclaimerBlock = false;
    }

    // Motif header: starts a new motif.
    const motifMatch = MOTIF_HEADER.exec(line);
    if (motifMatch) {
      if (current) {
        motifs.push(finalizeMotif(current));
      }
      const rawTitle = motifMatch[1].trim();
      // Strip leading "N. " from displayed title too (purely visual; slug
      // already strips it via deriveSlug).
      const title = rawTitle.replace(/^\d+\.\s*/, "");
      const baseSlug = deriveSlug(rawTitle);
      const uniqueSlug = ensureUniqueSlug(baseSlug, seenSlugs);
      current = {
        title,
        slug: uniqueSlug,
        chapters: [],
        bodyLines: [],
      };
      continue;
    }

    if (!current) continue;

    // Claim/confidence label line.
    const claimMatch = CLAIM_LINE.exec(line);
    if (claimMatch && !current.claimType) {
      current.claimType = parseClaimType(claimMatch[1]);
      current.confidence = parseConfidence(claimMatch[2]);
      continue;
    }

    // Field line — chapters or source.
    const fieldMatch = FIELD_LINE.exec(line);
    if (fieldMatch) {
      const label = fieldMatch[1].trim().toLowerCase();
      const value = fieldMatch[2].trim();
      if (CHAPTERS_LABELS.includes(label)) {
        current.chapters = parseChapters(value);
        continue;
      }
      if (SOURCE_LABELS.includes(label)) {
        current.source = value;
        continue;
      }
    }

    // Section separator — skip horizontal rules.
    if (/^---+$/.test(line)) continue;

    // Otherwise: append to body.
    current.bodyLines.push(line);
  }

  if (current) {
    motifs.push(finalizeMotif(current));
  }

  return {
    book,
    locale,
    disclaimer,
    motifs,
  };
}
