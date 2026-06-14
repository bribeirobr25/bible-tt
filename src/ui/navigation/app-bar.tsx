"use client";

import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AVAILABLE_BOOKS } from "@/domain/books/registry";
import { type Locale, locales } from "@/lib/i18n";

export function AppBar() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations();

  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
  const segments = pathWithoutLocale.split("/").filter(Boolean);

  const breadcrumb = getBreadcrumb(segments, locale, t);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 h-16 bg-bg-paper border-b border-border"
      aria-label="Main navigation"
    >
      <div className="max-w-5xl mx-auto h-full px-4 md:px-6 flex items-center justify-between gap-3">
        {/* Left: brand mark + wordmark + breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <a
            href={`/${locale}`}
            className="flex items-center gap-2.5 shrink-0 rounded focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            aria-label={t("nav.home")}
          >
            <span className="tt-mark" aria-hidden="true" />
            <span className="hidden md:inline font-[family-name:var(--font-mono)] text-[12.5px] font-semibold uppercase tracking-[0.06em] text-text-primary">
              {t("site.title")}
            </span>
          </a>

          {breadcrumb && (
            <div className="flex items-center gap-2 min-w-0 font-[family-name:var(--font-mono)] text-[12px] tracking-[0.02em]">
              <span className="text-border" aria-hidden="true">
                /
              </span>
              <a
                href={breadcrumb.href}
                className="text-text-muted hover:text-accent transition-colors duration-150 rounded flex items-center gap-1 truncate focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              >
                <span className="hidden sm:inline" aria-hidden="true">
                  &larr;
                </span>
                <span className="truncate">{breadcrumb.label}</span>
              </a>
              {breadcrumb.current && (
                <>
                  <span
                    className="text-border hidden sm:inline"
                    aria-hidden="true"
                  >
                    /
                  </span>
                  <span className="text-text-secondary hidden sm:inline truncate">
                    {breadcrumb.current}
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right: segmented language switcher */}
        {/* biome-ignore lint/a11y/useSemanticElements: a labelled group of locale links, not a form fieldset */}
        <div
          className="inline-flex shrink-0 rounded-full border border-border overflow-hidden font-[family-name:var(--font-mono)] text-[11px] tracking-[0.03em]"
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
                    ? "bg-accent text-bg-paper"
                    : "text-text-muted hover:text-accent"
                }`}
              >
                {loc === "pt-br" ? "PT" : loc.toUpperCase()}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function getBreadcrumb(
  segments: string[],
  locale: string,
  t: ReturnType<typeof useTranslations>,
): { href: string; label: string; current?: string } | null {
  if (segments.length === 0) return null;
  if (segments[0] === "books") return null;
  if (segments[0] === "rules") return null;

  const validBooks: readonly string[] = AVAILABLE_BOOKS;

  if (segments.length === 1 && validBooks.includes(segments[0])) {
    return {
      href: `/${locale}/books`,
      label: t("nav.books"),
    };
  }

  if (segments.length === 2 && validBooks.includes(segments[0])) {
    const sub = segments[1];
    // Sub-route pages under a book — pick the correct label by sub-route name.
    if (sub === "background") {
      return {
        href: `/${locale}/${segments[0]}`,
        label: t(`book.${segments[0]}`),
        current: t("nav.bookContext"),
      };
    }
    if (sub === "introduction") {
      return {
        href: `/${locale}/${segments[0]}`,
        label: t(`book.${segments[0]}`),
        current: t("nav.bookIntroduction"),
      };
    }
    if (sub === "people") {
      return {
        href: `/${locale}/${segments[0]}`,
        label: t(`book.${segments[0]}`),
        current: t("people.title"),
      };
    }
    // Fallback: legacy URL pattern `/{book}/{n}` where segment[1] is a chapter number.
    if (/^\d+$/.test(sub)) {
      return {
        href: `/${locale}/${segments[0]}`,
        label: t(`book.${segments[0]}`),
        current: t("chapter.chapterN", { n: sub }),
      };
    }
  }

  // `/{book}/chapter/{n}` — current URL pattern for chapter pages (Phase 6.6F).
  if (
    segments.length === 3 &&
    validBooks.includes(segments[0]) &&
    segments[1] === "chapter"
  ) {
    return {
      href: `/${locale}/${segments[0]}`,
      label: t(`book.${segments[0]}`),
      current: t("chapter.chapterN", { n: segments[2] }),
    };
  }

  // Phase 3: `/{book}/chapter/{n}/{notes|deeper}` — chapter door pages.
  if (
    segments.length === 4 &&
    validBooks.includes(segments[0]) &&
    segments[1] === "chapter"
  ) {
    const door = segments[3];
    return {
      href: `/${locale}/${segments[0]}/chapter/${segments[2]}`,
      label: t("chapter.chapterN", { n: segments[2] }),
      current:
        door === "notes"
          ? t("nav.doorNotes")
          : door === "deeper"
            ? t("nav.doorDeeper")
            : t("chapter.chapterN", { n: segments[2] }),
    };
  }

  return null;
}
