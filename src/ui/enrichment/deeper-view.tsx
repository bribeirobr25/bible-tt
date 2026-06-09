"use client";

import { Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import type { EnrichmentData, ProphecyData } from "@/domain/content/types";
import { ContextView } from "@/ui/enrichment/context-view";
import { Link } from "@/ui/navigation/locale-link";
import { ProphecyView } from "@/ui/prophecy/prophecy-view";

type SubTab = "background" | "prophecy";

/**
 * Phase 3 — the "Deeper" door (P3-Q2 = sub-tabs). Absorbs the former Explore +
 * Context + Prophecy modes into one surface with Background | Prophecies
 * sub-tabs, plus a link out to the book's People & genealogy.
 *
 * Crawlability: both panels are rendered into the DOM and merely toggled with a
 * `hidden` class (not conditionally mounted), so the non-default panel's content
 * is still present in the server-rendered HTML for search engines.
 */
export function DeeperView({
  enrichment,
  prophecy,
  book,
  hasPeople,
}: {
  enrichment: EnrichmentData | null;
  prophecy: ProphecyData | null;
  book: string;
  hasPeople: boolean;
}) {
  const t = useTranslations();
  const hasBackground = !!enrichment && enrichment.sections.length > 0;
  const hasProphecy = !!prophecy && prophecy.entries.length > 0;

  const tabs: { key: SubTab; label: string }[] = [];
  if (hasBackground)
    tabs.push({ key: "background", label: t("nav.bookContext") });
  if (hasProphecy) tabs.push({ key: "prophecy", label: t("nav.prophecyMode") });

  const [active, setActive] = useState<SubTab>(
    hasBackground ? "background" : "prophecy",
  );

  const isTabbed = tabs.length > 1;

  // Roving-tabindex keyboard nav for the tablist (WAI-ARIA pattern, automatic
  // activation): Left/Up → prev, Right/Down → next (wrapping), Home/End → ends.
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const onTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    const count = tabs.length;
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown")
      next = (index + 1) % count;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (index - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    else return;
    e.preventDefault();
    setActive(tabs[next].key);
    tabRefs.current[next]?.focus();
  };

  // When tabbed, wire full tabpanel ARIA; when a single panel, render plainly.
  const panelProps = (key: SubTab) =>
    isTabbed
      ? {
          id: `deeper-panel-${key}`,
          role: "tabpanel" as const,
          "aria-labelledby": `deeper-tab-${key}`,
          tabIndex: 0,
          hidden: active !== key,
        }
      : {};

  return (
    <div className="space-y-8">
      {isTabbed && (
        <div
          className="flex gap-1 bg-bg-muted rounded-lg p-1 w-fit max-w-full overflow-x-auto"
          role="tablist"
        >
          {tabs.map(({ key, label }, i) => (
            <button
              key={key}
              type="button"
              id={`deeper-tab-${key}`}
              role="tab"
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              aria-selected={active === key}
              aria-controls={`deeper-panel-${key}`}
              tabIndex={active === key ? 0 : -1}
              onClick={() => setActive(key)}
              onKeyDown={(e) => onTabKeyDown(e, i)}
              className={`min-h-11 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-95 ${
                active === key
                  ? "bg-bg-paper text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-paper/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Both panels stay in the DOM (hidden attribute, not unmounted) so the
          non-active panel's content is still in the server HTML for crawlers. */}
      {hasBackground && enrichment && (
        <div {...panelProps("background")}>
          <ContextView data={enrichment} />
        </div>
      )}

      {hasProphecy && prophecy && (
        <div {...panelProps("prophecy")}>
          <ProphecyView data={prophecy} />
        </div>
      )}

      {hasPeople && (
        <div className="max-w-3xl mx-auto pt-4 border-t border-border-muted">
          <Link
            href={`/${book}/people`}
            className="flex items-center gap-3 min-h-11 px-4 py-3 rounded-lg border border-border hover:border-accent/40 hover:bg-bg-surface transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <Users
              size={18}
              strokeWidth={1.5}
              className="text-text-muted shrink-0"
            />
            <span className="font-[family-name:var(--font-ui)] text-sm font-medium text-text-primary">
              {t("people.title")}
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
