import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/ui/navigation/locale-link";

const RULES_WITH_EXAMPLES = [
  { ruleKey: "rule1", ruleNum: 1 },
  { ruleKey: "rule2", ruleNum: 2 },
  { ruleKey: "rule3", ruleNum: 3 },
  { ruleKey: "rule11", ruleNum: 11 },
  { ruleKey: "rule25", ruleNum: 25 },
] as const;

export default async function RulesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main className="min-h-screen px-6 py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-16 text-center">
          <h1 className="font-[family-name:var(--font-reading)] text-3xl md:text-5xl font-light tracking-tight">
            {t("landing.rulesPageTitle")}
          </h1>
          <p className="mt-4 text-text-secondary text-lg">
            {t("landing.rulesPageSubtitle")}
          </p>
          <p className="mt-6 text-text-primary text-base leading-relaxed max-w-lg mx-auto">
            {t("landing.rulesIntro")}
          </p>
        </header>

        {/* Prime Directive */}
        <section className="mb-16 p-6 md:p-8 border border-border rounded-lg bg-bg-surface">
          <h2 className="font-[family-name:var(--font-reading)] text-xl md:text-2xl font-light mb-2">
            {t("landing.rulesPrime")}
          </h2>
          <p className="text-sm text-text-muted mb-6">
            {t("landing.rulesPrimeDesc")}
          </p>
          <ol className="space-y-4">
            {([1, 2, 3, 4] as const).map((n) => (
              <li key={n} className="flex gap-3 items-start">
                <span className="text-accent font-bold text-sm mt-0.5">
                  {n}.
                </span>
                <p className="font-[family-name:var(--font-reading)] text-base leading-relaxed text-text-primary">
                  {t(`landing.rulesPrime${n}`)}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Rules in action */}
        <section className="mb-16">
          <h2 className="font-[family-name:var(--font-reading)] text-xl md:text-2xl font-light mb-10 text-center">
            {t("landing.rulesExamplesTitle")}
          </h2>
          <div className="space-y-8">
            {RULES_WITH_EXAMPLES.map(({ ruleKey, ruleNum }) => (
              <div
                key={ruleKey}
                className="border-l-3 border-accent pl-5 space-y-2"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
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
        </section>

        {/* Full 29 rules list */}
        <section className="mb-16">
          <h2 className="font-[family-name:var(--font-reading)] text-xl md:text-2xl font-light mb-6 text-center">
            {t("landing.rulesAllTitle")}
          </h2>
          <div className="grid gap-3">
            {ALL_RULE_NUMS.map((num) => (
              <div
                key={num}
                className="flex items-start gap-3 py-2 border-b border-border-muted last:border-0"
              >
                <span className="text-xs font-bold text-text-muted min-w-[2rem] text-right mt-0.5">
                  {num}
                </span>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {t(`landing.rule${num}name`)}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {t(`landing.rule${num}short`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-10 border-t border-border-muted">
          <Link
            href="/books"
            className="inline-block px-10 py-4 rounded-md bg-text-primary text-bg-paper font-medium hover:bg-accent transition-colors duration-200"
          >
            {t("landing.cta")}
          </Link>
        </section>
      </div>
    </main>
  );
}

const ALL_RULE_NUMS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29,
] as const;
