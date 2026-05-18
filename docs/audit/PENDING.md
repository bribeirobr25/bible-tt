# Pending & Deferred Items

**Original date:** 2026-05-05
**Re-verified:** 2026-05-13 against current code, content, and rules (post Phase 11 closure).
**Execution underway:** Phases 0–6.6 closed 2026-05-09; Phase 7 closed 2026-05-13; Phase 11 (Option C) closed 2026-05-13. Phase 5.5 landed Ruleset v3.3. Phase 6A re-verified the 9 NOT VERIFIED audit items (7 already-resolved + 2 actioned: PT-BR Almeida Option B + 18-file cascade; *charis* slash compliance in EN/DE/ES John 1; Item 14 cross-locale title-cap normalized via Option 2 to PT-BR/ES verse text lowercase). Phase 6B piloted Rule 29 §734 Tier 2 Relocation Protocol on Genesis 9 across all 4 locales (4 notes tightened with companion-section pointers; technique validated and documented in `docs/editorial-log/genesis.md` Entry 100). Phase 6.6 (post-Phase-6 UX + content polish) landed across 9 sub-phases: 6.6A en-dash sweep; 6.6B people-parser auto-extracts familiar name (+4 tests, 792→796); 6.6C introduction disclaimer in collapsed `<details>` "Reading note"; 6.6D person-card biographical-fields reorder + birthYear/deathYear rows; 6.6E HTML-native single-expand accordion; 6.6F chapter breadcrumb; 6.6G Matthew 5 NT figures × 4 locales authored with birthYear/deathYear/lifespan + numeric-anchor convention adopted (Entry 2026-05-09-101 / M-014); 6.6H women timeline audit (Eve/Sarai Option-1 + Bat-Sheva intentional absence — M-015); 6.6I dead-code/content audit (12 categories, 0 actionable removals, all KEEP-with-reason). M-016 logs the Rule 29 §792 disclaimer-placement governance decision. All blocking content-lint rules pass. FEEDBACK status: 23 RESOLVED / 2 PARTIAL / 13 NOT VERIFIED / 0 STILL OPEN of 38 items.

---

## Verified status of prior items

### Phase 10 — Genesis 13–50 — STILL OPEN

`content/{en,pt-br,de,es}/genesis/` contains `CHAPTER-1.md` through `CHAPTER-12.md` and the corresponding study files. No chapters 13+ exist in any locale.

- 38 chapters × 4 locales = 152 chapter files (not yet authored)
- 152 companion files (not yet authored)
- Prophecy files for chapters with prophetic content
- Section I scenarios + categories per chapter (Genesis Section I currently uses 4 scenarios; carry that forward)
- PEOPLE.md expansion for figures introduced in Gen 13+
- VerseRelated tables (manual population per chapter)
- Parser infrastructure auto-discovers new files; no code changes required.

### R2 em-dash + accessibility pass for non-EN — PARTIAL

The original audit said the EN sweep was complete and ~144 non-EN files still needed it. Re-check on 2026-05-08:

| Locale | Companions with raw `--` |
|--------|--------------------------|
| EN     | 3 (Matthew 1, 2, 3)      |
| DE     | 12                       |
| PT-BR  | 3                        |
| ES     | 5                        |

So the sweep is **also incomplete in EN Matthew companions**, not just in non-EN content. The remaining work is smaller than 144 files but distributed across all four locales.

### C3 — People Cross-Book Canonical Structure — STILL OPEN

The current per-book PEOPLE.md model is unchanged. Refactor to cross-book canonical entries when figures appear in additional books (Avraham, Mosheh, David, etc. once Gen 13+ or Exodus is authored).

**Phase 6 follow-up (2026-05-09):** the see-only entry pattern (`**See:** genesis/PEOPLE.md` + `**In Matthew:** ...`) now renders correctly with a clickable cross-book link to the source book's people page (Phase 6 follow-up). The deeper "source-of-truth fetch" — where Avraham in matthew/people would also display the full Genesis bio fields merged with the Matthew-specific role — is deferred to this Phase 13 task. Design considerations identified:

- **Slug-resolution mechanism.** Genesis uses `Avram` (pre-Gen 17 name); Matthew uses `Avraham` (post-renaming). Same person, different slugs. Need either (a) explicit slug pointer in the see-line (e.g., `**See:** genesis/PEOPLE.md#avram`), or (b) a `canonical-slug:` / `also-known-as:` field that maps both names to a shared identifier. Option (a) is simpler and explicit.
- **Cross-book parser/loader.** Render-time fetch: the matthew/people page would also load genesis/PEOPLE.md and resolve the slug. Build-time pre-merge alternative would expand the matthew JSON output but simplify render. Static-first architecture suggests build-time merge.
- **Graceful dangling-pointer handling.** As of 2026-05-09, only Avraham's Genesis bio exists; Yitschaq, Ya'aqov, Yehudah, Tamar await Phase 12 (Gen 13–50). Pointer resolution must fail soft — show the see-only display + link if source entry doesn't exist yet.
- **Merge UI design.** How to visually present "this is the cross-book source" vs "this is the in-Matthew narrative"? Section divider with "Sourced from Genesis" caption? Two-column layout? Tabbed interface? Decision needs UX prototyping.
- **Cross-locale slug normalization.** Each locale's slug derives from the heading (e.g., EN `Avraham (Abraham)` → slug `avraham`). Slugs already match across EN/PT/DE/ES because the transliterated source-language name is the slug seed in all locales. Verify when designing.

**Estimated effort:** ~6–10h for the implementation + ~3–5h for the merge UI design + cross-locale verification. Best landed after Phase 12 (Gen 13–50) so all referents exist.

---

## Newly identified pending items (from 2026-05-08 re-audit)

### Ruleset version stamp drift — HIGH PRIORITY

`docs/rules/RULES-CORE.md` is at **v3.2**, but content references are stuck at v3.0 (180 occurrences) or v3.1 (4 occurrences). Editorial logs are mixed (genesis: v3.0, john: v3.1, matthew: v3.1). Sweep targets:

- All chapter front matter (`content/*/{genesis,john,matthew}/CHAPTER-*.md`) — `v3.0` / `v3.1` → `v3.2`
- All PEOPLE.md files (`content/*/{genesis,matthew}/PEOPLE.md`) — `v3.0` → `v3.2`
- All companion files where the ruleset version is cited (e.g., `Active rules with John-specific applications` table) — bump to `v3.2`
- Editorial logs (`docs/editorial-log/{genesis,john,matthew}.md`) — bump `Ruleset version in force` to `v3.2`

### Spanish John diacritic loss — HIGH PRIORITY

`content/es/john/CHAPTER-{1,2,3}.md` lost diacritics across both front matter and body. Examples from CHAPTER-1.md: `Traduccion`, `Edicion`, `Espanol`, `Politica`, `Senor`, `el` (for `él`), `llego` (for `llegó`), `vencio` (for `venció`), `dia` (for `día`). ES Genesis and ES Matthew are clean. Treat as a focused locale fix on three files plus their companions.

### Spanish Reina-Valera declaration in NT — MEDIUM PRIORITY

ES Genesis 1–12 declare Option B (Reconocimiento selectivo) in front matter. ES John 1–3 and ES Matthew 1–3 do not. Add the declaration to all 6 NT front-matter blocks.

### John PEOPLE.md missing — RESOLVED 2026-05-14 (Phase 10)

Phase 10 (`docs/audit/archive/PHASE_10_PLAN.md`) closed 2026-05-14. All 4 locales now have `content/{en,pt-br,de,es}/john/PEOPLE.md` (11 entries each × 4 locales = 44 entries): 2 see-only cross-book pointers to `matthew/PEOPLE.md` (Yochanan, Yeshua); 5 full PersonEntry profiles (Andreas, Shimon Kefa, Philippos, Nathanael, Nikodemos); 1 group entry (Yehudim — Ioudaioi Policy 3-sense breakdown in `**Character arc:**` field per audit Significant #2 fix); 3 see-only stubs to future books (Mosheh→exodus, Eliyahu→kings, Yeshayahu→isaiah — dangling-pointer fallback verified). 801 tests pass; pnpm build succeeds; HTTP 200 across 4 locales. See `docs/editorial-log/john.md` Entry J-021.

### PT-BR monogenēs cross-language inconsistency — MEDIUM PRIORITY

`content/pt-br/john/CHAPTER-3.md` uses `unigênito` 10×; `CHAPTER-1.md` 7×. EN renders "only-born", DE "einziggeborenen", ES "único-nacido". Decide on a cross-language-aligned rendering for PT-BR (e.g. `único-nascido` or `unigerado`) and apply.

### Readability sweep on John / Matthew companions — RESOLVED 2026-05-13

Phase 7 (`docs/audit/archive/PHASE_7_PLAN.md`) closed 2026-05-13. All 32 in-scope files (24 chapter companions + 8 introductions × 4 locales) now satisfy the grandmother-test standard. See `docs/editorial-log/john.md` Entry J-019 and `docs/editorial-log/matthew.md` Entry M-017 for the per-file edit log; `docs/feedback/DEFERRED_TASKS.md` Task 2 verdict updated to RESOLVED.

### John / Matthew prophecy material — RESOLVED 2026-05-13 (Phase 11 Option C)

Phase 11 (`docs/audit/archive/PHASE_11_PLAN.md`) closed 2026-05-13 with Option C. 12 PROPHECY files authored (3 chapters × 4 locales): John 3 (Numbers 21 / Yeshua-lifted parallel); Matthew 1 (Isa 7:14 *parthenos*/*almah*); Matthew 2 (Mic 5:1+2 Sam 5:2, Hos 11:1, Jer 31:15, Natsri-unresolved). 6 prophecy entries per locale, 24 entries total across all locales. Prophecy view-mode now lit for John 3 + Matt 1 + Matt 2. John 1:51, John 2:19–22, and Matt 3:3 deliberately deferred (their content is already fully treated in chapter companions; not dense enough to warrant dedicated prophecy files). See `docs/editorial-log/john.md` Entry J-020 and `docs/editorial-log/matthew.md` Entry M-018.

---

## Content seeds registered from `docs/feedback/possible-content.md` (2026-05-15 review)

Pieces of the `possible-content.md` source file that survived a per-topic accuracy + Rule-3/13/29 audit but fall outside the current authoring scope. Each is queued to the chapter / book where it would naturally land, with the audit verdict that places it.

### Genesis 22 — Akedah → Crucifixion typological parallels — DEFERRED to Phase 12

Verbal and structural parallels between Gen 22 (Avraham/Yitschaq, Mount Moriah, the ram caught by horns, the wood carried by the son) and the Passion narratives have been catalogued in Christian typological tradition since at least Origen. Place in **Gen 22 CONTEXT §F (Later Reception in Other Traditions)** when Genesis 22 is authored. Required label: `LATER RECEPTION — PROBABLE` for the verbal parallels (wood, only son, Mount Moriah = traditional Temple-Mount identification); the typology itself is `LATER RECEPTION — POSSIBLE`. Do **not** present as TEXTUAL or as authorial intent of Gen 22. Reject the popular "Isaac was 33" claim — rabbinic tradition (Gen Rabbah 56:8) puts him at ~37; "33" is post-hoc Christian retrofit. Source file: `docs/feedback/possible-content.md` Topic 1, second half.

### Exodus 34 — Moses *karan* (קָרַן) ambiguity + Jerome's *cornuta* + horn iconography — DEFERRED to Phase 14+

Strong scholarly content (Hebrew root QRN = "horn"/"emit rays" semantic field; Jerome's Vulgate "cornuta" choice at Exod 34:29–35; Ezekiel-commentary evidence that Jerome understood the metaphorical sense; medieval and Renaissance horned-Moses art; ANE bull / ram horn iconography of divinity). Belongs in **Exod 34 CONTEXT** when authored — §C (Linguistic and Philological Deep Dives) for the QRN ambiguity; §B (ANE Parallels) for horn-as-divinity iconography; §F (Later Reception) for the Vulgate → Michelangelo art-history chain. Compatible with Rules 2 + 14 (preserve ambiguity + annotate wordplay). When Gen 22 is authored, add a forward-pointer note from the "ram caught by horns" verse linking forward to the *karan* / horn-symbolism thread in Exod 34. Source file: `docs/feedback/possible-content.md` Topic 8.

### Luke 1 — Mary as new Ark of the Covenant typology — DEFERRED to Luke authoring (post-Phase 14)

Verbal parallels between Luke 1:39–56 and 2 Samuel 6 (LXX): "hill country of Judea" (Luke 1:39 ↔ 2 Sam 6:2); 3-month stay (Luke 1:56 ↔ 2 Sam 6:11); leaping (Luke 1:41 παιδίον ἐσκίρτησεν ↔ 2 Sam 6:14 LXX — different verb but parallel motif); "overshadow" (Luke 1:35 ἐπισκιάσει ↔ Exod 40:35 LXX of the tabernacle). The verbal parallels are real but the typological identification of Mary with the Ark is Catholic / Marian tradition, not authorial intent of Luke. Place in **Luke 1 CONTEXT §F (Later Reception in Other Traditions)** when Luke is authored. Required label: `LATER RECEPTION — PROBABLE` for the verbal parallels; the Mary-as-Ark identification itself is `LATER RECEPTION — POSSIBLE`. Source file: `docs/feedback/possible-content.md` Topic 1, middle.

### ~~ES Matthew diacritic loss (parallel to the resolved ES John issue)~~ — RESOLVED 2026-05-17

Surfaced 2026-05-16 during Step 1 authoring of the Possible-Content Bundle. The existing `## Ya'aqov (Jacob)` entry at `content/es/matthew/PEOPLE.md` contained pre-existing UTF-8 mojibake (`genealogÃ­a` instead of `genealogía`, `JudÃ¡` instead of `Judá`) plus broader corruption across `content/es/matthew/INTRODUCTION.md` (29 affected lines) and `content/es/matthew/PEOPLE.md` (33 affected lines). Same double-encoding pattern as the ES John sweep (J-023, RESOLVED 2026-05-14).

**Fix applied 2026-05-17:** ran `ftfy.fix_text` on both files. ES INTRODUCTION recovered 29 lines (Spanish diacritics, em-dashes, Greek script in §A2's `καὶ ἐγένετο ὅτε ἐτέλεσεν ὁ Ἰησοῦς τοὺς λόγους τούτους`), ES PEOPLE.md recovered 33 lines. Bundle's Iakobos see-only stub (line 37–39) verified unchanged. 817/817 tests pass, build clean, lint clean. Visual validation via MCP browser confirmed all corrupted glyphs now render correctly. See `docs/editorial-log/matthew.md` Entry M-024.

### ~~EN Matthew INTRODUCTION pre-existing mojibake (sibling finding to ES sweep)~~ — RESOLVED 2026-05-17

Surfaced 2026-05-17 during the Possible-Content Bundle visual-validation loop (MCP browser inspection of `/en/matthew/introduction` route). The EN matthew INTRODUCTION + PEOPLE.md authored in commit `a95186d4` (2026-05-09) contained pre-existing UTF-8 mojibake on em-dashes (`â` instead of `—`) and Greek script (`á¼¸Î·ÏÎ¿á¿¦Î½` instead of `Ἰησοῦν` at line 229, `á¼µÎ½Î± / á½ÏÏÏ ÏÎ»Î·ÏÏÎ¸á¿` instead of `ἵνα/ὅπως πληρωθῇ` at line 274, plus 12 other affected lines in INTRODUCTION and 19 in PEOPLE.md).

**Fix applied 2026-05-17:** ran `ftfy.fix_text` on both files. EN INTRODUCTION recovered 14 lines, EN PEOPLE.md recovered 19 lines (mostly em-dashes plus Papias quote's `Hebraidi dialektō`, Great Commission's `panta ta ethnē`, and the Matt 27:16–17 Greek). Bundle's §E4 addition (lines 233–238) verified unchanged. 817/817 tests pass, build clean, lint clean. Visual validation via MCP browser confirmed Matt 1:16 em-dash and Matt 27:16–17 Greek `Ἰησοῦν Βαραββᾶν` now render correctly. See `docs/editorial-log/matthew.md` Entry M-024.

DE Matthew INTRODUCTION + PEOPLE.md confirmed byte-clean (no fix needed). PT-BR Matthew confirmed byte-clean (the earlier broad regex matched only legitimate Portuguese diacritics).

### ~~DE Matthew familiar-names first-occurrence non-compliance~~ — RESOLVED 2026-05-18 (FEEDBACK item 35)

Surfaced 2026-05-17 during the re-audit pass of the 12 NOT VERIFIED FEEDBACK items. DE chapter files violated the existing RULES-HB.md §PROPER-NAME TABLE note rule via 335 redundant-parens occurrences (`Name (Name)` identical-word) across DE Matthew 1-3 (96), DE John 1-3 (82), DE Genesis 1-12 (152), plus 1 stray in `de/john/study/CHAPTER-1-CONTEXT.md`. Cross-locale check confirmed DE-only — PT-BR/EN/ES were already compliant.

**Resolved 2026-05-18** via `docs/audit/DE_FAMILIAR_NAMES_PLAN.md` (Q1=Hybrid, Q2=All DE chapter files, Q3=Emergency-amendment pathway). 259 in-scope occurrences swept; 76 left in out-of-scope GLOSSAR + KAPITELÜBERGREIFENDE VERFOLGUNG tables (correctly preserved per plan). RULES-HB.md §PROPER-NAME TABLE notes amended via v3.3.1 emergency amendment with proposal artifact at `docs/rules/proposals/v3.3.1-emergency-DE-name-rendering-clarification.md`. See `docs/editorial-log/genesis.md` Entry 2026-05-18-107 (anchor) + `docs/editorial-log/john.md` Entry J-026 + `docs/editorial-log/matthew.md` Entry M-025 for full execution log. 819 tests pass (unchanged baseline); `pnpm build` + `pnpm lint` + `pnpm content:lint` clean.

### ~~people-parser slug collision detection~~ — RESOLVED 2026-05-17

The people-parser at `src/infrastructure/content/people-parser.ts` derives PersonEntry slugs via `name.toLowerCase().replace(/\s+/g, "-")` (line 740) where `name` is everything before the first parenthesis in the H2 heading. The parser previously had **no duplicate-slug detection** — two homonymous transliterated source-names (e.g., both `Ya'aqov` headings) would silently collide on the slug `ya'aqov`. Gap was surfaced by `docs/audit/AUDIT_POSSIBLE_CONTENT_BUNDLE_PLAN_v2.md §7.6`.

**Fix applied 2026-05-17:** added a duplicate-slug check inside `flushEntry` at `people-parser.ts:707-720`. When a slug already exists in the `entries` array, the parser emits `console.warn` with the colliding name and an actionable mitigation hint ("Disambiguate by using a different transliteration form in the heading"). Two new vitest cases (positive + negative) cover the collision-warning path and verify that the documented `Iakobos`/`Ya'aqov` mitigation (used by Possible-Content Bundle Q5) does NOT trigger the warning. 819/819 tests pass; build clean; lint clean.

---

## Summary

| Item | Status |
|------|--------|
| Genesis 13–50 content | STILL OPEN |
| Em-dash / accessibility sweep | PARTIAL — Matt sweep done 2026-05-17 (M-024); Genesis pt-br/de/es PEOPLE + de chapter-3-context done 2026-05-17 (genesis 2026-05-17-106); remaining: deliberate non-en authoring future work |
| Cross-book canonical PEOPLE | STILL OPEN |
| Akedah → Crucifixion typology (Gen 22 §F) | DEFERRED to Phase 12 |
| Moses *karan* / horns (Exod 34) | DEFERRED to Phase 14+ |
| Mary as new Ark typology (Luke 1 §F) | DEFERRED to Luke authoring |
| ES Matthew diacritic loss (parallel to resolved ES John issue) | RESOLVED 2026-05-17 (ftfy sweep; see matthew.md M-024) |
| EN Matthew INTRODUCTION em-dash + Greek mojibake (sibling) | RESOLVED 2026-05-17 (ftfy sweep; see matthew.md M-024) |
| people-parser slug-collision detection | RESOLVED 2026-05-17 (console.warn + 2 vitest cases at `people-parser.ts:707-720`) |
| DE Matthew familiar-names redundant parens (FEEDBACK item 35) | RESOLVED 2026-05-18 (335 occurrences, 259 swept in-scope; v3.3.1 emergency amendment; see genesis.md 2026-05-18-107 anchor) |
| Tier 2 note bloat propagation (FEEDBACK item 19) | RESOLVED 2026-05-18 — Genesis sub-sweep (6 relocations × 4 = 22 edits, genesis.md Entry 2026-05-18-108) + John sub-sweep (2 relocations × 4 = 8 edits, john.md Entry J-027) + Matthew sub-sweep (Matt 1:23 EN-only + Matt 2:11 × 4 = 5 edits, matthew.md Entry M-026). Strict §734 review reduced heuristic 64 RELOCATE candidates → 10 real relocations (15.6% effective rate vs. Gen-9-pilot 43%); most heuristic candidates were already-compliant with existing pointers or compact lexical/grammatical notes outside §734's enumerated content types. Phase 7 readability prose-economy pass will address residual borderline 4-sentence lexical notes. |
| Phase 13 — Cross-Book Canonical PEOPLE formalization | RESOLVED 2026-05-18 — RULES-CORE.md Rule 29 §People and Genealogy Files extended via v3.3.2 emergency amendment (markdown convention + locale-translation table + 7-slug allow-list + 5-change new-book activation checklist + transition logging); proposal artifact at `docs/rules/proposals/v3.3.2-cross-book-PEOPLE-formalization.md`; new warn-only §0.12 content-lint rule; CLAUDE.md updated. See genesis.md Entry 2026-05-18-109. |
| README.md staleness (5 confirmed-stale lines: 68 John PEOPLE.md not authored, 121 parser count, 122 test count 796→819, 125 project-state snapshot 2026-05-09, 145 parser tree comment) | DEFERRED to separate phase — Phase 13 Q4=C lock 2026-05-18. Scope: targeted 5-line fix + quick scan for other staleness. Estimated ~30 min. Add a forward-tracking phase or fold into the next opportunistic doc-update commit. |
| **NEW:** v3.2 version stamp sweep | RESOLVED (already at v3.3 across 200 content references — completed in prior phase) |
| **NEW:** ES John diacritics | RESOLVED 2026-05-14 (1,128 replacements across 7 files; see `docs/editorial-log/john.md` Entry J-023) |
| **NEW:** ES NT Reina-Valera declaration | RESOLVED (all 6 NT chapter front-matter blocks already have Option B declaration — completed in prior phase) |
| **NEW:** John PEOPLE.md | RESOLVED 2026-05-14 (Phase 10) |
| **NEW:** PT-BR monogenēs | RESOLVED (PT-BR main text already renders as `único-nascido` consistent with EN/DE/ES; remaining 4 `unigênito` references are intentional scholarly metadiscussion explaining why the term is avoided) |
| **NEW:** PT-BR + DE + ES Genesis PEOPLE.md mojibake | RESOLVED 2026-05-17 (ftfy sweep on 4 files; see `genesis.md` Entry 2026-05-17-106) |
| **NEW:** DE Genesis CHAPTER-3-CONTEXT.md Hebrew script mojibake | RESOLVED 2026-05-17 (same sweep — `אַיֶּכָּה` *ayyekkah* at Gen 3:9 recovered) |
| **NEW:** Readability on John/Matt companions | RESOLVED 2026-05-13 (Phase 7) |
| **NEW:** John/Matt prophecy file decision | RESOLVED 2026-05-13 (Phase 11 Option C) |
| **NEW:** Section I 10-category coverage audit | RESOLVED 2026-05-14 (Phase 8) |
