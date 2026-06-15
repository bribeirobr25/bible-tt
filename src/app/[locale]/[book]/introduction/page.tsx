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
import { DoorPager } from "@/ui/navigation/door-pager";
import { Link } from "@/ui/navigation/locale-link";
import { JsonLd } from "@/ui/shared/json-ld";

const WRAP = "max-w-[1320px] mx-auto px-[clamp(18px,4vw,52px)]";

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

  const bookName = t(`book.${book}`);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("site.title"), url: canonicalUrl(locale, "") },
          { name: t("nav.books"), url: canonicalUrl(locale, "books") },
          { name: bookName, url: canonicalUrl(locale, book) },
          {
            name: t("nav.bookIntroduction"),
            url: canonicalUrl(locale, `${book}/introduction`),
          },
        ])}
      />
      <div className={`tt-chapter-head ${WRAP}`}>
        <nav className="tt-crumb" aria-label="Breadcrumb">
          <Link href="/">{t("nav.home")}</Link>
          <span className="sep">/</span>
          <Link href="/books">{t("nav.books")}</Link>
          <span className="sep">/</span>
          <Link href={`/${book}`}>{bookName}</Link>
          <span className="sep">/</span>
          <span>{t("nav.bookIntroduction")}</span>
        </nav>
        <div className="tt-title-row">
          <div>
            <div className="tt-ref">{bookName}</div>
            <h1 className="tt-chapter-title">{t("nav.bookIntroduction")}</h1>
          </div>
          <span className="tt-status-pill">
            <span className="dot" aria-hidden="true" />
            {t("people.provisional")}
          </span>
        </div>
        <hr className="tt-seam mt-[26px]" />
      </div>
      <main
        className={WRAP}
        style={{
          paddingTop: "clamp(36px,6vh,64px)",
          paddingBottom: "clamp(48px,8vh,90px)",
        }}
      >
        <IntroductionView
          data={introduction}
          sectionLabels={sectionLabels}
          readingNoteLabel={t("introduction.readingNote")}
          labelMaps={labelMaps}
        />
        <DoorPager
          left={{ href: `/${book}`, label: bookName }}
          right={{ href: `/${book}/chapter/1`, label: `${bookName} 1` }}
        />
      </main>
    </>
  );
}
