import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AVAILABLE_BOOKS } from "@/domain/books/registry";
import type { PersonEntry } from "@/domain/content/types";
import type { Locale } from "@/infrastructure/i18n/config";
import { getAvailableBooks, getPeopleData } from "@/lib/content-loader";
import {
  breadcrumbJsonLd,
  canonicalUrl,
  seoMetadata,
  truncateDescription,
} from "@/lib/seo";
import { Link } from "@/ui/navigation/locale-link";
import {
  GENESIS_GAP_THRESHOLD_YEARS,
  GENESIS_WATERSHEDS,
} from "@/ui/people/genesis-watersheds";
import { PeopleTimeline } from "@/ui/people/people-timeline";
import { PersonCard } from "@/ui/people/person-card";
import { JsonLd } from "@/ui/shared/json-ld";

export async function generateStaticParams() {
  const books = await getAvailableBooks("en");
  return books.map((book) => ({ book }));
}

// Sort key: yearFromCreation > historicalYear > Number.POSITIVE_INFINITY (file order tail).
function sortKey(p: PersonEntry, fileIndex: number): number {
  if (p.yearFromCreation != null) return p.yearFromCreation;
  if (p.historicalYear != null) return p.historicalYear;
  return Number.POSITIVE_INFINITY - 1 / (fileIndex + 1); // stable tail
}

function sortChronological(entries: PersonEntry[]): PersonEntry[] {
  return [...entries]
    .map((p, i) => ({ p, i }))
    .sort((a, b) => sortKey(a.p, a.i) - sortKey(b.p, b.i))
    .map(({ p }) => p);
}

// Phase 1F deterministic period-grouping algorithm (Genesis only).
// Walk the sorted entries in chronological order. After each entry, decide
// whether to insert a divider before the next one:
//   1. Watershed check (highest precedence): if any watershed AM-year falls
//      between this entry's birth and the next entry's birth, insert a
//      labelled divider for the watershed.
//   2. Gap check (only if no watershed inserted): if the gap exceeds
//      GENESIS_GAP_THRESHOLD_YEARS, insert a generic (unlabelled) divider.
type RenderItem =
  | { kind: "person"; person: PersonEntry }
  | { kind: "divider"; key: string; label?: string };

function buildRenderItems(
  book: string,
  sorted: PersonEntry[],
  watershedLabel: (id: string) => string,
): RenderItem[] {
  const out: RenderItem[] = [];
  for (let i = 0; i < sorted.length; i += 1) {
    const curr = sorted[i];
    out.push({ kind: "person", person: curr });
    if (book !== "genesis") continue;
    const next = sorted[i + 1];
    if (!next) continue;
    const currYear = curr.yearFromCreation;
    const nextYear = next.yearFromCreation;
    if (currYear == null || nextYear == null) continue;

    // Watershed check (precedence over gap)
    let watershedHit: { id: string; year: number } | null = null;
    for (const w of GENESIS_WATERSHEDS) {
      if (w.amYear > currYear && w.amYear <= nextYear) {
        watershedHit = { id: w.id, year: w.amYear };
        break;
      }
    }
    if (watershedHit) {
      out.push({
        kind: "divider",
        key: `watershed-${watershedHit.id}-${i}`,
        label: `${watershedLabel(watershedHit.id)} (AM ${watershedHit.year})`,
      });
      continue;
    }

    if (nextYear - currYear > GENESIS_GAP_THRESHOLD_YEARS) {
      out.push({ kind: "divider", key: `gap-${i}` });
    }
  }
  return out;
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

  const labels = {
    meaning: t("people.meaning"),
    lifespan: t("people.lifespan"),
    profession: t("people.profession"),
    hometown: t("people.hometown"),
    father: t("people.father"),
    mother: t("people.mother"),
    siblings: t("people.siblings"),
    spouses: t("people.spouses"),
    children: t("people.children"),
    placesLived: t("people.placesLived"),
    causeOfDeath: t("people.causeOfDeath"),
    ageAtFatherhood: t("people.ageAtFatherhood"),
    socialClass: t("people.socialClass"),
    historicity: t("people.historicity"),
    archaeology: t("people.archaeology"),
    extraBiblical: t("people.extraBiblical"),
    characterArc: t("people.characterArc"),
    booksIn: t("people.booksIn"),
    curiosities: t("people.curiosities"),
    generationsFrom: t("people.generationsFrom"),
    regionsByText: t("people.regionsByText"),
    regionsByTextSafeguard: t("people.regionsByTextSafeguard"),
    inBook: t(`people.inBook.${book}`),
    crossBookSee: t("people.crossBookSee"),
    birthYear: t("people.birthYear"),
    deathYear: t("people.deathYear"),
  };

  // Localized labels for any book a `**See:**` pointer might reference.
  // Add new entries here as new books are authored.
  const bookLabels: Record<string, string> = {
    genesis: t("book.genesis"),
    matthew: t("book.matthew"),
    john: t("book.john"),
  };

  const sorted = sortChronological(people.entries);
  const items = buildRenderItems(book, sorted, (id) =>
    t(`people.watershed.${id}`),
  );
  // Accordion rule: open the first profile, collapse the rest.
  const firstPersonSlug = items.find(
    (i): i is Extract<RenderItem, { kind: "person" }> => i.kind === "person",
  )?.person.slug;

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("site.title"), url: canonicalUrl(locale, "") },
          { name: t("nav.selectBook"), url: canonicalUrl(locale, "books") },
          { name: t(`book.${book}`), url: canonicalUrl(locale, book) },
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
          <Link href={`/${book}`}>{t(`book.${book}`)}</Link>
          <span className="sep">/</span>
          <span>{t("people.title")}</span>
        </nav>
        <div className="tt-title-row">
          <div>
            <div className="tt-ref">
              {t(`book.${book}`)} · {people.entries.length}{" "}
              {t("people.entries")}
            </div>
            <h1 className="tt-chapter-title">{t("people.title")}</h1>
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
        <div className="space-y-8">
          <PeopleTimeline
            entries={sorted}
            title={t("people.timeline")}
            captionCreation={t("people.timelineCaptionCreation")}
            captionHistorical={t("people.timelineCaptionHistorical")}
          />

          <div>
            {items.map((item) =>
              item.kind === "person" ? (
                <PersonCard
                  key={item.person.slug}
                  person={item.person}
                  labels={labels}
                  locale={locale}
                  bookLabels={bookLabels}
                  open={item.person.slug === firstPersonSlug}
                />
              ) : (
                <div
                  key={item.key}
                  className="flex items-center gap-3 py-2 my-2"
                >
                  <span className="h-px flex-1 bg-border" />
                  {item.label ? (
                    <span className="text-xs uppercase tracking-wider text-text-muted font-[family-name:var(--font-mono)]">
                      {item.label}
                    </span>
                  ) : null}
                  <span className="h-px flex-1 bg-border" />
                </div>
              ),
            )}
          </div>
        </div>
      </main>
    </>
  );
}
