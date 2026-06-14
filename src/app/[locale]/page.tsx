import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { seoMetadata, truncateDescription, websiteJsonLd } from "@/lib/seo";
import { SeparationHero } from "@/ui/marketing/separation-hero";
import { Link } from "@/ui/navigation/locale-link";
import { JsonLd } from "@/ui/shared/json-ld";
import {
  renderInlineSafe,
  renderMarkdownSafe,
} from "@/ui/shared/render-markdown-safe";

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

  const diffs = (["diff1", "diff2", "diff3", "diff4"] as const).map((k, i) => ({
    n: String(i + 1).padStart(2, "0"),
    title: t(`landing.${k}title`),
    body: t(`landing.${k}`),
  }));
  const doors = [
    {
      idx: "01",
      label: t("nav.doorRead"),
      desc: t("landing.howReading"),
      href: "/genesis/chapter/1",
    },
    {
      idx: "02",
      label: t("nav.doorNotes"),
      desc: t("landing.howStudy"),
      href: "/genesis/chapter/1/notes",
    },
    {
      idx: "03",
      label: t("nav.doorDeeper"),
      desc: t("landing.howDeeper"),
      href: "/genesis/chapter/1/deeper",
    },
  ];
  const who = (["who1", "who2", "who3"] as const).map((k, i) => ({
    t: ["A", "B", "C"][i],
    body: t(`landing.${k}`),
  }));

  return (
    <main>
      <JsonLd data={websiteJsonLd(locale)} />

      {/* HERO — Gen 1:4 separation field (logged design-rule exception).
          -mt-16 cancels the layout's header offset so the hero bleeds under the
          transparent over-hero header. */}
      <section className="relative isolate overflow-hidden bg-dark min-h-screen -mt-16 flex flex-col justify-center px-6 py-24">
        <SeparationHero />
        <div className="relative z-10 max-w-[1320px] mx-auto w-full">
          <p
            className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] mb-5"
            style={{ color: "#fff", mixBlendMode: "difference" }}
          >
            {t("book.genesis")} 1:4
          </p>
          <h1
            className="tt-display max-w-[15ch]"
            style={{ color: "#fff", mixBlendMode: "difference" }}
            dangerouslySetInnerHTML={{
              __html: renderInlineSafe(t("landing.heroVerse")),
            }}
          />
          <div className="mt-12 flex flex-wrap gap-3.5">
            <Link href="/genesis/chapter/1" className="tt-btn tt-btn-pri">
              {t("landing.cta")} <span className="arr">→</span>
            </Link>
            <Link href="/start" className="tt-btn tt-btn-ghost-light">
              {t("landing.ctaStartHere")}
            </Link>
          </div>
        </div>
      </section>

      {/* INTRO STATEMENT */}
      <section className="tt-section bg-cream2 text-center">
        <div className="max-w-[880px] mx-auto px-6">
          <p className="tt-kick justify-center flex reveal">
            {t("site.title")}
          </p>
          <p className="tt-h1 reveal mt-3" data-d="1">
            {t("landing.heroHeadline")}
          </p>
          <p className="tt-lead reveal mt-5" data-d="2">
            {t("landing.heroSub")} {t("landing.heroSupport")}
          </p>
          <p
            className="font-[family-name:var(--font-mono)] reveal mt-6 tracking-[0.12em] text-text-muted text-[13px]"
            data-d="2"
          >
            {t("landing.languageTagline")}
          </p>
        </div>
      </section>

      {/* THE DIFFERENCE */}
      <section className="tt-section">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="tt-grid-head">
            <div className="tt-bignum reveal">01</div>
            <div>
              <p className="tt-kick reveal">{t("landing.differenceKicker")}</p>
              <h2 className="tt-h1 reveal max-w-[16ch]" data-d="1">
                {t("landing.differenceTitle")}
              </h2>
              <p className="tt-lead reveal mt-3.5 max-w-[46ch]" data-d="2">
                {t("landing.differenceDesc")}
              </p>
            </div>
          </div>

          <div className="tt-vcompare">
            <div className="reveal">
              <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] uppercase text-text-muted mb-4">
                {t("landing.conventional")}
              </div>
              <blockquote className="font-[family-name:var(--font-reading)] text-[clamp(1.15rem,1.8vw,1.5rem)] leading-[1.7] text-text-secondary">
                {t("landing.conventionalVerse")}
              </blockquote>
            </div>
            <div className="reveal" data-d="1">
              <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] uppercase text-accent mb-4">
                {t("landing.transparent")}
              </div>
              <blockquote
                className="font-[family-name:var(--font-reading)] text-[clamp(1.15rem,1.8vw,1.5rem)] leading-[1.7] text-text-primary [&_em]:text-accent [&_em]:not-italic"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdownSafe(
                    t("landing.transparentVerse"),
                    "prose",
                  ),
                }}
              />
            </div>
          </div>

          <div className="tt-diffs">
            {diffs.map((d) => (
              <div key={d.n} className="tt-diff reveal">
                <h4 className="font-[family-name:var(--font-ui)] text-base font-semibold flex gap-3 items-baseline">
                  <span className="font-[family-name:var(--font-mono)] text-[13px] text-ochre">
                    {d.n}
                  </span>
                  {d.title}
                </h4>
                <p
                  className="text-[14.5px] text-text-secondary mt-2 leading-[1.7] [&_em]:text-accent"
                  dangerouslySetInnerHTML={{ __html: renderInlineSafe(d.body) }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THREE DOORS */}
      <section className="tt-section bg-dark">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="tt-grid-head">
            <div
              className="tt-bignum reveal"
              style={{ color: "var(--color-petrol)" }}
            >
              02
            </div>
            <div>
              <p className="tt-kick reveal text-on-dark-mute">
                {t("landing.howKicker")}
              </p>
              <h2 className="tt-h1 reveal text-on-dark" data-d="1">
                {t("landing.howTitle")}
              </h2>
            </div>
          </div>
          <div className="tt-doors mt-12">
            {doors.map((d) => (
              <Link key={d.idx} href={d.href} className="tt-door reveal">
                <div className="idx">{d.idx}</div>
                <div className="dt">{d.label}</div>
                <p>{d.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHO */}
      <section className="tt-section">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="tt-grid-head">
            <div className="tt-bignum reveal">03</div>
            <div>
              <p className="tt-kick reveal">{t("landing.whoTitle")}</p>
              <h2 className="tt-h1 reveal" data-d="1">
                {t("landing.threeReaders")}
              </h2>
            </div>
          </div>
          <div className="tt-who mt-4">
            {who.map((w) => (
              <p key={w.t} className="reveal">
                <span className="t">{w.t}</span>
                <span>{w.body}</span>
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* SCOPE / FINAL */}
      <section className="tt-section bg-cream2 text-center">
        <div className="max-w-[880px] mx-auto px-6">
          <p className="tt-kick justify-center flex reveal">
            {t("landing.scopeTitle")}
          </p>
          <h2 className="tt-h1 reveal mt-3" data-d="1">
            {t("landing.scopeHeadline")}
          </h2>
          <p className="tt-lead reveal mt-6" data-d="2">
            {t("landing.scope")}
          </p>
          <p className="reveal mt-4 italic text-text-secondary" data-d="2">
            {t("landing.scopeNot")}
          </p>
          <div
            className="reveal mt-10 flex gap-3.5 justify-center flex-wrap"
            data-d="3"
          >
            <Link href="/genesis/chapter/1" className="tt-btn tt-btn-deep">
              {t("landing.cta")} <span className="arr">→</span>
            </Link>
            <Link href="/rules" className="tt-btn tt-btn-ghost">
              {t("landing.ctaRules")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
