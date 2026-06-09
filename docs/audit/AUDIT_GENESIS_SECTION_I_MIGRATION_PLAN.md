# Audit — GENESIS_SECTION_I_MIGRATION_PLAN.md

**Date:** 2026-06-08
**Auditor:** Claude Opus 4.8 (independent review)
**Plan reviewed:** `docs/audit/GENESIS_SECTION_I_MIGRATION_PLAN.md` (rev. 2026-06-07)
**Method:** Verified every load-bearing claim against primary sources, not the plan's self-report or the Claude Code summary. Read in full this session: the template (`docs/templates/contextual-companion-template.md` §I), `docs/design/TT-DESIGN-SYSTEM.md` (complete — §6 Layout Rules + §12 Anti-Slop Checklist), `docs/rules/RULES-CORE.md` Rule 29 (complete), **both** the Genesis 1 companion (`content/en/genesis/study/CHAPTER-1-CONTEXT.md`) and the Genesis 12 companion (`content/en/genesis/study/CHAPTER-12-CONTEXT.md`) in full, and the enrichment parser (`src/infrastructure/content/enrichment-parser.ts`) + emitter + conservation gate (verified in the prior UX/Structure implementation audit this session).
**Status:** ✅ **APPROVE the plan and its Option A recommendation.** The plan is well-grounded; its agent-claim rejections are vindicated by the actual Rule 29 text. Three Minor accuracy notes, one process suggestion, and a corroboration note below — none affects the verdict.

---

## Executive summary

This plan asks whether to migrate Genesis §I (4 `### Scenario` dating-frames, each carrying inline `**I-A·n.**` category headers) to the John/Matthew `#### IA-x` card structure, and recommends **Option A — do not migrate**. Every factual pillar of that recommendation checks out against primary sources:

- The template §I spec **is** flat `### [Topic]` with no scenarios and no `####` (verified).
- The design system **does** ban "card soup" and "nested cards" (verified, substance exact).
- Rule 29 **does** make Section H mandatory, **does** define the 10 §I categories I1–I10, **does** require dual-labels, and **nowhere** mandates `####`/scenario markup (verified, complete read).
- The current Genesis §I **is** Rule-29 compliant (Section H present, disclaimer present, 10 categories present, dual-labels present — verified directly in the Gen 12 companion).

The plan's correction of the earlier audit drafts ("Genesis §I mislabeled" / "Section H missing" / "Option A bypasses Rule 29") is **correct**: all three were false, and the actual rule text confirms it. The Claude Code summary's verdict table is accurate.

This is the rare migration plan that argues *against* its own headline action, on solid evidence. Approve.

---

## Verification table

| # | Plan claim | Result | Evidence (verified this session) |
|---|---|---|---|
| 1 | Template §I specifies flat `### [Topic]`, no scenarios, no `####` | ✓ | Template §I: `### [Topic]` → `**[HISTORICAL / ARCHAEOLOGICAL — confidence]**` → "Each sub-topic gets its own entry (I1, I2, etc.)." No scenario grouping, no `####`. |
| 2 | Design system bans card soup + nested cards | ✓ | Confirmed by full re-read. §6 Layout → Rules: "No card soup — use dividers" + "No nested cards" (verbatim). §12 Anti-Slop → NEVER USE: "Card soup or nested cards" (verbatim). Section citations (§6, §12) are correct; the exact line digits (144/145/291) are not mechanically confirmable (no inline line numbers in the file) and are immaterial. |
| 3 | Rule 29: Section H MANDATORY | ✓ | RULES-CORE Rule 29: "**H.** Sources Consulted — **MANDATORY**". |
| 4 | Rule 29: the 10 §I categories are I1 Political … I10 Neighboring peoples | ✓ | Verbatim I1–I10 list in Rule 29 matches the plan's "I-A1 Political landscape … I-A10 Neighboring peoples" mapping. |
| 5 | Rule 29: dual-label required | ✓ | "Every contextual claim carries two labels" — 8 claim-types + 6 confidence levels, as the plan states. |
| 6 | Rule 29 nowhere requires `####`/scenario markup | ✓ | Complete Rule 29 read: structure is unspecified beyond "each sub-entry uses the standard labels." Markup is an authoring/rendering choice. |
| 7 | Current Genesis §I is Rule-29 compliant (H + disclaimer + 10 cats + dual-label) | ✓ | Gen 12 companion: Section H table present; disclaimer present; §I scenarios carry `**[HISTORICAL / ARCHAEOLOGICAL — DOCUMENTED]**`; categories I-A1…I-A4, I-A10 present with a cross-reference to Gen 1 for the full grid. **Gen 1 companion confirmed directly this session: full 4-scenario × 10-category grid present (Scenarios A/B/C/D, each I-x1 Political … I-x10 Neighboring peoples).** |
| 8 | Migration → ~40–56 cards/chapter (card soup) | ✓ (reasonable) | 4 scenarios × ~10–14 categories is arithmetically sound; the design-system ban makes this the decisive factor. |
| 9 | Parser already supports `#### ` sub-entries | ✓ | `enrichment-parser.ts` re-read directly 2026-06-08: `SUBENTRY_HEADER = /^#### (.+)$/`, `currentSub`/`flushSub()` state machine, `target = currentSub ?? currentEntry` routing; `finalizeEntry` only attaches `subEntries` when non-empty; emitter has `enrichmentSubEntryId`; conservation gate expects `enrichment-subentry`. |
| 10 | Earlier agent claims ("mislabeled" / "H missing" / "A bypasses Rule 29") are false | ✓ | All three contradicted by the verified Rule 29 text + Gen 12 companion content. The plan's §3 rejection is correct. |
| 11 | "all 10 present under each scenario" (plan §2 table) | ◑ overstated | See Minor 1. **Now verified directly:** true of **Gen 1** (full 10×4 grid confirmed by direct read), but **Gen 12** carries a *subset* (I-A1,2,3,4,10), some categories carrying their own trailing dual-label. The §2 table conflates the Gen 1 anchor file with the chapter files. Does not affect Option A. |

---

## Findings

No Critical or Significant findings. The recommendation (Option A) is correct and well-supported.

### Minor

**Minor 1 — The §2 comparison table slightly overstates §I uniformity.**
The table's cell "all 10 present under each scenario (I-A1 Political … I-A10 Neighboring peoples)" is accurate for the **Genesis 1** companion (which the Gen 12 file's cross-reference explicitly points to for "the full four-scenario, ten-category" grid), but **chapter-specific** Genesis files carry a *subset*. Verified in Gen 12: Scenario A shows I-A1, I-A2, I-A3, I-A4, and I-A10 (non-contiguous), and I-A10 carries *its own* trailing `**[PEER-REVIEWED — DOCUMENTED]**` + Source in addition to the scenario-level label — so even the "categories mostly share the scenario label" claim has documented exceptions. None of this weakens Option A (it arguably strengthens it: the structure is even less uniform than a clean 10×4 grid, making a mechanical card migration messier). Recommend a one-line footnote in §2: "all 10 in Gen 1; chapter files carry a chapter-relevant subset, occasionally with a category-level label of its own." Documentation-only.

**Minor 2 — Design-system line numbers cited; section citations now confirmed, exact digits immaterial.**
Re-read the full design system this session. The bans are verbatim and sit exactly where the plan says: §6 Layout → Rules ("No card soup — use dividers" / "No nested cards") and §12 Anti-Slop → NEVER USE ("Card soup or nested cards"). So the *section* citations (§6, §12) are correct. The plan also cites precise line numbers (144/145/291); the file carries no inline line numbers, so those exact digits can't be mechanically confirmed and shouldn't be load-bearing. Recommend citing by section rather than line number to avoid drift. Cosmetic — the load-bearing claim (the design system bans card soup + nested cards) is fully verified. *(Addressed 2026-06-08: the plan's §4 now cites by section, not line number.)*

**Minor 3 — §7.3 inline-source-blob count (12) disagrees with `PENDING.md` §3 (8 blobs across Gen 4/9/10/11/12).**
The plan §7.3 says "the 12 currently-inline Genesis blob sources." The project tracker `PENDING.md` §3 says "8 such multi-source blobs across Gen 4/9/10/11/12 × 4 locales" and credits the parser with correctly leaving them inline. The two numbers (12 vs 8) and the chapter spread (all chapters implied vs. specifically Gen 4/9/10/11/12) don't match. This is only load-bearing if the lead chooses Option B/C (where the per-category source-lift in §7.3 actually runs); under the recommended Option A it's moot. Recommend reconciling the count against `PENDING.md` §3 / the EXECUTION_HISTORY "Inline `**Source:**` lift" entry if B/C is ever taken. Documentation-only; does not affect Option A. *(Mechanism confirmed 2026-06-08 by direct read of `enrichment-parser.ts`: `finalizeEntry` lifts a trailing inline citation into the source field ONLY when `markers.length === 1`; the code comment explicitly names "Genesis §I scenario blobs" as the composite case that "keep[s] them inline — they cannot collapse into one source field." So PENDING §3's framing is exactly the parser's behaviour; only the blob *count* is in doubt.)*

### Process note (not a defect)

**§9 template-documentation action is real and worth doing regardless of the Q1 decision.** Verified: the template documents *only* the flat `### [Topic]` §I form, while all three authored books use scenario-grouped §I (Genesis = dating-scenario; John/Matthew = `#### ` sub-dimension). This is a genuine template gap independent of whether Genesis migrates. The Claude Code summary's closing question — "add the §I-variants note now, or bundle into whichever plan is green-lit?" — should be answered: **do it regardless**, since it documents existing reality and prevents a future author from treating the flat template as the only sanctioned form. It is a small, safe, decision-independent doc edit; bundling it behind a migration decision that may never happen leaves the gap open indefinitely.

### Corroboration (added 2026-06-08)

**The project's own tracker independently confirms the plan's central premise.** `docs/audit/PENDING.md` §3 carries an item — "Genesis §I 'scenario' blobs use an older inline structure (low-priority consistency)" — written before this audit cycle, that states the same three things the plan argues: it is **"Not a bug — renders correctly today,"** the categories are authored as `**I-A·n. …**` bold headers inside one flat `### Scenario` entry, and **"the parser correctly leaves these citations inline."** PENDING also frames migration as an optional later "content authoring task," not a fix — exactly the plan's framing. So "don't migrate, it's not broken" is the house position recorded in the forward tracker, not merely this plan's claim. This strengthens the APPROVE / Option A verdict.

---

## What works well

- **The plan does the verification the earlier drafts skipped.** It explicitly walks back three confident-but-wrong agent claims and proves the current §I is compliant before recommending "don't migrate" — exactly the discipline this project's audit workflow exists to enforce. The walk-back is correct on every point.
- **The decisive factor is correctly identified.** Among the reasons to not migrate, the plan correctly elevates the *design-system card-soup ban* as the strongest (a hard project rule), over the softer "reads fine as prose" argument. That is the right ordering.
- **Option C, not B, is correctly named as the only clean route if the lead overrides.** Since Option B repeats a low-information dating badge per card (and the dating label, while a *valid* dual-label, is not per-category informative), C is the only Rule-29-clean migration — and the plan correctly defers it into the Phase-12 Genesis cycle rather than a standalone pass.
- **Governance is complete.** §7 (parser/conservation/Rule-28/architecture), §8 (decision locks + editorial-log schema with correct anchors), and §10 (risks) leave nothing material unaddressed for either branch.

---

## Recommendation

**APPROVE** the plan and **endorse Option A (do not migrate).** The recommendation rests on verified facts — template, design system, Rule 29, and the actual Genesis §I content (both the Gen 1 anchor file and the Gen 12 chapter file read directly this session) all point the same way. Address Minor 1 (one-line §2 footnote distinguishing the Gen 1 full grid from the chapter-file subsets) and, independently of the migration decision, execute the §9 template "§I structural variants" note. If the lead later wants markup parity, Option C deferred into Phase 12 with design sign-off is the correct and only Rule-29-clean path — as the plan states.

*Re-verification note (2026-06-08): the two belt-and-suspenders checks flagged in the prior revision are now closed — the design-system bans were confirmed by full re-read (Minor 2), and the Gen 1 full 4×10 §I grid was confirmed by direct read (Minor 1). A subsequent cross-check against `docs/audit/PENDING.md` added Minor 3 (the §7.3 blob-count discrepancy, B/C-only) and a Corroboration note (PENDING §3 independently confirms "not a bug"). None changes the APPROVE / Option A verdict.*
