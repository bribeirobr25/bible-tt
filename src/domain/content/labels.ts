import type { ClaimType, ConfidenceLevel } from "./types";

/**
 * Single source of truth for the dual-label (claim-type + confidence) vocabulary
 * shared by every content parser. Canonical behavior = the former
 * `enrichment-parser` (the richest alias set, a strict superset of the others).
 *
 * The ordered arrays below ALSO define the check order. Order is load-bearing:
 * a few authored confidence labels are *ranges* ("PROBABLE THROUGH UNCERTAIN",
 * "WAHRSCHEINLICH BIS UNSICHER") that contain two bucket keywords; they must
 * resolve to the earlier one (PROBABLE), so PROBABLE must precede UNCERTAIN.
 */

// Ordered claim-type list (also the check order). `satisfies` proves it covers the union.
export const CLAIM_TYPES = [
  "TEXTUAL",
  "STRONG INFERENCE",
  "POSSIBLE INFERENCE",
  "COMPARATIVE PARALLEL",
  "LATER RECEPTION",
  "HISTORICAL / ARCHAEOLOGICAL",
  "SCIENTIFIC COMPARISON",
  "SPECULATION",
] as const satisfies readonly ClaimType[];

// Ordered confidence list (also the check order; PROBABLE before UNCERTAIN — see note above).
export const CONFIDENCE_LEVELS = [
  "VERIFIED",
  "PROBABLE",
  "POSSIBLE",
  "UNCERTAIN",
  "SPECULATIVE",
  "DOCUMENTED",
] as const satisfies readonly ConfidenceLevel[];

// Uppercased substring aliases per member (EN/PT/DE/ES incl. ASCII-deaccented German).
const CLAIM_TYPE_ALIASES: Record<ClaimType, readonly string[]> = {
  TEXTUAL: ["TEXTUAL", "TEXTUELL"],
  "STRONG INFERENCE": [
    "STRONG INFERENCE",
    "INFERÊNCIA FORTE",
    "INFERENCIA FUERTE",
    "STARKE SCHLUSSFOLGERUNG",
  ],
  "POSSIBLE INFERENCE": [
    "POSSIBLE INFERENCE",
    "INFERÊNCIA POSSÍVEL",
    "INFERENCIA POSIBLE",
    "MÖGLICHE SCHLUSSFOLGERUNG",
    "MOGLICHE SCHLUSSFOLGERUNG",
  ],
  "COMPARATIVE PARALLEL": [
    "COMPARATIVE",
    "COMPARATIVO",
    "VERGLEICHENDE",
    "KOMPARATIV",
  ],
  "LATER RECEPTION": [
    "LATER RECEPTION",
    "RECEPÇÃO POSTERIOR",
    "RECEPCIÓN POSTERIOR",
    "RECEPCION POSTERIOR",
    "SPÄTERE REZEPTION",
    "SPATERE REZEPTION",
  ],
  "HISTORICAL / ARCHAEOLOGICAL": [
    "HISTORICAL",
    "ARCHAEOLOGICAL",
    "HISTÓRICO",
    "HISTORICO",
    "ARQUEOLÓGICO",
    "ARQUEOLOGICO",
    "HISTORISCH",
    "ARCHÄOLOGISCH",
    "ARCHAOLOGISCH",
  ],
  "SCIENTIFIC COMPARISON": [
    "SCIENTIFIC",
    "CIENTÍFICA",
    "CIENTIFICA",
    "CIENTÍFICO",
    "CIENTIFICO",
    "WISSENSCHAFTLICH",
  ],
  SPECULATION: [
    "SPECULATION",
    "SPECULATIVE",
    "ESPECULAÇÃO",
    "ESPECULACIÓN",
    "SPEKULATION",
  ],
};

const CONFIDENCE_ALIASES: Record<ConfidenceLevel, readonly string[]> = {
  VERIFIED: ["VERIFIED", "VERIFIZIERT", "VERIFICADO"],
  PROBABLE: ["PROBABLE", "WAHRSCHEINLICH", "PROVÁVEL", "PROVAVEL"],
  POSSIBLE: [
    "POSSIBLE",
    "MOEGLICH",
    "MÖGLICH",
    "MOGLICH",
    "POSSÍVEL",
    "POSSIVEL",
    "POSIBLE",
  ],
  UNCERTAIN: ["UNCERTAIN", "UNGEWISS", "UNSICHER", "INCERTO", "INCIERTO"],
  SPECULATIVE: ["SPECULATIVE", "SPEKULATIV", "ESPECULATIVO"],
  DOCUMENTED: ["DOCUMENTED", "DOKUMENTIERT", "DOCUMENTADO"],
};

/**
 * Words that, directly before an alias, negate or weaken it ("UNVERIFIED" is
 * excluded by the word-start rule; these cover the separate-word forms:
 * "NOT VERIFIED", "NICHT VERIFIZIERT", "NO VERIFICADO", "POCO PROBABLE",
 * "KAUM WAHRSCHEINLICH"). Such an occurrence is skipped and the search continues.
 */
const NEGATORS = new Set([
  "NOT",
  "NICHT",
  "NÃO",
  "NAO",
  "NO",
  "NON",
  "POCO",
  "POUCO",
  "WENIG",
  "KAUM",
]);

/**
 * True when `alias` occurs in `text` at the START of a word (Unicode-aware:
 * the preceding char is not a letter/mark — JS `\b` is ASCII-only) and that
 * occurrence is not directly preceded by a negator word. Suffixes are allowed
 * (`WISSENSCHAFTLICHER` matches `WISSENSCHAFTLICH`; `MÖGLICHE` matches
 * `MÖGLICH`), so infix matches such as `UNVERIFIED` → `VERIFIED` and
 * `IMPROBABLE` → `PROBABLE` no longer resolve. Every occurrence is checked.
 */
function hasAliasAtWordStart(text: string, alias: string): boolean {
  let from = 0;
  for (;;) {
    const i = text.indexOf(alias, from);
    if (i < 0) return false;
    from = i + 1;
    const before = text.slice(0, i);
    if (/[\p{L}\p{M}]$/u.test(before)) continue; // infix — not a word start
    const prevWord = before.match(/([\p{L}\p{M}]+)[^\p{L}\p{M}]*$/u)?.[1];
    if (prevWord && NEGATORS.has(prevWord)) continue; // negated / weakened
    return true;
  }
}

/** Resolve a raw claim-type label to its canonical `ClaimType` (default `TEXTUAL`). */
export function parseClaimType(raw: string): ClaimType {
  const n = raw.trim().toUpperCase();
  for (const ct of CLAIM_TYPES) {
    if (CLAIM_TYPE_ALIASES[ct].some((a) => hasAliasAtWordStart(n, a)))
      return ct;
  }
  console.warn(
    `Unrecognized claim type label: "${raw}", falling back to TEXTUAL`,
  );
  return "TEXTUAL";
}

/** Resolve a raw confidence label to its canonical `ConfidenceLevel` (default `POSSIBLE`). */
export function parseConfidence(raw: string): ConfidenceLevel {
  const n = raw.trim().toUpperCase();
  for (const level of CONFIDENCE_LEVELS) {
    if (CONFIDENCE_ALIASES[level].some((a) => hasAliasAtWordStart(n, a)))
      return level;
  }
  console.warn(
    `Unrecognized confidence label: "${raw}", falling back to POSSIBLE`,
  );
  return "POSSIBLE";
}

/**
 * Own-line `**[claim — confidence]**` EXTRACTION regex (all dash variants).
 * This is the *extraction* form only — callers that *strip* stray inline/trailing
 * label tags from body text keep their own (wider) eraser regexes.
 */
export const DUAL_LABEL = /^\*\*\[(.+?)\s*(?:—|–|--)\s*(.+?)\]\*\*\s*$/;

/** Parse an own-line dual-label into resolved enums, or `null` if the line isn't one. */
export function parseDualLabel(
  line: string,
): { claimType: ClaimType; confidence: ConfidenceLevel } | null {
  const m = DUAL_LABEL.exec(line);
  if (!m) return null;
  return { claimType: parseClaimType(m[1]), confidence: parseConfidence(m[2]) };
}
