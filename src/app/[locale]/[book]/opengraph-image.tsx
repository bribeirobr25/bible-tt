import { getTranslations } from "next-intl/server";
import { AVAILABLE_BOOKS } from "@/domain/books/registry";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "The Transparent Translation";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; book: string }>;
}) {
  const { locale, book } = await params;
  const t = await getTranslations({ locale });
  const known = (AVAILABLE_BOOKS as readonly string[]).includes(book);
  return renderOgImage({
    eyebrow: t("site.title"),
    title: known ? t(`book.${book}`) : book,
    subtitle: t("site.subtitle"),
  });
}
