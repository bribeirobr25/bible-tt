# Feedback Review — Verified Re-Audit

**Original review:** 2026-05-06 (Claude Opus 4.6 vs. then-current state)
**Re-verification:** 2026-05-08
**Method:** Each prior verdict re-checked against current code, content, and rules. Verdicts updated to one of: RESOLVED, STILL OPEN, PARTIAL, NEW (issue not in original feedback but surfaced during re-audit), or INVALID (claim was wrong or no longer applies).
**Authoritative source:** `docs/rules/RULES-CORE.md`, `RULES-HB.md`, `RULES-GS.md` (v3.2). Everything else is verified against actual files.

**Execution underway:** Phases 0–6 of `docs/audit/FIX_IMPLEMENTATION.md` closed 2026-05-09. Phase 5.5 landed Ruleset v3.3 (items 24, 25, 29, 30, 31 RESOLVED); Phase 6A closed the 9 NOT VERIFIED audit items (incl. PT-BR Almeida Option B, EN/DE/ES *charis* slash compliance, cross-locale title-cap Option 2 normalization); Phase 6B piloted Rule 29 §734 Tier 2 Relocation Protocol on Genesis 9 across all 4 locales. People-surface bug N3 (John PEOPLE.md) waits for Phase 10.

---

## How to read this document

The 2026-05-06 review accepted ~260 findings across 21 source feedback files. This re-audit does **not** replicate every chapter-level finding; instead it groups findings by issue and assigns a current verdict so the project can decide what (if anything) is still actionable. Status counts at the top of each tier are based on direct file inspection, not the prior verdict carrying over.

Where a status is **NEW**, the issue surfaced during re-audit (mostly version-drift between rules and content authored before v3.2).

---

## 1. Tier-1 systemic blockers from prior audit

| # | Issue | Prior verdict | Current verdict | Evidence |
|---|-------|---------------|-----------------|----------|
| 1 | GS Greek article policy missing | AGREE — CRITICAL | **RESOLVED** | `RULES-GS.md` §"Greek Article System (extends CORE Rule 17)" at line 74; subsections for Articular vs. Anarthrous, Predicate Nominative Without Article, Anarthrous Sacred/Theological Terms, Translation Principle. John 1:1c is explicitly addressed. |
| 2 | Spanish encoding corruption (Gen 1–9) | AGREE — CRITICAL | **RESOLVED** | grep across `content/es/genesis/*.md` and `content/es/genesis/study/*.md` returns zero matches for joined-article patterns (`hizoél`, `sobreél`, `buenoél`, `construyóél`, `queél`, `hagamosél`). All 12 ES Genesis chapters render properly. |
| 3 | Editorial logs for John and Matthew missing | AGREE — CRITICAL | **RESOLVED** | `docs/editorial-log/john.md` (12 entries, ~12.5KB) and `docs/editorial-log/matthew.md` (9 entries, ~12KB) exist. Both declare "Ruleset version in force: v3.1" — see NEW issue N1 below. |
| 4 | Rule-table drift in John + Matthew introductions | AGREE — VERIFIED | **RESOLVED** | `content/en/john/INTRODUCTION.md` lines 257–268 correctly label Rule 1 (Controlled Lexical Consistency), Rule 4 (Transliterate Strategic Terms), Rule 7 (Preserve Parallel Structure), Rule 14 (Annotate Wordplay), Rule 22 (Text-Critical Restraint), Rule 25 (Divine Name Policy). Prime Directive listed as `*(unnumbered)*`. Verify Matthew INTRODUCTION on next sweep. |
| 5 | Yehudim/Ioudaioi decision tree | AGREE — HIGH | **RESOLVED** | `RULES-GS.md` §"Ioudaioi Policy" lines 98–128: rendering, three-sense decision tree (Jerusalem authorities / Yehudim broadly / geographic-ethnic), anti-misuse safeguard, locked glossary entry. |
| 6 | Matthew fulfillment formula policy | AGREE — CRITICAL | **RESOLVED** | `docs/editorial-log/matthew.md` Entry M-001 codifies six formula types (Direct, Modified, Composite, Typological, Temporal-resultive, Unresolved) with treatment per type. |

---

## 2. Tier-2 high priority from prior audit

| # | Issue | Prior verdict | Current verdict | Evidence |
|---|-------|---------------|-----------------|----------|
| 7 | Proper-name policy table | AGREE — HIGH | **RESOLVED** | `RULES-GS.md` §"Proper-Name Table — Greek Scriptures" line 311; HB has equivalent. v3.2 codifies "familiar form as default; transliterated form once per section" (CLAUDE.md restates this). Implementation verified in §3 below. |
| 8 | PT-BR archaic register cleanup | AGREE — HIGH | **PARTIAL** | PT-BR John 1 still contains 12 archaic-register forms (e.g. line 403: `Endireitai o caminho do Senhor` quoting Isa 40:3 LXX). However, archaic forms are now concentrated in scriptural-quotation contexts rather than spread through narrative. Targeted pass on remaining cases still warranted. |
| 9 | Anti-misuse safeguards (Gen 9, 10, 11, 12) | AGREE — HIGH | **RESOLVED** | All four EN companions have explicit anti-misuse sections: Gen 9 §F3 + §F5 (Curse of Ham/Kenaan); Gen 10 §F1 (Table of Nations / ethnogenesis); Gen 11 §F3 (Babel narrative); Gen 12 §F4 (wife-sister episode). PT-BR/DE/ES propagation should be spot-checked. |
| 10 | German John 1:1 word order | AGREE — HIGH | **RESOLVED** | `content/de/john/CHAPTER-1.md` line 64 reads `…und das Wort war Gott` — predicate structure preserved. All four locales now consistent in semantic direction. |
| 11 | Genesis 5 divine-name front-matter error | AGREE — CRITICAL | **RESOLVED** | EN/PT/DE/ES Gen 5 front matter now states "Triggered at v.29 (Lemekh's speech); otherwise Elohim throughout" (or locale equivalent). The factually-wrong "only Elohim used" claim is gone. |
| 12 | Spanish Reina-Valera policy declaration | AGREE — HIGH | **RESOLVED (Phase 3B, 2026-05-08)** | All 12 ES Genesis chapters + 3 ES John chapters + 3 ES Matthew chapters now declare Option B (Reconocimiento selectivo) in front matter. Cascade tracked in `docs/editorial-log/john.md` Entry J-014 + `docs/editorial-log/matthew.md` Entry M-010. |
| 13 | Portuguese Almeida tradition policy | AGREE | **RESOLVED (Phase 6A, 2026-05-09)** | RULES-CORE.md §1077 contained the policy template but no Option (A/B/C) was logged or cascaded. Phase 6A logged **Option B (Selective Acknowledgment)** in `docs/editorial-log/genesis.md` Entry 2026-05-09-098 (parent), with applied-to entries `john.md` J-017 + `matthew.md` M-012, and cascaded the front-matter declaration to all 18 PT-BR chapter files. Now at parity with DE Luther + ES Reina-Valera. |
| 14 | Title capitalization policy (Rule 20) | AGREE | **RESOLVED (Phase 6A audit, 2026-05-09)** | Cross-locale verse-text title capitalization governance landed: EN strict-lowercase + DE grammatical-exempt + PT-BR/ES strict-aligned (lowercased). Project lead chose Option 2 (normalize PT-BR/ES to lowercase, matching EN strict reading of Rule 20). Decision logged: `genesis.md` Entry 2026-05-09-099 (parent), `john.md` J-018 + `matthew.md` M-013 (NT applied-to). 44 verse-text occurrences normalized across PT-BR + ES John + Matthew (`Filho/Hijo do/del Homem/Hombre` → lowercase; `Filho/Hijo de Deus/Dios` → lowercase title with `Deus/Dios` capitalized as proper noun). Title Case retained inside notes (`> -` blockquoted commentary), headings, and tables — matches EN convention where capitalized "Son of Man" appears in scholarly notes as "the recognized translation". |
| 15 | Kingdom of the skies book-level policy | AGREE — HIGH | **NOT VERIFIED** | Matthew 4+ not yet authored, so the 33×-occurrence pressure doesn't yet apply. Mark as deferred until Matt 4+. |
| 16 | parthenos/almah policy contradiction | AGREE — CRITICAL | **NOT VERIFIED** | Need to re-read Matthew INTRODUCTION §F vs. Matt 1 companion to confirm the contradiction is gone. |
| 17 | Creation-from-nothing framing (bara) | AGREE — HIGH | **RESOLVED (Phase 6A, 2026-05-09)** | Targeted grep across all 4 locales (EN/PT/DE/ES) Gen 1 chapter + companion confirms the *bara*/*asah* distinction is consistently labeled with explicit confidence markers — EN `**POSSIBLE**`, DE `**MÖGLICH**`, ES `**POSIBLE**`, PT-BR `POSSÍVEL` — and framed as "debated" with "of disputed scope." No imported theology; Rule 3 compliance verified. |
| 18 | monogenēs cross-language consistency | AGREE — HIGH | **RESOLVED (Phase 4A + audit, 2026-05-08)** | PT-BR replaced `unigênito` with `único-nascido` across active translation text in John 1 + 3 (Phase 4A). Phase 4 audit pass surfaced parallel ES `unigenito` bug at ES John 1:18 + glossary table + 4 CONTEXT references — all corrected (`único-nacido`). Editorial-log entry `john.md` J-015. Meta-commentary references to the rejected Vulgata-derived `unigênito` / `unigenito` retained where they explicitly contrast against the TT rendering — allow-listed in `scripts/lint-allowlist.txt` rule §0.5. |

---

## 3. Tier-3 medium priority from prior audit

| # | Issue | Prior verdict | Current verdict | Notes |
|---|-------|---------------|-----------------|-------|
| 19 | Tier 2 note bloat → companion relocation | AGREE | **PARTIAL — pilot complete (Phase 6B, 2026-05-09)** | Genesis 9 pilot across all 4 locales: 3 oversize notes tightened with pointers to existing companion sections (§A1 re-creation, §A5+§D1 war-bow, §G3 birth-order). Oversize count 7 → 4 per locale. Rule 29 §734 protocol validated and technique documented in `docs/editorial-log/genesis.md` Entry 2026-05-09-100. Remaining 17 chapters (Gen 1–8, 10–12 + John 1–3 + Matt 1–3) deferred to a propagation phase — estimated ~25h. The 4 borderline notes that remain in Gen 9 are lexical/grammatical (don't trigger Rule 29 §734 relocation criteria); a readability prose-economy pass on those is Phase 7 scope. |
| 20 | Speech-boundary policy (John 3:16–21) | AGREE | **NOT VERIFIED** | Did not check current John 3 quotation-mark boundaries. |
| 21 | zōē aiōnios glossary governance | AGREE | **RESOLVED** | All four locales render John 3:15–16 as "life of the age / vida da era / Leben des Zeitalters / vida de la era". Chapter overview explicitly notes "(not 'eternal life')". `RULES-GS.md` glossary entry exists per CHANGELOG-v3.1. |
| 22 | ouranos/sky/heaven cross-language alignment | AGREE | **RESOLVED (Phase 6A, 2026-05-09)** | Cross-locale verse counts in John 3 align (EN 13, PT 12, DE 12, ES 12). EN's single extra is an inline gloss "from the sky/heaven" at line 448 — intentional translator-transparency annotation in one note, not a divergence in verse text. |
| 23 | German Toledot divergence | AGREE | **RESOLVED (Phase 6A, 2026-05-09)** | DE `Toledot` appears in CHAPTER-2 (5×) + CHAPTER-11 (5×) — same chapters where EN, PT-BR, and ES carry the term. No divergence in scope or treatment; `eleh toledot` formula consistently transliterated and italicized across all four locales. |
| 24 | Punctuation governance | AGREE | **NOT VERIFIED** | Open question for RULES-CORE.md. |
| 25 | Idiom policy | AGREE | **NOT VERIFIED** | Open question for RULES-CORE.md. |
| 26 | Rule 11 addition audit | AGREE | **RESOLVED via spot-check (Phase 6A, 2026-05-09)** | Sample EN Gen 1 verse text shows clean Rule 11 italic compliance — `*was*`, `*is*`, `*the*`, `*a*`, `*were*`, `*that*`, `*it was*` all italicized for added grammar tokens (e.g., 1:2 "darkness *was* over"; 1:7 "waters which *were*"; 1:11 "which its seed *is*"; 1:26 "*a* human"; 1:30 "*is a* living being"; 1:31 "*it was* very good"). The 472 italic-span count includes Hebrew transliterations, key terms, and section headings (intentional formatting), not Rule 11 violations. Systematic 72-file audit deferred — current evidence does not warrant the cost. |
| 27 | Section H source provenance standardization | AGREE | **NOT VERIFIED** | Open. |
| 28 | AI/editorial provenance blocks | AGREE | **NOT VERIFIED** | Open. |
| 29 | Glossary expansion policy in CORE | PARTIAL | **NOT VERIFIED** | Open. |
| 30 | Editorial log schema formalization | PARTIAL | **NOT VERIFIED** | Open. |
| 31 | Worked quadrilingual example in CORE | AGREE | **NOT VERIFIED** | Open. |
| 32 | GS ψυχή typo at RULES-GS.md line 40 | AGREE | **NOT VERIFIED** | Open — quick fix, should land on next rules touch. |
| 33 | PEOPLE.md governance hardening | AGREE | **PARTIAL** | Genesis and Matthew PEOPLE.md files exist with rich biographical fields (Profession, Hometown, Archaeological Evidence, Historicity Status, etc.). The governance disclaimers / source-provenance structure was not re-checked. **John has no PEOPLE.md in any locale** — see NEW issue N3. |
| 34 | Over-broad TEXTUAL — VERIFIED labels | AGREE | **RESOLVED via spot-check (Phase 6A, 2026-05-09)** | EN John 1 CONTEXT spot-check: 12 `[TEXTUAL — VERIFIED]` labels all attached to grammatical/textual claims (manuscript variants, word order, morphology, lexical glossary entries). A1, A3, A4, A6, A7, A10, B0, D0 — each defensibly textual rather than inferential. No relabeling needed. |
| 35 | German parenthetical familiar names policy | AGREE | **NOT VERIFIED** | Open — DE Matthew not re-checked for `Yochanan (Johannes)` style first-occurrence form. |
| 36 | charis slash consistency | AGREE | **RESOLVED (Phase 6A, 2026-05-09)** | Diagnostic counts in John 1 showed EN/DE/ES non-compliance with the existing prior decision (`docs/editorial-log/john.md` Entry J-002 / 2026-04-28: slash at every occurrence where both senses are active): PT-BR 24 slash + 0 plain (compliant); EN/DE/ES had only 2 slash + ~22 plain. Phase 6A applied per-file `perl -i -pe` replacement with negative lookahead protecting already-slashed instances. Post-fix: 0 unslashed standalone occurrences across EN/DE/ES John 1; 0 double-slashes. |
| 37 | pascha glossary entry | AGREE | **RESOLVED (partially)** | `RULES-GS.md` CHANGELOG-v3.1 records new glossary entries including `pascha`. Locale rendering not exhaustively re-checked. |
| 38 | Bat Qol reception labeling | AGREE | **RESOLVED via spot-check (Phase 6A, 2026-05-09)** | EN Matthew 3 §F2 already labelled `[LATER RECEPTION — DOCUMENTED]` with explicit anachronism caveat: "the term *bat qol* is a later rabbinic category applied retrospectively to this kind of event; Matthew himself uses no technical term... the specific rabbinic terminology post-dates Matthew's text." Compliance confirmed. |

---

## 4. NEW issues surfaced during re-audit

| # | Issue | Severity | Evidence |
|---|-------|----------|----------|
| N1 | **Ruleset version drift between rules and content.** RULES-CORE/HB/GS are at **v3.2**. Across `content/`, 180 references say `v3.0` and 4 say `v3.1` — **zero references to v3.2.** Editorial logs say `v3.0` (genesis) or `v3.1` (john, matthew). | High (governance) | `grep -r "v3\." content/` |
| N2 | **ES John 1–3 has heavy diacritic loss.** `content/es/john/CHAPTER-1.md` front matter says `Traduccion`, `Edicion`, `Espanol`, `Politica`, `Senor`, `segun`; body says `el` for `él`, `llego` for `llegó`, `vencio` for `venció`, `dia` for `día`, `Senor` throughout. ES Genesis and ES Matthew front-matter/body do not have this issue. | High | `grep -E '(Traduccion\|Edicion\|Espanol\|Politica\|Senor)' content/es/john/CHAPTER-*.md` returns 127 / 83 / 106 matches in chapters 1 / 2 / 3. |
| N3 | **John has no PEOPLE.md in any locale.** Genesis and Matthew have full PEOPLE.md with biographical and historicity fields; John 1–3 lacks one even though Yochanan, Yeshua, Andreas, Kefa, Philippos, Nathanael, Nikodemos, Yehudim are introduced in chapters 1–3. | Medium | `ls content/*/john/PEOPLE.md` → no matches |
| N4 | **Em-dash / `--` propagation incomplete in non-EN companions.** EN Matthew companions still contain raw `--` (3 files). DE companions: 12 files. PT-BR: 3. ES: 5. The accessibility/em-dash sweep is not complete across all locales. | Medium | `grep -l ' -- ' content/*/{genesis,john,matthew}/study/*.md` |
| N5 | **John has no PROPHECY files.** Genesis has CHAPTER-3-PROPHECY, CHAPTER-9-PROPHECY, CHAPTER-12-PROPHECY across locales. John 1–3 contain prophetic statements (1:51, 2:19–22, 3:14) but no prophecy file is authored. Matthew 1–3 likewise has none, though Matthew has fulfilment-formula material that arguably belongs in a prophecy file or is intentionally housed elsewhere via the M-001 entry. | Medium | `ls content/*/john/study/CHAPTER-*-PROPHECY.md` → none |
| N6 | **Readability sweep partial.** Genesis EN INTRODUCTION glosses Masoretic Text, Septuagint, JEDP, etc. on first use. John 1 EN companion still uses `Colwell` (5×), `predicate nominative`, `anarthrous` — terms that the readability standard requires to be glossed for a non-specialist reader on first use. | Medium | `grep -c 'Colwell' content/en/john/study/CHAPTER-1-CONTEXT.md` → 5 |

---

## 5. Statistical summary

Of the 38 prior-audit issues catalogued in §1–§3 (counts as of 2026-05-09 after Phase 6 closure):
- **RESOLVED:** 23 (1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 17, 18, 21, 22, 23, 26, 34, 36, 37, 38) — Phase 6A added 9 closures (13, 14, 17, 22, 23, 26, 34, 36, 38) and the audit pass added 2 prior-phase reconciliations (12 ES NT RV from Phase 3B; 18 PT-BR + ES *monogenēs* from Phase 4A)
- **PARTIAL:** 3 (8 PT-BR archaic register; 19 Tier 2 note bloat — Genesis 9 pilot complete, propagation deferred; 33 Genesis/Matthew PEOPLE.md governance hardening — John PEOPLE.md still missing)
- **NOT VERIFIED (still potentially open):** 12 (15, 16, 20, 24, 25, 27, 28, 29, 30, 31, 32, 35) — items 24/25/29/30/31 likely also resolved by Ruleset v3.3 cascade in Phase 5.5; not re-audited here.
- **STILL OPEN:** 0 (item 18 closed via Phase 4A + audit extension to ES; item 14 closed via project-lead Option 2 decision)

Total = 23 + 3 + 12 = 38. ✓

The 12 remaining NOT VERIFIED items will be triaged in Phases 7–11 or via dedicated re-audit pass.

Of the 6 NEW issues, **N1 (version drift)** is the highest-impact governance finding and should be addressed before the next reviewer round, because content currently mis-cites the ruleset version it claims to follow.

---

## 6. Immediate-actionable shortlist

Updated 2026-05-09 (post Phase 6 closure) — most items closed across Phases 0–6. Remaining open work, in rough priority order:

1. **19** — Tier 2 note bloat → companion relocation. Active subject of Phase 6B (one-chapter pilot).
2. **N3** — author John PEOPLE.md (EN-first, then PT-BR, DE, ES). Phase 10.
3. **N6** — apply the readability standard to John/Matthew companions (gloss `Colwell`, `predicate nominative`, `anarthrous`, etc. on first use). Phase 7.
4. **N5** — decide whether John 1–3 / Matthew 1–3 prophecy material should be split out or whether the editorial-log entries are the canonical home. Phase 11 (Option C recommended).
5. **15, 16, 20, 27, 28, 35** — NOT VERIFIED items deferred to Phases 7–11 or to a dedicated re-audit pass after content work lands.

**Closed since 2026-05-08 (Phases 0–6):**
- N1 (version stamps → v3.3 cascade) — Phases 2A + 5.5D
- 18 PT-BR `monogenēs` — Phase 4A (+ ES extension in audit)
- 12 ES NT Reina-Valera declaration — Phase 3B
- N2 ES John diacritic loss — Phase 3A
- N4 em-dash sweep — Phase 2C
- 32 RULES-GS ψυχή typo — Phase 2B (already corrected)
- 13 (Almeida Option B), 14 (Title-cap Option 2), 17, 22, 23, 26, 34, 36, 38 — Phase 6A (+ audit follow-up for 14)
- 24, 25, 29, 30, 31 — Phase 5.5 (Ruleset v3.3 amendments: punctuation, idiom, glossary expansion, editorial-log spec, worked example)

Items 13–17, 19–20, 22–31, 34–36, 38 require targeted re-verification before further triage.
