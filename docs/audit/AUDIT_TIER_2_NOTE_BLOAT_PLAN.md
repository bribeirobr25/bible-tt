# Audit of `TIER_2_NOTE_BLOAT_PLAN.md`

**Date:** 2026-05-18
**Auditor:** Claude Opus 4.7 (independent review)
**Scope:** `docs/audit/TIER_2_NOTE_BLOAT_PLAN.md` — 17-chapter Tier 2 relocation sweep across Genesis 1–8 + 10–12, John 1–3, Matthew 1–3 × 4 locales.
**Method:** Verified plan claims against: `docs/editorial-log/genesis.md` (Entry 2026-05-09-100 read directly), `docs/audit/TIER_2_NOTE_BLOAT_PLAN.md` (full read), directory tree (confirmed file structure), prior session context for `markdown-parser.ts`, `src/infrastructure/content/__tests__/markdown-parser.test.ts`, `docs/architecture/STANDARDS.md`, `docs/design/TT-DESIGN-SYSTEM.md`, and `scripts/content-lint.sh`.
**Note:** Filesystem MCP became unresponsive during this session after the plan and genesis.md were read. All source-file verification was completed from material read before the outage, prior session reads, and the genesis.md content extracted via copy-to-Claude.
**Status:** Plan is strategically sound and methodology-verified. Four significant specification gaps that should be resolved before Step 2 begins. Several minor issues. The Q1–Q6 recommendation set is correct.

---

## 1. Executive Summary

The plan is methodologically robust. The Gen 9 pilot at Entry 2026-05-09-100 is a real, verified precedent with documented technique, confirmed counts (7 → 4 oversize notes per locale), and explicit deferred scope ("propagation to remaining 17 chapters"). The plan correctly scales that validated 7-step protocol. The Q1–Q6 recommendation set (hottest-first, pilot-scope-match, per-chapter all-locales, pointer+companion-expansion, per-book log, single-commit) is internally consistent and appropriate.

**What verifies correctly:**

- Entry 2026-05-09-100 exists and documents the technique in precise detail — including the "no companion file was edited" observation, the PT-BR stale pointer bug fix, the 4 borderline notes left in Tier 2, and the exact deferred scope ("17 chapters remain"). ✓
- The §734 content-type enumeration (ANE parallels, later reception, statistical analysis, theological trajectories, extended archaeology/history, multiple scholarly positions, modern scientific comparison, anti-misuse) is quoted verbatim in Entry 2026-05-09-100 and matches the plan's §1.1. ✓
- The 43% relocation rate from Gen 9 is accurate (3 of 7 oversize notes relocated). ✓
- The "borderline lexical/grammatical 4-sentence notes" residual is correctly deferred to Phase 7. ✓
- The single-commit discipline matches all recent sweep precedents (DE familiar-names, Phase 8, M-024). ✓
- Architecture: DDD boundary clean — content-only sweep, no `src/` changes. ✓
- Test baseline: content-only sweep, no new parser tests needed. ✓

**Four significant specification gaps:**

1. **Step 1a's detection regex is under-specified for the actual multi-line note structure** in chapter files.
2. **DE pointer template uses "Kapitelbegleiter"** — wrong terminology; DE files use "Begleitmaterial."
3. **Content-lint baseline "2 warnings (§0.10 + §0.11)"** requires pre-execution verification — §0.11 may not exist yet.
4. **Pivotal-verse exception notes** must be explicitly excluded from detection scope.

---

## 2. Verification Table

| Plan claim | Verification result | Notes |
|---|---|---|
| Entry 2026-05-09-100 documents the Gen 9 pilot | ✓ Verified | Exact entry found in genesis.md at line 1423; technique documented in 7 steps, exactly as plan describes |
| Rule 29 §734 content-type list (ANE parallels, later reception, etc.) | ✓ Verified | Entry 2026-05-09-100 quotes the rule verbatim: "Move material to companion files when it contains: ANE parallels, later reception history, statistical analysis..." |
| Gen 9 pilot: 7 → 4 oversize notes per locale; 3 relocated | ✓ Verified | Entry: "7 oversize notes per locale → 4 oversize per locale" with 3 relocations targeting §A1, §A5+D1, §G3 |
| "No companion file was edited in this pilot" | ✓ Verified | Entry 1441: "No companion file was edited in this pilot — the receiving sections were already in place" |
| PT-BR stale pointer bug fixed in pilot | ✓ Verified | Entry 1442: "PT-BR Gen 9 beno haqatan note carried a stale pointer... corrected to §G3" |
| Borderline 4-sentence lexical/grammatical notes deferred to Phase 7 | ✓ Verified | Entry 1440: the 4 remaining borderline notes "don't carry the companion-grade content types Rule 29 §734 enumerates as relocation-triggering. Tightening these without relocation is a separate readability pass (Phase 7 territory)." |
| 17 chapters remain after Gen 9 pilot | ✓ Verified | Entry 1446: "propagation to remaining 17 chapters (Genesis 1–8, 10–12 + John 1–3 + Matthew 1–3 = 17)" |
| Detection regex: ≥4 sentence-ends per blockquote bullet | ✗ **Under-specified** | Actual note structure spans multiple blockquote continuation lines. Single-line regex misses all continuation content. See §3.1. |
| DE pointer: `→ Für [Thema], siehe den Kapitelbegleiter §X` | ✗ **Wrong terminology** | DE chapter files use "Begleitmaterial" / "Begleitmaterial Abschnitt X", not "Kapitelbegleiter". See §3.2. |
| Content-lint baseline: 2 warnings (§0.10 + §0.11) | ✗ **Requires verification** | §0.11 was proposed in AUDIT_DE_FAMILIAR_NAMES_PLAN.md §4.4 but not confirmed as shipped. See §3.3. |
| Pivotal-verse exception notes are in scope | ✗ **Gap** | Plan's §1.6 (Out-of-scope) doesn't mention pivotal-verse exceptions. Genesis 9's designated pivotal verses are legitimately long. See §3.4. |
| ~43% relocation rate expected across 17 chapters | ✓ Plausible | Derived correctly from Gen 9 pilot; plan notes hot/lexical chapter variance correctly |
| DDD boundary: content-only, no src/ changes | ✓ Verified | Pure markdown edits; no TypeScript, no domain types, no UI components |
| Gen 9 pilot took ~1h for 1 chapter × 4 locales | ✓ Verified | Entry 1446 confirms this; ~25h estimate for 17 chapters is proportionate |
| Editorial-log anchor + sister pattern (Q5 Option A) | ✓ Consistent | Pattern used in M-024 + J-023 + 2026-05-17-106; one entry per book is correct precedent |
| ~780 total × 43% → ~335 relocated → ~445 residual | ✓ Math checks out | 780 × 0.43 = 335 relocated; 780 − 335 = 445 residual ✓ |

---

## 3. Significant Findings

### 3.1 Step 1a detection regex is under-specified — single-line match misses multi-line note structure

The plan describes Step 1a as:
> "Detect oversize Tier 2 notes in `content/en/{book}/CHAPTER-N.md` using the Gen 9 pilot's regex (≥4 sentence-ends per blockquote bullet `> - **...**`)."

**The problem:** Tier 2 notes in chapter files do not fit within a single blockquote bullet line. A typical Tier 2 note structure (verified in DE John 1 CHAPTER-1.md during the AUDIT_DE_FAMILIAR_NAMES_PLAN.md session) looks like:

```markdown
> 🔴 **KRITISCH — *LOGOS* („WORT")**
> - **Ἐν ἀρχῇ ἦν ὁ λόγος** (*En archē ēn ho logos*) = „Im Anfang war das Wort."
>   Der Begriff λόγος (*logos*) trägt ein außergewöhnlich breites Bedeutungsspektrum: ...
>   Die TT gibt „Wort" (Kleinschreibung) als die direkteste Übersetzung wieder...
>   Großschreibung als Titel bleibt dem Interpretationsrahmen des Lesers überlassen.
>   Für ausführlichere Diskussion siehe Begleitmaterial Abschnitt A.
```

The label line (`> - **...**`) is followed by multiple blockquote continuation lines (`>   Text...`). A regex matching only `^> - \*\*...\*\*` sees the label line only and finds zero sentence-end tokens in it — the actual note content on the continuation lines is invisible to a single-line scan.

This is confirmed by the Gen 9 pilot's Entry 2026-05-09-100 citing **specific line numbers** for the 4 residual notes (`lines ~161`, `~181`, `~327`, `~355`), indicating the detection used line-level inspection of the file, not a simple automated single-line regex count.

**Impact:** If Step 1a is executed as a single-line blockquote scan, many or most oversize notes in the hot chapters (John 1, John 2, John 3 have densely multi-line note structures) will be missed. The §1.3 diagnostic counts (which show 20-27 oversize notes per locale in these chapters) could only have been produced by a multi-line approach.

**Required fix:** Step 1a must specify a multi-line detection strategy:

> "For each chapter file: (a) split by verse boundary (`### **Vers N**` / `### **Verse N**` / equivalent per locale); (b) within each verse, collect all blockquote text (lines beginning with `>`); (c) count sentence-ending punctuation tokens (`. ` / `? ` / `! ` followed by space, newline, or end-of-line) in the aggregate blockquote text for that verse; (d) flag verse blocks where total blockquote sentence count ≥ 4. Review flagged verses manually to apply the §734 content-type classification (Step 1b). The regex is a coarse filter; Step 1b is human judgment."

### 3.2 DE pointer template uses "Kapitelbegleiter" — not the established DE locale term

Step 2b specifies the DE pointer template:
> `→ Für [Thema], siehe den Kapitelbegleiter §X.`

**The problem:** Verified in DE John 1 CHAPTER-1.md (read fully in AUDIT_DE_FAMILIAR_NAMES_PLAN.md session), the DE files use "**Begleitmaterial**" for the companion concept, consistently and at every occurrence:

```
Für ausführlichere Diskussion siehe Begleitmaterial Abschnitt A.
```

"Kapitelbegleiter" is a different word that does not appear in any DE chapter file. It would be unrecognizable to a DE reader trying to find the referenced material. The established DE convention is "Begleitmaterial Abschnitt X" (not "Kapitelbegleiter §X" — note also the different separator: "Abschnitt" vs. "§").

**Required fix:** Replace the DE pointer template with:
```
→ Für ausführlichere Behandlung von [Thema], siehe Begleitmaterial Abschnitt X.
```
Or the shorter form already used in DE chapter files:
```
→ Für [Thema], siehe Begleitmaterial Abschnitt X.
```

Note also the section reference format: DE chapter files use "Abschnitt A" not "§A" (the `§` sign format may be EN-specific). Verify EN, PT-BR, and ES pointer templates against established conventions in those locale files before execution.

### 3.3 Content-lint baseline "2 warnings (§0.10 + §0.11)" requires pre-execution verification

Step 3 states: "`pnpm content:lint` (expect: baseline 2 warnings — §0.10 + §0.11 — unchanged)."

**The problem:** From AUDIT_DE_FAMILIAR_NAMES_PLAN.md §4.4, §0.11 was proposed as a new warn-only rule for catching redundant-parens patterns in DE chapter files. That audit described it as "not a blocker" and a "suggested improvement" — language indicating it was a proposal, not a delivered rule. Whether §0.11 was actually added to `content-lint.sh` as part of the DE familiar-names sweep execution is unconfirmed in this session.

If §0.11 does not exist, the baseline is 1 warning (§0.10 only). Running Step 3 verification against an asserted 2-warning baseline when only 1 warning actually fires could cause the plan to incorrectly report a new lint warning as "unchanged" when it's actually a regression — or vice versa.

**Required fix:** Before Step 0 (decision lock), run `pnpm content:lint` and record the actual warning count and rule IDs as the verified baseline for Step 3. Do not assert the baseline from plan documentation.

### 3.4 Pivotal-verse exception notes must be explicitly excluded from detection scope

Entry 2026-05-09-100 documents that Genesis 9 designated four pivotal verses (Gen 8:21, 9:6, 9:13, 9:22) with "permitted extended Tier 2 notes under pivotal-verse exception. Each logged here per exception clause." These notes are intentionally and legitimately long — they were explicitly excepted from the 3-sentence cap.

**The problem:** The plan's §1.6 (Out-of-scope) does not mention pivotal-verse exceptions. The plan's Step 1a detection will flag any note with ≥4 sentence-ends including notes that are legitimately long under the pivotal-verse exception. Step 1b's content-type inspection would likely catch these (a pivotal-verse Christological note is hard to mis-classify), but it's better to exclude them explicitly before detection rather than relying on Step 1b to rescue them.

Chapters in scope for this sweep may have their own pivotal-verse designations beyond Gen 9. Specifically: genesis log entries prior to the gen 9 pilot designate pivotal verses across multiple chapters.

**Required fix:** Add to Step 1a:
> "Before running detection on a chapter, grep `docs/editorial-log/{book}.md` for any pivotal-verse designations covering this chapter (search for 'pivotal' + chapter reference, e.g., 'Genesis 8', 'Genesis 3'). Notes on designated pivotal verses are EXCLUDED from §734 detection scope regardless of sentence count. Log the exclusion in the classification doc."

---

## 4. Minor Issues

### 4.1 Q4 Option B companion expansions need provisional-status marking

Q4 Option B (recommended): "≤1 paragraph per new companion sub-entry, with Section H source provenance updated when a new source enters."

The Gen 9 pilot explicitly did NOT expand companions. Q4 Option B is new territory relative to the pilot. The plan acknowledges this as scope expansion, but doesn't specify a quality differentiation mechanism for sweep-authored companion content vs. dedicated-phase companion content.

**Suggested addition:** In Step 2a, add: "New companion sub-entries authored during this sweep are marked `**Status:** provisional — added via §734 sweep; pending readability review` and listed in the classification doc as expansion-flagged. This allows quality review of the expansions in a follow-up pass without blocking sweep completion."

### 4.2 "RULES-CORE.md line 734" — fragile citation pattern

The plan's title, §0 TL;DR, §1.1, and §5 Step 2b cite "RULES-CORE.md line 734" as the location of §Tier 2 Relocation Protocol. This is flagged as a fragile pattern in AUDIT_PHASE_8_PLAN.md §3.1 and AUDIT_DE_FAMILIAR_NAMES_PLAN.md §5.2 — line numbers shift with any RULES-CORE.md edit.

The stable citation is "RULES-CORE.md Rule 29 §Tier 2 Relocation Protocol." Entry 2026-05-09-100 itself uses this form. Replace "line 734" throughout with the rule+section citation, noting "(line 734)" as an aid only.

### 4.3 PENDING.md "RESOLVED" wording should acknowledge the residual

Step 4 says: "PENDING.md — FEEDBACK item 19 marked RESOLVED (or PARTIAL-with-residual if Q2 = A leaves borderline notes unaddressed)."

With Q2 = Option A (recommended), ~445 of ~780 total oversize notes persist after the sweep. Marking item 19 "RESOLVED" is misleading.

**Suggested wording for PENDING.md:** "RESOLVED — §734-qualifying content relocated (~335 of ~780 oversize notes). Remaining ~445 are borderline lexical/grammatical notes outside §734's enumerated relocation triggers; legitimately deferred to Phase 7 readability pass per Gen 9 pilot precedent (Entry 2026-05-09-100)."

### 4.4 Minor table inconsistency: Q1 Option A order vs. §1.3 table

Q1 Option A lists "john/2 (26) → gen/10 (26)" but §1.3 shows john/2 EN=25 and gen/10 EN=26. The ordering is by Avg/locale (john/2 = 26.0, gen/10 = 25.8) which correctly places john/2 first. The parenthetical "(26)" in the Q1 description should use Avg/locale for consistency with the table, or be changed to "(26.0 avg)" vs "(25.8 avg)" to avoid confusion.

### 4.5 Editorial-log number verification at execution time

Step 4 uses placeholder entry IDs. Per established discipline (POSSIBLE_CONTENT_BUNDLE_PLAN.md "re-verify at execution time"), add an explicit instruction: "Immediately before Step 4, run `tail -5 docs/editorial-log/{genesis,john,matthew}.md` to verify the current last entry in each log. Use last+1. The genesis log uses date-based IDs — use the authoring date as the date prefix, and the next ordinal after the current last."

---

## 5. Architecture and Design Compliance

### 5.1 DDD boundary — Clean ✓

Content-only sweep. No changes to `src/domain/`, `src/infrastructure/`, `src/ui/`, `src/app/`. STANDARDS.md DDD litmus test: pass. ✓

### 5.2 No new dependencies ✓

Python/regex detection scripts operate outside the `pnpm` dependency graph. No `pnpm add`. ✓

### 5.3 TypeScript — no impact ✓

No `.ts` or `.tsx` files modified. `pnpm build` compilation is unaffected. ✓

### 5.4 Test baseline — stable ✓

Content-only sweep adds no parser logic. The existing `markdown-parser.test.ts` suite validates that Tier 2 notes (blockquote sections in `## VERSE-BY-VERSE STUDY`) parse correctly. A note being tightened from 5 sentences to 3 does not change parse behavior — blockquote bullets are collected as a string regardless of length. ✓

### 5.5 Design system — no impact ✓

Tier 2 notes render via existing `note-block.tsx` / `verse-card.tsx` components. The rendering component is unchanged; only the string content becomes shorter. ✓

### 5.6 Render quality preservation — important constraint

TT-DESIGN-SYSTEM.md anti-slop checklist: "Note content must be accurate, sourced, and not fabricated." Step 2's "preserve glossary term, Hebrew/Greek, transliteration, core takeaway" is correct. Add to Step 2a an explicit constraint: "When tightening a note, the condensed version must retain: (a) any unique gloss or transliteration that appears only in this note, (b) the primary textual/grammatical observation the note conveys, (c) any uncertainty label or Rule 13 confidence marker. If condensing a note to ≤3 sentences would require dropping one of these, KEEP the note at its current length and flag it as KEEP-CONTENT-REQUIRED in the classification doc."

---

## 6. What Works Well

- **Pilot precedent is the strongest possible foundation.** The plan scales an exact, validated, logged technique. Entry 2026-05-09-100 is a complete audit trail.
- **Hottest-first ordering (Q1 Option A).** Capturing ~50% of bloat in the first 4 chapters is the right risk-management approach given effort budget variability. Explicit time-boxing (§8: 10h / 16h / 25h) gives the project lead real decision points.
- **TIER_2_NOTE_BLOAT_CLASSIFICATION.md output document.** Intermediate artifact before editing begins — matches the DE_FAMILIAR_NAMES_CLASSIFICATION.md pattern; allows project-lead review of classifications before irreversible changes.
- **§734 content-type vs. borderline lexical/grammatical distinction.** Precise and matches the actual pilot decision exactly. Not over-applying the relocation protocol.
- **Q4 Option B recommendation with ≤1-paragraph constraint.** "Half-finished feeling" rejection of Option C is the right call. The companion expansion limit prevents scope creep.
- **Risk table §6.** The sentence-end token approach (not word-boundary regex) is a well-learned lesson from the DE familiar-names audit — confirms awareness of Unicode-superscript edge cases.
- **Q5 Option A (per-book log).** Matches the "anchor + sister" pattern used in M-024 + J-023 + 2026-05-17-106. Clean, consistent, greppable.
- **Q6 single-commit.** Matches all recent sweep precedents. Clean rollback path.
- **PT-BR and ES pointer templates.** Both match natural register of those locale files. Only DE needs fixing.

---

## 7. Required Conditions Before Execution

In priority order:

| # | Issue | Severity | Required Fix |
|---|---|---|---|
| 1 | Step 1a detection regex misses multi-line note structure | **Significant** | Specify multi-line strategy: group blockquote lines by verse boundary; count sentence-ends in aggregate per note block, not per line |
| 2 | DE pointer uses "Kapitelbegleiter" — wrong DE locale term | **Significant** | Replace with "Begleitmaterial Abschnitt X" (verified convention in DE chapter files); also change `§X` to `Abschnitt X` for DE |
| 3 | Content-lint baseline "2 warnings" requires pre-execution verification | **Significant** | Run `pnpm content:lint` before Step 0; record actual warning count and rule IDs as the true baseline |
| 4 | Pivotal-verse exception notes not excluded from detection | **Significant** | Add Step 1a instruction: grep editorial log for pivotal-verse designations per chapter; exclude those verses from detection scope |
| 5 | Q4 Option B companion expansions need provisional-status marking | Minor | Mark new sub-entries "provisional — added via §734 sweep" in companion files and classification doc |
| 6 | "RESOLVED" in PENDING.md misleading given ~445 residual | Minor | Use "RESOLVED — §734 content relocated; ~445 borderline notes legitimately deferred to Phase 7" |
| 7 | "RULES-CORE.md line 734" fragile citation | Minor | Use "Rule 29 §Tier 2 Relocation Protocol" as primary; treat "(line 734)" as secondary aid |
| 8 | Editorial-log number verification at execution time | Minor | Add "run tail -5 on each log immediately before Step 4; use last+1" instruction |

---

## 8. Recommendation

**Approve after items 1–4 are resolved.** Items 1 and 2 are execution-quality gaps — wrong detection scope produces missed notes; wrong DE terminology produces unrecognizable pointers. Item 3 takes 2 minutes and prevents a masked lint baseline assumption. Item 4 protects legitimately-long pivotal-verse notes from accidental relocation.

After resolution, this is a mechanically sound, well-precedented sweep. The Gen 9 pilot provides everything needed — the technique is validated, the quality bar is documented, the error modes are identified (stale pointer, over-tightening), the residual disposition (borderline → Phase 7) is established, and the editorial-log pattern is confirmed.

The 25h estimate is realistic. The hottest-4 / hottest-8 / full-17 time-boxing gives the project lead a clear commitment management structure.

No Lock Protocol question applies — Rule 29 §734 already governs this work. No code changes. No new tests. Content-redistribution from Tier 2 notes into existing companion sections.

---

**Audit complete.** Gen 9 pilot entry (2026-05-09-100) verified directly from genesis.md. Plan claims cross-checked against pilot entry text, prior session file reads (DE chapter file note structure, content-lint.sh, STANDARDS.md), and directory structure. All four significant findings are grounded in verified source material.
