# Execution Plan — Tier 2: Dual-Label Single-Source-of-Truth (parsers + UI)

**Date:** 2026-06-19 · **Status:** ✅ EXECUTED 2026-06-19 (all 5 steps; project-lead approved §10). Commits on `content-multibook-expansion`: Step 1 `labels.ts` + tests; Step 2 wired all 5 parsers (**R1 resolved-value diff = 0** across 126 files vs a snapshot of the real parsers; ~350 lines of duplication removed); Step 3 `ui/shared/confidence-tone.ts` + claim-badge/prophecy-view; Step 4 person-card `<ClaimBadge>` + i18n-key-resolves test; Step 5 docs/logs. Gate green throughout (880 tests, lint, build, content:lint; conservation 11831 unchanged). Previously APPROVED by external audit (`AUDIT_DUAL_LABEL_SSOT_PLAN.md`); §13 self-audit + §14 findings folded in. **Branch:** `content-multibook-expansion`. **Source items:** `ARCHITECTURE_DRY_AUDIT.md` (parser Findings 1–3,6; UI Findings 2–4) + `PENDING.md` (DRY consolidation, "Tier 2"). **Risk class:** MEDIUM blast radius (all 5 parsers + 3 UI components), LOW behavioral risk (empirically 0 resolved-value change — §12).

> Applies the Tier-1 learnings: (1) embed an empirical pre-validation that proves the behavior claim against the real corpus; (2) pick the *right* content-loss guard for this change class — here a **surface-aware resolved-value diff**, not conservation (conservation counts *units*, not their claim/confidence *values*); (3) small, independently-gated, revertible steps; (4) locate edit sites by symbol/pattern, not line number; (5) external-audit-ready before execution.

---

## 1. Objective & success criteria

Give the **dual-label concept (claim-type + confidence)** one home, eliminating the copy-paste-then-drift the architecture audit found:
- **Parsers:** one `parseClaimType` / `parseConfidence` (+ `LOCALE_ALIASES`, `CLAIM_TYPES`/`CONFIDENCE_LEVELS` arrays derived from the type unions) consumed by all 5 content parsers — replacing the 4 divergent `parseConfidence`, 3 divergent `parseClaimType`, and the duplicated arrays.
- **Dual-label extraction (audit Finding 3 — added after self-audit 2026-06-19):** one `parseDualLabel(line)` + `DUAL_LABEL` regex unifying the divergent `**[claim — confidence]**` extractors (`enrichment` `LABEL_LINE`/`INLINE_LABEL`/`TRAILING_LABEL`, `book-context` `CLAIM_LINE`) so all handle the same dash set (`—|–|--`). *(The en-dash `–` variant is currently latent — 0 content uses it — so this is cleanup that removes a divergence, not an active-bug fix; but it belongs with the dual-label SSOT, not split off.)*
- **UI:** one confidence→tone map + one set of i18n-key maps (`CONFIDENCE_KEYS`/`CLAIM_TYPE_KEYS`) consumed by `claim-badge`, `person-card`, `prophecy-view`; and adopt the shared `<ClaimBadge>` in `person-card`'s `CuriositiesBlock` (removes the last hand-rolled badge, gains i18n).

**Done when:** the duplicated parser/UI label logic is one source each; **the resolved (claimType, confidence) for every content entry is byte-identical before/after** (the latent drifts are folded into the canonical, with no current value change — §12); the 2 latent parser drifts can no longer recur; `pnpm test · lint · build · content:lint` green; conservation unchanged; UI badges render identically (MCP visual).

**Explicit non-goals (scoped out, *not* dropped):**
- The renderer (Tier 1, done); `<Disclosure>` extraction + `people-parser.ts` split (Tier 3); redundant `Name (Name)` (Tier 4).
- **`people-parser`'s `parseOriginType` + `parseHistoricityStatus`** — distinct single-copy enums (`HistoricityStatus` shares some member *names* with `ConfidenceLevel` but adds `LITERARY` and is a different type). Not dual-label; no duplication → leave.
- **`FulfillmentStatus`** parsing (`prophecy-parser`) + its color map (`prophecy-view` `FULFILLMENT_COLORS`) — single-copy each, not a DRY target.
- **Audit parser Finding 5/7** — shared `FIELD_LINE` / `H2`–`H4` headers / `SOURCE_LABELS` / `stripBlockquote` (5 copies each) + the warn-and-default pattern. Real DRY, but *generic parser plumbing*, not the dual-label concept → **deferred to Tier 3** (natural to land with the `people-parser` split). Tracked, not forgotten.

---

## 2. Root cause (code-grounded)

Per `ARCHITECTURE_DRY_AUDIT.md`, verified against source:
- **`parseConfidence` ×4** — `enrichment-parser` (richest), `prophecy-parser` (`parseConfidenceLabel`), `book-context-parser`, `people-parser`. Divergences: `enrichment` adds ASCII `MOEGLICH`/`MOGLICH`; `people` omits `PROVAVEL`/`POSSIVEL`/`MOEGLICH`/`MOGLICH`/`UNSICHER` and **defaults `UNCERTAIN`** vs `POSSIBLE` (+warn) elsewhere.
- **`parseClaimType` ×3** (+ a 4th array-driven lenient variant in `people`) — `book-context` omits the archaeological aliases (`ARQUEOL*`/`ARCHÄOLOG*`), `KOMPARATIV`, ASCII `RECEPCION`/`SPATERE`, `CIENTÍFICO`, and the `SPECULATIVE`→`SPECULATION` alias.
- **Arrays duplicated** — `people-parser` redeclares `CLAIM_TYPES`/`CONFIDENCE_LEVELS` already implied by the `types.ts` unions.
- **UI:** `CONFIDENCE_TONE`/`CONFIDENCE_BADGE_COLORS` defined in `claim-badge` + `person-card` (Tier-1 aligned their `SPECULATIVE` value but they remain two copies); `CONFIDENCE_KEYS` duplicated in `claim-badge` + `prophecy-view`; `person-card`'s `CuriositiesBlock` hand-rolls the badge (no i18n).

`types.ts` already hosts pure label logic (`ConfidenceLevel`/`ClaimType` unions, `CONFIDENCE_SORT_ORDER`, `sortByConfidence`) — so the merged pure parsers belong beside it (`domain/content/labels.ts`), and `infrastructure` parsers importing them respects the layer (`infrastructure → domain`).

---

## 3. Proposed solution

### 3a. `src/domain/content/labels.ts` (pure; no framework deps)
- `LOCALE_ALIASES` — the canonical EN/PT/DE/ES alias table for every `ClaimType` and `ConfidenceLevel` member (the **union** of all four parsers' aliases, incl. ASCII-deaccented German).
- `parseClaimType(raw): ClaimType` and `parseConfidence(raw): ConfidenceLevel` — one implementation each, **canonical = the current `enrichment-parser` behavior** (the richest): claim default `TEXTUAL` (+warn), confidence default `POSSIBLE` (+warn).
- `CLAIM_TYPES` / `CONFIDENCE_LEVELS` exported as `const` tuples `satisfies readonly ClaimType[] / ConfidenceLevel[]` (single source for the `people` arrays).

> **Order-preservation requirement (self-audit 2026-06-19):** 4 *range* confidence labels exist in content — "PROBABLE THROUGH UNCERTAIN" / "WAHRSCHEINLICH BIS UNSICHER" / "PROVÁVEL A INCERTO" / "PROBABLE A INCIERTO" — each matches *two* buckets. They resolve to `PROBABLE` today only because every parser checks PROBABLE before UNCERTAIN. The merged `parseConfidence` **must preserve the canonical check order** (VERIFIED → PROBABLE → POSSIBLE → UNCERTAIN → SPECULATIVE → DOCUMENTED); a reorder would silently flip these to `UNCERTAIN`. Covered by a dedicated unit test + the R1 diff.

### 3b. Wire all 5 parsers
Replace each local `parseClaimType`/`parseConfidence`/`parseConfidenceLabel` + the `people` arrays + the Finding-3 extraction regexes with imports from `labels.ts`. Net deletion of ~200 lines of duplicated logic. (Leave `people` `parseOriginType`/`parseHistoricityStatus` untouched — out of scope.)

### 3c. `src/ui/shared/confidence-tone.ts`
- `CONFIDENCE_TONE: Record<ConfidenceLevel, string>` (the canonical token classes) + `CONFIDENCE_KEYS` + `CLAIM_TYPE_KEYS` (i18n key maps).
- Wire `claim-badge`, `person-card`, `prophecy-view` to import; delete their local copies.

### 3d. Adopt `<ClaimBadge>` in `person-card`'s `CuriositiesBlock`
Replace the hand-rolled chip pair with `<ClaimBadge claimType confidence />` (gains i18n translation of the labels; removes the last divergent badge). *(Minor 1: `ClaimBadge`'s unreachable fallback is `POSSIBLE`-tone vs `CuriositiesBlock`'s current `UNCERTAIN`-tone — both unreachable since every member is mapped; do not "fix" it.)*

### 3e. Dual-label extraction (Finding 3) — preserve the extract-vs-strip distinction
enrichment deliberately uses **three regexes for two jobs**: `LABEL_LINE` (own-line **extraction**, `—|--`) and `CLAIM_LINE` (book-context extraction, `—` only) *extract* the entry's authored claim/confidence; `INLINE_LABEL` (`—|--|–`) + `TRAILING_LABEL` *strip* stray inline/trailing label tags from body/source text in `finalizeEntry`. When unifying:
- **Minor 2:** widen the *extraction* regex's dash set to `—|–|--` (so it matches the inline set), but **keep extraction and stripping as separate operations** — the stripper must not be narrowed, and the extractor must not start capturing a stray *inline* body tag as the entry's real label. Test: a body containing an inline `[x – y]` tag → tag stripped, the own-line label still wins.
- **Minor 3:** preserve `book-context`'s **first-label-wins** semantics (`if (claimMatch && !current.claimType)`, line ~246) — a motif with two label-looking lines must still take the first.

---

## 4. Impact / blast-radius

- **Parsers (infrastructure):** all 5 — but for the dominant surface (`study/` companions + `INTRODUCTION`, served by `enrichment`) the canonical IS `enrichment`'s current logic → identical by construction. The other 3 surfaces change only if they currently under-recognize a token they actually contain — empirically **none do** (§12).
- **UI:** `claim-badge` (unchanged output — it's already canonical), `prophecy-view` (i18n-key source swap, same keys), `person-card` (curiosity badge now i18n-translated + canonical tone — the one intended *visible* change, where it currently shows raw enum strings).
- **Domain:** new pure module beside `types.ts`; no new cross-layer dependency.

---

## 5. Risk-specific gates (the four concerns)

| # | Risk | Mitigation / proof |
|---|---|---|
| R1 | **Resolved-value regression / content-meaning change** | The decisive gate: a **surface-aware resolved-value diff** — resolve (claimType, confidence) for every content entry via the OLD *responsible* parser vs NEW; assert **0 changes**. §12 already ran it → 0. Any future non-zero entry is an enumerated, reviewed correction (a claim/confidence value is content meaning → provisional, Rule-28-adjacent). **If the diff is non-zero, the single most likely source is a `people` curiosity `**Confidence:**` field hitting the people-vs-canonical order/default difference** (the only author-free-text path into `people`'s parser) — none exist today, so a non-zero diff means new curiosity content was added; enumerate and review before proceeding rather than treating it as noise. |
| R2 | **Content loss** | Code-only (steps 1–4); conservation **unit counts** unchanged. NB conservation does *not* see confidence *values* → R1's resolved-value diff is the real content guard, not conservation. |
| R3 | **Compliance (Rule 29 dual-label)** | The dual-label claim-type + confidence is a Rule-29 construct; the merge must not silently re-bucket any label. Covered by R1 (0 value change) + new exhaustive alias→enum unit tests. |
| R4 | **The 2 latent drifts** | Folded into the canonical (merged recognizes the full union; one default). They become *unreachable as bugs*; §12 confirms no current entry's value flips. |
| R5 | **DDD/DRY** | `labels.ts` pure in `domain/` (beside `sortByConfidence`); parsers `infrastructure→domain` (legal); UI `confidence-tone` in `ui/shared`. 7 copies → 2 homes; no new dependency direction. |
| R6 | **UI visual drift** | `person-card` curiosity badge changes from raw enum to i18n + canonical tone (intended). MCP visual confirms a People page with a curiosity entry renders the badge correctly in ≥2 locales; other badge sites byte-identical. |

---

## 6. Validation matrix

**Unit tests** (new `labels.test.ts`): every alias from all 4 former parsers (incl. ASCII-German `MOEGLICH`/`SPATERE`/`ARCHAOLOGISCH`, accented forms, EN/PT/ES) → correct enum; claim default `TEXTUAL`, confidence default `POSSIBLE`; `CLAIM_TYPES`/`CONFIDENCE_LEVELS` cover the unions (`satisfies` + a test asserting length === union size); **the 4 range labels** ("PROBABLE THROUGH UNCERTAIN", "WAHRSCHEINLICH BIS UNSICHER", "PROVÁVEL A INCERTO", "PROBABLE A INCIERTO") → `PROBABLE` (order-preservation lock); `parseDualLabel` parses `—`, `–`, `--` variants.

**System / integration:**
- **R1 resolved-value diff** (the gate): a script that, per content file, applies the OLD responsible parser vs NEW to every dual-label / field and reports any (file, entry, old→new) difference. Must be **0** (or an explicitly-reviewed correction set).
- `pnpm test · lint · build · content:lint` green; **conservation unchanged**.
- **MCP visual:** a People page curiosity badge (Tier-2's only intended visible change) in en + one non-EN; a Deeper page badge unchanged; a prophecy reading badge unchanged.
- Existing parser unit tests (enrichment/prophecy/people/book-context) stay green — they are the per-surface regression lock.

---

## 7. Sequencing (small, independently-gated commits)

1. **Create `domain/content/labels.ts`** + `labels.test.ts` (no wiring). Pure addition; gate green.
2. **Wire the 5 parsers** to `labels.ts`; delete local copies + `people` arrays. Run the **R1 resolved-value diff = 0**; existing parser tests green; conservation unchanged.
3. **Create `ui/shared/confidence-tone.ts`**; wire `claim-badge` + `prophecy-view` (key/tone source swap, output identical). Gate + spot visual (badges unchanged).
4. **Adopt `<ClaimBadge>` in `person-card` `CuriositiesBlock`.** *Per external audit: **no PEOPLE.md (any of the 13, any locale) contains curiosity content today** — so `CuriositiesBlock` renders on no live page and this is pure future-proofing, not an observable change.* Therefore validate with a **render/unit test of `CuriositiesBlock` with a synthetic entry** (asserting it renders `<ClaimBadge>` with i18n labels + canonical tone), **not** an MCP visual (there is nothing live to screenshot). Note the unreachable-fallback tone shift (Minor 1) so it isn't mistaken for a regression.
5. **Docs/logs** — `EXECUTION_HISTORY` entry; `PENDING` Tier-2 items closed; `ARCHITECTURE_DRY_AUDIT` parser/UI findings marked done.

Each step a separate revertible commit behind the full gate. Step 1 (pure add) and Step 2 (wiring) separable so a parity miss in wiring reverts without losing the new module.

---

## 8. Rollback

Each step is one commit; `git revert` restores the prior gate-green state. No content edits (steps 1–4 are code-only), no schema, no data migration — rollback is pure code revert. If the R1 diff is unexpectedly non-zero at Step 2, stop and enumerate before proceeding.

---

## 9. Definition of done

`pnpm test` (incl. `labels.test.ts`) · `lint` · `build` · `content:lint` green · **R1 resolved-value diff = 0** · conservation unchanged · MCP visual clean (People curiosity badge + unchanged badge sites) · audit/PENDING/EXECUTION_HISTORY updated · production `main` untouched.

---

## 10. Open questions for project-lead

1. **`labels.ts` home** — `domain/content/labels.ts` (recommended, beside `sortByConfidence`) vs `infrastructure/content/shared/`. Domain is cleaner (pure, no IO) and matches where the sort logic already lives.
2. **`person-card` curiosity badge** — adopting `<ClaimBadge>` changes it from raw enum strings to i18n-translated labels (an improvement). Confirm that's desired (it's the only visible change in Tier 2).
3. **Canonical defaults** — confirm claim default `TEXTUAL`, confidence default `POSSIBLE` (+`console.warn`) as the single behavior (matches the `enrichment` majority; `people`'s `UNCERTAIN` default is dropped — §12 shows no current entry hits it).

---

## 11. Locate-by-symbol note (Tier-1 learning)

The executor must locate edit sites by **symbol/pattern**, not line number: `parseConfidence` / `parseConfidenceLabel` / `parseClaimType` / `CLAIM_TYPES` / `CONFIDENCE_LEVELS` in `src/infrastructure/content/*.ts`; `CONFIDENCE_BADGE_COLORS` / `CONFIDENCE_TONE` / `CONFIDENCE_KEYS` / `CLAIM_TYPE_KEYS` / `CuriositiesBlock` in `src/ui/`. Line numbers in this plan are indicative only.

---

## 12. Pre-execution audit — empirical validation (2026-06-19)

Following the Tier-1 method, the merge's behavior was tested against the real corpus *before* sign-off.

**Distinct labels in content:** 49 confidence strings, 41 claim strings (from `**[claim — confidence]**` dual-labels + `**Confidence:**`/`**Claim Type:**` fields, all locales).

**Crude cross-parser pass (surface-blind) flagged 6 "drifts"** — `UNGEWISS`, `MOEGLICH`, `SPEKULATIV`, `ESPECULATIVO` (recognized by `enrichment` but not all others), plus `people`'s `UNCERTAIN` default. **This over-flags** (like Tier-1's first regex), because each surface is parsed by exactly one parser.

**Surface-aware pass (the correct test) → 0 resolved-value changes:**
- Under-recognized tokens (`MOEGLICH`/`MOGLICH`/`UNGEWISS` as confidence; `KOMPARATIV`/`ARQUEOL*`/ASCII claim aliases) appear **only** in `study/` + `INTRODUCTION` files → served by `enrichment` = the canonical → already correct.
- **CONTEXT.md** (book-context) dual-labels use only `VERIFIED/VERIFIZIERT/VERIFICADO` + `PROBABLE/WAHRSCHEINLICH/PROVÁVEL` (confidence) and `TEXTUAL(L)`/`STRONG INFERENCE`-family/`COMPARATIVE`-family (claim) — all universally recognized.
- **Prophecy** confidence = `DOCUMENTED`-family + `POSSIBLE`-family (incl. `MÖGLICH` umlaut, which it has) + `PROBABLE`-family — all recognized.
- **PEOPLE.md** has **no** `**Claim Type:**`/`**Confidence:**` curiosity fields; the region path sees only recognized `DOCUMENTED` or its explicit `"DOCUMENTED"` default. (`SPEKULATIV` in `de/genesis/PEOPLE.md` is prose, not a label.)

**Conclusion:** the cross-parser divergence is entirely **latent**; merging to the richest canonical changes **0 rendered values** today and makes the latent drifts unrecoverable. The R1 resolved-value diff is the gate that keeps it so. ReDoS n/a (simple `.includes` checks). 

**Residuals for execution (cannot be closed by static analysis):** the real parsers' end-to-end behavior (re-prove via existing parser unit tests + new `labels.test.ts` + the R1 diff script run against the *actual* TS, not the JS replica); the `person-card` badge visual; the full gate.

---

## 13. Self-audit addendum (2026-06-19) — deeper pass, plan corrected

Red-teamed this plan the way Tier 1 was. Findings (all folded in above):

**Corrections to the plan (actions changed):**
1. **Scope gap — audit Finding 3 was missing.** The plan merged the *value* parsers but not the *dual-label extraction* regexes (`LABEL_LINE`/`INLINE_LABEL`/`TRAILING_LABEL`/`CLAIM_LINE`), which diverge on dash variants. Added to scope (§1, §3b) as `parseDualLabel` + `DUAL_LABEL`. (En-dash `–` confirmed latent — 0 content uses it — so cleanup, not active-bug.)
2. **Order-sensitivity — 4 range labels.** "PROBABLE THROUGH UNCERTAIN" (+ DE/ES/PT forms) match two buckets; they resolve to `PROBABLE` only because PROBABLE precedes UNCERTAIN in every parser. Added an explicit order-preservation requirement (§3a) + unit test (§6). 0 current change (all parsers already share this order).
3. **Scope clarity — excluded enums.** `people-parser`'s `parseOriginType` + `parseHistoricityStatus` are distinct single-copy enums (`HistoricityStatus` shares names with `ConfidenceLevel` but adds `LITERARY`); explicitly out of scope (§1 non-goals). Finding 5/7 (generic parser plumbing) explicitly deferred to Tier 3 — tracked, not dropped.

**Confirmed safe (strengthen the plan, no action):**
- **UI tone maps are byte-identical** — `claim-badge` `CONFIDENCE_BADGE_COLORS` == `person-card` `CONFIDENCE_TONE` across all 6 members (Tier-1 aligned the last diff). Consolidation = pure dedup, 0 visual change beyond the intended `person-card` raw-enum→i18n.
- **i18n keys exist in all 4 locales** — 8 `claimType.*` + 6 `confidence.*` present in en/pt-br/de/es → `person-card` `ClaimBadge` adoption won't hit missing keys.
- **`people` `parseConfidence` only ever sees `DOCUMENTED`** (region path) → dropping its `UNCERTAIN` default changes nothing; **no test asserts that default** (the `people-parser.test` `UNCERTAIN` at line ~134 is a `historicityStatus` case, different enum).
- **`prophecy-view` `CONFIDENCE_KEYS` is identical** to `claim-badge`'s (an earlier "differ" was a grep artifact).

Verdict: with Finding 3 added, the order-preservation lock, and the explicit exclusions, the plan is complete and the "0 resolved-value change" claim holds. Ready for external audit / execution.

---

## 14. External audit applied (2026-06-19)

External audit (`AUDIT_DUAL_LABEL_SSOT_PLAN.md`): **APPROVE** — every structural claim verified against source (incl. reading all 3 EN PEOPLE.md in full); divergences, canonical-is-enrichment, byte-identical UI maps, and the "all divergence latent → 0 resolved-value change" thesis all confirmed. Findings folded in (each re-verified against source before accepting):

1. **Finding 1 + Q2 (most consequential) — no curiosity content exists corpus-wide.** Verified: 0 `**Claim Type:**`/`**Confidence:**` curiosity fields in *any* of the 13 PEOPLE.md (all locales). Consequences applied: (a) `people`'s order/default divergence is unreachable today — named explicitly as the gated residual in §5/R1 (a non-zero R1 diff most likely = newly-added curiosity content, enumerate & review); (b) **the `person-card` ClaimBadge change is unobservable today** → Step 4 validation changed from MCP visual to a **render/unit test of `CuriositiesBlock`** with a synthetic entry.
2. **Minor 1** — `ClaimBadge`'s unreachable fallback is `POSSIBLE`-tone vs the current `UNCERTAIN`-tone; both unreachable; noted in §3d so it isn't "fixed" as a phantom regression.
3. **Minor 2** — `parseDualLabel` must preserve enrichment's **extract-vs-strip** split (`LABEL_LINE`/`CLAIM_LINE` extract; `INLINE_LABEL`/`TRAILING_LABEL` strip); widen the extractor dash set to `—|–|--` without letting it capture a stray inline body tag. Added to §3e + a §6 test.
4. **Minor 3** — preserve `book-context` **first-label-wins** (`!current.claimType`, line ~246). Added to §3e + a §6 test.
5. **Finding 2 (strengthens "0 change")** — PEOPLE.md typed fields carry inline parenthetical `(CLAIM — CONFIDENCE)` labels (e.g. Yeshua `Birth year: … (TEXTUAL — PROBABLE; …)`) stored **raw** by `applyField` and rendered as plain text → they never reach `parseClaimType`/`parseConfidence` and are **out of scope**; rendering them as real badges would be a *separate feature*, not this refactor. Verified in `en/matthew/PEOPLE.md`.

All confirmed-safe bullets (canonical superset, DDD home, UI-map/key identity, excluded enums, order lock) independently re-verified. **Status → APPROVED; awaiting project-lead sign-off on §10.** Open item for the lead: Q2 — since no curiosity content exists, confirm `ClaimBadge` adoption as future-proofing (validated by render test, not a live page).
