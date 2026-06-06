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
      className="fixed top-0 left-0 right-0 z-40 bg-bg-paper/95 backdrop-blur-sm border-b border-border-muted"
      aria-label="Main navigation"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-6 flex items-center justify-between min-h-12">
        {/* Left: Logo + breadcrumb */}
        <div className="flex items-center gap-3">
          <a
            href={`/${locale}`}
            className="font-[family-name:var(--font-reading)] text-lg font-light tracking-tight text-text-primary hover:text-accent transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
            aria-label={t("nav.home")}
          >
            TT
          </a>

          {breadcrumb && (
            <>
              <span className="text-border" aria-hidden="true">
                /
              </span>
              <a
                href={breadcrumb.href}
                className="text-sm text-text-muted hover:text-accent transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded flex items-center gap-1"
              >
                <span className="hidden sm:inline">&larr;</span>
                <span>{breadcrumb.label}</span>
              </a>
              {breadcrumb.current && (
                <>
                  <span
                    className="text-border hidden sm:inline"
                    aria-hidden="true"
                  >
                    /
                  </span>
                  <span className="text-sm text-text-secondary hidden sm:inline">
                    {breadcrumb.current}
                  </span>
                </>
              )}
            </>
          )}
        </div>

        {/* Right: Language switcher */}
        <div className="flex items-center gap-1">
          {locales.map((loc) => (
            <a
              key={loc}
              href={`/${loc}${pathWithoutLocale}`}
              className={`min-h-8 min-w-8 inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-md transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                loc === locale
                  ? "bg-accent/10 text-accent"
                  : "text-text-muted hover:text-text-secondary hover:bg-bg-muted active:scale-95"
              }`}
            >
              <span className="hidden sm:inline">{loc.toUpperCase()}</span>
              <span className="sm:hidden">
                {loc === "pt-br" ? "PT" : loc.toUpperCase()}
              </span>
            </a>
          ))}
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
