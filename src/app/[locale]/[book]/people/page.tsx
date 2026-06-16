import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AVAILABLE_BOOKS } from "@/domain/books/registry";
import type { Locale } from "@/infrastructure/i18n/config";
import { getAvailableBooks, getPeopleData } from "@/lib/content-loader";
import {
  breadcrumbJsonLd,
  canonicalUrl,
  seoMetadata,
  truncateDescription,
} from "@/lib/seo";
import { Link } from "@/ui/navigation/locale-link";
import { PeopleTimeline } from "@/ui/people/people-timeline";
import { PersonCard } from "@/ui/people/person-card";
import { JsonLd } from "@/ui/shared/json-ld";
import {
  renderInlineSafe,
  renderMarkdownSafe,
} from "@/ui/shared/render-markdown-safe";

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
    path: `${book}/people`,
    title: `${t(`book.${book}`)} — ${t("people.title")}`,
    description: truncateDescription(
      `${t("people.title")} — ${t(`book.${book}`)}. ${t("site.subtitle")}`,
    ),
  });
}

// Renders the lead paragraph with the Latin term "Anno Mundi" in mono (prototype
// parity). The term is constant across locales, so the split is locale-safe.
function Lead({ text }: { text: string }) {
  const parts = text.split("Anno Mundi");
  return (
    <p className="tt-lead max-w-[60ch] mb-[clamp(40px,6vh,70px)]">
      {parts.map((part, i) => (
        <span key={`lead-${i}`}>
          {part}
          {i < parts.length - 1 && (
            <span className="font-[family-name:var(--font-mono)] text-[0.85em]">
              Anno Mundi
            </span>
          )}
        </span>
      ))}
    </p>
  );
}

export default async function PeoplePage({
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
  const people = await getPeopleData(locale as Locale, book);

  if (!people || people.entries.length === 0) {
    notFound();
  }

  const bookName = t(`book.${book}`);
  const isGenesis = book === "genesis";

  // PersonCard renders fields generically; it only needs these few labels.
  const cardLabels = {
    curiosities: t("people.curiosities"),
    crossBookSee: t("people.crossBookSee"),
    note: t("people.note"),
    regionsSafeguard: t("people.regionsByTextSafeguard"),
  };

  // Localized labels for any book a `**See:**` pointer might reference.
  const bookLabels: Record<string, string> = {
    genesis: t("book.genesis"),
    matthew: t("book.matthew"),
    john: t("book.john"),
  };

  // Authored order (prototype parity) — no chronological re-sort.
  const entries = people.entries;
  const firstPersonSlug = entries[0]?.slug;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("site.title"), url: canonicalUrl(locale, "") },
          { name: t("nav.selectBook"), url: canonicalUrl(locale, "books") },
          { name: bookName, url: canonicalUrl(locale, book) },
          {
            name: t("people.title"),
            url: canonicalUrl(locale, `${book}/people`),
          },
        ])}
      />
      <div className="tt-chapter-head max-w-[1320px] mx-auto px-[clamp(18px,4vw,52px)]">
        <nav className="tt-crumb" aria-label="Breadcrumb">
          <Link href="/">{t("nav.home")}</Link>
          <span className="sep">/</span>
          <Link href={`/${book}`}>{bookName}</Link>
          <span className="sep">/</span>
          <span>{t("people.title")}</span>
        </nav>
        <div className="tt-title-row">
          <div>
            <div className="tt-ref">
              {t("people.refKicker")}
              {isGenesis ? ` · ${bookName} 1–12` : ""}
            </div>
            <h1 className="tt-chapter-title">
              {isGenesis
                ? `${t("people.headingPrefix")} ${bookName}`
                : t("people.title")}
            </h1>
          </div>
          <span className="tt-status-pill">
            <span className="dot" aria-hidden="true" />
            {t("people.provisional")}
          </span>
        </div>
        <hr className="tt-seam mt-[26px]" />
      </div>
      <main
        className="max-w-[1320px] mx-auto px-[clamp(18px,4vw,52px)]"
        style={{
          paddingTop: "clamp(36px,6vh,64px)",
          paddingBottom: "clamp(48px,8vh,90px)",
        }}
      >
        <Lead text={isGenesis ? t("people.lead") : t("people.leadGeneric")} />

        {/* The AM lifespan chart is meaningful only for the Genesis (Gen 5)
            line; other books show profiles + sources without a timeline
            (prototype parity — matthew/john people.html have no timeline). */}
        {isGenesis && (
          <PeopleTimeline
            entries={entries}
            book={book}
            kicker={t("people.timelineKicker")}
            captionCreation={t("people.timelineCaption")}
            captionHistorical={t("people.timelineCaptionHistorical")}
            floodLabel={t("people.timelineFlood")}
            takenLabel={t("people.timelineTaken")}
          />
        )}

        <section>
          <p className="tt-kick">
            {t("people.profiles")} · {entries.length} {t("people.figures")}
          </p>
          <div>
            {entries.map((person) => (
              <PersonCard
                key={person.slug}
                person={person}
                labels={cardLabels}
                locale={locale}
                bookLabels={bookLabels}
                open={person.slug === firstPersonSlug}
              />
            ))}
          </div>
        </section>

        {people.genealogies && people.genealogies.length > 0 && (
          <section className="mt-[clamp(48px,7vh,80px)]">
            <p className="tt-kick">{t("people.genealogyTables")}</p>
            {people.genealogies.map((g) => (
              <div key={g.title} className="tt-gen-table">
                <h3>{g.title}</h3>
                {g.caption && <div className="cap">{g.caption}</div>}
                <table className="tt-gtable">
                  <thead>
                    <tr>
                      {g.headers.map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {g.rows.map((row, ri) => (
                      <tr key={`${g.title}-r${ri}`}>
                        {row.map((cell, ci) => (
                          <td
                            key={`${g.title}-r${ri}-c${ci}`}
                            dangerouslySetInnerHTML={{
                              __html: renderInlineSafe(cell),
                            }}
                          />
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {g.note && (
                  <p className="note">
                    <strong>{t("people.note")}.</strong>{" "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: renderInlineSafe(g.note),
                      }}
                    />
                  </p>
                )}
              </div>
            ))}
          </section>
        )}

        {people.sources && (
          <section className="mt-[clamp(40px,6vh,70px)]">
            <details className="tt-details">
              <summary>
                <span>{t("people.sourcesConsulted")}</span>
                <span className="chev" aria-hidden="true">
                  ›
                </span>
              </summary>
              <div
                className="body tt-sources text-text-secondary"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdownSafe(
                    people.sources
                      .replace(/^>\s?/gm, "")
                      .replace(/^[-*]\s+/gm, "• "),
                    "note",
                  ),
                }}
              />
            </details>
          </section>
        )}
      </main>
    </>
  );
}
