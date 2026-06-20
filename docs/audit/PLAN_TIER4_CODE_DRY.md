# Plan — Tier 4 (code): UI helper extraction + DDD-low placement fixes (Strands 1 + 2)

**Date:** 2026-06-20 · **Status:** ✅ EXECUTED 2026-06-20 — Strand 1 (`<Disclaimer>`/`<SourceLine>`/`NOTE_TYPE_TOKENS`, 0 render diffs across 8 pages × 4 locales) + S2a (`crossBookSeeBook` field; `parseCrossBookSlug` removed from UI) + S2b (sources cleanup → parser + regression lock). **S2c deferred.** Gate green (882 tests, lint, build, content:lint, conservation 11831). Was APPROVED by external audit (`AUDIT_TIER4_CODE_DRY_PLAN.md`, 2026-06-20) — every site/count/consumer verified vs source; 3 precision notes folded in (S2a `undefined`-on-miss + don't-emit-to-`emitPeople`; S1 conditional-wrap stays at call site) + Finding 3 (`sources` has 2 consumers: route + test; add regression lock). **Scope decision: do Strand 1 + S2a + S2b; defer S2c.** **Branch:** new `tier4-code-dry` off `main`. **Source:** `ARCHITECTURE_DRY_AUDIT.md` (UI Findings 5/6; DDD-Low) + `PENDING.md` Tier 4. **Risk class:** LOW — pure structural / placement refactor, **no content/value/visible-render change by design**. Guards: byte-identical rendered HTML (UI) and parse-snapshot + conservation (parser).

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

**S1 conditional-wrap contract (audit Minor 3):** `<Disclaimer>` / `<SourceLine>` render their element **unconditionally** from props; the existing `{data.disclaimer && …}` / `{source && …}` guards **stay at each call site**. (If the component self-guarded, it'd still be fine, but the rule is: don't move the conditional into the component and don't drop it — else an empty `<div className="tt-disclaimer">` / `<p className="src">` would render where today there is nothing, failing the byte-identical gate. The single most likely S1 slip.)

**S1 guard:** **byte-identical rendered HTML** (DOM-normalized) before/after on the notes, deeper, background, introduction pages × locales (same method as Tier-3 WS1). New components in `ui/shared/` (correct layer). Optional `cx`-style unit test not needed (no className composition here).

---

## Strand 2 — DDD-low placement (move logic out of ui/app)

**S2a · `parseCrossBookSlug` → parser-emitted field (clear DDD fix).** `person-card.tsx:7` re-derives a book slug from the `**See:**` pointer via regex — that's **domain logic in `ui/`** (a `STANDARDS.md` violation). Fix: people-parser emits `crossBookSeeBook?: string` on `PersonEntry` (the resolved slug) next to the existing `crossBookSee`; `person-card` reads the field and keeps only its `bookLabels[slug]` presentation lookup. Delete `parseCrossBookSlug` from the UI.
- **Contract (audit Minor 1):** the parser emits `crossBookSeeBook = undefined` (not `""`) when the pointer doesn't match `…/PEOPLE.md`. The UI keeps the exact fallback: *if `crossBookSeeBook` && `bookLabels[crossBookSeeBook]` → link; else → plain `<Field value={crossBookSee} wide />`* (the raw pointer). Replicate the regex incl. `/i` + `.toLowerCase()`.
- **Footgun (audit Minor 2):** **do NOT add `crossBookSeeBook` to `emitPeople`'s `meta`.** The field is UI-only; conservation is byte-identical *precisely because the emitter ignores it*. Leave `structured.ts` untouched.
- *Guard:* people-data snapshot — `crossBookSeeBook` is a **new additive field**, so snapshot gains it (expected); assert **every other field byte-identical** + rendered cross-book link identical (curl). Conservation unchanged (emitter untouched; `person` count stable).

**S2b · people `sources` blockquote/bullet cleanup → parser.** `people/page.tsx:245` does `.replace(/^>\s?/gm,"").replace(/^[-*]\s+/gm,"• ")` inline in the route. Move into the people-parser so `PeopleData.sources` is emitted clean; route renders it directly. **Confirmed safe (corrected per audit Finding 3):** `PeopleData.sources` has **two consumers** — the people route (which renders it / does the cleanup today) and `people-parser.test.ts:243` (`expect(r.sources).toBeTruthy()` × 4 locales × 3 books). The opengraph-image and `emitPeople` do **not** read it (verified) — so **conservation can't shift** (it tracks only `person`/`person-curiosity`/`person-generation`/`person-region`). The test stays green (truthiness, not snapshot). The parsed `sources` string changes intentionally (pre-cleaned), so the guard is **rendered-output equivalence** (curl the people Sources section byte-identical) — the same two `replace`s, just relocated. **Add a regression lock:** in that test, after S2b, assert `r.sources` no longer contains a leading `>` or `- `/`* ` bullet (locks the relocated cleanup).

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

---

## Self-audit (2026-06-20) — verified against source; plan is complete & low-risk

Red-teamed every "could-introduce-a-bug" assumption against the current `main`:

| Check | Result |
|---|---|
| **S1c — `NoteType` member count** | Exactly 4 (`CRITICAL/LEXICAL/GRAMMATICAL/THEOLOGICAL`). Deriving the legend from one map **cannot add/drop a chip** → no regression. |
| **S1a/S1b — exact markup** | Disclaimer divs are `<div className="tt-disclaimer" dangerouslySetInnerHTML={renderInlineSafe(x)}>` with **no other attrs** (3 sites). SourceLine is `<p className="src" dangerouslySetInnerHTML={renderInlineSafe(t("enrichment.source",{source}))}>` — **identical in 2 sites** (enrichment-entry, book-context); person-card's is a `<div>` with raw text → correctly **excluded**. |
| **S1b/compliance — client vs server** | Both consumers use next-intl `useTranslations` and declare **no `"use client"`** (next-intl's `useTranslations` is server-component-compatible). `<SourceLine>` using `useTranslations` matches them exactly — no boundary issue, no `"use client"` needed. |
| **S2a — `crossBookSeeBook` vs conservation** | Conservation tracks only `person`/`person-curiosity`/`person-generation`/`person-region` multisets — **not arbitrary `PersonEntry` fields**, so the additive field is conservation-safe. The slug is used for *both* the `href` and `bookLabels[slug]`; parser must replicate the regex exactly incl. **lowercasing** (`/i` + `.toLowerCase()`). UI keeps the `bookLabels` presentation check + plain-`Field` fallback. |
| **S2b — `sources` consumers + conservation** | **One** consumer (the people route); `sources` **not** in conservation → safe (S2b upgraded from "defer" to "safe"; guard = rendered-output equivalence). |
| **Coverage completeness** | No other `tt-disclaimer` (3), `className="src"` (3, one excluded), or note-type→color map (2) sites exist beyond those enumerated — verified by grep. |

**Architecture/standards:** every change either is a pure presentation extraction into `ui/shared/` (correct layer, design tokens reused verbatim, no new hex/markup) or **moves domain logic out of `ui`/`app` into `infrastructure`/`domain`** (S2a/S2b/S2c) — strictly *improving* DDD compliance per `STANDARDS.md`. No new `dangerouslySetInnerHTML` introduced (existing calls relocated); `renderInlineSafe` remains the only HTML source. Biome-clean expected.

**Verdict:** 100% covering for the enumerated scope; the only residual judgment calls are the *value* of S2c (marginal — keep "defer if not a clean 1-field add") and the §Open-questions scope choice. No regression/side-effect surface remains unguarded.

---

## External audit applied (2026-06-20)

External audit (`AUDIT_TIER4_CODE_DRY_PLAN.md`): **APPROVE** — every enumerated site, count, and consumer verified against source; the self-audit table confirmed accurate. Folded in (each re-verified):
1. **Minor 1 (S2a contract):** parser emits `crossBookSeeBook = undefined` on regex miss; UI keeps the plain-`Field` fallback on the raw `crossBookSee` pointer. → added to S2a.
2. **Minor 2 (S2a footgun):** do **not** add `crossBookSeeBook` to `emitPeople` — UI-only field keeps conservation byte-identical. → added to S2a.
3. **Minor 3 (S1):** the `{x && …}` conditional stays at the call site; `<Disclaimer>`/`<SourceLine>` render unconditionally. → added as S1 contract.
4. **Finding 3 (S2b):** corrected "one consumer" → **two** (route + `people-parser.test.ts` truthiness assert); test stays green; **add a regression lock** there asserting `sources` has no leading `>`/bullet post-move. → added to S2b.

**Scope (Q1):** Strand 1 + **S2a** (clear DDD win) + **S2b** (verified conservation-safe `app/`-layer cleanup); **defer S2c** — the audit notes promoting a display-only string-split to a `ChapterMetadata` field is arguably *worse* DDD (domain carrying a presentation concern), so skip unless the field earns its place independently. **Q2:** person-card source-line stays separate (verified — different element + raw content).

**Verdict:** ready to execute. Sequence S1a → S1b → S1c → S2a → S2b, each its own gated revertible commit on `tier4-code-dry`; S2c dropped.
