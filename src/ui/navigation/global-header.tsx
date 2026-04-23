"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

export function GlobalHeader() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

  return (
    <header className="fixed top-0 right-0 z-40 p-3 flex items-center gap-1.5">
      {locales.map((loc) => (
        <a
          key={loc}
          href={`/${loc}${pathWithoutLocale}`}
          className={`min-h-8 min-w-8 inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
            loc === locale
              ? "bg-accent/10 text-accent"
              : "text-text-muted hover:text-text-secondary hover:bg-bg-muted active:scale-95"
          }`}
        >
          {loc.toUpperCase()}
        </a>
      ))}
    </header>
  );
}
