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
  ];
  if (hasDeeper) {
    doors.push({
      key: "deeper",
      href: `${base}/deeper`,
      label: t("nav.doorDeeper"),
    });
  }

  return (
    // These are navigation links to distinct URLs (not in-page tabs), so use
    // nav semantics with aria-current="page" — not role="tablist"/"tab".
    <nav
      className="flex gap-1 bg-bg-muted rounded-lg p-1 w-fit max-w-full overflow-x-auto"
      aria-label={t("nav.chapterViews")}
    >
      {doors.map(({ key, href, label }) => {
        const isActive = key === active;
        return (
          <Link
            key={key}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`min-h-11 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-95 ${
              isActive
                ? "bg-bg-paper text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-paper/50"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
