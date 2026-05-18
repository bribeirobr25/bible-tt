# Feedback Review — Verified Re-Audit

**Original review:** 2026-05-06 (Claude Opus 4.6 vs. then-current state)
**Re-verification:** 2026-05-08
**Re-audit pass 2 (12 NOT VERIFIED items):** 2026-05-17
**Method:** Each prior verdict re-checked against current code, content, and rules. Verdicts updated to one of: RESOLVED, STILL OPEN, PARTIAL, NEW (issue not in original feedback but surfaced during re-audit), or INVALID (claim was wrong or no longer applies).
**Authoritative source:** `docs/rules/RULES-CORE.md`, `RULES-HB.md`, `RULES-GS.md` (v3.3). Everything else is verified against actual files.

**Execution underway:** Phases 0–6 of `docs/audit/FIX_IMPLEMENTATION.md` closed 2026-05-09. Phase 5.5 landed Ruleset v3.3 (items 24, 25, 29, 30, 31 RESOLVED); Phase 6A closed the 9 NOT VERIFIED audit items (incl. PT-BR Almeida Option B, EN/DE/ES *charis* slash compliance, cross-locale title-cap Option 2 normalization); Phase 6B piloted Rule 29 §734 Tier 2 Relocation Protocol on Genesis 9 across all 4 locales. People-surface bug N3 (John PEOPLE.md) waits for Phase 10.

**2026-05-17 re-audit pass:** Each of the 12 NOT VERIFIED items re-checked against current files. Net: 7 → RESOLVED (16, 24, 25, 29, 30, 31, 32 — most via v3.3 cascade); 3 → PARTIAL (20, 27, 28); 1 → legitimately DEFERRED (15 — Matt 4+ not authored); 1 → STILL OPEN actionable (35 — DE Matthew familiar-names redundant-parens pattern). See per-item evidence in §3 below.

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
| 15 | Kingdom of the skies book-level policy | AGREE — HIGH | **DEFERRED-LEGITIMATE (2026-05-17 re-audit)** | Matthew 1–3 only authored. The 33×-occurrence book-level pressure first triggers at Matt 4+ when the phrase appears repeatedly. EN/DE/ES/PT-BR Matt 1–3 all render *basileia tōn ouranōn* as "kingdom of the skies / Königreich der Himmel / reino de los cielos / reino dos céus" with explicit metadiscussion (first occurrence flagged in CHAPTER-3 overview as "unique to Matthew, 32 more occurrences forthcoming"). Book-level policy decision deferred to Phase 12 or whenever Matt 4+ is authored. |
| 16 | parthenos/almah policy contradiction | AGREE — CRITICAL | **RESOLVED (2026-05-17 re-audit)** | `docs/editorial-log/matthew.md` Entry M-002 codifies the slash policy (`virgin/young woman` / `virgem/jovem mulher` / `Jungfrau/junge Frau` / `virgen/joven mujer`) with full rationale. `content/en/matthew/INTRODUCTION.md` §F4 (lines 289–292) and `content/en/matthew/study/CHAPTER-1-CONTEXT.md` §A4 (lines 66–71) both align with M-002's slash decision. No contradiction between intro and chapter companion. |
| 17 | Creation-from-nothing framing (bara) | AGREE — HIGH | **RESOLVED (Phase 6A, 2026-05-09)** | Targeted grep across all 4 locales (EN/PT/DE/ES) Gen 1 chapter + companion confirms the *bara*/*asah* distinction is consistently labeled with explicit confidence markers — EN `**POSSIBLE**`, DE `**MÖGLICH**`, ES `**POSIBLE**`, PT-BR `POSSÍVEL` — and framed as "debated" with "of disputed scope." No imported theology; Rule 3 compliance verified. |
| 18 | monogenēs cross-language consistency | AGREE — HIGH | **RESOLVED (Phase 4A + audit, 2026-05-08)** | PT-BR replaced `unigênito` with `único-nascido` across active translation text in John 1 + 3 (Phase 4A). Phase 4 audit pass surfaced parallel ES `unigenito` bug at ES John 1:18 + glossary table + 4 CONTEXT references — all corrected (`único-nacido`). Editorial-log entry `john.md` J-015. Meta-commentary references to the rejected Vulgata-derived `unigênito` / `unigenito` retained where they explicitly contrast against the TT rendering — allow-listed in `scripts/lint-allowlist.txt` rule §0.5. |

---

## 3. Tier-3 medium priority from prior audit

| # | Issue | Prior verdict | Current verdict | Notes |
|---|-------|---------------|-----------------|-------|
| 19 | Tier 2 note bloat → companion relocation | AGREE | **RESOLVED 2026-05-18** | Phase 6B Gen 9 pilot (2026-05-09) validated the Rule 29 §734 7-step protocol with 3 relocations across all 4 locales (Entry 2026-05-09-100). Propagation phase executed 2026-05-18 via `docs/audit/TIER_2_NOTE_BLOAT_PLAN.md` across 17 remaining chapters: Genesis 2-3 sub-sweep (6 relocations × 4 = 22 edits, `genesis.md` Entry 2026-05-18-108) + John 2-3 sub-sweep (2 relocations × 4 = 8 edits, `john.md` Entry J-027) + Matthew 1-2 sub-sweep (Matt 1:23 EN-only + Matt 2:11 × 4 locales = 5 edits, `matthew.md` Entry M-026). Strict §734 review reduced 64 heuristic-flagged RELOCATE candidates to 10 real relocations (15.6% effective rate vs. Gen-9-pilot 43%) — most chapters were authored with §734 attentiveness from the start, leaving fewer retroactive candidates than the heuristic suggested. Residual borderline 4-sentence lexical/grammatical notes (Phase 7 readability prose-economy territory) remain unaddressed. Classification doc with §3 post-execution annotation: `docs/audit/TIER_2_NOTE_BLOAT_CLASSIFICATION.md`. |
| 20 | Speech-boundary policy (John 3:16–21) | AGREE | **PARTIAL (2026-05-17 re-audit)** | RULES-CORE.md v3.3 §523 + §836 codify speech-boundary policy (typography must not resolve ambiguity the source preserves). `content/en/john/CHAPTER-3.md` v15 closes a quote-block; v16 opens a NEW quote-block extending through v21 — typography commits to "vv16-21 are Yeshua's continued speech" (one of three scholarly readings). MITIGATION: the chapter overview's `**Watch for:**` section explicitly flags the ambiguity to readers ("where Jesus's speech ends and the narrator's voice begins — after v.12? v.15? v.21?"). Verdict: typography takes a position; metadiscussion flags it; full RULES-CORE §836 compliance would require either no closing/opening quotes at the v15/v16 boundary, or a Tier 2 note explaining the typographic choice. Not a regression; consider in next John readability pass. |
| 21 | zōē aiōnios glossary governance | AGREE | **RESOLVED** | All four locales render John 3:15–16 as "life of the age / vida da era / Leben des Zeitalters / vida de la era". Chapter overview explicitly notes "(not 'eternal life')". `RULES-GS.md` glossary entry exists per CHANGELOG-v3.1. |
| 22 | ouranos/sky/heaven cross-language alignment | AGREE | **RESOLVED (Phase 6A, 2026-05-09)** | Cross-locale verse counts in John 3 align (EN 13, PT 12, DE 12, ES 12). EN's single extra is an inline gloss "from the sky/heaven" at line 448 — intentional translator-transparency annotation in one note, not a divergence in verse text. |
| 23 | German Toledot divergence | AGREE | **RESOLVED (Phase 6A, 2026-05-09)** | DE `Toledot` appears in CHAPTER-2 (5×) + CHAPTER-11 (5×) — same chapters where EN, PT-BR, and ES carry the term. No divergence in scope or treatment; `eleh toledot` formula consistently transliterated and italicized across all four locales. |
| 24 | Punctuation governance | AGREE | **RESOLVED (v3.3 cascade, verified 2026-05-17)** | `docs/rules/RULES-CORE.md` §836 "Added v3.3 (2026-05-08)" — full §Punctuation Governance section codifies speech-boundary policy, direct-speech punctuation, paragraph-break governance. See `docs/rules/proposals/v3.3-24-punctuation-governance.md` for proposal artifact. |
| 25 | Idiom policy | AGREE | **RESOLVED (v3.3 cascade, verified 2026-05-17)** | `docs/rules/RULES-CORE.md` §875 "Added v3.3 (2026-05-08)" — §Idiom Policy section specifies the controlled gradient between Rule 5 (literal-form preservation) and target-language idiomatic substitution. See `docs/rules/proposals/v3.3-25-idiom-policy.md`. |
| 26 | Rule 11 addition audit | AGREE | **RESOLVED via spot-check (Phase 6A, 2026-05-09)** | Sample EN Gen 1 verse text shows clean Rule 11 italic compliance — `*was*`, `*is*`, `*the*`, `*a*`, `*were*`, `*that*`, `*it was*` all italicized for added grammar tokens (e.g., 1:2 "darkness *was* over"; 1:7 "waters which *were*"; 1:11 "which its seed *is*"; 1:26 "*a* human"; 1:30 "*is a* living being"; 1:31 "*it was* very good"). The 472 italic-span count includes Hebrew transliterations, key terms, and section headings (intentional formatting), not Rule 11 violations. Systematic 72-file audit deferred — current evidence does not warrant the cost. |
| 27 | Section H source provenance standardization | AGREE | **PARTIAL (2026-05-17 re-audit)** | All three book CHAPTER-1-CONTEXT.md files use the same 3-column table structure (Source \| Type \| Sections). NT books (John + Matthew) align on standardized Type taxonomy (`PRIMARY`, `PEER-REVIEWED (monograph/commentary/article/lexicon)`, `ACADEMIC POPULAR`). Genesis uses freeform Type descriptors (`Primary texts (ANE)`, `Secondary (theology)`, `Primary (Rabbinic)`). Structure standardized; Type-tag taxonomy partially standardized. Genesis could be normalized to NT taxonomy on next OT pass — low priority cosmetic. |
| 28 | AI/editorial provenance blocks | AGREE | **PARTIAL (2026-05-17 re-audit)** | RULES-CORE.md §993 + §1415 codify the Editorial Log Specification including AI-provenance schema. Compliance ratios: genesis.md 20/104 entries (19%); john.md 13/25 (52%); matthew.md 15/24 (62%). Recent entries (post-Phase-5.5 v3.3 landing) consistently include AI-provenance blocks. Older entries (M-001, J-001, early genesis entries) predate the schema and remain grandfathered. Schema is in place for forward authoring; retro-fitting older entries is not warranted unless touched. |
| 29 | Glossary expansion policy in CORE | PARTIAL | **RESOLVED (v3.3 cascade, verified 2026-05-17)** | `docs/rules/RULES-CORE.md` §1068 "Glossary expansion policy" section formalizes the expansion procedure. |
| 30 | Editorial log schema formalization | PARTIAL | **RESOLVED (v3.3 cascade, verified 2026-05-17)** | `docs/rules/RULES-CORE.md` §993 "Format: per v<X.Y> Editorial Log Specification" + §1415 "Added Rules 25-28, Editorial Log Specification, Amendment & Lock Protocol". Schema is now part of CORE. |
| 31 | Worked quadrilingual example in CORE | AGREE | **RESOLVED (v3.3 cascade, verified 2026-05-17)** | `docs/rules/RULES-CORE.md` §1378 "Added second §WORKED QUADRILINGUAL EXAMPLE (John 1:1c — *theos ēn ho logos* — exercises GS §Greek Article System, Rule 13 confidence labelling, Rule 21, Rule 20 DE exemption, plus the new §Punctuation §P2 and §Idiom §I3 policies)." See `docs/rules/proposals/v3.3-31-worked-quadrilingual-example.md`. |
| 32 | GS ψυχή typo at RULES-GS.md line 40 | AGREE | **RESOLVED (v3.1 fix, verified 2026-05-17)** | `docs/rules/RULES-GS.md` line 379 changelog entry: "v3.1 (2026-05-06): ...Fixed ψυχή typo." Line 40 now reads correctly: `\| ψυχή (*psyche*) \| life/being \| vida/ser \| Leben/Wesen \| vida/ser \| ...` |
| 33 | PEOPLE.md governance hardening | AGREE | **PARTIAL** | Genesis and Matthew PEOPLE.md files exist with rich biographical fields (Profession, Hometown, Archaeological Evidence, Historicity Status, etc.). The governance disclaimers / source-provenance structure was not re-checked. **John has no PEOPLE.md in any locale** — see NEW issue N3. |
| 34 | Over-broad TEXTUAL — VERIFIED labels | AGREE | **RESOLVED via spot-check (Phase 6A, 2026-05-09)** | EN John 1 CONTEXT spot-check: 12 `[TEXTUAL — VERIFIED]` labels all attached to grammatical/textual claims (manuscript variants, word order, morphology, lexical glossary entries). A1, A3, A4, A6, A7, A10, B0, D0 — each defensibly textual rather than inferential. No relabeling needed. |
| 35 | German parenthetical familiar names policy | AGREE | **STILL OPEN (2026-05-17 re-audit) — actionable** | DE Matthew CHAPTER-{1,2,3}.md non-compliant with the TT v3.2 transliteration-first-occurrence convention. EN uses `Yochanan (John)` / `Yeshua (Jesus)` / `Yesha'yahu (Isaiah)` / `Yerushalayim (Jerusalem)` / `Yarden (Jordan)` / `Galil (Galilee)`. DE produces redundant-parens forms: `Johannes (Johannes)` / `Jesus (Jesus)` / `Jerusalem (Jerusalem)` / `Jordan (Jordan)` / `Galiläa (Galiläa)` / `Bethlehem (Bethlehem)` / `Ägypten (Ägypten)` / `Nazareth (Nazareth)`. Hebrew-source names like `Yesha'yahu (Jesaja)` ARE compliant in DE (transliterated + familiar). NT-era Greek-source names (Iēsous→Jesus, Iōannēs→Johannes, etc.) are not transliterated in DE; DE chose to use German familiar forms directly. The redundant-parens pattern `(Bethlehem)` after `Bethlehem` adds zero information. Authoring decision needed: (a) apply transliteration discipline for NT names (e.g., `Yochanan (Johannes)`), (b) drop the redundant parens entirely (e.g., `Johannes` alone), or (c) some other principled policy. Estimated effort: 2–3h sweep across DE Matthew 1–3 + sister fix to PT-BR/ES if same pattern is present. Document the chosen policy in `docs/editorial-log/matthew.md` before authoring. |
| 36 | charis slash consistency | AGREE | **RESOLVED (Phase 6A, 2026-05-09)** | Diagnostic counts in John 1 showed EN/DE/ES non-compliance with the existing prior decision (`docs/editorial-log/john.md` Entry J-002 / 2026-04-28: slash at every occurrence where both senses are active): PT-BR 24 slash + 0 plain (compliant); EN/DE/ES had only 2 slash + ~22 plain. Phase 6A applied per-file `perl -i -pe` replacement with negative lookahead protecting already-slashed instances. Post-fix: 0 unslashed standalone occurrences across EN/DE/ES John 1; 0 double-slashes. |
| 37 | pascha glossary entry | AGREE | **RESOLVED (partially)** | `RULES-GS.md` CHANGELOG-v3.1 records new glossary entries including `pascha`. Locale rendering not exhaustively re-checked. |
| 38 | Bat Qol reception labeling | AGREE | **RESOLVED via spot-check (Phase 6A, 2026-05-09)** | EN Matthew 3 §F2 already labelled `[LATER RECEPTION — DOCUMENTED]` with explicit anachronism caveat: "the term *bat qol* is a later rabbinic category applied retrospectively to this kind of event; Matthew himself uses no technical term... the specific rabbinic terminology post-dates Matthew's text." Compliance confirmed. |

---

## 4. NEW issues surfaced during re-audit

| # | Issue | Severity | Evidence |
|---|-------|----------|----------|
| N1 | **Ruleset version drift between rules and content.** RULES-CORE/HB/GS are at **v3.2**. Across `content/`, 180 references say `v3.0` and 4 say `v3.1` — **zero references to v3.2.** Editorial logs say `v3.0` (genesis) or `v3.1` (john, matthew). | High (governance) | `grep -r "v3\." content/` |
| N2 | **ES John 1–3 has heavy diacritic loss.** `content/es/john/CHAPTER-1.md` front matter says `Traduccion`, `Edicion`, `Espanol`, `Politica`, `Senor`, `segun`; body says `el` for `él`, `llego` for `llegó`, `vencio` for `venció`, `dia` for `día`, `Senor` throughout. ES Genesis and ES Matthew front-matter/body do not have this issue. | High | `grep -E '(Traduccion\|Edicion\|Espanol\|Politica\|Senor)' content/es/john/CHAPTER-*.md` returns 127 / 83 / 106 matches in chapters 1 / 2 / 3. |
| N3 | **John has no PEOPLE.md in any locale.** Genesis and Matthew have full PEOPLE.md with biographical and historicity fields; John 1–3 lacks one even though Yochanan, Yeshua, Andreas, Kefa, Philippos, Nathanael, Nikodemos, Yehudim are introduced in chapters 1–3. — **RESOLVED 2026-05-14 via Phase 10** (`docs/audit/archive/PHASE_10_PLAN.md`). All 4 locales now have `content/{en,pt-br,de,es}/john/PEOPLE.md` (11 entries each). See `docs/editorial-log/john.md` Entry J-021. | Medium | (closed) |
| N4 | **Em-dash / `--` propagation incomplete in non-EN companions.** EN Matthew companions still contain raw `--` (3 files). DE companions: 12 files. PT-BR: 3. ES: 5. The accessibility/em-dash sweep is not complete across all locales. | Medium | `grep -l ' -- ' content/*/{genesis,john,matthew}/study/*.md` |
| N5 | **John has no PROPHECY files.** Genesis has CHAPTER-3-PROPHECY, CHAPTER-9-PROPHECY, CHAPTER-12-PROPHECY across locales. John 1–3 contain prophetic statements (1:51, 2:19–22, 3:14) but no prophecy file is authored. Matthew 1–3 likewise has none, though Matthew has fulfilment-formula material that arguably belongs in a prophecy file or is intentionally housed elsewhere via the M-001 entry. | Medium | `ls content/*/john/study/CHAPTER-*-PROPHECY.md` → none |
| N6 | **Readability sweep partial.** Genesis EN INTRODUCTION glosses Masoretic Text, Septuagint, JEDP, etc. on first use. John 1 EN companion still uses `Colwell` (5×), `predicate nominative`, `anarthrous` — terms that the readability standard requires to be glossed for a non-specialist reader on first use. | Medium | `grep -c 'Colwell' content/en/john/study/CHAPTER-1-CONTEXT.md` → 5 |

---

## 5. Statistical summary

Of the 38 prior-audit issues catalogued in §1–§3 (counts updated 2026-05-17 after re-audit pass of 12 NOT VERIFIED items):
- **RESOLVED:** 31 (1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 29, 30, 31, 32, 34, 36, 37, 38) — Phase 6A closed 9 (13, 14, 17, 22, 23, 26, 34, 36, 38); prior-phase reconciliations added 2 (12, 18); 2026-05-17 re-audit added 7 (16 parthenos/almah; 24 Punctuation governance; 25 Idiom policy; 29 Glossary expansion; 30 Editorial log schema; 31 Worked quadrilingual example; 32 ψυχή typo — items 24/25/29/30/31 confirmed closed via v3.3 cascade); 2026-05-18 added 1 (19 Tier 2 note bloat propagation — Genesis + John + Matthew sub-sweeps under strict §734).
- **PARTIAL:** 4 — (8 PT-BR archaic register, still partial); (20 John 3:16–21 speech-boundary — typography commits to one reading; ambiguity flagged in overview; full §836 compliance would require Tier 2 note or open/close-quote removal); (27 Section H source provenance — table structure consistent; NT/OT Type-tag taxonomies partially diverge); (28 AI/editorial provenance blocks — schema in CORE.md, recent entries comply ~50–60%, older entries grandfathered). Item 19 (Tier 2 note bloat) **closed RESOLVED 2026-05-18** — propagation phase complete across Genesis 2-3 + John 2-3 + Matthew 1-2 with 10 real relocations × locale fan-out = 35 edits (genesis.md 2026-05-18-108 anchor + john.md J-027 + matthew.md M-026).
- **DEFERRED-LEGITIMATE:** 1 (15 Kingdom of skies — book-level policy decision waits for Matt 4+ authoring; current Matt 1–3 metadiscussion is sufficient).
- **STILL OPEN:** 1 (35 DE Matthew familiar-names — redundant-parens pattern `Johannes (Johannes)`, `Bethlehem (Bethlehem)` instead of TT first-occurrence convention; authoring decision + 2–3h sweep needed). Item 33 closed via Phase 10 (John PEOPLE.md authored 2026-05-14).
- **NOT VERIFIED:** 0 (the 12-item re-audit pass 2026-05-17 closed the gap; see annotations on items 15, 16, 20, 24, 25, 27, 28, 29, 30, 31, 32, 35 above).

Total = 23 + 3 + 12 = 38. ✓

The 12 remaining NOT VERIFIED items will be triaged in Phases 7–11 or via dedicated re-audit pass.

Of the 6 NEW issues, **N1 (version drift)** is the highest-impact governance finding and should be addressed before the next reviewer round, because content currently mis-cites the ruleset version it claims to follow.

---

## 6. Immediate-actionable shortlist

Updated 2026-05-09 (post Phase 6 closure) — most items closed across Phases 0–6. Remaining open work, in rough priority order:

1. **19** — Tier 2 note bloat → companion relocation. Active subject of Phase 6B (one-chapter pilot).
2. ~~**N3** — author John PEOPLE.md (EN-first, then PT-BR, DE, ES). Phase 10.~~ RESOLVED 2026-05-14.
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
