import { useLocale } from "next-intl";
import {
  type IntroductionData,
  sortByConfidence,
} from "@/domain/content/types";
import { Disclaimer } from "@/ui/shared/disclaimer";
import { Disclosure } from "@/ui/shared/disclosure";
import { renderMarkdownSafe } from "@/ui/shared/render-markdown-safe";
import { SourcesBlock } from "@/ui/shared/sources-block";
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
  const locale = useLocale();
  // Sources is not a section (parser captures it as `data.sources`).
  const sections = data.sections;

  return (
    <div className="tt-deeper-section">
      {data.disclaimer && <Disclaimer text={data.disclaimer} />}

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
              {section.intro && (
                <p
                  className="tt-secintro"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdownSafe(section.intro, "note", {
                      locale,
                    }),
                  }}
                />
              )}
              {sortByConfidence(section.entries).map((entry, i) => (
                <EnrichmentEntryCard key={`${section.id}-${i}`} entry={entry} />
              ))}
            </div>
          </Disclosure>
        );
      })}
      <SourcesBlock sources={data.sources} className="mt-6" />
    </div>
  );
}
