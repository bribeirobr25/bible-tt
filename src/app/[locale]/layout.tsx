import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { type Locale, loadMessages, locales } from "@/lib/i18n";
import { AppBar } from "@/ui/navigation/app-bar";
import "@/app/globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-reading",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await loadMessages(locale);

  return (
    <html
      lang={locale}
      className={`${newsreader.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body className="bg-bg-paper text-text-primary font-[family-name:var(--font-ui)] min-h-screen">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppBar />
          <div className="pt-12">{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
