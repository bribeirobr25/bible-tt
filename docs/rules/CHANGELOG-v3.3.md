# Changelog — Ruleset v3.2 → v3.3

**Date:** 2026-05-08
**Amendment type:** Emergency Amendment with retained proposal artifacts (Hybrid path per `docs/audit/FIX_IMPLEMENTATION.md` Phase 5.5)
**Rationale:** Audit cycle 2026-05-08 surfaced governance gaps in five areas — punctuation, idiom, glossary expansion, editorial-log schema formalization, and worked quadrilingual examples. All five are purely additive (no existing rule modified). No signed-off verses are affected (all current TT content is `provisional` per Rule 28). The 14-day window of the standard Lock Protocol is skipped because there is no stakeholder pool for whom it would create signal; the proposal artifact discipline is preserved by retaining all five proposals in `docs/rules/proposals/`.

---

## RULES-CORE.md

| Addition | Description |
|----------|-------------|
| **§PUNCTUATION GOVERNANCE** | Six sub-sections: §P1 em-dash convention; §P2 speech boundaries (Tier 1 main text); §P3 comma and semicolon; §P4 Spanish minimal-pair accents; §P5 German verb-period and capitalization; §P6 editorial-log entry trigger. Lint rule §0.2 enforces §P1; §0.3 enforces a subset of §P4. Source: `docs/rules/proposals/v3.3-24-punctuation-governance.md`. |
| **§IDIOM POLICY** | Six sub-sections: §I1 default literal preservation; §I2 yield when literal misleads; §I3 glossary terms never yield; §I4 Prime Directive supremacy; §I5 editorial-log entry trigger; §I6 cross-language consistency. Source: `docs/rules/proposals/v3.3-25-idiom-policy.md`. |
| **§GLOSSARY EXPANSION PROCEDURE** | Six sub-sections: §G1 threshold for proposing a new locked entry (3+ occurrences with inconsistency, OR theologically-loaded single occurrence); §G2 proposal format; §G3 approval workflow (source-language scholar + locale editors + project lead); §G4 locking; §G5 subsequent deviations; §G6 removal/revision (full Lock Protocol). Source: `docs/rules/proposals/v3.3-29-glossary-expansion-procedure.md`. |
| **§EDITORIAL LOG SPECIFICATION** (formalized) | Existing section refined with: file-level header template; entry-schema field-type table (Type, Required?, Description columns); §L1 expanded entry triggers (12 vs. previous 9, adding glossary-expansion / punctuation-deviation / idiom-yield triggers); §L2 status workflow (provisional → signed-off → superseded); §L3 cross-book references; §L4 citation convention (CORE Rule N / HB §Section / GS §Section / CORE §Section). Backward-compatible with all ~120 existing log entries. Source: `docs/rules/proposals/v3.3-30-editorial-log-schema.md`. |
| **§WORKED QUADRILINGUAL EXAMPLE** (augmented) | Added second example: John 1:1c — *theos ēn ho logos*. Demonstrates GS §Greek Article System, Rule 13 confidence labelling, Rule 21 (no smuggled commentary via capitalization), Rule 20 DE exemption, Rule 16 cross-language alignment, plus the new §Punctuation §P2 and §Idiom §I3 policies. The existing Gen 1:2 *ruach elohim* example (HB-side) is preserved alongside. Source: `docs/rules/proposals/v3.3-31-worked-quadrilingual-example.md`. |

## RULES-HB.md

| Change | Description |
|--------|-------------|
| (no changes) | RULES-HB.md is unchanged in v3.3. The Hebrew-Bible-specific rules and proper-name table remain at v3.2 lock. The proper-name-table version stamp (line 425: "(v3.2)") records the lock-version of that table; v3.3 does not modify it. |

## RULES-GS.md

| Change | Description |
|--------|-------------|
| (no changes) | RULES-GS.md is unchanged in v3.3. The Greek-Scriptures-specific rules and proper-name table remain at v3.2 lock. Same convention as RULES-HB.md. |

---

## Cascade requirements

After this changelog, the following content cascades MUST be applied:

1. **Content version stamps** — chapter front matter, PEOPLE.md, INTRODUCTION.md, companions, prophecy files, editorial-log `Ruleset version in force:` lines, editorial-log `Format: per v<X.Y>` lines: bump `v3.2` → `v3.3`. Done as Phase 5.5D.
2. **Phase 0 §0.1 lint pattern** — extend to flag `v3.0`, `v3.1`, AND `v3.2` (anything older than v3.3). Done as Phase 5.5D.
3. **CLAUDE.md** — update verified-state section ("Rules: RULES-CORE / RULES-HB / RULES-GS at v3.X") to v3.3.
4. **`docs/feedback/FEEDBACK.md`** items 24, 25, 29, 30, 31 — mark as RESOLVED.

## Proposal artifacts (retained per Hybrid Lock-Protocol path)

- `docs/rules/proposals/v3.3-24-punctuation-governance.md`
- `docs/rules/proposals/v3.3-25-idiom-policy.md`
- `docs/rules/proposals/v3.3-29-glossary-expansion-procedure.md`
- `docs/rules/proposals/v3.3-30-editorial-log-schema.md`
- `docs/rules/proposals/v3.3-31-worked-quadrilingual-example.md`

These artifacts are preserved permanently as part of the Lock Protocol's documentary discipline. Future audits can trace each policy to its proposal text, alternatives considered, and rationale.

## What was NOT changed

- The 29 numbered Rules retain their meaning. No rule was modified.
- The locked glossary in `RULES-CORE.md` and the per-supplement glossaries in `RULES-HB.md` / `RULES-GS.md` are unchanged.
- All four target-language pre-translation requirement sections (Luther, Reina-Valera, Almeida-pending) are unchanged.
- Rule 17's "Name rendering policy (v3.2)" wording is unchanged — v3.3 does not touch it; the (v3.2) parenthetical correctly attributes the policy to its lock version.

## Reviewer audit trail

- Hellenist sign-off: pending. The §Worked Quadrilingual Example (John 1:1c) is the only v3.3 addition that materially exercises GS-specific reasoning; it documents existing practice rather than introducing new GS interpretation.
- Hebraist sign-off: pending. None of the v3.3 additions modify HB-specific reasoning.
- Locale-editor sign-off: pending per locale. The §Punctuation §P4 Spanish minimal-pair section and §P5 German section bear directly on locale practice; ES/DE editors should confirm.
- Project lead sign-off: this changelog stands as the project lead's record of the Hybrid invocation.

---

## v3.3.1 emergency amendment — 2026-05-18

- **Target:** RULES-HB.md §PROPER-NAME TABLE — GENESIS 1-12 (notes section).
- **Path:** Emergency amendment per RULES-CORE.md §AMENDMENT & LOCK PROTOCOL — bug fix / audit-driven hardening, no signed-off verses affected, additive clarification only.
- **Proposal artifact:** `docs/rules/proposals/v3.3.1-emergency-DE-name-rendering-clarification.md`.
- **Change:** Appended a single bullet to the §PROPER-NAME TABLE notes clarifying that the no-parenthetical-needed rule applies bidirectionally for German. When `<Translit> == <DE Familiar>` (e.g., `Adam`, `David`, `Andreas`), the bare form is used throughout — no parens. When `<Translit> != <DE Familiar>` (e.g., `Avraham` / `Abraham`; `Yerushalayim` / `Jerusalem`; `Yeshua` / `Jesus`), the form is `<Translit> (<DE Familiar>)` at first occurrence per section, then `<DE Familiar>` thereafter. Never produce redundant `Name (Name)` where the parenthetical equals the leading word.
- **Trigger:** FEEDBACK item 35 (STILL OPEN as of 2026-05-17 re-audit; resolved 2026-05-18 via `docs/audit/DE_FAMILIAR_NAMES_PLAN.md`).
- **Content remediation:** 259 occurrences corrected across 17 DE chapter files + 1 study file in scope of sweep. 76 remaining occurrences in out-of-scope GLOSSAR + KAPITELÜBERGREIFENDE VERFOLGUNG tables left alone (table semantics differ from prose first-occurrence).
- **Editorial-log entries:** `docs/editorial-log/genesis.md` Entry 2026-05-18-107 (anchor) + `docs/editorial-log/john.md` Entry J-026 + `docs/editorial-log/matthew.md` Entry M-025.
- **Verification:** 819 tests pass (unchanged baseline); `pnpm build` clean; `pnpm content:lint` baseline clean; `pnpm lint` clean.
- **Project lead sign-off:** approved 2026-05-18 via the Q1/Q2/Q3 decision lock recorded in `docs/audit/DE_FAMILIAR_NAMES_PLAN.md` §10.

---

## v3.3.2 emergency amendment — 2026-05-18

- **Target:** RULES-CORE.md Rule 29 §People and Genealogy Files bold-paragraph block.
- **Path:** Emergency amendment per RULES-CORE.md §AMENDMENT & LOCK PROTOCOL — bug fix / audit-driven formalization, no signed-off verses affected, additive clarification only.
- **Proposal artifact:** `docs/rules/proposals/v3.3.2-cross-book-PEOPLE-formalization.md`.
- **Change:** Formalized the cross-book see-only PEOPLE.md pattern that has been in production use since Phase 6 (2026-05-09) and was extended by Phase 10 (John PEOPLE.md, 2026-05-14) + the Possible-Content Bundle (2026-05-16, Iakobos see-only stub). Documented: the markdown convention (`**See:** {book}/PEOPLE.md` + `**In <Book>:** [narrative role]`), the locale-translation table for parser aliases, the v3.3.2-published allow-list of 7 valid target slugs (genesis, matthew, john, acts, exodus, kings, isaiah), the see-only-vs-full-canonical decision criteria, the 5-change new-book activation checklist (content + bookLabels + parser aliases + i18n keys + lint allow-list), the cross-book canonical-entry transition logging convention, and the warn-only `§0.12` content-lint rule for cross-book PEOPLE pointer validity.
- **Trigger:** `docs/audit/PHASE_13_PLAN.md` (Q1=A allow-list + §0.12 lint / Q2=A v3.3.2 emergency amendment / Q3=A mention transitions in parent authoring entry / Q4=C DEFER README to separate phase / Q5=A add CLAUDE.md paragraph). Audit absorption (`docs/audit/AUDIT_PHASE_13_PLAN.md`) identified 1 critical (stub count) + 2 significant (parser-alias forward-tracked gap; 5-change new-book checklist) + 4 minor findings; all addressed pre-execution. 1 partial dissent documented (audit's misspelling claim).
- **Content remediation:** zero — documentation + lint + CLAUDE.md only. No content files touched. No code changes to `PersonEntry`, `people-parser.ts`, `person-card.tsx`, `fs-content-repository.ts`.
- **Editorial-log entry:** `docs/editorial-log/genesis.md` Phase 13 closure entry (date-based ID).
- **Verification:** 819 tests pass (unchanged baseline); `pnpm build` clean; `pnpm lint` clean; `pnpm content:lint` baseline 2 warnings (§0.10 + §0.11) + new §0.12 warn-only rule produces 0 warnings on current production content (all 7 allow-listed slugs are in use).
- **Project lead sign-off:** approved 2026-05-18 via the Q1/Q2/Q3/Q4/Q5 decision lock recorded in `docs/audit/PHASE_13_PLAN.md` §10.
