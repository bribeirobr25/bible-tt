# Audit — UX/Structure Implementation (Phases 1–5, uncommitted)

**Date:** 2026-06-07
**Auditor:** Claude Opus 4.8 (independent review)
**Scope:** The full uncommitted UX/Structure program — Phase 1 (SEO baseline), Phase 2 (structured layer + conservation gate), Phase 3 (3-door IA), Phase 4 (text QA + guards), Phase 5/5b (UX finish + book cards). Verified against actual `src/` source, not plan self-reports.
**Method:** Read every governing doc (CLAUDE.md, README, STANDARDS, design system, content-structure proposal, all phase plans, PENDING). Then read the actual implementation: domain layer (`ids.ts`, `structured.ts`, `types.ts`, `registry.ts`, `generation-references.ts`), the conservation gate, `fs-content-repository.ts`, `content-loader.ts`, all three door routes + their `generateStaticParams`/`generateMetadata`, `ChapterShell`, `DoorNav`, `DeeperView`, `NotesView`, `VerseCard`, `CopyVerseLink`, `LegacyHashRedirect`, `ContextView`, `BookCard`, book landing, `/start`, `app-bar`, the enrichment + markdown parsers, the SEO layer (`seo.ts`, `og.tsx`, `sitemap.ts`, `robots.ts`, `json-ld.tsx`), `globals.css`, `confidence-indicator.tsx`, and all four i18n bundles in full.
**Status:** ✅ **APPROVE.** Well-architected, DDD-clean, additive. No Critical or Significant findings. Five Minor findings, none blocking — all either cosmetic, documentation, or accepted-by-plan.

> **Not independently executed:** `pnpm test` (claimed 841), `pnpm build`, `pnpm lint`, `pnpm content:lint`. No shell in this environment. Everything below is verified by reading source; the gate *design* is sound (see §Phase 2), but a green test run should be confirmed before commit.

---

## Executive summary

This is a disciplined, correctly-sequenced implementation. The standout is the **Phase 2 conservation gate**: it is genuinely sound engineering, not a rubber stamp — it recomputes its expectations directly from the parsed domain object, independent of the emitter, so an emitter that drops or mangles a unit fails the build. The type changes across the whole program are **strictly additive** (no existing field altered or removed), which is why five phases of work carry near-zero regression risk to the existing parsers and UI. The DDD seam is intact: `domain/` stays pure, `content-loader.ts` remains the single bridge, and the structured layer is derived (markdown stays source of truth). The a11y refinements claimed in the Phase-3 review are actually present in the code (nav semantics over tablist for the door nav; tabpanel wiring + in-DOM panels for the Deeper sub-tabs). i18n parity holds across all four locales for every new key.

No regression, side-effect, or new bug rises to Significant. The five Minor findings are documentation/cosmetic or were explicitly reasoned about and accepted in the plans.

---

## Verification table

| # | Claim (from plans / CLAUDE.md) | Result | Notes |
|---|---|---|---|
| 1 | Phase 2 IDs are pure, deterministic, locale-independent | ✓ | `ids.ts` no framework/fs imports; `slugify` NFKD + strips U+0300–U+036F; positional + slug scheme as specced |
| 2 | Structured layer is additive; types unchanged | ✓ | `types.ts`: only `EnrichmentEntry.subEntries?`, `BookCardField`, `IntroductionData.card?` added — all optional. No `enum` (STANDARDS §13) |
| 3 | Conservation gate proves no loss across all content files | ✓ (scoped) | Gates 1–4 + totality (2b) sound; `expected` recomputed from domain object independent of emitter. **Scope caveat → Minor 1** |
| 4 | §I two-level (scenario → sub-dimension) parse + emit + render | ✓ | `enrichment-parser` `flushSub()`/`currentSub` state machine correct; emitter conserves group `title` + sub `content`; `context-view` renders authored order, no confidence sort |
| 5 | DDD seam intact; `content-loader` the only bridge | ✓ | `getStructuredBook` reuses parsers+emitters; `domain/` imports nothing framework |
| 6 | 3 door routes, each self-canonical + JSON-LD + OG + static params | ✓ | Read/Notes use `getAllChapterParams`; Deeper gated by `getDeeperChapterParams` + runtime `notFound()` double-gate |
| 7 | `DoorNav` uses nav semantics (not tablist) + `aria-current` | ✓ | Real `<Link>`s; `aria-current="page"`; Deeper shown only if `hasDeeper` |
| 8 | `DeeperView` SSRs both panels in-DOM for crawlability | ✓ | `hidden` attribute toggle, not conditional mount; tabpanel ARIA when tabbed. **Keyboard gap → Minor 2** |
| 9 | Verse anchors `#v{n}` + copy-link + `:target` highlight | ✓ | `verse-card` `id="v{n}"`+`scroll-mt-24`; `copy-verse-link` `history.replaceState`+clipboard guard; `globals.css` `:target` w/ reduced-motion wrap |
| 10 | `/context` → `/background` everywhere; 0 stale refs | ✓ | Route dir is `background/`; sitemap + app-bar use `/background`; legacy hash redirect maps correctly |
| 11 | Chapter metadata block now parsed (Phase 4) | ✓ | `extractMetadata` reads `preamble + titleContent`; substring `pick()` across 4 locales; guard asserts non-empty |
| 12 | ES title-block leak fixed; ES John verses parse | ✓ | `isTitleSection` covers `Traducción Transparente`; completeness guard checks title-leak + ≥1 verse |
| 13 | Teal accent is OKLCH, not hex | ✓ | `--color-accent: oklch(0.46 0.1 213)`. (OG hex is a justified exception → see Minor 5 context) |
| 14 | Book tight-card (Phase 5b) replaces overview dump | ✓ | `parseBookCard` HTML-comment block (language-neutral); `BookCard` semantic `dl`; landing leads with card |
| 15 | `/start` gated by `AVAILABLE_BOOKS`; no dead links | ✓ | `liveBooks` filter; coming-soon badges for unauthored |
| 16 | i18n parity across 4 locales for all new keys | ✓ | de/es/pt-br all carry doorRead/Notes/Deeper, chapterViews, atAGlance, readFullIntroduction, start.*, heroHeadline/Sub/Support, ctaStartHere; orphaned keys removed |
| 17 | Retired components removed (ChapterView/ExploreView/NarrativeSection) | ✓ | Absent from tree; no imports found in any read file |
| 18 | "8 routes / 8 OG images" | ✗ (stale doc) | 9 OG segments now exist (+`/start`). **→ Minor 4** |
| 19 | "841 tests, build/lint/content-lint clean" | ⏸ not run | Cannot execute in this environment; test *files* count = 9 confirmed |

---

## Findings

No **Critical** findings. No **Significant** findings.

### Minor

**Minor 1 — "Zero content loss" slightly overstates the gate's scope.**
CLAUDE.md says the conservation gate "proves zero content loss across all 204 files." Precisely, the gate proves the **emitter conserves what the parser produces** (Gates 2/3 recompute `expected` from the parsed domain object, then compare to emitter output). It cannot, by construction, catch content that the **parser itself** silently drops (e.g. a markdown block the parser never recognizes). The Phase-4 completeness guards (≥1 verse / ≥1 paragraph / overview present / metadata non-empty / no title leak) partially backstop this at the chapter level, which is the right instinct. Recommendation: reword to "zero loss between parser output and the structured layer" (or note the parser-level caveat) so the guarantee isn't read as stronger than it is. Documentation-only.

**Minor 2 — `DeeperView` tablist lacks full keyboard semantics.**
When both sub-tabs are present, the panel uses `role="tablist"` / `role="tab"` / `role="tabpanel"` correctly for screen-reader semantics, but the tabs are plain `<button>`s without the WAI-ARIA APG roving-tabindex / Arrow-key contract that `role="tablist"` implies. It is fully operable (Tab to each button, Enter/Space activates) and many production sites ship exactly this, but a strict WCAG/APG review would flag the missing arrow-key navigation. Low severity; enhancement, not a defect.

**Minor 3 — Completeness guard checks claim-type warnings but not confidence warnings.**
The Phase-4 guard test fails the build on any `parseClaimType` "Unrecognized claim type label" warning, which is good. But `parseConfidence` has the same silent-fallback-with-`console.warn` pattern (falls back to `POSSIBLE`), and the guard does **not** assert against confidence warnings. A malformed/unknown confidence label in content would silently degrade to `POSSIBLE` without failing the suite. Cheap to close: extend the existing `warn`-spy assertion to also catch `"Unrecognized confidence label"`.

**Minor 4 — Doc staleness: "8 routes / 8 OG images."**
CLAUDE.md and the Phase-1 plan say "all 8 routes" and "8× `opengraph-image.tsx`." The tree now has **9** route segments with their own OG image (the `/start` page added in Phase 5d). Not a code defect — the new OG image is correct and present — but the count in the docs is now stale. Update to 9 when refreshing CLAUDE.md.

**Minor 5 — Read/Notes partial duplicate content (accepted by plan).**
Read (`/chapter/n`) and Notes (`/chapter/n/notes`) are each self-canonical, but both surface the same verse text (Notes wraps it with notes/glossary/supplementary). A strict SEO reviewer could flag partial duplication. The Phase-3 plan (P3-Q1=A) explicitly reasoned about this and accepted it as "genuinely different primary content" (clean reading vs. apparatus). Recording it as a known, deliberate trade-off, not a defect — no action needed unless Search Console later shows duplicate-content consolidation.

---

## What works well

- **The conservation gate is the right design.** Recomputing `expected` from the domain object rather than trusting the emitter, plus the Gate-2b totality check (`units.length === expectedTotal`) so no emitted kind can escape per-kind verification — this is exactly how you make content-loss structurally detectable rather than a promise. The `getStructuredBook` seam tests + the unknown-book empty-return test round it out.
- **Strictly additive type changes.** Five phases, and `types.ts` gained only optional fields. This is why the regression surface is small: existing parsers, the repository, and all existing UI consume the same shapes they always did.
- **The §I two-level state machine is carefully written.** `flushSub()` is called at every boundary (section, entry, sub-entry, EOF×2); `target = currentSub ?? currentEntry` routes to the innermost open container; `finalizeEntry` only attaches `subEntries` when non-empty. Parser, emitter, conservation-gate `expected`, and `context-view` rendering are all mutually consistent on the group-vs-leaf distinction.
- **DDD discipline held.** `domain/` is pure; the seam is intact; the structured layer is derived, not authored — consistent with Q1=β and Q7=defer-DB.
- **a11y claims are real.** The door nav genuinely uses `<nav>`+`aria-current` (not a fake tablist over links), and the Deeper panels genuinely stay in the DOM via `hidden` (crawlable), with tabpanel wiring only when actually tabbed.
- **Parser fragility actively mitigated.** The historical failure mode (a localized header typo silently emptying a surface — the ES-John bug) is now backstopped by the completeness guard, and the metadata-in-title-section fix is correct and locale-robust via substring matching.
- **Honest `/start` and OG handling.** `/start` only links authored books; the OG hex-token exception is documented with its reason (satori has no OKLCH), which is the correct way to take a necessary exception to the no-hex rule.

---

## Required conditions before commit

1. **Run the gates.** Confirm `pnpm test` (claimed 841), `pnpm build`, `pnpm lint`, `pnpm content:lint` are actually green — I could not execute them here. The conservation gate + completeness guards are designed to fail loudly; a green run is the last mile of this audit.
2. (Optional, cheap) **Minor 3:** extend the completeness guard to also assert no `parseConfidence` "Unrecognized confidence label" warnings, closing the silent-`POSSIBLE`-fallback gap to match the claim-type guard.
3. (Optional, documentation) **Minor 1 + Minor 4:** reword the conservation "zero loss" line to name the parser→structured scope; update "8 routes/OG" → 9.

None of these block the architecture or correctness of the work; (1) is the only true gate and is a verification step, not a fix.

---

## Recommendation

**APPROVE for commit** once the gates are confirmed green (Required Condition 1). The implementation is faithful to the locked decisions, architecturally clean, additive, and well-guarded. The Minor findings are cosmetic, documentation, or explicitly-accepted trade-offs and can be addressed in a follow-up without holding the commit.

The new-plan review (Genesis §I migration + Pattern C residual) is **deferred to the next iteration** per your instruction.
