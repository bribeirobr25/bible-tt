import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import type { ChapterData } from "@/domain/content/types";
import { ChapterNav } from "@/ui/navigation/chapter-nav";
import { type Door, DoorNav } from "@/ui/navigation/door-nav";
import { Link } from "@/ui/navigation/locale-link";
import { ReadingProgress } from "@/ui/reading/reading-progress";
import { LegacyHashRedirect } from "@/ui/shared/legacy-hash-redirect";
import { renderMarkdownSafe } from "@/ui/shared/render-markdown-safe";
import { GlossaryPanel } from "@/ui/study/glossary-panel";

const WRAP = "max-w-[1320px] mx-auto px-[clamp(18px,4vw,52px)]";

/**
 * Phase 3 — shared chrome for the three chapter doors (Read · Notes · Deeper).
 * Renders the prototype "chapter-head" (crumb · ref+title+status · 3-door nav ·
 * seam) derived from the active door, then a body slot, then a pager. Each door
 * route renders this shell with its own `active`, body, and optional pager.
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
  pager,
}: {
  locale: string;
  book: string;
  chapterNum: number;
  totalChapters: number;
  data: ChapterData;
  active: Door;
  hasDeeper: boolean;
  children: ReactNode;
  pager?: ReactNode;
}) {
  const t = await getTranslations();
  const bookName = t(`book.${book}`);
  const base = `/${book}/chapter/${chapterNum}`;
  const chapterLabel = `${bookName} ${chapterNum}`;
  const doorLabel =
    active === "notes"
      ? t("nav.doorNotes")
      : active === "deeper"
        ? t("nav.doorDeeper")
        : null;

  const ref =
    active === "notes"
      ? t("chapter.notesRef")
      : active === "deeper"
        ? t("chapter.deeperRef")
        : `${t("site.title")} · ${bookName}`;
  const title = doorLabel ? `${chapterLabel} · ${doorLabel}` : chapterLabel;
  // The pill shows a short status word (e.g. "Provisional"); the full
  // "provisional — pending reviewer sign-off (Rule 28)" stays in the metadata.
  const shortStatus = (() => {
    const head = data.metadata.status.split(/\s[—–-]\s|\s\(/)[0].trim();
    return head.charAt(0).toUpperCase() + head.slice(1);
  })();

  return (
    <>
      <ReadingProgress />
      <LegacyHashRedirect book={book} chapterNum={chapterNum} />

      <div className={`tt-chapter-head ${WRAP}`}>
        <nav className="tt-crumb" aria-label="Breadcrumb">
          <Link href="/">{t("nav.home")}</Link>
          <span className="sep">/</span>
          <Link href={`/${book}`}>{bookName}</Link>
          <span className="sep">/</span>
          {active === "read" ? (
            <span>{t("chapter.chapterN", { n: chapterNum })}</span>
          ) : (
            <>
              <Link href={base}>{chapterLabel}</Link>
              <span className="sep">/</span>
              <span>{doorLabel}</span>
            </>
          )}
        </nav>

        <div className="tt-title-row">
          <div>
            <div className="tt-ref">{ref}</div>
            <h1 className="tt-chapter-title">{title}</h1>
          </div>
          <span className="tt-status-pill" title={data.metadata.status}>
            <span className="dot" aria-hidden="true" />
            {shortStatus}
          </span>
        </div>

        <DoorNav
          book={book}
          chapterNum={chapterNum}
          active={active}
          hasDeeper={hasDeeper}
        />

        <hr className="tt-seam mt-[26px]" />
      </div>

      <main
        className={WRAP}
        style={{
          paddingTop: "clamp(36px,6vh,64px)",
          paddingBottom: "clamp(48px,8vh,90px)",
        }}
      >
        {active === "read" && (data.overview || data.glossary.length > 0) && (
          <div className="max-w-[46rem] mx-auto mb-[34px] space-y-3">
            {data.overview && (
              <details className="tt-details" open>
                <summary>
                  <span>{t("nav.chapterOverview")}</span>
                  <span className="chev" aria-hidden="true">
                    ›
                  </span>
                </summary>
                <div
                  className="body prose text-text-primary [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdownSafe(data.overview, "note"),
                  }}
                />
              </details>
            )}
            {data.glossary.length > 0 && (
              <a
                href="#glossary"
                className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.06em] text-accent hover:text-accent-hover transition-colors duration-150"
              >
                {t("glossary.title")} <span aria-hidden="true">↓</span>
              </a>
            )}
          </div>
        )}

        {children}

        {active === "read" && data.glossary.length > 0 && (
          <section
            id="glossary"
            className="max-w-[46rem] mx-auto mt-[60px] scroll-mt-24"
          >
            <p className="tt-kick">{t("glossary.title")}</p>
            <GlossaryPanel entries={data.glossary} />
          </section>
        )}

        {pager ?? (
          <ChapterNav
            locale={locale}
            book={book}
            currentChapter={chapterNum}
            totalChapters={totalChapters}
          />
        )}
      </main>
    </>
  );
}
