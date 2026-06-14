import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  breadcrumbJsonLd,
  canonicalUrl,
  seoMetadata,
  truncateDescription,
} from "@/lib/seo";
import { Link } from "@/ui/navigation/locale-link";
import { JsonLd } from "@/ui/shared/json-ld";

const RULES_WITH_EXAMPLES = [
  { ruleKey: "rule1", ruleNum: 1 },
  { ruleKey: "rule2", ruleNum: 2 },
  { ruleKey: "rule3", ruleNum: 3 },
  { ruleKey: "rule11", ruleNum: 11 },
  { ruleKey: "rule25", ruleNum: 25 },
] as const;

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
    description: truncateDescription(t("landing.rulesPageSubtitle")),
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

      {/* Header */}
      <section className="tt-section">
        <div className="max-w-[1320px] mx-auto px-6">
          <p className="tt-kick reveal">{t("landing.rulesPageSubtitle")}</p>
          <h1 className="tt-display reveal mt-3 max-w-[14ch]" data-d="1">
            {t("landing.rulesPageTitle")}
          </h1>
          <p className="tt-lead reveal mt-6 max-w-[48ch]" data-d="2">
            {t("landing.rulesIntro")}
          </p>
        </div>
      </section>

      {/* Prime Directive */}
      <section className="tt-section bg-cream2">
        <div className="max-w-[880px] mx-auto px-6">
          <p className="tt-kick reveal">{t("landing.rulesPrime")}</p>
          <h2 className="tt-h1 reveal max-w-[18ch] mb-4" data-d="1">
            {t("landing.rulesPrimeDesc")}
          </h2>
          <ol className="space-y-5 mt-8">
            {([1, 2, 3, 4] as const).map((n) => (
              <li key={n} className="flex gap-4 items-start reveal">
                <span className="font-[family-name:var(--font-mono)] text-ochre text-sm mt-1.5">
                  0{n}
                </span>
                <p className="font-[family-name:var(--font-reading)] text-lg leading-relaxed text-text-primary">
                  {t(`landing.rulesPrime${n}`)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Rules in action */}
      <section className="tt-section">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="tt-grid-head">
            <div className="tt-bignum reveal">/</div>
            <div>
              <p className="tt-kick reveal">
                {t("landing.rulesExamplesTitle")}
              </p>
              <h2 className="tt-h1 reveal" data-d="1">
                {t("landing.rulesExamplesTitle")}
              </h2>
            </div>
          </div>
          <div className="space-y-8 mt-12 max-w-[820px]">
            {RULES_WITH_EXAMPLES.map(({ ruleKey, ruleNum }) => (
              <div
                key={ruleKey}
                className="border-l-3 border-accent pl-5 space-y-2 reveal"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-[family-name:var(--font-mono)] text-xs font-bold text-text-muted uppercase tracking-wider">
                    {t("landing.rulePrefix", { n: ruleNum })}
                  </span>
                  <h3 className="text-sm font-semibold text-text-primary">
                    {t(`landing.${ruleKey}name`)}
                  </h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t(`landing.${ruleKey}short`)}
                </p>
                <div className="mt-2 px-3 py-2 bg-bg-muted rounded text-sm font-[family-name:var(--font-mono)] text-text-primary leading-relaxed">
                  {t(`landing.${ruleKey}example`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full 29 rules — dark */}
      <section className="tt-section bg-dark">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="tt-grid-head">
            <div
              className="tt-bignum reveal"
              style={{ color: "var(--color-petrol)" }}
            >
              29
            </div>
            <div>
              <p className="tt-kick reveal text-on-dark-mute">
                {t("landing.rulesAllTitle")}
              </p>
              <h2 className="tt-h1 reveal text-on-dark" data-d="1">
                {t("landing.rulesAllTitle")}
              </h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-10 mt-12">
            {ALL_RULE_NUMS.map((num) => (
              <div
                key={num}
                className="flex items-start gap-3 py-3 border-b border-on-dark-soft/15"
              >
                <span className="font-[family-name:var(--font-mono)] text-xs text-ochre min-w-[2rem] text-right mt-0.5">
                  {num}
                </span>
                <div>
                  <p className="text-sm font-medium text-on-dark">
                    {t(`landing.rule${num}name`)}
                  </p>
                  <p className="text-xs text-on-dark-soft mt-0.5">
                    {t(`landing.rule${num}short`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-14 reveal">
            <Link href="/books" className="tt-btn tt-btn-pri">
              {t("landing.cta")} <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const ALL_RULE_NUMS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29,
] as const;
