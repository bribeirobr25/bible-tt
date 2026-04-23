"use client";

import { locales, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({
  currentLocale,
  book,
  chapter,
}: {
  currentLocale: string;
  book: string;
  chapter: number;
}) {
  return (
    <div className="flex gap-1 text-sm">
      {locales.map((locale) => (
        <a
          key={locale}
          href={`/${locale}/${book}/${chapter}`}
          className={`min-h-8 inline-flex items-center justify-center px-2.5 py-1 rounded-md transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
            locale === currentLocale
              ? "bg-accent/10 text-accent font-medium"
              : "text-text-muted hover:text-text-secondary hover:bg-bg-muted active:scale-95"
          }`}
        >
          {locale.toUpperCase()}
        </a>
      ))}
    </div>
  );
}
