# Phase 4 (re-scoped) — Text QA: Continuous ↔ Verse Consistency

**Date:** 2026-06-05
**Status:** ✅ EXECUTED & VERIFIED 2026-06-05 (uncommitted). De-dup-by-derivation **deferred** (unsafe — see §"Why re-scoped"); lazy-payload **confirmed done by Phase 3**. Content QA complete: B1 (ES John header accents → Notes door + overview restored, 51/25/36 verses) + B2 (ES Gen 7/9 accent typos) + B3 (EN John 2:11 "the Galil"; ES Gen 1:2 drop *había*; pt-br/john "e" was a diff artifact, no change) all applied. Added a chapter-completeness guard test. Word-equivalence: 61→**68** chapters identical; remaining 4 are intentional name-rendering. Editorial-log: genesis `2026-06-05-112`, john `J-028`. Gates: **827 tests** · build · lint · content-lint baseline.

**Post-implementation review (2026-06-05):** verified all fixes correct in-file (incl. that possessive `tu casa` / article instances were left intact and the note-level ES typos were correctly out of scope). Review surfaced **one more genuine bug — ES-wide, pre-existing:** the parser's title-block recognizer (`isTitleSection`) was missing the Spanish `Traducción Transparente`, so **every ES chapter (all 18)** parsed its title/edition block as a spurious **supplementary section** (a junk "La Traducción Transparente (TT)" card in the Notes door). Fixed (one-line regex addition; EN/PT/DE already covered) → ES supplementary counts now match the other locales; **extended the completeness guard** to fail if any title block leaks into supplementary. Separately logged (out of scope — pre-existing, **all-locale**): the chapter **metadata block is never parsed** (`extractMetadata` reads only the preamble, but the `**Base Text:**`/`**Methodology:**`/`**Divine Name Policy:**` lines live inside the title section), so those fields are empty and `edition`/`status` show fallbacks everywhere → `PENDING`.
**Author:** Claude Opus 4.8 (1M context)
**Parent:** `docs/audit/UX_STRUCTURE_IMPLEMENTATION_PLAN.md` (Phase 4 row).

## Why re-scoped (decision record)

Phase 4 was specced as "single source for verse text — derive continuous-reading; lazy Deeper payload." Investigation against all 72 chapter files showed:

1. **Derivation is unsafe.** The CONTINUOUS READING and VERSE-BY-VERSE sections are not pure duplicates — they *intentionally* differ in (a) **per-section name rendering** (each section independently applies "first occurrence = Transliterated (Familiar), later = familiar", so continuous shows `Avram (Abram)`/`Kefa` where the verse shows `Abram`/`Pedro`) and (b) **cross-verse quotation flow** (a quote that stays open across verses in continuous closes per-verse in the study view). Deriving one from the other would require a name-rendering + quotation engine and would corrupt authored text. → **De-dup-by-derivation: rejected / deferred.**
2. **Lazy Deeper payload: already delivered by Phase 3.** The route split put `DeeperView`/`ContextView`/`ProphecyView` on `/deeper`; the Read door no longer bundles them. → **Done.**

**Re-scope (lead-approved 2026-06-05):** content QA pass — audit the divergent chapters, fix the *genuine* inconsistencies the probe surfaced, leave the intentional differences alone, and add a regression guard.

## Method

Word-sequence comparison (normalize superscripts + name parentheticals + punctuation) between continuous and verse text, per chapter. 61/72 identical; 11 divergent → triaged below.

## Triage

### A. Intentional (per-section name/term rendering — NOT bugs, no change)
| File | Difference | Why intentional |
|---|---|---|
| en/genesis/10 | `Noah` (cont) vs `Noach` (verse) | First-occurrence rule differs by section |
| en/matthew/1 | `Jacob` vs `Ya'aqov (Jacob)` | Transliteration placement per section |
| pt-br/john/1 | `Kefa` vs `Pedro` | Transliterated vs familiar per section |
| pt-br/john/3 | `Perushim` vs `fariseus` | Transliterated vs familiar per section |

### B. Genuine issues — FIX

**B1 — ES John Notes door is empty (HIGH — functional bug).**
`content/es/john/CHAPTER-{1,2,3}.md` use the section header `## ESTUDIO VERSICULO POR VERSICULO` — **missing the accents**. The parser's recognized set has the correctly-accented `ESTUDIO VERSÍCULO POR VERSÍCULO` (as ES Genesis/Matthew use), so ES John parses to **0 verses** → the **Notes door shows nothing** for ES John 1–3. (Confirmed isolated to these 3 files by a full scan.)
- **Fix:** correct the accents in the verse-study header (and the `VISIÓN GENERAL DEL CAPITULO` → `CAPÍTULO` while there) in the 3 files.
- **Guard:** add a parser test asserting every chapter file parses ≥ 1 verse (so a Notes door can never silently go empty again).

**B2 — Spanish accent drift in verse text (typos).**
| File | Verse side (wrong) | Correct |
|---|---|---|
| es/genesis/7 | tu, mi, tomaras, tambien, aun, borrare, tenia, el | tú, mí, tomarás, también, aún, borraré, tenía, él |
| es/genesis/9 | sera | será |
The continuous side already has the correct accents; the verse side dropped them. **Fix:** restore correct accents in the verse text.

**B3 — Wording inconsistencies (need your editorial direction).**
| File | Continuous | Verse | Question |
|---|---|---|---|
| en/john/2 | `Cana of Galilee` | `Cana of **the** Galilee` | Greek Κανὰ τῆς Γαλιλαίας has the article → "the Galilee" is the more literal TT form. Align continuous → "the Galilee"? |
| es/genesis/1 | (omits) | `tinieblas **había** sobre…` | Heb. is verbless ("darkness over the face…"). Drop `había` in the verse to match the verbless rendering (and continuous)? |
| pt-br/john/1 | `…água **e**…` (extra) | (omits) | Which view is correct — keep or drop the `e`? |

## Proposed execution (on approval)
1. B1 (ES John header accents) + the ≥1-verse parser guard.
2. B2 (ES accent typos).
3. B3 per your direction (defaults proposed above).
4. Log each in `docs/editorial-log/{genesis,john}.md`; re-run the word-diff to confirm only intentional (A) differences remain.
5. Record the de-dup-deferred decision in `docs/architecture/CONTENT-STRUCTURE-REVIEW-AND-PROPOSAL.md`; confirm lazy-payload; update EXECUTION_HISTORY / PENDING / CLAUDE / UX-plan.

## Definition of Done
`pnpm test` (+ new ≥1-verse guard) · build · lint · content-lint baseline; ES John Notes door renders verses in all 3 chapters; word-diff shows only category-A (intentional) differences.
