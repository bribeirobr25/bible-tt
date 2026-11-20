import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { isActiveBook } from "@/domain/books/registry";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The Transparent Translation";

// Activation guard (audit B1): an unknown or unactivated book 404s here.
// No `dynamicParams` on purpose — metadata image routes have no
// `generateStaticParams`, so `dynamicParams = false` would 404 every image
// under Turbopack (and webpack strips the export); see activation-guard.test.ts.

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; book: string; chapter: string }>;
}) {
  const { locale, book, chapter } = await params;
  if (!isActiveBook(book) || !/^\d+$/.test(chapter)) notFound();
  const t = await getTranslations({ locale });
  const bookName = t(`book.${book}`);
  return renderOgImage({
    eyebrow: bookName,
    title: `${bookName} ${chapter}`,
    subtitle: t("site.subtitle"),
  });
}
