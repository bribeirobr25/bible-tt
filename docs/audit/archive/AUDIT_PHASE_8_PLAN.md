# Audit of `PHASE_8_PLAN.md` (Section I Coverage Audit)

**Date:** 2026-05-14
**Auditor:** Claude Opus 4.7 (independent review)
**Scope:** `docs/audit/archive/PHASE_8_PLAN.md` — 72-file Section I audit across 18 chapters × 4 locales; canary + propagation execution model.
**Method:** Verified plan claims against: `docs/rules/RULES-CORE.md` (Rule 29 §I spec), `src/infrastructure/content/enrichment-parser.ts` (parser behavior with H3/H4 headings), `content/en/john/study/CHAPTER-2-CONTEXT.md` (John 2 Section I actual content and cross-reference pattern), `content/en/matthew/study/CHAPTER-1-CONTEXT.md` (Matthew 1 Section I actual content and cross-reference pattern), `docs/templates/contextual-companion-template.md` (template Section I structure), `docs/editorial-log/john.md` (log state and J-entry numbering).
**Status:** Plan is methodologically sound but has two significant gaps that will affect the diagnostic step before execution begins. One critical parser finding that the plan does not account for. Editorial-log numbering requires a minor correction.

---

## 1. Executive Summary

Phase 8 is the right phase to run at this point in the project — Section I is the last major content-completeness gap before Phase 9/12. The core methodology (generate diagnostic matrix → triage → project-lead decision → canary → propagate) is correct. The 3-option Q1 structure and Option B recommendation are well-reasoned.

But the plan has two significant specification issues that would affect execution from step 8.1:

**Significant finding #1:** Both John 2 and Matthew 1 already have explicit cross-reference notes at the top of their Section I pointing to John 1 as the canonical ten-category anchor. These are already implementing the plan's own "(iii) Implicit coverage / cross-reference" triage pattern. The plan's characterization of John 2 as having "substantial gaps (7 entries)" is therefore partially misleading — the missing entries are intentionally absent by design, deferred to John 1. Phase 8's diagnostic must account for this existing cross-reference convention before counting any chapter's entries as gaps.

**Significant finding #2:** The enrichment parser only processes H3-level headings (`### SCENARIO A`) as entry boundaries. The H4-level sub-entries (`#### IA-1. Economy`) used in John and Matthew companion files are NOT individually parsed — they're consumed as content lines of their parent H3 scenario entry. The plan's diagnostic methodology (counting H4 entries via grep) measures authoring-level granularity, which differs from what the parser produces. This doesn't break the UI (the content is rendered), but the plan should document this distinction explicitly.

**One critical spec error:** The plan cites "RULES-CORE §I sub-entries I1–I10 documented at lines 648–657 and 704–714." Line numbers are fragile — they shift with any RULES-CORE.md edit. The canonical reference is "Rule 29 §The World at the Time (Section I)".

Everything else verified correctly: diagnostic grep patterns are valid for their stated purpose, Option B canary recommendation is sound, the triage classification model (i/ii/iii) is the right abstraction, conventions in §8 are consistent with prior phases.

---

## 2. Verification Table

| Plan claim | Verification result | Notes |
|---|---|---|
| I1-I10 categories documented in RULES-CORE.md | ✓ Verified — wrong citation | Spec lives in Rule 29 §The World at the Time, not at "lines 648–657 and 704–714". See §3.1. |
| John/Matthew chapters use `#### IA-N.` H4 heading form | ✓ Verified | Both John 2 and Matthew 1 CONTEXT confirmed. |
| Genesis chapters use `**I-AN. ...` bold-inline form | Unverified | Plan's claim plausible but no Genesis CONTEXT file was read; the template shows a different minimal format. |
| John 2 Section I has 7 entries (4 + 3) | ✓ Verified | IA-1 through IA-4 + IB-1 through IB-3 = 7 entries counted in actual file. |
| Matthew 1 Section I has 6 entries (4 + 2) | ✓ Verified | IA-1 through IA-4 + IB-1 through IB-2 = 6 entries counted in actual file. |
| John 2 Section I has "substantial gaps" | ✗ **Partially wrong.** | John 2's Section I opens with an explicit cross-reference to John 1 as the full ten-category anchor. The shortfall is intentional by design. See §3.2. |
| Matthew 1 Section I has "substantial gaps" | ✗ **Partially wrong.** | Matthew 1's Section I similarly cross-references John 1. See §3.2. |
| Enrichment parser accepts H4 entries as individual enrichment entries | ✗ **Wrong.** | ENTRY_HEADER regex is `^### (.+)$` (H3 only). H4 entries (`#### IA-1.`) are not parsed as separate entries — they become content lines of the parent H3 scenario entry. See §3.3. |
| Diagnostic grep for H4 form: `^#### I[A-Z]?-?[0-9]+\.` | ✓ Valid for its purpose | The grep correctly counts authoring-level H4 entries, even though the parser collapses them. Purpose and limitation should both be documented. |
| Option B (canary + propagation) recommendation | ✓ Well-reasoned | Consistent with Phase 6B + Phase 7 methodology precedent. |
| John 2 recommended as canary chapter | ✗ **Needs reconsideration.** | John 2's Section I cross-references John 1 as the full anchor — it was designed to be partial. A better canary is a chapter that needs genuine standalone coverage. See §4.2. |
| Editorial-log numbering: J-022 (John) | ✓ Verified | john.md ends at J-021 (Phase 10 closure, 2026-05-14). J-022 is next. |
| Editorial-log numbering: "G-{NNN}" (Genesis) | ✗ **Wrong format.** | Genesis log uses date-based IDs (2026-MM-DD-NNN), not G-NNN format. See §5.3. |
| Test baseline 801/801 | ✓ Plausible | Phase 10 confirmed executed (J-021 in john.md). Phase 11.5 execution status not independently verified from logs read. |
| Section H source updates are in-scope for Phase 8 | ✓ Correct | Any new I-N entries citing new sources must add §H entries. Plan correctly includes this. |
| Content-lint §0.2 (em-dash) applies to STUDY_DIRS | ✓ Verified (prior phases) | `STUDY_DIRS` includes study/ directories. New Section I content must use `—` not ` -- `. |

---

## 3. Critical and Significant Findings

### 3.1 RULES-CORE line number citation is fragile [SHOULD FIX]

Plan §1, §13 cross-references:

> "RULES-CORE §I 'The World at the Time' — sub-entries I1–I10 documented at lines 648–657 and 704–714."

**Verified:** The I1-I10 sub-entry definitions live inside Rule 29 (§Companion file sections (A–I)), and the detailed "Companion File Research Checklist" repeats them. Both sections are in Rule 29, not at a standalone §I. Line numbers are an implementation detail that shifts with any edit to RULES-CORE.md — if a Rule is amended, a governance section added, or any text inserted, the cited lines no longer point to the spec.

**Required fix:** Replace "lines 648–657 and 704–714" with "Rule 29 §The World at the Time" in §1 and §13 cross-references. This is the stable reference that survives edits to the file.

### 3.2 John 2 and Matthew 1 Section I already implement type-(iii) cross-reference coverage — the "substantial gaps" framing is misleading [SIGNIFICANT]

The plan's §2 initial diagnostic states:

> "John 2, John 3: 7 entries each (4 + 3 across the two Pre-70/Post-70 scenarios — **substantial gaps**)"
> "Matthew 1: 6 entries (4 + 2 — **substantial gaps**)"

**Verified against actual files:**

John 2 CONTEXT Section I opens with:
> `> **Cross-reference:** For the full two-scenario, ten-category world context (Political, Economy, Daily Life, Social Structure, Education, Military, Arts, Science, Religion, Neighboring Peoples), see the John 1 companion (Section I). The entries below address the specific historical circumstances foregrounded in John 2.`

Matthew 1 CONTEXT Section I opens with:
> `> **Cross-reference:** For the full two-scenario, ten-category world context (Political, Economy, Daily Life, Social Structure, Education, Military, Arts, Science, Religion, Neighboring Peoples), see the John 1 companion (Section I, `en/john/study/CHAPTER-1-CONTEXT.md`). John and Matthew share the same general historical period; the John 1 section provides the foundation. The entries below address the specific circumstances foregrounded in Matthew 1.`

These are both implementing the plan's own "(iii) Implicit coverage / cross-reference" triage category. They are not gaps — they are intentional designs where John 1 serves as the canonical period-anchor, and each subsequent chapter adds only the entries specific to its own narrative circumstances.

This has two concrete consequences:

**Consequence 1:** The diagnostic matrix in step 8.1 must account for this cross-reference pattern before counting any entry as absent. A chapter with a John 1 cross-reference should have its entire "absent" category set classified as (iii) Implicit coverage, not (i) Genuine gap, for any category not directly related to that chapter's narrative content. This substantially changes the (i) vs. (iii) count.

**Consequence 2:** The plan's canary recommendation (John 2) is poorly chosen. John 2's Section I is explicitly designed to be partial-by-design via the John 1 cross-reference. Running the "backfill" canary on John 2 would mean either: (a) adding category entries that override the intentional cross-reference pattern — undermining the authoring convention already established, or (b) adding only chapter-specific categories (the ones not covered by John 1) — which is not a full canary test of the methodology.

**Required fix:** Add a pre-step 8.1 note:

> **Pre-diagnostic: existing cross-reference pattern.** John 2, John 3, Matthew 1, Matthew 2, and Matthew 3 Section I files already carry an explicit cross-reference to John 1 as the canonical ten-category anchor. For the diagnostic matrix, any entry absent in these chapters must first be checked against this cross-reference before being classified. If the missing category is substantively covered in John 1 Section I and the chapter's own narrative does not foreground it specifically, the correct triage is **(iii) Implicit coverage / cross-reference**, not **(i) Genuine gap**. Only categories directly illuminated by the chapter's own narrative events (e.g., John 2's economy entries relating to the stone vessel industry and temple commerce) merit standalone chapter-specific entries.

Also revise canary recommendation (see §4.2).

### 3.3 Enrichment parser processes H3 scenario entries, not H4 sub-entries — diagnostic counts are at authoring-level granularity, not parser-level [SIGNIFICANT]

The plan's diagnostic methodology (§4) counts I-N entries via grep:

```bash
grep -E "^#### I[A-Z]?-?[0-9]+\." content/en/john/study/...
```

**Verified against `enrichment-parser.ts`:**

The parser uses:
- `SECTION_HEADER = /^## ([A-Z])(?:_\w+)?\.\s+(.+)$/` — matches H2 section headers (e.g., `## I. The World at the Time`)
- `ENTRY_HEADER = /^### (.+)$/` — matches H3 entry headers ONLY (e.g., `### SCENARIO A — Pre-70 CE`)

H4 entries (`#### IA-1. Economy — ...`) do NOT match either regex. When the parser encounters a line starting with `####`, it falls through to the content-line branch and is appended to `currentEntry.contentLines`. This means:

**What the parser produces from John 2 Section I:**
- Section "I": title "The World at the Time"
  - Entry "SCENARIO A — Pre-70 CE (Temple still standing)": contains all IA-1 through IA-4 text concatenated as a single block of content
  - Entry "SCENARIO B — Post-70 CE (Temple destroyed)": contains all IB-1 through IB-3 text concatenated as a single block

**What the plan's diagnostic grep counts:** 7 individual H4 entries (IA-1 through IA-4 + IB-1 through IB-3)

These are two different granularities. The parser's data model has 2 entries in Section I for John 2; the grep sees 7. Both representations are valid for different purposes, but the plan blends them without distinguishing:

- For **content audit purposes** (is each I-category substantively covered?): the grep is the right tool — it counts authoring-level coverage.
- For **UI rendering purposes** (how does Section I appear in the Context view?): the parser's 2-entry representation is what matters — each scenario renders as a single expandable entry containing all sub-categories as flowing prose.

**Important: this is not a bug.** The H4-under-H3 structure works fine in the UI. The scenarios render correctly — the H4 sub-headings appear as bold formatted text within the expanded scenario entry. The content is fully visible to readers.

But the plan should clarify this distinction explicitly so the executor understands:

1. When the plan says "an I-N entry" it means an H4-level authoring unit, NOT a parser-level entry.
2. The stub-quality check (`✗`) should assess H4-level units (does this H4 entry have substantive content + confidence label + source?), not parser-level entries.
3. The "(iii) implicit coverage" cross-reference added inside a scenario will appear as content text within the parent scenario entry — not as a separate parseable entry.

**Required fix:** Add a §4.3 note:

> **Parser-level vs. authoring-level granularity.** The enrichment parser recognizes H2 headers as section boundaries and H3 headers as entry boundaries. The H4 headers (`#### IA-1. Economy`) used in John and Matthew Section I are NOT individually parsed as enrichment entries — they are rendered as bold inline text within the parent H3 scenario entry. This is by design: the scenario entries (Pre-70, Post-70) are the parser-level data units; the H4 categories are authoring-level subdivisions within each scenario. The diagnostic grep in §4.2 correctly counts H4 entries at authoring-level granularity. The coverage matrix tracks authoring-level coverage. The UI renders the H4 sub-headings as formatted text within their parent scenario. No structural change is needed — this note is for diagnostic-step clarity.

---

## 4. Significant Concerns

### 4.1 John 2 is a poor canary chapter — consider John 3 or Matthew 2 instead

Per §3.2: John 2's Section I is explicitly designed to be partial-by-design via the John 1 cross-reference. Step 8.4 (canary backfill) of Option B would encounter this design decision immediately and have to make a call about whether to add chapter-specific entries or annotate the existing cross-reference — neither of which tests the full backfill methodology.

A better canary is a chapter where:
- Section I has genuine coverage gaps (not cross-reference deferrals)
- The chapter's narrative content has enough period-context material to produce substantive new I-N entries
- The chapter is not Genesis 1 or John 1 (which are already complete)

**Suggested alternatives:**

- **Genesis 9** (Noah's covenant + post-flood world): likely has a different scenario structure from Genesis 1, and the I-categories (political landscape of the post-flood period, Mesopotamian parallels, Noachic covenant religious context) have rich sourcing. No John 1 cross-reference. A genuine standalone test of the methodology.
- **Genesis 12** (Avraham's call, Egypt sojourn): First patriarchal chapter; has Early Bronze Age political landscape (city-states, Egyptian hegemony), economy (pastoralism, Nile agriculture), social structure (patron-client, clan hierarchy). Rich backfill candidates. No cross-reference to other chapters.
- **Matthew 2** (Magi, flight to Egypt, massacre of the innocents): Already has a Section I cross-reference to John 1 but the chapter's specific events (Persian/Parthian Magi, Herod's late reign, Egyptian refuge) have enough standalone material to justify chapter-specific entries beyond the John 1 anchor.

**Suggested revision:** Re-evaluate canary chapter at step 8.3 (project-lead decision), not pre-determined in the plan. Add Q4 to step 8.3:

> **Q4 — Canary chapter selection.** Review the diagnostic matrix from steps 8.1/8.2 and select the canary chapter from among chapters classified as (i) Genuine gap — not from among chapters whose Section I is already implementing type-(iii) cross-reference coverage to John 1. The canary chapter should have the most standalone I-N backfill candidates.

### 4.2 Section I heading-form differences between Genesis and John/Matthew have parser implications

The plan documents heading-form heterogeneity (§2 and §6 Q2) — Genesis uses bold-inline `**I-A1. ...**` while John/Matthew use H4 `#### IA-1. ...`. The plan recommends leaving this as-is for Phase 8.

But there's a parser consequence the plan doesn't surface: the Genesis bold-inline form (`**I-A1. ...**`) is a field-line pattern, which means it also doesn't match the enrichment parser's ENTRY_HEADER regex (`^### (.+)$`). If Genesis chapters structure their Section I with only H2 (the section header `## I. The World at the Time`) and bold-inline sub-entries, the parser creates a Section I with zero entries — all the bold-inline content becomes orphaned lines that don't attach to any entry.

If Genesis chapters instead use H3 scenario headers like John/Matthew (`### SCENARIO A — ...`), then the bold-inline I-N labels become content within those scenario entries (same as the H4 pattern in John/Matthew).

If Genesis chapters use a third structure (H3 directly for each I-N entry, e.g., `### I-A1. Political landscape — ...`), then each I-N entry IS parsed individually as a parser-level entry.

**The plan should verify which H-level Genesis chapters use for their Section I entries before recommending heading-form standardization be deferred.**

Without reading a Genesis CONTEXT file, I can't resolve this — but the audit can flag it as a required verification before step 8.1. If Genesis chapters use H3 for I-N entries (making each one individually parseable), that's a genuine structural difference from John/Matthew's H4 convention, not just a visual heading-style difference.

**Required action:** Before beginning step 8.1, verify the H-level of Section I entries in at least one Genesis CONTEXT file. If Genesis uses H3 for individual I-N entries (parsed individually) while John/Matthew use H4 for I-N entries (collapsed into H3 scenario entries), note this in PHASE_8_DIAGNOSTIC.md as a cross-book structural inconsistency that future heading-form standardization would need to resolve.

### 4.3 Diagnostic grep patterns need explicit scope and limitations documented

The plan's §4.2 grep patterns:

```bash
# Genesis bold-inline form
grep -E "^\*\*I-[A-Z][0-9]+\." content/en/genesis/study/CHAPTER-N-CONTEXT.md
# John/Matthew H4 form
grep -E "^#### I[A-Z]?-?[0-9]+\." content/en/{john,matthew}/study/CHAPTER-N-CONTEXT.md
```

Two gaps:

**Gap 1:** The Genesis pattern `^\*\*I-[A-Z][0-9]+\.` requires a single digit after the letter (`I-A1`). If any Genesis file uses two-digit category numbers (`I-A10`), the pattern misses them. The I-categories only go to I10, so a two-digit case IS possible. Safer pattern: `^\*\*I-[A-Z][0-9]+\.`.

Wait — that's the same. The issue is `[0-9]+` allows multiple digits but the pattern above shows `[0-9]+` which IS correct for multi-digit. On re-reading, the pattern `^\*\*I-[A-Z][0-9]+\.` does match `**I-A10.` because `[0-9]+` is greedy. This one is fine.

**Gap 2:** The John/Matthew pattern `^#### I[A-Z]?-?[0-9]+\.` uses `I[A-Z]?-?[0-9]+` which is quite flexible (e.g., it would match `#### I2.` as well as `#### IA-1.` and `#### IA1.`). In the actual files, the format is `#### IA-1.` (letter + hyphen + digit). The pattern correctly matches this. The `[A-Z]?` and `-?` make scenario letter and hyphen optional, which is fine as a greedy heuristic. No issue here.

**Gap 3 (real):** Neither pattern detects `✗` (stub-quality) entries — the plan defines `✗` as "category present but stub-quality (single sentence, no source, no confidence label)". The grep only tells you whether an entry is present, not whether it meets quality threshold. The diagnostic step 8.1 explicitly says "subject to manual cross-check" for this, but the matrix schema (§4.1) lists `✗` as a cell value without explaining how the executor distinguishes it from `✓` during the grep pass.

**Suggested clarification:** Add to §4.2:

> The diagnostic command determines presence/absence only (`✓` vs. `–`). The `✗` (stub-quality) classification requires manual inspection: for each present entry, verify that it has (a) a confidence label `**[CLAIM TYPE — CONFIDENCE]**`, (b) at least one sourced claim (a Source: citation or a reference to a §H entry), and (c) more than one sentence of substantive content. The manual inspection is a second pass over the `✓` cells; budget an additional ~30 minutes beyond the grep automation.

---

## 5. Minor Issues

### 5.1 Genesis editorial-log ID format is date-based, not G-NNN

Plan §7 step 8.11: "Editorial-log entry G-{NNN} (Genesis), J-022 (John), or M-020 (Matthew)."

The Genesis editorial log uses the format `## Entry 2026-MM-DD-NNN` (date-anchored sequential number). Examples from the genesis log: `2026-05-09-098`, `2026-04-26-087`, etc. The plan's `G-{NNN}` shorthand is not the actual format.

**Required fix:** Change "G-{NNN}" to "2026-{MM-DD}-{NNN}" in §7 step 8.11 and anywhere else the Genesis entry ID is referenced.

### 5.2 Matthew editorial-log M-020 numbering is unverified

The plan says "M-020 (Matthew)". The last verified Matthew entry was M-018 (Phase 11 sister entry). The plan's M-019 would be Phase 11.5 (scholarlyNote field). M-020 depends on whether both M-018 (Phase 11) and M-019 (Phase 11.5) have been authored. The plan should add a note to step 8.3/8.11: "Verify M-number by checking the current last entry in `docs/editorial-log/matthew.md` before creating the Phase 8 entry."

### 5.3 The contextual companion template's Section I is minimal — doesn't reflect H4 sub-entry format

The template at `docs/templates/contextual-companion-template.md` shows Section I as:

```markdown
## I. The World at the Time

### [Topic]
**[HISTORICAL / ARCHAEOLOGICAL — confidence level]**
[Description...]
```

This uses the H3-per-entry format (one H3 per topic). But John/Matthew files use the Scenario → H4-sub-entry structure (`### SCENARIO A` → `#### IA-1.`). The template doesn't document the scenario-grouping convention.

This is not a Phase 8 blocker (the template is optional), but any new Genesis I-N entries authored during Phase 8 might follow the template's H3-per-entry format while John/Matthew use H4-under-H3. If the plan defers heading-form standardization (Q2 recommendation: leave as-is), the new Genesis entries would be in a third format: H3-per-I-N-entry (parsed individually by the parser), different from both Genesis's existing bold-inline format AND John/Matthew's H4-under-H3 format.

**Suggested:** When authoring Phase 8 backfill for Genesis chapters, decide upfront whether to follow the existing Genesis bold-inline convention OR the H3-per-entry convention from the template. Document the choice in the Phase 8 editorial-log entry. This avoids a fourth format emerging in the project.

### 5.4 Content-lint §0.2 (em-dash) note should be in DoD, not just conventions

The plan's §8 conventions mention em-dash convention (use `—`, not ` -- `). But the DoD §10 doesn't include "content-lint passes" as a per-step check — it lists `pnpm content:lint` only as a final DoD item, not after each step 8.4–8.8.

Since new I-N entries will be authored with historical content (including date ranges, cross-references, and compound phrases), ` -- ` is a plausible authoring mistake. Per prior phase audits (AUDIT_PHASE_11_PLAN R2.2, AUDIT_PHASE_10_PLAN §5.2), content-lint §0.2 applies to STUDY_DIRS and is a blocking lint error.

**Suggested:** Add to step 8.5 (canary verification): "`pnpm content:lint` passes with the new EN entries — pay specific attention to em-dash convention in any historical date ranges or compound phrases."

### 5.5 The "15-minute research" heuristic in §11 (Risk 1) is too coarse

Risk 1 mitigation: "if a category has substantive sourced content available within 15 min of focused research, classify as (i) Genuine gap."

The 15-minute threshold is reasonable as a heuristic but could produce wrong classifications for some categories:

- **I9 (Religion and worldview)** in Greek Scriptures context: this is one of the most heavily researched categories; 15 minutes finds ample material for almost any NT chapter. It would rarely be classified as (ii) Intentional absence, even for chapters where the text has no direct religious-worldview dimension.
- **I8 (Science, technology, and medicine)** in early Genesis narrative chapters: the category applies broadly but may have weak relevance to a genealogical or cosmological chapter. 15 minutes could find content that technically qualifies but adds little value.

The 15-minute rule should be supplemented by a relevance filter: content found within 15 minutes qualifies as (i) only if it substantively illuminates the world that the specific chapter's narrative inhabits (not just the general period). This matches the Rule 29 framing: "Include only when substantive sourced content exists [that relates to what the text was written in]."

**Suggested revision to Risk 1 mitigation:** "If a category has substantive, directly-period-relevant sourced content available within 15 minutes of focused research — content that illuminates the world this chapter's narrative inhabits, not merely the general era — classify as (i) Genuine gap."

---

## 6. What Works Well

- **Triage classification model (i/ii/iii)** is the right abstraction. The three categories cleanly separate the three types of work. Having all three produces actionable outputs: (i) → backfill, (ii) → editorial-absence note, (iii) → cross-reference note.
- **RULES-CORE.md permits deliberate omissions** — the plan correctly reads Rule 29 here. Phase 8 is not a strict 10-of-10 mandate.
- **Option B (canary + propagation) recommendation** is methodologically sound and consistent with Phase 6B/7/10/11 precedents.
- **Editorial-absence note format** (one block per chapter listing intentional absences) is a clean documentation approach that makes the triage decision auditable.
- **The "implicit coverage / cross-reference" triage category (iii)** is well-designed. It correctly identifies that not every category needs a fresh entry when another entry already covers the period-context.
- **Step 8.3 project-lead decision gate** is the right structural choice. The three Q1/Q2/Q3 questions are genuinely pre-execution decision points, not execution choices.
- **§8 translation conventions** are comprehensive and consistent with prior phases (Rule 13 confidence labels, Phase 7 glossing convention, §H source provenance, numeric-range em-dash).
- **Optional content-lint rule (§9)** is correctly deferred to post-canary — encoding per-chapter expected-coverage manifests before the diagnostic data is in hand would be premature.
- **Risk 4 (cross-locale drift)** mitigation (EN canary → locale mirrors, integrity sweep) is exactly the correct execution discipline from Phase 7/10 precedent.
- **J-022 editorial-log numbering** is verified correct (john.md ends at J-021).

---

## 7. Required Conditions Before Execution

In priority order:

1. **Fix RULES-CORE line number citation to "Rule 29 §The World at the Time" (§3.1).** Line numbers are fragile; the stable reference is the rule and section name.
2. **Add pre-diagnostic note acknowledging John 2/John 3/Matthew 1-3 cross-reference-to-John-1 convention (§3.2).** This changes the triage classification of many "absent" cells from (i) Genuine gap to (iii) Implicit coverage before step 8.1 even begins.
3. **Add §4.3 parser-level vs authoring-level granularity note (§3.3).** Document that H4 entries are authoring-level units, not parser-level entries. This prevents confusion during diagnostic and backfill execution.
4. **Reconsider John 2 as canary chapter — defer selection to step 8.3 after diagnostic data (§4.1).** Add Q4 to the project-lead decision gate: select the canary from among chapters classified as (i) Genuine gap after triage.
5. **Add Genesis Section I H-level verification before step 8.1 (§4.2).** Confirm whether Genesis chapters use H3 or bold-inline or some other level for I-N entries before running the diagnostic.
6. **Fix Genesis editorial-log ID format from "G-{NNN}" to "2026-{MM-DD}-{NNN}" (§5.1).**
7. **Add per-step content-lint check for em-dash to step 8.5 DoD (§5.4).**

---

## 8. Recommendation

**Approve after items 1–7 are addressed.** Items 1–5 are specification issues that affect step 8.1 diagnostic and step 8.3 decision gate — the two most important pre-execution steps. Items 6–7 are minor corrections.

This is a well-conceived content-audit phase. The triage model is the right abstraction, the Option B canary recommendation is sound, and the methodology is consistent with prior phases. The main risks are in the diagnostic step (§3.2 cross-reference pattern skewing gap counts, §3.3 parser vs authoring granularity) and the canary selection (§4.1). Both are addressable with specification additions before execution begins.

After fixes, Phase 8 execution risk is low. The effort estimate (~15–20 hours for canary only) is plausible. The canary + propagation model correctly bounds the commitment before the full 60–120 hour Maximal option is considered.

No Lock Protocol question applies — Phase 8 makes no rule changes, no code changes, no schema changes. Pure content authoring + editorial-log documentation.

---

**Audit complete.** Claims verified against `RULES-CORE.md`, `enrichment-parser.ts`, actual `CHAPTER-2-CONTEXT.md` (John) and `CHAPTER-1-CONTEXT.md` (Matthew) Section I content, `docs/templates/contextual-companion-template.md`, and `docs/editorial-log/john.md`.
