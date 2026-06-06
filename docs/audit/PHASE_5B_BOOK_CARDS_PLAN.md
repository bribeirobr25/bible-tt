# Phase 5b — Book "tight cards" (What·When·Who·To-whom·Why)

**Date:** 2026-06-06
**Status:** ✅ EXECUTED & VERIFIED 2026-06-06 (uncommitted). Finishes the Phase-5b "book overview → tight card" item (UX-REVIEW Q6 / item 7).

**Done:** `BookCardField` type + `IntroductionData.card`; `parseBookCard` (HTML-comment block, position-parsed); `BookCard` UI; book landing leads with the card + "Read the full introduction →" (overview dump removed); i18n `nav.atAGlance` + `nav.readFullIntroduction` ×4; CARD block authored in all 12 INTRODUCTION.md (EN-first); parser tests (+13 → **840**). Runtime-verified card renders in all 4 locales (EN labels + ES "De un vistazo"/"Leer la introducción completa"). Gates: 840 tests · build · lint · content-lint baseline. Editorial-log: genesis `2026-06-06-115`, john `J-031`, matthew `M-029`.

**Post-implementation review (2026-06-06):** verified CARD block landed cleanly in all 12 (after the title block, before the first content section); all 12 intros still parse intact (7 sections · disclaimer · overview entries · card=5 — no damage); i18n present in all 4 locales; the introduction page shows **no** raw card/comment leak and still renders sections; landing card renders (EN + ES localized). **Found & removed dead code:** `getIntroductionOverview` (content-loader) — orphaned when the landing switched to `getIntroductionData`; 0 references remained. Re-ran gates: 840 · build · lint · content-lint. *(Minor note → PENDING: the card content is not yet emitted into the Phase-2 structured layer, so it won't be in a future search index.)*
**Author:** Claude Opus 4.8 (1M context)

## Goal
Replace the long book-landing overview dump with a tight 5-field card — **What · When · Who · To whom · Why** — plus "Read the full introduction →". Kills the card-soup; gives newcomers an at-a-glance orientation.

## Design (storage + parsing)
- **Storage:** a language-neutral, HTML-comment-delimited block in each `INTRODUCTION.md`, placed after the metadata block:
  ```
  <!-- CARD -->
  **What:** …
  **When:** …
  **Who:** …
  **To whom:** …
  **Why:** …
  <!-- /CARD -->
  ```
  Labels are localized in-content; the `<!-- CARD -->` delimiter is language-neutral, so parsing never depends on a localized heading (avoids the section-header fragility hit earlier in Phase 4/5).
- **Parse:** `parseIntroductionMarkdown` extracts the block → `BookCardField[] { label, value }` (by position), exposed as `IntroductionData.card`.
- **UI:** new `BookCard` component renders the rows; book landing shows the card + "Read the full introduction →", removing the long `IntroductionView` overview block.

## Work
1. Type: `BookCardField` + `card?: BookCardField[]` on `IntroductionData`.
2. Parser: `parseBookCard` in `enrichment-parser.ts`.
3. UI: `BookCard` component; rewire book landing.
4. i18n: `book.atAGlance` heading + `nav.readFullIntroduction` × 4 locales.
5. Content: author the CARD block in all 12 `INTRODUCTION.md` (EN-first → PT/DE/ES).
6. Tests (parser test for card) + docs.

## DoD
`pnpm test` · build · lint · content-lint baseline; book landing renders the card in all 4 locales (no raw labels); card parses for all 3 books × 4 locales; EXECUTION_HISTORY / PENDING / CLAUDE synced; editorial-log noted.
