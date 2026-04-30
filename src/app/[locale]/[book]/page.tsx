import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/ui/navigation/locale-link";
import { getAvailableBooks, getAvailableChapters, getIntroductionData, getPeopleData } from "@/lib/content-loader";
import type { Locale } from "@/infrastructure/i18n/config";
import { IntroductionView } from "@/ui/enrichment/introduction-view";
import type { ClaimType, ConfidenceLevel } from "@/domain/content/types";
import { Users } from "lucide-react";

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
  const introduction = await getIntroductionData(locale as Locale, book);
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
      "TEXTUAL": t("claimType.textual"),
      "STRONG INFERENCE": t("claimType.strongInference"),
      "POSSIBLE INFERENCE": t("claimType.possibleInference"),
      "COMPARATIVE PARALLEL": t("claimType.comparativeParallel"),
      "LATER RECEPTION": t("claimType.laterReception"),
      "HISTORICAL / ARCHAEOLOGICAL": t("claimType.historicalArchaeological"),
      "SCIENTIFIC COMPARISON": t("claimType.scientificComparison"),
      "SPECULATION": t("claimType.speculation"),
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
            title={t("introduction.title")}
            labelMaps={labelMaps}
          />
        )}
        {people && people.entries.length > 0 && (
          <details className="border border-border rounded-lg">
            <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-bg-surface transition-colors duration-150 rounded-lg">
              <Users size={18} strokeWidth={1.5} className="text-text-muted shrink-0" />
              <span className="font-[family-name:var(--font-ui)] text-sm font-medium text-text-primary">
                {t("people.title")}
              </span>
              <span className="text-xs text-text-muted ml-auto">{people.entries.length}</span>
            </summary>
            <div className="px-4 pb-4 space-y-3">
              {people.entries.map((person) => (
                <div key={person.slug} className="border-l-2 border-border pl-3 py-1">
                  <p className="text-sm font-semibold text-text-primary">{person.name}</p>
                  {person.nameMeaning && (
                    <p className="text-xs text-text-muted">{t("people.meaning")}: {person.nameMeaning}</p>
                  )}
                  <p className="text-xs text-text-secondary">
                    {person.lifespan && <span>{t("people.lifespan")}: {person.lifespan}</span>}
                    {person.firstMention && <span className="ml-2">({person.firstMention})</span>}
                  </p>
                </div>
              ))}
            </div>
          </details>
        )}
        <div>
          <p className="text-sm text-text-muted mb-3">
            {t("nav.selectChapter")}
          </p>
          <nav className="space-y-3">
            {chapters.map((ch) => (
              <Link
                key={ch}
                href={`/${book}/${ch}`}
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
