import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AVAILABLE_BOOKS } from "@/domain/books/registry";
import type { Locale } from "@/infrastructure/i18n/config";
import {
  getAvailableBooks,
  getAvailableChapters,
  getIntroductionData,
  getPeopleData,
} from "@/lib/content-loader";
import {
  bookJsonLd,
  breadcrumbJsonLd,
  canonicalUrl,
  seoMetadata,
  truncateDescription,
} from "@/lib/seo";
import { Link } from "@/ui/navigation/locale-link";
import { JsonLd } from "@/ui/shared/json-ld";
import { renderInlineSafe } from "@/ui/shared/render-markdown-safe";

const WRAP = "max-w-[1320px] mx-auto px-[clamp(18px,4vw,52px)]";
const HEBREW_BIBLE = new Set(["genesis"]);

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
  const title = t(`book.${book}`);
  const intro = await getIntroductionData(locale as Locale, book);
  const what = intro?.card?.[0]?.value;
  return seoMetadata({
    locale,
    path: book,
    title,
    description: truncateDescription(
      what ? `${title} — ${what}` : `${title} — ${t("site.subtitle")}`,
    ),
  });
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
  const bookName = t(`book.${book}`);
  const chapters = await getAvailableChapters(locale, book);
  const intro = await getIntroductionData(locale as Locale, book);
  const card = intro?.card ?? [];
  const people = await getPeopleData(locale as Locale, book);
  const corpus = HEBREW_BIBLE.has(book)
    ? t("books.corpusHebrew")
    : t("books.corpusGreek");

  const entries = [
    {
      href: `/${book}/introduction`,
      title: t("nav.bookIntroduction"),
      desc: t("nav.exploreIntroDesc"),
      show: intro != null,
    },
    {
      href: `/${book}/people`,
      title: t("people.title"),
      desc: t("nav.explorePeopleDesc"),
      show: !!people && people.entries.length > 0,
    },
    {
      href: `/${book}/background`,
      title: t("nav.bookContext"),
      desc: t("nav.exploreBackgroundDesc"),
      show: true,
    },
  ].filter((e) => e.show);

  return (
    <>
      <JsonLd
        data={[
          bookJsonLd({ locale, book, name: bookName }),
          breadcrumbJsonLd([
            { name: t("site.title"), url: canonicalUrl(locale, "") },
            { name: t("nav.books"), url: canonicalUrl(locale, "books") },
            { name: bookName, url: canonicalUrl(locale, book) },
          ]),
        ]}
      />

      <div className={`tt-chapter-head ${WRAP}`}>
        <nav className="tt-crumb" aria-label="Breadcrumb">
          <Link href="/">{t("nav.home")}</Link>
          <span className="sep">/</span>
          <Link href="/books">{t("nav.books")}</Link>
          <span className="sep">/</span>
          <span>{bookName}</span>
        </nav>
        <div className="tt-title-row">
          <div>
            <div className="tt-ref">{corpus}</div>
            <h1
              className="tt-chapter-title"
              style={{ fontSize: "clamp(2.8rem,8vw,6rem)" }}
            >
              {bookName}
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
        className={WRAP}
        style={{
          paddingTop: "clamp(36px,6vh,64px)",
          paddingBottom: "clamp(48px,8vh,90px)",
        }}
      >
        {/* at a glance */}
        {card.length > 0 && (
          <section className="mb-[clamp(48px,8vh,90px)]">
            <p className="tt-kick">{t("nav.atAGlance")}</p>
            <dl className="tt-glance">
              {card.map((f) => (
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
            <div className="mt-[30px] flex flex-wrap gap-3.5">
              {chapters.length > 0 && (
                <Link
                  href={`/${book}/chapter/${chapters[0]}`}
                  className="tt-btn tt-btn-deep"
                >
                  {t("nav.startReading")} <span className="arr">→</span>
                </Link>
              )}
              {intro != null && (
                <Link
                  href={`/${book}/introduction`}
                  className="tt-btn tt-btn-ghost"
                >
                  {t("nav.readFullIntroduction")}
                </Link>
              )}
            </div>
          </section>
        )}

        {/* chapters */}
        {chapters.length > 0 && (
          <section className="mb-[clamp(48px,8vh,90px)]">
            <p className="tt-kick">{t("nav.chapters")}</p>
            <div className="tt-chgrid">
              {chapters.map((ch) => (
                <Link
                  key={ch}
                  href={`/${book}/chapter/${ch}`}
                  className="tt-ch"
                >
                  <span className="cn">{ch}</span>
                  <span className="cl">{t("nav.doorRead")} →</span>
                </Link>
              ))}
            </div>
            <p className="mt-4 font-[family-name:var(--font-mono)] text-text-muted text-xs">
              {t("books.chaptersAvailable", { n: chapters.length })}
            </p>
          </section>
        )}

        {/* entry points */}
        {entries.length > 0 && (
          <section>
            <p className="tt-kick">{t("nav.explore", { book: bookName })}</p>
            <div className="tt-entrygrid">
              {entries.map((e) => (
                <Link key={e.href} href={e.href} className="tt-entry">
                  <div className="et">{e.title}</div>
                  <p>{e.desc}</p>
                  <span className="arr">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
