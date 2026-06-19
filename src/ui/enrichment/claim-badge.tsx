import { useTranslations } from "next-intl";
import type { ClaimType, ConfidenceLevel } from "@/domain/content/types";
import {
  CLAIM_TYPE_KEYS,
  CONFIDENCE_KEYS,
  CONFIDENCE_TONE,
} from "@/ui/shared/confidence-tone";

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
  const badgeColor = CONFIDENCE_TONE[confidence] || CONFIDENCE_TONE.POSSIBLE;
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
