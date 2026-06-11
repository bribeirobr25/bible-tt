# Plan — Genesis §I "Scenario" Structure: keep as-is, or migrate to `#### ` sub-entries?

**Date:** 2026-06-06 (rev. 2026-06-07 after a full cross-check against `docs/rules/`, `docs/architecture/`, `docs/design/`, `docs/templates/`, `docs/guides/`, `docs/editorial-log/`; rev. 2026-06-08 incorporating the independent audit `AUDIT_GENESIS_SECTION_I_MIGRATION_PLAN.md`)
**Status:** 🔄 **SUPERSEDED 2026-06-11 → Option C ADOPTED (fuller code-backed version).** Lead reversed the A decision: per-category confidence is wanted now, and C is "the normal path" given the rest of the structure work is done. A code-backed pilot (§7 below) is **complete on EN Genesis 1 and awaiting lead's density/label review** before scaling to PT/DE/ES Gen 1 and then Gen 2–12 × 4 locales. The original A rationale + the 2026-06-08 audit are retained below for the record.
>
> **Prior status (for the record):** ✅ DECIDED 2026-06-08 — Q1 = Option A (do NOT migrate); C deferred to Phase 12. Independently audited 2026-06-08 → APPROVE / Option A (`AUDIT_GENESIS_SECTION_I_MIGRATION_PLAN.md`); the two Minor accuracy notes are folded in below (§2 subset footnote ¹; design citations by section, §4).
**Author:** Claude Opus 4.8 (1M context)
**Parent:** §I two-level parser+UI fix (EXECUTION_HISTORY 2026-06-06) · `docs/audit/PENDING.md` §3.

## 1. Background

The §I two-level fix gave **John/Matthew** §I a working structure: `### SCENARIO` → `#### IA-x` sub-dimensions, each rendered as its own dual-labelled card. That fix was a **bug fix** — those `####` were rendering as literal `####` text.

**Genesis §I is different and is NOT broken.** It renders correctly today. This plan asks whether to migrate it to the same `#### ` card structure for visual consistency, and — after the doc cross-check — concludes the first question is **whether it's worth doing at all**, with the documentation now pointing clearly toward *no*.

## 2. What the template actually specifies (corrected)

The canonical spec is `docs/templates/contextual-companion-template.md` §I. It specifies a **flat, single-level** form:

```
## I. The World at the Time
### [Topic]
**[HISTORICAL / ARCHAEOLOGICAL — confidence level]**
[Description … Each sub-topic gets its own entry (I1, I2, etc.).]
```

→ **No scenarios, no `####`.** So **both** real structures deviate from the template, in different directions:

| | Template (canonical) | Genesis §I (actual) | John/Matthew §I (actual) |
|---|---|---|---|
| Grouping | none — flat `### [Topic]` | **4 `### Scenario`** = *dating hypotheses* (Mosaic/Monarchic/Exilic/Persian) | **`### SCENARIO`** = *temporal contexts* (pre-/post-70 CE) |
| Sub-items | `### [Topic]` per category | inline `**I-A·n. …**` bold categories | `#### IA-x` sub-dimensions |
| The 10 §I categories (I1–I10) | one `### ` each | full 10×4 grid in the **Gen 1 anchor** file; **chapter files carry a chapter-relevant subset** ¹ (I-A1 Political … I-A10 Neighboring peoples) | a subset, per chapter |
| Dual-label | one per `### [Topic]` | one per `### Scenario` (e.g. `[HISTORICAL/ARCHAEOLOGICAL — DOCUMENTED]`); categories mostly share it, **occasionally with a category-level label of their own** ¹ | one per `#### ` card |

¹ Verified 2026-06-08: the **Gen 1** companion carries the complete 4-scenario × 10-category grid (it's the anchor the other chapters cross-reference for "the full grid"); **chapter** files carry only the chapter-relevant categories — e.g. Gen 12 Scenario A has I-A1, I-A2, I-A3, I-A4, I-A10 (non-contiguous), and I-A10 carries its **own** `[HISTORICAL / ARCHAEOLOGICAL — DOCUMENTED]` label in addition to the scenario-level one. So §I is *less* uniform than a clean 10×4 grid — which only strengthens Option A (a mechanical card migration would be messier than the table implies).

**Neither actual structure is "the template form."** Genesis is closer to a *table* (10 categories × 4 dating frames); John/Matthew is closer to a *card grid*. The migration question is therefore "should we standardize Genesis onto the John/Matthew card grid?" — not "fix a deviation."

## 3. Rule-29 compliance check of the current Genesis §I (verified 2026-06-07)

Before asking whether to restyle, confirm the current flat Genesis §I is **already compliant** (so Option A is not a compliance bypass):

| Rule 29 requirement | Genesis §I status |
|---|---|
| Section **H** (Sources Consulted) — **MANDATORY** | ✅ present in every Genesis chapter (1, 9, 12 spot-checked) |
| Mandatory disclaimer at top of companion | ✅ present |
| §I covers the 10 "World at the Time" categories | ✅ all 10 present (I-A1…I-A10 = Political landscape … Neighboring peoples) |
| Dual-label (claim-type + confidence) on contextual claims | ✅ present at the **scenario** level; some categories add their own |
| §I vs §C boundary (broad world vs verse-specific evidence) | ✅ respected |

**Conclusion: the current Genesis §I is Rule-29 compliant.** Option A keeps a compliant structure. (Earlier audit drafts suggested Genesis §I might be "mislabeled" or "missing Section H / dual labels" — that was **incorrect**; verified false on 2026-06-07.)

The one *latent* nuance: Rule 29 says "Each sub-entry uses the standard claim-type and confidence labels." Genesis applies the label at the **scenario** level (the unit), with categories inheriting it — a defensible reading, since the scenario is the claim-bearing unit (the dating hypothesis). Making **every** `I-A·n` category carry its own label is a *granularity* choice (= Option C), not a compliance fix.

## 4. Design-system constraint (decisive, verified 2026-06-07)

`docs/design/TT-DESIGN-SYSTEM.md` explicitly forbids (cited by section, not line number, to avoid drift):
- **§6 Layout → Rules:** "No card soup — use dividers" · "No nested cards"
- **§12 Anti-Slop Checklist → NEVER USE:** "Card soup or nested cards"

Migrating Genesis §I to cards (Option B/C) would render **4 dating scenarios × ~10–14 category cards per chapter = ~40–56 cards per chapter**, ×12 chapters ×4 locales. That is the **textbook "card soup"** the design system bans — and worse than John/Matthew (which have ~6–8 cards across 2 scenarios). So the design system **actively argues against** migration. This is the single strongest factor and it points to Option A.

## 5. Options

### Option A — Do NOT migrate (recommended; reinforced by the doc check)
Leave Genesis §I as-is. Rationale, now grounded in the docs:
- **Not a bug** — renders correctly, and is **Rule-29 compliant** (§3).
- **Design system forbids the result** of migration (card soup, §4).
- The dating-hypothesis framing reads naturally as prose ("if composed in the Mosaic period, then…"); a 10×4 category-by-scenario grid is information-dense and suits a table/scenario layout better than a badge grid.
- Avoids authoring ~750 per-category claim labels (Option C) or showing a repeated/low-information badge per card (Option B).
- Action: close the PENDING item as **"won't-migrate, by design"**; log the decision (schema in §8); update the companion template (§9) so the two scenario-grouped §I variants are documented and future authors choose intentionally.

### Option B — Migrate markup, inherit the scenario label
Convert each `**I-A·n. Title**` → `#### I-A·n. Title`; each card shows its scenario's dating label.
- Pro: markup parity with John/Matthew; per-category source-lift becomes possible.
- Con: **violates the design "no card soup" rule** (§4); every card in a scenario repeats the **same** low-information dating badge; ~750 content conversions × 4 locales with conservation-gate churn; ships content → requires Rule 28 review (§7).

### Option C — Migrate + author a claim type per category
As B, but author a real `**[claim — confidence]**` per category.
- Pro: full parity + richest structured layer; satisfies the strict "each sub-entry labelled" reading of Rule 29.
- Con: **same card-soup design violation**; **large editorial effort** (~750 categories × judgment × 4 locales) + Rule 28 review; over-engineering content that already works and is already compliant. Best folded into a dedicated Genesis §I cycle alongside Genesis 13–50 (Phase 12), **not** a standalone consistency pass.

## 6. Recommendation

**Option A.** The §I fix solved a real rendering bug in John/Matthew. Genesis §I is a different, **valid, Rule-29-compliant** structure that renders fine; migrating it is cosmetic, the **design system forbids the resulting card soup**, and the card model does not fit Genesis's 10-categories-×-4-dating-frames data without either repeating a low-information badge (B) or large new authoring (C). Recommend closing as "by design," logging the decision, and documenting both §I variants in the template.

If the lead wants markup parity regardless, **Option C** (not B) is the only Rule-29-clean route, and it should be **deferred into the Phase-12 Genesis cycle** with an explicit design sign-off on card density.

## 7. If we proceed (B or C) — execution shape & governance

1. **Parser:** already supports `#### ` sub-entries (verified in `enrichment-parser.ts`: `SUBENTRY_HEADER`, `currentSub`, nesting flush). Genesis would begin emitting `enrichment-subentry` units.
2. **Conservation gate:** auto-recomputes (`conservation.test.ts` already expects `enrichment-subentry`; `structured.ts` already emits via `enrichmentSubEntryId`). Verify the new counts; expect inventory to grow by ~188 sub-entries/locale.
3. **Per-category source-lift:** the inline-`**Source:**` lift (2026-06-06) handles single-trailing sources; once each category is its own `#### ` sub-entry with one trailing source, the 12 currently-inline Genesis blob sources lift to per-card footers automatically.
4. **Content transform:** `**I-A·n. Title**` → `#### I-A·n. Title` + label line (+ source on its own line), Gen 1–12 × 4 scenarios × 4 locales. Scripted transform + per-file review. **Confinement:** non-§I byte-identical (git-scoped diff).
5. **Badge source (B vs C):** inherited scenario dating label vs authored per-category claim type.
6. **Design sign-off (mandatory for B/C):** review `context-view.tsx` rendering against TT-DESIGN-SYSTEM §6/§12 — confirm it does **not** read as card soup before shipping. (Current expectation: it will; this is why A is recommended.)
7. **Rule 28 review:** B/C are content changes → ship as `provisional`; cross-alignment review across all 4 locales is **mandatory** (Rule 28 / Rule 29 status taxonomy); historical/compositional claims may be cleared by a target-language editor with credentials.
8. **Architecture:** all touchpoints stay within layers (markdown = source of truth; parser = infrastructure; rendering = ui) — no DDD violation. Domain stays framework-free.
9. Gates: `pnpm test` (conservation + new subentry counts) · build · lint · content-lint.

## 8. Decisions to lock (lead audit)

- **G-I-Q1 — Do we migrate Genesis §I at all?** → **✅ LOCKED 2026-06-08 = (A) No, keep as-is.** (B) Migrate, inherit dating label (**design-rule conflict — rejected**) · (C) Migrate + author per-category claim types → **deferred to PENDING, gated before Phase 12 Genesis authoring** (with design sign-off). Q2/Q3 are moot under A.
- **G-I-Q2 (only if B/C) — card density vs design system:** how to satisfy TT-DESIGN-SYSTEM §6/§12 ("no card soup / no nested cards") for ~40–56 cards/chapter — collapse-by-scenario, table layout, or accept? Requires design sign-off.
- **G-I-Q3 (only if C) — scope:** fold into Phase 12 (Genesis 13–50) so the whole book is done once (recommended over a standalone pass).

**Decision record:** since Q1 = A is a structural/product decision (no per-verse translation change), it is recorded **in this plan (status line) + `PENDING.md`** — consistent with how the John/Matthew §I two-level fix was logged (EXECUTION_HISTORY), rather than the per-book translation editorial logs. The deferred **Option C** is tracked in `PENDING.md` as a Phase-12 prerequisite. *(If C is later executed, it ships `provisional` with Rule 28 cross-alignment review and per-book editorial-log entries for the authored per-category labels.)*

## 9. Documentation action (independent of Q1)

The companion template (`docs/templates/contextual-companion-template.md` §I) shows **only** the flat `### [Topic]` form, but all three authored books use scenario-grouped §I. Add a short "Section I structural variants" note to the template documenting: (a) the flat default; (b) the Genesis **dating-scenario** form (10 categories × dating hypotheses, scenario-level label); (c) the John/Matthew **`#### ` sub-dimension** form (per-card claim labels, parser-supported). This closes a real template gap regardless of the migration decision.

**The 2026-06-08 audit endorses executing this regardless of Q1** ("do it regardless… bundling it behind a migration decision that may never happen leaves the gap open indefinitely") — it documents existing reality and is a small, safe, decision-independent edit. Recommend doing it as a standalone doc fix rather than gating it on the migration decision.

## 10. Risks

| Risk | Mitigation |
|---|---|
| Over-engineering content that already renders fine & is compliant | Option A default; explicit lead opt-in required for B/C |
| Card soup / nested cards (design violation) on B/C | §4 cites the ban; B/C require design sign-off (§7.6); A avoids it |
| Repeated low-information badges (Option B) | Q1 surfaces it; A avoids it; C resolves it but at large cost |
| ~750-category authoring blowout (Option C) | defer into Phase 12; not a standalone pass |
| Conservation/confinement regression on a large transform | scripted transform + conservation gate + git-scoped confinement |
| Mis-reading Rule 29 as requiring migration | §3 confirms current §I is compliant; migration is cosmetic |

---

## 7. Option C — fuller code-backed implementation (ADOPTED 2026-06-11)

Lead chose the **fuller code-backed** version of C over a content-only hack. The pilot below is **complete on EN Genesis 1**; PT/DE/ES Gen 1 and Gen 2–12 are pending the density/label review.

### 7.1 The blocker the pilot had to solve
Genesis scenarios carry a **scenario-level dating-confidence label** (`[HIST/ARCH — DOCUMENTED]`…) that John/Matthew scenarios lack. A naïve `####` conversion **drops it**: `INLINE_LABEL` strips the bracket label and a group entry emits `text = title` only (attribution + dating confidence lost). Verified by parser test before any content change.

### 7.2 Two distinct confidence axes (why per-category labels are *not* redundant)
- **Scenario badge** = confidence that *Genesis was composed in that period* (the dating hypothesis). Preserved as authored: A=DOCUMENTED, B=POSSIBLE, C=PROBABLE, D=POSSIBLE.
- **Per-category badge** = how well-attested *that slice of the historical world* is, independent of the dating question. VERIFIED (named artifacts: Amarna Letters, Kurkh Monolith, Cyrus Cylinder, Murashu/Elephantine, Yehud coins, Edwin Smith Papyrus) · DOCUMENTED (broad background) · PROBABLE (demographic estimates, social reconstructions, "depicted as") · POSSIBLE (explicit scholarly hypotheses, e.g. "Solomonic Enlightenment").

### 7.3 Code changes (shared infra; John/Matthew §I unaffected)
- `domain/content/types.ts` — `EnrichmentEntry.hasLabel?: boolean`.
- `enrichment-parser.ts` — sets `hasLabel=true` when a `**[claim — confidence]**` line is parsed; emitted in `finalizeEntry`. (No change to *capture* logic — a clean own-line label was already captured.)
- `ui/enrichment/claim-badge.tsx` — new shared `<ClaimBadge>` (claim+confidence chips) extracted from `enrichment-entry.tsx` (DRY; identical output).
- `ui/enrichment/context-view.tsx` — a §I group with `hasLabel` renders as a **collapsible `<details>`** with the dating `<ClaimBadge>` + attribution in the `<summary>` and its `#### ` cards inside (named group `group/scen`); a group **without** `hasLabel` (John/Matthew) renders exactly as before. Discriminator = `hasLabel`, so all new behaviour is scoped to Genesis dating scenarios.

### 7.4 Content format (per scenario)
```
### Scenario A: … (~13th c. BCE) — *traditional attribution; widely held…*   ← attribution folded into title (italic, conserved)
**[HISTORICAL / ARCHAEOLOGICAL — DOCUMENTED]**                               ← dating label on its own line → group badge
#### I-A1. Political landscape
**[HISTORICAL / ARCHAEOLOGICAL — VERIFIED]**                                 ← per-category label (provisional)
[prose unchanged]
```
Transform is a §I-scoped script (`/tmp/convert-gen1-si.mjs`): 4 scenarios folded, 40 categories converted.

### 7.5 Pilot verification (EN Gen 1)
- Parser: 4 groups, all `hasLabel=true`, dating badges DOCUMENTED/POSSIBLE/PROBABLE/POSSIBLE; 40 sub-entries with per-category confidences; group content empty; no thinned cards.
- Gates: `pnpm test` 841/841; `enrichment-subentry` 224→264 (+40, conservation green); `pnpm build` clean; `pnpm lint` clean; `pnpm content:lint` clean (2 pre-existing DE `(Name)` warnings).
- Non-regression: John/Matthew §I groups `hasLabel=false` → original rendering retained.
- Render (`/en/genesis/chapter/1/deeper`): HTTP 200; 4 `group/scen` collapsibles; italic attribution `<em>` in titles; per-category badges render.

### 7.6 Labels are PROVISIONAL
All per-category claim/confidence are AI-drafted (claim-type uniform = HISTORICAL / ARCHAEOLOGICAL; confidence from the prose's own hedging) and ship **provisional** pending Rule-28 source-scholar sign-off — that review is the real accuracy gate for C.

### 7.7 Remaining (after lead's pilot review)
1. PT/DE/ES Gen 1 — same code, same label map (claim+confidence are language-independent), localized attribution fold.
2. Gen 2–12 × 4 locales (subsets of the 4×10 grid).
3. Editorial-log entries (genesis.md) + CLAUDE.md scope line + PENDING + EXECUTION_HISTORY once scaled.

### 7.8 Folded-in fix — §I section-intro recovery (2026-06-11)

The self-audit found a **pre-existing content drop**: prose authored between a `## ` section header and its first `### ` entry (the §I dating-neutrality disclaimer; John/Matthew "see the companion" pointers) was silently discarded by the parser and never rendered, on `main`, across all chapters/locales. The conservation gate hadn't caught it (it proves parser→structured, not raw→parser). Lead approved folding the fix into the C work.

**Change (general, not Genesis-only):**
- `types.ts` — `EnrichmentSection.intro?: string`.
- `enrichment-parser.ts` — pre-entry, non-`---`, non-blank lines → `section.intro` (leading `>` stripped, mirroring the disclaimer extractor); set in `finalizeSection`.
- `ids.ts` — `enrichmentSectionIntroId` = `…ctx#<sectionId>.intro`.
- `structured.ts` — new `enrichment-section-intro` kind, emitted when `section.intro` is present.
- `conservation.test.ts` — kind registered in the enrichment `expected` map (Gate 2b).
- `context-view.tsx` — renders `section.intro` (muted italic) above the section's entries.

**Scoping rule (revised after audit):** an intro is kept **only for sections that have entries** (`finalizeSection`: `raw.entries.length > 0 ? … : ""`). Captured candidates are still gathered for any pre-entry prose, but a 0-entry section yields no intro. This cleanly selects exactly the **§I "World at the Time"** intros (72 = 18 chapters × 4 locales) and excludes **all** pre-entry content of the orphaned 0-entry "Sources Consulted" sections — both its table **and** its internal **editorial-provenance** block (Drafted by / Date / Reviewed by / Rule). A–G have no pre-entry prose.

> **Audit correction (2026-06-11):** the first cut of this fix captured *all* pre-entry prose, which (a) pulled the §H/§G Sources tables **and** the internal editorial-provenance metadata into the structured/search layer, and (b) populated an unused `.intro` on all 12 INTRODUCTIONs (shared `parseMarkdownSections`). Neither was reader-visible (0-entry sections are filtered from the UI), but both polluted the data layer. The `entries.length > 0` gate fixes all of it — `enrichment-section-intro` drops 144 → **72** (§I only), introductions get **0**, and no provenance/table text enters the structured layer.

**Verified:** 841/841 tests; conservation `enrichment-section-intro=72` (§I only); build clean (284 pages); lint/content-lint clean. Render: EN Gen 1 §I disclaimer shows once (RSC-payload doubling accounts for the raw "2"); John §I pointer clean (no leaked `>`); Sources heading count in DOM = 0; editorial-provenance / "Drafted by" leaked to page = 0. The orphaned Sources-table **rendering** remains a separate, out-of-scope pre-existing gap.
