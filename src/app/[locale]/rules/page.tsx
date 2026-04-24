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
                <span className="text-accent font-bold text-sm mt-0.5">{n}.</span>
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
              <div key={ruleKey} className="border-l-3 border-accent pl-5 space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                    Rule {ruleNum}
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
            All 29 rules
          </h2>
          <div className="grid gap-3">
            {ALL_RULES.map((rule) => (
              <div
                key={rule.num}
                className="flex items-start gap-3 py-2 border-b border-border-muted last:border-0"
              >
                <span className="text-xs font-bold text-text-muted min-w-[2rem] text-right mt-0.5">
                  {rule.num}
                </span>
                <div>
                  <p className="text-sm font-medium text-text-primary">{rule.name}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{rule.desc}</p>
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

const ALL_RULES = [
  { num: 1, name: "Controlled Lexical Consistency", desc: "Same Hebrew word → same base translation by default" },
  { num: 2, name: "Preserve Ambiguity", desc: "If Hebrew supports 2+ meanings and context doesn't force one, preserve both" },
  { num: 3, name: "Avoid Imported Theology", desc: "Don't sneak in later religious concepts not justified by Hebrew context" },
  { num: 4, name: "Transliterate Strategic Terms", desc: "Keep Hebrew when translation imports false connotations" },
  { num: 5, name: "Respect Hebrew Grammar", desc: "Preserve grammatical features when readable" },
  { num: 6, name: "Preserve Poetic Doubling & Repetition", desc: "Hebrew doubles roots for artistic effect — keep it" },
  { num: 7, name: "Preserve Parallel Structure", desc: "Lock formula patterns; don't vary for stylistic reasons" },
  { num: 8, name: "Reflect Verb Nuance", desc: "Hebrew verbs ≠ English tenses; preserve meaningful distinctions" },
  { num: 9, name: "Handle Converting VAV", desc: "The vav-consecutive changes future to past in narrative" },
  { num: 10, name: "Neutral Formal Register", desc: "Slightly elevated, clear, serious — avoid both extremes" },
  { num: 11, name: "Signal All Additions", desc: "Mark words not in Hebrew; distinguish types of additions" },
  { num: 12, name: "Avoid False Precision", desc: "Don't invent details Hebrew leaves vague" },
  { num: 13, name: "Uncertainty Levels", desc: "Every note about difficult terms indicates confidence level" },
  { num: 14, name: "Annotate Wordplay", desc: "Mark Hebrew puns, paronomasia, and sound-play" },
  { num: 15, name: "Three-Output Rule", desc: "Each verse produces main translation, gloss, and notes" },
  { num: 16, name: "Cross-Language Alignment", desc: "Trilingual project requires consistency verification" },
  { num: 17, name: "Definite Article Consistency", desc: "Translate Hebrew article consistently; absence matters" },
  { num: 18, name: "Numbers & Ordinals", desc: "Preserve cardinal vs ordinal distinction" },
  { num: 19, name: "Priority Order When Rules Conflict", desc: "Meaning > ambiguity > structure > consistency > readability" },
  { num: 20, name: "Capitalization", desc: "Don't capitalize interpretive terms beyond what Hebrew justifies" },
  { num: 21, name: "Don't Smuggle Commentary", desc: "Translation ≠ commentary in disguise" },
  { num: 22, name: "Text-Critical Restraint", desc: "Translate base text; note variants, don't silently adopt them" },
  { num: 23, name: "Genre Sensitivity", desc: "Genesis 1 patterns should not mechanically colonize later chapters" },
  { num: 24, name: "Edition Identity", desc: "Every rendering declares its edition type and applies consistently" },
  { num: 25, name: "Divine Name Policy", desc: "Tetragrammaton rendered consonantally; never silently substituted" },
  { num: 26, name: "Textual Tradition", desc: "Declare which layer of the Masoretic Text is being rendered" },
  { num: 27, name: "Inclusive & Gendered Language", desc: "Distinguish grammatical from referential from interpretive gender" },
  { num: 28, name: "Review & Sign-off Workflow", desc: "No verse ships without documented review" },
  { num: 29, name: "Contextual Study Material", desc: "Enrichment in companion files only; labeled by type and certainty" },
];
