import type { LucideIcon } from "lucide-react";
import {
  BookMarked,
  BookOpen,
  FlaskConical,
  Globe,
  Landmark,
  Languages,
  Pickaxe,
  ScrollText,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { type EnrichmentData, sortByConfidence } from "@/domain/content/types";
import { renderInlineSafe } from "@/ui/shared/render-markdown-safe";
import { EnrichmentEntryCard } from "./enrichment-entry";

const SECTION_ICONS: Record<string, LucideIcon> = {
  "source-text-features": BookOpen,
  "ane-parallels": Landmark,
  "historical-archaeological": Pickaxe,
  "linguistic-philological": Languages,
  scientific: FlaskConical,
  "later-reception": ScrollText,
  curiosities: Sparkles,
  sources: BookMarked,
  "world-at-the-time": Globe,
};

const SECTION_ORDER = [
  "curiosities",
  "historical-archaeological",
  "scientific",
  "world-at-the-time",
  "source-text-features",
  "ane-parallels",
  "linguistic-philological",
  "later-reception",
  "sources",
];

export function ContextView({ data }: { data: EnrichmentData }) {
  const t = useTranslations();
  const displaySections = data.sections
    .filter((s) => s.entries.length > 0)
    .sort((a, b) => {
      const aIdx = SECTION_ORDER.indexOf(a.id);
      const bIdx = SECTION_ORDER.indexOf(b.id);
      return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
    });

  if (displaySections.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <p className="text-sm text-text-muted italic">
          {t("enrichment.emptyContext")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div
        className="mb-10 px-4 py-3 border border-border-muted rounded-md bg-bg-surface text-xs text-text-muted leading-relaxed italic"
        dangerouslySetInnerHTML={{
          __html: renderInlineSafe(
            data.disclaimer || t("enrichment.contextDisclaimer"),
          ),
        }}
      />

      <div className="space-y-4">
        {displaySections.map((section) => {
          const Icon = SECTION_ICONS[section.id] || BookMarked;
          return (
            <details
              key={section.id}
              className="group border border-border rounded-lg overflow-hidden"
            >
              <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none hover:bg-bg-surface transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg">
                <Icon
                  className="w-4.5 h-4.5 text-text-muted shrink-0"
                  strokeWidth={1.5}
                />
                <h2 className="font-[family-name:var(--font-reading)] text-base md:text-lg font-light flex-1">
                  {section.title}
                </h2>
                <span className="text-xs text-text-muted tabular-nums">
                  {section.entries.reduce(
                    (n, e) => n + (e.subEntries?.length || 1),
                    0,
                  )}
                </span>
                <svg
                  className="w-4 h-4 text-text-muted transition-transform duration-200 group-open:rotate-90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </summary>
              <div className="px-5 pb-5 pt-2 space-y-4 border-t border-border-muted">
                {section.entries.some((e) => e.subEntries?.length)
                  ? // §I "World at the Time": preserve the authored scenario
                    // order and render each `#### IA-x` sub-dimension as its own
                    // dual-labelled card under its scenario heading.
                    section.entries.map((entry, i) =>
                      entry.subEntries?.length ? (
                        <div key={`${section.id}-${i}`} className="space-y-3">
                          <h3
                            className="font-[family-name:var(--font-ui)] text-sm font-semibold text-text-primary"
                            dangerouslySetInnerHTML={{
                              __html: renderInlineSafe(entry.title),
                            }}
                          />
                          <div className="space-y-4 pl-3 border-l border-border-muted">
                            {entry.subEntries.map((sub, j) => (
                              <EnrichmentEntryCard
                                key={`${section.id}-${i}-${j}`}
                                entry={sub}
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <EnrichmentEntryCard
                          key={`${section.id}-${i}`}
                          entry={entry}
                        />
                      ),
                    )
                  : sortByConfidence(section.entries).map((entry, i) => (
                      <EnrichmentEntryCard
                        key={`${section.id}-${i}`}
                        entry={entry}
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
