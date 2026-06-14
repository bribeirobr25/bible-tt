# Redesign → Main App Migration Plan

**Goal:** make the production Next.js app adopt the full UI/UX, layout, and look-and-feel of the
standalone "Light & Darkness" prototype (`docs/redesign/site/`) — with **zero content loss, no
mis-references, and no regressions** to the existing pipeline, i18n, routes, SEO, or tests.

**Status:** Decisions locked (§6); **independent audit (`AUDIT_REDESIGN_MIGRATION_PLAN.md`) incorporated
2026-06-14** — all 6 findings verified against the code and applied (accent=P5-Q1 supersession,
4-way og.tsx mirror, two-tier type floor, product-identity exception, completed surface map incl.
Prophecy, green-gate numbers framed as verified targets). Ready for your review. No `src/` changes
until you approve.

---

## 0. The key finding that shapes everything

The prototype is **not a different app** — it's a **re-skin of a structure the app already has**.
A read-only audit of `src/` confirmed the app already ships:

- the **3-door IA** (Read / Notes / Deeper) as real crawlable URLs, plus introduction / people /
  background / books / start / rules / landing;
- the **same content pipeline** (5 build-time parsers → domain types → RSC pages via
  `src/lib/content-loader.ts`), already **localized for all 4 locales** (EN/PT-BR/DE/ES);
- the elements the prototype showcases: **dual-label claim+confidence chips** (`claim-badge.tsx`),
  **at-a-glance BookCard**, **SVG people timeline** (`people-timeline.tsx`), **verse `#v{n}` anchors**
  + copy-link, Deeper Background/Prophecies sub-tabs, reading-progress, share, JSON-LD/OG/SEO,
  legacy-URL + hash redirects;
- the **regression nets**: conservation gate, chapter-completeness + label-recognition guards,
  `content:lint`, 841 tests.

**Therefore the migration is primarily (a) a design-token + component-styling re-skin, plus (b) two
genuinely new surfaces (WebGL hero, Search).** It must **not** re-implement content, parsers, or i18n.

> The prototype's own Python build pipeline (`docs/redesign/tools/*.py`) and JS data files
> (`site/assets/data/*.js`) are **scaffolding for the standalone prototype only** and are **not**
> carried into production. Production already derives the same content from `content/**` via its
> TypeScript parsers. The prototype's hand-added UI strings (its `MANUAL` i18n keys) are likewise
> **not** carried over — production uses vetted `next-intl` messages.

---

## 1. Invariants — what the migration must NOT touch (the content-safety contract)

These are the guarantees that currently make content loss/mis-reference structurally impossible. The
re-skin changes **presentation only**; touching any of these voids the safety net.

1. **No edits to `content/**/*.md`** — not structure, not markers: `## ` headers, localized
   section-name sets, `### **Verse N**` patterns, note-type emoji `🔴🟢🔵🟡`, `**Label:**` metadata
   block, `**[claim — confidence]**` lines, `**Source:**`/`Quelle`/`Fonte`/`Fuente`, `<!-- CARD -->`.
2. **No changes to the parsers** (`src/infrastructure/content/*.ts`), **domain types**
   (`src/domain/content/types.ts`), the **structured layer** (`structured.ts` + `ids.ts`), or the
   **repository**. New UI consumes the **existing domain objects** from `content-loader.ts`; it never
   re-parses markdown.
3. **i18n:** do not rename/remove message namespaces or keys; **only add** keys, and add them to
   **all four** `messages/*.json` together. Reuse existing keys (`nav.door*`, `enrichment.source`,
   `notes.*`, `confidence.*`, `claimType.*`). Don't change `config/routing/request.ts`, the `[locale]`
   segment, `generateStaticParams`, `setRequestLocale`, or the provider.
4. **URLs / SEO are load-bearing:** preserve route shape, `next.config.ts` redirects + security
   headers, `sitemap.ts`/`robots.ts`, `seoMetadata()` + JSON-LD + per-route `opengraph-image.tsx`,
   and `legacy-hash-redirect.tsx`.
5. **Rendering safety:** all content strings keep flowing through `render-markdown-safe.ts` (no raw
   `dangerouslySetInnerHTML` of content).
6. **Green gate at all times:** `pnpm test` · `pnpm build` · `pnpm lint` · `pnpm content:lint` must
   stay green after every step. The current baseline (verified by execution 2026-06-14: **841 tests**,
   **284 static pages**) is the green-gate target — re-run to confirm the live numbers, don't assume.

---

## 2. Design-system delta (the actual re-skin work)

Current tokens live in `src/app/globals.css` (`@theme inline`, all OKLCH); the design rules are in
`docs/design/TT-DESIGN-SYSTEM.md`. The prototype's palette is **hardcoded hex** and must be converted.

**Already matches (no change):** three font families (Newsreader/Geist/Geist Mono), OKLCH token
architecture, warm-paper light surface, 4 note claim-type hues, reduced-motion respect, the 3-door IA,
verse superscripts, `<details>` disclosure pattern, accent already in the teal/petrol family.

**Must change to adopt the look:**

| Area | Change | Design-rule note |
|---|---|---|
| Accent | Retune `--color-accent` to the **#006475** family; add `--color-petrol` (#0a8499) + `--color-ochre` (#c98a3a) as OKLCH tokens. **This SUPERSEDES the signed-off P5-Q1 accent** (`globals.css:11-15` comment + `oklch(0.46 0.1 213)`) — log it as a P5-Q1 supersession and **re-verify WCAG AA on warm paper** + hue-distinctness from the 4 note hues (25/80/145/250) before P0 closes. | keep OKLCH only |
| OG hex mirror | `src/lib/og.tsx` hardcodes **FOUR** satori-only hex constants (`PAPER #F5F1E8`, `INK #2A2620`, `SECONDARY #5C554B`, `ACCENT #1F6A7D`) — satori has no OKLCH support, so **no automated guard catches drift**. At **P0 close, re-derive all four** from their final tokens (not just accent), since the duotone work may retune surfaces. | the one unavoidable hex surface |
| Duotone | Add **dark-surface tokens** (`#062227`/`#0a2e34`/`#0e3a42` → OKLCH) + on-dark text; full light-section / dark-section strategy **exactly as the prototype** (§6.2). | logged exception (§6) |
| Type scale | Add **fluid `clamp()` scale**; Newsreader-300 headings, `-0.02em` tracking; expand Geist Mono for kickers/labels/nav/breadcrumbs | **two-tier floor: 14px min for prose/labels, 12px ONLY for structural mono labels** — raise the prototype's 10.5/11px labels accordingly |
| Layout | Adopt **swiss-grid primitives**: `.grid-head` big-numerals, `.kick` eyebrow rule, fixed 64px header, `--maxw:1320px`, border-driven rows | — |
| Motion | Port the **`.reveal` IntersectionObserver** fade-up (JS-gated, reduced-motion safe), **800ms staggered, exactly as the prototype** (§6.5) | exceeds the 400ms cap → **logged exception** (§6) |
| Icons | Replace prototype text-glyphs (`⌕`, ASCII arrows, CSS hamburger) with **Lucide 1.5px** (`lucide-react` already installed) | design-rule required |
| Component classes | Re-express prototype CSS (`.chip`/`.conf-*`, `.glance`, `.scenario`, `.door-nav`, `.subtabs`, `.enrich`/`.prophecy`/`.person`, `.pager`, `.seam`) as **Tailwind v4 + React components** | no hardcoded hex |

---

## 3. Surface-by-surface component mapping

Each prototype page maps to an existing app route/component — re-skin in place, fed by the same loader.

| Surface | App route / component (exists) | Re-skin action |
|---|---|---|
| Landing | `app/[locale]/page.tsx` | New hero (+ optional WebGL), "Difference" compare, 3-door cards, who/scope — restyle; **NEW: WebGL hero** (§5) |
| Books | `app/[locale]/books/page.tsx` | Restyle to prototype "tight cards"/rows |
| Start | `app/[locale]/start/page.tsx` | Restyle roadmap |
| Rules | `app/[locale]/rules/page.tsx` | Restyle |
| Book hub | `app/[locale]/[book]/page.tsx` + `book-card.tsx` | Restyle at-a-glance + entry tiles |
| Introduction | `enrichment/introduction-view.tsx` | Restyle; unify its inline chips onto shared `ClaimBadge` |
| Read | `shared/chapter-shell.tsx` + `reading/continuous-reading.tsx` | Restyle calm reading + seam motif + door-nav pills |
| Notes | `study/notes-view.tsx` + `verse-card.tsx` + `note-block.tsx` + `study/glossary-panel.tsx` + `study/supplementary-section.tsx` + `study/copy-verse-link.tsx` + `study/verse-related.tsx` | Restyle verse cards + color-coded notes + glossary/supplementary; keep `#v{n}` anchors + copy-link |
| Deeper | `enrichment/deeper-view.tsx` + `enrichment-entry.tsx` + `context-view.tsx` | Restyle sub-tabs + dual-label entries + §I scenarios |
| **Prophecy** (Deeper sub-tab — live surface, own parser/tests/prototype data) | `prophecy/prophecy-view.tsx` | Restyle fulfillment-status badges + per-reading confidence pills |
| People | `people/person-card.tsx` + `people-timeline.tsx` | Restyle cards; keep the SVG timeline (retoken colors) |
| Background | `enrichment/book-context-view.tsx` | Restyle motifs |
| Chrome | `navigation/app-bar.tsx`, `door-nav.tsx`, `chapter-nav.tsx`, `language-switcher.tsx`, `locale-link.tsx`, footer | Restyle bar/breadcrumb/switcher/footer; Lucide icons |
| Shared primitives | `enrichment/claim-badge.tsx`, `enrichment/confidence-indicator.tsx`, `reading/reading-progress.tsx`, `shared/share-button.tsx` | Retoken chips/dots/progress/share to the new palette |
| Unaffected (confirm only) | `shared/json-ld.tsx`, `shared/render-markdown-safe.ts` | No visual change — verify untouched by the re-skin |
| **Search** | **none — NEW (DEFERRED, §4)** | not in this migration |

---

## 4. New surface A — Search (the app's "Phase 6")

The app has **no search route, no index, no nav search**. Plan:
1. **Build-time index** generated from the **`getStructuredBook` / StructuredUnit layer** (the
   purpose-built derived layer) — *not* a parallel pipeline. Emit a static JSON the client loads.
2. **Route** `app/[locale]/search/page.tsx` + a client search component (token scoring, snippet
   highlight, `?q=` deep link, result-kind chips) — port the prototype's `search.html` UX.
3. **Nav entry** + add to `sitemap.ts`.
4. Tests for the index generator; keep conservation gate authoritative for content.

---

## 5. New surface B — WebGL "separation field" hero

Prototype `index.html` `<canvas id="gl">` + three.js `ShaderMaterial` (Gen 1:4 light/dark shader).
The app has **no animation dependency**.
**Decision: FULL WebGL hero (locked, §6.1).** Implement as a **lazy-loaded client component** porting
the prototype's `TTSeparationField` shader; add the **three.js** dependency; **static-frame fallback**
under `prefers-reduced-motion` and a **no-WebGL fallback**; verify `mix-blend-mode` header contrast
meets WCAG AA over the animated hero; log the design-rule exception (§6).

---

## 6. Decisions — LOCKED (signed off)

1. **WebGL hero: FULL** three.js separation-field shader (as the prototype), with a static-frame
   `prefers-reduced-motion` fallback + no-WebGL fallback. Adds three.js dep.
2. **Dark surfaces: EXACTLY as the redesign** — full duotone (dark sections + cream sections, the
   prototype's `#062227`/`#0a2e34`/cream scales), not just marketing.
3. **Search: DEFERRED** to its own later phase (not part of this migration). Removed from the
   sequence below; §4 kept for reference only.
4. **Cutover: BRANCH + preview deploy, then switch** at the end.
5. **Motion: EXACTLY as the redesign** — keep the 800ms staggered `.reveal` fades (no shortening).
6. **Marketing copy:** confirmed start/rules/books body copy is already i18n-keyed in the app
   (locale coverage will not regress). A quick re-confirm is folded into P4.

### Design-rule exceptions to LOG (governance)
Because decisions 1, 2, and 5 deliberately keep prototype choices that conflict with
`docs/design/TT-DESIGN-SYSTEM.md`, the migration will **record explicit, dated exceptions** in the
design system + editorial log (not silently violate the rules):
- WebGL shader **glow + the `.seam` gradient bar** (vs anti-slop §5/§12 "Never gradients, neon, or AI glow").
- **Near-black `#062227` dark surface + on-dark light text** (vs §7 "Never pure black/white"); WCAG AA
  contrast still verified on the duotone (incl. the `mix-blend-mode` over-hero header).
- **800ms reveals** (vs the §12 "Maximum/Never exceed 400ms" cap) — reduced-motion still fully honoured.
- **Product-identity tension (higher-order):** the WebGL hero + full-duotone "spectacle" landing is in
  tension with design-system **§1 "Must NOT feel like… a startup marketing page"** and **§3 Avoid
  "VC-deck minimalism / AI glow or gradient orbs"** — not just the token-level bans. Lead has locked it;
  log it explicitly with the **mitigation**: hero is gated (reduced-motion + no-WebGL fallbacks), the
  spectacle is confined to marketing/landing, and the **calm reading surfaces (P2) stay editorial and
  unchanged in feel**.
- **Accent supersedes P5-Q1 (not an exception, a decision change):** retuning `--color-accent` overrides
  the signed-off P5-Q1 value in `globals.css` **and** its `og.tsx` hex mirror — log as "supersedes
  P5-Q1", re-verify WCAG AA on warm paper + note-hue distinctness before P0 closes.
- Still enforced (NOT exceptions): **OKLCH tokens only (no hardcoded hex)**; the **two-tier type floor —
  14px minimum for prose/labels, 12px ONLY for structural mono labels** (the prototype's 10.5/11px labels
  WILL be raised); **Lucide 1.5px icons**.

---

## 7. Proposed sequence (each phase ends green: test · build · lint · content:lint + visual check)

- **P0 — Foundations.** Convert prototype palette → OKLCH tokens in `globals.css`; add petrol/ochre/
  dark tokens + fluid type scale + swiss-grid primitives + `.reveal` system; Lucide swap. No layout
  changes yet. **P0 close-out checklist:** (a) accent retune **re-verifies WCAG AA on warm paper** +
  note-hue distinctness, logged as P5-Q1 supersession; (b) **re-derive ALL four `og.tsx` hex constants**
  (paper/ink/secondary/accent) from the final tokens (satori has no OKLCH — no automated guard).
  *Gate: nothing visual breaks; tokens resolve; OG card colors match the new tokens.*
- **P1 — Chrome.** AppBar, breadcrumb, language switcher, door-nav pills, footer, page shells.
- **P2 — Reading pages (calm).** Read + Notes + Deeper restyle (the highest-traffic, lowest-risk
  surfaces; keep legible). Verify verse anchors, copy-link, hash redirects still work.
- **P3 — Study/aux.** Introduction, People (+ timeline retoken), Background, dual-label unification.
- **P4 — Marketing (spectacle).** Landing + **full WebGL hero** (§5), Books, Start, Rules. Re-confirm
  start/rules/books body copy is i18n-keyed across all 4 locales (§6.6).
- **P5 — Hardening.** WCAG AA pass on new components + duotone contrast (incl. `mix-blend-mode` header
  over the hero), perf budget (three.js/WebGL on mobile, fonts, bundle), visual-regression snapshots
  across 4 locales, SEO parity check, **OG color-fidelity check** (render the OG cards and confirm the
  four `og.tsx` hex constants match the final tokens — the one un-guarded hex surface),
  **log the design-rule exceptions** (§6).
- **P6 — Cutover.** Branch + preview deploy → switch (§6.4).
- **(Deferred) Search** — separate later phase per §4; not in this migration.

---

## 8. Content-safety & regression strategy (how we *prove* no loss)

- The re-skin consumes existing domain objects, so the **conservation gate, chapter-completeness +
  label guards, and 841 tests remain the authoritative loss/mis-reference nets** — kept green every
  step. (They already proved zero loss in the parser→structured layer for all 4 locales.)
- **Per-surface visual diff** vs the prototype AND vs current production (Docker MCP browser), all 4
  locales, to confirm every field/entry/verse/note still renders.
- **Route/SEO regression check:** redirects, sitemap entries, JSON-LD, hreflang, OG images unchanged.
- **i18n parity:** any new keys added to all 4 locales; add a key-parity check (currently convention).

---

## 9. Explicitly out of scope (separate, upstream, content-governed)

- **Translation backfill.** The PT/DE/ES companions & notes are genuinely thinner than EN in several
  chapters (a *source* gap, faithfully shown, never fabricated). Bringing them to EN richness is
  translation work governed by the 29 rules + **Rule-28 sign-off** — not part of this UI migration.
- **Source-content cleanups** the prototype audit surfaced: emoji quoted in a few CONTEXT motifs;
  ~84 redundant `Name (Name)` in source prose. `content:lint` already tracks redundant-name; these
  are upstream copy-edits.
- The prototype's standalone Python/JS pipeline (retired after migration).

---

## 10. Acceptance criteria

- App visually matches the approved prototype across all surfaces, all 4 locales.
- `pnpm test` / `pnpm build` / `pnpm lint` / `pnpm content:lint` green; conservation gate intact.
- No route, redirect, SEO, or a11y regression; WCAG AA on new components + the duotone/blend-mode header.
- No `content/**` or parser/domain/i18n-wiring changes (presentation-only diff in `src/ui/**`,
  `src/app/**`, `globals.css`; Search deferred, so no search route/generator in this migration).
- **`og.tsx` four hex mirrors re-derived from final tokens; OG cards render in the new palette.**
- **Accent retune logged as a P5-Q1 supersession (globals.css + og.tsx), AA re-verified.**
- All design-rule exceptions (§6, incl. the product-identity tension) logged & dated in the design
  system + editorial log.
- Per-surface visual sign-off recorded in `docs/audit/EXECUTION_HISTORY.md`.
