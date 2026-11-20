/**
 * B9 (launch fixes) — Deeper door sub-tab ARIA. Server-renders DeeperView with
 * real Genesis companions: ch. 1 has Background only (one panel), ch. 3 has
 * Background + Prophecies (two panels).
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { NextIntlClientProvider } from "next-intl";
import { type ComponentProps, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { parseEnrichmentMarkdown } from "@/infrastructure/content/enrichment-parser";
import { parseProphecyMarkdown } from "@/infrastructure/content/prophecy-parser";
import messages from "@/infrastructure/i18n/messages/en.json";
import { DeeperView, deeperTabModel } from "@/ui/enrichment/deeper-view";

// next-intl's navigation entry can't resolve `next/navigation` under plain
// Node ESM; the Link is irrelevant to the ARIA structure, so stub it as <a>.
vi.mock("@/ui/navigation/locale-link", async () => {
  const { createElement: h } = await import("react");
  return { Link: (p: Record<string, unknown>) => h("a", p) };
});

const STUDY = path.resolve(__dirname, "../../../../content/en/genesis/study");
const read = (f: string) => readFileSync(path.join(STUDY, f), "utf8");

function render(chapter: number, withProphecy: boolean, hasPeople = true) {
  const enrichment = parseEnrichmentMarkdown(
    read(`CHAPTER-${chapter}-CONTEXT.md`),
    "genesis",
    chapter,
  );
  const prophecy = withProphecy
    ? parseProphecyMarkdown(
        read(`CHAPTER-${chapter}-PROPHECY.md`),
        "genesis",
        chapter,
      )
    : null;
  return renderToStaticMarkup(
    createElement(
      NextIntlClientProvider,
      // children travel as the third argument (Biome noChildrenProp); the
      // provider's prop type marks them required, hence the assertion.
      { locale: "en", messages, timeZone: "UTC" } as unknown as ComponentProps<
        typeof NextIntlClientProvider
      >,
      createElement(DeeperView, {
        enrichment,
        prophecy,
        book: "genesis",
        hasPeople,
      }),
    ),
  );
}

/** The tablist element's markup (it contains only buttons, so the first `</div>` closes it). */
function tablistMarkup(html: string): string {
  const start = html.indexOf('role="tablist"');
  expect(start).toBeGreaterThan(-1);
  return html.slice(start, html.indexOf("</div>", start));
}

describe("deeperTabModel", () => {
  it("is not tabbed with a single panel", () => {
    expect(deeperTabModel(["background"]).isTabbed).toBe(false);
    expect(deeperTabModel(["prophecy"]).isTabbed).toBe(false);
  });
  it("is tabbed with two panels and pairs tab/panel ids", () => {
    const m = deeperTabModel(["background", "prophecy"]);
    expect(m.isTabbed).toBe(true);
    expect(m.panelId("prophecy")).toBe("deeper-panel-prophecy");
    expect(m.tabId("prophecy")).toBe("deeper-tab-prophecy");
  });
});

describe("DeeperView ARIA (B9)", () => {
  it("single sub-tab: no tablist/tab roles, no dangling aria-controls", () => {
    const html = render(1, false);
    expect(html).not.toContain('role="tablist"');
    expect(html).not.toContain('role="tab"');
    expect(html).not.toContain('role="tabpanel"');
    expect(html).not.toContain("aria-controls");
    // label still shown as plain text; People link still offered
    expect(html).toContain(messages.nav.bookContext);
    expect(html).toContain('href="/genesis/people"');
  });

  it("two sub-tabs: every aria-controls targets a rendered tabpanel labelled by its tab", () => {
    const html = render(3, true);
    const controls = [...html.matchAll(/aria-controls="([^"]+)"/g)].map(
      (m) => m[1],
    );
    expect(controls).toEqual([
      "deeper-panel-background",
      "deeper-panel-prophecy",
    ]);
    for (const id of controls) {
      const key = id.replace("deeper-panel-", "");
      expect(html).toContain(
        `id="${id}" role="tabpanel" aria-labelledby="deeper-tab-${key}"`,
      );
      expect(html).toContain(`id="deeper-tab-${key}" role="tab"`);
    }
    // roving tabindex: active tab 0, other -1; inactive panel hidden
    expect(html).toMatch(/id="deeper-tab-background"[^>]*tabindex="0"/);
    expect(html).toMatch(/id="deeper-tab-prophecy"[^>]*tabindex="-1"/);
    expect(html).toMatch(/id="deeper-panel-prophecy"[^>]*hidden/);
  });

  it("two sub-tabs: the People link sits outside the tablist", () => {
    const html = render(3, true);
    const list = tablistMarkup(html);
    expect(list).not.toContain("<a");
    expect(list).not.toContain("/people");
    expect(html).toContain('href="/genesis/people"');
  });
});
