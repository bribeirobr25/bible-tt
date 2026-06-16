import { getTranslations } from "next-intl/server";
import { Link } from "@/ui/navigation/locale-link";

export type Door = "read" | "notes" | "deeper";

/**
 * Phase 3 — the 3-door navigation (Read · Notes · Deeper). Server-rendered as
 * real `<a>` links (each door is its own URL, P3-Q1), so the nav is crawlable
 * and works without JS. The active door carries `aria-current="page"`.
 */
export async function DoorNav({
  book,
  chapterNum,
  active,
  hasDeeper,
}: {
  book: string;
  chapterNum: number;
  active: Door;
  hasDeeper: boolean;
}) {
  const t = await getTranslations();
  const base = `/${book}/chapter/${chapterNum}`;
  const doors: { key: Door; href: string; label: string }[] = [
    { key: "read", href: base, label: t("nav.doorRead") },
    { key: "notes", href: `${base}/notes`, label: t("nav.doorNotes") },
    { key: "deeper", href: `${base}/deeper`, label: t("nav.doorDeeper") },
  ];

  return (
    // A single segmented pill of links to distinct URLs (not in-page tabs):
    // nav semantics + aria-current="page", not role="tablist"/"tab".
    <nav className="tt-doornav" aria-label={t("nav.chapterViews")}>
      {doors.map(({ key, href, label }) => {
        if (key === "deeper" && !hasDeeper) {
          return (
            <span key={key} className="disabled" aria-disabled="true">
              {label}
            </span>
          );
        }
        return (
          <Link
            key={key}
            href={href}
            aria-current={key === active ? "page" : undefined}
            className="focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
