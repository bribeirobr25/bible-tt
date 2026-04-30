import { useTranslations } from "next-intl";
import type { EnrichmentEntry, ClaimType, ConfidenceLevel } from "@/domain/content/types";
import { renderMarkdownSafe } from "@/ui/shared/render-markdown-safe";

const CLAIM_COLORS: Record<ClaimType, string> = {
  "TEXTUAL": "border-l-note-lexical bg-note-lexical-bg",
  "STRONG INFERENCE": "border-l-note-lexical bg-note-lexical-bg",
  "POSSIBLE INFERENCE": "border-l-note-theological bg-note-theological-bg",
  "COMPARATIVE PARALLEL": "border-l-note-grammatical bg-note-grammatical-bg",
  "LATER RECEPTION": "border-l-note-theological bg-note-theological-bg",
  "HISTORICAL / ARCHAEOLOGICAL": "border-l-note-grammatical bg-note-grammatical-bg",
  "SCIENTIFIC COMPARISON": "border-l-border bg-bg-muted",
  "SPECULATION": "border-l-note-critical bg-note-critical-bg",
};

const CONFIDENCE_BADGE_COLORS: Record<ConfidenceLevel, string> = {
  VERIFIED: "bg-note-lexical/15 text-note-lexical",
  PROBABLE: "bg-note-lexical/10 text-note-lexical",
  POSSIBLE: "bg-note-theological/10 text-note-theological",
  UNCERTAIN: "bg-note-critical/10 text-note-critical",
  SPECULATIVE: "bg-note-critical/15 text-note-critical",
  DOCUMENTED: "bg-note-grammatical/15 text-note-grammatical",
};

const CLAIM_TYPE_KEYS: Record<ClaimType, string> = {
  "TEXTUAL": "claimType.textual",
  "STRONG INFERENCE": "claimType.strongInference",
  "POSSIBLE INFERENCE": "claimType.possibleInference",
  "COMPARATIVE PARALLEL": "claimType.comparativeParallel",
  "LATER RECEPTION": "claimType.laterReception",
  "HISTORICAL / ARCHAEOLOGICAL": "claimType.historicalArchaeological",
  "SCIENTIFIC COMPARISON": "claimType.scientificComparison",
  "SPECULATION": "claimType.speculation",
};

const CONFIDENCE_KEYS: Record<ConfidenceLevel, string> = {
  VERIFIED: "confidence.verified",
  PROBABLE: "confidence.probable",
  POSSIBLE: "confidence.possible",
  UNCERTAIN: "confidence.uncertain",
  SPECULATIVE: "confidence.speculative",
  DOCUMENTED: "confidence.documented",
};

export function EnrichmentEntryCard({ entry }: { entry: EnrichmentEntry }) {
  const t = useTranslations();
  const claimStyle = CLAIM_COLORS[entry.claimType] || CLAIM_COLORS.TEXTUAL;
  const badgeColor = CONFIDENCE_BADGE_COLORS[entry.confidence] || CONFIDENCE_BADGE_COLORS.POSSIBLE;

  return (
    <div className={`border-l-3 ${claimStyle} rounded-r-md px-4 py-3`}>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-wider text-text-muted font-[family-name:var(--font-mono)]">
          {t(CLAIM_TYPE_KEYS[entry.claimType] || "claimType.textual")}
        </span>
        <span className={`text-xs font-semibold uppercase px-1.5 py-0.5 rounded ${badgeColor}`}>
          {t(CONFIDENCE_KEYS[entry.confidence] || "confidence.possible")}
        </span>
      </div>
      <h4 className="font-[family-name:var(--font-ui)] text-sm font-semibold mb-1.5">
        {entry.title}
      </h4>
      <div
        className="text-sm leading-relaxed text-text-primary"
        dangerouslySetInnerHTML={{
          __html: renderMarkdownSafe(entry.content, "note"),
        }}
      />
      {entry.source && (
        <p className="mt-2 text-xs text-text-muted italic">
          {t("enrichment.source", { source: entry.source })}
        </p>
      )}
    </div>
  );
}
