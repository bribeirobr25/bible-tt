"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { AVAILABLE_BOOKS } from "@/domain/books/registry";
import { type Locale, locales } from "@/lib/i18n";

export function AppBar() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations();

  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
  const segments = pathWithoutLocale.split("/").filter(Boolean);

  const isBookPage =
    segments.length > 0 &&
    (AVAILABLE_BOOKS as readonly string[]).includes(segments[0]);

  // The landing + marketing pages (rules/start/books) lead with a dark WebGL
  // hero: the header floats transparent over it (light text via mix-blend), then
  // turns solid cream once scrolled past the hero.
  const hasHero =
    segments.length === 0 || ["rules", "start", "books"].includes(segments[0]);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!hasHero) return;
    const onScroll = () => {
      setScrolledPastHero(window.scrollY > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasHero]);
  // close the mobile menu on navigation
  // biome-ignore lint/correctness/useExhaustiveDependencies: close menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);
  const over = hasHero && !scrolledPastHero && !menuOpen;

  // Every page shows the prototype's top-nav links (the per-page breadcrumb lives
  // in the page head, e.g. the chapter-head — not in the header). On a book page,
  // the middle link points at that book's hub instead of "Start here".
  const showNav = true;
  const navLinks = [
    { href: `/${locale}/books`, label: t("nav.books") },
    isBookPage
      ? { href: `/${locale}/${segments[0]}`, label: t(`book.${segments[0]}`) }
      : { href: `/${locale}/start`, label: t("start.title") },
    { href: `/${locale}/rules`, label: t("landing.ctaRules") },
  ];
  const ctaHref = `/${locale}/genesis/chapter/1`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 h-16 transition-colors duration-300 ${
        over ? "tt-overhero" : "bg-bg-paper border-b border-border"
      }`}
      aria-label="Main navigation"
    >
      <div className="h-full px-[clamp(18px,4vw,52px)] flex items-center justify-between gap-3">
        {/* Left: brand mark + wordmark */}
        <div className="flex items-center gap-3 min-w-0">
          <a
            href={`/${locale}`}
            className="flex items-center gap-2.5 shrink-0 rounded focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            aria-label={t("nav.home")}
          >
            <span className="tt-mark" aria-hidden="true" />
            <span
              className={`hidden md:inline font-[family-name:var(--font-mono)] text-[12.5px] font-semibold uppercase tracking-[0.06em] ${
                over ? "text-on-dark" : "text-text-primary"
              }`}
            >
              {t("site.brand")}
            </span>
          </a>
        </div>

        {/* Right cluster: nav links + language switcher + mobile menu */}
        <div className="flex items-center gap-2 md:gap-4">
          {showNav && (
            <div className="hidden md:flex items-center gap-1 font-[family-name:var(--font-mono)] text-[12px] tracking-[0.03em]">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className={`px-2.5 py-1.5 rounded-full transition-colors duration-150 ${
                    over ? "" : "text-text-secondary hover:text-accent"
                  }`}
                >
                  {l.label}
                </a>
              ))}
              <a
                href={ctaHref}
                className={`px-3.5 py-1.5 rounded-full border transition-colors duration-150 ${
                  over
                    ? "border-on-dark-soft/60"
                    : "border-accent text-accent hover:bg-accent hover:text-bg-paper"
                }`}
              >
                {t("landing.cta")} →
              </a>
            </div>
          )}

          {/* biome-ignore lint/a11y/useSemanticElements: a labelled group of locale links, not a form fieldset */}
          <div
            className={`order-first inline-flex shrink-0 rounded-full border overflow-hidden font-[family-name:var(--font-mono)] text-[11px] tracking-[0.03em] ${
              over ? "border-on-dark-soft/50" : "border-border"
            }`}
            role="group"
            aria-label="Language"
          >
            {locales.map((loc) => {
              const isActive = loc === locale;
              return (
                <a
                  key={loc}
                  href={`/${loc}${pathWithoutLocale}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`min-h-8 inline-flex items-center justify-center px-2.5 py-1.5 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-accent focus-visible:-outline-offset-2 ${
                    isActive
                      ? over
                        ? "underline underline-offset-4 decoration-2"
                        : "bg-accent text-bg-paper"
                      : over
                        ? ""
                        : "text-text-muted hover:text-accent"
                  }`}
                >
                  {loc === "pt-br" ? "PT" : loc.toUpperCase()}
                </a>
              );
            })}
          </div>

          {showNav && (
            <button
              type="button"
              className={`md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border ${
                over
                  ? "border-on-dark-soft/50"
                  : "border-border text-text-primary"
              }`}
              aria-label="Menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? (
                <X size={18} strokeWidth={1.5} />
              ) : (
                <Menu size={18} strokeWidth={1.5} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* mobile menu panel */}
      {showNav && menuOpen && (
        <div className="md:hidden bg-bg-paper border-b border-border px-4 py-3 flex flex-col">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="py-3 font-[family-name:var(--font-mono)] text-[13px] uppercase tracking-[0.04em] text-text-secondary hover:text-accent"
            >
              {l.label}
            </a>
          ))}
          <a
            href={ctaHref}
            className="mt-2 inline-flex w-fit px-4 py-2.5 rounded-full bg-accent text-bg-paper font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.04em]"
          >
            {t("landing.cta")} →
          </a>
        </div>
      )}
    </nav>
  );
}
