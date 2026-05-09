import {
  BookMarked,
  BookOpen,
  Calendar,
  Eye,
  MapPin,
  ScrollText,
  Users,
} from "lucide-react";
import {
  type ClaimType,
  type ConfidenceLevel,
  type EnrichmentEntry,
  type IntroductionData,
  sortByConfidence,
} from "@/domain/content/types";
import {
  renderInlineSafe,
  renderMarkdownSafe,
} from "@/ui/shared/render-markdown-safe";

const SECTION_ICONS: Record<string, typeof BookOpen> = {
  overview: BookOpen,
  authorship: Users,
  dating: Calendar,
  "historical-setting": MapPin,
  "manuscript-transmission": ScrollText,
  "reading-in-tt": Eye,
  sources: BookMarked,
};

export interface LabelMaps {
  claimTypes: Record<ClaimType, string>;
  confidence: Record<ConfidenceLevel, string>;
}

interface IntroductionViewProps {
  data: IntroductionData;
  sectionLabels: Record<string, string>;
  readingNoteLabel: string;
  labelMaps: LabelMaps;
}

function IntroductionEntry({
  entry,
  labelMaps,
}: {
  entry: EnrichmentEntry;
  labelMaps: LabelMaps;
}) {
  return (
    <div className="border-l-3 border-l-border bg-bg-muted rounded-r-md px-4 py-3">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-wider text-text-muted font-[family-name:var(--font-mono)]">
          {labelMaps.claimTypes[entry.claimType] || entry.claimType}
        </span>
        <span className="text-xs font-semibold uppercase px-1.5 py-0.5 rounded bg-bg-surface text-text-secondary">
          {labelMaps.confidence[entry.confidence] || entry.confidence}
        </span>
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
          dangerouslySetInnerHTML={{ __html: renderInlineSafe(entry.source) }}
        />
      )}
    </div>
  );
}

export function IntroductionView({
  data,
  sectionLabels,
  readingNoteLabel,
  labelMaps,
}: IntroductionViewProps) {
  return (
    <div className="space-y-4">
      {data.disclaimer && (
        <details className="group border border-border-muted rounded-md">
          <summary className="px-3 py-2 cursor-pointer text-xs uppercase tracking-wider text-text-muted hover:text-text-secondary transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md">
            {readingNoteLabel}
          </summary>
          <p className="px-3 pb-3 text-xs text-text-muted italic leading-relaxed">
            {data.disclaimer}
          </p>
        </details>
      )}
      <div className="space-y-2">
        {data.sections
          .filter((s) => s.id !== "sources" || s.entries.length > 0)
          .map((section) => {
            const Icon = SECTION_ICONS[section.id] || BookOpen;
            const label =
              sectionLabels[
                section.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
              ] || section.title;
            return (
              <details
                key={section.id}
                className="group border border-border rounded-lg"
              >
                <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-bg-surface transition-colors duration-150 rounded-lg">
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                    className="text-text-muted shrink-0"
                  />
                  <span className="font-[family-name:var(--font-ui)] text-sm font-medium text-text-primary">
                    {label}
                  </span>
                  <span className="text-xs text-text-muted ml-auto">
                    {section.entries.length}
                  </span>
                </summary>
                <div className="px-4 pb-4 space-y-3">
                  {sortByConfidence(section.entries).map((entry, i) => (
                    <IntroductionEntry
                      key={`${section.id}-${i}`}
                      entry={entry}
                      labelMaps={labelMaps}
                    />
                  ))}
                </div>
              </details>
            );
          })}
      </div>
    </div>
  );
}
