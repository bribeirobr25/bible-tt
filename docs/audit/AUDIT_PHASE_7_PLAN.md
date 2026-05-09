# Audit of `PHASE_7_PLAN.md` (Readability Sweep on John & Matthew Companions)

**Date:** 2026-05-09
**Auditor:** Claude Opus 4.7 (independent review)
**Scope:** `docs/audit/PHASE_7_PLAN.md` — 8 sub-phases (7.1 through 7.7) covering technical-term glosses across John and Matthew companion CONTEXT files and book introductions, with a per-locale gloss decision table.
**Method:** Verified plan claims against actual files: file scope tree under `content/{en,pt-br,de,es}/{john,matthew}/`, `content/en/john/study/CHAPTER-1-CONTEXT.md`, `content/en/matthew/study/CHAPTER-1-CONTEXT.md`, `content/en/matthew/PEOPLE.md`, `content/en/genesis/INTRODUCTION.md`, `docs/editorial-log/john.md`, `docs/editorial-log/matthew.md`, `docs/editorial-log/transliteration-decisions.md`. Cross-checked every named cross-reference target.
**Status:** Plan is mostly sound. One critical execution-blocking error (cross-reference target misidentified). Five significant concerns. Four minor issues.

---

## 1. Executive Summary

Phase 7 is content editing only — no code changes, no architecture changes, no rule changes. The work is a per-file readability pass to gloss ~20 technical terms at first use, with a per-locale decision table that pre-resolves cross-language consistency. The structural choices are right: the per-file (not per-section) rule matches Genesis precedent; the per-locale table is the correct primitive for cross-language consistency; the term inventory at ~20 terms is well-scaled; the out-of-scope list (transliterations, common abbreviations, conventional references) is sensible.

The main verified facts hold:

- **John 1 CONTEXT §A6 monogenēs etymology** — confirmed. Full §A6 entry has `μόνος (*monos*, "only") and γένος (*genos*, "kind/type/offspring")` with the Vulgate / Nicene Creed history.
- **Genesis already broadly compliant** — confirmed. `content/en/genesis/INTRODUCTION.md` glosses Septuagint, Masoretic Text, BHS, Tanakh, Pentateuch, ANE, Levant, *berit*, gematria, *toledot*, *raqia*, *tselem elohim*, *ʾadamah*, Atrahasis Epic, Sumerian King List, *nikkud*, etc. all at first use. The Phase 7 spot-fix-only approach for Genesis is well-supported.
- **John 1 CONTEXT §A8 Colwell's Rule + predicate nominative** — both already glossed in the form the plan proposes. The plan's gloss `the describing noun placed before the verb` is a verbatim match for what's in §A8.
- **Editorial log entry numbers M-017 and J-019** — verified. Current matthew.md ends at M-016; current john.md ends at J-018. The proposed entry numbers are correct.
- **Ioudaioi Policy in RULES-GS.md, referenced from john.md** — confirmed via Entry J-006 in `docs/editorial-log/john.md` which cites `GS §Ioudaioi Policy`.
- **Matthew chapter-1 file has technical terms unglossed at first use in plan's parenthetical-gloss sense** — confirmed. *parthenos*, *almah* are discussed in context (§A4, §D2) but not glossed in the plan's table format.

But two of the plan's cross-reference and scope claims do not check out:

- **The *tektōn* cross-reference target is wrong.** The plan says "*tektōn* full discussion lives in `docs/editorial-log/matthew.md` Entry M-001" — but Entry M-001 is **Fulfillment Formula Policy**, completely unrelated. Reviewing all 16 entries M-001 through M-016: *tektōn* is discussed in NONE of them. The actual *tektōn* gloss `(craftsman; not just carpenter)` lives in `content/en/matthew/PEOPLE.md` in the Yosef "Profession" field, not in any editorial-log entry.
- **File scope undercount.** Plan says "30 in-scope files (24 chapter companions + 6 introductions)". Actual: 24 chapter companions + **8** introductions = **32 files**. Plus 4 Matthew PEOPLE.md files (which contain technical terms — *tektōn*, *dikaios* — but are out-of-scope per plan's scope statement).

---

## 2. Verification Table

| Plan claim | Verification result | Notes |
|---|---|---|
| File scope: 30 files (24 chapter companions + 6 introductions) | ✗ **Undercount.** | 4 locales × (3 chapter companions per book × 2 books) = 24 ✓; 4 locales × 2 introductions = **8** introductions, not 6. Total: **32 files**. Matthew PEOPLE.md (4 files) is also companion-style content but out-of-scope per plan. |
| Genesis already broadly compliant per 2026-05-08 re-check | ✓ Verified | `content/en/genesis/INTRODUCTION.md` first-use-glosses: Septuagint, Masoretic Text, BHS, Tanakh, Pentateuch, ANE, Levant, *berit*, gematria, *toledot*, *raqia*, *tselem elohim*, *ʾadamah*, Atrahasis Epic, Sumerian King List, *nikkud*, Aleppo Codex, etc. |
| `Colwell` count: 20 occurrences in 4 files; 3 glossed, 1 naked | Plausible (didn't count exhaustively) | John 1 CONTEXT has Colwell glossed in both §A3 (`a 1933 observation about Greek grammar in this sentence position`) and §A8 (richer + journal citation). Multiple-gloss-per-file is harmless under the per-file rule. |
| `predicate nominative` glossed once via "the describing noun before the verb" | ✓ Verified | John 1 CONTEXT §A8: `a predicate nominative (the describing noun placed before the verb) regularly drops "the"` — verbatim match for plan's gloss. |
| `anarthrous` glossed once via "without 'the'" | ✓ Verified | John 1 CONTEXT §D1: `appears without the Greek word for "the" — a construction called anarthrous (without the article)`. |
| `monogenēs` full §A6 etymology in EN John 1 CONTEXT | ✓ Verified | §A6: `built from μόνος (*monos*, "only") and γένος (*genos*, "kind/type/offspring"), not from μόνος + γεννάω (*gennao*, "to beget/bear")`. Also §D2 has a parallel etymology block. |
| *tektōn* gloss `(craftsman; not just carpenter)` in M-001 — reuse | ✗ **Wrong target.** | Entry M-001 is **Fulfillment Formula Policy**, not *tektōn*. No editorial-log entry discusses *tektōn*. The actual gloss lives in `content/en/matthew/PEOPLE.md` Yosef-entry Profession field: `craftsman (*tektōn*, Matt 13:55 — rendered "craftsman" in the TT, not "carpenter"; the Greek covers woodworking, stone-cutting, and general construction)`. |
| Editorial-log entry numbers M-017 + J-019 | ✓ Verified | matthew.md ends at M-016; john.md ends at J-018. M-017 and J-019 are next available. |
| Ioudaioi Policy in RULES-GS.md, referenced from `docs/editorial-log/john.md` | ✓ Verified | Entry J-006 cites `GS §Ioudaioi Policy` and decides transliteration policy book-wide. |
| `aorist` 15 occurrences in 8 files; unglossed | Partially incorrect | John 1 CONTEXT §A4 introduces and explains aorist at first use: `is in the aorist tense, which in Greek views an event as a single completed action, a one-time entry into a new state.` The contextual gloss exists but doesn't match the plan's parenthetical-format definition of "glossed." See §3.3 below. |
| `parthenos` 29 occurrences in 4 files; 4 glossed, 4 naked | Partially incorrect | Matthew chapter-1 CONTEXT §A4 + §D2 fully discuss *parthenos* in context but not in parenthetical-gloss format. Same definitional ambiguity. |
| Test baseline 796/796 | Unverified — assumes Phase 6.6 fully shipped | matthew.md M-014 / M-015 / M-016 reference Phase 6.6G/H/C closures, so 6.6 partially executed. Whether 6.6B's 4-new-test commit has shipped is unverified. See §3.4. |

---

## 3. Red Flags — Resolve Before Execution

### 3.1 The *tektōn* cross-reference target is wrong [CRITICAL]

Plan §3 inventory row 9 says:

> already glossed `(craftsman; not just carpenter)` in M-001 entry — reuse

Plan §4 cross-references says:

> *tektōn* full discussion lives in `docs/editorial-log/matthew.md` Entry M-001 — link.

Both references point to Entry M-001. **Entry M-001 is "Fulfillment Formula Policy"** — a 6-row table classifying Matthew's quotation formulas (Direct / Modified / Composite / Typological / Temporal-resultive / Unresolved). It has no discussion of *tektōn* or carpentry.

Reviewing all 16 entries M-001 through M-016: none discuss *tektōn*.

The actual gloss exists in `content/en/matthew/PEOPLE.md` Yosef profession field:

> **Profession:** craftsman (*tektōn*, Matt 13:55 — rendered "craftsman" in the TT, not "carpenter"; the Greek covers woodworking, stone-cutting, and general construction)

If Phase 7 is executed as written, every chapter-context file using *tektōn* with the cross-reference "see Entry M-001" will land readers at a fulfillment-formula entry, breaking the cross-reference promise.

**Required fix:** pick one of:

1. **Re-target the cross-reference to PEOPLE.md.** Update §3 inventory row 9 + §4 cross-references to read: `*tektōn* full gloss exists in matthew/PEOPLE.md Yosef-entry Profession field — link there.` Crossing-referencing a content file from a chapter companion is unconventional but not forbidden.
2. **Author a new editorial-log entry capturing the *tektōn* decision.** Add it as M-017 (the readability sweep entry) or as M-018 with a focused *tektōn* content + scope discussion. Then the cross-reference target works as originally intended.
3. **Inline the gloss everywhere it appears.** If *tektōn* truly only appears in 4 occurrences across 3 files (per plan's count), re-glossing each occurrence is cheap. Drop the cross-reference entirely.

Recommendation: option 2 (formal editorial-log entry). The *tektōn* decision is governance-worthy (the choice not to render "carpenter" is interpretive); putting it in the log gives the same audit trail as M-002 (parthenos/almah) and M-003 (kingdom of the skies).

---

## 4. Significant Concerns

### 4.1 File scope undercount: 30 vs 32

Plan says "30 in-scope files (24 chapter companions + 6 introductions)". From the directory tree:

- 4 locales × 3 John CONTEXT files = 12
- 4 locales × 3 Matthew CONTEXT files = 12
- 4 locales × 1 John INTRODUCTION = 4
- 4 locales × 1 Matthew INTRODUCTION = 4

Total: 24 chapter companions + **8** introductions = **32 files**.

Plan undercounts introductions by 2. This affects effort estimates: if 8 introductions (not 6) need passes in 7.1–7.6, the ~1.5h per locale step may need ~1.7h. Cumulative effect: ~30 minutes additional across the phase.

Plus: **Matthew PEOPLE.md (4 files) contains technical terms in plan's inventory** (*tektōn* is glossed there now; *dikaios* is glossed there). The plan excludes PEOPLE.md from scope. If a reader opens Matthew PEOPLE.md cold, terms like *tektōn* and *dikaios* are already glossed inline in person entries, but the per-file first-use rule isn't applied systematically. A future "PEOPLE.md readability sweep" item should land in `DEFERRED_TASKS.md` to track this gap explicitly.

**Required fix:**
1. Update §1 file count to 32 (or document why 2 introductions are out of scope).
2. Add a forward-tracking item to `DEFERRED_TASKS.md`: "Phase 7 follow-up: Matthew PEOPLE.md per-file readability sweep (4 files); John PEOPLE.md when authored in Phase 10."

### 4.2 "Glossed vs naked" definition is ambiguous

The plan's first-use status column treats `aorist` as "unglossed" and `parthenos` as "4 glossed, 4 naked across files," but:

- **Aorist** in John 1 CONTEXT §A4 is introduced and explained on first use:
  > `The verb ἐγένετο (*egeneto*) is in the aorist tense, which in Greek views an event as a single completed action, a one-time entry into a new state.`
  This is contextually glossed. The plan's proposed parenthetical gloss is `(simple-past tense in Greek; treats the action as a single event)` — almost identical content.
- **Parthenos** in matthew chapter-1 CONTEXT §A4 is introduced and discussed:
  > `the LXX (the ancient Greek translation) translates *almah* as **παρθένος** (*parthenos*), which more strongly implies virginity.`
  This is a contextual gloss, not a parenthetical-format gloss.

Two readings of the plan's standard:
- **Strict:** "glossed" means parenthetical-format gloss at literal first occurrence (the plan's table format). Under this reading, A4's contextual prose doesn't count, and adding the parenthetical creates over-redundancy with the prose discussion.
- **Permissive:** "glossed" means term is explained at first use in any form. Under this reading, A4 is glossed and no further work is needed.

The plan's per-locale table implies the strict reading, but applying it literally creates noise (parenthetical + prose both explaining the term). The permissive reading is closer to the "grandmother test" rationale — the reader doesn't care about the format, they care about the explanation.

**Required fix:** §5 (section-boundary rule) should add a paragraph specifying:

> When a term is **explained in surrounding prose** at first use (e.g., "the verb is in the aorist tense, which in Greek views an event as a single completed action..."), no parenthetical gloss is added. The parenthetical gloss is a fallback for terms used without surrounding explanation, not a redundant marker on top of existing explanations. The judgment is whether a non-specialist reader can understand the term from what's already on the page.

Without this clarification, every file pass will face dozens of judgment calls between strict and permissive readings, and locale editors may make different calls.

### 4.3 Test baseline 796/796 assumes Phase 6.6 has fully shipped

Plan §6 says "After each step: `pnpm test` (must stay 796/796)". Plan §8 DoD says "`pnpm test` passes 796/796."

This baseline assumes Phase 6.6 has shipped, which adds 4 new tests in 6.6B (parser fix). From `docs/editorial-log/matthew.md`:

- M-014 references Phase 6.6G of NEW_PLAN.md (content authoring)
- M-015 references Phase 6.6H (timeline visibility audit)
- M-016 references Phase 6.6C (introduction disclaimer)

So 6.6C / 6.6G / 6.6H are documented as executed. But the plan doesn't explicitly verify 6.6A (en-dash sweep), 6.6B (parser fix + 4 new tests), 6.6D (field reorder), 6.6E (accordion), 6.6F (breadcrumb), 6.6I (dead-code audit) have all shipped. If 6.6B hasn't shipped, the baseline is 792/792, not 796/796.

**Required fix:** Plan §8 DoD should add as the first pre-execution step:

> Pre-execution: verify `pnpm test` reports the actual current count. If it reports 796 passing, baseline confirmed and 7.1–7.7 must keep that count. If it reports 792, Phase 6.6 has not fully shipped — resolve 6.6B execution before starting Phase 7.

Also: the editor running 7.1 should not silently update the baseline number if it differs from 796. A discrepancy is a real signal that another phase's work didn't ship as expected.

### 4.4 Plan should reference existing editorial-log entries M-002 + M-006 in cross-references

Entry M-002 is the formal `parthenos/almah` Tier 1 slash policy with full almah/parthenos historical context. Entry M-006 is the `pneuma hagion` anarthrous policy. Both are perfectly good cross-reference targets for non-specialist readers — they live in the user-readable editorial-log alongside the books they govern.

The plan's §4 cross-references list points only to:
- John 1 CONTEXT §A6 (for monogenēs)
- M-001 (broken, for tektōn — see §3.1)
- RULES-GS.md / Ioudaioi Policy (for hoi Ioudaioi)

It doesn't reference M-002 (parthenos) or M-006 (anarthrous + pneuma hagion). The plan's own gloss for `parthenos` is a brief version of M-002's content; a reader following the gloss should be able to drill into M-002 for the full slash-policy decision, not re-derive it from the brief parenthetical.

**Required fix:** §4 cross-references list should add:

- Full *parthenos*/*almah* slash policy lives in `docs/editorial-log/matthew.md` Entry M-002 — link from chapter-context discussions.
- Full anarthrous *pneuma hagion* policy lives in `docs/editorial-log/matthew.md` Entry M-006 — link from anarthrous-related notes.

### 4.5 The Ioudaioi pointer is governance-doc, not user-facing

Plan §4 gloss table for *hoi Ioudaioi* says: `see Ioudaioi Policy`. But "Ioudaioi Policy" lives in `docs/rules/RULES-GS.md` — internal governance, not user-facing reading. A non-specialist following the pointer won't know where to look (they'd need to find the docs/rules folder, the GS file, the Ioudaioi section).

The user-facing equivalent is `content/en/john/study/CHAPTER-1-CONTEXT.md §C2` ("Hoi Ioudaioi — the range of the term in John's Gospel"), which has a 3-sense breakdown in user-readable form, plus the Reinhartz / von Wahlde sources. This is what a non-specialist actually wants.

**Required fix:** §4 gloss table → change Ioudaioi cross-reference target from "see Ioudaioi Policy" to "see §C2 of John 1 companion". Update the table accordingly across all 4 locales (with locale-translated section labels where applicable).

---

## 5. Minor Issues and Improvements

### 5.1 Where existing glosses are richer than the plan's table, reuse them

The plan's *tektōn* gloss is `craftsman (woodwork, stonework, general construction — broader than "carpenter")`. PEOPLE.md's existing gloss is richer:

> craftsman (*tektōn*, Matt 13:55 — rendered "craftsman" in the TT, not "carpenter"; the Greek covers woodworking, stone-cutting, and general construction)

Same for *dikaios*. Plan: `righteous; morally upright`. PEOPLE.md/Yosef: `righteous (*dikaios*) — a term of moral standing, not social rank`. Existing is richer.

**Suggested:** §4 introductory sentence should add: "The gloss table represents a floor, not a ceiling. Where existing inline glosses in the same locale are richer or more contextually appropriate, those are preferred. The table specifies what to add when no gloss exists, not what to overwrite."

### 5.2 Plan should explicitly note redundant glosses are kept, not removed

The plan addresses adding glosses (where missing) but is silent on existing glosses that occur multiple times in the same file. John 1 CONTEXT has Colwell glossed in both §A3 (brief) and §A8 (rich, with journal citation). The per-file rule says "first use" is glossed; subsequent uses can be naked. But the §A8 gloss is itself a deeper discussion, not just a redundant first-use marker.

**Suggested:** §5 (section-boundary rule) should add: "Existing in-context discussions of a term that exceed parenthetical first-use marker (e.g., a §A8-style deeper discussion) are kept regardless of where they fall in the file. Phase 7 adds glosses where missing; it does not remove existing in-context discussions."

### 5.3 Per-file rule trade-off should note Genesis precedent

Plan §5 says "per-file rule reduces gloss count by ~3-5× compared to per-section." Risk #4 (canary in 7.1) says: "If per-file feels too sparse, switch to per-section before 7.2 — lose a couple of hours, not 13."

But Genesis already follows the per-file convention (verified). If 7.2 switches to per-section, Genesis would also need a per-section pass for cross-book consistency — which is real additional work, not the implied "lose a couple of hours."

**Suggested:** Risk #4 should note: "Switching to per-section in 7.2 also implies a per-section pass on Genesis files for consistency, not just additional work on John/Matthew. Re-estimate total effort under that scenario."

### 5.4 Some technical-tense glosses oversimplify (acceptable per grandmother test)

The aorist gloss "Greek simple-past tense; treats the action as a single completed event" is the standard textbook description. Some Greek grammarians (Stanley Porter, *Verbal Aspect in the Greek of the New Testament*; Constantine Campbell, *Verbal Aspect, the Indicative Mood, and Narrative*; Buist Fanning, *Verbal Aspect in New Testament Greek*) argue the perfect/aorist distinction is primarily aspectual, not temporal — the aorist views action as a "single whole" regardless of when it occurred.

For the grandmother test, the standard description is more accessible. But a Hellenist reviewer at Rule 28 sign-off may push back.

**Suggested:** §7 editorial-log entry (J-019 / M-017) should explicitly note: "The aorist/imperfect/perfect glosses prioritize accessibility over technical precision. Aspectual-vs-temporal debates among Greek grammarians (Porter, Fanning, Campbell) are documented but not resolved in the gloss. Hellenist reviewer sign-off may flag this; if so, the gloss can be adjusted to lead with aspect."

This pre-empts the predictable Hellenist push-back without changing the gloss now.

### 5.5 Phase 7's editorial-log entries should cross-reference Phase 6.6 closure

Phase 6.6 ended with M-014/15/16 covering content authoring + governance + UX work. Phase 7 starts with content polish on John/Matthew. The two phases are sequential; the editorial-log entry J-019 / M-017 should briefly cite "follows Phase 6.6 closure" so the reader of the log can see the phase ordering.

**Suggested:** §7 entries should add to their Cross-references field: `docs/audit/NEW_PLAN.md Phase 6.6 closure` — establishes the chronological link.

---

## 6. What Works Well

- **Term inventory at ~20 terms is well-scaled.** Not too small (which would miss systematic gaps), not too large (which would bloat the work). The 30-file scope can absorb 20-term passes per locale in the time budget.
- **Per-locale gloss decision table is the correct primitive.** One-decision-applied-everywhere prevents two locale editors producing two phrasings — the most common cross-locale drift mode.
- **Per-file (not per-section) rule.** Matches Genesis precedent. Reduces noise. Risk #4 canary-in-7.1 is good defensive design.
- **Out-of-scope list is sensible.** Transliterations, common abbreviations (BCE, CE, c., ed.), conventional cross-references — all correctly excluded. Verse-text glosses (in CHAPTER-N.md) excluded — matches the editorial principle that the main translation isn't the place for technical-glossing.
- **Cross-reference strategy.** Link rather than re-explain — correct principle, just (a) one target wrong (§3.1), (b) more existing-entry targets should be added (§4.4).
- **Effort estimate at 13h.** Plausible for the corrected scope (32 files, not 30). Roughly 1.7-2h per locale for adding glosses + cross-references, plus 2h final integrity sweep.
- **Editorial-log entries M-017 + J-019.** Numbering verified correct; format matches §EDITORIAL LOG SPECIFICATION.
- **Risks table.** Risk #4 canary mitigation is good; Risk #3 (cross-locale grep at 7.7) is good; Risk #5 (new-term-emerges-during-execution) addresses the natural inventory growth.
- **Decisions resolved upfront.** §2 explicitly pins three decisions (term-inventory unbounded, cross-locale gloss consistency, first-use boundary) before execution starts.

---

## 7. Required Conditions Before Execution

In priority order:

1. **Fix the *tektōn* cross-reference target (§3.1).** Pick one of: re-target to PEOPLE.md, author a new editorial-log entry, or inline-gloss at every occurrence. Without this fix, executing 7.3 produces broken cross-references.
2. **Update file count to 32 and document Matthew PEOPLE.md as forward-tracked (§4.1).** Add to `DEFERRED_TASKS.md` so the gap doesn't get lost.
3. **Add definitional clarity for "glossed vs naked" in §5 (§4.2).** Specify whether contextual prose explanation counts as glossed, or whether parenthetical-format is required even when prose explains. Without this, every file pass faces judgment calls.
4. **Add explicit pre-execution test-baseline verification step (§4.3).** State that 796/796 assumes Phase 6.6 has fully shipped; if `pnpm test` reports 792, resolve 6.6B execution before starting Phase 7.
5. **Add M-002 + M-006 to §4 cross-references list (§4.4).** Existing editorial-log entries are appropriate cross-reference targets for *parthenos* and anarthrous *pneuma hagion*.
6. **Re-target the Ioudaioi cross-reference from RULES-GS.md to John 1 CONTEXT §C2 (§4.5).** User-facing companion section vs. governance doc.

The remaining items (§5) are improvements that can be addressed during execution.

---

## 8. Recommendation

**Approve after items 1–6 are addressed.** Item 1 is the only execution-blocker — running the plan as written breaks the *tektōn* cross-reference. Items 2–6 are governance / clarity issues that should land before content editing begins.

This is a small, focused content polish phase. Most of the plan is correct and well-scoped. The cross-reference error is a factual mistake (M-001 vs. PEOPLE.md) that's easy to fix; the scope undercount is arithmetic; the definitional ambiguity is a one-paragraph addition.

After fixes, execution risk is low. The 13h estimate is plausible for the corrected scope (32 files instead of 30 — modest adjustment ~30 min).

No Lock Protocol question applies. Phase 7 makes no rule changes, no glossary changes, no edition policy changes — purely additive parenthetical glosses + cross-reference pointers per the existing Rule 29 §Companion Pre-Submission Checklist (grandmother-test standard).

---

**Audit complete.** Claims verified against the actual file system, content files, editorial logs, and Rule 29.
