import { ChevronLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import type { ChapterData } from "@/domain/content/types";
import { ChapterNav } from "@/ui/navigation/chapter-nav";
import { type Door, DoorNav } from "@/ui/navigation/door-nav";
import { Link } from "@/ui/navigation/locale-link";
import { ReadingProgress } from "@/ui/reading/reading-progress";
import { LegacyHashRedirect } from "@/ui/shared/legacy-hash-redirect";
import { renderMarkdownSafe } from "@/ui/shared/render-markdown-safe";
import { ShareButton } from "@/ui/shared/share-button";

/**
 * Phase 3 — shared chrome for the three chapter doors (Read · Notes · Deeper).
 * Server-rendered header (back-link, title, share, 3-door nav, metadata,
 * overview) + a body slot + chapter pager. Each door route renders this shell
 * with its own `active` and body, so the doors are real, crawlable URLs.
 */
export async function ChapterShell({
  locale,
  book,
  chapterNum,
  totalChapters,
  data,
  active,
  hasDeeper,
  children,
}: {
  locale: string;
  book: string;
  chapterNum: number;
  totalChapters: number;
  data: ChapterData;
  active: Door;
  hasDeeper: boolean;
  children: ReactNode;
}) {
  const t = await getTranslations();
  const bookName = t(`book.${book}`);

  return (
    <>
      <ReadingProgress />
      <LegacyHashRedirect book={book} chapterNum={chapterNum} />
      <main className="min-h-screen px-4 md:px-6 py-6 md:py-10 max-w-4xl mx-auto">
        <header className="mb-8 space-y-4">
          <Link
            href={`/${book}`}
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent transition-colors duration-150"
          >
            <ChevronLeft size={14} strokeWidth={1.5} />
            {bookName}
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="tt-h2">
              {bookName} {chapterNum}
            </h1>
            <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.04em] text-text-muted">
              {data.metadata.status}
            </span>
            <ShareButton
              title={`${bookName} ${chapterNum}`}
              text={`${bookName} ${chapterNum} — The Transparent Translation`}
            />
          </div>

          <DoorNav
            book={book}
            chapterNum={chapterNum}
            active={active}
            hasDeeper={hasDeeper}
          />

          <hr className="tt-seam" />

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

        {children}

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
