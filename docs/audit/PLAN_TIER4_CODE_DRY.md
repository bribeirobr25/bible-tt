# Plan — Tier 4 (code): UI helper extraction + DDD-low placement fixes (Strands 1 + 2)

**Date:** 2026-06-20 · **Status:** DRAFT — lightweight (no external audit; low-risk, equivalence-guarded). **Branch:** new `tier4-code-dry` off `main`. **Source:** `ARCHITECTURE_DRY_AUDIT.md` (UI Findings 5/6; DDD-Low) + `PENDING.md` Tier 4. **Risk class:** LOW — pure structural / placement refactor, **no content/value/visible-render change by design**. Guards: byte-identical rendered HTML (UI) and parse-snapshot + conservation (parser).

> Carries the proven discipline: small independently-gated revertible steps, locate-by-symbol, the guard that matches the change class. Compliance is a first-class constraint (DDD layering per `STANDARDS.md`, design-system tokens, code standards).

## Architecture-compliance guardrails (apply to every step)
- **DDD (`STANDARDS.md` §layers):** `domain/` pure (no framework); `ui/` presentation only — **no domain logic**; `infrastructure/` does parsing; `app/` is thin glue. New shared UI → `ui/shared/`. New parsed fields → `domain/content/types.ts` (pure) + populated in `infrastructure/content/*`. This *moves logic out of `ui`/`app`*, so it improves compliance, never regresses it.
- **Design system:** OKLCH tokens only (reuse the existing `var(--color-note-*)` / `.tt-disclaimer` / `.src` classes verbatim — no new hex, no markup/style change). Lucide 1.5px, no emoji — N/A here.
- **Code standards:** Biome clean; no `dangerouslySetInnerHTML` added beyond what already exists (we relocate existing calls); keep `renderInlineSafe` (HTML-escaped) as the only HTML source.

---

## Strand 1 — UI helper extraction (render-equivalent)

**S1a · `<Disclaimer>`** → `ui/shared/disclaimer.tsx`. The 3 identical sites (`introduction-view`, `context-view`, `book-context-view`) use `<div className="tt-disclaimer" dangerouslySetInnerHTML={{__html: renderInlineSafe(x)}}/>`. New `Disclaimer({ html }: { html: string })` renders exactly that; callers pass the already-resolved string (context-view keeps its `data.disclaimer || t(...)` fallback at the call site). *Encapsulates the one `dangerouslySetInnerHTML` pattern.*

**S1b · `<SourceLine>`** → `ui/shared/source-line.tsx`. **Only 2 sites are identical** — `enrichment-entry` + `book-context-view` both render `<p className="src" dangerouslySetInnerHTML={{__html: renderInlineSafe(t("enrichment.source", { source }))}}/>`. New `SourceLine({ source }: { source: string })` (uses `useTranslations`). **`person-card`'s curiosity source is OUT** — it's a different element (`<div className="src">{c.source}</div>`, raw, no i18n) → leave it; folding it in would change its markup. (Noted so it isn't "unified" by mistake.)

**S1c · one note-type token map** → export `NOTE_TYPE_TOKENS: Record<NoteType, string>` (the `var(--color-note-*)` values) from `note-block.tsx`. `note-block`'s `TYPE` and `notes-view`'s `CHIPS` both derive from it (note-block: `{cls: type.toLowerCase(), dot: NOTE_TYPE_TOKENS[type]}`; legend: map `NoteType`→lowercase for the `notes.${key}` i18n key + color). **Care:** the two current shapes differ (uppercase `NoteType` vs lowercase legend keys) — the derivation must reproduce both exactly; the render-diff gate catches any drift.

**S1 guard:** **byte-identical rendered HTML** (DOM-normalized) before/after on the notes, deeper, background, introduction pages × locales (same method as Tier-3 WS1). New components in `ui/shared/` (correct layer). Optional `cx`-style unit test not needed (no className composition here).

---

## Strand 2 — DDD-low placement (move logic out of ui/app)

**S2a · `parseCrossBookSlug` → parser-emitted field (clear DDD fix).** `person-card.tsx:7` re-derives a book slug from the `**See:**` pointer via regex — that's **domain logic in `ui/`** (a `STANDARDS.md` violation). Fix: people-parser emits `crossBookSeeBook?: string` on `PersonEntry` (the resolved slug) next to the existing `crossBookSee`; `person-card` reads the field and keeps only its `bookLabels[slug]` presentation lookup. Delete `parseCrossBookSlug` from the UI.
- *Guard:* people-data snapshot — `crossBookSeeBook` is a **new additive field**, so snapshot gains it (expected); assert **every other field byte-identical** + rendered cross-book link identical (curl). Conservation unchanged (no new unit kind; `person` count stable).

**S2b · people `sources` blockquote/bullet cleanup → parser.** `people/page.tsx:245` does `.replace(/^>\s?/gm,"").replace(/^[-*]\s+/gm,"• ")` inline in the route. Move into the people-parser so `PeopleData.sources` is emitted clean; route renders it directly. **Nuance:** this *intentionally changes the parsed `sources` string* (now pre-cleaned), so the guard is **rendered-output equivalence** (curl the people Sources section byte-identical), **not** the raw-field snapshot; verify conservation's `sources`/text handling is unaffected (if the sources text multiset shifts, confirm it's only the `>`/bullet normalization and update the expectation deliberately). *(Lowest-value item — include only if conservation stays clean; otherwise defer.)*

**S2c · `chapter-shell` short-status → derived field.** `chapter-shell.tsx:63` splits `metadata.status` inline for a short label. Add `statusShort` to `ChapterMetadata` (computed in `markdown-parser`); UI reads it. Marginal (it's borderline presentation formatting) — *include only if it stays a clean 1-field add; otherwise defer as not worth a domain field.*

**S2 guard:** parse-snapshot (additive-field-aware) + conservation + rendered-output curl equivalence + full gate.

---

## Sequence (one commit per step, revertible; gate after each)
1. S1a `<Disclaimer>` → 3 sites → render-diff.
2. S1b `<SourceLine>` → 2 sites → render-diff.
3. S1c `NOTE_TYPE_TOKENS` → render-diff (legend + note-block).
4. S2a `crossBookSeeBook` field → snapshot(additive) + render-diff.
5. S2b sources cleanup → parser (rendered-output equivalence; **abort/defer if conservation shifts unexpectedly**).
6. S2c `statusShort` field (**defer if not clean**).
7. Docs/logs (EXECUTION_HISTORY + PENDING + ARCHITECTURE_DRY_AUDIT findings closed).

## Definition of done
Each step: `pnpm test · lint · build · content:lint` green · conservation 11,831 (or a deliberately-reviewed sources delta for S2b) · render-equivalence on affected pages × locales · DDD layering intact (logic moved *out* of ui/app, new fields pure in domain) · no new hex/markup/style. Branch → PR → merge on your authorization.

## Open questions
1. **S2b / S2c** are the lowest-value (and S2b has the parse-field-change nuance) — do both, or just S2a (the clear DDD fix) + Strand 1?
2. `person-card` source-line stays separate (different markup) — agreed?
