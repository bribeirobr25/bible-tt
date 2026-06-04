import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AVAILABLE_BOOKS } from "@/domain/books/registry";
import type { ClaimType, ConfidenceLevel } from "@/domain/content/types";
import type { Locale } from "@/infrastructure/i18n/config";
import { getAvailableBooks, getIntroductionData } from "@/lib/content-loader";
import {
  breadcrumbJsonLd,
  canonicalUrl,
  seoMetadata,
  truncateDescription,
} from "@/lib/seo";
import { IntroductionView } from "@/ui/enrichment/introduction-view";
import { Link } from "@/ui/navigation/locale-link";
import { JsonLd } from "@/ui/shared/json-ld";

export async function generateStaticParams() {
  const books = await getAvailableBooks("en");
  return books.map((book) => ({ book }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; book: string }>;
}): Promise<Metadata> {
  const { locale, book } = await params;
  if (!(AVAILABLE_BOOKS as readonly string[]).includes(book)) return {};
  const t = await getTranslations({ locale });
  return seoMetadata({
    locale,
    path: `${book}/introduction`,
    title: `${t(`book.${book}`)} — ${t("nav.bookIntroduction")}`,
    description: truncateDescription(t("nav.bookIntroductionDescription")),
  });
}

export default async function BookIntroductionPage({
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
  const introduction = await getIntroductionData(locale as Locale, book);

  if (!introduction) {
    notFound();
  }

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
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("site.title"), url: canonicalUrl(locale, "") },
          { name: t("nav.selectBook"), url: canonicalUrl(locale, "books") },
          { name: t(`book.${book}`), url: canonicalUrl(locale, book) },
          {
            name: t("nav.bookIntroduction"),
            url: canonicalUrl(locale, `${book}/introduction`),
          },
        ])}
      />
      <div className="max-w-3xl w-full space-y-8">
        <div>
          <Link
            href={`/${book}`}
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent transition-colors duration-150 mb-4"
          >
            <ChevronLeft size={14} strokeWidth={1.5} />
            {t(`book.${book}`)}
          </Link>
          <h1 className="font-[family-name:var(--font-reading)] text-2xl md:text-3xl font-light">
            {t("nav.bookIntroduction")}
          </h1>
          <p className="text-sm text-text-muted mt-2 italic">
            {t("nav.bookIntroductionDescription")}
          </p>
        </div>

        <IntroductionView
          data={introduction}
          sectionLabels={sectionLabels}
          readingNoteLabel={t("introduction.readingNote")}
          labelMaps={labelMaps}
        />
      </div>
    </main>
  );
}
