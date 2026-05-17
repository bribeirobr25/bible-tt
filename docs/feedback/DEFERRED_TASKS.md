# Deferred Tasks — Verified Re-Audit

**Original date:** 2026-05-06
**Re-verified:** 2026-05-08 against current code, content, and rules.
**Execution underway:** Phases 0–6.6 of `docs/audit/FIX_IMPLEMENTATION.md` closed 2026-05-09. Phase 7 (readability sweep) closed 2026-05-13. Phase 11 Option C (John/Matthew prophecy files) closed 2026-05-13. Phase 11.5 (`scholarlyNote` parser+UI fix + Cham/Yafet AM-year compute) closed 2026-05-13. Phase 10 (John PEOPLE.md authoring across 4 locales) closed 2026-05-14. Phase 5.5 landed Ruleset v3.3; Phase 6A closed the 9 NOT VERIFIED audit items (incl. PT-BR Almeida Option B, EN/DE/ES *charis* slash compliance, cross-locale title-cap Option 2 normalization); Phase 6B piloted Rule 29 §734 Tier 2 Relocation Protocol on Genesis 9 across all 4 locales (technique documented; remaining 17 chapters deferred). All blocking content-lint rules pass.

For each task, the original brief is preserved (truncated where the implementation has diverged) with a current verdict appended. Verdicts: RESOLVED, PARTIAL, STILL OPEN, or SUPERSEDED.

---

## Task 1: Explore/Context View Differentiation (UI)

**Original priority:** Medium
**Current verdict:** **RESOLVED.**

`src/ui/enrichment/explore-view.tsx` lines 5–25 filter to a `HIGHLIGHT_SECTIONS` allow-list (`curiosities`, `world-at-the-time`, `scientific`) and order them deterministically. Context view continues to render the full enrichment data. The Option-1 differentiation is implemented.

---

## Task 2: Readability Pass — Grandmother/Teenager Test

**Original priority:** High
**Current verdict:** **RESOLVED.**

**Phase 7 closure (2026-05-13):** `docs/audit/archive/PHASE_7_PLAN.md` executed across all 32 in-scope files (24 chapter companions + 8 introductions; 4 locales × 2 books × 3 chapters + 4 locales × 2 introductions). All Phase 7 inventory terms now glossed at first use per file via either existing inline prose (preferred per audit §5.1 floor-not-ceiling) or §4-table-translated parenthetical glosses. See `docs/editorial-log/john.md` Entry J-019 and `docs/editorial-log/matthew.md` Entry M-017 for the per-file edit log. Genesis was already broadly compliant from the 2026-05-08 re-check.

**Forward-tracked separately:** Matthew PEOPLE.md per-file readability sweep — see Phase 6.6 forward-tracking item D below. John PEOPLE.md (Phase 10, closed 2026-05-14) was authored following the Phase 7 glossing convention from the outset.

---

## Task 3: Section I Expansion — All 10 Categories

**Original priority:** High
**Current verdict:** **RESOLVED 2026-05-14 via Phase 8.**

Section I is organised by **scenario first, with categories integrated into each scenario's narrative**, rather than a separate top-level matrix of 10 numbered sub-entries. Final structure:

- **Genesis 1 + John 1** carry full 10-category coverage in every scenario (Gen 1: 4 scenarios × 10 = 40 entries; John 1: 2 scenarios × 10 = 20 entries). These are the **canonical period anchors**.
- **All 16 other chapters (Gen 2–12, John 2–3, Matt 1–3)** open Section I with an explicit `> **Cross-reference:**` quote-block pointing to their canonical anchor (Genesis 1 for OT chapters, John 1 for NT chapters) for the full 10-category background. The chapter-specific entries below the quote-block address only the narrative-specific historical circumstances foregrounded in that chapter.
- **8 narrative-specific (i) Genuine gap entries** were authored in Phase 8 where the chapter's narrative content required dedicated category coverage beyond the anchor: gen/4 IA-7 Arts (origins of music + metallurgy); gen/9 IA-9 Religion (blood prohibition + bow-laid-down) + IA-10 Neighboring peoples (three-branch ethnogenesis); gen/10 IA-10 (Table of Nations schema); gen/11 IA-5 (Origins of language diversity); gen/12 IA-10 (Ur–Charan–Canaan–Egypt corridor); john/2 IA-7 (stone vessel industry); matt/3 IA-5 (camel-hair garment as prophet-uniform code). All 8 entries mirrored across 4 locales = 32 new entries total.

See `docs/audit/archive/PHASE_8_PLAN.md`, `docs/audit/archive/PHASE_8_DIAGNOSTIC.md`, `docs/audit/archive/PHASE_8_TRIAGE.md`, and `docs/editorial-log/genesis.md` Entry 2026-05-14-103 (anchor) + `docs/editorial-log/john.md` Entry J-022 + `docs/editorial-log/matthew.md` Entry M-020.

---

## Task 4: Section I Multi-Scenario Composition Framing (Rule 3 Compliance)

**Original priority:** Critical
**Current verdict:** **RESOLVED.**

Genesis Section I now presents 4 scenarios (Mosaic, Monarchic, Exilic, Persian); John and Matthew Section I present 2 scenarios (Pre-70 CE, Post-70 CE). The framing is explicit: "The TT does not take sides on when [book] was composed — it presents all major scholarly positions and lets the reader evaluate" (`content/en/genesis/study/CHAPTER-1-CONTEXT.md` line 520). The scenario-confidence labelling (DOCUMENTED / PROBABLE / POSSIBLE) is in use.

The Rule 3 compliance gap that prompted this task is closed.

---

## Task 5: Name Policy Reversal — Familiar Names as Default

**Original priority:** High
**Current verdict:** **RESOLVED in rules; LARGELY IMPLEMENTED in content.**

Rules: `RULES-CORE.md` v3.2 codifies "familiar form as default; transliterated form once per section, with exceptions for YHWH/JHWH, Yehudim, and technical transliterations." Confirmed via README.md and CLAUDE.md.

Content evidence (counts in `content/en/john/CHAPTER-1.md`):

- `Yochanan`: 20 / `John`: 54
- `Yeshua`: 19 / `Jesus`: 32
- DE same chapter: `Yochanan` 0 / `Johannes` 42 — DE may follow a stricter "familiar everywhere" line; check whether the first-occurrence transliteration policy applies in DE the same way.

EN Matthew 1: `Yeshua` 15 / `Jesus` 23; `Avraham` 16 / `Abraham` 13. PT-BR and ES not exhaustively counted but spot-check shows familiar forms dominating.

**Remaining work:**
- Verify DE first-occurrence transliteration is applied where the policy expects it (rather than fully replaced).
- Confirm sections (overviews, companion sections, prophecy entries, people entries) each gloss the transliteration on their own first occurrence — the policy resets per section, not per chapter.
- ES content has accent-loss issues (separately tracked) that interfere with name forms (e.g. `el` for `él`), but the policy itself is followed.

---

## Task 6: People & Genealogy Expansion + Dedicated View

**Original priority:** High
**Current verdict:** **RESOLVED 2026-05-14 — implementation in place, all 3 books now have PEOPLE.md across 4 locales.**

Verified:

- `src/domain/content/types.ts` `PersonEntry` includes the expanded fields (profession, socialClass, hometown, placesLived, ageAtFatherhood, causeOfDeath, languagesSpoken, archaeologicalEvidence, extraBiblicalMentions, historicityStatus, booksAppearingIn, characterArc, etc.) plus timeline anchors (`timelineAnchor`, `yearFromCreation`, `historicalYear`).
- `src/infrastructure/content/people-parser.ts` — exists, tested (51 tests pass).
- `src/ui/people/people-timeline.tsx` and `src/ui/people/person-card.tsx` — implemented.
- `src/app/[locale]/[book]/people/page.tsx` — route exists.
- `content/{en,pt-br,de,es}/genesis/PEOPLE.md` — present, fully populated for Genesis 1–12 figures with all expanded fields.
- `content/{en,pt-br,de,es}/matthew/PEOPLE.md` — present.
- `content/{en,pt-br,de,es}/john/PEOPLE.md` — present (Phase 10 closure 2026-05-14): 11 entries each (2 see-only to matthew, 5 full PersonEntry profiles, 1 Yehudim group entry, 3 see-only stubs to future books). See `docs/editorial-log/john.md` Entry J-021.

**Remaining work:** None for Task 6 core authoring. Matthew PEOPLE.md governance hardening (disclaimer, source-provenance categories) deferred to future re-audit if/when raised.

---

## Updated execution priority (post 2026-05-14, post-Phase 8)

| Order | Task | Reason |
|-------|------|--------|
| 1 | DE first-occurrence transliteration verification (Task 5 finish) | Confirm policy applied or document the locale exception. |
| 2 | Tier 2 note bloat propagation across remaining 17 chapters | Genesis 9 pilot validated technique; remaining propagation deferred. |
| 3 | Genesis 13–50 content cycle (separately tracked in PENDING.md, Phase 12) | Major content project. |

~~Author John PEOPLE.md~~ — RESOLVED 2026-05-14 via Phase 10.
~~Readability pass on John + Matthew companions~~ — RESOLVED 2026-05-13 via Phase 7.
~~Section I 10-category coverage audit~~ — RESOLVED 2026-05-14 via Phase 8.
~~Book Context page content cycle (Phase 9)~~ — RESOLVED 2026-05-15 via Phase 9.

Tasks 1 (Explore/Context UI) and 4 (multi-scenario framing) are complete and removed from the active queue.

---

## Cross-references

- `docs/audit/PENDING.md` — version-stamp drift, ES diacritic loss, em-dash sweep, Reina-Valera ES NT, monogenēs PT-BR.
- `docs/feedback/FEEDBACK.md` §6 — actionable shortlist combining items from this file and PENDING.

---

## Phase 6.6 forward-tracking items (added 2026-05-09)

Surfaced during 6.6G + 6.6H execution. None blocks the phase; each is conservatively deferred to avoid silent side-effects.

### A. Genesis Cham + Yafet `Year from creation` parseInt failures — RESOLVED 2026-05-13 (Option a — compute)

(Note: the original audit referred to "Shem + Cham" but at fix time Shem was already correct in all 4 locales; the parseInt-failing values were Cham + Yafet, not Shem.)

**Resolution:** Per project lead's Option-a decision, computed bare-integer values from Gen 5:32 + 9:24 + 10:21 + 11:10:
- **Cham:** AM 1559 (one year after Shem AM 1558; Gen 9:24 "youngest son")
- **Yafet:** AM 1556 (Noach age 500 per Gen 5:32; Gen 10:21 "Yafet the elder" majority reading)
- **Death years for both:** remain "not stated" per Prime Directive (Gen doesn't record them)

Birth-year text fields updated across all 4 locales with reasoning + scriptural anchors. Cross-locale parseInt audit now reports **0 failures**. See `docs/editorial-log/genesis.md` Entry 2026-05-13-102 for full reasoning.

### B. ES Matthew Yochanan `Año histórico — fin` line 243 — double-encoded UTF-8 mojibake

`content/es/matthew/PEOPLE.md` line 243 has the field label `**AÃ±o histÃ³rico â fin:**` (bytes show double-UTF-8 encoding of `**Año histórico — fin:**`). Because the parser's label-resolution lowercases the literal bytes, the mojibake'd label fails to match any known alias, so `historicalYearEnd = undefined` for Yochanan in ES only. Effect: Yochanan's bar appears on the EN/DE/PT-BR Matthew timeline but is silently absent from the ES Matthew timeline.

**Recommendation:** byte-level rewrite of line 243 to proper UTF-8 (`**Año histórico — fin:** 28`). Defer because this is part of a wider ES diacritic-loss issue tracked in `docs/audit/PENDING.md` (Spanish John diacritic loss — same root cause).

### C. Familiar-name redundancy post-6.6B (per FT1, post-revision audit)

After 6.6B's parser fix, headings like `## Adam (Adam)` auto-extract `familiarName = "Adam"`. The explicit `**Familiar name:** Adam` lines that were authored alongside (in case the parser couldn't extract them) are now structurally redundant on the EN entries where heading-extracted = explicit value. The 6.6B risk note recommended leaving them ("harmless, documents intent") — but a targeted future cleanup pass could remove the redundant explicit lines while preserving any whose explicit value differs from the heading-extracted value (e.g., `**Familiar name:** Abraham (the father of nations)` vs heading-extracted `Abraham`).

**Recommendation:** automated diff-pass identifying entries where heading-extracted-value === explicit-`**Familiar name:**`-value → flag for removal. Manual review per locale before applying. Estimated effort ~30 min once tooled.

### D. Matthew PEOPLE.md per-file readability sweep — RESOLVED 2026-05-13 (verified-compliant)

Phase 7 scope (`docs/audit/archive/PHASE_7_PLAN.md`) covered 32 files: 24 chapter companions + 8 introductions for John and Matthew. Matthew PEOPLE.md (4 files: en/pt-br/de/es) was explicitly out of scope because PEOPLE.md is companion-style content with a different shape (per-person entries, not per-section H2/H3 prose). This item D forward-tracked the question of whether a focused PEOPLE.md readability pass was needed.

**Verification 2026-05-13:** systematic grep audit of all 4 Matthew PEOPLE.md files for the Phase 7 §4 inventory terms:
- ***tektōn*** — present in Yosef profession field of all 4 locales; richly inline-glossed by original authors ("craftsman (*tektōn*, Matt 13:55 — rendered 'craftsman' in the TT, not 'carpenter'; the Greek covers woodworking, stone-cutting, and general construction)" and locale equivalents). Richer than the Phase 7 §4 table — preserved per audit §5.1 (floor-not-ceiling).
- ***dikaios*** — present in Yosef key-events field of all 4 locales; inline-glossed via "described as 'righteous' (*dikaios*)" and locale equivalents.
- ***sēmeion*, *Logos*, *parthenos*, *monogenēs*** — not present in any Matthew PEOPLE.md across any locale (these terms are used in chapter companions / introductions, not PEOPLE.md).
- Additional technical terms (Idumaean, Nabataean) — glossed inline in Herod's social-class field across all 4 locales ("Idumaean (Edomite) descent" / "idumeia (edomita)" / "idumäisch (edomitisch)" / "idumea (edomita)").

**Conclusion:** Matthew PEOPLE.md is already broadly Phase-7-compliant. The forward-tracking concern was precautionary; no content changes required. Item closed without further action.

**Forward dependency:** John PEOPLE.md doesn't exist yet (Phase 10 deliverable). When Phase 10 authors John PEOPLE.md, the per-file readability rule should be applied at authoring time per the same conventions. Genesis PEOPLE.md was already broadly compliant per the 2026-05-08 re-check.

### E. Prophecy-parser `scholarlyNote` gap — RESOLVED 2026-05-13 via Phase 11.5

Phase 11 round-1 audit (`docs/audit/archive/AUDIT_PHASE_11_PLAN.md` C1) surfaced that the prophecy parser silently dropped `**Scholarly note:**` lines because the field-dispatch chain in `prophecy-parser.ts` recognized only the original 7 fields. Affected 4 Genesis CHAPTER-3-PROPHECY scholarly-note lines (the Gen 3:15 *zera* grammatical analysis across 4 locales) — content authored at Genesis 3 cycle but never reaching the UI.

**Resolution via Phase 11.5** (`docs/audit/archive/PHASE_11_5_PLAN.md`, revised through one audit round):
- Added `scholarlyNote?: string` to `ProphecyEntry` domain type
- Parser dispatch for 4 locale-variant field keys (Scholarly note / Nota acadêmica / Wissenschaftliche Anmerkung / Nota académica)
- `finalizeEntry` updated explicitly per audit Critical fix (field-by-field constructor, not `...spread` — missing field would have silently dropped the value again)
- UI render in `prophecy-view.tsx` Option B (unlabeled italic with `border-t` divider, matching the existing `fulfillmentNotes` pattern)
- `prophecy.fields.scholarlyNote` i18n key in 4 locale message files (audit Significant 1 fix — `.fields.` namespace)
- 5 new parser tests (per-locale dispatch + absent-field invariant; 23→28 prophecy-parser tests; 796→801 total)
- Visual verification: all 4 locales' Genesis CHAPTER-3-PROPHECY scholarly notes now render at `/{locale}/genesis/chapter/3` Prophecy tab

See `docs/editorial-log/genesis.md` Entry 2026-05-13-102 for the full pairing with the Cham/Yafet AM-year fix.
