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
      className="flex gap-2 w-fit max-w-full overflow-x-auto"
      aria-label={t("nav.chapterViews")}
    >
      {doors.map(({ key, href, label }) => {
        const isActive = key === active;
        return (
          <Link
            key={key}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`min-h-11 inline-flex items-center px-4 py-2.5 text-sm font-medium rounded-full border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 active:scale-95 ${
              isActive
                ? "bg-accent text-bg-paper border-accent"
                : "border-border text-text-secondary hover:text-accent hover:border-accent"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
