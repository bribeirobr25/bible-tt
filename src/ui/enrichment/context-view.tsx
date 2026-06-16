import { useTranslations } from "next-intl";
import { type EnrichmentData, sortByConfidence } from "@/domain/content/types";
import {
  renderInlineSafe,
  renderMarkdownSafe,
} from "@/ui/shared/render-markdown-safe";
import { ClaimBadge } from "./claim-badge";
import { EnrichmentEntryCard } from "./enrichment-entry";

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
      <div className="tt-deeper-section py-16 text-center">
        <p className="text-sm text-text-muted italic">
          {t("enrichment.emptyContext")}
        </p>
      </div>
    );
  }

  return (
    <div className="tt-deeper-section">
      <div
        className="tt-disclaimer"
        dangerouslySetInnerHTML={{
          __html: renderInlineSafe(
            data.disclaimer || t("enrichment.contextDisclaimer"),
          ),
        }}
      />

      {displaySections.map((section, si) => (
        <details key={section.id} className="tt-details" open={si === 0}>
          <summary>
            <span>{section.title}</span>
            <span className="chev" aria-hidden="true">
              ›
            </span>
          </summary>
          <div className="body">
            {section.intro && (
              <p
                className="tt-secintro"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdownSafe(section.intro, "note"),
                }}
              />
            )}
            {section.entries.some((e) => e.subEntries?.length)
              ? // §I "World at the Time": scenario sub-dimensions. Genesis
                // dating-hypothesis scenarios (`hasLabel`) collapse into a badged
                // disclosure; John/Matthew time-scenarios stay open.
                section.entries.map((entry, i) =>
                  entry.subEntries?.length ? (
                    entry.hasLabel ? (
                      <details
                        key={`${section.id}-${i}`}
                        className="tt-details"
                      >
                        <summary>
                          <span className="flex flex-wrap items-center gap-2.5">
                            <span
                              className="font-[family-name:var(--font-reading)] text-[1.15rem]"
                              dangerouslySetInnerHTML={{
                                __html: renderInlineSafe(entry.title),
                              }}
                            />
                            <ClaimBadge
                              claimType={entry.claimType}
                              confidence={entry.confidence}
                            />
                          </span>
                          <span className="chev" aria-hidden="true">
                            ›
                          </span>
                        </summary>
                        <div className="body">
                          {entry.subEntries.map((sub, j) => (
                            <EnrichmentEntryCard
                              key={`${section.id}-${i}-${j}`}
                              entry={sub}
                            />
                          ))}
                        </div>
                      </details>
                    ) : (
                      <div key={`${section.id}-${i}`}>
                        <h3
                          className="font-[family-name:var(--font-reading)] text-lg"
                          dangerouslySetInnerHTML={{
                            __html: renderInlineSafe(entry.title),
                          }}
                        />
                        <div>
                          {entry.subEntries.map((sub, j) => (
                            <EnrichmentEntryCard
                              key={`${section.id}-${i}-${j}`}
                              entry={sub}
                            />
                          ))}
                        </div>
                      </div>
                    )
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
      ))}
    </div>
  );
}
