import { useTranslations } from "next-intl";
import type { EnrichmentEntry, ClaimType, ConfidenceLevel } from "@/domain/content/types";

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
};

const CONFIDENCE_KEYS: Record<ConfidenceLevel, string> = {
  VERIFIED: "confidence.verified",
  PROBABLE: "confidence.probable",
  POSSIBLE: "confidence.possible",
  UNCERTAIN: "confidence.uncertain",
  SPECULATIVE: "confidence.speculative",
};

export function EnrichmentEntryCard({ entry }: { entry: EnrichmentEntry }) {
  const t = useTranslations();
  const claimStyle = CLAIM_COLORS[entry.claimType] || CLAIM_COLORS.TEXTUAL;
  const badgeColor = CONFIDENCE_BADGE_COLORS[entry.confidence] || CONFIDENCE_BADGE_COLORS.POSSIBLE;

  return (
    <div className={`border-l-3 ${claimStyle} rounded-r-md px-4 py-3`}>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-wider text-text-muted font-[family-name:var(--font-mono)]">
          {entry.claimType}
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
          __html: entry.content
            .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
            .replace(/\*([^*]+)\*/g, "<em>$1</em>")
            .replace(/\n- /g, "<br/>• ")
            .replace(/\n/g, "<br/>"),
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
