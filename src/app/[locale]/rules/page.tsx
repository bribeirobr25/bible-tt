import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  breadcrumbJsonLd,
  canonicalUrl,
  seoMetadata,
  truncateDescription,
} from "@/lib/seo";
import { MarketingHero } from "@/ui/marketing/marketing-hero";
import { JsonLd } from "@/ui/shared/json-ld";
import { renderInlineSafe } from "@/ui/shared/render-markdown-safe";

const PRIME = ["rulesPrime1", "rulesPrime2", "rulesPrime3", "rulesPrime4"];
const ROMAN = ["i", "ii", "iii", "iv"];
const EXAMPLES = [1, 2, 3, 11, 25] as const;
const ALL_RULE_NUMS = Array.from({ length: 29 }, (_, i) => i + 1);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return seoMetadata({
    locale,
    path: "rules",
    title: t("landing.rulesPageTitle"),
    description: truncateDescription(t("landing.rulesIntro")),
  });
}

export default async function RulesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t("site.title"), url: canonicalUrl(locale, "") },
          {
            name: t("landing.rulesPageTitle"),
            url: canonicalUrl(locale, "rules"),
          },
        ])}
      />

      <MarketingHero
        kicker={t("landing.rulesHeroKicker")}
        title={`${t("landing.rulesPageTitle")}.`}
        tagline={t("landing.rulesIntro")}
        titleMaxCh={14}
        taglineMaxCh={42}
      />

      {/* PRIME DIRECTIVE */}
      <section className="tt-section bg-cream2">
        <div className="max-w-[1320px] mx-auto px-[clamp(18px,4vw,52px)]">
          <p className="tt-kick reveal">{t("landing.rulesPrime")}</p>
          <h2 className="tt-h1 reveal max-w-[18ch] mb-[14px]" data-d="1">
            {t("landing.rulesPrimeDesc")}
          </h2>
          <div className="tt-prime">
            {PRIME.map((k, i) => (
              <div
                key={k}
                className="tt-pd reveal"
                data-d={i % 2 === 1 ? "1" : undefined}
              >
                <span className="pn">{ROMAN[i]}</span>
                <p
                  dangerouslySetInnerHTML={{
                    __html: renderInlineSafe(t(`landing.${k}`)),
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RULES IN ACTION */}
      <section className="tt-section">
        <div className="max-w-[1320px] mx-auto px-[clamp(18px,4vw,52px)]">
          <div className="tt-grid-head">
            <div className="tt-bignum reveal">/</div>
            <div>
              <p className="tt-kick reveal">
                {t("landing.rulesExamplesTitle")}
              </p>
              <h2 className="tt-h1 reveal" data-d="1">
                {t("landing.rulesExamplesH2")}
              </h2>
            </div>
          </div>
          <div className="tt-examples">
            {EXAMPLES.map((n, i) => (
              <div
                key={n}
                className="tt-ex reveal"
                data-d={i % 2 === 1 ? "1" : undefined}
              >
                <div className="exn">
                  {t("landing.rulePrefix", { n })} · {t(`landing.rule${n}name`)}
                </div>
                <p
                  dangerouslySetInnerHTML={{
                    __html: renderInlineSafe(t(`landing.rule${n}example`)),
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALL 29 — dark */}
      <section className="tt-section bg-dark">
        <div className="max-w-[1320px] mx-auto px-[clamp(18px,4vw,52px)]">
          <div className="tt-grid-head">
            <div
              className="tt-bignum reveal"
              style={{ color: "var(--color-petrol)" }}
            >
              29
            </div>
            <div>
              <p className="tt-kick reveal">{t("landing.rulesAllKick")}</p>
              <h2 className="tt-h1 reveal text-on-dark" data-d="1">
                {t("landing.rulesAllTitle")}
              </h2>
            </div>
          </div>
          <div className="tt-rules-grid">
            {ALL_RULE_NUMS.map((n) => (
              <div key={n} className="tt-rule reveal">
                <div className="rnum">{String(n).padStart(2, "0")}</div>
                <div>
                  <div className="rname">{t(`landing.rule${n}name`)}</div>
                  <div className="rshort">{t(`landing.rule${n}short`)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
