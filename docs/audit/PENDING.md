# Pending & Deferred Items

**Original date:** 2026-05-05
**Re-verified:** 2026-05-08 against current code, content, and rules.
**Execution underway:** Phases 0–6 closed 2026-05-09. Phase 5.5 landed Ruleset v3.3. Phase 6A re-verified the 9 NOT VERIFIED audit items (7 already-resolved + 2 actioned: PT-BR Almeida Option B + 18-file cascade; *charis* slash compliance in EN/DE/ES John 1; Item 14 cross-locale title-cap normalized via Option 2 to PT-BR/ES verse text lowercase). Phase 6B piloted Rule 29 §734 Tier 2 Relocation Protocol on Genesis 9 across all 4 locales (4 notes tightened with companion-section pointers; technique validated and documented in `docs/editorial-log/genesis.md` Entry 100). All blocking content-lint rules pass. FEEDBACK status: 23 RESOLVED / 2 PARTIAL / 13 NOT VERIFIED / 0 STILL OPEN of 38 items.

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

### John PEOPLE.md missing — MEDIUM PRIORITY

Genesis and Matthew have PEOPLE.md across all four locales. John has none. Author EN-first (Yochanan, Yeshua, Andreas, Kefa, Philippos, Nathanael, Nikodemos, Yehudim, Eliyahu, Mosheh, etc. as introduced in John 1–3), then PT-BR / DE / ES.

### PT-BR monogenēs cross-language inconsistency — MEDIUM PRIORITY

`content/pt-br/john/CHAPTER-3.md` uses `unigênito` 10×; `CHAPTER-1.md` 7×. EN renders "only-born", DE "einziggeborenen", ES "único-nacido". Decide on a cross-language-aligned rendering for PT-BR (e.g. `único-nascido` or `unigerado`) and apply.

### Readability sweep on John / Matthew companions — MEDIUM PRIORITY

Genesis INTRODUCTION already glosses Masoretic Text, Septuagint, JEDP on first use. John/Matthew companions still use unglossed `Colwell` (5× in EN John 1 companion), `predicate nominative`, `anarthrous`, `chiastic`, etc. Apply the grandmother/teenager test (`docs/feedback/DEFERRED_TASKS.md` Task 2) to these files.

### John / Matthew prophecy material — DECISION NEEDED

Genesis has CHAPTER-3-PROPHECY, CHAPTER-9-PROPHECY, CHAPTER-12-PROPHECY in all locales. John 1–3 has prophetic statements (1:51, 2:19–22, 3:14) but no prophecy file. Matthew 1–3's fulfilment-formula material is currently housed in editorial-log entry M-001. Decide whether this content should also be exposed via PROPHECY files for Prophecy view-mode coverage.

---

## Summary

| Item | Status |
|------|--------|
| Genesis 13–50 content | STILL OPEN |
| Em-dash / accessibility sweep | PARTIAL (EN Matt + non-EN remain) |
| Cross-book canonical PEOPLE | STILL OPEN |
| **NEW:** v3.2 version stamp sweep | OPEN |
| **NEW:** ES John diacritics | OPEN |
| **NEW:** ES NT Reina-Valera declaration | OPEN |
| **NEW:** John PEOPLE.md | OPEN |
| **NEW:** PT-BR monogenēs | OPEN |
| **NEW:** Readability on John/Matt companions | OPEN |
| **NEW:** John/Matt prophecy file decision | OPEN |
