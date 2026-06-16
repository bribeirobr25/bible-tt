import { useTranslations } from "next-intl";
import type { EnrichmentEntry } from "@/domain/content/types";
import {
  renderInlineSafe,
  renderMarkdownSafe,
} from "@/ui/shared/render-markdown-safe";
import { ClaimBadge } from "./claim-badge";

/**
 * Deeper enrichment entry (prototype `.enrich`): uniform cream surface with a
 * deep-accent left border; title → dual-label chips → body → source.
 */
export function EnrichmentEntryCard({ entry }: { entry: EnrichmentEntry }) {
  const t = useTranslations();

  return (
    <div className="tt-enrich">
      <h4
        className="etitle"
        dangerouslySetInnerHTML={{ __html: renderInlineSafe(entry.title) }}
      />
      <div className="labels">
        <ClaimBadge claimType={entry.claimType} confidence={entry.confidence} />
      </div>
      <div
        className="ebody [&_em]:italic"
        dangerouslySetInnerHTML={{
          __html: renderMarkdownSafe(entry.content, "note"),
        }}
      />
      {entry.source && (
        <p
          className="src"
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
