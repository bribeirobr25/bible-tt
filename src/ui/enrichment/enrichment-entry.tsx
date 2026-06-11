import { useTranslations } from "next-intl";
import type { ClaimType, EnrichmentEntry } from "@/domain/content/types";
import {
  renderInlineSafe,
  renderMarkdownSafe,
} from "@/ui/shared/render-markdown-safe";
import { ClaimBadge } from "./claim-badge";

const CLAIM_COLORS: Record<ClaimType, string> = {
  TEXTUAL: "border-l-note-lexical bg-note-lexical-bg",
  "STRONG INFERENCE": "border-l-note-lexical bg-note-lexical-bg",
  "POSSIBLE INFERENCE": "border-l-note-theological bg-note-theological-bg",
  "COMPARATIVE PARALLEL": "border-l-note-grammatical bg-note-grammatical-bg",
  "LATER RECEPTION": "border-l-note-theological bg-note-theological-bg",
  "HISTORICAL / ARCHAEOLOGICAL":
    "border-l-note-grammatical bg-note-grammatical-bg",
  "SCIENTIFIC COMPARISON": "border-l-border bg-bg-muted",
  SPECULATION: "border-l-note-critical bg-note-critical-bg",
};

export function EnrichmentEntryCard({ entry }: { entry: EnrichmentEntry }) {
  const t = useTranslations();
  const claimStyle = CLAIM_COLORS[entry.claimType] || CLAIM_COLORS.TEXTUAL;

  return (
    <div className={`border-l-3 ${claimStyle} rounded-r-md px-4 py-3`}>
      <div className="mb-2">
        <ClaimBadge claimType={entry.claimType} confidence={entry.confidence} />
      </div>
      <h4
        className="font-[family-name:var(--font-ui)] text-sm font-semibold mb-1.5"
        dangerouslySetInnerHTML={{ __html: renderInlineSafe(entry.title) }}
      />
      <div
        className="text-sm leading-relaxed text-text-primary"
        dangerouslySetInnerHTML={{
          __html: renderMarkdownSafe(entry.content, "note"),
        }}
      />
      {entry.source && (
        <p
          className="mt-2 text-xs text-text-muted italic"
          dangerouslySetInnerHTML={{
            __html: renderInlineSafe(
              t("enrichment.source", { source: entry.source }),
            ),
          }}
        />
      )}
    </div>
  );
}
