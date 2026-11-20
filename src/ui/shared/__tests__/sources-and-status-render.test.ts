/**
 * Step 4 batch 1 — the Sources block reaches every page that has one (audit B2)
 * and the status pill prints the i18n term (D15). Server-renders the real
 * components with real content under the EN messages.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { NextIntlClientProvider } from "next-intl";
import { type ComponentProps, createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  parseEnrichmentMarkdown,
  parseIntroductionMarkdown,
} from "@/infrastructure/content/enrichment-parser";
import { parseProphecyMarkdown } from "@/infrastructure/content/prophecy-parser";
import messages from "@/infrastructure/i18n/messages/en.json";
import { ContextView } from "@/ui/enrichment/context-view";
import { IntroductionView } from "@/ui/enrichment/introduction-view";
import { ProphecyView } from "@/ui/prophecy/prophecy-view";
import { StatusPill } from "@/ui/shared/status-pill";

vi.mock("@/ui/navigation/locale-link", async () => {
  const { createElement: h } = await import("react");
  return { Link: (p: Record<string, unknown>) => h("a", p) };
});

const CONTENT = path.resolve(__dirname, "../../../../content/en");
const read = (...p: string[]) => readFileSync(path.join(CONTENT, ...p), "utf8");

function html(node: ReactNode): string {
  return renderToStaticMarkup(
    createElement(
      NextIntlClientProvider,
      { locale: "en", messages, timeZone: "UTC" } as unknown as ComponentProps<
        typeof NextIntlClientProvider
      >,
      node,
    ),
  );
}

const SOURCES = "Sources consulted";

describe("SourcesBlock on every page type", () => {
  it("companion (Deeper · Background)", () => {
    const data = parseEnrichmentMarkdown(
      read("genesis", "study", "CHAPTER-1-CONTEXT.md"),
      "genesis",
      1,
    );
    const out = html(createElement(ContextView, { data }));
    expect(out).toContain(SOURCES);
    expect(out).toContain("tt-sources");
    expect(out).toContain("Pritchard");
  });

  it("PROPHECY (Deeper · Prophecies) — with rule links", () => {
    const data = parseProphecyMarkdown(
      read("acts", "study", "CHAPTER-2-PROPHECY.md"),
      "acts",
      2,
    );
    const out = html(createElement(ProphecyView, { data }));
    expect(out).toContain(SOURCES);
    expect(out).toContain("Editorial provenance");
  });

  it("introduction, with its section intros", () => {
    const data = parseIntroductionMarkdown(
      read("acts", "INTRODUCTION.md"),
      "acts",
    );
    const out = html(
      createElement(IntroductionView, { data, sectionLabels: {} }),
    );
    expect(out).toContain(SOURCES);
    expect(out).toContain("Fitzmyer");
  });
});

describe("StatusPill", () => {
  it("prints the i18n term, not the authored word", () => {
    const out = html(
      createElement(StatusPill, {
        status: "provisorisch — Prüfer-Freigabe ausstehend (Regel 28)",
      }),
    );
    expect(out).toContain(
      '<span class="dot" aria-hidden="true"></span>Provisional<',
    );
    expect(out).toContain('title="provisorisch');
    // the full authored status is available to screen readers too
    expect(out).toContain('<span class="sr-only"> — provisorisch');
  });
  it("a file without a status reads as provisional", () => {
    expect(html(createElement(StatusPill, {}))).toContain(
      ">Provisional</span>",
    );
  });
  it("an unknown status falls back to the authored word, capitalized", () => {
    expect(
      html(createElement(StatusPill, { status: "draft — wip" })),
    ).toContain("</span>Draft<");
  });
});
