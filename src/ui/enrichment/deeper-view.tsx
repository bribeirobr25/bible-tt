"use client";

import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import type { EnrichmentData, ProphecyData } from "@/domain/content/types";
import { ContextView } from "@/ui/enrichment/context-view";
import { Link } from "@/ui/navigation/locale-link";
import { ProphecyView } from "@/ui/prophecy/prophecy-view";

type SubTab = "background" | "prophecy";

/**
 * B9 — the sub-tab ARIA wiring as plain data. Tabs exist only when there are
 * 2+ panels to switch between; then every tab's `aria-controls` names a panel
 * id that the same model assigns to a rendered `role="tabpanel"`. A single
 * panel gets no tab roles at all (its label is plain text).
 */
export function deeperTabModel(keys: readonly SubTab[]) {
  const isTabbed = keys.length > 1;
  return {
    isTabbed,
    tabId: (key: SubTab) => `deeper-tab-${key}`,
    panelId: (key: SubTab) => `deeper-panel-${key}`,
  };
}

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

  const { isTabbed, tabId, panelId } = deeperTabModel(tabs.map((x) => x.key));

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
          id: panelId(key),
          role: "tabpanel" as const,
          "aria-labelledby": tabId(key),
          tabIndex: 0,
          hidden: active !== key,
        }
      : {};

  return (
    <div className="space-y-8">
      {tabs.length > 0 && (
        <div className="tt-subtabs">
          {isTabbed ? (
            // The tablist holds only the tabs; the People link sits beside it
            // (a link is not a tab, so it must not be a tablist child).
            <div
              role="tablist"
              aria-label={t("chapter.deeperRef")}
              className="flex flex-wrap gap-1.5"
            >
              {tabs.map(({ key, label }, i) => (
                <button
                  key={key}
                  type="button"
                  id={tabId(key)}
                  role="tab"
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  aria-selected={active === key}
                  aria-controls={panelId(key)}
                  tabIndex={active === key ? 0 : -1}
                  onClick={() => setActive(key)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className="focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                >
                  {label}
                </button>
              ))}
            </div>
          ) : (
            // One panel: nothing to switch, so no tab semantics — a plain label
            // styled like the selected tab.
            <span className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.04em] uppercase px-3.5 py-3 text-accent border-b-2 border-accent -mb-px whitespace-nowrap">
              {tabs[0].label}
            </span>
          )}
          {hasPeople && (
            <Link href={`/${book}/people`} className="tablink">
              {t("people.title")} ↗
            </Link>
          )}
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
    </div>
  );
}
