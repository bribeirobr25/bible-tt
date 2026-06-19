# Audit — PLAN_DUAL_LABEL_SSOT.md

**Date:** 2026-06-19
**Auditor:** Claude Opus 4.8 (independent review)
**Plan reviewed:** `docs/audit/PLAN_DUAL_LABEL_SSOT.md` (status: DRAFT — self-audited §13; awaiting external audit + sign-off)
**Mandate:** verify no regression, content-meaning change, content loss, or rule/DDD/DRY compliance issue — against the actual source, not the plan's self-report or its §12/§13 self-audit.
**Method:** Read directly this session: `domain/content/types.ts`; all 5 content parsers (`enrichment-parser`, `book-context-parser`, `prophecy-parser`, `people-parser`, + the introduction path inside enrichment); the 3 UI files (`claim-badge.tsx`, `person-card.tsx`, `prophecy-view.tsx`); and the full `content/en/genesis/PEOPLE.md` (the richest people file) to test the load-bearing "people only ever sees DOCUMENTED" claim against real content. Re-derived the cross-parser divergences and the confidence check-order by hand. Could not run the gate (no shell), so the R1 resolved-value-diff figure is taken on report — but its decisive cases were re-checked against source.
**Status:** ✅ **APPROVE — accurate, honestly self-audited, low-risk.** Every structural claim checks out against source: the divergences are real and correctly characterized, the canonical-is-enrichment choice is right, the UI maps are byte-identical, and the "all divergence is latent → 0 resolved-value change" thesis holds on the file most likely to break it. Two refinements (one a sharper statement of the people-curiosity residual the plan already half-names; one a tiny UI-fallback note). None blocks.

---

## Executive summary

This plan is correct where it matters and unusually honest about its own risk. The architecture audit it derives from is accurate: there genuinely are 4 divergent `parseConfidence`, 3 divergent `parseClaimType`, duplicated `CLAIM_TYPES`/`CONFIDENCE_LEVELS` arrays in `people-parser`, and divergent dual-label extraction regexes. I verified each against source. The consolidation target (`domain/content/labels.ts` beside the existing `ConfidenceLevel`/`sortByConfidence`) is the right DDD home, and the "canonical = enrichment-parser (the richest)" choice is correct — enrichment is a strict superset of the others' alias sets.

The plan's whole safety case rests on one empirical claim: **every divergent token appears only on a surface whose responsible parser already resolves it correctly, so merging to the richest canonical changes 0 resolved values.** I stress-tested the weakest link — the `people-parser`, whose `parseConfidence`/`parseClaimType` differ from the canonical in *match structure and check order*, not just aliases — by reading the entire Genesis `PEOPLE.md`. Result: confirmed. `people`'s `parseConfidence` is invoked only via the `regionsByText` path with the literal `DOCUMENTED`, and `parseClaimType` is never invoked there at all (no curiosity blocks exist). The plan's §12/§13 claim holds on the hardest file.

The one thing I'd sharpen: the plan treats "people only ever sees DOCUMENTED" as settled, but it's an empirical property of *current* content that the merge makes *load-bearing* (because the merged parser adopts the canonical check-order, which differs from people's). That's fine — it's exactly what the R1 resolved-value diff gate guards — but it deserves to be stated as the residual it is, not folded away.

---

## Verification table (plan claim vs. source)

| # | Plan claim | Verified? | Evidence |
|---|---|---|---|
| 1 | `parseConfidence` ×4, `parseClaimType` ×3 (+ array-driven people variant) | ✓ | enrichment, book-context, people each define both; prophecy defines `parseConfidenceLabel` only (no claim parser — readings carry confidence only). Exactly as stated. |
| 2 | enrichment is the richest (canonical) | ✓ | enrichment claim parser uniquely has `KOMPARATIV`, ASCII `ARCHAOLOGISCH`/`SPATERE REZEPTION`/`RECEPCION`, `CIENTÍFICO`, `SPECULATIVE→SPECULATION`; confidence parser uniquely has ASCII `MOEGLICH`/`MOGLICH`, `UNGEWISS`. Strict superset confirmed. |
| 3 | book-context omits those claim aliases | ✓ | Its `parseClaimType` lacks `KOMPARATIV`, the ASCII/extra archaeological + reception + scientific aliases, and `SPECULATION`'s `SPECULATIVE` alias. As stated. |
| 4 | people defaults confidence `UNCERTAIN` (vs `POSSIBLE`), claim `TEXTUAL` | ✓ | `people.parseConfidence` final `return "UNCERTAIN"`; canonical returns `POSSIBLE` (+warn). Real divergence. |
| 5 | people redeclares `CLAIM_TYPES`/`CONFIDENCE_LEVELS` | ✓ | Both arrays literally redeclared; derivable from the `types.ts` unions. |
| 6 | Dual-label extraction regexes diverge on dash set (Finding 3) | ✓ | enrichment `LABEL_LINE` = `—|--`; `INLINE_LABEL` = `—|--|–`; book-context `CLAIM_LINE` = `—` only. Three different dash sets — divergence confirmed *even within enrichment itself*. |
| 7 | `–` en-dash variant is latent (0 content uses it) | ◑ | Consistent with the dual-labels I saw (all use `—` em-dash). Not exhaustively grep-verified across all files (no shell), but the diff gate covers it. Low risk. |
| 8 | `parseOriginType`/`parseHistoricityStatus` distinct, out of scope | ✓ | `HistoricityStatus` adds `LITERARY`; separate function; correctly excluded. Genesis PEOPLE uses `LITERARY`/`UNCERTAIN` historicity — would be **wrong** to route through ConfidenceLevel. Good catch keeping them separate. |
| 9 | `types.ts` hosts unions + sort → labels.ts belongs in domain | ✓ | `types.ts` has `ConfidenceLevel`/`ClaimType` unions + `CONFIDENCE_SORT_ORDER` + `sortByConfidence`. DDD home is correct; `infrastructure → domain` import is legal. |
| 10 | UI tone maps byte-identical (claim-badge vs person-card) | ✓ | `CONFIDENCE_BADGE_COLORS` === `CONFIDENCE_TONE`, all 6 members identical. Pure dedup. |
| 11 | `CONFIDENCE_KEYS` identical in claim-badge & prophecy-view | ✓ | Identical 6 mappings. The "earlier differ was a grep artifact" is correct. |
| 12 | person-card curiosity badge shows raw enum (the one visible change) | ✓ | `CuriositiesBlock` renders `{c.claimType}`/`{c.confidence}` with **no** `t()`; `<ClaimBadge>` translates. Adoption → raw→i18n. Correctly the only intended visible change. |
| 13 | i18n keys exist in all 4 locales | ◑ | `claim-badge` already uses `claimType.*`/`confidence.*` in production, so they must exist; the plan says it verified all 4. Accepted (not re-read here). |
| 14 | "people only ever sees DOCUMENTED (region path); no curiosity Confidence/Claim fields" | ✓ (verified on all 3 EN files) | Read all of `en/genesis`, `en/matthew`, `en/john` PEOPLE.md: zero `### Curiosities` / `#### ` blocks in any; only confidence-bearing fields are `Historicity status:` (→ historicity enum, out of scope) and `Regions by text:` (→ `parseConfidence("DOCUMENTED")`). `parseClaimType` never invoked on the people surface. See Finding 1 (residual) + Finding 2 (in-field labels bypass parsers — strengthens the claim). |
| 15 | R1 resolved-value diff = 0 | ◑ | Re-derived decisive cases by hand (people=DOCUMENTED-only; book-context uses only universally-recognized tokens; prophecy has `MÖGLICH` umlaut). Consistent with 0. The actual script run vs real TS is the executor's gate. |

---

## Findings

### Significant-ish (a residual to state plainly, not a defect)

**Finding 1 — the people-curiosity path is the one place the merge's check-order change could flip a value; the plan relies on it being empty but should name that as the gated residual.**
This is the subtle heart of the plan. `people`'s `parseConfidence` differs from the canonical not only in aliases but in **check order**: people checks `DOCUMENTED` *before* `SPECULATIVE`/`UNCERTAIN`, whereas the canonical (enrichment) checks `…UNCERTAIN → SPECULATIVE → DOCUMENTED`. For a single-bucket label the order is irrelevant; it only matters for a string that contains two bucket keywords. The merged parser adopts the canonical order (correctly — §3a's order-preservation requirement protects the 4 PROBABLE-vs-UNCERTAIN range labels). So:

- Where is people's `parseConfidence` reachable with author-controlled text? Two paths: (a) `regionsByText` — but that's constrained to the `(verse, CONFIDENCE)` micro-syntax and resolves `DOCUMENTED` in all current content; (b) **the curiosity `**Confidence:**` field** — which is fully author-free-text and routes through people's `parseConfidence`.
- I verified path (b) is **unused** across all three EN files (`genesis`, `matthew`, `john` PEOPLE.md — no curiosity blocks at all). The plan claims this holds across all 13 PEOPLE.md files; the non-EN files (de/es/pt-br) mirror the EN structure by the project's parallel-authoring discipline, and the R1 diff covers any deviation. So the residual is now verified on the entire EN surface, not just Genesis — but it remains a content-dependent property the merge makes load-bearing, so it should still be named explicitly.

**Recommendation:** keep the plan as-is (the R1 resolved-value diff is exactly the right gate, and it runs the *old responsible parser vs new* per entry — so if any curiosity Confidence field exists anywhere, it surfaces as a reviewed diff, not a silent flip). But state explicitly in §5/R1 that *"if the R1 diff is non-zero, the most likely source is a people-curiosity `Confidence` field hitting the people-vs-canonical order/default difference — enumerate and review before proceeding"*, so the executor knows what a non-zero diff means rather than treating it as noise. Also worth a one-line `labels.test.ts` case asserting a curiosity-style confidence string resolves identically under old-people-order and new-canonical-order for any multi-bucket value that exists (or a note that none do).

### Minor

**Minor 1 — `<ClaimBadge>` adoption shifts the curiosity badge's *unreachable* fallback from UNCERTAIN-tone to POSSIBLE-tone.** `CuriositiesBlock` today falls back to `CONFIDENCE_TONE.UNCERTAIN` for an unmapped confidence; `ClaimBadge` falls back to `CONFIDENCE_BADGE_COLORS.POSSIBLE`. Since every `ConfidenceLevel` member is mapped, the fallback is unreachable, so this is a non-issue in practice — but note it in the plan so the MCP visual check isn't surprised, and so nobody "fixes" the fallback thinking it's a regression.

**Minor 2 — Finding 3's `parseDualLabel` must preserve enrichment's two-regex behavior, not collapse it.** enrichment deliberately uses *two different* extractors: `LABEL_LINE` (own-line, `—|--`) for the authored claim/confidence line, and `INLINE_LABEL` (`—|--|–`) only to *strip* stray inline label tags from body text in `finalizeEntry`. These do different jobs. When unifying to one `DUAL_LABEL` regex + `parseDualLabel`, make sure the *stripping* path keeps the wider `–` set (it's a cleanup eraser) while the *extraction* path's dash set is widened to match — i.e. don't accidentally narrow the inline stripper or widen the extractor in a way that captures a stray inline tag as the entry's real label. Add a test for "body containing an inline `[x – y]` tag" → tag stripped, entry's real own-line label still wins.

**Minor 3 — `book-context` `CLAIM_LINE` uses `!current.claimType` as a guard** ("first label wins"). When swapping to the shared extractor, preserve that first-wins semantics — a motif with two label-looking lines must still take the first. Low risk (motifs have one label), but it's a behavioral detail the extraction must not drop.

### Finding 2 — in-field parenthetical dual-labels exist in PEOPLE.md but correctly bypass the parsers; confirm they stay out of scope

Deeper read (matthew/john PEOPLE.md) surfaced a pattern not mentioned in the plan: many typed fields carry an **inline parenthetical** `(CLAIM — CONFIDENCE)` label inside the value — e.g. Yeshua `**Birth year:** c. 4 BCE (TEXTUAL — PROBABLE; …)`, `**Death year:** c. 30 or 33 CE (TEXTUAL — UNCERTAIN; …)`; Miryam `**Birth year:** c. 20 BCE (POSSIBLE INFERENCE — POSSIBLE; …)`; Andreas `**Death year:** … (LATER RECEPTION — POSSIBLE; …)`. These are **not** the bracketed `**[claim — confidence]**` lines Finding 3 targets, and crucially the people-parser does **not** parse them: `applyField` stores `birthYear`/`deathYear`/`lifespan` as **raw strings**, so the parenthetical label is preserved verbatim and rendered as plain field text by `person-card`'s generic `Field`. It never reaches `parseClaimType`/`parseConfidence`.

**This strengthens the plan's "0 change" claim** (these dozens of in-field labels are invisible to the refactor and cannot regress), but it's worth a one-line note in the plan so that: (a) nobody mistakes these parenthetical in-field labels for Finding-3 `parseDualLabel` scope — they are out of scope and must stay so; (b) if anyone later wants them rendered as real badges, that is a **separate feature**, not this SSOT refactor. The R1 resolved-value diff won't see them either (they're not resolved values), which is correct.

### Confirmed safe (verified, no action)

- **Canonical-is-enrichment is correct** — strict superset of all other alias sets; merging cannot *remove* recognition from any surface.
- **DDD/DRY posture is right** — `labels.ts` pure in `domain/` beside `sortByConfidence`; parsers import down-layer (`infrastructure → domain`); UI `confidence-tone` in `ui/shared`. 7 copies → 2 homes; no new dependency direction. R5 holds.
- **UI tone + key maps are byte-identical** (claim-badge ↔ person-card tone; claim-badge ↔ prophecy-view keys) — consolidation is pure dedup with 0 visual change beyond the intended person-card raw→i18n.
- **Excluding `parseOriginType`/`parseHistoricityStatus`/`FulfillmentStatus` is correct** — distinct single-copy enums; `HistoricityStatus`'s `LITERARY` member would be silently lost if naively merged into ConfidenceLevel. The plan's explicit non-goal here prevents a real bug.
- **The order-preservation requirement (§3a) is real and correctly specified** — all 4 parsers today check VERIFIED→PROBABLE→POSSIBLE→UNCERTAIN→SPECULATIVE→DOCUMENTED for the range-label cases; a reorder would flip "PROBABLE THROUGH UNCERTAIN" to UNCERTAIN. Verified the order is shared.

---

## On the three open questions

- **Q1 (labels.ts home):** `domain/content/labels.ts` — agreed, unambiguously. It's pure, IO-free, and `sortByConfidence` + the unions already live in `domain/content/types.ts`. Putting it in `infrastructure` would invert the dependency (UI/domain can't import from infrastructure).
- **Q2 (person-card curiosity badge → i18n):** Yes, adopt it — but because it's the *only* visible change, make the MCP visual check in Step 4 specifically confirm a real curiosity entry renders. **Caveat:** if §12's finding that *no* PEOPLE.md currently has curiosity entries is correct, then there is **no page that renders a curiosity badge at all**, and the "visible change" is unobservable today (and `<ClaimBadge>` adoption is pure future-proofing). Confirm whether any curiosity content exists; if none does, Step 4's MCP visual can't show anything and should be replaced by a unit/render test of `CuriositiesBlock` with a synthetic entry. This is worth resolving before Step 4 — it changes what "done" looks like.
- **Q3 (defaults TEXTUAL / POSSIBLE +warn):** Correct — matches the enrichment majority. Dropping people's `UNCERTAIN` default is safe *given* Finding 1's residual (people's default is only reachable via an unused curiosity path). The R1 diff confirms it.

---

## Recommendation

**APPROVE**, with the plan's own sequencing. It correctly carries the Tier-1 learnings (empirical pre-validation, the right content-guard — a resolved-value diff, not conservation — symbol-not-line edits, gated revertible steps), and its self-audit (§13) is substantively accurate: I re-checked its "confirmed safe" bullets against source and they hold.

Before execution, fold in: **Finding 1** (state the people-curiosity order/default residual as the explicit thing a non-zero R1 diff would reveal, + a `labels.test.ts` guard), **Minor 2** (preserve enrichment's extract-vs-strip two-regex behavior when unifying `parseDualLabel`), and resolve **Q2's empirical question** (does any curiosity content exist? — it determines whether Step 4 has anything to show). The renderer-tier learning that "the right guard is a resolved-value diff, not conservation" is exactly correct here and is the linchpin: conservation counts units, and a claim/confidence *value* flip is invisible to it — so R1 is the gate that actually protects content meaning (and Rule-29 dual-label integrity).

The Step-1/2 split (pure `labels.ts` add, then wire) is the right shape: a parity miss in wiring reverts to a clean new module without losing it. The behavioral blast radius is genuinely small — by construction for the dominant enrichment surface (canonical = its current logic), and empirically 0 for the other four.

*Method note: parser/UI/type claims and the people-surface safety property were verified against source (incl. the full Genesis, Matthew, and John PEOPLE.md). The R1 resolved-value diff and the full gate (`pnpm test`/`lint`/`build`/`content:lint` + conservation) were not run here (no shell) — they remain the executor's last-mile proof, and the R1 diff specifically is the content-meaning guard that conservation cannot provide. Production `main` untouched (work on `content-multibook-expansion`).*

---

## Addendum (deeper pass, 2026-06-19) — residual closed

After the main audit I closed the one residual that could have moved the verdict: whether any PEOPLE.md *other than Genesis* has a curiosity `**Confidence:**`/`**Claim Type:**` field that would make people's parser-order divergence reachable (turning Finding 1 from latent to active).

**Read in full: `en/matthew/PEOPLE.md` + `en/john/PEOPLE.md`.** Result: **no curiosity blocks in either** — same as Genesis. So across the entire EN people surface, `people.parseClaimType` is never invoked and `people.parseConfidence` is reached only via the DOCUMENTED-only regions path. Finding 1's residual is verified empty on all EN files (upgraded from "Genesis only"); the de/es/pt-br files mirror EN structure and are covered by the R1 diff.

**New observation (Finding 2 above):** the deeper read surfaced the in-field parenthetical `(CLAIM — CONFIDENCE)` labels, which correctly bypass the parsers entirely — strengthening, not threatening, the 0-change claim.

**Nothing in the deeper pass changes the verdict. APPROVE stands.** The remaining unverifiable items are genuinely execution-time (the R1 diff against real TS, the non-EN files, the full gate) and cannot be closed by more reading — further review would be thoroughness theater. This is final.
