# Architecture Audit — DRY / Reusability / DDD

**Date:** 2026-06-18 · **Method:** 4 parallel read-only reviewers (rendering · content-parsers · DDD boundaries · UI components). **Trigger:** the nested-emphasis render bug (`**…*x*…**`) recurring across ~96 content lines surfaced a question — is the same *code* duplicated and drifting, or doing too much (DDD)? **Status:** findings only; no refactors executed (awaiting project-lead sign-off per the gated workflow).

## Verdict

- **DDD layering is intact.** No wrong-direction imports; `domain/` is framework-pure; one renderer; `app/` routes are thin and delegate through `lib/content-loader`. The i18n `next-intl` import in `infrastructure/i18n/` is the intended adapter exception.
- **The real issue is copy-paste-then-drift**, concentrated on the **dual-label (claim-type + confidence)** concept, which has no single home. Several copies have *diverged*, producing live bugs/inconsistencies — these are the priority, because they are correctness issues, not just smell.

## Confirmed bugs caused by drift

**Active (visible) — FIXED 2026-06-18 (commit on `content-multibook-expansion`):**

1. **Renderer `prose` omitted bold** — `src/ui/shared/render-markdown-safe.ts`: `note` ran the `**`→`<strong>` pass; `prose` ran italic only, so `**bold**` in a prose field rendered literally (verified on the chapter Read door: it now emits `<strong>` with zero literal `**`). **Fixed:** added the bold pass to the prose branch; updated the contradicting test (`__tests__/render-markdown-safe.test.ts`) per the project-lead decision that prose supports bold. *(Note: this does NOT fix the nested `**…*x*…**` case — that is the separate renderer-hardening item in PENDING §5.)*
4. **Confidence→color drift** — `claim-badge.tsx:4` (canonical) vs `person-card.tsx:73`: `SPECULATIVE` was styled two ways (`bg-note-critical/15` vs `bg-bg-muted`). **Fixed:** aligned `person-card` to the canonical value; the two maps are now identical (consolidating them into one shared map remains the deferred reusability item below).

**Latent (no current content triggers them) — FOLD INTO the `labels.ts` extraction below, not hand-synced:**

2. **`parseConfidence` divergence** — `enrichment-parser.ts:109`, `prophecy-parser.ts:13`, `book-context-parser.ts:75`, `people-parser.ts:466`: ASCII `MOEGLICH`/`MOGLICH` recognized only in companions, and people-parser defaults to `UNCERTAIN` vs `POSSIBLE` elsewhere. **Confirmed latent:** no content uses ASCII-German confidence (DE uses the `MÖGLICH` umlaut, which all copies handle) and no people `**Confidence:**` value hits the fallback — so no current mis-resolution. Hand-syncing three copies that the extraction will delete would be wasteful churn; fix it by extracting one shared parser.
3. **`parseClaimType` divergence** — `enrichment-parser.ts:39`, `book-context-parser.ts:18`, `people-parser.ts:428,448`: diverging alias lists (e.g. book-context lacks the archaeological aliases). **Confirmed latent:** no CONTEXT.md label resolves differently today. Same remedy as #2 — fix via extraction.

## Consolidation opportunities (no behavior change once drift reconciled)

### Rendering (`src/ui/shared/render-markdown-safe.ts`)
- **F1 (High):** emphasis regex pair duplicated 4× (lines 36-37 table cells, 66-67 `renderInlineSafe`, 105-106 note, 110 prose). Extract one `applyEmphasis(html, {bold})`.
- **F3 (Med):** `convertTable` cells re-implement emphasis inline and therefore ignore the TT markers (`{t:}`/`{a:}`/`@@`) that `renderInlineSafe` supports → route cells through the shared inline pipeline.
- **F4 (Med):** `convertTable` bakes Tailwind class strings into emitted HTML (lines 23, 26, 33) → move to a CSS class or render the table as JSX.
- **F5/F6 (Low):** newline/`<br>` policy split between renderer and call sites (`app/[locale]/page.tsx:260-263`); `withVerseNumbers` post-pass in `continuous-reading.tsx:18-23` (acceptable decorator).

### Content parsers (`src/infrastructure/content/`)
- **(High)** one shared `parseConfidence` + `parseClaimType` (Findings 2-3) in a new `content/shared/` or `domain/content/labels.ts`; derive `CLAIM_TYPES`/`CONFIDENCE_LEVELS` arrays from the `types.ts` unions (`people-parser.ts:428-446` duplicates them).
- **(High)** one `parseDualLabel` + `DUAL_LABEL` regex covering `—|–|--` (`enrichment-parser.ts:14,325`, `book-context-parser.ts:10`).
- **(Med)** shared regex/constant module: `FIELD_LINE` (5 copies), `H2/H3/H4` headers (4 copies), `SOURCE_LABELS` (3 forms), `stripBlockquote` (`enrichment-parser.ts:275`, `book-context-parser.ts:206,213`).
- **(Med)** one `LOCALE_ALIASES: Record<ConfidenceLevel|ClaimType, string[]>` table as the single source for enum localization (fixes the `MOEGLICH` gap).
- **(Med)** `people-parser.ts` is a 1027-line god-file mixing ~6 concerns → split into `people-fields.ts` / `people-tables.ts` / `people-parser.ts` (pure refactor, no layer change). Only "doing too much" offender found.

### UI components (`src/ui/`)
- **(High)** `<Disclosure>` shared component — the `<details className="tt-details">` summary/chev/body scaffold is hand-rolled in 8 places (context-view, book-context-view, introduction-view, notes-view, supplementary-section, chapter-shell, prophecy-view, person-card). Behavior is already single-sourced in CSS; this is pure JSX duplication.
- **(High)** one canonical `confidence-tone` map (+ status variant) — fixes the SPECULATIVE drift (Finding 4).
- **(Med)** adopt `ClaimBadge` in `person-card.tsx`'s `CuriositiesBlock` (`:97-105`) — currently a divergent hand-rolled badge with no i18n.
- **(Med)** co-locate `CONFIDENCE_KEYS`/`CLAIM_TYPE_KEYS` i18n maps (`claim-badge.tsx`, `prophecy-view.tsx`).
- **(Low)** `<Disclaimer>` + `<SourceLine>` helpers; route `BookContextView` motifs through `EnrichmentEntryCard`; one `NOTE_TYPE_TOKENS` map shared by the notes legend and `NoteBlock`.

### DDD (minor; no boundary breaches)
- **(Low)** `person-card.tsx:6-9` `parseCrossBookSlug` re-derives a slug the parser already saw → emit `crossBookSourceBook` on the read model.
- **(Low)** small content transforms in route/shell: `people/page.tsx:249-252` (blockquote/bullet cleanup), `chapter-shell.tsx:61-64` (status split) → promote to derived read-model fields.

## Suggested shape of the fix

Two new homes absorb most of the drift-bugs:
- **`domain/content/labels.ts`** — pure `parseClaimType` / `parseConfidence` / `LOCALE_ALIASES` / arrays-from-unions (consumed by all 5 parsers).
- **`ui/shared/confidence-tone.ts`** + **`ui/shared/disclosure.tsx`** — one tone map + i18n keys; one disclosure component (absorbs UI High/Med items).
- **`render-markdown-safe.ts`** — one `applyEmphasis`; resolve the prose-bold intent and update the contradicting test.

Each is independently shippable behind the standard gate (test · lint · build · content-lint · conservation). Recommend sequencing the **drift bugs (correctness)** before the **pure consolidations (smell)**.
