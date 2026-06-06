import { BookOpen, Layers, NotebookPen } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { seoMetadata, truncateDescription, websiteJsonLd } from "@/lib/seo";
import { Link } from "@/ui/navigation/locale-link";
import { JsonLd } from "@/ui/shared/json-ld";
import { renderMarkdownSafe } from "@/ui/shared/render-markdown-safe";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return seoMetadata({
    locale,
    path: "",
    title: t("site.title"),
    description: truncateDescription(
      `${t("landing.heroHeadline")} ${t("landing.heroSub")}`,
    ),
    absolute: true,
  });
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main className="min-h-screen">
      <JsonLd data={websiteJsonLd(locale)} />
      {/* Hero */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-text-muted text-sm uppercase tracking-[0.2em] mb-6 font-[family-name:var(--font-ui)]">
          {t("site.title")}
        </p>
        <h1 className="font-[family-name:var(--font-reading)] text-4xl md:text-6xl font-light tracking-tight text-text-primary max-w-3xl leading-[1.15]">
          {t("landing.heroHeadline")}
        </h1>
        <p className="mt-6 text-text-secondary text-lg md:text-xl italic font-[family-name:var(--font-reading)] max-w-2xl">
          {t("landing.heroSub")}
        </p>
        <p className="mt-8 text-text-primary text-base md:text-lg max-w-xl leading-relaxed">
          {t("landing.heroSupport")}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/books"
            className="min-h-12 inline-flex items-center justify-center px-8 py-3 rounded-md bg-accent text-bg-paper font-medium text-sm hover:bg-accent-hover active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {t("landing.cta")}
          </Link>
          <Link
            href="/start"
            className="min-h-12 inline-flex items-center justify-center px-8 py-3 rounded-md border border-border text-text-secondary font-medium text-sm hover:border-accent hover:text-accent active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {t("landing.ctaStartHere")}
          </Link>
        </div>
        <Link
          href="/rules"
          className="mt-6 text-sm text-text-muted hover:text-accent underline underline-offset-4 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
        >
          {t("landing.ctaRules")}
        </Link>
      </section>

      {/* The Difference */}
      <section className="px-6 py-20 border-t border-border-muted">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-[family-name:var(--font-reading)] text-2xl md:text-3xl font-light text-center mb-3">
            {t("landing.differenceTitle")}
          </h2>
          <p className="text-text-muted text-center text-sm mb-12">
            {t("landing.differenceDesc")}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-text-muted font-[family-name:var(--font-ui)]">
                {t("landing.conventional")}
              </p>
              <blockquote className="font-[family-name:var(--font-reading)] text-lg leading-[1.8] text-text-secondary border-l-3 border-border-muted pl-5">
                {t("landing.conventionalVerse")}
              </blockquote>
            </div>

            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-accent font-[family-name:var(--font-ui)]">
                {t("landing.transparent")}
              </p>
              <blockquote
                className="font-[family-name:var(--font-reading)] text-lg leading-[1.8] text-text-primary border-l-3 border-accent pl-5 [&_em]:text-text-secondary"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdownSafe(
                    t("landing.transparentVerse"),
                    "prose",
                  ),
                }}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mt-12">
            {(["diff1", "diff2", "diff3", "diff4"] as const).map((key) => (
              <div key={key} className="flex gap-3">
                <div className="w-1 bg-accent rounded-full shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {t(`landing.${key}title`)}
                  </p>
                  <p className="text-sm text-text-secondary mt-0.5 leading-relaxed">
                    {t(`landing.${key}`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 border-t border-border-muted bg-bg-surface">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-reading)] text-2xl md:text-3xl font-light mb-12">
            {t("landing.howTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {(
              [
                { icon: BookOpen, mode: "doorRead", desc: "howReading" },
                { icon: NotebookPen, mode: "doorNotes", desc: "howStudy" },
                { icon: Layers, mode: "doorDeeper", desc: "howDeeper" },
              ] as const
            ).map(({ icon: Icon, mode, desc }) => (
              <div key={mode} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-bg-paper border border-border flex items-center justify-center">
                    <Icon
                      className="w-4 h-4 text-text-muted"
                      strokeWidth={1.5}
                    />
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
                    {t(`nav.${mode}`)}
                  </span>
                </div>
                <p className="text-text-primary text-sm leading-relaxed">
                  {t(`landing.${desc}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="px-6 py-20 border-t border-border-muted">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-[family-name:var(--font-reading)] text-2xl md:text-3xl font-light text-center mb-12">
            {t("landing.whoTitle")}
          </h2>
          <div className="space-y-8">
            {(["who1", "who2", "who3"] as const).map((key) => (
              <p
                key={key}
                className="font-[family-name:var(--font-reading)] text-lg leading-relaxed text-text-primary text-center"
              >
                {t(`landing.${key}`)}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* What This Is */}
      <section className="px-6 py-20 border-t border-border-muted bg-bg-surface">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-reading)] text-2xl md:text-3xl font-light mb-8">
            {t("landing.scopeTitle")}
          </h2>
          <p className="text-text-primary leading-relaxed">
            {t("landing.scope")}
          </p>
          <p className="mt-4 text-text-secondary italic">
            {t("landing.scopeNot")}
          </p>
          <div className="mt-10">
            <Link
              href="/books"
              className="min-h-12 inline-flex items-center justify-center px-10 py-4 rounded-md bg-accent text-bg-paper font-medium hover:bg-accent-hover active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              {t("landing.cta")}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-border-muted text-center">
        <p className="text-xs text-text-muted">{t("site.title")}</p>
      </footer>
    </main>
  );
}
