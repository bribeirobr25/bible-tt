# Implementation Plan — UX (Item 1) + Content Structure (Item 2)

**Date:** 2026-06-04
**Status:** DRAFT — for project-lead audit. No execution until the plan (and each phase's decisions) are locked.
**Author:** Claude Opus 4.8 (1M context)
**Upstream (decisions already locked):**
- `docs/design/UX-REVIEW-AND-PROPOSAL.md` — Q1=C (broad/civilizational) · Q2=Enoch later · Q3=3-door IA · Q4=warm-paper+accent · Q5=reading plan · Q6=overview rewrites · Q7=copy follows thesis · Q8=name deferred.
- `docs/architecture/CONTENT-STRUCTURE-REVIEW-AND-PROPOSAL.md` — Q1=β structured layer · Q2=stable IDs · Q3=SEO baseline · Q4=addressable views · Q5=de-dup · Q6=lazy payload · Q7=defer DB · Q8=search later. First move = SEO baseline.

**Why one plan:** the two items share surfaces (addressable views = 3-door IA; the structured layer assembles "Deeper"; SEO serves the broad-reach thesis), so they execute as one sequenced program.

**Operating rules (per project workflow):** static-first, DDD seam preserved, DB-portable but no DB; **per-phase decisions locked just-in-time** (don't over-spec downstream phases); **per-phase Definition of Done** = `pnpm test` (≥819) + `pnpm build` + `pnpm lint` + `pnpm content:lint` clean + editorial/PENDING sync + commit. Migrations are **incremental** (one book/type at a time behind the seam), never big-bang.

---

## Phase map

| # | Phase | Goal | Depends on | Decisions to lock |
|---|-------|------|-----------|-------------------|
| **1** | **SEO baseline** | Discoverability + shareability; fast, mostly independent | — | P1-Q (OG images) |
| 2 | Structured-layer pilot + stable IDs | Prove β content model on one book; durable IDs | 1 | tool/format; pilot book; migration mechanism |
| 3 | Addressable views + 3-door IA | Real URLs for views/verses; collapse 5 modes → Read·Notes·Deeper | 2 (IDs), 1 (canonical) | URL scheme (path vs query); "Context" rename |
| 4 | De-dup text + lazy "Deeper" payload | Single source for verse/continuous; stream enrichment | 2, 3 | derive-direction |
| 5 | UX finish | Color tokens, landing copy, reading-plan onboarding, overview rewrites | 1–3 | accent color; copy; plan progress (localStorage) |
| 6 | Search | Build-time index (Pagefind) | 2 | — |
| — | Naming · Enoch/Tier-2 scope | slotted when ready | — | name pick; Tier-2 inclusion |
| — | DB / CMS | **deferred** (keep portable) | user features | — |

The Item-1 **quick wins** (overview rewrites, 2 bugs) are partly done (bugs ✓); the overview rewrites fold into Phase 5 (or earlier as a standalone content pass).

---

## Phase 1 — SEO baseline (✅ COMPLETE 2026-06-04 — P1-Q = B / dynamic OG)

**Done & verified (uncommitted):** per-page `generateMetadata` (title/description/canonical/hreflang ×4 + x-default/OpenGraph/Twitter) on **all 8 routes**; `sitemap.ts` (132 URLs × 5 alternates) + `robots.ts`; metadataBase + title template; **dynamic OG images** via `next/og` — **one `opengraph-image.tsx` per route segment** (8 total; `opengraph-image` does NOT cascade to child segments, so each route needs its own — caught in the 1b review); every OG endpoint verified 200 `image/png`; **JSON-LD on all 8 routes** (`WebSite` / `Book` / `Chapter` + `BreadcrumbList` per content page) verified in built HTML. Gates: 819 tests · build · Biome · content-lint baseline. New files: `lib/seo.ts`, `lib/og.tsx`, `app/sitemap.ts`, `app/robots.ts`, **8× `opengraph-image.tsx`**, `ui/shared/json-ld.tsx`. (Polish deferred: vendored brand serif for OG cards.)

---

## Phase 1 — SEO baseline (original detail)

**Goal:** every page is uniquely titled, canonical, locale-cross-linked, indexable, and richly previewed — serving the broad-reach thesis (Item-1 = C).

**Scope (per route: landing, `/books`, book landing, chapter, introduction, people, context):**
1. **`generateMetadata` per page** — unique `<title>` (e.g. "Genesis 1 — The Transparent Translation") + `description` drawn from content (chapter overview / book intro overview / page purpose).
2. **Canonical URL** per page (`alternates.canonical`).
3. **hreflang alternates** — `alternates.languages` linking the 4 locale variants of each page (+ `x-default` → en). Critical for the multilingual site.
4. **`sitemap.ts`** — enumerate all locale×book×chapter + sub-pages (reuse `getAllChapterParams` + book sub-page params).
5. **`robots.ts`** — allow indexing; reference the sitemap.
6. **OpenGraph + Twitter** card metadata per page (title/description/url/site_name/locale).
7. **JSON-LD (`schema.org`)** — `WebSite` (+ `inLanguage`) on the root; `Book`/`Chapter` (or `CreativeWork`/`Article`) + `BreadcrumbList` per content page, injected as `<script type="application/ld+json">`.

**Decision — P1-Q (OG images):**
- **A (recommended):** ship a single static branded OG image now; add per-chapter dynamic images (`next/og` `ImageResponse`) in a later polish pass.
- **B:** build dynamic per-page OG images now (more work; nicer link previews).

**Notes:** all static-compatible (metadata at build time). No new deps for A. Title/description templates live in i18n messages so they localize.

**Validation:** `pnpm build` (metadata compiles); spot-check via MCP browser/view-source on 3–4 routes across 2 locales (`<title>`, `<link rel=canonical>`, `hreflang`, JSON-LD present, OG tags); `pnpm test` ≥819; optional Lighthouse SEO pass.

---

## Phases 2–6 — outline (decisions locked just-in-time, each as its own mini-plan)

- **Phase 2 — Structured layer pilot + stable IDs.** Choose the format (front-matter+body / MDX / typed tool like Velite) and a pilot book; introduce stable, locale-independent IDs (verses/notes/entries/motifs/people). Migration mechanism: parser **emits** structured records (keep authoring) vs author-rewrite — decide at phase start. Keep DB-portable; update `types ↔ SCHEMA-FUTURE.sql`.
- **Phase 3 — Addressable views + 3-door IA.** Collapse 5 modes → **Read · Notes · Deeper**; make views (and verses) real URLs (path segment vs query param — decide); rename the overloaded "Context"; book page leads with overview + "Start reading" (kills card-soup). Reuses Phase-1 canonical/hreflang.
- **Phase 4 — De-dup + lazy payload.** Single source for verse text (derive continuous-reading); lazy/stream the "Deeper" enrichment so the Reading default ships minimal JS.
- **Phase 5 — UX finish.** Produce exact **OKLCH tokens** for warm-paper + one accent (pick oxblood vs teal) + night mode, extending the People-page color energy; draft the **landing copy** (civilizational lead + transparency-as-method); build the **reading-plan onboarding** (Psalms→Proverbs→Ecclesiastes→Gospels→Revelation→Genesis; progress via localStorage — no DB); apply the **overview rewrites** (book short-form + chapter de-jargon).
- **Phase 6 — Search.** Build-time index (Pagefind) over the structured content; no DB.

**Slotted when ready:** **naming** (pick from the criteria/candidates, leaning "originals/source/text" per thesis C); **Enoch / Tier-2** non-canonical texts (clearly-labeled tier).

---

## Risks
| Risk | Mitigation |
|---|---|
| Structured-layer migration is large | Incremental — pilot one book, parser-emits-structured behind the seam; never big-bang |
| SEO templates drift across locales | Title/description templates in i18n messages; hreflang generated from one route map |
| 3-door IA loses discoverability of enrichment | "Deeper" keeps the strong Prophecy/People patterns; progressive disclosure, not removal |
| Scope creep into DB | Q7 lock = defer; design portable, don't build it |

## Next
On approval of this plan + **P1-Q**, I execute **Phase 1 (SEO baseline)** as a self-contained, committable increment, then return for Phase 2's just-in-time decisions. Each phase: plan-confirm → execute → validate → log → commit.
