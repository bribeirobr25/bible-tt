import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/ui/navigation/locale-link";
import { getAvailableBooks, getAvailableChapters } from "@/lib/content-loader";

export async function generateStaticParams() {
  const books = await getAvailableBooks("en");
  return books.map((book) => ({ book }));
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string; book: string }>;
}) {
  const { locale, book } = await params;

  const books = await getAvailableBooks(locale);
  if (!books.includes(book)) {
    notFound();
  }

  const t = await getTranslations();
  const chapters = await getAvailableChapters(locale, book);

  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-12">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <Link href="/books" className="text-text-secondary text-sm hover:text-accent transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded">
            &larr; {t("nav.books")}
          </Link>
          <h1 className="font-[family-name:var(--font-reading)] text-3xl md:text-4xl font-light mt-4">
            {t(`book.${book}`)}
          </h1>
          <p className="text-sm text-text-muted mt-2">
            {t("nav.selectChapter")}
          </p>
        </div>
        <nav className="space-y-3">
          {chapters.map((ch) => (
            <Link
              key={ch}
              href={`/${book}/${ch}`}
              className="block px-5 py-4 rounded-lg border border-border hover:border-accent/40 hover:bg-bg-surface transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-[0.99]"
            >
              <span className="font-medium">
                {t("nav.chapters")} {ch}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
