"use client";

import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type {
  ChapterData,
  EnrichmentData,
  ProphecyData,
} from "@/domain/content/types";
import { ContextView } from "@/ui/enrichment/context-view";
import { ExploreView } from "@/ui/enrichment/explore-view";
import { ChapterNav } from "@/ui/navigation/chapter-nav";
import { Link } from "@/ui/navigation/locale-link";
import { ProphecyView } from "@/ui/prophecy/prophecy-view";
import { ContinuousReading } from "@/ui/reading/continuous-reading";
import { ReadingProgress } from "@/ui/reading/reading-progress";
import { renderMarkdownSafe } from "@/ui/shared/render-markdown-safe";
import { ShareButton } from "@/ui/shared/share-button";
import { GlossaryPanel } from "@/ui/study/glossary-panel";
import { SupplementaryPanel } from "@/ui/study/supplementary-section";
import { VerseCard } from "@/ui/study/verse-card";

type ViewMode = "reading" | "study" | "explore" | "context" | "prophecy";

const MODE_KEYS: { mode: ViewMode; labelKey: string }[] = [
  { mode: "reading", labelKey: "nav.readingMode" },
  { mode: "study", labelKey: "nav.studyMode" },
  { mode: "explore", labelKey: "nav.exploreMode" },
  { mode: "context", labelKey: "nav.contextMode" },
  { mode: "prophecy", labelKey: "nav.prophecyMode" },
];

export function ChapterView({
  data,
  enrichment,
  prophecy,
  locale,
  book,
  chapterNum,
  totalChapters,
}: {
  data: ChapterData;
  enrichment: EnrichmentData | null;
  prophecy: ProphecyData | null;
  locale: string;
  book: string;
  chapterNum: number;
  totalChapters: number;
}) {
  const [mode, setMode] = useState<ViewMode>("reading");
  const t = useTranslations();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const valid: ViewMode[] = [
      "reading",
      "study",
      "explore",
      "context",
      "prophecy",
    ];
    if (valid.includes(hash as ViewMode)) {
      setMode(hash as ViewMode);
    }
  }, []);

  const hasEnrichment = enrichment && enrichment.sections.length > 0;
  const hasProphecy = prophecy && prophecy.entries.length > 0;
  const availableModes = MODE_KEYS.filter((m) => {
    if (m.mode === "context" || m.mode === "explore") return hasEnrichment;
    if (m.mode === "prophecy") return hasProphecy;
    return true;
  });

  return (
    <>
      <ReadingProgress />
      <main className="min-h-screen px-4 md:px-6 py-6 md:py-10 max-w-4xl mx-auto">
        <header className="mb-8 space-y-4">
          <Link
            href={`/${book}`}
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent transition-colors duration-150"
          >
            <ChevronLeft size={14} strokeWidth={1.5} />
            {t(`book.${book}`)}
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-[family-name:var(--font-reading)] text-2xl md:text-3xl font-light">
              {t(`book.${book}`)} {chapterNum}
            </h1>
            <ShareButton
              title={`${t(`book.${book}`)} ${chapterNum}`}
              text={`${t(`book.${book}`)} ${chapterNum} — The Transparent Translation`}
              url={
                typeof window !== "undefined"
                  ? `${window.location.origin}/${locale}/${book}/chapter/${chapterNum}#${mode}`
                  : undefined
              }
            />
          </div>

          <div
            className="flex gap-1 bg-bg-muted rounded-lg p-1 w-fit"
            role="tablist"
          >
            {availableModes.map(({ mode: m, labelKey }) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => {
                  history.replaceState(null, "", `#${m}`);
                  setMode(m);
                }}
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
              <p>
                <span className="font-medium">{t("metadata.baseText")}:</span>{" "}
                {data.metadata.baseText}
              </p>
              <p>
                <span className="font-medium">
                  {t("metadata.methodology")}:
                </span>{" "}
                {data.metadata.methodology}
              </p>
              {data.metadata.divineNamePolicy && (
                <p>
                  <span className="font-medium">
                    {t("metadata.divineNameLabel")}:
                  </span>{" "}
                  {data.metadata.divineNamePolicy}
                </p>
              )}
            </div>
          </details>
        </header>

        {data.overview && (
          <details className="mb-6 border border-border rounded-lg">
            <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-150 rounded-lg">
              {t("nav.chapterOverview")}
            </summary>
            <div
              className="px-4 pb-4 text-sm leading-relaxed text-text-primary [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{
                __html: renderMarkdownSafe(data.overview, "note"),
              }}
            />
          </details>
        )}

        {mode === "reading" && (
          <ContinuousReading paragraphs={data.continuousReading} />
        )}

        {mode === "study" && (
          <div className="space-y-0">
            {data.readingGuide && (
              <details className="mb-6 border border-border rounded-lg">
                <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-150 rounded-lg">
                  {t("nav.readingGuide")}
                </summary>
                <div
                  className="px-4 pb-4 text-sm leading-relaxed text-text-primary"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdownSafe(data.readingGuide, "note"),
                  }}
                />
              </details>
            )}

            {data.glossary.length > 0 && (
              <div className="mb-6">
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

            {data.verses.map((verse) => (
              <VerseCard key={`v-${verse.number}`} verse={verse} />
            ))}
          </div>
        )}

        {mode === "explore" && enrichment && <ExploreView data={enrichment} />}

        {mode === "context" && enrichment && <ContextView data={enrichment} />}

        {mode === "prophecy" && prophecy && <ProphecyView data={prophecy} />}

        <ChapterNav
          locale={locale}
          book={book}
          currentChapter={chapterNum}
          totalChapters={totalChapters}
        />
      </main>
    </>
  );
}
