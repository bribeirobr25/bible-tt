import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { PersonEntry } from "@/domain/content/types";
import type { Locale } from "@/infrastructure/i18n/config";
import { getAvailableBooks, getPeopleData } from "@/lib/content-loader";
import { Link } from "@/ui/navigation/locale-link";
import {
  GENESIS_GAP_THRESHOLD_YEARS,
  GENESIS_WATERSHEDS,
} from "@/ui/people/genesis-watersheds";
import { PeopleTimeline } from "@/ui/people/people-timeline";
import { PersonCard } from "@/ui/people/person-card";

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
  };

  const sorted = sortChronological(people.entries);
  const items = buildRenderItems(book, sorted, (id) =>
    t(`people.watershed.${id}`),
  );

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12">
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
            {t("people.title")}
          </h1>
          <p className="text-sm text-text-muted mt-2">
            {t(`book.${book}`)} — {people.entries.length} {t("people.entries")}
          </p>
        </div>

        <PeopleTimeline
          entries={sorted}
          title={t("people.timeline")}
          captionCreation={t("people.timelineCaptionCreation")}
          captionHistorical={t("people.timelineCaptionHistorical")}
        />

        <div className="space-y-2">
          {items.map((item) =>
            item.kind === "person" ? (
              <PersonCard
                key={item.person.slug}
                person={item.person}
                labels={labels}
                locale={locale}
              />
            ) : (
              <div key={item.key} className="flex items-center gap-3 py-2 my-2">
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
  );
}
