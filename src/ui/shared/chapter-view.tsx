"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { ChapterData, EnrichmentData } from "@/domain/content/types";
import { ContinuousReading } from "@/ui/reading/continuous-reading";
import { VerseCard } from "@/ui/study/verse-card";
import { GlossaryPanel } from "@/ui/study/glossary-panel";
import { SupplementaryPanel } from "@/ui/study/supplementary-section";
import { ContextView } from "@/ui/enrichment/context-view";
import { ExploreView } from "@/ui/enrichment/explore-view";
import { ChapterNav } from "@/ui/navigation/chapter-nav";
import { ReadingProgress } from "@/ui/reading/reading-progress";

type ViewMode = "reading" | "study" | "explore" | "context";

const MODE_KEYS: { mode: ViewMode; labelKey: string }[] = [
  { mode: "reading", labelKey: "nav.readingMode" },
  { mode: "study", labelKey: "nav.studyMode" },
  { mode: "explore", labelKey: "nav.exploreMode" },
  { mode: "context", labelKey: "nav.contextMode" },
];

export function ChapterView({
  data,
  enrichment,
  locale,
  book,
  chapterNum,
  totalChapters,
}: {
  data: ChapterData;
  enrichment: EnrichmentData | null;
  locale: string;
  book: string;
  chapterNum: number;
  totalChapters: number;
}) {
  const [mode, setMode] = useState<ViewMode>("reading");
  const t = useTranslations();

  const hasEnrichment = enrichment && enrichment.sections.length > 0;
  const availableModes = MODE_KEYS.filter(
    (m) => (m.mode !== "context" && m.mode !== "explore") || hasEnrichment,
  );

  return (
    <>
      <ReadingProgress />
      <main className="min-h-screen px-4 md:px-6 py-6 md:py-10 max-w-4xl mx-auto">
        <header className="mb-8 space-y-4">
          <h1 className="font-[family-name:var(--font-reading)] text-2xl md:text-3xl font-light">
            {t(`book.${book}`)} {chapterNum}
          </h1>

          <div className="flex gap-1 bg-bg-muted rounded-lg p-1 w-fit" role="tablist">
            {availableModes.map(({ mode: m, labelKey }) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => setMode(m)}
                className={`min-h-11 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-95 ${
                  mode === m
                    ? "bg-bg-paper text-text-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-paper/50"
                }`}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>

          <details className="text-xs text-text-muted">
            <summary className="cursor-pointer hover:text-text-secondary transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded">
              {data.metadata.edition} — {data.metadata.status}
            </summary>
            <div className="mt-2 space-y-1 pl-4 border-l border-border-muted">
              <p><span className="font-medium">{t("metadata.baseText")}:</span> {data.metadata.baseText}</p>
              <p><span className="font-medium">{t("metadata.methodology")}:</span> {data.metadata.methodology}</p>
              {data.metadata.yhwhPolicy && (
                <p><span className="font-medium">{t("metadata.yhwhLabel")}:</span> {data.metadata.yhwhPolicy}</p>
              )}
            </div>
          </details>
        </header>

        {mode === "reading" && (
          <ContinuousReading paragraphs={data.continuousReading} />
        )}

        {mode === "study" && (
          <div className="space-y-0">
            {data.verses.map((verse) => (
              <VerseCard key={`v-${verse.number}`} verse={verse} />
            ))}

            {data.glossary.length > 0 && (
              <div className="mt-10">
                <details className="border border-border rounded-lg">
                  <summary className="px-4 py-3 cursor-pointer text-sm font-semibold uppercase tracking-wider text-text-secondary hover:text-accent transition-colors duration-150 select-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg">
                    {t("glossary.title")}
                  </summary>
                  <div className="px-4 pb-4">
                    <GlossaryPanel entries={data.glossary} />
                  </div>
                </details>
              </div>
            )}

            {data.supplementarySections.length > 0 && (
              <SupplementaryPanel sections={data.supplementarySections} />
            )}
          </div>
        )}

        {mode === "explore" && enrichment && (
          <ExploreView data={enrichment} />
        )}

        {mode === "context" && enrichment && (
          <ContextView data={enrichment} />
        )}

        <ChapterNav locale={locale} book={book} currentChapter={chapterNum} totalChapters={totalChapters} />
      </main>
    </>
  );
}
