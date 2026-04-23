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

const CONFIDENCE_BADGE: Record<ConfidenceLevel, { label: string; color: string }> = {
  VERIFIED: { label: "Verified", color: "bg-note-lexical/15 text-note-lexical" },
  PROBABLE: { label: "Probable", color: "bg-note-lexical/10 text-note-lexical" },
  POSSIBLE: { label: "Possible", color: "bg-note-theological/10 text-note-theological" },
  UNCERTAIN: { label: "Uncertain", color: "bg-note-critical/10 text-note-critical" },
  SPECULATIVE: { label: "Speculative", color: "bg-note-critical/15 text-note-critical" },
};

export function EnrichmentEntryCard({ entry }: { entry: EnrichmentEntry }) {
  const claimStyle = CLAIM_COLORS[entry.claimType] || CLAIM_COLORS.TEXTUAL;
  const badge = CONFIDENCE_BADGE[entry.confidence] || CONFIDENCE_BADGE.POSSIBLE;

  return (
    <div className={`border-l-3 ${claimStyle} rounded-r-md px-4 py-3`}>
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-wider text-text-muted font-[family-name:var(--font-mono)]">
          {entry.claimType}
        </span>
        <span className={`text-xs font-semibold uppercase px-1.5 py-0.5 rounded ${badge.color}`}>
          {badge.label}
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
          Source: {entry.source}
        </p>
      )}
    </div>
  );
}
