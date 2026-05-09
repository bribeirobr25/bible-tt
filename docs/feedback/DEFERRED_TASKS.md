# Deferred Tasks — Verified Re-Audit

**Original date:** 2026-05-06
**Re-verified:** 2026-05-08 against current code, content, and rules.
**Execution underway:** Phases 0–6 of `docs/audit/FIX_IMPLEMENTATION.md` closed 2026-05-09. Phase 5.5 landed Ruleset v3.3; Phase 6A closed the 9 NOT VERIFIED audit items (incl. PT-BR Almeida Option B, EN/DE/ES *charis* slash compliance, cross-locale title-cap Option 2 normalization); Phase 6B piloted Rule 29 §734 Tier 2 Relocation Protocol on Genesis 9 across all 4 locales (technique documented; remaining 17 chapters deferred). All blocking content-lint rules pass. The remaining piece for Task 6 is John PEOPLE.md authoring (Phase 10).

For each task, the original brief is preserved (truncated where the implementation has diverged) with a current verdict appended. Verdicts: RESOLVED, PARTIAL, STILL OPEN, or SUPERSEDED.

---

## Task 1: Explore/Context View Differentiation (UI)

**Original priority:** Medium
**Current verdict:** **RESOLVED.**

`src/ui/enrichment/explore-view.tsx` lines 5–25 filter to a `HIGHLIGHT_SECTIONS` allow-list (`curiosities`, `world-at-the-time`, `scientific`) and order them deterministically. Context view continues to render the full enrichment data. The Option-1 differentiation is implemented.

---

## Task 2: Readability Pass — Grandmother/Teenager Test

**Original priority:** High
**Current verdict:** **PARTIAL.**

Spot-checks on 2026-05-08:

- `content/en/genesis/INTRODUCTION.md` glosses Masoretic Text on first mention (line 175) and discusses Documentary Hypothesis explicitly with context. Genesis introduction is broadly compliant.
- `content/en/john/INTRODUCTION.md` is clean of unglossed `Colwell`, `anarthrous`, `predicate nominative`.
- `content/en/john/study/CHAPTER-1-CONTEXT.md` still uses `Colwell` 5× and `predicate nominative` / `anarthrous` (line 100 of the chapter file glosses anarthrous as "without the article" once, but the companion does not always do so).
- Matthew companions: minimal unglossed Greek-grammar jargon, but technical literary terms are still used directly.

**Remaining work:** apply the standard to John 1–3 and Matthew 1–3 companions, and to all chapter overviews where Hebrew/Greek terms are used without an inline gloss. Genesis chapter overviews were not exhaustively re-checked.

**Files still owed a pass:**
- `content/{en,pt-br,de,es}/john/study/CHAPTER-{1,2,3}-CONTEXT.md` (12 files)
- `content/{en,pt-br,de,es}/matthew/study/CHAPTER-{1,2,3}-CONTEXT.md` (12 files)
- Any introductions / overviews that still cite Hebrew/Greek terms without gloss (re-check needed)

---

## Task 3: Section I Expansion — All 10 Categories

**Original priority:** High
**Current verdict:** **PARTIAL — superseded by combined approach.**

Section I is now organised by **scenario first, with categories integrated into each scenario's narrative**, rather than a separate top-level matrix of 10 numbered sub-entries. Examples:

- `content/en/genesis/study/CHAPTER-1-CONTEXT.md` Section I has Scenarios A (Mosaic), B (Monarchic), C (Exilic), D (Persian), each populated with category material.
- `content/en/john/study/CHAPTER-1-CONTEXT.md` Section I has Scenarios A (Pre-70 CE) and B (Post-70 CE) covering politics, economy, daily life, social structure, education, military, arts, science, religion, neighbouring peoples (referenced as the ten-category framework).
- `content/en/matthew/study/CHAPTER-1-CONTEXT.md` Section I uses the same two scenarios with a cross-reference to John 1's Section I as the foundational ten-category context, then adds Matthew-specific entries (IA-1 through IA-4, IB-1 …).

Whether all 10 categories are populated for every chapter has not been audited per chapter. The Genesis chapters past CH-1 should be sampled to confirm coverage breadth before declaring this resolved.

**Remaining work:** Spot-audit each Genesis 2–12, John 1–3, Matthew 1–3 Section I to confirm the ten categories are addressed (directly or via cross-reference) for each scenario.

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
**Current verdict:** **PARTIAL — implementation in place, John PEOPLE.md missing.**

Verified:

- `src/domain/content/types.ts` `PersonEntry` includes the expanded fields (profession, socialClass, hometown, placesLived, ageAtFatherhood, causeOfDeath, languagesSpoken, archaeologicalEvidence, extraBiblicalMentions, historicityStatus, booksAppearingIn, characterArc, etc.) plus timeline anchors (`timelineAnchor`, `yearFromCreation`, `historicalYear`).
- `src/infrastructure/content/people-parser.ts` — exists, tested (22 tests pass).
- `src/ui/people/people-timeline.tsx` and `src/ui/people/person-card.tsx` — implemented.
- `src/app/[locale]/[book]/people/page.tsx` — route exists.
- `content/{en,pt-br,de,es}/genesis/PEOPLE.md` — present, fully populated for Genesis 1–12 figures with all expanded fields.
- `content/{en,pt-br,de,es}/matthew/PEOPLE.md` — present.
- **`content/*/john/PEOPLE.md` — does not exist in any locale.** This is the open gap.

**Remaining work:**
- Author John PEOPLE.md (EN-first, then PT-BR, DE, ES) covering Yochanan the Immerser, Yeshua, Andreas, Shimon Kefa, Philippos, Nathanael, Nikodemos, Eliyahu (referenced), Mosheh (referenced), Yehudim (group entry), and other figures introduced in John 1–3.
- Re-audit Matthew PEOPLE.md governance hardening (disclaimer, source-provenance categories) — flagged in original feedback Tier-3 #33.

---

## Updated execution priority (post 2026-05-08)

| Order | Task | Reason |
|-------|------|--------|
| 1 | Author John PEOPLE.md (Task 6 finish) | Smallest open gap with biggest reader-experience win; data model and view already exist. |
| 2 | Readability pass on John + Matthew companions (Task 2 finish) | Compliance with rules' grandmother/teenager standard. |
| 3 | Section I 10-category coverage audit (Task 3 finish) | Spot-audit per chapter; backfill where missing. |
| 4 | DE first-occurrence transliteration verification (Task 5 finish) | Confirm policy applied or document the locale exception. |
| 5 | Genesis 13–50 content cycle (separately tracked in PENDING.md) | Major content project. |

Tasks 1 (Explore/Context UI) and 4 (multi-scenario framing) are complete and removed from the active queue.

---

## Cross-references

- `docs/audit/PENDING.md` — version-stamp drift, ES diacritic loss, em-dash sweep, Reina-Valera ES NT, monogenēs PT-BR.
- `docs/feedback/FEEDBACK.md` §6 — actionable shortlist combining items from this file and PENDING.
