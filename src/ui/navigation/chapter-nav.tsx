import Link from "next/link";
import { useTranslations } from "next-intl";

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
  const bookName = t(`book.${book}`);
  const hasPrev = currentChapter > 1;
  const hasNext = currentChapter < totalChapters;

  return (
    <nav className="tt-pager" aria-label="Chapter navigation">
      {hasPrev ? (
        <Link href={`/${locale}/${book}/chapter/${currentChapter - 1}`}>
          <span className="pl">{t("chapter.prev")}</span>
          <span className="font-[family-name:var(--font-reading)] text-[1.2rem]">
            {bookName} {currentChapter - 1}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {hasNext ? (
        <Link
          className="right"
          href={`/${locale}/${book}/chapter/${currentChapter + 1}`}
        >
          <span className="pl">{t("chapter.next")}</span>
          <span className="font-[family-name:var(--font-reading)] text-[1.2rem]">
            {bookName} {currentChapter + 1}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
