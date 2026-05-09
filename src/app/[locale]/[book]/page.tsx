import { BookMarked, BookOpen, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ClaimType, ConfidenceLevel } from "@/domain/content/types";
import type { Locale } from "@/infrastructure/i18n/config";
import {
  getAvailableBooks,
  getAvailableChapters,
  getIntroductionData,
  getIntroductionOverview,
  getPeopleData,
} from "@/lib/content-loader";
import { IntroductionView } from "@/ui/enrichment/introduction-view";
import { Link } from "@/ui/navigation/locale-link";

export async function generateStaticParams() {
  const books = await getAvailableBooks("en");
  return books.map((book) => ({ book }));
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string; book: string }>;
}) {
  const { locale, book } = await params;
  setRequestLocale(locale);

  const books = await getAvailableBooks(locale);
  if (!books.includes(book)) {
    notFound();
  }

  const t = await getTranslations();
  const chapters = await getAvailableChapters(locale, book);
  // Phase 5: landing page renders Section A (Overview) only via getIntroductionOverview;
  // full introduction lives at /{book}/introduction.
  const introduction = await getIntroductionOverview(locale as Locale, book);
  const hasFullIntroduction =
    (await getIntroductionData(locale as Locale, book)) != null;
  const people = await getPeopleData(locale as Locale, book);

  const sectionLabels: Record<string, string> = {
    overview: t("introduction.section.overview"),
    authorship: t("introduction.section.authorship"),
    dating: t("introduction.section.dating"),
    historicalSetting: t("introduction.section.historicalSetting"),
    manuscriptTransmission: t("introduction.section.manuscriptTransmission"),
    readingInTT: t("introduction.section.readingInTT"),
    sources: t("introduction.section.sources"),
  };

  const labelMaps = {
    claimTypes: {
      TEXTUAL: t("claimType.textual"),
      "STRONG INFERENCE": t("claimType.strongInference"),
      "POSSIBLE INFERENCE": t("claimType.possibleInference"),
      "COMPARATIVE PARALLEL": t("claimType.comparativeParallel"),
      "LATER RECEPTION": t("claimType.laterReception"),
      "HISTORICAL / ARCHAEOLOGICAL": t("claimType.historicalArchaeological"),
      "SCIENTIFIC COMPARISON": t("claimType.scientificComparison"),
      SPECULATION: t("claimType.speculation"),
    } as Record<ClaimType, string>,
    confidence: {
      VERIFIED: t("confidence.verified"),
      PROBABLE: t("confidence.probable"),
      POSSIBLE: t("confidence.possible"),
      UNCERTAIN: t("confidence.uncertain"),
      SPECULATIVE: t("confidence.speculative"),
      DOCUMENTED: t("confidence.documented"),
    } as Record<ConfidenceLevel, string>,
  };

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-reading)] text-3xl md:text-4xl font-light">
            {t(`book.${book}`)}
          </h1>
        </div>
        {introduction && (
          <IntroductionView
            data={introduction}
            sectionLabels={sectionLabels}
            readingNoteLabel={t("introduction.readingNote")}
            labelMaps={labelMaps}
          />
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          {hasFullIntroduction && (
            <Link
              href={`/${book}/introduction`}
              className="flex-1 flex items-center gap-3 min-h-11 px-4 py-3 rounded-lg border border-border hover:border-accent/40 hover:bg-bg-surface transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <BookMarked
                size={18}
                strokeWidth={1.5}
                className="text-text-muted shrink-0"
              />
              <span className="font-[family-name:var(--font-ui)] text-sm font-medium text-text-primary">
                {t("nav.bookIntroduction")}
              </span>
            </Link>
          )}
          {people && people.entries.length > 0 && (
            <Link
              href={`/${book}/people`}
              className="flex-1 flex items-center gap-3 min-h-11 px-4 py-3 rounded-lg border border-border hover:border-accent/40 hover:bg-bg-surface transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <Users
                size={18}
                strokeWidth={1.5}
                className="text-text-muted shrink-0"
              />
              <span className="font-[family-name:var(--font-ui)] text-sm font-medium text-text-primary">
                {t("people.title")}
              </span>
              <span className="text-xs text-text-muted ml-auto">
                {people.entries.length}
              </span>
            </Link>
          )}
          <Link
            href={`/${book}/context`}
            className="flex-1 flex items-center gap-3 min-h-11 px-4 py-3 rounded-lg border border-border hover:border-accent/40 hover:bg-bg-surface transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <BookOpen
              size={18}
              strokeWidth={1.5}
              className="text-text-muted shrink-0"
            />
            <span className="font-[family-name:var(--font-ui)] text-sm font-medium text-text-primary">
              {t("nav.bookContext")}
            </span>
          </Link>
        </div>
        <div>
          <p className="text-sm text-text-muted mb-3">
            {t("nav.selectChapter")}
          </p>
          <nav className="space-y-3">
            {chapters.map((ch) => (
              <Link
                key={ch}
                href={`/${book}/chapter/${ch}`}
                className="block px-5 py-4 rounded-lg border border-border hover:border-accent/40 hover:bg-bg-surface transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-[0.99]"
              >
                <span className="font-medium">
                  {t("nav.chapters")} {ch}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </main>
  );
}
