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
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("site.title"), url: canonicalUrl(locale, "") },
          { name: t("start.title"), url: canonicalUrl(locale, "start") },
        ])}
      />

      {/* Header */}
      <section className="tt-section">
        <div className="max-w-[1320px] mx-auto px-6">
          <h1 className="tt-display reveal max-w-[12ch]">{t("start.title")}</h1>
          <p className="tt-lead reveal mt-6 max-w-[56ch]" data-d="1">
            {t("start.lead")}
          </p>
        </div>
      </section>

      {/* Why this order */}
      <section className="tt-section bg-cream2">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="tt-grid-head">
            <div className="tt-bignum reveal">/</div>
            <div>
              <p className="tt-kick reveal">{t("start.whyTitle")}</p>
              <h2 className="tt-h1 reveal max-w-[20ch]" data-d="1">
                {t("start.why")}
              </h2>
              <p className="tt-lead reveal mt-5 max-w-[62ch]" data-d="2">
                {t("start.interleaveNote")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The path — dark roadmap */}
      <section className="tt-section bg-dark">
        <div className="max-w-[880px] mx-auto px-6">
          <ol>
            {STEPS.map((step, i) => {
              const liveBooks = step.books.filter((b) => available.has(b));
              const live = liveBooks[0];
              return (
                <li key={step.key} className="tt-step reveal">
                  <div className="sn">{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <div className="st">{t(`start.${step.key}title`)}</div>
                    <p>{t(`start.${step.key}desc`)}</p>
                    {live ? (
                      <Link
                        href={`/${live}`}
                        className="tt-badge tt-badge-now inline-flex items-center gap-1.5"
                      >
                        {t("start.availableNow")}
                        <ArrowRight size={13} strokeWidth={1.5} />
                      </Link>
                    ) : (
                      <span className="tt-badge tt-badge-soon">
                        {t("start.comingSoon")}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="mt-12 reveal">
            <Link href="/books" className="tt-btn tt-btn-pri">
              {t("landing.cta")} <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
