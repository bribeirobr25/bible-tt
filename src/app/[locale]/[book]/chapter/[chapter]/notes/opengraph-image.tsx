import { getTranslations } from "next-intl/server";
import { AVAILABLE_BOOKS } from "@/domain/books/registry";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The Transparent Translation";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; book: string; chapter: string }>;
}) {
  const { locale, book, chapter } = await params;
  const t = await getTranslations({ locale });
  const bookName = (AVAILABLE_BOOKS as readonly string[]).includes(book)
    ? t(`book.${book}`)
    : book;
  return renderOgImage({
    eyebrow: `${bookName} ${chapter}`,
    title: t("nav.doorNotes"),
    subtitle: t("site.subtitle"),
  });
}
