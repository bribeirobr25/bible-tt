# PLAN — Launch Program Step 3: Content Sweep

**Date:** 2026-11-19
**Status:** EXECUTED 2026-11-19 · REVIEWED (independent adversarial plan review — 1 blocker, 12 major, 9 minor, all resolved, §13) · IMPLEMENTATION-REVIEWED 2026-11-20 (5 adversarial reviewers, §15) · approved for execution under the lead's standing instruction (2026-11-19: "after the plan is written, reviewed and fixed or improved, feel free to implement it"). Tool scaffolding (zone splitter, name-table extractor) was written while the review ran; every review finding was applied before any result was used. **Results: `CONTENT_SWEEP_FINDINGS.md`.** Where §3–§7 below and §13/§14 differ, §13/§14 (as executed) win.
**Program:** `LAUNCH_PROGRAM.md` Step 3 (decisions D1–D16 govern; this plan changes none of them).
**Branch:** `content-sweep` (from `main` @ `c8ed3ed`). `main` is now protected (required check `gate`, PR-only, admins included — lead decision 2026-11-19).

---

## 1. Goal and boundary

**Goal:** a **reproducible, scripted rule-compliance scan** of all 7 books × 4 locales whose output is an exact, classified, routed work list for Step 4 (`PLAN_LAUNCH_FIXES.md`), plus the decisions the lead must take before Step 4 can fix a class.

**In scope (Step 3 changes):**
1. A committed sweep tool (`scripts/content-sweep.mjs`, `pnpm content:sweep`) + fixture tests for every check.
2. A committed findings snapshot (`docs/audit/content-sweep/`) and a hand-written analysis (`docs/audit/CONTENT_SWEEP_FINDINGS.md`) — counts, precision, classification, routing, lead decisions.
3. **Tooling hygiene only:** remove the 22 stale §0.8 allow-list entries (Step 2 I24) and add a guard test so an allow-list entry can never go stale silently again.

**Out of scope (explicitly):** any content change (all content fixes are Step 4b — including the ES body accents; Step 3 produces their exact list), any rule-file change (Step 4d), any code/renderer change (Step 4a), any new blocking *content* rule (classes are promoted to blocking only after Step 4 clears them, playbook T-14). **One tooling exception, by design:** the `allowlist` rule in `content-lint` (item 3) blocks on a stale allow-list entry — it guards the lint's own configuration, not content.

**Why scan before fixing:** Step 1 and Step 2 both found classes larger than the first estimate (ES heading accents 100 → 150, 1.5×; companion gaps 9 → 10 companions / 29 pairs). This sweep confirmed the risk: the ES accent backlog is ≥ 2,119 tokens (a lower bound), not ~210. Sizing first prevents a Step 4 plan built on guesses, and committing the tool prevents the I21 problem (figures from uncommitted scripts).

---

## 2. Inputs (what the sweep must cover)

| # | Source | Item |
|---|---|---|
| a | LAUNCH_PROGRAM Step 3 | PT contraction-italic pivot class (playbook T-20; upper bound 190 hits) + the convention question |
| b | LAUNCH_PROGRAM Step 3 | Glossary renderings · Rule 20 casing · names vs tables · divine name per locale · Rule 11 balance · Rule 30 scope · Rule-28 front matter · authoring-meta leaks · stale stamps |
| c | LAUNCH_PROGRAM Step 3 / PLAN_SAFETY_NET I2 | ES body-text accent loss (Gen 4/5/7/8 + John 1–3 companions, ~210 pattern hits) — sweep **all** ES files, not just those |
| d | PLAN_BASELINE_RECOVERY §10 (→ 3/4b) | §0.3d lowercase calque content (~17 lines) · "LORD/SENHOR/HERR/SEÑOR" in note prose (1 Peter 59, Acts 45+) · editorial IDs + literal `@@…@@` + repo paths in reader notes · ES Genesis accent backlog (incl. Gen 4:9 "No se") · `*se cernía*` italic scope · PT vós/vocês register split · 1 Peter 1:16 future ἔσεσθε · 2:6 ἐπ' αὐτῷ referent · Silvanus = Silas (D11) |
| e | PLAN_SAFETY_NET §11 | I24 (22 stale §0.8 entries) · I22 raw file paths in People cards · EN Genesis 688 vs 687 fields |
| f | PROJECT_STATE_AUDIT §4/§5 | son-of-man casing · DE `YHWHs` · Yehudim/Jehudim · meta leaks · mojibake (9 in `en/genesis/PEOPLE.md`) · stale stamps · `INTERPRETIVE` label · Mark has no PROPHECY files · *raqia* glossed "firmamento/Firmament" in non-EN overviews · name-form drift (Moshe/Mosheh …) |
| g | Found while writing this plan | Chapter Reading Guides still state the **pre-v3.2** policy ("Proper names follow TT transliteration: Nikodemos (not Nicodemus), Yeshua (not Jesus)…", e.g. `en/john/CHAPTER-3.md:39`) while the overview beneath uses the familiar forms; editorial IDs are frequent in EN reader text (`P-009` ×27, `P-006` ×25, `A-004` ×24 …) |

Items in (d) that are **single-verse translation judgments** (1:16 ἔσεσθε, 2:6 ἐπ' αὐτῷ, `*se cernía*` scope, Silvanus = Silas) are not scannable classes: the sweep does not re-derive them; the findings doc carries them forward verbatim to Step 4b so nothing is dropped.

---

## 3. Zone model (what a hit *means* depends on where it is)

Every hit carries a **zone**, because the same string is a defect in one place and legitimate in another (a note may *mention* "only-begotten" to reject it; the main text may not *use* it).

| Zone | Chapter files (`CHAPTER-N.md`) | Other files |
|---|---|---|
| `front` | metadata block before the first H2 after the title block (Base Text, Ruleset, Status, Reviewers …) | the leading `**Field:** value` block |
| `guide` | READING GUIDE section | — |
| `overview` | CHAPTER OVERVIEW section | — |
| `main` | CONTINUOUS READING body **and** each verse's translation paragraph (lines after `### **Verse N**` up to the NOTES blockquote / `---`) | — |
| `note` | blockquote (`> `) lines in VERSE-BY-VERSE | — |
| `apparatus` | everything after VERSE-BY-VERSE (glossary, cross-chapter tracking, supplementary) and the TOC | all reader-rendered prose of INTRODUCTION / PEOPLE / CONTEXT / companions / PROPHECY |

Section detection is **positional + localized**: the H2 titles are matched with the same localized sets the parser uses (`markdown-parser.ts`: `CONTINUOUS_READING_HEADERS`, the verse-by-verse set, `OVERVIEW_SECTIONS`, the reading-guide regex). A chapter whose zones cannot be resolved (missing CONTINUOUS READING, no verse headers) is a **tool error** — the sweep exits non-zero rather than silently classifying everything as `apparatus` (Step 2 lesson: no vacuous passes).

~~Fenced/inline code is masked before matching.~~ **Superseded (review R-1):** inline code is *not* masked — the renderer prints backticks literally and still styles markers inside them, so backticked paths/markers are reader-visible leaks. The bare Reading-Guide legend lines are exempted by an explicit pattern instead.

---

## 4. Check catalogue

Each check has an ID, the governing rule, the method, the zones it judges, and where its findings are routed. "Use" = the form is the rendering; "mention" = the form is quoted/discussed (inside quotes, after "not"/"NOT"/"rather than"/"instead of" and locale equivalents, or in a glossary *Policy* explanation). Use/mention is a classifier, reported separately — never a silent filter.

| ID | Rule / decision | What it detects | Method | Zones judged | Route |
|---|---|---|---|---|---|
| **S1a** | Rule 25 (HB: YHWH/JHWH per locale) | DE `YHWH` (should be `JHWH`) | token `YHWH\w*` in `de/` | all rendered | 4b |
| **S1b** | Rule 25 | `JHWH` in EN/PT/ES (only legitimate as a mention of the DE convention — itself a meta leak in reader text) | token in non-DE | all rendered | 4b (meta) |
| **S1c** | Rule 25 + HB glossary ("never silently substitute LORD/SENHOR/HERR/SEÑOR") | all-caps `LORD`, `SENHOR`, `HERR`, `SEÑOR` (+ `GOD`, `DEUS`, `GOTT`, `DIOS` all-caps) | case-sensitive whole word; use/mention classified | all rendered | 4b |
| **S2a** | Rule 20 + D8 | "Son of Man" / "Filho do Homem" / "Hijo del Hombre" (any capitalization other than lowercase "son of man" / "filho do homem" / "hijo del hombre"; DE exempt — noun capitalization is grammatical) | case-sensitive phrase | `main`, `note`, `overview`, `guide`, `apparatus` (all — D8 says "everywhere") | 4b |
| **S2b** | Rule 20 (report-only, no decision yet) | capitalized theological common nouns in EN/PT/ES **main text**: `Word`/`Verbo`/`Palavra`/`Palabra` (λόγος — GS glossary: lowercase in main text), `Spirit`/`Espírito`/`Espíritu` not sentence-initial, `Christ`/`Cristo` vs "anointed one" (glossary: capitalized only as a clear proper name) | case-sensitive, not after sentence start | `main` | 4b if locked; else **lead decision** list |
| **S3** | Locked glossaries (HB + GS) | rejected renderings: `only-begotten`; `eternal life`/`vida eterna`/`ewige(s|n) Leben`; `repent*`/`arrepend*`/`Buße`/`arrepent*`; `gospel`/`evangelho`/`Evangelium`/`evangelio`; `church`/`igreja`/`Kirche`/`iglesia`; `baptiz*`/`batiz*`/`tauf*`/`bautiz*` (vs immersion); `firmament*`/`Firmament`; `Easter`/`Páscoa`/`Ostern`/`Pascua`; `Comforter`/`Consolador`/`Tröster`; `behold` (הִנֵּה = "see"); tebah as `boat`/`barco`/`Boot`/`bote` | locale-specific word lists, HB terms only in `genesis`, GS terms only in NT books; use/mention classified | `main` = defect; other zones = use/mention report | 4b |
| **S4** | D7 (ψυχή / nephesh = life/being) | `soul(s)`, `alma(s)`, `Seele(n)` | per book × zone; use/mention | all rendered | 4b (D7 sweep list) |
| **S5a** | D11 (proper-name tables = single source) | **table extraction**: parse RULES-HB (person/place/group) + RULES-GS (person/place) tables → canonical (translit, familiar per locale) pairs | markdown-table parser; tool error if a table yields 0 rows | — | input for S5b–d |
| **S5b** | D11 | `Translit (Familiar)` pairs used in content (regex over all locales) **not in any table** → the "names to add" list, with frequency and books | pair extraction | all rendered | 4b (D11 proposal list for lead audit) |
| **S5c** | D11 | **conflicting forms**: one familiar name glossed with ≥2 transliterations (e.g. Moses ← Moshe / Mosheh; James ← Iakobos / Ya'aqov), and the known variant list from audit §5 (Natzeret/Natseret, Mattai/Mattityahu, Yesha'yahu/Yeshayahu, Toma/Thomas, Bar-Talmai/Bartholomaios, DE Kafarnaum/Kapernaum, DE Nazaret/Nazareth) | counts per book × locale | all rendered | 4b |
| **S5d** | Name-rendering v3.2 / v3.3.1 | (i) redundant `Name (Name)` corpus-wide (lint §0.8/§0.11 cover only PEOPLE headings / DE chapters); (ii) **stale pre-v3.2 policy statements** — "(not Nicodemus)", "(not Jesus)", "Proper names follow TT transliteration" (all locales); (iii) the same `Translit (Familiar)` gloss repeated within one H2 section (first-occurrence rule — granularity to be confirmed in Step 4) | regex; per-section counter | all rendered | 4b |
| **S6** | Rule 30 (divine speech) | (a) per chapter, the multiset of `@@…@@` spans in CONTINUOUS READING ≠ that in the verse translations (rule: "same span in BOTH renderings"); (b) `@@` outside `main` (literal marker leak — the renderer may not process it there); (c) per-verse `@@` count EN ≠ locale (finer than the file-level parity test); (d) unbalanced `@@` per paragraph | span extraction with whitespace/quote normalization | `main` (a, c, d); all (b) | 4b / 4a |
| **S7a** | Rule 11 + T-20 | PT contraction + italic (`\b(na|no|nas|nos|da|do|das|dos|pela|pelo|pelas|pelos|à|às|ao|aos) \*[^*]+\*`), **classified** against the EN twin verse: `pivot-likely` when the EN verse italicizes a bare article (`*the*`, `*a*`, `*an*`) and the PT italic is a single word that the EN verse does **not** italicize; `review` otherwise | per-verse EN alignment | `main` | 4b (after the lead's PT convention) |
| **S7b** | Rule 11 balance | per verse, italic-span count EN vs each locale; flag \|Δ\| ≥ 2, or EN 0 vs locale ≥ 2, or EN ≥ 2 vs locale 0 | per-verse counts | `main` (verse translations) | 4b (review list) |
| **S7c** | Rule 11 / markers ("only inline styling in Tier 1") | ad-hoc bold `**…**` in `main` | regex | `main` | 4b |
| **S7d** | Rule 11 (same span in both renderings, by analogy with Rule 30) | per chapter, the italic-span multiset in CONTINUOUS READING ≠ that in the verse translations | multiset compare | `main` | 4b |
| **S8** | Rule 28 front matter | each file: has a Status line; its value is the locale's "provisional" word; chapters additionally carry a Reviewers line; Ruleset stamp present + its version | per-file field read | `front` | 4b / 4d |
| **S9** | Authoring meta in reader text | (a) editorial IDs (`\b(?:A|J|L|M|P)-\d{3}[a-z]?\b`, `Entry \d{4}-\d{2}-\d{2}-\d{3}`, `log ID`); (b) repo paths (`(?:content|docs|src|scripts)/…`, `…/(PEOPLE|INTRODUCTION|CONTEXT|CHAPTER-\d+(-CONTEXT|-PROPHECY)?)\.md`); (c) process words: `propagat\w*`, `pivot`, `mirror-EN`, `TODO`, `TBD`, `FIXME`, `Phase \d`, `playbook`, `PLAN_`, `on propagation`, `\blint\b`, `allow-list`, `(per|see) (the )?editorial log` | regex, all locales (localized process words added from a pilot run) | all rendered (`front` reported separately — the companion `**Companion to:** \`…CHAPTER-1.md\`` line may not render; S9 records whether each `front` field renders, from the parser) | 4b |
| **S10** | §0.1b stale stamps | `v3.3` / `v3.3.x` in `content/`, classified **stamp** (Ruleset/Conjunto de Regras/Regelwerk/… field, "the TT ruleset (v3.3)") vs **citation** ("per the v3.3.2 cross-book convention") | field vs prose | all | 4d (re-stamp list, citations excluded — Step 2 I18) |
| **S11** | ES orthography (Step 2 I2, Step 1 deferral) | (a) unaccented words in **all** `es/` files whose accented form dominates the ES corpus (Step 2 method), minus a curated ambiguity list (`como/cómo`, `esta/está`, `el/él`, `solo/sólo`, `mas/más`, `se/sé`, `si/sí`, `que/qué`, `tu/tú`, `mi/mí`, `de/dé`, `aun/aún`, `este/éste`, `publico/público`, `continuo/continúo` …) reported separately as `ambiguous`; (b) spurious accents (inverse direction, e.g. `generaciónes`); (c) the PENDING pronoun class `a el` / `de el` (should be `al` / `del` unless pronoun `él`) | corpus-frequency dictionary built from the ES corpus itself | all rendered | 4b |
| **S12** | Encoding | mojibake (`â€`, `Ã[\x80-\xBF]`, `Â`, U+FFFD, `â` + space/dash), all locales | byte/regex | all | 4b |
| **S13** | D9 (DE Ioudaioi = Jehudim) | `Yehudim` / `Yehudi\w*` in `de/` | token | all rendered | 4b |
| **S14** | Register (Step-1 deferral) | PT `vós`-forms vs `vocês`-forms per book (counts only — a register decision, not a defect class) | token counts | `main` | **lead decision** |
| **S15** | Renderer-hostile markup (feeds 4a hardening) | unbalanced `{a:` / `{t:` braces; odd single-`*` count per line after removing `**`; markers inside table cells; ASCII `->` in headings/prose | regex | all | 4a / 4b |
| **S16** | Cross-checks of known items | §0.3d warn output (re-counted and attached), `INTERPRETIVE` label occurrences, Mark PROPHECY absence (confirm intent from `mark.md`), EN Genesis 688 vs 687 field (identify the person/field) | lint output + targeted reads | — | 4b / lead |

**Deliberately not checked** (with reason): Rule 13 uncertainty levels (needs per-note scholarly judgment), Rule 2 slash correctness (governed by `{a:}` parity tests already), Rule 27 inclusive language (per-instance judgment), DE noun capitalization (grammatical).

---

## 5. Tool design

- **`scripts/content-sweep.mjs`** — Node ≥ 22, zero dependencies, ESM. Pure functions per check in `scripts/sweep/*.mjs` (zone splitter, table extractor, each check); the entry point walks `content/{locale}/{book}/**.md` (book list generated from `content/en/`, as content-lint does since Step 2), runs every check, and writes outputs. Deterministic: files and hits sorted; no timestamps in output; a re-run on unchanged content yields byte-identical files.
- **Outputs** (`docs/audit/content-sweep/`, committed): `findings.tsv` (`check⇥class⇥locale⇥book⇥file:line⇥zone⇥match⇥context`, one row per hit), `summary.md` (generated: per check × class × book × locale counts), `names.tsv` (S5 pair inventory). The hand-written `CONTENT_SWEEP_FINDINGS.md` interprets them.
- **Exit codes:** 0 = ran (findings are data, not failures); 2 = tool error (unreadable file, unresolvable zones, a table that parses to 0 rows, an empty file list). Not wired into CI: the sweep reports known violations by design; Step 4 promotes cleared classes into `content-lint.sh`.
- **`pnpm content:sweep`** script; `--check S3,S9` filter for Step 4 re-runs.
- **Tests:** `vitest.config.ts` `include` gains `scripts/**/*.test.mjs`; `scripts/sweep/__tests__/checks.test.mjs` has, per check, ≥ 1 positive and ≥ 1 negative fixture (incl. use-vs-mention, code-masked legend, zone boundaries, Unicode/NFC input), plus a smoke test that runs the sweep on the real corpus and asserts zero tool errors and every check executed on > 0 files (anti-vacuous).

---

## 6. Verification of the sweep itself (precision + recall)

1. **Recall anchors** (must be found, else the check is broken): `de/john/PEOPLE.md` "YHWHs" (S1a); `en/mark` 8× "Son of Man" and `pt-br/mark/CHAPTER-2.md` 16× "Filho do Homem" (S2a, pre-existing counts from the audit — recounted, differences explained); 9 mojibake in `en/genesis/PEOPLE.md` (S12); ES Gen 4:9 "No se" (S11c or S11a); `en/john/CHAPTER-3.md:39` stale policy statement (S5d-ii); `P-009` in EN reader text (S9a); the 12 DE "Yehudim" files (S13); the 190-hit T-20 upper bound reproduced exactly by S7a before classification.
2. **Precision sampling:** for every check with > 10 hits, a seeded random sample of 10 hits is hand-verified and the precision recorded in the findings doc (e.g. "S9c: 9/10 true leaks"). A check below 70 % precision is reported as `review-list`, not as a defect count.
3. **Determinism:** two consecutive runs produce byte-identical outputs (`git diff --exit-code`).
4. **Cross-tool consistency:** S10 stamp+citation total = §0.1b's 137 lines; S7a raw total = T-20's 190.

---

## 7. Allow-list hygiene (the only non-report change)

- Remove the 22 stale `0.8|…` entries (each verified absent from its file before removal; any entry still matching is kept).
- New test `src/infrastructure/content/__tests__/lint-allowlist.test.ts`: every non-comment allow-list line has a known rule id, an existing file, and its exact match text present in that file — a stale entry fails the gate (closes I24 permanently).
- `content:lint` output must be unchanged by the removal (stale entries suppress nothing) — verified by diffing lint output before/after.

---

## 8. Lead decisions the findings doc must surface (not taken in Step 3)

1. **PT contraction convention (T-20):** how to mark an added article fused into a contraction. Options to present with examples: (A) italicize the whole contraction (`*na* carne`); (B) do not mark articles fused into contractions (PT grammar requires them; document in the Reading Guide); (C) rewrite to avoid the contraction where possible. Recommendation given with rationale.
2. **S2b casing** (Word/Spirit/Christ) if not already locked.
3. **S14 PT register** (vós vs vocês).
4. Any S5b names the tables lack (D11 says "proposed in the step-4 plan for audit" — Step 3 supplies the list).

---

## 9. Execution order

1. Branch `content-sweep` (done). 2. Build the zone splitter + table extractor + fixtures first (they gate everything). 3. Implement S1–S16 with fixtures. 4. Run; check recall anchors; fix checks until all anchors hit. 5. Precision sampling; reclassify low-precision checks. 6. Write `CONTENT_SWEEP_FINDINGS.md` (per check: count, precision, class split, top files, route, decision needed). 7. Allow-list hygiene + guard test. 8. Docs: LAUNCH_PROGRAM (Step 3 row + progress log), EXECUTION_HISTORY, PENDING (point to findings), CLAUDE.md (test count, commands), CONTRIBUTING/playbook (the sweep command; T-20 now sized). 9. Full gate. 10. **5-reviewer implementation review** (§11), fixes. 11. PR → CI green → merge (D14).

---

## 10. Gate (definition of done)

`pnpm test` · `pnpm lint` · `pnpm typecheck` · `pnpm content:lint` (output identical except removed-stale-entry effects = none) · `pnpm build` · `pnpm content:sweep` (exit 0, deterministic) · CI `gate` green on the PR. Conservation gate unchanged (no content edits): 408 files / 20,599 units.

---

## 11. Implementation review (after execution)

Five independent reviewers, each given the code/outputs, not my conclusions: **R1** tool correctness (zone splitter edge cases, regex Unicode/boundary behaviour, determinism, tool-error paths — mutation-test the fixtures); **R2** recall (independently re-derive 3+ classes with their own greps and compare totals); **R3** precision + classification (hand-check samples, use/mention classifier, T-20 classification against the Greek); **R4** completeness vs inputs (every §2 item either has a check, a carried-forward line in the findings doc, or a stated reason; every finding routed); **R5** docs + process coherence (counts consistent across docs, no claims without a committed source, Step 4 work list actionable).

---

## 12. Risks

| Risk | Mitigation |
|---|---|
| Zone misclassification makes legitimate mentions look like defects (or hides real ones) | Zones from the parser's own heading sets; fixtures per zone; tool error on unresolvable chapters; use/mention reported, never filtered |
| Over-broad regexes inflate Step 4 | Precision sampling (§6.2); low-precision checks downgraded to review lists |
| Corpus-dominance accent method "fixes" correct unaccented words (Step 2: `Envió`/`Envío`, `Ediciones`) | Ambiguity list reported separately; S11 is a list for Step 4 human/scripted-with-review fixing, not an auto-fixer |
| Findings snapshot goes stale as Step 4 edits content | It is a dated snapshot; Step 4 re-runs `pnpm content:sweep` and diffs |
| New vitest include picks up unintended files | Include pattern limited to `scripts/**/*.test.mjs`; test count change reported |

---

## 13. Plan review (independent adversarial reviewer) — resolution

| # | Sev. | Finding | Resolution (as executed) |
|---|---|---|---|
| R-1 | blocker | Masking inline code hides reader-visible leaks (renderer has no code handling; ~476 backticked `.md` paths; the legend is *not* backticked) | No masking; legend exempted by pattern; S6b = backticked markers; backticked paths counted by S9 |
| R-2 | major | Every verse counted twice (CR + verse study) | New `cr` zone; lexical checks judge the verse copy only; S6a/S6e/S7d compare the copies |
| R-3 | major | 190 is a whole-file count; JS `\b` misses `à`/`às` | Unicode boundaries; S7a records every zone → reproduces exactly 190 (test-pinned); notes classed `note-quotes-verse` |
| R-4 | major | PT already uses intra-word `n*a*` (131) and whole `*na*`; option D missing; classifier ill-defined; `ao *ver*` | Three forms inventoried; per-verse article accounting (EN italic articles vs PT article marks); `ao+infinitive` class; L1 options re-cut (A = intra-word) |
| R-5 | major | Quoted OT "LORD" is the defect, not a mention; caps note titles flood S1c | S1c default **use**; `convention-mention` only with discussion cues; caps runs / caps lines skipped (acronyms exempt) |
| R-6 | major | Zone-blind use/mention; raqia defect lives in overviews; S2a caps titles | TT-voice prose classified `tt-voice` (use) vs `mention`; verse text always `main`; S2a skips caps runs and sentence-initial forms |
| R-7 | major | πάσχα locked "Pesach": real drift is Passover/Páscoa/Pascua/Passa | S3 `pascha` term set replaced (Easter/Ostern kept in the set) |
| R-8 | major | χριστός "Messiah" vs locked "anointed one" unchecked | New S17 (per book × form, verse text) → Decision L7 |
| R-9 | major | Rule 30 *scope* never checked | New S6f: citation-formula / messenger context + `@@` opening inside a human speaker's open quotation (locale quote styles) → Decision L3 |
| R-10 | major | Raw span multiset would false-flag cross-verse quotes; S6b premise wrong | Per-verse coverage with carried open/close state, quotes stripped, glosses collapsed; S6b reduced to backticked markers + unbalanced `@@` per line |
| R-11 | major | Zone model vs what renders (CR description line, ES "TABLA DE CONTENIDOS", parser-dropped Sources/0-entry sections, front fields) | Every hit carries `render` = now / after-4a / no derived from the parsers + UI (only chapter Status renders); S16 flags TOC titles the parser does not skip (3 ES files) |
| R-12 | major | S11 anchor unreachable; needs context rules; English titles, anchors, caps | Context rules (`No se.`, `¿/¡` interrogatives, `-o/-ó` verb class); Source lines, italic titles, link anchors and `.md` paths excluded; caps case-folded and reported as their own class |
| R-13 | major | S12 patterns miss the real C1-control bytes; bare `Â` / `â␠` false hits | C1 controls detected (one hit per run); bare `Â`/`â` dropped; 9/9 anchors found (test-pinned) |
| R-14 | minor | S2b is locked (Rule 20), not a decision | Routed 4b; TT-voice zones scanned |
| R-15 | minor | D9 overrides the table for DE Yehudim; per-`##` granularity is already written in RULES-HB | Inventory ignores the familiar-less Yehudim row; verse-card granularity → Decision L2 |
| R-16 | minor | "pivot" is mostly literary | Only `EN-pivot` / `pivot artifact/language`; "propaganda" and Spanish/Portuguese "TODO" excluded |
| R-17 | minor | Guard test details; presence ≠ suppression | Split on the first two `|`, no trim, comment/blank skip, rule ids from the lint script; **plus** `content-lint` now records every suppression and fails on an entry that suppressed nothing (blocking, bash 3.2/5.x) |
| R-18 | minor | `.mjs` not linted / typechecked; `--check` overwrote the snapshot; locale-dependent sort | `pnpm lint` = `biome check src/ scripts/`; code-point sort; filtered runs print only; hash-seeded sampler. `.mjs` stays out of `tsc` (plain JS, no build step) — covered by Biome + 36 fixture tests |
| R-19 | minor | n = 10 too weak | Sampled 6–20 per class (20 for the large ES and leak classes), whole class read when < 50; precision recorded per class in the findings |
| R-20 | minor | 13 DE files, not 12; `INTERPRETIVE` is a note title; DE/EN convention explanations | Anchor = 13 files (test-pinned); INTERPRETIVE verified as a title only (PENDING item closed in 4d); S1a/S1b `convention-explanation` / `meta-leak` classes |
| R-21 | minor | Tier-2 length, הִנֵּה alternation, waters/water dropped | S18 (soft cap → Decision L8); S19 (0 hits); waters/water carried forward as a lead question |
| R-22 | minor | "2–3×" claim wrong | Corrected in §1 |

## 14. As executed (deviations from §3–§12)

- **Zones** add `cr` (continuous reading) and a per-line **render** state; chapter `front` renders only its Status line (the pill).
- **Checks added** beyond §4: S6f (Rule 30 scope), S16 (TOC rendered as a section), S17 (χριστός), S18 (Tier-2 length), S19 (הִנֵּה lock). S6b redefined (backticked markers). S2b routed 4b.
- **Gate additions:** `scripts/**/*.test.mjs` in vitest (36 tests incl. the real-corpus smoke + recall anchors + determinism); `lint-allowlist.test.ts` (2 tests); content-lint `allowlist` rule; `pnpm lint` covers `scripts/`. Tests 929 → **967** (19 files); after the implementation review (§15) **1,002**.
- **Allow-list:** the 22 stale `0.8|` entries removed; content-lint output byte-identical before/after.

## 15. Implementation review (5 adversarial agents, 2026-11-20) — resolution

Reviewers: R1 tool correctness (+ 40-mutant mutation run), R2 independent recall (own Python parsers), R3 precision and rule fidelity, R4 docs/completeness, R5 gate/CI/infra (macOS bash 3.2 + Docker bash 5.2/mawk). No blockers. The fixes are recorded in `CONTENT_SWEEP_FINDINGS.md` §6; the ones that change this plan:

- **§3 zones:** Sources blocks are decided by heading words (companion "G." = Curiosities); PROPHECY files get their own render model mirroring `prophecy-parser.ts`; the INTRODUCTION `<!-- CARD -->` block is rendered (book landing).
- **§4 checks:** S3 adds πίστις, Ἰουδαῖοι, DE Umkehr/Eintauchung; S7a covers DE/ES and classes doubled articles and possessives; S5d covers the continuous reading as its own section; S6e classes gloss placement; S6f adds the J-007 unresolved range; S8 compares the chapter pill word with the i18n badge term; S9 adds AI provenance and Tier-2 jargon; S13 adds lowercase yehudim; S14 adds vós verb forms; new **S20** (Rule 20 titular nouns), **S21** (`{t:}`/`{a:}` values against the glossary tables; bare slashes), **S22** (EN dual-label registry; note icons).
- **§6.1 recall anchors:** moved off the live corpus. A test that requires a defect to exist breaks the gate when Step 4 fixes it (with `enforce_admins`, nobody could merge). Anchors are now frozen real lines (`scripts/sweep/__tests__/fixtures/recall-anchors.json`, each with file:line at f157960); the live-corpus test asserts tool health and determinism only; an anti-vacuity test requires every check id to fire on some fixture. §6.4 (S7a = 190) is re-verified in the findings doc, not pinned by a test.
- **§6.2 precision:** every figure is now sourced in `docs/audit/content-sweep/precision.tsv`.
- **Mutation testing (R1's harness, re-targeted):** 56 mutants — the first pass's 28 survivors plus 28 on the new logic — **56/56 killed** (first pass 12/40).
- **§5 tool:** `--check` ids are validated (unknown/missing → exit 2) and select exact families (`S1` ≠ `S10`); files are NFC-normalized at load; the sampler moved to `scripts/content-sweep-sample.mjs`; `name-tables.mjs` → `rule-tables.mjs` (also extracts glossary cells); the scripts are type-checked (`tsconfig.scripts.json`, part of `pnpm typecheck`).
- **Infra (R5):** CONTRIBUTING and PLAN_SAFETY_NET I23 describe the branch protection now in force; `gate.yml` documents that the job id `gate` is the required check; `content-lint` passes paths to awk through `ENVIRON` and turns a failed allow-list filter into a tool error; `archive/*` tags are protected by a ruleset; `docs/audit/content-sweep/*.tsv` are marked generated.

