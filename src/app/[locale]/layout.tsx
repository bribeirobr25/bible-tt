import type { ReactNode } from "react";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { notFound } from "next/navigation";
import { Newsreader, Geist, Geist_Mono } from "next/font/google";
import { locales, type Locale, loadMessages } from "@/lib/i18n";
import { GlobalHeader } from "@/ui/navigation/global-header";
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

  const messages = await loadMessages(locale);

  return (
    <html lang={locale} className={`${newsreader.variable} ${geist.variable} ${geistMono.variable}`}>
      <body className="bg-bg-paper text-text-primary font-[family-name:var(--font-ui)] min-h-screen">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <GlobalHeader />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
