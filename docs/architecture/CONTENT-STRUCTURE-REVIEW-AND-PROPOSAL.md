# Content Structure Review & Proposal (Item 2 — Data / Content Architecture)

**Date:** 2026-06-04
**Status:** DECISIONS LOCKED 2026-06-04 — **Q1=β · Q2=yes · Q3=yes · Q4=yes · Q5=yes · Q6=yes · Q7=defer · Q8=later; first move = SEO baseline** (see §Decision locks). Implementation pending its own plan. **Read-only review; no content/parser code changed by this review.** (The two unrelated UI bug-fixes from the same session are separate.)
**Author:** Claude Opus 4.8 (1M context)
**Method:** Code audit of the real source — `domain/content/types.ts`, all 5 parsers, `fs-content-repository.ts`, `content-loader.ts`, i18n `config.ts`/`routing.ts`, the app routes (`[locale]/layout.tsx`, chapter `page.tsx`), plus the raw content-file format and the live-site findings from the Item 1 UX review.
**Lenses (as requested):** search · SEO · performance · i18n · DB-migration readiness — plus maintainability/parser-fragility, which underpins all of them.

---

## Part 1 — How content works today

```
authored prose markdown (content/{locale}/{book}/*.md)
        │   ← human-formatted; bold-label "front matter", emoji note markers, md tables
   5 hand-rolled parsers (~2,200 LOC; people-parser alone 872)
        │   ← regex + line-splitting; locale keywords hardcoded
   typed domain objects (ChapterData, EnrichmentData, PersonEntry…)
        │
   fs-content-repository → content-loader (the single seam)
        │
   Next.js App Router → SSG (generateStaticParams) → static HTML/CDN
```

- **Source of truth:** human-formatted markdown (no YAML front-matter, no `gray-matter`, no `remark`/`rehype` — all parsing is custom). Metadata is bold-label lines (`**Base Text:** …`); notes are classified by **emoji** (🔴🟢🔵🟡); sections are matched by **hardcoded localized header strings** (`CONTINUOUS READING` / `LEITURA CONTÍNUA` / …); verses by `### **Verse N**` regex (with `Versículo`/`Vers` variants); glossary/people by markdown-table pipes.
- **Rendering:** static-first (SSG), minimal client JS (7 client components). Inline markdown rendered via a small custom `renderMarkdownSafe`/`renderInlineSafe`.
- **i18n:** 4 locales (`en`, `pt-br`, `de`, `es`), URL-prefixed via next-intl; one independent markdown file per locale.

---

## Part 2 — Findings

### Strengths (keep these)
1. **Clean DDD seam.** `content-loader.ts` is the only bridge; the repo reads by path convention. A future swap (DB/CMS) touches only the repo + loader — the litmus test holds.
2. **Rich, well-typed domain model.** `ChapterData`, `EnrichmentData`, `PersonEntry` (~40 fields), `ProphecyEntry`, `BookContextMotif` — these map cleanly to tables; `SCHEMA-FUTURE.sql` already anticipates it. **The *types* are DB-ready.**
3. **Static-first + lean deps** (8 prod deps). Fast by default; cheap to host.

### Risks & gaps (the work)

| # | Finding (grounded in code) | Hits which lens |
|---|---|---|
| **R1** | **Source of truth is human-prose markdown parsed by ~2,200 LOC of fragile, locale-hardcoded, marker-dependent parsers.** A missing emoji, a header typo, an accent variant, or stray `**` silently drops/mis-classifies content. This is the root cause of the recurring bugs (mojibake, label-alias misses, `scholarlyNote` silent-drop, slug collisions, the `**` render bug, DE redundant-parens). | maintainability, i18n, search, DB |
| **R2** | **No stable IDs.** Verses/notes/entries/motifs are positional (array-index React keys); people use derived slugs. Cross-locale alignment is **by array position only**. | i18n integrity, search anchoring, cross-refs, DB primary keys, deep-linking |
| **R3** | **SEO is essentially absent.** Only the root layout has metadata. **No per-page `generateMetadata`** (every chapter shares one generic `<title>`), **no `canonical`, no `hreflang`/`alternates`** across the 4 locales, **no `sitemap.ts`, no `robots.ts`, no OpenGraph, no JSON-LD/schema.org.** For the Item-1 broad-reach thesis (discovery beyond existing readers), this is the single biggest miss. | SEO |
| **R4** | **View-modes (and verses) are not addressable URLs.** `chapter-view.tsx` is a client component holding tab state; the `#study`/`#explore` hashes don't deep-link (verified live). So Study/Explore/Context/Prophecy and individual verses can't be linked, shared, or indexed separately. | SEO, UX (= Item-1 Q3), search |
| **R5** | **Content duplication.** Each chapter file authors the **continuous-reading** text *and* the **verse-by-verse** text separately; they must be kept identical by hand, per locale × 4. Divergence risk. | maintainability, i18n |
| **R6** | **i18n = parallel files, position-aligned, with parser keywords hardcoded per locale.** Locales drift (observed: DE parens, ES mojibake, count mismatches); adding a 5th locale multiplies files *and* parser keyword sets. | i18n |
| **R7** | **Whole enrichment payload hydrated client-side.** The chapter page passes all enrichment + prophecy data into the client `ChapterView` even for the Reading default → larger JS/serialized payload than needed; grows with content. | performance |
| **R8** | **No search**, and prose-markdown isn't index-friendly without the parsers. A structured layer would unlock build-time search (Pagefind) or DB full-text. | search |

**Bottom line:** the *architecture* (DDD seam, typed model, SSG) is sound; the **source format and the absence of IDs + SEO** are the weak links — and they're exactly what limits search, SEO, i18n integrity, and a clean future DB move.

---

## Part 3 — Proposal (options + decision points)

### The central fork (Q1) — content authoring model
A spectrum from least to most change:

- **α — Harden the markdown.** Keep prose markdown; add **YAML front-matter** for metadata + **stable IDs**; consolidate/validate the parsers (schema check at build; fail loudly, not silently). Lowest disruption; fixes R1 partially, R2.
- **β — Structured content layer (recommended).** Author content in a **typed, structured form** — verses/notes/entries as keyed records (front-matter + body, MDX, or a typed content tool like Velite/Contentlayer) with **stable IDs** and **explicit locale alignment**. One validated schema; parsing becomes loading. Big win across R1/R2/R5/R6/R8 and makes R3/R4 and a future DB trivial. Medium effort, staged.
- **γ — DB / headless CMS now.** Move content into a DB or git-backed CMS. Highest effort; **premature** — `PLAN.md` is right that static-first wins until *user* features exist.

*Recommendation: **β, staged**, explicitly **not γ yet.** Design the structured layer to be **DB-portable** (so γ later is a load-swap, per the existing seam). α is the fallback if β's authoring-migration cost is judged too high now.*

### Decision points
- **Q1 — Authoring model:** α harden-markdown / **β structured layer** / γ DB-now. *(rec: β staged)*
- **Q2 — Stable IDs:** introduce durable, locale-independent IDs for verses, notes, enrichment entries, motifs, people. *(rec: yes — foundational; unblocks R2/R4/R6/search/DB)*
- **Q3 — SEO baseline (high-ROI, largely independent — do soon regardless of Q1):** per-page `generateMetadata` (unique title/description), `canonical` + **`hreflang` alternates** for the 4 locales, `sitemap.ts`, `robots.ts`, OpenGraph, and JSON-LD (`schema.org` Book/Chapter/Article). *(rec: yes, prioritize)*
- **Q4 — Addressable views/verses:** make view-modes real URLs (path segment or query param) and verses anchor-linkable, so they're shareable + indexable. Ties directly to Item-1 Q3 (3-door IA). *(rec: yes)*
- **Q5 — De-duplicate text:** single source for verse text; derive continuous-reading from it (or vice-versa). *(rec: yes)*
- **Q6 — Performance:** stream/lazy-load the enrichment "Deeper" payload instead of hydrating it all on the Reading default. *(rec: yes, with the Item-1 3-door build)*
- **Q7 — DB posture:** confirm **defer** DB/CMS until user features; keep the structured layer DB-portable + the `types ↔ SCHEMA-FUTURE.sql` mapping current. *(rec: defer)*
- **Q8 — Search:** defer until the structured layer lands, then add build-time search (Pagefind) — no DB required. *(rec: defer, enabled by Q1=β)*

### Interplay with Item 1 (why this review came first)
Q4 (addressable views) **is** the Item-1 Q3 surface; the **β structured layer** is what cleanly assembles the Item-1 "Deeper" view; Q3 **SEO** serves the Item-1 broad-reach thesis. So these structure decisions should lock **before** the Item-1 UX build — which is exactly why we sequenced the structure review first.

---

## Decision locks (2026-06-04)

- **Q1 = β — Structured content layer, staged.** Move to typed, keyed, ID'd content; migrate incrementally behind the existing seam; **DB-portable** but **not γ** (no DB yet).
- **Q2 = Yes — stable, locale-independent IDs** for verses, notes, enrichment entries, motifs, people. Foundational.
- **Q3 = Yes — SEO baseline.** Per-page `generateMetadata` + canonical + hreflang alternates + `sitemap.ts` + `robots.ts` + OpenGraph + JSON-LD. **Ships first** (see sequencing).
- **Q4 = Yes — addressable views/verses** (real URLs; ties to Item-1 Q3 3-door IA).
- **Q5 = Yes — de-duplicate** continuous-reading vs. verse text (single source, derive the other). → **REVISED 2026-06-05 (Phase 4): de-dup-by-derivation DEFERRED as unsafe.** Investigation (all 72 chapter files) found the two views are *not* pure duplicates: they intentionally differ in (a) per-section name rendering (first-occurrence "Transliterated (Familiar)" applied independently per section → `Avram (Abram)`/`Kefa` in continuous vs `Abram`/`Pedro` in verses) and (b) cross-verse quotation flow (a quote open across verses in continuous closes per-verse in the study view). Deriving one from the other would need a name-rendering + quotation engine and would corrupt authored text. **Instead** (Phase 4 re-scope, lead-approved): a content-QA pass fixed the genuine drift the probe surfaced and a build-time guard (`conservation.test.ts`: every chapter parses ≥1 verse/paragraph/overview) now prevents a section-header typo from silently emptying a reading surface. See `docs/audit/PHASE_4_TEXT_QA_PLAN.md`.
- **Q6 = Yes — lazy/stream** the "Deeper" enrichment payload instead of hydrating it on the Reading default (with the Item-1 3-door build). → **DONE 2026-06-05 via Phase 3:** the route split put `DeeperView`/`ContextView`/`ProphecyView` on `/deeper`, so the Read door no longer bundles the enrichment payload.
- **Q7 = Defer DB / CMS**; keep the structured layer DB-portable and the `types ↔ SCHEMA-FUTURE.sql` mapping current.
- **Q8 = Search later** (Pagefind / static index), enabled by Q1=β; no DB required.
- **Sequencing = SEO baseline first**, then structured-layer pilot + IDs → addressable views / 3-door → de-dup + lazy payload → search. The Item-1 UX pieces (color tokens, landing copy, onboarding plan, overview rewrites) interleave.

## Out of scope / next
- This is a proposal; **no content/parser code changed here.**
- After locks, implementation is its own plan, and would be **interleaved with the Item-1 UX build** (shared surfaces: addressable views, the Deeper assembly, SEO). Likely order: SEO baseline (Q3, fast win) → stable IDs + structured layer pilot on one book (Q1/Q2) → addressable views (Q4) → de-dup + lazy payload (Q5/Q6) → search (Q8). DB (Q7) stays deferred.
- A migration would be **incremental** (one content type / one book at a time behind the existing seam), not a big-bang rewrite.
