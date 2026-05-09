import { useTranslations } from "next-intl";
import type { EnrichmentData } from "@/domain/content/types";
import { NarrativeSection } from "./narrative-section";

const HIGHLIGHT_SECTIONS = new Set([
  "curiosities",
  "world-at-the-time",
  "scientific",
]);

const SECTION_ORDER = ["curiosities", "world-at-the-time", "scientific"];

export function ExploreView({ data }: { data: EnrichmentData }) {
  const t = useTranslations();
  const displaySections = data.sections
    .filter((s) => s.entries.length > 0 && HIGHLIGHT_SECTIONS.has(s.id))
    .sort((a, b) => {
      const aIdx = SECTION_ORDER.indexOf(a.id);
      const bIdx = SECTION_ORDER.indexOf(b.id);
      return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
    });

  if (displaySections.length === 0) {
    return (
      <div className="max-w-[680px] mx-auto py-16 text-center">
        <p className="text-sm text-text-muted italic">
          {t("enrichment.emptyExplore")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[680px] mx-auto">
      <p className="text-sm text-text-muted italic mb-10">
        {t("enrichment.exploreDisclaimer")}
      </p>

      <div className="flex items-center gap-4 mb-10 text-xs text-text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-note-lexical" />
          {t("enrichment.legendEstablished")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-note-theological" />
          {t("enrichment.legendPossible")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-note-critical/70" />
          {t("enrichment.legendUncertain")}
        </span>
      </div>

      <div className="space-y-12">
        {displaySections.map((section) => (
          <NarrativeSection key={section.id} section={section} />
        ))}
      </div>

      <div className="mt-16 pt-6 border-t border-border-muted text-center">
        <p className="text-sm text-text-muted">
          {t("enrichment.exploreFooter", { contextMode: t("nav.contextMode") })}
        </p>
      </div>
    </div>
  );
}
