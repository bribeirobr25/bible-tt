import { getTranslations } from "next-intl/server";

/**
 * Site footer (Light & Darkness). Brand blurb + method links + legal line.
 * Server-rendered; labels from existing i18n keys (no new keys).
 */
export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations();
  const links = [
    { href: `/${locale}/books`, label: t("nav.books") },
    { href: `/${locale}/rules`, label: t("landing.ctaRules") },
    { href: `/${locale}/start`, label: t("start.title") },
  ];

  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-12 grid gap-8 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="tt-mark" aria-hidden="true" />
            <span className="font-[family-name:var(--font-mono)] text-[12.5px] font-semibold uppercase tracking-[0.06em] text-text-primary">
              {t("site.title")}
            </span>
          </div>
          <p className="font-[family-name:var(--font-reading)] mt-3 text-text-secondary max-w-sm text-base leading-relaxed">
            {t("site.subtitle")}
          </p>
        </div>
        <nav
          className="flex flex-col gap-2.5 font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.04em]"
          aria-label={t("nav.home")}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-text-secondary hover:text-accent transition-colors duration-150 w-fit focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded"
            >
              {l.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t border-border-muted">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-4 flex flex-wrap gap-2 justify-between font-[family-name:var(--font-mono)] text-[11px] text-text-muted">
          <span>© {t("site.title")} · EN · PT · DE · ES</span>
          <span>Light &amp; Darkness</span>
        </div>
      </div>
    </footer>
  );
}
