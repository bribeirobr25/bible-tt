import type { ClaimType, ConfidenceLevel } from "@/domain/content/types";

/**
 * Single source of truth for the dual-label (claim-type + confidence) PRESENTATION:
 * the confidence→tone classes and the claim/confidence→i18n-key maps, shared by
 * `ClaimBadge`, `prophecy-view`, and `person-card` so they cannot drift.
 */

export const CONFIDENCE_TONE: Record<ConfidenceLevel, string> = {
  VERIFIED: "bg-note-lexical/15 text-note-lexical",
  PROBABLE: "bg-note-lexical/10 text-note-lexical",
  POSSIBLE: "bg-note-theological/10 text-note-theological",
  UNCERTAIN: "bg-note-critical/10 text-note-critical",
  SPECULATIVE: "bg-note-critical/15 text-note-critical",
  DOCUMENTED: "bg-note-grammatical/15 text-note-grammatical",
};

export const CLAIM_TYPE_KEYS: Record<ClaimType, string> = {
  TEXTUAL: "claimType.textual",
  "STRONG INFERENCE": "claimType.strongInference",
  "POSSIBLE INFERENCE": "claimType.possibleInference",
  "COMPARATIVE PARALLEL": "claimType.comparativeParallel",
  "LATER RECEPTION": "claimType.laterReception",
  "HISTORICAL / ARCHAEOLOGICAL": "claimType.historicalArchaeological",
  "SCIENTIFIC COMPARISON": "claimType.scientificComparison",
  SPECULATION: "claimType.speculation",
};

export const CONFIDENCE_KEYS: Record<ConfidenceLevel, string> = {
  VERIFIED: "confidence.verified",
  PROBABLE: "confidence.probable",
  POSSIBLE: "confidence.possible",
  UNCERTAIN: "confidence.uncertain",
  SPECULATIVE: "confidence.speculative",
  DOCUMENTED: "confidence.documented",
};
