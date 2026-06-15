import { useTranslations } from "next-intl";
import type { BookContextData, EnrichmentEntry } from "@/domain/content/types";
import { renderInlineSafe } from "@/ui/shared/render-markdown-safe";
import { EnrichmentEntryCard } from "./enrichment-entry";

// Phase 9 — Book Context view.
// Renders motifs in AUTHORING ORDER (no sortByConfidence per Phase 9 plan §3.4
// + audit §3.4 fix). Each motif renders as an EnrichmentEntryCard via the
// adapter below — Q5 Path A: motif.claimType uses the existing 8-member
// ClaimType union, so the adapter is a trivial object reshape.
export function BookContextView({ data }: { data: BookContextData }) {
  const t = useTranslations();

  if (data.motifs.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-text-muted italic">{t("nav.comingSoon")}</p>
      </div>
    );
  }

  return (
    <div className="tt-deeper-section">
      {data.disclaimer && (
        <div
          className="tt-disclaimer"
          dangerouslySetInnerHTML={{
            __html: renderInlineSafe(data.disclaimer),
          }}
        />
      )}

      <div>
        {data.motifs.map((motif) => {
          const entry: EnrichmentEntry = {
            title: motif.title,
            claimType: motif.claimType,
            confidence: motif.confidence,
            content: motif.body,
            source: motif.source,
          };
          return (
            <div key={motif.slug} className="space-y-1">
              {motif.chapters.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <span className="font-[family-name:var(--font-mono)] uppercase tracking-wider">
                    {t("bookContext.chapters")}
                  </span>
                  <span>{motif.chapters.join(", ")}</span>
                </div>
              )}
              <EnrichmentEntryCard entry={entry} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
