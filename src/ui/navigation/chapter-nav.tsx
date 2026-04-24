import { useTranslations } from "next-intl";
import Link from "next/link";

export function ChapterNav({
  locale,
  book,
  currentChapter,
  totalChapters,
}: {
  locale: string;
  book: string;
  currentChapter: number;
  totalChapters: number;
}) {
  const t = useTranslations();
  const hasPrev = currentChapter > 1;
  const hasNext = currentChapter < totalChapters;

  return (
    <nav className="flex justify-between items-center mt-12 pt-6 border-t border-border-muted">
      {hasPrev ? (
        <Link
          href={`/${locale}/${book}/${currentChapter - 1}`}
          className="min-h-11 inline-flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-accent rounded-md transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-95"
        >
          <span aria-hidden="true">&larr;</span>
          <span>{t("chapter.chapterN", { n: currentChapter - 1 })}</span>
        </Link>
      ) : (
        <span />
      )}
      {hasNext ? (
        <Link
          href={`/${locale}/${book}/${currentChapter + 1}`}
          className="min-h-11 inline-flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-accent rounded-md transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-95"
        >
          <span>{t("chapter.chapterN", { n: currentChapter + 1 })}</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
