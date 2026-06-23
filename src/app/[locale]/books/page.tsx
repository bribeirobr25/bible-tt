import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  getAvailableBooks,
  getAvailableChapters,
  getIntroductionData,
} from "@/lib/content-loader";
import type { Locale } from "@/lib/i18n";
import {
  breadcrumbJsonLd,
  canonicalUrl,
  seoMetadata,
  truncateDescription,
} from "@/lib/seo";
import { MarketingHero } from "@/ui/marketing/marketing-hero";
import { Link } from "@/ui/navigation/locale-link";
import { JsonLd } from "@/ui/shared/json-ld";
import { renderInlineSafe } from "@/ui/shared/render-markdown-safe";

// Display order matches the prototype (Hebrew Bible first, then the gospels).
const BOOK_ORDER = ["genesis", "matthew", "mark", "luke", "john", "acts"];
const HEBREW_BIBLE = new Set(["genesis"]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return seoMetadata({
    locale,
    path: "books",
    title: t("nav.books"),
    description: truncateDescription(t("books.heroTagline")),
  });
}

export default async function BooksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const available = new Set(await getAvailableBooks(locale));
  const slugs = BOOK_ORDER.filter((b) => available.has(b));
  const books = await Promise.all(
    slugs.map(async (slug) => {
      const intro = await getIntroductionData(locale as Locale, slug);
      const chapters = await getAvailableChapters(locale, slug);
      const card = intro?.card ?? [];
      // Prototype glance = What · When · Who · Why (the CARD's 4th field,
      // "To whom", is omitted).
      const glance = [card[0], card[1], card[2], card[4]].filter(Boolean);
      return {
        slug,
        glance,
        chapters: chapters.length,
        corpus: HEBREW_BIBLE.has(slug)
          ? t("books.corpusHebrew")
          : t("books.corpusGreek"),
      };
    }),
  );

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("site.title"), url: canonicalUrl(locale, "") },
          { name: t("nav.books"), url: canonicalUrl(locale, "books") },
        ])}
      />

      <MarketingHero
        kicker={t("books.heroKicker")}
        title={t("books.heroTitle")}
        tagline={t("books.heroTagline")}
        titleMaxCh={14}
        taglineMaxCh={42}
        minH="60svh"
      />

      <section className="tt-section">
        <div className="max-w-[1320px] mx-auto px-[clamp(18px,4vw,52px)]">
          <p className="tt-kick reveal">{t("books.sectionKick")}</p>

          {books.map((b, i) => (
            <Link
              key={b.slug}
              href={`/${b.slug}`}
              className="tt-bookcard reveal"
              data-d={i ? String(i) : undefined}
            >
              <div>
                <div className="bc-name">{t(`book.${b.slug}`)}</div>
                <div className="bc-meta">
                  {b.corpus} · {t("books.chaptersAvailable", { n: b.chapters })}
                </div>
                <span className="tt-badge tt-badge-now gap-1.5">
                  {t("books.readNow")} →
                </span>
              </div>
              <dl className="bc-glance">
                {b.glance.map((f) => (
                  <div key={f.label}>
                    <dt>{f.label}</dt>
                    <dd
                      dangerouslySetInnerHTML={{
                        __html: renderInlineSafe(f.value),
                      }}
                    />
                  </div>
                ))}
              </dl>
            </Link>
          ))}

          <p
            className="reveal mt-9 font-[family-name:var(--font-mono)] text-text-muted text-xs tracking-[0.06em] leading-relaxed [&_em]:text-accent [&_em]:not-italic [&_em]:font-medium"
            dangerouslySetInnerHTML={{
              __html: renderInlineSafe(t("books.provisional")),
            }}
          />
        </div>
      </section>
    </main>
  );
}
