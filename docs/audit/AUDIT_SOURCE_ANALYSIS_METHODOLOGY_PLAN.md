# Audit of `SOURCE_ANALYSIS_METHODOLOGY_PLAN.md`

**Date:** 2026-06-02
**Auditor:** Claude Opus 4.8 (independent review)
**Question asked:** "Will this enrich the project?" — plus the usual gap / regression / compliance check.
**Method:** Re-read the plan in full. Verified its load-bearing claims against live files: `src/app/[locale]/rules/page.tsx`, the i18n bundles `en.json` + `es.json`, a representative Spanish companion (`content/es/genesis/study/CHAPTER-1-CONTEXT.md`), plus prior-session reads of CLAUDE.md, README.md, RULES-CORE.md, EXECUTION_HISTORY.md, PENDING.md, and the `genesis_template/` transcripts.
**Status:** Approve. This genuinely enriches the project, low risk. No execution-blockers. Four substantive recommendations + one verification-method tightening before execution.

---

## 1. Headline judgment — does it enrich the project?

**Yes — with clear eyes about *what kind* of enrichment it is.**

This is an **internal-asset and governance** investment, not a reader-facing one. Nothing here changes what a user sees in the app. What it changes:

1. **It converts dormant raw material into a governed, reusable asset.** Today `docs/genesis_template/` holds nine raw ASR transcripts with heavy persona cruft and a misleading name ("template" — they are not templates). They are effectively dead weight: not integrated into governance, not safe to quote, not structured for reuse. The plan turns them into (a) a language-agnostic `METHOD.md` and (b) an organized, anonymized worked-example corpus. That is a real increase in usable project capital.

2. **The method/substance split mirrors the project's own architecture.** This is the strongest design point. The project already separates universal rules (RULES-CORE) from language-specific supplements (RULES-HB / RULES-GS). A universal `METHOD.md` + per-language worked-example corpus is that exact pattern applied to source analysis. It will feel native, not bolted on. The per-language adaptation table (HB / GS / Aramaic hooks per method step) is the elegant, high-value core — it makes the method portable to Greek (when John/Matthew expand) and Aramaic (Daniel/Ezra) without re-derivation.

3. **It closes a latent leakage/provenance risk.** The contributor persona is woven into *substantive* corpus content (the *etz*/"my name means a tree" anecdote), and a credit line sits in RULES-CORE PROJECT METADATA. Nothing leaks to users today (verified — see §2). But raw persona-framed transcripts sitting in `docs/` are a standing regression risk: any future author who quotes them, or any process that surfaces `docs/`, could leak the persona. Formalize + anonymize + lint-guard converts a latent risk into a managed one.

4. **It feeds Phase 12.** A clean, structured HB worked-example corpus is exactly the input that makes Genesis 13–50 authoring faster and more consistent, and gives future contributors (human or AI) one reference for "how source analysis is done here."

**The honest caveat:** this is ~5–8 h of foundation work competing against reader-facing work (Phase 12 content, the deferred Section I audit, the prophecy decision, Tier-2 propagation). It enriches the project's *foundations*, not its *output*. That is worth doing — but the *sequencing* against reader-facing work is a project-lead call, not a technical one. If the method is going to be leaned on for Phase 12 and for GS/Aramaic, doing it before Phase 12 is the right order. If Phase 12 is HB-only and imminent, this could reasonably slot just after.

---

## 2. Verification of the load-bearing claim (user-invisibility)

The whole plan rests on one guarantee: **no contributor name or persona reaches users.** I verified the highest-risk surfaces independently rather than trust the asserted sweep.

| Surface | Result | How verified |
|---|---|---|
| `/[locale]/rules` route reads rules docs at runtime? | **No** — fully i18n-driven (`t("landing.*")`, `t("rule*")`); never imports RULES-CORE | Read `src/app/[locale]/rules/page.tsx` in full |
| → therefore PROJECT METADATA credit user-exposed? | **No** — not rendered anywhere; future-regression risk only | Same |
| `en.json` master bundle | **Clean** — no name, no persona markers, no `elan` substring | Read in full |
| `es.json` bundle | **Clean** — same | Read in full |
| Spanish companion prose (`es/.../CHAPTER-1-CONTEXT.md`) | **Clean** — institutional voice, no name, no persona | Read in full |
| Name woven into corpus *substance* (not just framing) | **Confirmed** — *etz*/Elan tree anecdote + "Elan Ramon" (astronaut, a *different* person) | Prior-session read of `genesis11-13.md` + `hebrew-grammar.md` |

The plan's claim holds on every surface I checked. The plan also correctly flags the subtle part: the name is woven into substance, so Step 3 must **rewrite, not blind-delete** (deleting the token would damage the *etz* example and mishandle the unrelated astronaut). That is the single highest-care execution step and the plan gets it right.

---

## 3. The one thing to fix in the verification method (do before execution)

**The plan describes its leakage grep two different ways, and the checklist version is the loose one.**

- Step 0 and Step 8 (prose): "Re-run the exact-token (`\bElan\b`) + persona-marker grep" — correct, word-boundary.
- Validation checklist (pre-commit): `grep -ri "elan" content/ src/ → zero matches` — case-insensitive **substring**.

These are different commands with different match sets. The substring form risks false positives on ordinary word-forms — e.g. Spanish `revelan` / `anhelan` / `desvelan` (…v**elan**, anh**elan**), English `Cleveland`. If the executor runs the checklist form at Step 8, sees a "match" from `revelan` in some Spanish file, they could either raise a false alarm or — worse — "fix" legitimate text.

**Fix:** make the checklist match the prose. Use a word-boundary, case-sensitive token scan for the name (`grep -rnE "\bElan\b" content/ src/`) plus a **separate** persona-marker scan (the persona markers — "subscribe", "my channel", "native hebrew speaker", etc. — are the higher-signal check anyway, since the bare name could legitimately appear as "Elan Ramon" in a way the name-token check shouldn't fixate on). This gives a clean zero-or-not signal. Not a blocker — but it is exactly the kind of loose-grep that produces a confusing execution moment, and it is a 1-line fix.

---

## 4. Substantive recommendations (refinements, not blockers)

### R1 — Choose Q3 = C (distill to structured notes), not A (light cleanup) — *if* this is meant to feed Phase 12
The plan recommends A (light prose cleanup) as the floor and notes C (distill each file to structured per-verse notes: lexeme · root/morphology · semantic range · cross-textual attestation · traditional-translation contrast · uncertainty) is higher-value. My view: two of the plan's own justifications are "feeds Phase-12 authoring" and "ports to GS/Aramaic." Lightly-cleaned ASR prose serves neither well — nobody will actually consult de-cruft-ed transcript prose. The structured-notes form is dramatically more reusable and is the thing that makes the corpus worth keeping. If the corpus is worth relocating at all, it is worth distilling. Recommend **C**, with the option to stage it (A now as a safety move, C as the immediately-following pass) if the 5–8 h envelope is tight.

### R2 — Point Aramaic *substance* at RULES-HB.md, per the project's own architecture
The plan creates a parallel `aramaic/` corpus dir (fine for worked examples) and the `METHOD.md` table treats HB / GS / Aramaic as three peers. But in this project's architecture **RULES-HB.md is the Hebrew *and* Aramaic supplement** (it carries the §Aramaic Appendix); there is no separate Aramaic ruleset. So: the *worked-example corpus* for Aramaic can live in `aramaic/`, but the *rules/substance home* is RULES-HB.md §Aramaic Appendix. The adaptation table and the `aramaic/README.md` stub should say so, rather than imply a future parallel RULES-Aramaic file. Minor architecture-consistency point that keeps the method doc honest about where Aramaic governance actually lives.

### R3 — Fold the PROJECT METADATA scope-staleness fix into the same Q4 edit
Q4 already opens the RULES-CORE PROJECT METADATA section to reword the credit line. That section also carries a stale scope statement (it reads as an earlier Genesis range, e.g. "1–9 drafted," while actual scope is Genesis 1–12 + John 1–3 + Matthew 1–3). Since the section is already being touched under an emergency amendment, correct the stale scope line in the same edit — opportunistic, near-zero cost. *(Flagged from a prior-session read of RULES-CORE.md; verify the exact current wording at execution time before editing.)*

### R4 — Make `METHOD.md` encode the living-language-comparand caution as *semantic*, not just *scope*
The method's "living-language comparand" step (Modern Israeli Hebrew for HB) is a genuinely useful hypothesis-generator and one of the contributor's better moves. But `METHOD.md` should state plainly that a living-language comparand **generates hypotheses, never evidences meaning** — Modern Hebrew carries 2,000+ years of semantic drift, and treating it as authoritative for Biblical Hebrew would import anachronistic meaning (against the spirit of Rule 3). The plan currently frames this only as "HB-only, not universal" (a *scope* caution). The more important caution is *epistemic*. Encoding it in the method means the discipline travels with the method. (Same caution, even stronger, for any Modern/Patristic Greek or Neo-Aramaic comparand — the plan already flags those as "with caution"; tie that caution to Rule 3 explicitly.)

---

## 5. Compliance check (architecture / governance) — clean

- **DDD / code:** Content-and-docs only. No `src/` changes, no domain types, no parser changes, no new dependencies. `pnpm test` stays 819 (no new tests — correct; this is not parser-touching work). Build/lint unaffected. ✓
- **Lock Protocol (Q4):** Touching locked RULES-CORE is justified and meets the emergency-amendment criteria (additive pointer + factual metadata reword; no rule modified; no signed-off verses). **Condition:** run it through the same discipline as the v3.3.1 / v3.3.2 precedents — author a proposal file under `docs/rules/proposals/` and add a CHANGELOG entry — not an inline edit. The plan implies this but should state it in Step 4. ✓ with condition.
- **Rule 28 (provenance / review):** Q2=A keeps a single internal provenance line (audit honesty) while removing user exposure — the right balance. Any GS worked example stays AI-draft pending a Hellenist (Q5) — correct; the project has no Greek contributor, so inventing Greek substance would violate Rule 28. ✓
- **Rule 29 / Rule 3 (companion discipline):** The "REJECTED — never quote corpus prose into user-facing companions" row is the correct hard line. The leakage guard (§0.13, warn-only, scoped to `content/` + `src/` only, never `docs/source-analysis/`) is the right mechanism and the right scope — it must not fire on the legitimate internal "Elan Ramon"/provenance retained in the corpus. ✓
- **`§0.13` free:** consistent with the §0.1–§0.12 range established across the recent sweeps. Verify at execution time by reading `content-lint.sh` (cheap). ✓

---

## 6. What works well

- Diagnosis is accurate: the two-asset split (method vs. substance), the architecture mirror, and the "rewrite not delete" nuance are all correct and well-reasoned.
- The decision questions (Q1–Q8) are framed as genuine project-lead choices with honest trade-offs, and the recommendations are defensible.
- Risk table is candid and the mitigations are real (lint guard, internal-only notice, REJECTED row, emergency-amendment scoping).
- The user-invisibility guiding principle is stated as a hard gate, and the plan consistently picks the lower-leakage option when a choice arises.
- Unlike several earlier plans in this project, this one has **no execution-blocker** — no type error, no silent parser-drop, no broken cross-reference. It is a clean, low-risk plan. Saying so plainly is itself useful signal: the care shows.

---

## 7. Required conditions before execution

1. **Tighten the verification command (§3):** make the validation-checklist grep match the Step 0/8 prose — word-boundary, case-sensitive name token + a separate persona-marker scan. (1-line fix; prevents a confusing false-positive at Step 8.)
2. **Q4 via the amendment discipline (§5):** proposal file in `docs/rules/proposals/` + CHANGELOG entry, not an inline RULES-CORE edit. Fold in the stale-scope fix (R3) while there.
3. **Decide Q3 = C vs. A (R1):** if the corpus is meant to feed Phase 12 / GS / Aramaic, distill (C); otherwise A is an acceptable floor. A project-lead call, but C is the higher-value answer given the plan's own justifications.

Everything else (R2, R4) is a refinement that can be absorbed during execution.

---

## 8. Recommendation

**Approve.** This enriches the project — it turns dead raw material into a governed, portable method asset, mirrors the existing CORE→HB/GS architecture, and closes a latent persona-leakage risk, all at low risk and with no execution-blocker. Lead the execution with the anonymization-by-rewrite care the plan already identifies, run Q4 through the proposal/CHANGELOG discipline, tighten the one loose grep, and decide Q3 depth against whether Phase 12 will actually lean on the corpus. The verification of user-invisibility holds on every surface checked.

The only judgment that is genuinely yours, not technical: whether this foundation work comes before or after the next tranche of reader-facing content. It is worth doing either way.

---

**Audit complete.** User-invisibility claim independently verified on the rules route, both checked i18n bundles, and a representative Spanish companion — all clean. Findings are refinements, not blockers.

---

## Post-verification addendum (2026-06-02, second pass)

Full filesystem access this pass closed the two items the first pass had left as "verify at execution time." Both are now confirmed against the live files, and one finding is materially stronger than first estimated.

### A1 — §0.13 is confirmed free (Q7 guard numbering holds)

Read `scripts/content-lint.sh` in full. Active rule IDs: §0.1, §0.2, §0.3, §0.4, §0.5, §0.6, §0.7 (used for both 0.7a and 0.7b), §0.8, §0.10, §0.11, §0.12. (§0.9 is explicitly folded into §0.2 by a comment.) **§0.13 is the next free ID — the plan's Q7 claim is correct.**

More useful: the existing **§0.12** rule (`check_cross_book_pointers`) is a working, in-tree model for exactly the kind of guard Q7 proposes — a warn-only `perl -ne` scan with an inline allow-list, emitted via `emit_warn`, scoped to specific file globs. The §0.13 leakage guard should be built in that mold: warn-only, persona-marker + `\bElan\b` word-boundary scan, scoped to `content/*` and `src/*` globs only (never `docs/source-analysis/`). This makes R-item §3's "separate persona-marker scan" concrete — it can reuse the §0.12 perl/emit_warn skeleton almost verbatim. The plan's §0.13 should also register any legitimate-but-matching case (none expected in content/+src/, since those surfaces are already clean) through the existing `scripts/lint-allowlist.txt` mechanism the script already supports.

### A2 — R3 confirmed, and the PROJECT METADATA staleness is broader than first estimated [strengthened]

Read `RULES-CORE.md` in full. The §PROJECT METADATA block is stale in **three** places, not just the one scope line the first pass guessed at:

- `**Status:** Genesis 1–9 drafted in all four languages; awaiting reviewer sign-off.`
- `**Completed:** Genesis 1–9 EN, PT-BR, DE, ES (drafts). Luther: Option B. Reina-Valera: Option B. YHWH: Option A (consonantal).`
- `**Pending:** Genesis 10+ in all languages / … / Greek Scriptures expansion (RULES-GS.md)`

Actual current scope (per CLAUDE.md + README): Genesis 1–12, John 1–3, Matthew 1–3 in all four locales, with John PEOPLE.md, Book Context, prophecy, and the v3.3.1/v3.3.2 amendments all landed. So the block understates scope (Genesis 1–9 → 1–12), omits John + Matthew entirely, and lists already-completed work ("Genesis 10+", "Greek Scriptures expansion (RULES-GS.md stub created)") as pending.

The credit line the plan targets — `**Source Analysis:** Video transcripts by Elan (Hebrew speaker)` — is confirmed verbatim, and is the sole internal-doc occurrence of the name besides the plan and this audit.

**Implication for R3:** since Q4 is already opening this exact block under the emergency-amendment, the reword should refresh all three stale lines (Status / Completed / Pending) in the same edit, not only the scope phrase. Near-zero marginal cost; leaves the metadata block actually accurate instead of half-fixed. This does not change the verdict — still APPROVE — but it converts R3 from "opportunistic scope tidy" into "the metadata block is materially stale and should be brought current while it's open."

### A3 — one small caution the first pass didn't flag

The §PROJECT METADATA block also carries `**Audit trail:** External audits performed 2026-04-15 …, 2026-04-25 …`. If the Q4 edit refreshes this block, resist the temptation to turn it into a running audit log (the same anti-pattern CLAUDE.md's own update-protocol warns against for its Verified-state snapshot). Keep it a compact pointer; the detailed trail lives in `EXECUTION_HISTORY.md`. Minor — just don't let an opened metadata block grow into a changelog.

### Net

No change to the verdict. The plan still **enriches the project, low risk, no execution-blocker.** The second pass hardened R3 (three stale lines, not one), made the §3 grep-tightening and Q7 guard concrete by pointing at §0.12 as the working template, and added one small "don't grow the metadata block" caution. Required conditions 1–3 stand as written; R3 is now slightly higher-value than first stated.
