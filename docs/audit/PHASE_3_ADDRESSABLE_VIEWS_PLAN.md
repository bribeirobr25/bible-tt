# Phase 3 Plan — Addressable Views + 3-Door IA

**Date:** 2026-06-05
**Status:** ✅ EXECUTED & VERIFIED 2026-06-05 (uncommitted). Decisions: **P3-Q1 = A** (path segments, self-canonical) · **P3-Q2 = B** (Deeper with Enrichment | Prophecy sub-tabs; both SSR'd in-DOM for crawlability) · **P3-Q3 = "Background"** (route `/context` → `/background` + 308 redirect) · **P3-Q4 = A** (verse anchors `#v{n}` + copy-link + `:target` highlight) · **P3-Q5 = A** (one-time client hash→path redirect) · **P3-Q6 = A** (Start-reading CTA, structure only; copy rewrites deferred to Phase 5).

**Done & verified:** 3 door routes (`read`/`notes`/`deeper`) each server-rendered with own `generateMetadata` (title/canonical-self/hreflang ×5/OG) + JSON-LD + per-segment `opengraph-image.tsx`; `ChapterView` (client hash-state) decomposed into server `ChapterShell` + `DoorNav` + `NotesView` + client `DeeperView` (sub-tabs, both panels in-DOM) + `LegacyHashRedirect`; Explore/Context/ChapterView/NarrativeSection retired (dead code removed); `/context`→`/background` rename + redirect; verse `#v{n}` anchors + `CopyVerseLink` + `:target` CSS; book-landing **Start reading** CTA; home "How it works" → 3 doors; sitemap + app-bar updated; i18n keys added ×4 locales. Runtime-verified: canonical/hreflang/JSON-LD/OG on all new routes; Deeper SSRs enrichment **and** prophecy; redirect 308; OG 200 image/png; sitemap has 0 stale `/context`. Gates: 826 tests · build · lint · content-lint baseline.

**Post-implementation review (2026-06-05):** full stale-reference sweep clean (no refs to deleted `ChapterView`/`ExploreView`/`NarrativeSection`, no orphan `/context` links or hash-mode keys in components). Two a11y gaps found & fixed: (1) `DoorNav` was `role="tablist"` over navigation links → corrected to `<nav aria-label>` + `aria-current="page"` (they navigate to URLs, not in-page tabs); added `nav.chapterViews` label ×4 locales. (2) `DeeperView` sub-tabs lacked tabpanel wiring → added `role="tabpanel"`/`aria-controls`/`aria-labelledby` and switched panels to the semantic `hidden` attribute (still SSR'd in-DOM, re-verified crawlable). Re-ran gates: 826 tests · build · lint clean.
**Author:** Claude Opus 4.8 (1M context)
**Parent:** `docs/audit/UX_STRUCTURE_IMPLEMENTATION_PLAN.md` (Phase 3 row).
**Upstream locks:** `docs/design/UX-REVIEW-AND-PROPOSAL.md` — **Q3 = 3-door model**: collapse 5 modes → **Read · Notes · Deeper** (Deeper absorbs Explore + Context + Prophecy + a People link, lazy-loaded); Reading is the hard default; **rename the overloaded "Context."** Depends on Phase 2 (stable IDs → verse/section anchors) + Phase 1 (canonical/hreflang machinery to extend).

---

## 1. Current state (verified)

- **5 view modes** — `reading · study · explore · context · prophecy` — live entirely in `ChapterView` (`src/ui/shared/chapter-view.tsx`) as client `useState`, synced to the **URL hash** (`#study`, `#context`, …).
- **Consequence:** only the Reading text is server-rendered into `/{locale}/{book}/chapter/{n}`. **Notes, Explore, Context, and Prophecy are invisible to crawlers and un-shareable as deep links** — a large body of unique enrichment content (2,117 enrichment entries + 48 prophecy entries, per the Phase 2 inventory) that search engines never see.
- `availableModes` already gates: explore/context need enrichment; prophecy needs prophecy.
- The tab row overflows on mobile (5 tabs) — a known UX bug the 3-door model fixes.

**The SEO upside of this phase:** turning Deeper into a real URL surfaces thousands of unique, currently-uncrawlable content units — directly serving the broad-reach thesis (Item-1 = C).

---

## 2. Target IA

| Door | URL (pending P3-Q1) | Absorbs (today) | Primary content |
|---|---|---|---|
| **Read** (default) | `/{book}/chapter/{n}` | `reading` | Clean continuous translation. Canonical chapter URL. |
| **Notes** | `…/chapter/{n}/notes` | `study` | Verse-by-verse cards + glossary + supplementary + reading guide. |
| **Deeper** | `…/chapter/{n}/deeper` | `explore` + `context` + `prophecy` (+ link to book People) | Full enrichment, then Prophecy section. Lazy-loaded. |

`Explore` (curated highlights) is **retired** as a separate mode — it was a strict subset of Context (the redundancy the UX review flagged). Optional "highlights at top of Deeper" is a future enhancement, not Phase 3.

---

## 3. Decisions to lock (audit these)

### P3-Q1 — View URL scheme (SEO-critical)
- **A (recommended): path segments, each self-canonical.** `/chapter/{n}` (Read), `/chapter/{n}/notes`, `/chapter/{n}/deeper`. Each is server-rendered with its own `generateMetadata` (title/description/canonical-to-itself/hreflang ×4/OG) and `generateStaticParams`. Rationale: Read, Notes, and Deeper present **genuinely different primary content** (clean text / verse apparatus / scholarly enrichment), so distinct canonicals are honest, not duplicate-content. This is the only option that makes the enrichment crawlable.
- B: query param `?view=notes|deeper` — addressable/shareable, but `canonical` points to the base chapter, so views are **not** separately indexed; the enrichment stays invisible to search. Less SSG output.
- C: keep hash (`#notes`) — status quo; zero SEO/shareability gain. (Rejected — defeats the phase.)

> Cost of A: chapter SSG pages ×≈3 (Read always; Notes where verses exist; Deeper only where enrichment/prophecy exist — gated like `availableModes`). Static-first, so it's build-time pages on CDN, no runtime cost. **BAR decision = ______**

### P3-Q2 — Deeper composition
- **A (recommended):** Deeper = full enrichment (the former Context) **then** a Prophecy section (where present) **then** a "People & genealogy" link to `/{book}/people`. Single scroll, progressive; Prophecy is a section, not a tab.
- B: Deeper with internal sub-tabs (Enrichment | Prophecy). More chrome; reintroduces the tab pattern we're removing.

> **BAR decision = ______**

### P3-Q3 — "Context" rename (the overloaded term)
Two surfaces use "Context": the chapter view (→ becomes **Deeper**, resolved) and the **book-level page** `/{book}/context` (cross-chapter motifs) + its nav label. Rename the book-level one so nothing reads "Context" ambiguously. Candidates for the book-level motifs page:
- **A (recommended): "Themes"** — plain, accurate (it's the cross-chapter motif surface), broad-audience.
- B: "Background"
- C: "Big Picture"
- D: keep "Book Context"

> Route stays `/{book}/context` (no redirect churn) or renames to `/{book}/themes` (cleaner URL, needs a redirect). Sub-decision P3-Q3b: **rename route too? = ______** · **BAR label decision = ______**

### P3-Q4 — Verse addressability
- **A (recommended):** stable verse anchors `#v{n}` (from Phase 2 IDs) in Read + Notes, with a hover/tap "copy link" affordance, scroll-into-view + brief highlight on load. No separate per-verse pages.
- B: defer verse anchors to a later polish pass.

> **BAR decision = ______**

### P3-Q5 — Back-compatibility
Old hash deep-links (`#study`, `#explore`, `#context`, `#prophecy`) won't reach the server (hash is client-only). Plan:
- Base `/chapter/{n}` stays = **Read** (no redirect needed; existing `/{book}/{n}` → `/chapter/{n}` redirect preserved).
- **A (recommended):** a tiny client redirect on the chapter route — if a legacy hash is present, `router.replace` to the new path (`#study`→`/notes`, `#explore|#context`→`/deeper`, `#prophecy`→`/deeper`). One-time, then dead.
- B: drop old hash links silently.

> **BAR decision = ______**

### P3-Q6 — Book landing "Start reading" (scope guard)
The UX row lists "book page leads with overview + Start reading (kills card-soup)." Proposed Phase-3 scope: **add a prominent primary "Start reading" CTA** (→ chapter 1 Read) and lead with the overview; keep Introduction/People/Themes as secondary links. **Defer the copy rewrites** (overview de-jargon, landing copy) to Phase 5 to keep this phase structural.
> Include the structural CTA now? **BAR decision = ______** (rec: yes, structure only)

---

## 4. Work breakdown (on lock)

1. **Routing** (P3-Q1=A): add `chapter/{n}/notes/page.tsx` + `chapter/{n}/deeper/page.tsx` route segments, each with `generateStaticParams` (gated: Notes where verses; Deeper where enrichment||prophecy), `generateMetadata`, JSON-LD, and an `opengraph-image.tsx` (per Phase-1 lesson: OG does **not** cascade).
2. **Decompose `ChapterView`** — extract the Read / Notes / Deeper bodies into presentational components consumed by the three routes; replace the client tab-state with a **server-rendered 3-door nav** (links, `aria-current`), keeping `ReadingProgress` + header shared via a small layout or shared header component. Lazy-load the Deeper payload.
3. **Deeper view** (P3-Q2=A): compose enrichment (former Context) + Prophecy section + People link. Retire `explore-view` from the mode set (keep the component if reused for future highlights, else remove — dead-code check).
4. **Rename** (P3-Q3): i18n message keys + nav labels; optional route rename + redirect.
5. **Verse anchors** (P3-Q4): anchor ids + copy-link affordance + scroll/highlight; `prefers-reduced-motion` respected.
6. **Legacy hash redirect** (P3-Q5) + **book landing CTA** (P3-Q6).
7. **SEO sync:** extend `sitemap.ts` with the new view URLs + their hreflang alternates; verify canonical/hreflang on every new route; re-check the 8→(8+N) OG endpoints.
8. **Docs + gates.**

## 5. Definition of Done
`pnpm test` (≥826) + `pnpm build` + `pnpm lint` + `pnpm content:lint` baseline; new routes verified server-rendered (view-source: title/canonical/hreflang/JSON-LD/OG present) across ≥2 locales; sitemap includes the new URLs; mobile 3-door nav has no overflow; legacy hash links redirect; `EXECUTION_HISTORY.md` + `PENDING.md` + `CLAUDE.md` synced; editorial/UX-plan notes updated.

## 6. Risks
| Risk | Mitigation |
|---|---|
| Duplicate-content across Read/Notes/Deeper | Distinct primary content per view + self-canonicals (P3-Q1=A); not three views of identical text |
| SSG page-count growth | Gated params (Notes/Deeper only where content exists); static → CDN, no runtime cost |
| Client→server refactor regresses the reading UX | Keep components; move state to routing incrementally; ReadingProgress/header shared; full gate + manual spot-check |
| Lost deep links | Legacy hash → path client redirect (P3-Q5) |

## 7. Next
On approval + P3-Q1…P3-Q6, execute as one committable increment (routing → decompose → Deeper → rename → anchors → back-compat → SEO sync → docs), then return for Phase 4 (de-dup + lazy payload) just-in-time decisions.
