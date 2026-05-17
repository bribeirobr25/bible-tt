import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/infrastructure/i18n/config";
import { getAvailableBooks, getBookContextData } from "@/lib/content-loader";
import { BookContextView } from "@/ui/enrichment/book-context-view";
import { Link } from "@/ui/navigation/locale-link";

export async function generateStaticParams() {
  const books = await getAvailableBooks("en");
  return books.map((book) => ({ book }));
}

export default async function BookContextPage({
  params,
}: {
  params: Promise<{ locale: string; book: string }>;
}) {
  const { locale, book } = await params;
  setRequestLocale(locale);

  const books = await getAvailableBooks(locale);
  if (!books.includes(book)) {
    notFound();
  }

  const t = await getTranslations();
  const data = await getBookContextData(locale as Locale, book);

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12">
      <div className="max-w-3xl w-full space-y-8">
        <div>
          <Link
            href={`/${book}`}
            className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent transition-colors duration-150 mb-4"
          >
            <ChevronLeft size={14} strokeWidth={1.5} />
            {t(`book.${book}`)}
          </Link>
          <h1 className="font-[family-name:var(--font-reading)] text-2xl md:text-3xl font-light">
            {t("nav.bookContext")}
          </h1>
          <p className="text-sm text-text-muted mt-2 italic">
            {t("nav.bookContextDescription")}
          </p>
        </div>

        {data ? (
          <BookContextView data={data} />
        ) : (
          <div className="py-16 text-center">
            <p className="text-sm text-text-muted italic">
              {t("nav.comingSoon")}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
