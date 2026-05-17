# Phase 8 — Section I (The World at the Time) 10-Category Coverage Audit

**Status:** DRAFT (audit round 1 absorbed; ready for execution after step 8.3 project-lead decision)
**Drafted by:** claude-opus-4-7, 2026-05-14
**Source:** `docs/audit/FIX_IMPLEMENTATION.md` Phase 8; `docs/audit/PENDING.md` "Section I 10-category coverage audit per chapter"; `docs/feedback/DEFERRED_TASKS.md` Task 3 (open since 2026-04 — last remaining content-completeness audit before Phase 9/12).
**Ruleset:** v3.3 (RULES-CORE §Rule 29 → "The World at the Time" section — sub-entries I1 Political through I10 Neighboring peoples).

---

## Audit revisions absorbed (2026-05-14, round 1)

Independent audit at `docs/audit/archive/AUDIT_PHASE_8_PLAN.md` flagged 2 significant + 1 critical-citation + 2 minor concerns. Verified each against the codebase/docs and absorbed the agreed corrections:

- **§3.1 (citation stability) — APPLIED.** Replaced "RULES-CORE.md lines 648–657 and 704–714" with stable "Rule 29 → §The World at the Time" references throughout.
- **§3.2 (existing John 1 cross-reference convention) — APPLIED.** Verified: John 2, John 3, Matt 1, Matt 2, Matt 3 Section I files all open with `> **Cross-reference:** ... see the John 1 companion (Section I)`. The shortfall in I-N entries for these 5 chapters is intentional design via type-(iii) cross-reference, NOT genuine gap. Added Pre-Diagnostic note (§4.0) requiring the diagnostic to honor this convention before counting absences.
- **§3.3 (parser-level vs. authoring-level granularity) — APPLIED.** Verified: `enrichment-parser.ts` line 11 `ENTRY_HEADER = /^### (.+)$/` matches H3 only. H4 sub-entries (`#### IA-1.`) and Genesis bold-inline sub-entries (`**I-A1.**`) are content-lines of their parent H3 scenario entry. Genesis and John/Matthew have identical parser-level structure (2–4 H3 scenarios per section); only the sub-entry visual form differs (bold-inline vs H4). Added §4.3 note clarifying that the diagnostic grep operates at authoring-level granularity.
- **§4.1 (John 2 is a poor canary) — APPLIED.** Defer canary chapter selection to step 8.3 after diagnostic data is in hand. Added Q4 to the project-lead decision gate.
- **§4.2 (Genesis H-level structural verification) — VERIFIED + CLOSED.** Spot-checked Gen 1 + Gen 9 Section I: H3 scenarios (`### Scenario A: ...`) with bold-inline `**I-A1.**` sub-entries — same parser-level structure as John/Matthew. No structural inconsistency exists; only visual form differs. Documented in §4.3.
- **§5.1 (Genesis editorial-log ID format) — APPLIED.** Replaced `G-{NNN}` with `2026-{MM-DD}-{NNN}` in step 8.11.
- **§5.2 (Matthew M-number verification) — APPLIED.** Added a verification step to 8.11 (check current last entry in `matthew.md` before creating Phase 8 entry — M-019 was added during Phase 10 audit cleanup, so Phase 8 entry would be M-020, but verification at execution time is the safe default).
- **§5.4 (per-step content-lint em-dash check) — APPLIED.** Added explicit `pnpm content:lint` invocation to step 8.5 (canary verification), specifically for em-dash + en-dash compliance.
- **§5.5 (15-min research heuristic refinement) — APPLIED.** Refined Risk 1 mitigation to require directly-period-relevant content (not just general-era content) for (i) Genuine gap classification.
- **§5.3 (template Section I format) — NOTED, NOT ACTIONABLE.** The audit observes the template uses H3-per-entry while the actual chapters use H3-scenario → sub-entry. This won't matter for Phase 8 because the plan now explicitly mandates matching the existing per-chapter authoring convention (Genesis bold-inline, John/Matthew H4) — no new format will be introduced.

Approval condition from audit §8: items 1–7 addressed. All applied above.

---

## 1. Goal (one sentence)

For each of the 18 authored chapters (Genesis 1–12 + John 1–3 + Matthew 1–3) across 4 locales (EN / PT-BR / DE / ES), audit Section I scenario-by-scenario coverage against the 10 RULES-CORE Rule 29 §The World at the Time categories (I1 Political — I10 Neighboring peoples) and either backfill missing-but-applicable categories or document the intentional absence in editorial logs — while honoring the existing John 1–anchor cross-reference convention for John 2/3 + Matthew 1/2/3 (see §3.2 / §4.0).

---

## 2. Why a plan (not just an audit + edits)

Phase 8 differs from Phase 7 (readability sweep — surface-text edits within existing entries) and Phase 10 (PEOPLE.md authoring — single-file-per-locale creation) in three structurally significant ways that need pre-decision:

1. **Heading convention is inconsistent across books.** Genesis chapters use `**I-A1. Political landscape**` bold-inline labels (Phase 0 authoring heritage); John + Matthew chapters use `#### IA-1. Political — ...` H4 headings (Phase 6.6G / Phase 7 authoring). Both forms render; both are parser-compatible (Section I is prose, not parsed-fielded). The audit can either (a) leave heading-form heterogeneity in place and only audit coverage, or (b) standardize on one form during the same pass. The plan defaults to (a) — coverage-only — to avoid scope creep and a 18×4=72-file mechanical rewrite that adds no semantic value.

2. **The rules permit deliberate omissions.** RULES-CORE.md line 659 reads: *"Not every sub-entry applies to every chapter. Include only when substantive sourced content exists."* This means Phase 8 is not a strict 10-of-10 audit — it is a **triage audit**: separate (i) genuine gaps (category applies but is missing); (ii) intentional absences (category does not substantively apply to this chapter and so was deliberately omitted); (iii) implicit coverage (category is covered in another scenario or another section and a cross-reference is sufficient). Only (i) generates backfill work; (ii) and (iii) generate editorial-log documentation.

3. **Initial diagnostic shows pre-existing variance (count of I-N entries actually present, EN, 2026-05-14):**
   - **Genesis 1:** 40 entries (4 scenarios × 10 categories — *complete*)
   - **Genesis 2–12 (11 chapters):** 11–14 entries each — coverage varies; many chapters likely use the implicit-coverage strategy ("political landscape carried over from Gen 1" etc.)
   - **John 1:** 20 entries (2 scenarios × 10 — *complete; this is the **canonical NT period anchor***)
   - **John 2, John 3:** 7 entries each (4 + 3) — **intentional partial coverage via explicit cross-reference to John 1 (verified, see §3.2 / §4.0)**
   - **Matthew 1:** 6 entries (4 + 2) — same intentional cross-reference design
   - **Matthew 2, Matthew 3:** 7 entries each (4 + 3) — same intentional cross-reference design

   Per the audit-verified cross-reference convention (§3.2), the 5 NT chapters other than John 1 each open Section I with: `> **Cross-reference:** For the full two-scenario, ten-category world context ..., see the John 1 companion (Section I). The entries below address the specific historical circumstances foregrounded in [this chapter].` Therefore the apparent shortfall in those 5 chapters is by design — absences default to triage category (iii) Implicit coverage, NOT (i) Genuine gap, unless the chapter's specific narrative demands a category-specific entry. The diagnostic in step 8.1 must honor this convention before classifying any NT cell as a gap (see §4.0 Pre-Diagnostic Note).

   In raw arithmetic without the cross-reference convention: 16 of 18 chapters have fewer than the maximum (scenarios × 10) I-N entries. After honoring the convention: only chapters with substantive uncovered narrative-specific content qualify as having Genuine gaps; the rest are intentional-absence or implicit-coverage by existing design.

A plan is needed because the **triage classification + scope decision is a project-lead call** (step 8.3 below), not a default — and the downstream effort (steps 8.4–8.10) is bounded by that decision.

---

## 3. Audit scope

### In-scope (18 chapters × 4 locales = 72 files)
- `content/{en,pt-br,de,es}/genesis/study/CHAPTER-{1..12}-CONTEXT.md`
- `content/{en,pt-br,de,es}/john/study/CHAPTER-{1..3}-CONTEXT.md`
- `content/{en,pt-br,de,es}/matthew/study/CHAPTER-{1..3}-CONTEXT.md`

### Out of scope (deliberately deferred)
- **Section I in `*-INTRODUCTION.md`:** book-level introductions cover broader period context in §D (Calendar) and §F (Reading-in-TT); no Section I at introduction level by design.
- **Section I in `*-PROPHECY.md`:** prophecy companion files (Phase 11 deliverable) intentionally do not carry Section I (their focus is fulfillment tracking, not period context).
- **Heading-form standardization** (Genesis bold-inline → H4, or H4 → bold-inline). Coverage is the audit subject; heading-form heterogeneity is documented but not changed.
- **Scenario count standardization** (Genesis chapters have 4 scenarios; John/Matthew have 2). The scenario-count choices reflect compositional-dating debates documented in editorial logs; Phase 8 does not reopen them.
- **Sources Consulted (§H) updates downstream of new I entries.** New §I entries that cite new sources will require §H additions in step 8.4–8.8; this is in-scope as part of each backfill, not a separate sweep.

---

## 4. Diagnostic methodology (step 8.1)

### 4.0 Pre-Diagnostic Note — Existing cross-reference convention (audit §3.2)

Five of the six NT chapters in scope (John 2, John 3, Matthew 1, Matthew 2, Matthew 3) already open Section I with an explicit cross-reference quote-block pointing readers to the John 1 Section I as the canonical two-scenario × ten-category period anchor. This is the existing authoring convention and is **NOT a defect** — it is the project's already-established type-(iii) Implicit coverage pattern from Phase 6.6G / Phase 7 authoring.

**Diagnostic implication:** For these 5 chapters, the default classification for any I-category absent from the chapter's own Section I is **(iii) Implicit coverage / cross-reference** (already implemented), NOT **(i) Genuine gap**. A category in one of these 5 chapters is reclassified to (i) ONLY IF the chapter's own narrative foregrounds that category in a way the John 1 anchor cannot cover (e.g., John 2's stone-vessel and temple-commerce industry — a chapter-specific economic detail beyond John 1's generic Galilean-economy entry).

Step 8.1 must produce the matrix with this default applied. Cells that appear "absent" in the matrix without further annotation become candidates for (i) ONLY if step 8.2 manual triage confirms the chapter's narrative warrants the standalone entry.

### 4.1 Per-chapter coverage matrix

For each in-scope chapter, generate a **coverage matrix** of the form:

| Chapter | Scenario | I1 | I2 | I3 | I4 | I5 | I6 | I7 | I8 | I9 | I10 |
|---------|----------|----|----|----|----|----|----|----|----|----|-----|
| gen/1 | A | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| gen/1 | B | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

Cell values:
- `✓` — category present with substantive content + Rule 13 confidence label + sourcing
- `–` — category absent (further triage required in step 8.2)
- `✗` — category present but **stub-quality** (single sentence, no source, no confidence label) — counts as a gap for backfill purposes

### 4.2 Diagnostic command (EN baseline)

The matrix is generated from EN files only in step 8.1 (other 3 locales mirror the EN coverage decisions in steps 8.6–8.8; locale-specific Section I rewrites are out of scope because Section I content is identical across locales modulo translation).

Heuristic detection — presence/absence of I-N sub-entries (subject to manual cross-check):

```bash
# Genesis bold-inline form (greedy [0-9]+ matches multi-digit I-A10 correctly)
grep -E "^\*\*I-[A-Z][0-9]+\." content/en/genesis/study/CHAPTER-N-CONTEXT.md
# John/Matthew H4 form
grep -E "^#### I[A-Z]?-?[0-9]+\." content/en/{john,matthew}/study/CHAPTER-N-CONTEXT.md
```

For each match, extract `{Scenario letter, Category number}` and populate the matrix. Manual verification is needed for borderline cases (e.g., an entry titled "I-A5. Education AND literacy AND communication" that arguably also covers I7 in passing — counted as I5 only).

**Important — what the grep detects vs. what `✗` requires (audit §4.3 Gap 3):** The grep determines presence/absence only (`✓` vs `–`). The `✗` (stub-quality) classification requires a manual second pass: for each `✓` cell, verify that the entry has (a) a confidence label `**[CLAIM TYPE — CONFIDENCE]**`, (b) at least one sourced claim (a `Source:` citation or a reference to a §H entry), and (c) more than one sentence of substantive content. Budget ~30 minutes of manual inspection beyond the grep pass.

### 4.3 Parser-level vs. authoring-level granularity (audit §3.3)

The enrichment parser at `src/infrastructure/content/enrichment-parser.ts` line 11 declares `ENTRY_HEADER = /^### (.+)$/` — H3 only. Both heading conventions in use route through this:

- **Genesis convention:** `### Scenario A: ...` H3 → bold-inline `**I-A1. Political landscape**` sub-entries are content-lines of the parent scenario entry.
- **John/Matthew convention:** `### SCENARIO A — Pre-70 CE` H3 → H4 `#### IA-1. Economy` sub-entries are content-lines of the parent scenario entry.

Both produce the **same parser-level data structure**: 2–4 H3 scenario entries per Section I, with the I-N sub-entries collapsed into the scenario entry's content. Only the **visual sub-entry form** differs (bold-inline vs. H4). The UI renders both correctly — H4 sub-headings appear as bold formatted text inside the expanded scenario entry; bold-inline labels render as bold inline labels.

**Diagnostic-step clarity:**
1. When this plan refers to "an I-N entry," it means an **authoring-level sub-entry** (bold-inline label in Genesis; H4 heading in John/Matthew), NOT a parser-level entry.
2. The grep counts authoring-level sub-entries. The parser data model has 2–4 entries per Section I. Both are valid for their respective purposes.
3. A new "(iii) implicit coverage" cross-reference added inside a scenario block will appear as content text within the parent scenario entry — not as a separate parseable entry.

**No structural inconsistency exists between Genesis and John/Matthew at the parser level.** Heading-form heterogeneity is a visual-only difference. Q2 (heading-form standardization) remains a future cleanup option but does NOT affect Phase 8 coverage audit work.

### 4.4 Diagnostic artifact

Output: `docs/audit/archive/PHASE_8_DIAGNOSTIC.md` containing:
- The full coverage matrix (18 chapters × N scenarios × 10 categories)
- A flat list of all `–` (absent) and `✗` (stub-quality) cells with brief annotation: candidate for backfill / candidate for intentional-absence documentation / candidate for implicit-coverage cross-reference
- **Annotation for the 5 NT chapters with John 1 cross-reference (§4.0):** absences flagged as default-(iii) Implicit coverage pending step 8.2 narrative-specific reclassification

This is the input artifact for the project-lead triage decision in step 8.3.

---

## 5. Triage classification (step 8.2)

For each `–` or `✗` cell, classify as one of:

- **(i) Genuine gap.** Category substantively applies to this chapter and the absence is a coverage failure. Example: John 3 (Pre-70 scenario) lacks I6 Military despite the Roman garrison context being directly relevant to Nikodemos's risk-calculation in approaching Yeshua at night. **Action:** backfill in step 8.4–8.8.

- **(ii) Intentional absence.** Category does not substantively apply to this chapter, and inclusion would be padding. Example: Genesis 5 (genealogy from Adam to Noach) — I7 Arts/Literature in scenario D (Hellenistic redaction) might be intentionally absent because the chapter content is structurally genealogical and the Hellenistic-redaction lens is documented as predominantly relevant to vocabulary choices rather than artistic context. **Action:** document the absence as an `## Editorial absence note` block at the end of Section I (one block per chapter, list of `(scenario, category)` tuples with one-line rationale), and add a one-line entry to the relevant editorial log (`genesis.md` / `john.md` / `matthew.md`) referencing the Phase 8 audit.

- **(iii) Implicit coverage / cross-reference.** Category is covered substantively in another scenario in the same chapter, or in another section of the companion (Section C, F, etc.), or in another chapter's companion. **Action:** add a one-line cross-reference within Section I scenario block of the form `*I7 cross-reference: see Scenario A I7 (period context unchanged for B); see §F2 for reception-history dimension.*` — no full entry duplication.

The triage labels (i/ii/iii) become the action key for steps 8.4–8.8 execution sequencing.

---

## 6. Project-lead decision point (step 8.3)

After steps 8.1 + 8.2 produce the diagnostic matrix and triage labels (with §4.0 cross-reference convention applied), **pause for project-lead decision** on four questions:

### Q1 — Backfill scope
Three options for which "(i) Genuine gap" cells to close in this phase:

- **Option A (Maximal).** Close every (i) cell across all 18 chapters in this phase. Estimate depends heavily on how many cells survive §4.0 reclassification — likely 30–60 hours after the cross-reference convention is applied (down from the pre-audit 60–120h estimate, because 5 of 6 NT chapters' "shortfall" now defaults to (iii) Implicit coverage rather than (i) Genuine gap).
- **Option B (Canary + propagation).** Close all (i) cells for ONE canary chapter (selection deferred to Q4 — must be a chapter with genuine standalone backfill candidates, not one whose Section I is already implementing the John 1 cross-reference). Then defer the remaining chapters to a propagation phase (Phase 8.5+ or batched into Phase 12). Estimate: 8–15 hours for canary; remainder deferred.
- **Option C (Scenario-priority).** Close only the (i) cells in **Scenario A** (the primary scenario per chapter) for chapters that have (i)-classified cells after §4.0 reclassification. Estimate: 15–25 hours.

Recommendation: **Option B** (canary + propagation). Rationale: matches Phase 6B (Tier 2 note bloat pilot on Genesis 9 alone) + Phase 7 (readability canary then propagation) precedent. Validates the backfill methodology + locale-mirror workflow at small scale.

### Q2 — Heading-form heterogeneity
Three options:

- Leave as-is (default — Genesis bold-inline sub-entries, John/Matthew H4 sub-entries; both nest under H3 scenarios identically at the parser level per §4.3).
- Standardize on H4 (`#### IA-1. ...`) — modify 12 Genesis chapter files × 4 locales.
- Standardize on bold-inline (`**I-A1. ...**`) — modify 6 John/Matthew chapter files × 4 locales.

Recommendation: **Leave as-is**. Rationale: both forms produce identical parser-level data structures (§4.3); the heterogeneity reflects authoring-era differences (Phase 0 Genesis vs. Phase 6.6G/7 John+Matthew); standardization is a 72-file mechanical rewrite that adds zero semantic value and creates a large diff that obscures the actual coverage changes.

### Q3 — Per-chapter scenario-count audit
Whether to re-validate scenario choices (4 for Genesis, 2 for John/Matthew) at the same time. Recommendation: **No** — these reflect compositional-dating decisions already documented in `docs/editorial-log/genesis.md` and `docs/editorial-log/john.md`/`matthew.md`; re-opening them is out of Phase 8 scope.

### Q4 — Canary chapter selection (NEW per audit §4.1)

If Q1 = Option B, select the canary chapter from the post-triage diagnostic matrix. **Required selection criterion:** the canary must have substantive (i) Genuine gap cells AFTER §4.0 reclassification — NOT one of the 5 NT chapters whose Section I is already implementing type-(iii) cross-reference coverage to John 1, unless step 8.2 surfaces narrative-specific (i) cells in that chapter.

**Suggested canary candidates** (subject to diagnostic confirmation):

- **Genesis 9 (Noah's covenant + post-flood world):** has its own scenario structure; no John 1 cross-reference; the I-categories (post-flood political landscape, Mesopotamian flood parallels in I9, Noachic covenant religious context) have rich sourcing. Also: Phase 6B already piloted Tier 2 note relocation here, so the file has recent editor familiarity.
- **Genesis 12 (Avraham's call):** First patriarchal chapter; Early Bronze Age period anchor (city-states, Egyptian hegemony, pastoralism); rich backfill candidates; no cross-reference to other chapters.
- **Matthew 2 (Magi, flight to Egypt, massacre of innocents):** Has the John 1 cross-reference BUT the chapter's specific events (Persian/Parthian Magi context, Herod's late reign, Egyptian refuge corridor) may have enough standalone narrative-specific material to justify chapter-specific entries beyond the John 1 anchor. Project-lead may decide whether the marginal narrative-specificity outweighs the cross-reference simplicity.

Recommendation: **Genesis 9 or Genesis 12** — both are unambiguous (i)-classifiable candidates with no cross-reference convention to navigate, providing a cleaner canary methodology test. Final pick at step 8.3 after the diagnostic.

---

## 7. Execution sequence (post-decision)

Sequencing assumes **Option B (Canary + propagation)** is selected at step 8.3. If Option A or C is selected, steps 8.4 → 8.8 fan out across more chapters.

| Step | Action | Owner | Est. (h) |
|------|--------|-------|---------|
| **8.1** | Generate diagnostic coverage matrix (EN) → `docs/audit/archive/PHASE_8_DIAGNOSTIC.md`. | Claude | 1.5 |
| **8.2** | Triage classify each `–` / `✗` cell as (i) / (ii) / (iii). | Claude → human review | 2 |
| **8.3** | **Project-lead decision** on Q1 + Q2 + Q3. | Project lead | (gated) |
| **8.4** | Canary chapter (per Option B) EN backfill: research + drafting for all (i) cells; cross-reference notes for (iii) cells; editorial-absence notes for (ii) cells; §H source additions. | Claude | 6–10 |
| **8.5** | Canary chapter EN verification: visual smoke (HTTP 200; new I-N entries render); **`pnpm content:lint` passes — pay specific attention to §0.2 em-dash convention in any historical date ranges or compound phrases (per audit §5.4)**; tests pass; build compiles. | Claude | 0.5 |
| **8.6** | PT-BR mirror of canary chapter Section I backfills. | Claude | 1.5 |
| **8.7** | DE mirror. | Claude | 1.5 |
| **8.8** | ES mirror. | Claude | 1.5 |
| **8.9** | Cross-locale integrity sweep (Phase 7 style): entry-count parity across 4 locales; cross-reference target parity; §H source-list parity. | Claude | 0.75 |
| **8.10** | Visual smoke + integration audit across 4 locales. | Claude | 0.75 |
| **8.11** | Editorial-log entry — depending on canary chapter book: **Genesis → `2026-{MM-DD}-{NNN}`** (date-anchored sequential per the format in `docs/editorial-log/genesis.md`; **NOT** a `G-` shorthand — audit §5.1 fix); **John → next J-NNN** (J-022 per current state; verify at execution time per audit §5.2); **Matthew → next M-NNN** (M-020 per current state after Phase 10 audit cleanup added M-019; verify at execution time). Meta-doc sync (`CLAUDE.md`, `PENDING.md`, `FIX_IMPLEMENTATION.md` Phase 8 closure note); content-lint rule for Section I coverage (optional — see §9). | Claude | 1.5 |

**Total (Option B): ~15–20 hours** (canary only; remaining 17 chapters deferred).

For comparison: Option A Maximal across all 18 chapters would multiply steps 8.4–8.10 by ~15–17×, yielding 60–120 hours.

---

## 8. Translation + content conventions to pin (research findings carry forward)

The same conventions established in Phase 7 readability sweep + Phase 10 PEOPLE.md authoring apply:

- **Rule 13 confidence labels** on every new entry: `[HISTORICAL / ARCHAEOLOGICAL — VERIFIED|PROBABLE|POSSIBLE|UNCERTAIN]`, `[LATER RECEPTION — DOCUMENTED]`, etc.
- **Glossing technical terms on first use per file** (Phase 7 grandmother test). E.g., *prefect*, *Sanhedrin*, *cohort*, *tetrarchy*, *mikveh*, *bet midrash* — each glossed parenthetically on first use within the chapter companion.
- **Section H source provenance** — every new source cited in §I must be added to §H with provenance label (PRIMARY / PEER-REVIEWED / ACADEMIC POPULAR / POPULAR). New §H sources require the same per-locale rendering: same source list, same provenance labels, same ordering.
- **Em-dash convention** — Phase 6.6A en-dash rules for numeric ranges (`6–10 hours`, `Pre-70 CE`); em-dashes for prose breaks (` — `, not ` -- `).
- **Per-locale name transliteration** — Phase 6.6G + Phase 10 locked tables apply (Yochanan, Yeshua, Pesach, Yarden, etc.).
- **No new theological claims** per Rule 3 (anti-traditional reflex is also dishonest — present Roman, Hellenistic, Mesopotamian context neutrally without conscripting it to support or undermine the text's claims).

---

## 9. Optional content-lint rule (decide at step 8.11)

Adding a content-lint rule for Section I coverage is **possible but tricky**:

- **§0.11 candidate:** for each in-scope chapter, fail if Section I exists but a known-applicable category is missing per a per-chapter allow-list.
- **Problem:** the "applicable-or-not" decision is the triage call from step 8.2 — encoding it in a lint script requires a per-chapter expected-coverage manifest, which is itself a maintenance burden.
- **Alternative:** lint only for the **presence of Section I** (already implicit via the parser's permissive A–Z section accepting), and lint for **at least one I-N entry** per scenario. This is a structural check, not a content check.

**Recommendation:** defer the lint rule decision to step 8.11, when the canary chapter data informs whether a structural check would add value or just noise.

---

## 10. Definition of Done

- [ ] **8.1 diagnostic matrix landed** at `docs/audit/archive/PHASE_8_DIAGNOSTIC.md`.
- [ ] **8.2 triage classification complete** for every `–` / `✗` cell in the matrix.
- [ ] **8.3 project-lead decision** on Q1 + Q2 + Q3 captured in this plan as an "Audit revisions absorbed" block at top.
- [ ] **8.4–8.8** Canary-chapter (or Maximal-scope) Section I backfill landed in all 4 locales with: Rule 13 confidence labels on every new entry; §H source additions; em-dash + transliteration conventions applied.
- [ ] **8.9** Cross-locale parity: same entry count per chapter × locale; same scenario coverage; same §H source list.
- [ ] **8.10** Visual smoke: 4 locales × canary chapter pages render HTTP 200; new I-N entries visible; no broken cross-references.
- [ ] **8.11** Editorial-log entry created; meta-docs synced (CLAUDE.md verified-state date + Phase 8 closure; PENDING.md Section I item → RESOLVED or PARTIAL depending on Option A/B/C choice; FIX_IMPLEMENTATION.md Phase 8 closure note); content-lint rule decision recorded.
- [ ] `pnpm test` passes (801 tests; no new tests needed since parser unchanged).
- [ ] `pnpm content:lint` passes.
- [ ] `pnpm build` succeeds.

---

## 11. Risks + mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Triage classification balloons — many "is this (ii) intentional absence or (i) gap?" judgment calls | High | Medium (slows step 8.2) | Pre-define the rule (refined per audit §5.5): if a category has substantive **directly-period-relevant** sourced content available within 15 min of focused research — content that illuminates the world this chapter's narrative inhabits, not merely the general era — classify as (i) Genuine gap; otherwise (ii) Intentional absence with one-line rationale. The narrative-specificity filter matches Rule 29 §The World at the Time guidance ("include only when substantive sourced content exists" referring to chapter-relevant context). Examples: I9 Religion + I8 Science under a NT chapter pass the 15-min threshold easily for generic-era content but fail the narrative-specificity filter unless the chapter itself foregrounds a religious or scientific question. |
| Scenario A/B/C/D distinctions blur when backfilling — a category that holds across all scenarios gets duplicated unnecessarily | Medium | Medium | Use the (iii) Implicit-coverage / cross-reference pattern liberally — only fill in category-per-scenario when the period context genuinely differs (e.g., Pre-70 vs Post-70 Temple economy). |
| Source-quality drift — new entries cite POPULAR sources where PEER-REVIEWED is required by Rule 29 | Medium | High (Rule 29 violation) | Phase 7 §H precedent: every new I-N entry uses at least one PEER-REVIEWED or PRIMARY source; POPULAR sources allowed only for documenting *how* a tradition reads a passage (LATER RECEPTION — DOCUMENTED). |
| Cross-locale propagation drift — PT-BR/DE/ES backfills differ from EN beyond translation (added/dropped sentences, different sources cited) | Low | Medium | Phase 7 mirror-then-audit pattern: EN is canary; PT-BR/DE/ES mirror sentence-for-sentence with translation only; the cross-locale integrity sweep (step 8.9) flags any drift. |
| Heading-form heterogeneity confuses readers landing on consecutive chapters | Low | Low | Document the heterogeneity in the Phase 8 editorial-log entry as known/acknowledged; defer standardization to a future heading-form-sweep phase if reader feedback flags it. |
| Diagnostic matrix output (~180–280 cells across 18 chapters × 2–4 scenarios × 10 categories) is unwieldy to review | High | Low | The diagnostic artifact lives at `docs/audit/archive/PHASE_8_DIAGNOSTIC.md` as a structured table; only `–` and `✗` cells need attention at step 8.2 (the vast majority of cells will be `✓` or N/A by scenario). |

---

## 12. Out of scope (deliberately deferred)

- **Heading-form standardization** across the 18 chapters (Genesis bold-inline vs. John/Matthew H4). See §3.
- **Scenario-count audit** (4 Genesis scenarios vs. 2 John/Matthew). See §3.
- **Section I in INTRODUCTION + PROPHECY files** (Section I is chapter-companion-only by design). See §3.
- **Section A–H audit.** Phase 8 is Section-I-only. A future Phase 8.5 or Phase 14 may audit cross-section coverage if found needed.
- **Backfill for chapters whose Section I is structurally complete** (Gen 1, John 1 — already at scenarios × 10 maximum coverage in EN). These chapters appear in the diagnostic matrix as confirmation-only; no edits scheduled.
- **Re-translation of existing Section I content** (Phase 7 readability sweep already touched John + Matthew companions including their Section I prose; no further surface-text editing is in Phase 8 scope).

---

## 13. Status

- [x] Plan drafted (this document)
- [x] Independent audit absorbed — round 1 (`docs/audit/archive/AUDIT_PHASE_8_PLAN.md`; 2 significant + 1 critical-citation + 2 minor concerns verified + applied; see "Audit revisions absorbed" block at top)
- [ ] Independent audit absorbed — round 2 (optional; only if round-2 audit surfaces blocking issues like Phase 11 R2 did)
- [ ] Step 8.1 diagnostic landed
- [ ] Step 8.2 triage classification complete
- [ ] Step 8.3 project-lead decision captured (Q1 + Q2 + Q3 + **Q4 canary chapter**)
- [ ] Steps 8.4–8.11 executed per decision

---

**Cross-references:** `docs/audit/FIX_IMPLEMENTATION.md` Phase 8 (parent); `docs/audit/PENDING.md` "Section I 10-category coverage audit per chapter" (open); `docs/feedback/DEFERRED_TASKS.md` Task 3 (the open task this closes); `docs/rules/RULES-CORE.md` Rule 29 → §The World at the Time (the authoritative spec for I1–I10 sub-entries and the Companion File Research Checklist — stable reference, audit §3.1 fix); `docs/templates/contextual-companion-template.md` (Section I template — minimal; audit §5.3 notes the template does not document the H3-scenario → sub-entry convention used by actual chapters, but Phase 8 authoring will mirror existing per-chapter conventions, not the template); `docs/audit/archive/PHASE_7_PLAN.md` (readability sweep — methodology precedent for grandmother-test glossing in new I-N entries); `docs/audit/archive/PHASE_10_PLAN.md` (PEOPLE.md authoring — methodology precedent for canary + locale-mirror + integrity-sweep workflow); `docs/audit/archive/AUDIT_PHASE_8_PLAN.md` (independent audit absorbed pre-execution per round-1 above); `docs/editorial-log/genesis.md` (current Section I authoring decisions — 4 scenarios; date-anchored entry IDs); `docs/editorial-log/john.md` + `matthew.md` (current Section I authoring decisions — 2 scenarios pre-70/post-70; latest IDs J-021 and M-019 per current state); `src/infrastructure/content/enrichment-parser.ts` line 11 `ENTRY_HEADER` (the H3-only regex that determines parser-level granularity per §4.3).
