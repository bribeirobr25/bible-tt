# Feedback — Recommended Updates to `SOURCE_ANALYSIS_METHODOLOGY_PLAN.md`

**Date:** 2026-06-02
**Author:** Claude Opus 4.8 (independent review)
**Companion to:** `docs/audit/AUDIT_SOURCE_ANALYSIS_METHODOLOGY_PLAN.md` (the full audit + enrich-the-project verdict)
**Purpose of this file:** The audit answered *"does this plan enrich the project?"* (verdict: yes, low risk, no execution-blocker). This file is the narrower, actionable companion: **the specific edits to make to the plan document itself before locking Q1–Q8 and executing.** Nothing here changes the verdict; these are precision fixes that make the plan internally consistent and lower-friction to execute.

**Scope discipline:** These edits touch the plan's *prose, references, and step instructions only*. They do **not** alter the Q1–Q8 recommendation set or the decision-lock fields — those remain the project lead's call.

---

## Summary table

| # | Edit | Type | Depends on a Q decision? | Plan location |
|---|------|------|--------------------------|---------------|
| 1 | Align the leakage-grep command across the plan | Internal inconsistency | No — fix now | Validation checklist vs. Step 0 / Step 8 |
| 2 | Replace `RULES-CORE.md:1484` with a section citation | Fragile reference | No — fix now | "What already exists" table + Pre-execution table |
| 3 | Broaden the Q4 metadata reword to all three stale lines | Scope correction | Yes — on Q4=A/C | Step 4 + Q4 |
| 4 | Name §0.12 as the template for the §0.13 guard | Concreteness | Yes — on Q7=A | Q7 + Step 6 |
| 5 | Clarify Aramaic substance home (RULES-HB.md §Aramaic Appendix) | Architecture consistency | Partly — on Q5 stubs | Target structure + Step 5 |
| 6 | Make the living-language-comparand caution epistemic, not just scope | Method-quality | No — fold into Step 1 | Step 1 (METHOD.md authoring) + Risk table |

Plus a decision note on **Q3** (below) — not an edit, a recommendation refinement.

---

## Fix now — independent of any Q decision

### 1. Align the leakage-grep command across the plan

**Problem.** The plan describes its core leakage check two different ways:
- **Step 0 / Step 8 (prose):** "Re-run the exact-token (`\bElan\b`) + persona-marker grep" — word-boundary, correct.
- **Validation checklist (pre-commit):** `grep -ri "elan" content/ src/ → zero matches` — case-insensitive **substring**.

These are different commands with different match sets. The substring form risks false positives on ordinary word-forms (Spanish *revelan / anhelan / desvelan*; English *Cleveland*). If the executor runs the checklist form at Step 8, a hit from *revelan* in a Spanish file could trigger a false alarm — or, worse, an "edit" to legitimate text.

**Edit.** In the Validation checklist, replace:
```
- [ ] `grep -ri "elan" content/ src/` → zero matches (Step 0 + Step 8)
```
with:
```
- [ ] `grep -rnE "\bElan\b" content/ src/` → zero matches (word-boundary, case-sensitive)
- [ ] Persona-marker scan (subscribe / my channel / native hebrew speaker / patreon / notification bell …) → zero matches in content/ + src/
```
This makes the checklist match the Step 0/8 prose and splits the name-token check from the (higher-signal) persona-marker check. One-line change of intent; removes a guaranteed-confusing execution moment.

### 2. Replace the `RULES-CORE.md:1484` line-number citation

**Problem.** The plan cites the contributor-credit line as `RULES-CORE.md:1484` (in the "What already exists" table and the Pre-execution verification table). Line-number citations have drifted and caused rework repeatedly in this project (flagged in the Phase 8, DE-familiar-names, and Tier-2 audits). The block also moves the moment anyone edits CORE above it — including this very plan's Step 4.

**Edit.** Replace every `RULES-CORE.md:1484` with `RULES-CORE.md §PROJECT METADATA`. (Verified this pass: the credit line `**Source Analysis:** Video transcripts by Elan (Hebrew speaker)` lives in the §PROJECT METADATA block, and is the sole internal-doc occurrence of the name besides the plan and the audit.)

---

## Fix when the decisions are locked

### 3. Broaden the Q4 metadata reword to all three stale lines

**Problem.** Step 4 and Q4 frame the metadata edit as rewording only the *Source Analysis* credit line. But the §PROJECT METADATA block is stale in **three** places (confirmed by reading `RULES-CORE.md` in full this pass):
- `**Status:** Genesis 1–9 drafted in all four languages; awaiting reviewer sign-off.`
- `**Completed:** Genesis 1–9 EN, PT-BR, DE, ES (drafts). …`
- `**Pending:** Genesis 10+ in all languages / … / Greek Scriptures expansion (RULES-GS.md)`

Actual scope (per CLAUDE.md + README): Genesis 1–12, John 1–3, Matthew 1–3 in all four locales, with John PEOPLE.md, Book Context, prophecy, and the v3.3.1 / v3.3.2 amendments all landed. The block understates scope, omits John + Matthew entirely, and lists already-done work as pending.

**Edit (conditional on Q4 = A or C — i.e., the metadata block is being opened anyway).** In Step 4, expand the PROJECT METADATA sub-bullet from "reword the credit line" to:
> "Reword the *Source Analysis* credit per Q2 **and** refresh the three stale scope lines — `Status`, `Completed`, `Pending` — to current scope (Gen 1–12 + John 1–3 + Matthew 1–3; amendments v3.3.1 / v3.3.2 landed). Keep the `Audit trail:` line a compact pointer — do not expand it into a changelog (detail lives in `EXECUTION_HISTORY.md`)."

Near-zero marginal cost since the block is already open; leaves it accurate rather than half-fixed. (If Q4 = B, the credit reword is handled elsewhere per Q2 and this metadata refresh can be tracked as a separate trivial cleanup — but doing it under the same emergency-amendment is cleaner.)

### 4. Name §0.12 as the working template for the §0.13 guard

**Problem.** Q7 / Step 6 describe the new §0.13 leakage guard abstractly ("warn-only content-lint rule"). There is already an in-tree rule that is almost exactly the right shape.

**Edit (conditional on Q7 = A).** Add to Q7 (and echo in Step 6):
> "Model §0.13 on the existing **§0.12 `check_cross_book_pointers`** in `scripts/content-lint.sh` — a warn-only `perl -ne` scan with an inline allow-list, emitted via `emit_warn`, scoped to specific file globs. For §0.13: scan for `\bElan\b` (word-boundary) + persona markers, scoped to `content/*` and `src/*` globs only (never `docs/source-analysis/`). Register any legitimate-but-matching case via the existing `scripts/lint-allowlist.txt` mechanism."

Turns the guard from a from-scratch rule into a near-copy of working code. (Verified this pass: §0.1–§0.12 are in use; **§0.13 is the next free ID** — the plan's claim is correct.)

### 5. Clarify the Aramaic substance home

**Problem.** The target-structure section creates a parallel `aramaic/` corpus dir and the METHOD.md adaptation table treats HB / GS / Aramaic as three peers. But in this project's architecture, **RULES-HB.md is the Hebrew *and* Aramaic supplement** (it carries the §Aramaic Appendix) — there is no separate Aramaic ruleset.

**Edit (relevant once Q5 stubs are created).** In the target-structure block and the `aramaic/README.md` stub bullet (Step 5), add a one-line note:
> "Aramaic *worked examples* live in `aramaic/`, but the *substance / governance home* is `RULES-HB.md §Aramaic Appendix` — there is no parallel RULES-Aramaic file. The METHOD.md adaptation table's Aramaic column should point there."

Keeps the method doc honest about where Aramaic governance actually lives.

### 6. Make the living-language-comparand caution epistemic, not just scope

**Problem.** The plan flags the "living-language comparand" (Modern Israeli Hebrew for HB) as *HB-only, not universal* — a **scope** caution. The more important caution is **epistemic**: a living-language comparand generates hypotheses, it never evidences meaning. Modern Hebrew carries 2,000+ years of semantic drift; treating it as authoritative for Biblical Hebrew would import anachronistic meaning, against the spirit of Rule 3.

**Edit (fold into Step 1 — METHOD.md authoring; no Q dependency).** Add to the Step 1 instructions:
> "In METHOD.md, state the living-language-comparand caution as epistemic, not just scope: a living comparand (Modern Hebrew for HB; Modern/Patristic Greek or Neo-Aramaic elsewhere) **generates hypotheses, never evidences meaning** — tie this to Rule 3 explicitly so the discipline travels with the method."

Optionally mirror one line into the Risk table row that currently reads "Method doc drifts toward a single contributor's idiom."

---

## Decision note (not an edit) — Q3

The plan recommends **Q3 = A** (light prose cleanup) as the floor, noting **C** (distill to structured per-verse notes) is higher-value. Two of the plan's own justifications are "feeds Phase-12 authoring" and "ports to GS/Aramaic." Lightly-cleaned ASR prose serves neither well — no one will consult de-cruft-ed transcript prose. **If the corpus is meant to feed Phase 12 / GS / Aramaic, C is the higher-value answer**; A is an acceptable floor only if the corpus is being kept purely for archival provenance. C can be staged (A now as a safety move, C as the immediately-following pass) if the 5–8 h envelope is tight. This is a project-lead call — flagged here so the Q3 lock is made with the trade-off explicit.

---

## What is deliberately *not* changed

- **Q1–Q8 recommendations and decision-lock fields** — untouched; the project lead's call.
- **The verdict** — unchanged. The plan enriches the project, low risk, no execution-blocker (see the audit file).
- **Execution order / effort estimate** — unchanged; edits 1–6 add no material time and edit 3 is near-zero marginal cost.

---

## Cross-references

- Full audit + enrich-the-project verdict: `docs/audit/AUDIT_SOURCE_ANALYSIS_METHODOLOGY_PLAN.md`
- Plan under review: `docs/audit/SOURCE_ANALYSIS_METHODOLOGY_PLAN.md`
- Lint template referenced in edit #4: `scripts/content-lint.sh` §0.12 (`check_cross_book_pointers`)
- Metadata block referenced in edits #2 and #3: `RULES-CORE.md §PROJECT METADATA`
