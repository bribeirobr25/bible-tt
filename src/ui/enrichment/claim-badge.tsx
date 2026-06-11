import { useTranslations } from "next-intl";
import type { ClaimType, ConfidenceLevel } from "@/domain/content/types";

const CONFIDENCE_BADGE_COLORS: Record<ConfidenceLevel, string> = {
  VERIFIED: "bg-note-lexical/15 text-note-lexical",
  PROBABLE: "bg-note-lexical/10 text-note-lexical",
  POSSIBLE: "bg-note-theological/10 text-note-theological",
  UNCERTAIN: "bg-note-critical/10 text-note-critical",
  SPECULATIVE: "bg-note-critical/15 text-note-critical",
  DOCUMENTED: "bg-note-grammatical/15 text-note-grammatical",
};

const CLAIM_TYPE_KEYS: Record<ClaimType, string> = {
  TEXTUAL: "claimType.textual",
  "STRONG INFERENCE": "claimType.strongInference",
  "POSSIBLE INFERENCE": "claimType.possibleInference",
  "COMPARATIVE PARALLEL": "claimType.comparativeParallel",
  "LATER RECEPTION": "claimType.laterReception",
  "HISTORICAL / ARCHAEOLOGICAL": "claimType.historicalArchaeological",
  "SCIENTIFIC COMPARISON": "claimType.scientificComparison",
  SPECULATION: "claimType.speculation",
};

const CONFIDENCE_KEYS: Record<ConfidenceLevel, string> = {
  VERIFIED: "confidence.verified",
  PROBABLE: "confidence.probable",
  POSSIBLE: "confidence.possible",
  UNCERTAIN: "confidence.uncertain",
  SPECULATIVE: "confidence.speculative",
  DOCUMENTED: "confidence.documented",
};

/**
 * The dual-label (claim-type + confidence) chip pair shared by enrichment cards
 * and §I scenario-group summaries, so a Genesis dating-hypothesis badge renders
 * identically to the per-category card badges beneath it.
 */
export function ClaimBadge({
  claimType,
  confidence,
}: {
  claimType: ClaimType;
  confidence: ConfidenceLevel;
}) {
  const t = useTranslations();
  const badgeColor =
    CONFIDENCE_BADGE_COLORS[confidence] || CONFIDENCE_BADGE_COLORS.POSSIBLE;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-bold uppercase tracking-wider text-text-muted font-[family-name:var(--font-mono)]">
        {t(CLAIM_TYPE_KEYS[claimType] || "claimType.textual")}
      </span>
      <span
        className={`text-xs font-semibold uppercase px-1.5 py-0.5 rounded ${badgeColor}`}
      >
        {t(CONFIDENCE_KEYS[confidence] || "confidence.possible")}
      </span>
    </div>
  );
}
