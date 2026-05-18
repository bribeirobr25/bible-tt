# Audit of `DE_FAMILIAR_NAMES_PLAN.md`

**Date:** 2026-05-18
**Auditor:** Claude Opus 4.7 (independent review, architecture + implementation focus)
**Scope:** `docs/audit/DE_FAMILIAR_NAMES_PLAN.md` — diagnostic + 3-phase mechanical sweep of 328 redundant-parens occurrences across DE chapter files in Matthew, John, and Genesis.
**Method:** Verified plan claims against actual files: `docs/rules/RULES-HB.md` (full read), `docs/rules/RULES-GS.md` (full read), `docs/architecture/STANDARDS.md` (full read), `scripts/content-lint.sh` (full read), `content/de/john/CHAPTER-1.md` (full read), `content/de/matthew/CHAPTER-1.md` (full read), `docs/feedback/FEEDBACK.md` item 35 (verified).
**Status:** Plan is strategically correct. Three critical execution blockers found — two will cause the Step 1/3 Python scripts to silently misclassify or miss the majority of occurrences. One significant governance issue around RULES-HB.md amendment. Several minor improvements. Q1 policy recommendation (Option C) is correct and well-argued.

---

## 1. Executive Summary

The plan correctly identifies the problem (328 redundant-parens occurrences in DE chapter files, DE-specific, RULES-HB.md §491 violation) and correctly argues for Option C (Class A → proper transliteration + familiar in parens; Class B → bare form, no parens). The cross-locale verification (PT-BR/ES/EN are clean) is confirmed. The internal inconsistency finding (DE John 1 overview cites `Yochanan (Johannes)` but body renders `Johannes (Johannes)`) is confirmed and verified.

However the plan's execution specification contains two critical gaps that would cause the Step 1 and Step 3 Python scripts to silently fail or misclassify most occurrences:

**Critical blocker 1:** Step 1 specifies reading only RULES-HB.md's proper-name table. But NT proper names (Yeshua/Jesus, Yochanan/Johannes, Kefa/Petrus, Yosef/Josef, Miryam/Maria, Eliyahu/Elia, Yeshayahu/Jesaja) live in **RULES-GS.md**'s proper-name table, not RULES-HB.md. Without reading RULES-GS.md, ~175 of the 328 total occurrences (the entire Matthew + John scope) will have no mapping and fall into the "unmapped" bucket rather than being classified.

**Critical blocker 2:** Step 3 specifies section-boundary detection using **English section header names** that do not exist in the DE files. DE files use German headers (`## KAPITELÜBERSICHT`, `## FORTLAUFENDE LESUNG`, `## VERS-FÜR-VERS-STUDIE`, `## GLOSSAR`, `## KAPITELÜBERGREIFENDE VERFOLGUNG`). A Python script matching against `## CHAPTER OVERVIEW`, `## CONTINUOUS READING`, `## VERSE-BY-VERSE STUDY` will match zero section boundaries in any DE file, breaking the first-occurrence-per-section logic entirely.

**Critical blocker 3:** RULES-HB.md is marked **LOCKED** and RULES-CORE.md v3.3 defines a formal Amendment & Lock Protocol with documented proposals required. The Q3 Option B recommendation ("Update RULES-HB.md §Name Rendering Policy") cannot be executed by a simple file edit — it requires the Amendment Protocol.

After these three blockers are resolved, the plan is sound and the strategy is correct.

---

## 2. Verification Table

| Plan claim | Verification result | Notes |
|---|---|---|
| DE-specific problem — PT-BR/ES Matthew have 0 occurrences | ✓ Verified | FEEDBACK.md item 35 confirms "PT-BR and ES Matthew CHAPTER-{1,2,3}: 0"; same confirmed in plan's §1.2 cross-locale table |
| DE John 1 overview: "Yochanan (Johannes), Yeshua (Jesus), Kefa (Petrus)" | ✓ Verified | `content/de/john/CHAPTER-1.md` LESEANLEITUNG line: "Eigennamen folgen der TT-Transliteration: Yochanan (Johannes), Yeshua (Jesus), Kefa (Petrus), Philippos (Philippus), Nathanael, Andreas" ✓ |
| DE John 1 body: `Johannes (Johannes)` internal inconsistency | ✓ Verified | verse 6: `sein Name *war* Johannes (Johannes)` ✓; verse 17: `durch Mose (Mose)` ✓; verse 19: `Jerusalem (Jerusalem)` ✓; verse 21: `Elia (Elia)` ✓ |
| DE Matthew 1 overview claims "TT-Transliteration: Jesus, Josef (Josef), Maria (Maria)" | ✓ Verified — and **worse than described** | KAPITELÜBERSICHT line: "Eigennamen folgen der TT-Transliteration: Jesus, Josef (Josef), Maria (Maria), Abraham usw." — this overview incorrectly claims TT-transliteration while using German familiar forms. See §4.2. |
| DE Matthew 1 body: `Abraham (Abraham)`, `Isaak (Isaak)`, `Jakob (Jakob)` | ✓ Verified | verse 1: "Jesus (Jesus), des Gesalbten, Sohn Davids, Sohn Abrahams" → no parens on Abrahams; verse 2: "Abraham (Abraham) zeugte Isaak (Isaak), und Isaak zeugte Jakob (Jakob)" ✓ |
| RULES-HB.md §491 — no-parens rule when translit = familiar | ✓ Rule confirmed; ✗ **line number incorrect** | Rule text found at bottom of proper-name table notes section, not at line 491. Wording: "Names where the familiar form is identical to the transliterated form (e.g., Sarai, Lot, Nimrod, David) use the transliterated form throughout — no parenthetical needed." Line numbers are implementation details that shift with edits. |
| RULES-HB.md proper-name table covers all names needed for classification | ✗ **Wrong** — table is Genesis 1-12 only | Table covers HB Gen 1-12 names. NT names (Yeshua, Yochanan, Kefa, etc.) are in **RULES-GS.md** proper-name table. Many Genesis 13-50 patriarchal names in Matthew's genealogy (Isaak/Yitschaq, Ya'aqov/Jakob, Yehudah/Juda, Shelomoh/Salomo) are in **neither** table. See §3.1. |
| Step 3 section-boundary: `## CHAPTER OVERVIEW`, `## CONTINUOUS READING`, etc. | ✗ **Wrong** — English names don't exist in DE files | DE files use German section headers. See §3.2. |
| RULES-HB.md is amendable per Q3 Option B | ✗ **Wrong** — file is LOCKED | RULES-HB.md header: "LOCKED for current translation cycle (inherits CORE lock protocol)." Amendment requires formal Amendment & Lock Protocol. See §3.3. |
| Test baseline 817+2=819 expected after sweep | ✗ **Inconsistent** with content-only scope | Content-only sweep adds no parser code → no new tests. "+2" appears to be a stale reference. See §4.3. |
| content-lint §0.8 would catch any regression | ✗ **Partially wrong** | §0.8 applies only to `$NON_EN_PEOPLE_FILES` (PEOPLE.md files). It does not cover CHAPTER-N.md files. Redundant-parens regression in chapter files would not be caught. See §4.4. |
| FEEDBACK.md item 35 — narrow scope is "DE Matthew chapters only" | ✓ Confirmed | FEEDBACK.md §3 item 35 says "DE Matthew CHAPTER-{1,2,3}.md non-compliant" + "2–3h sweep across DE Matthew 1–3 + sister fix to PT-BR/ES if same pattern is present." Plan correctly widens this to all DE chapter files (Option B in Q2). |
| DE study/ companions are clean (0 occurrences) | Plausible but partially wrong | Plan's table says `content/de/john/study/*.md: 1 stray occurrence`. That stray occurrence must be addressed; it is not currently enumerated or given file:line in the plan. |
| Architecture: DDD boundary maintained | ✓ Verified | Plan is content-only. No changes to `src/`. DDD litmus: pass. |
| Architecture: No new dependencies | ✓ Verified | Content sweep + Python script. No `pnpm add`. |

---

## 3. Critical Execution Blockers

### 3.1 Step 1 diagnostic script reads only RULES-HB.md — missing RULES-GS.md and Genesis 13-50 names

**The plan (§5, Step 1):**
> "Script reads RULES-HB.md proper-name table → extracts mapping `{Translit, DE_Familiar}` for every row."

**What RULES-HB.md actually contains:**
The proper-name table is explicitly titled "PROPER-NAME TABLE — GENESIS 1-12" and covers only:
- Person names appearing in Genesis 1-12 (Adam, Chava, Qayin, Hevel, Shet, Noach, Avram, Sarai, Lot, etc.)
- A handful of NT-referenced OT figures appended at the bottom (Mosheh → DE: Mose; Eliyahu → DE: Elia)
- Place names mentioned in Genesis 1-12 chapters (Yerushalayim, Yarden, Mitsrayim/Ägypten, Beyt-El, Shekhem, Beyt-Lechem, Galil/Galiläa, Natseret/Nazareth)

**RULES-GS.md has a separate "PROPER-NAME TABLE — GREEK SCRIPTURES"** (verified at bottom of RULES-GS.md) covering all NT proper names:
- Ἰησοῦς → Yeshua, DE Familiar: **Jesus** (Class A: Yeshua ≠ Jesus)
- Ἰωάννης → Yochanan, DE Familiar: **Johannes** (Class A: Yochanan ≠ Johannes)
- Κηφᾶς → Kefa, DE Familiar: **Petrus** (Class A: Kefa ≠ Petrus)
- Ἰωσήφ → Yosef, DE Familiar: **Josef** (Class A: Yosef ≠ Josef)
- Μαριάμ → Miryam, DE Familiar: **Maria** (Class A: Miryam ≠ Maria)
- Ἠλίας → Eliyahu, DE Familiar: **Elia** (Class A: Eliyahu ≠ Elia — also in RULES-HB.md)
- Ἠσαΐας → Yeshayahu, DE Familiar: **Jesaja** (Class A: Yeshayahu ≠ Jesaja)

If Step 1 only reads RULES-HB.md, the entire Matthew + John scope (~175 of 328 occurrences) will not be mappable from the table — `Jesus (Jesus)`, `Johannes (Johannes)`, `Petrus (Petrus)`, `Josef (Josef)`, `Maria (Maria)` etc. will all fall into the "unmapped — pause and ask" bucket, breaking the entire automated classification.

**Additionally:** Many names in Matthew 1's genealogy are NOT in any proper-name table:
- יִצְחָק (*Yitschaq*) → DE familiar: Isaak — appears in Gen 17+, not Gen 1-12
- יַעֲקֹב (*Ya'aqov*) → DE familiar: Jakob — Gen 25+
- יְהוּדָה (*Yehudah*) → DE familiar: Juda — Gen 29+
- שְׁלֹמֹה (*Shelomoh*) → DE familiar: Salomo — Kings era
- רוּת (*Rut*) → DE familiar: Rut — Book of Ruth
- בֹּעַז (*Boaz*) → DE familiar: Bo'az — Book of Ruth

These patriarchal and historical names in Matthew 1:1-17's genealogy will produce many unmapped occurrences. The plan's Risk #5 ("RULES-HB.md proper-name table is incomplete for some NT names") understates the actual scope — it's not "some" NT names but ALL Matthew genealogy names from the post-Genesis patriarchal period.

**Required fix:** Step 1 specification must state:
1. Read BOTH RULES-HB.md AND RULES-GS.md proper-name tables
2. For unmapped names (those in neither table), classify manually using source-language analysis before Step 2 — the DE_FAMILIAR_NAMES_CLASSIFICATION.md output must flag these explicitly with a "REQUIRES MANUAL CLASSIFICATION" status rather than silently passing them through
3. Document the additional name-to-transliteration mappings for the unmapped patriarchs (Yitschaq, Ya'aqov, Yehudah, Shelomoh, etc.) — these can be derived from RULES-HB.md's transliteration conventions (Hebrew → ASCII transliteration) even if not explicitly listed in the table

### 3.2 Step 3 section-boundary detection uses English header names that do not exist in DE files

**The plan (§5, Step 3):**
> "Section-boundary detection: per CHAPTER-N.md the 'section' unit is `## CHAPTER OVERVIEW`, `## CONTINUOUS READING`, `## VERSE-BY-VERSE STUDY`, `## NOTES SUMMARY`, `## CROSS-REFERENCES`. First-occurrence resets at each `##` boundary."

**Verified against actual DE chapter files:**
The DE files (`content/de/john/CHAPTER-1.md`, `content/de/matthew/CHAPTER-1.md`) use **German section headers**:

| Plan says | Actual DE header |
|---|---|
| `## CHAPTER OVERVIEW` | `## KAPITELÜBERSICHT` |
| `## CONTINUOUS READING` | `## FORTLAUFENDE LESUNG` |
| `## VERSE-BY-VERSE STUDY` | `## VERS-FÜR-VERS-STUDIE` |
| `## NOTES SUMMARY` | *(does not exist in DE files)* |
| `## CROSS-REFERENCES` | `## KAPITELÜBERGREIFENDE VERFOLGUNG (Genesis → Johannes)` |
| *(not mentioned)* | `## LESEANLEITUNG` |
| *(not mentioned)* | `## GLOSSAR — JOHANNES 1` |
| *(not mentioned)* | `## INHALTSVERZEICHNIS` |

A Python script that searches for `## CHAPTER OVERVIEW` will find zero matches in any DE file. This means:
- No section boundaries will be detected
- All 328 occurrences will be treated as belonging to one giant "section"
- The first-occurrence-per-section logic will apply only the first occurrence across the entire file rather than the first per section
- All subsequent occurrences within a section (that should become bare familiar forms) will still be marked as "first occurrences" if the script's counter never resets

**Required fix:** Step 3 section-boundary detection must match all `## ` headers regardless of language. The correct Python pattern is:
```python
# Match any H2 header (section boundary in DE/EN/PT/ES)
section_boundary = re.compile(r'^## .+$', re.MULTILINE)
```
Reset the occurrence counter at every `^## ` match, not only at specific English names. Alternatively, enumerate the known DE section header patterns: `KAPITELÜBERSICHT`, `FORTLAUFENDE LESUNG`, `VERS-FÜR-VERS-STUDIE`, `GLOSSAR`, `KAPITELÜBERGREIFENDE`, `LESEANLEITUNG`, `INHALTSVERZEICHNIS`.

### 3.3 RULES-HB.md is LOCKED — Q3 Option B requires the formal Amendment & Lock Protocol

**The plan (§3, Q3 Option B — Recommended):**
> "Append to `RULES-HB.md:491` a short DE-locale clarification... the amendment is clarificational, not new policy."

**Verified against RULES-HB.md:**
Header: "**Status:** LOCKED for current translation cycle (inherits CORE lock protocol)"

**Verified against RULES-CORE.md v3.3 (per FEEDBACK.md and prior audits):**
RULES-CORE.md §1415 (added v3.3) includes the "Amendment & Lock Protocol" with a formal process:
- Written proposals required in `docs/rules/proposals/`
- Editorial-log entry documenting the decision and rationale
- Version bump notation in the CHANGELOG

Simply appending to RULES-HB.md as a file edit is not compliant with the Lock Protocol regardless of whether the amendment is "clarificational." The prior AUDIT_NEW_PLAN.md found this same issue (Phase 6.6 audit) — any amendment to a locked ruleset requires the protocol, even minor ones. The recommendation in the prior audit was the "Emergency path" (immediate lock protocol without the 14-day window, but still requiring written proposals).

**Required fix:** Q3 Option B must specify:
1. Author a written proposal in `docs/rules/proposals/DE-locale-name-rendering-clarification.md` documenting the Class A/B policy
2. Reference the proposal in the editorial-log entries
3. Apply the formal amendment notation to RULES-HB.md (adding a mini-section or footnote within the proper-name table notes, with a changelog entry)
4. OR: defer the rule amendment to a future rules cycle and treat the three editorial-log entries as the governing documentation for this sweep (i.e., execute Q3 Option A, with a note that a formal RULES-HB.md amendment should follow)

---

## 4. Significant Concerns

### 4.1 Unmapped patriarchal names in Matthew genealogy require sourcing decision before authoring

As noted in §3.1, many names in Matthew 1's genealogy lack entries in either proper-name table:

**Sample unmapped names (Matthew genealogy, RULES-HB.md/RULES-GS.md coverage gap):**

| Hebrew source | Standard transliteration | DE familiar | Classification | Source |
|---|---|---|---|---|
| יִצְחָק *Yitschaq* | Yitschaq | Isaak | Class A (Yitschaq ≠ Isaak) | *Derived from RULES-HB.md §Hebrew Transliterations conventions* |
| יַעֲקֹב *Ya'aqov* | Ya'aqov | Jakob | Class A (Ya'aqov ≠ Jakob) | *Derived* |
| יְהוּדָה *Yehudah* | Yehudah | Juda | Class A (Yehudah ≠ Juda) | *Derived* |
| שְׁלֹמֹה *Shelomoh* | Shelomoh | Salomo | Class A (Shelomoh ≠ Salomo) | *Derived* |
| תָּמָר *Tamar* | Tamar | Tamar | Class B (Tamar = Tamar) | *Derived* |
| רוּת *Rut* | Rut | Rut | Class B (Rut = Rut) | *Derived* |
| דָּוִד *David* | David | David | Class B (David = David) | *Derived from §491 note examples* |

The step 1 script will not surface these automatically — it needs both the mapping source AND the DE familiar form lookup. The DE_FAMILIAR_NAMES_CLASSIFICATION.md output must explicitly address every unmapped name before Step 2 begins.

**Recommended action:** Add a sub-step to Step 1: "For every unmapped name (not in RULES-HB.md or RULES-GS.md table), derive the transliteration using RULES-HB.md §Hebrew Transliterations conventions and log the derivation source in the classification doc. Flag for project-lead review before proceeding to Step 2."

### 4.2 DE Matthew CHAPTER-1 overview inconsistency is different from — and worse than — DE John's

The plan describes the inconsistency as: "DE John CHAPTER-1 overview correctly cites `Yochanan (Johannes)` but chapter body renders `Johannes (Johannes)`."

But DE Matthew CHAPTER-1 has a different inconsistency:

DE Matthew 1 LESEANLEITUNG / KAPITELÜBERSICHT states:
> "Eigennamen folgen der TT-Transliteration: **Jesus, Josef (Josef), Maria (Maria)**, Abraham usw."

This is wrong in two ways:
1. "Jesus" is the German familiar form, not a TT transliteration (which would be "Yeshua")
2. "Josef (Josef)" and "Maria (Maria)" are redundant-parens — exactly the pattern being fixed
3. The overview claims TT-transliteration is being used, which is false

After the sweep, both overviews need to be corrected to accurately describe the chosen Q1 policy. The plan mentions updating overview text within the sweep scope but doesn't explicitly address this DE Matthew overview inconsistency (which is different from the DE John inconsistency).

**Recommended action:** Add to Step 3 (or as a distinct sub-step): "Update the LESEANLEITUNG / KAPITELÜBERSICHT overview text in each swept file to accurately describe the Q1 policy decision. DE John 1 overview: replace the (currently-accurate-but-then-implemented-wrong) Yochanan/Yeshua citation with an accurate post-sweep description. DE Matthew 1 overview: remove the incorrect 'TT-Transliteration' claim since DE Matthew uses German familiar forms as default; describe the Q1=C policy correctly."

### 4.3 Test count expectation "+2" is unexplained and likely wrong

Step 4 (Verification) states: "`pnpm test` (817+2 = 819 expected)"

The rollback section also says: "817 → expected 819 after slug-collision item; should remain 819 after this sweep."

**This sweep is content-only — no parser code is being added or modified.** The existing test suite validates that content files parse correctly; adding correct content doesn't require new tests. The "+2" appears to be a stale reference to the `POSSIBLE_CONTENT_BUNDLE_PLAN.md` Iakobos slug-collision fix (which adds the James entry to matthew/PEOPLE.md) and may already have shipped.

**Required fix:** Step 4 should say: "Run `pnpm test`. Expected result: baseline count from immediately before execution (verify by running `pnpm test` before Step 1 and recording the count). This sweep adds zero new tests — no parser code changes. If the count differs from baseline, investigate before proceeding."

### 4.4 No content-lint rule prevents regression of the redundant-parens pattern in chapter files

Content-lint `§0.8` (heading collision: `## Translit (Translit)` pattern) applies only to `$NON_EN_PEOPLE_FILES` (PEOPLE.md files). It does not cover CHAPTER-N.md files. A future author who accidentally writes `Jesus (Jesus)` in a DE chapter will not be caught by any content-lint rule.

The plan's Step 5 / Q3 logging correctly logs the decision, but does not propose a new content-lint rule to prevent regression.

**Suggested improvement (not a blocker):** After the sweep, consider adding a new content-lint rule `§0.11` that checks DE chapter files for the redundant-parens pattern:

```bash
check_pattern "0.11" "DE chapter: redundant-parens pattern Name (Name) — see DE_FAMILIAR_NAMES_PLAN.md" \
  "(\w+) \(\1\)" \
  "content/de/genesis/CHAPTER-*.md content/de/john/CHAPTER-*.md content/de/matthew/CHAPTER-*.md"
```

This pattern catches `Johannes (Johannes)` but not `Yochanan (Johannes)` (since the two words differ). It prevents regression of the Class B (should-be-bare) pattern and the "wrong direction" pattern simultaneously. Flag as warn-only (`check_pattern_warn`) since some legitimate uses of `Name (Name)` may exist in etymological notes.

---

## 5. Minor Issues

### 5.1 The 1 stray occurrence in `content/de/john/study/` is not enumerated

The plan's §1.1 table notes: "`content/de/john/study/*.md`: 1 stray occurrence." This file/line is not identified, and the sweep steps don't explicitly address companion study files. Companion files (`CHAPTER-N-CONTEXT.md`) have a different section structure (H2 sections A–I with H3 entries); the section-boundary detection logic from Step 3 needs adaptation for these files.

**Required action:** Before execution, identify the specific file:line of the stray occurrence. Include it in the scope of Step 2 or 3 with a note that the section-boundary logic for study/ files uses H2 section markers (e.g., `## A. Hebrew Text Features...`) not the chapter-file markers.

### 5.2 RULES-HB.md line number citation is incorrect

The plan cites "RULES-HB.md:491" throughout (§0 TL;DR, §1.4, §3 Q1). After reading the full RULES-HB.md file, the rule text ("Names where the familiar form is identical to the transliterated form... use the transliterated form throughout — no parenthetical needed") appears in the **notes section below the proper-name table**, not at line 491. Line numbers shift with any file edit.

**Required fix:** Replace all "RULES-HB.md:491" citations with "RULES-HB.md §PROPER-NAME TABLE — GENESIS 1-12 (notes)". Same fix in the editorial-log entries.

### 5.3 Glossary sections in DE chapter files also contain bracketed forms

Both DE chapter files contain GLOSSAR sections where Greek terms are paired with their German renderings. These are structured as table rows (not prose), and some may contain redundant-parens forms. The plan restricts the sweep to "verse-text + overview prose" with "etymological notes... excluded by pattern."

The GLOSSAR sections are not prose — they're tables. The plan should explicitly state whether GLOSSAR sections are in or out of scope and why.

**Suggested:** Explicitly exclude GLOSSAR sections from the sweep (they are lookup tables, not running text; the redundant-parens pattern in glossary context is semantically different from the prose context that RULES-HB.md §491 addresses).

### 5.4 The KAPITELÜBERGREIFENDE VERFOLGUNG (cross-chapter tracking) sections also contain names

Both DE chapter files contain cross-chapter tracking tables that mention proper names (e.g., `Jesus (Jesus)` in a table row). These table cells are part of the chapter file and would be matched by the sweep script. Tables have their own first-occurrence semantics (a name in a table row might be the "first occurrence" in that table, even if it appeared earlier in prose). The plan should clarify whether table cells follow the same first-occurrence logic as prose.

### 5.5 Rollback: "git revert of the bundle commit" requires single-commit discipline

The plan's §7 says: "All changes are in tracked files; `git revert` of the bundle commit restores the prior state." This only works if all 18 files (or however many) are committed in a single atomic commit. Step 6 ("Single commit titled...") states this correctly but should be enforced as a prerequisite — the sweep script should not commit incrementally.

---

## 6. Architecture and Design Compliance

### 6.1 DDD boundary — Clean ✓

The plan modifies only `content/` markdown files. No changes to `src/domain/`, `src/infrastructure/`, `src/ui/`, or `src/app/`. DDD litmus test (STANDARDS.md §1): if `fs-content-repository.ts` were replaced with a DB adapter, this plan's changes require zero code-side changes. ✓

### 6.2 No new dependencies ✓

The Python script runs outside `pnpm` dependency management. No `pnpm add` calls. ✓

### 6.3 TypeScript — no impact ✓

No `.ts` or `.tsx` files are modified. `pnpm build` TypeScript compilation is unaffected by markdown content changes. ✓

### 6.4 STANDARDS.md §14 (test the parser) ✓

Content-only sweeps don't require new parser tests; the existing suite validates parse correctness for the affected content types. Correct. ✓

### 6.5 Content-lint regression risk — partial ✗

As noted in §4.4: the existing content-lint does not cover the redundant-parens pattern in CHAPTER-N.md files. §0.8 covers PEOPLE.md heading collision only. The sweep removes existing violations but no lint rule prevents their reintroduction. A `§0.11` warn-only rule (§4.4) would close this gap. This is an improvement, not a blocking compliance issue.

### 6.6 RULES-HB.md Lock Protocol — non-compliant as specified ✗

Q3 Option B as written requires an in-place edit to a LOCKED file without following the Amendment & Lock Protocol. See §3.3. Non-compliant with RULES-CORE.md v3.3 §1415.

---

## 7. What Works Well

- **Correct problem diagnosis.** The RULES-HB.md §491 violation analysis is accurate. The class A/B distinction is the right intellectual frame.
- **Cross-locale verification.** Confirming PT-BR/ES/EN are clean before recommending DE-only scope is correct methodology.
- **Internal inconsistency diagnosis (DE John).** Spotting that DE John 1 overview cites `Yochanan (Johannes)` correctly but body renders `Johannes (Johannes)` is precise and verified.
- **Option C recommendation for Q1.** Hybrid approach (Class A → proper transliteration + parens, Class B → bare form) is the only option that literally follows both RULES-HB.md §491 AND the implicit first-occurrence convention from RULES-CORE.md. Well-argued.
- **Option B recommendation for Q2.** Full DE sweep (not just Matthew) is the correct call — a half-fixed state would be worse than the current consistent-but-wrong state.
- **Classification document (DE_FAMILIAR_NAMES_CLASSIFICATION.md).** Requiring a human-reviewable intermediate output before irreversible file edits is good defensive design.
- **Rollback plan.** Single-commit atomic rollback with per-occurrence file:line is correct.
- **Risk table §6.** Risk #5 (RULES-HB.md table incomplete for NT names) correctly surfaces the gap, even though the plan understates its scope.
- **Editorial-log entries × 3.** Three book-specific entries is the correct policy for a cross-book change under Rule 28.
- **No code changes, no new tests (excluding the "+2" error).** Content-only sweep is the right scoping decision.

---

## 8. Required Conditions Before Execution

In priority order:

| # | Issue | Severity | Required Fix |
|---|---|---|---|
| 1 | Step 1 reads only RULES-HB.md; RULES-GS.md NT proper-name table needed | **Critical blocker** | Update Step 1 to read both RULES-HB.md and RULES-GS.md tables; add manual-classification step for unmapped patriarchal names |
| 2 | Step 3 uses English section headers that don't exist in DE files | **Critical blocker** | Change section-boundary detection to match any `^## ` header, not English-named headers |
| 3 | Q3 Option B edits a LOCKED file without Amendment Protocol | **Critical blocker** | Follow RULES-CORE.md §1415 Amendment & Lock Protocol: author `docs/rules/proposals/` document + editorial-log cross-reference; OR defer rule amendment and use editorial-log entries as governing documentation (Q3 = Option A with forward-tracking note) |
| 4 | Unmapped patriarchal names (Isaak/Yitschaq, Jakob/Ya'aqov, etc.) need explicit treatment | Significant | Add sub-step to Step 1: derive transliterations per RULES-HB.md conventions; flag for project-lead review in DE_FAMILIAR_NAMES_CLASSIFICATION.md |
| 5 | DE Matthew 1 overview requires a different correction from DE John 1 overview | Significant | Document the overview-correction approach per file explicitly in Steps 2/3 |
| 6 | Test count "+2" is unexplained and likely wrong | Significant | Replace with "record actual baseline before Step 1; expect no change after sweep" |
| 7 | 1 stray occurrence in john/study/ not enumerated | Minor | Identify file:line before execution; add to sweep scope with companion-file section-boundary note |
| 8 | RULES-HB.md line number citations (":491") are fragile | Minor | Replace with section-path citation |

---

## 9. Recommendation

**Approve after items 1–3 are resolved.** All three blockers require changes to the execution specification (Step 1 script spec, Step 3 script spec, Q3 logging approach) before any code runs. Items 4–6 are specification improvements that should be addressed before execution begins to avoid ambiguity during the sweep. Items 7–8 are minor.

After resolution, this is a well-conceived sweep: the policy decision is correct, the scope is right, the classification approach is the right abstraction, and the single-commit rollback provides a clean recovery path.

No architecture violations. DDD boundary is maintained. The Python script approach (running outside the Next.js build system) is appropriate for a content-transform task of this scope.

---

**Audit complete.** Claims verified against `RULES-HB.md`, `RULES-GS.md`, `STANDARDS.md`, `content-lint.sh`, `content/de/john/CHAPTER-1.md`, `content/de/matthew/CHAPTER-1.md`, and `FEEDBACK.md` item 35.
