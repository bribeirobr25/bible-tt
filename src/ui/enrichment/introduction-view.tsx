import {
  type IntroductionData,
  sortByConfidence,
} from "@/domain/content/types";
import { Disclosure } from "@/ui/shared/disclosure";
import { renderInlineSafe } from "@/ui/shared/render-markdown-safe";
import { EnrichmentEntryCard } from "./enrichment-entry";

interface IntroductionViewProps {
  data: IntroductionData;
  sectionLabels: Record<string, string>;
}

/**
 * Book introduction body (prototype parity): a dashed disclaimer + each section
 * as a cream disclosure of dual-labelled enrichment cards.
 */
export function IntroductionView({
  data,
  sectionLabels,
}: IntroductionViewProps) {
  const sections = data.sections.filter(
    (s) => s.id !== "sources" || s.entries.length > 0,
  );

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

      {sections.map((section, si) => {
        const label =
          sectionLabels[
            section.id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
          ] || section.title;
        return (
          <Disclosure
            key={section.id}
            name="intro-acc"
            open={si === 0}
            summary={<span>{label}</span>}
          >
            <div className="body">
              {sortByConfidence(section.entries).map((entry, i) => (
                <EnrichmentEntryCard key={`${section.id}-${i}`} entry={entry} />
              ))}
            </div>
          </Disclosure>
        );
      })}
    </div>
  );
}
