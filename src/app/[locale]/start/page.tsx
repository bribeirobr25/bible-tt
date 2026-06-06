import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AVAILABLE_BOOKS } from "@/domain/books/registry";
import {
  breadcrumbJsonLd,
  canonicalUrl,
  seoMetadata,
  truncateDescription,
} from "@/lib/seo";
import { Link } from "@/ui/navigation/locale-link";
import { JsonLd } from "@/ui/shared/json-ld";

// The "Start here" plan. `books` lists the slugs each step would link to; only
// those present in AVAILABLE_BOOKS render as live links (rest = "coming soon").
const STEPS: { key: string; books: string[]; interleaveAfter?: boolean }[] = [
  { key: "step1", books: [] }, // Psalms
  { key: "step2", books: [] }, // Proverbs
  { key: "step3", books: [], interleaveAfter: true }, // Ecclesiastes
  { key: "step4", books: ["matthew", "john"] }, // Gospels
  { key: "step5", books: [] }, // rest of NT
  { key: "step6", books: [] }, // Revelation
  { key: "step7", books: ["genesis"] }, // Genesis & Torah
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return seoMetadata({
    locale,
    path: "start",
    title: t("start.title"),
    description: truncateDescription(t("start.lead")),
  });
}

export default async function StartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const available = new Set<string>(AVAILABLE_BOOKS);

  return (
    <main className="min-h-screen px-6 py-16 md:py-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("site.title"), url: canonicalUrl(locale, "") },
          { name: t("start.title"), url: canonicalUrl(locale, "start") },
        ])}
      />
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="font-[family-name:var(--font-reading)] text-3xl md:text-5xl font-light tracking-tight">
            {t("start.title")}
          </h1>
          <p className="mt-4 text-text-secondary text-lg leading-relaxed">
            {t("start.lead")}
          </p>
        </header>

        <section className="mb-14 p-6 md:p-8 border border-border rounded-lg bg-bg-surface">
          <h2 className="font-[family-name:var(--font-reading)] text-xl md:text-2xl font-light mb-3">
            {t("start.whyTitle")}
          </h2>
          <p className="text-text-primary text-base leading-relaxed">
            {t("start.why")}
          </p>
        </section>

        <ol className="space-y-4">
          {STEPS.map((step, i) => {
            const liveBooks = step.books.filter((b) => available.has(b));
            return (
              <li key={step.key}>
                <div className="flex gap-4 p-5 border border-border rounded-lg">
                  <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-accent tabular-nums shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <h3 className="font-[family-name:var(--font-reading)] text-lg font-medium text-text-primary">
                        {t(`start.${step.key}title`)}
                      </h3>
                      {liveBooks.length === 0 && (
                        <span className="text-xs uppercase tracking-wider text-text-muted font-[family-name:var(--font-ui)] px-2 py-0.5 rounded bg-bg-muted">
                          {t("start.comingSoon")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                      {t(`start.${step.key}desc`)}
                    </p>
                    {liveBooks.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {liveBooks.map((book) => (
                          <Link
                            key={book}
                            href={`/${book}`}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
                          >
                            {t(`book.${book}`)}
                            <ArrowRight size={14} strokeWidth={1.5} />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {step.interleaveAfter && (
                  <p className="text-xs text-text-muted italic mt-3 mb-1 pl-9">
                    {t("start.interleaveNote")}
                  </p>
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-14 text-center">
          <Link
            href="/books"
            className="min-h-12 inline-flex items-center justify-center gap-2 px-10 py-4 rounded-md bg-accent text-bg-paper font-medium hover:bg-accent-hover active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {t("landing.cta")}
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </main>
  );
}
