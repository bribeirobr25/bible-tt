# Content Sweep — Findings (Launch Program Step 3)

**Date:** 2026-11-19 · **Plan:** `PLAN_CONTENT_SWEEP.md` · **Tool:** `pnpm content:sweep` (`scripts/content-sweep.mjs` + `scripts/sweep/`)
**Generated data (do not edit by hand):** `docs/audit/content-sweep/findings.tsv` (every hit: check · class · locale · book · file:line · zone · render · match · context), `summary.md` (counts), `names.tsv` (name-pair inventory).
**Snapshot:** `main` @ `c8ed3ed` + this branch (no content changed). Re-run after every Step-4 batch and diff.

> **How to read the numbers.** Every verse exists twice (continuous reading + verse study); lexical checks count the **verse-study copy only** (one hit per verse) — fixing a hit means editing both copies, and S6a/S6e/S7d prove the copies agree. PT-BR/DE/ES mirror EN, so most classes are ≈ 4 × the EN figure; EN counts are given where that is the useful number. **Render** = `now` (a reader sees it today) · `after-4a` (inside a "Sources consulted" block that Step 4a will start rendering, D2/B2) · `no` (unrendered front matter / parser-dropped). **Precision** = hand-verified share of a seeded sample (`node scripts/sweep/sample.mjs N CHECK CLASS`); "review list" = a class that needs per-instance judgment, not a defect count.

---

## 1. Headline

| # | Finding | Size | Precision | Route |
|---|---|---|---|---|
| 1 | **ES orthography backlog is ~10× the estimate**: missing accents/ñ across 72 ES files, concentrated in the earliest-authored files (Genesis 1–12 chapters + companions, John 1–3) | 1,316 + 415 capitalized + 225 all-caps (note titles) + 119 `-o/-ó` verbs + 25 `¿/¡` interrogatives + 14 `a el/de el` + 2 "No se." → ≈ 2,100 tokens; Genesis 1,316, John 722, others ≤ 25 each | 19/20 · 20/20 · 19/20 · 8/8 · 6/6 · 6/6 | 4b (scripted with per-token review) |
| 2 | **Reader-visible authoring meta** | EN alone (×4 locales): 135 editorial IDs (`P-009`, `A-004` …), 162 repo paths (`luke/PEOPLE.md`, `` `en/john/study/…` ``), 68 "editorial log" references, 12 process words (Phase 9/12, propagation), 441 rule references ("(Rule 30)") — plus 4 DE/EN-locale "JHWH in DE on propagation" lines | IDs/paths/process ≈ 10/10; rule refs = decision | 4b; rule refs = **Decision L5** |
| 3 | **Rule 25 — "LORD/SENHOR/HERR/SEÑOR" in TT voice** (incl. quoted OT text, the Step-1 deferral) | 155 (EN 66 · PT 65 · ES 15 · DE 9); Acts 93, 1 Peter 49, Genesis 10, John 3; + 20 convention discussions (legitimate) | 8/8 | 4b |
| 4 | **Pre-v3.2 name policy still printed in Reading Guides** — "Proper names follow TT transliteration: Yeshua (not Jesus) …" (PT even prints "Jesus (não Jesus)") | 148 hits (all locales) in 13 chapter guides per locale | ≈ 100 % | 4b |
| 5 | **Continuous reading ≠ verse study** (the guide promises "Text is identical") | EN: 58 verses differ in words (Genesis 23 — a leading "And" present in one copy only, Gen 4–5; John 11 incl. the 1:3–4 verse split; Matthew 10; Luke 8; Mark 6) + 16 punctuation-only; divine-speech coverage differs in 23 EN verses (Mark 14, Acts 7, John 2) | 8/8 | 4b |
| 6 | **Rule 30 scope** — God's words quoted by a human speaker are marked `@@` (Rule 30: "do NOT mark" unless logged) | 5 per locale: Acts 2:17, 2:34, 3:25 (inside Peter's speech), 1 Peter 1:16, 2:6 (after a citation formula — 1 Peter INTRODUCTION states this was deliberate) | 5/5 real; legitimacy = decision | **Decision L3** |
| 7 | **PT contraction italics (T-20) sized exactly**: of the 190 whole-file regex hits, 56 are verse-study main text (39 pivot-likely — italic noun where EN italicizes only an added article, e.g. `do *Senhor*`, `na *cidade*`; 17 review), 56 the continuous copy, 68 notes quoting the verse, 10 other prose (= 190) | 39 pivot-likely: Luke 24, 1 Peter 14, Acts 1 | 10/10 pivot-likely; review list mixed (`do *ish*` is a transliteration) | **Decision L1** then 4b |
| 8 | **Rule 20 / D8 casing** | "Son of Man": 6 in verse text (Mark 2:10, 2:28 × EN/PT/ES) + 23 in TT-voice prose (John overview/tables/PROPHECY, Mark PEOPLE); 116 quoted/discussed (incl. PT note "A TT usa a forma tradicional 'Filho do Homem'" — contradicts D8). Capitalized Spirit/Word/Palavra/Espírito in TT-voice prose: EN Spirit 53, Word 17; PT Espírito 45, Palavra 10, Verbo 6; ES Espíritu 44, Palabra 9, Verbo 6; plus PT/ES Gen 1:8 naming the raqia "Céu"/"Cielo" (review) | 6/6 · 6/6 | 4b (S2a); S2b → 4b per Rule 20 (locked) |
| 9 | **Glossary locks broken in verse text** | πάσχα "Passover/Páscoa/Pascua/Passa" (locked **Pesach**): John 2:13, 2:23, Luke 2:41 in all locales (DE 1); μετάνοια "repentance/arrependimento/arrepentimiento" (locked "change of mind"): Luke 3:3, 3:8 (EN/PT/ES; DE uses "Umkehr"); *raqia* glossed "firmamento/Firmament" in the PT/DE/ES Gen 1 & 7 overviews (audit §5) | 10/10 · 6/6 · 7/8 | 4b |
| 10 | **D7 — ψυχή "soul"** | verse text: 12 per locale (1 Peter 6, Acts 4 — e.g. 2:27 "my soul", Luke 2 — 1:46, 2:35); TT-voice prose 27 EN (1 Peter 20); 279 mentions | 8/8 | 4b (D7 sweep list) |

---

## 2. Every check — counts, precision, route

Counts are all locales unless marked EN. Render split and per-book tables: `content-sweep/summary.md`.

| Check | Rule / decision | Result | Precision | Route |
|---|---|---|---|---|
| **S1a** DE `YHWH` | Rule 25 | 1 defect (`de/john/PEOPLE.md:216` "Tag YHWHs"), 1 meta leak (`de/acts/study/CHAPTER-2-PROPHECY.md:57`), 6 legitimate explanations of the J-for-yod convention | 8/8 | 4b |
| **S1b** `JHWH` outside DE | Rule 25 | 12 "JHWH in DE on propagation"-type meta leaks (Acts EN/PT/ES 2 CHAPTER-2 note + PROPHECY ch.1–2), 3 legitimate explanations (Genesis CONTEXT) | 15/15 | 4b (meta) |
| **S1c** LORD/SENHOR/HERR/SEÑOR | Rule 25, HB glossary | 155 use · 20 convention-mention | 8/8 | 4b |
| **S2a** "Son of Man" (EN/PT/ES) | Rule 20, D8 | 6 verse · 23 TT voice · 116 quoted/discussed | 6/6 · 6/6 · review | 4b; quoted forms that *assert* the capitalized title (PT/ES John 1:51 notes) also 4b |
| **S2b** capitalized common nouns | Rule 20 (locked), GS glossary (λόγος lowercase) | see headline 8 (EN Word 17/Spirit 53 TT voice; mentions listed separately) | per-class review | 4b |
| **S3** rejected glossary renderings | HB + GS locked glossaries | verse text: pascha 10, repent 6 (headline 9). TT-voice prose: baptize 357, church 187, gospel 249 (mostly the *genre* "Gospel of Mark" — legitimate), pascha 94 (mostly OT Passover in the apparatus), firmament 15, tebah-boat 6; mentions listed separately | verse 16/16; TT-voice = review | 4b (verse); TT-voice scope = **Decision L4** |
| **S4** soul / alma / Seele | D7 | 48 verse (12/locale) · 90 TT voice · 279 mention | 8/8 | 4b |
| **S5a** name tables | D11 | 65 canonical rows parsed (HB 49 · GS 16) | — | input |
| **S5b** untabled name pairs | D11 | 176 distinct EN `Translit (Familiar)` pairs absent from both tables (top: Avraham/Abraham 57, Yehudah/Judah 39, Ya'aqov/Jacob 25, Elisheva/Elizabeth 21, Zecharyah/Zechariah 17, Gavriel/Gabriel 16, Yitschaq/Isaac 15, Zavdai/Zebedee 13, Shelomoh/Solomon 12 …) — `names.tsv` | inventory (contains some non-names) | 4b: D11 table-extension proposal for lead audit |
| **S5c** conflicting forms | D11 | 551 hits; real families: Yafet ≠ table Yefet (31 EN), Natzeret vs Natseret (12+), Beit-Lechem vs Beyt-Lechem (12), Bet-Tsaidah vs Beyt-Tsaidah (8), Yesha'yahu vs Yeshayahu (7), Moshe vs Mosheh (4), Kapharnachum (2); "Yeshua *the* Messiah (Jesus)" gloss attached to the title (17 EN, 1 Peter/Acts); Shimon (Simeon) — a person the table lacks. Known non-defects: Qur'anic forms in reception notes (Isa, Musa, Yahya). Audit §5 variant table → `summary.md` | ≈ 6/8 | 4b (D11) |
| **S5d** name-rendering hygiene | v3.2 / v3.3.1 | 148 stale-policy statements; 0 redundant `Name (Name)`; repeated gloss within one H2 section: 590 verse text, 149 notes, 267 apparatus | stale 100 %; repeats = granularity question | 4b; **Decision L2** |
| **S6a** divine-speech coverage CR vs verse | Rule 30 ("same span in BOTH renderings") | 90 (EN 23: Mark 14, Acts 7, John 2) | 8/8 | 4b |
| **S6b** markers inside inline code | renderer (backticks stay literal) | 152 (EN 38: 1 Peter 22, Acts 13, Luke 3) | — | 4b |
| **S6c** per-verse `@@` count vs EN | Rule 30 parity | **0** | — | ✓ |
| **S6d** unbalanced `@@` | renderer | 32 (8/locale, all Acts 1–2) | — | 4b |
| **S6e** CR text ≠ verse text | guide promise | 121 words + 69 punctuation (headline 5) | 8/8 | 4b |
| **S6f** Rule 30 scope | Rule 30 | 20 (headline 6) | 5/5 | **Decision L3** |
| **S7a** PT contraction italics | Rule 11, T-20 | headline 7; plus 25 whole-contraction `*na*` forms in verse text; the intra-word form `n*a*`/`d*o*` (131) occurs **only in companions**, never in verse text | 10/10 | **Decision L1** |
| **S7b** per-verse italic count vs EN (Δ ≥ 2) | Rule 11 balance | 58 (DE 29: Genesis 10, 1 Peter 7; PT 20; ES 9) — e.g. PT 1 Peter 1:20 0 vs EN 4 | review | 4b review list |
| **S7c** bold in verse text | markers convention | **0** | — | ✓ |
| **S7d** italics CR vs verse | Rule 11 | **0** | — | ✓ |
| **S8** front matter | Rule 28, stamps | 125 `v3.3` ruleset stamps; `de/john/study/CHAPTER-1-CONTEXT.md` status "vorlaufig" (missing umlaut); `es/john/PEOPLE.md` has no H1 and no Status line; every chapter has Status + Reviewers | — | 4b / 4d |
| **S9** meta leaks | headline 2 | 668 editorial IDs · 1,110 repo paths (EN 162 now / 48 after-4a / 67 unrendered) · 96 cross-book see-fields (legitimate links) · 54 process words · 320 log references · 2,446 rule references | ≈ 10/10 (TODO-as-Spanish/Portuguese-word excluded) | 4b; **Decision L5** |
| **S10** v3.3 stamps | §0.1b | 125 stamp fields + 8 prose stamps ("the TT ruleset (v3.3)", Genesis/John INTRODUCTION) + 4 legitimate citations ("v3.3.2 cross-book convention", Luke 3) = 137 = the §0.1b count | exact | 4d (no blind re-stamp) |
| **S11** ES orthography | headline 1 | + 23 spurious accents (`específicada`, `habiéndo*lo*`, `funcióna`, `traducciónes`, `Secciónes`) · 119 ambiguous pairs (aun/aún, mas/más …) for per-instance review | 8/10 spurious | 4b |
| **S12** mojibake | encoding | 14: `en/genesis/PEOPLE.md` 9, `en/genesis/CHAPTER-4.md` 2, `de/matthew/PEOPLE.md` 2 ("MatthÃ¤us"), `pt-br/matthew/PEOPLE.md` 1 | 14/14 | 4b |
| **S13** DE "Yehudim" | D9 (Jehudim) | 44 in 13 files + 2 other forms (Yehudi, Yehudit) | — | 4b |
| **S14** PT vós/vocês | register | verse text: vós-forms 108 (1 Peter 53, Acts 32, Genesis 18), vocês 12 (John 11) | data | **Decision L6** |
| **S15** renderer-hostile markup | 4a hardening | 237 ASCII `->` (mostly cross-chapter headings), 52 markers in table cells, 19 manuscript-siglum asterisks (`א*`) that can pair with a later `*`, 1 genuine odd asterisk | — | 4a / 4b |
| **S16** TOC rendered as a section | parser | 3 ES chapters (`es/genesis/CHAPTER-4/5/6.md`) title the TOC "TABLA DE CONTENIDOS", which `SKIPPED_SECTIONS` lacks → it renders as a supplementary section | 3/3 | 4a (or retitle in 4b) |
| **S17** χριστός rendering | GS glossary ("anointed one"; capitalized only as a proper name) | EN verse text: Messiah 1 Peter 21, Acts 6, Luke 2, John 1; anointed one John 5, Matthew 5, Luke 1, Mark 1 — the locked rendering is not used in 1 Peter/Acts | — | **Decision L7** |
| **S18** Tier-2 note length | RULES-CORE Tier 2 ("1–2 sentences, default"), Relocation Protocol ("normally under 3") | ≈ 1,670 bullets of 4–5 sentences + ≈ 128 of 6+ (per locale ≈ 415 + 31) | counter verified on samples | **Decision L8** |
| **S19** הִנֵּה lock | HB glossary (no alternation) | **0** — every Genesis verse whose note cites הִנֵּה carries the locked form | — | ✓ |

**Cross-checks (S16 / plan §2):** §0.3d lowercase-calque lines = **17** (DE/PT/ES Acts 2–3, DE Luke 1:35 note) — unchanged, 4b. `INTERPRETIVE` appears only as a 🟡 note *title* ("INTERPRETIVE RESTRAINT"), never as a claim label — the PENDING item "unregistered label" is a false alarm (close it in 4d). Mark has no PROPHECY files — no S-check can decide intent; carried to 4b as a question for the lead's audit of the Step-4 plan.

---

## 3. Lead decisions needed before Step 4 can fix a class

| # | Decision | Options (recommendation first) | Affects |
|---|---|---|---|
| **L1** | PT: how to mark an article fused into a contraction (T-20) | **(A) italicize only the article inside the contraction — `n*a* carne`** (already the companions' de-facto form, 131×; marks exactly the added word); (B) italicize the whole contraction `*na* carne` (25× in verse text; over-marks the preposition, which *is* in the source); (C) do not mark fused articles (PT grammar requires them) and say so in the Reading Guide | 39 pivot-likely + 17 review verses (+ CR copies, + 68 notes quoting them) |
| **L2** | Name-gloss granularity: is each verse card (Notes door) its own "section" for first-occurrence glossing? | **Per verse card** (the 3-door IA shows each card on its own; matches how the corpus is already written) vs. per H2 (RULES-HB DE note wording → 590 + 149 re-glosses to strip) | S5d repeated-gloss; RULES-CORE wording |
| **L3** | Rule 30: God's words quoted by a human speaker / after a citation formula | **Unmark** (Rule 30 says "do NOT mark", restraint by default) unless an editorial-log entry justifies a specific occurrence — then log 1 Peter 1:16/2:6 if kept | Acts 2:17, 2:34, 3:25; 1 Peter 1:16, 2:6 (×4) |
| **L4** | Do glossary locks govern TT-voice prose (notes, overviews), or only the rendering? | **Rendering + any TT-voice sentence that restates the rendering**; genre/reception uses ("the Gospel of Mark", "the Passover lamb of Exodus 12", "baptism" in church history) stay | S3 TT-voice classes (review lists) |
| **L5** | Rule references in reader text ("(Rule 30)", "per Rule 11") — 441 EN rendered | **Keep only where the site explains the rule** (link to a public "How the TT works" page in Step 5) — otherwise remove with the IDs/paths; or keep all as transparency markers | S9 rule-ref |
| **L6** | PT register: vós vs vocês in verse text | **vocês** (Brazilian standard; matches the pan-Hispanic ES choice and the PT UI) — 108 vós-forms in 1 Peter/Acts/Genesis to convert; or keep vós for speeches/letters as a register choice and log it | S14 |
| **L7** | χριστός: "Messiah" vs locked "anointed one" | **Follow the lock**: "anointed one" as descriptor, "Messiah" only where the Greek is titular/proper-name-like — log the rule for epistles (1 Peter's "Yeshua *the* Messiah" is titular) — or amend the glossary to "Messiah" | S17; also the "Yeshua *the* Messiah (Jesus)" gloss placement |
| **L8** | Tier-2 note length | **Treat > 5 sentences (≈ 128/locale) as must-relocate in Step 4b**; leave 4–5 as within the "normally" tolerance; or enforce the 2-sentence default (≈ 1,800 relocations — not launch-sized) | S18 |

---

## 4. Carried forward verbatim (single-verse judgments, not scannable)

From `PLAN_BASELINE_RECOVERY.md` §10 and `PLAN_SAFETY_NET.md` §11, unchanged, to Step 4b: 1 Peter 1:16 future ἔσεσθε; 1 Peter 2:6 ἐπ' αὐτῷ referent divergence; ES Gen 1:2 `*se cernía*` italic scope; Silvanus = Silas identification (D11); EN Genesis PEOPLE 688 vs 687 fields; audit §6 EN "waters"/"water" (genesis.md L139-144) — lead question.

---

## 5. What the sweep does not do

It does not judge Rule 13 uncertainty levels, Rule 2 slash correctness (already parity-tested), Rule 27 inclusive language, or DE noun capitalization (grammatical). Its classifiers are heuristics: use/mention, the T-20 article accounting and the ES dominance method produce **work lists for a human pass**, not automatic fixes. Step 4 promotes a class to a blocking `content-lint` rule only after it is cleared (playbook T-14).
