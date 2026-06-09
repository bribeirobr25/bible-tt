# Audit — PATTERN_C_BESPOKE_RESIDUAL_PLAN.md

**Date:** 2026-06-08
**Auditor:** Claude Opus 4.8 (independent review)
**Plan reviewed:** `docs/audit/PATTERN_C_BESPOKE_RESIDUAL_PLAN.md` (rev. 2026-06-07)
**Method:** Verified every load-bearing rule cross-reference against primary sources, not the plan's self-report or the Claude Code summary. Read in full this session: `docs/rules/RULES-CORE.md` (complete — Rule 2, Rule 13, Rule 17 v3.2 name policy, Rule 29, Glossary Expansion Procedure, Idiom Policy), `docs/editorial-log/matthew.md` (complete — M-004 verified), `docs/editorial-log/john.md` (complete — egeneto-absence verified), `docs/editorial-log/transliteration-decisions.md` (complete — toledot + scope verified), `docs/guides/HOW-TO-READ-TT.md`, and the markdown-parser overview-slice handling (verified in the prior implementation audit).
**Status:** ✅ **APPROVE the plan.** Every rule cross-check is accurate against the actual rule text and editorial logs. The plan correctly confines scope, conforms to logged decisions rather than re-deciding them, and separates the Rule-2/Rule-13 trap correctly. **One Significant finding added on 2026-06-08 (scope reconciliation vs. `PENDING.md` §5) — does not change the verdict but should be resolved before execution.** Other findings Minor/process.

---

## Executive summary

This plan finishes the deferred Pattern C residual: ~80 grammar/wordplay-sensitive non-EN terms in the **chapter-overview slice only** that mechanical glossing would corrupt. It is editorial work, correctly gated behind a plan + lead sign-off. I verified each governing-rule claim against the primary sources, because that is exactly where a plan like this can go subtly wrong — and every one holds:

- **Name boundary (§3.1):** transliteration-decisions.md states verbatim that it "governs technical terms… not proper names," and Rule 17 v3.2 carries the name policy. The plan's "names out of scope, follow Rule 17" is accurate.
- **Conform-to-log (§3.2):** **M-004** is verified verbatim — *angelos kyriou* is a formulaic narrative phrase, not an OT quotation, no YHWH apparatus. **toledot** is verified — main text renders "generations," transliteration only in notes. The plan's instruction to *conform, not re-decide* is correct.
- **egeneto (§3.2):** verified — the John log has **no** egeneto entry, so the plan's "add a John entry if treated specially" is the correct instruction, not a misstatement.
- **HB/GS split (§3.3):** correct — the Greek terms cite RULES-GS, Hebrew cite RULES-HB, consistent with the layered ruleset architecture.
- **Rule 2 vs Rule 13 (§3.4):** correctly separated — Rule 2 = both-senses (slash/both-senses phrasing), Rule 13 = probable + signpost (no slash). The plan applies this distinction correctly to *bene ha-elohim*/*nivrekhu*/*pneuma* (Rule 2) vs *yadon* (Rule 13).
- **Italics (§3.5):** consistent with Rule 4 (transliteration italics) and Rule 11 (grammatical-addition italics) — a glossed plain word is neither, so no italics. Correct.

The Claude Code summary's description of what it tightened is accurate. Approve.

---

## Verification table

| # | Plan claim | Result | Evidence (verified this session) |
|---|---|---|---|
| 1 | §3.1 — log governs technical terms, not proper names; names follow Rule 17 v3.2 | ✓ | transliteration-decisions.md header verbatim: "governs **technical terms**… not proper names. Proper names… governed by the v3.2 Name Rendering Policy." Rule 17 carries the policy. |
| 2 | §3.2 — M-004 classifies *angelos kyriou* as formulaic narrative, not OT quotation, no YHWH apparatus | ✓ | matthew.md M-004 verbatim: "formulaic narrative phrase echoing LXX/HB מַלְאַךְ יהוה, NOT a direct OT quotation. It does NOT trigger Option C's YHWH note requirement." |
| 3 | §3.2 — *toledot* renders "generations" in main text; gloss must be consistent | ✓ | transliteration-decisions.md: "תּוֹלְדוֹת → 'generations' (not *toledot*)… Transliteration appears in the note as *toledot* for reference." |
| 4 | §3.2 — John log has no *egeneto* entry; add one if treated specially | ✓ | john.md read in full (J-001…J-032): no *egeneto* rendering/transliteration decision entry exists. (J-024 J-M1 references it as a wordplay motif in CONTEXT.md, but that is not a rendering decision.) Instruction is correct. |
| 5 | §3.3 — Greek terms → RULES-GS; Hebrew → RULES-HB | ✓ | Consistent with RULES-CORE layered architecture (Rule 8/9/25/26 delegate to supplements). *egeneto/ti emoi kai soi/gynai/angelos kyriou/pneuma* are GS; the Genesis terms are HB. |
| 6 | §3.4 — Rule 2 (both senses) vs Rule 13 (probable + signpost) are distinct | ✓ | Rule 2 "preserve both… slash"; Rule 13 confidence levels (Probable/Possible/Uncertain). The plan correctly assigns *bene ha-elohim*/*nivrekhu*/*pneuma* to Rule 2 and *yadon* to Rule 13 (not a slash). |
| 7 | §3.4 — guide supports both-senses ("the TT does not choose for you") | ✓ | HOW-TO-READ-TT.md: "wind/spirit… The TT does not choose for you." |
| 8 | §3.5 — glossed plain word gets no italics; transliteration pair keeps `*…*` only where EN does | ✓ | Consistent with Rule 4 (italicize transliterations) + Rule 11 (italicize grammatical additions); a plain gloss is neither. |
| 9 | §3.6 — glossary-expansion guard (3+ occurrences or theologically loaded) | ✓ | RULES-CORE §Glossary Expansion Procedure §G1 threshold verbatim: "3 or more times… OR… theologically loaded." Plan invokes it correctly as a guard, not the default path. |
| 10 | §8 — chapter-overview conservation = 72 units (18 chapters × 4 locales) | ✓ | Consistent with the conservation gate's `chapter-overview` kind (verified in the implementation audit; overview is one unit per chapter file). |
| 11 | §2 — terms confined to the overview slice; header per locale | ✓ | markdown-parser `OVERVIEW_SECTIONS` set matches the cited localized headers (`VISÃO GERAL DO CAPÍTULO`/`KAPITELÜBERSICHT`/`VISIÓN GENERAL DEL CAPÍTULO`). Overview-slice confinement is enforceable. |
| 12 | §8 — design §5/§10 N/A (overview = prose, not badges/cards) | ✓ | Overview renders as prose via `ChapterShell` (`renderMarkdownSafe`), not the enrichment card path; no color-token/icon implication. |
| 13 | §2 — term list is complete (17 groups; counts PT 26 / DE 25 / ES 29) | ✗ | See Significant 1. `PENDING.md` §5's deferred-residual list includes four terms absent from the §2 table: *nacham*, *anothen*, *en*, *egeiro*. *anothen* is already a logged Rule-2 slash (J-010). |

---

## Findings

One Significant finding (scope reconciliation, added 2026-06-08); no Critical. Every rule cross-reference is accurate.

### Significant

**Significant 1 — The §2 scope table omits four terms that the project's own tracker (`PENDING.md` §5) lists as part of this exact deferred residual.**
The plan's §2 table enumerates 17 term-groups and anchors its occurrence counts (PT 26 / DE 25 / ES 29; "~80" total) to that table. But `docs/audit/PENDING.md` §5 — the single forward-looking tracker, which describes the *same* deferred Pattern C residual — lists a **broader** set. Comparing the two directly, PENDING §5 names four terms absent from the plan's §2 table:

| Term | In PENDING §5 deferred list | In plan §2 table | Note |
|---|---|---|---|
| *nacham* ("comfort/regret" wordplay, Genesis) | ✓ | ✗ | HB wordplay term — same class as *arum/arom* |
| *anothen* ("from above/again", John 3) | ✓ | ✗ | **Already a logged slash term** (john.md J-010, Rule 2) — conform-to-log applies |
| *en* (Greek copula "was/being", John 1 prologue) | ✓ | ✗ | GS; prologue-weighted like *egeneto* |
| *egeiro* ("raise") | ✓ | ✗ | GS verb |

(PENDING's "*ruach elohim*" maps to the plan's *pneuma/ruach* + the Gen 1:2 *ruach* and is arguably covered; the four above are genuinely missing.) This matters for two reasons: (1) if four terms are missing from the table, either the stated counts are wrong or those terms silently fall outside the pass — an executor working from §2 would under-scope; (2) ***anothen*** specifically is already an editorial-logged Rule-2 slash decision (J-010), so it triggers the plan's own §3.2 conform-to-log discipline and must not be re-decided — exactly the trap §3.2 exists to prevent, but the term isn't in the table to be caught. **Recommendation:** reconcile §2 against PENDING §5 before execution — either add the four terms (with *anothen* explicitly flagged as conform-to-J-010) or state in §2 why each is out of scope. This is a scope-completeness fix, not a method defect; the plan's *approach* handles these terms correctly once they're listed. Verdict remains APPROVE.

### Minor

**Minor 1 — *pneuma* corpus tag is mixed (correctly handled, worth a one-word fix in the §2 table).**
The §2 table tags *pneuma (/ ruach)* as "**GS**/HB". This is right — Matt 3's *pneuma* is GS, the *ruach* cross-supplement link is HB — and §3.3 already says to "cite the correct ruleset per term." But because *pneuma/ruach* is the one genuinely cross-supplement entry, the editorial-log entry for it should cite **both** RULES-GS (primary, Matt 3) and the RULES-CORE Rule 16 cross-supplement-alignment clause (Hebrew *ruach* / Greek *pneuma* coordination), not GS alone. RULES-CORE Rule 16 explicitly names this exact pair. One-line clarification in §7's per-term log guidance; not a defect.

**Minor 2 — "ships provisional… ~half a day" estimate is reasonable but Rule-28 cross-alignment is the real gate.**
The §10 estimate (~half a day) is plausible for the edit volume, but the binding constraint is §8's "cross-alignment review mandatory when locales change" (Rule 28). Since this pass changes PT/DE/ES overview wording for ambiguity-bearing and wordplay terms, the cross-alignment reviewer (Rule 16 checklist) is the gate that matters before these leave `provisional`. The plan says this; just flagging that the half-day is the *authoring* cost, not the *clearance* cost. No change needed.

### Process note (shared with the Genesis §I audit)

The template "§I structural variants" gap is **not** this plan's concern (Pattern C is overview prose, not §I), but both plans surface it. It should be executed independently of either plan's decision — see the Genesis §I audit's process note.

---

## What works well

- **Conform-to-log discipline is the plan's spine, and it is correct.** The single most error-prone thing a residual-glossing pass can do is silently re-decide a term that already has a ruling. The plan explicitly subordinates itself to M-004 (*angelos kyriou*), the *toledot* decision, and the name policy — all three verified — and flags *egeneto* as needing a *new* entry precisely because none exists. This is exactly right.
- **The Rule-2/Rule-13 separation is handled with real understanding.** Treating *yadon* as Rule-13 "probable + signpost" rather than slashing it like a Rule-2 ambiguity is a subtle, correct distinction that a mechanical pass would get wrong. The plan calls it out explicitly (§3.4) and guards it in §9 risks.
- **Scope confinement is enforceable, not just asserted.** The overview-slice-only boundary maps to a real parser section (`OVERVIEW_SECTIONS`), and the conservation gate (chapter-overview = 72) + git-scoped confinement check will catch any leak into main text/notes. This is the same harness that caught the `Galiläaäa` accent-boundary corruption in the earlier Pattern C pass — a demonstrated, working safety net.
- **EN-parity principle is sound and reduces editorial risk.** Porting the already-made EN overview decision into PT/DE/ES (adjusted for grammar) rather than re-deciding per locale is both faster and less drift-prone, and it aligns with Rule 16/17. The decisions to lock (P-C2-Q1…Q4) are framed as "mirror EN" defaults, which is the conservative correct call.
- **Italics policy is precisely stated.** §3.5 correctly distinguishes a glossed plain word (no italics) from a Rule-4 transliteration or a Rule-11 grammatical addition (italics), and warns not to touch local Rule-11 italics. This is the kind of detail that, gotten wrong, produces exactly the redundancy the prior pass had to clean up.

---

## Recommendation

**APPROVE** the plan. Its rule cross-references are accurate against the actual rule text and editorial logs; its scope is correctly confined; its conform-to-log discipline is correct and verified (M-004, toledot, name boundary, egeneto-absence all check out). **Before execution, resolve Significant 1: reconcile the §2 term table against `PENDING.md` §5 (add *nacham*, *anothen*, *en*, *egeiro* or justify their exclusion; flag *anothen* as conform-to-J-010).** Lock P-C2-Q1…Q4 at the recommended "mirror EN" defaults. Address Minor 1 (cite Rule 16 cross-supplement for the *pneuma/ruach* log entry) when authoring. Ship `provisional`; the Rule-28 cross-alignment review is the gate before sign-off. The `egeneto` John-log entry should be authored only if the pass actually gives *egeneto* special overview treatment — if it ends up plainly glossed like the others, no new entry is needed.

*Re-verification note (2026-06-08): every load-bearing rule cross-reference (Rule 2, Rule 13, Rule 16, Rule 17, Rule 29, Glossary Expansion §G1, M-004, toledot, egeneto-absence, name-boundary scope) was confirmed against primary sources at first writing. The two belt-and-suspenders checks closed for the companion Genesis §I audit (design-system bans by full re-read; Gen 1 full 4×10 §I grid by direct read) do not bear on this plan, which operates on the chapter-overview prose slice, not §I. A subsequent cross-check against `PENDING.md` §5 surfaced Significant 1 (the four-term scope gap) — the one open item before execution; it does not change the APPROVE verdict.*
