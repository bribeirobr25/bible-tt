import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  breadcrumbJsonLd,
  canonicalUrl,
  seoMetadata,
  truncateDescription,
} from "@/lib/seo";
import { MarketingHero } from "@/ui/marketing/marketing-hero";
import { Link } from "@/ui/navigation/locale-link";
import { JsonLd } from "@/ui/shared/json-ld";

// The "Start here" reading plan. `href` marks a step whose content is live now
// (renders an "Available now →" badge); the rest are "Coming soon".
const STEPS: {
  key: string;
  href?: string;
  interleaveAfter?: boolean;
  final?: boolean;
}[] = [
  { key: "step1" }, // Psalms
  { key: "step2" }, // Proverbs
  { key: "step3", interleaveAfter: true }, // Ecclesiastes
  { key: "step4", href: "/books" }, // Gospels
  { key: "step5" }, // rest of NT
  { key: "step6" }, // Revelation
  { key: "step7", href: "/genesis", final: true }, // Genesis & Torah
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

  // The WHY copy is one string: a lead sentence + the reading-path description.
  const why = t("start.why");
  const splitAt = why.indexOf(". ");
  const whyHeadline = splitAt > 0 ? why.slice(0, splitAt + 1) : why;
  const whyBody = splitAt > 0 ? why.slice(splitAt + 2) : "";

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("site.title"), url: canonicalUrl(locale, "") },
          { name: t("start.title"), url: canonicalUrl(locale, "start") },
        ])}
      />

      <MarketingHero
        kicker={t("start.heroKicker")}
        title={`${t("start.title")}.`}
        tagline={t("start.lead")}
        titleMaxCh={12}
        taglineMaxCh={40}
      />

      {/* WHY THIS ORDER */}
      <section className="tt-section">
        <div className="max-w-[1320px] mx-auto px-[clamp(18px,4vw,52px)]">
          <div className="tt-grid-head">
            <div className="tt-bignum reveal">/</div>
            <div>
              <p className="tt-kick reveal">{t("start.whyTitle")}</p>
              <h2 className="tt-h1 reveal max-w-[20ch]" data-d="1">
                {whyHeadline}
              </h2>
            </div>
          </div>
          {whyBody && (
            <p
              className="tt-lead reveal ml-auto max-w-[62ch] mt-[30px]"
              data-d="1"
            >
              {whyBody}
            </p>
          )}
        </div>
      </section>

      {/* THE PATH — dark roadmap */}
      <section className="tt-section bg-dark">
        <div className="max-w-[1320px] mx-auto px-[clamp(18px,4vw,52px)]">
          <p className="tt-kick reveal">{t("start.pathKick")}</p>
          <div className="tt-roadmap">
            {STEPS.map((step, i) => (
              <div key={step.key}>
                <div className={`tt-step reveal${step.final ? " final" : ""}`}>
                  <div className="sn">{String(i + 1).padStart(2, "0")}</div>
                  <div className="sc">
                    <div className="st">{t(`start.${step.key}title`)}</div>
                    <p>{t(`start.${step.key}desc`)}</p>
                    {step.href ? (
                      <Link
                        href={step.href}
                        className="tt-badge tt-badge-now gap-1.5"
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
                </div>
                {step.interleaveAfter && (
                  <p className="tt-interleave reveal">
                    ↳ {t("start.interleaveNote")}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-12 reveal">
            <Link href="/genesis/chapter/1" className="tt-btn tt-btn-pri">
              {t("start.beginCta")} <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
