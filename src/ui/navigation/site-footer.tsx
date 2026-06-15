import { getTranslations } from "next-intl/server";

/**
 * Site footer (Light & Darkness). Dark surface, serif brand blurb + two link
 * columns (Read / Method) + legal line — matches the redesign prototype.
 * Server-rendered; labels from existing i18n keys.
 */
export async function SiteFooter({ locale }: { locale: string }) {
  const t = await getTranslations();

  const read = [
    { href: `/${locale}/genesis`, label: t("book.genesis") },
    { href: `/${locale}/books`, label: t("nav.books") },
    { href: `/${locale}/start`, label: t("start.title") },
  ];
  const method = [
    { href: `/${locale}/rules`, label: t("landing.ctaRules") },
    {
      href: `/${locale}/genesis/introduction`,
      label: t("nav.bookIntroduction"),
    },
    { href: `/${locale}/genesis/people`, label: t("people.title") },
  ];

  return (
    <footer className="bg-dark text-on-dark-mute pt-16 pb-12">
      <div className="max-w-[1320px] mx-auto px-[clamp(18px,4vw,52px)]">
        <div className="grid gap-9 sm:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="font-[family-name:var(--font-reading)] text-[clamp(1.3rem,2.4vw,1.8rem)] leading-[1.2] text-on-dark max-w-[22ch]">
              {t("site.subtitle")}
            </p>
          </div>
          <FooterCol
            title={t("footer.read")}
            links={read}
            home={t("nav.home")}
          />
          <FooterCol
            title={t("footer.method")}
            links={method}
            home={t("nav.home")}
          />
        </div>
        <div className="mt-12 pt-6 border-t border-on-dark-soft/15 flex flex-wrap gap-3 justify-between font-[family-name:var(--font-mono)] text-[11px] tracking-[0.08em] uppercase text-on-dark-mute">
          <span>© {t("site.title")} · EN · PT · DE · ES</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
  home,
}: {
  title: string;
  links: { href: string; label: string }[];
  home: string;
}) {
  return (
    <nav aria-label={`${home} — ${title}`}>
      <h4 className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.14em] uppercase text-on-dark-soft mb-4">
        {title}
      </h4>
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          className="block text-on-dark-soft text-sm py-[5px] hover:text-petrol transition-colors duration-200 w-fit focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded"
        >
          {l.label}
        </a>
      ))}
    </nav>
  );
}
