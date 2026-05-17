# Audit of `NEW_PLAN.md` (Phase 6.6 — Post-Phase-6 UX + Content Polish)

**Date:** 2026-05-09
**Auditor:** Claude Opus 4.7 (independent review)
**Scope:** `docs/audit/archive/NEW_PLAN.md` — 8 sub-phases (6.6A through 6.6H) covering en-dash sweep, person-card parser fix, introduction-page disclaimer placement, field reorder + birth/death rendering, native HTML accordion, chapter breadcrumb, Matthew people lifespan authoring, women timeline visibility audit.
**Method:** Verified plan claims against actual files: `src/infrastructure/content/people-parser.ts`, `src/ui/people/person-card.tsx`, `src/ui/people/people-timeline.tsx`, `src/ui/shared/chapter-view.tsx`, `src/ui/enrichment/introduction-view.tsx`, `src/app/[locale]/[book]/introduction/page.tsx`, `content/en/genesis/PEOPLE.md`, `content/en/matthew/PEOPLE.md`. Cross-checked Rule 29 disclaimer requirement and Prime Directive.
**Status:** Plan is mostly sound. Two critical execution-blocking issues that the plan does not catch. Several minor concerns worth resolving.

---

## 1. Executive Summary

Phase 6.6 is small, well-scoped polish work. The diagnostic accuracy is high for the bugs the plan identifies — every verifiable claim checks out:

- **Parser bug (`Adam (Adam) (Adam)`)** confirmed. The parser's `ENTRY_HEADER` regex captures `## Adam (Adam)` as `name = "Adam (Adam)"` literally; the explicit `**Familiar name:** Adam` field then sets `familiarName = "Adam"`; person-card.tsx checks `familiarName !== name` (which is true because `"Adam" !== "Adam (Adam)"`) and renders the parens — producing the triple display.
- **`<details>` lacks `name` attribute** confirmed. `person-card.tsx` line ~291 has `<details className="..."` with no `name`.
- **Chapter view lacks breadcrumb** confirmed. `chapter-view.tsx` header has only `<h1>` + `<ShareButton>`. Compare with `introduction/page.tsx` which has the `<Link href={`/${book}`}>` breadcrumb + ChevronLeft pattern.
- **Matthew lifespan field missing** confirmed. Yeshua, Miryam, Yosef, Herodes, Yochanan all lack `**Lifespan:**` field. Genesis equivalents have it.
- **Birth/death year not rendered** confirmed. `person-card.tsx` has no `<Field label={labels.birthYear}>` or deathYear.
- **Eve and Sarai have no timeline anchors** confirmed. Both have `**Year from creation:** not stated`. `parseInt("not stated", 10)` returns `NaN`, so `parseInt10` returns `undefined`, so `pickAnchor()` excludes them.
- **`<details name>` browser support claim** is accurate (Chrome 120 / Firefox 121 / Safari 17.2 / Edge 120, all Dec 2023, ~2.5 years of support by May 2026).

The plan's structural choices are right. Execution order is sensible. The main risks are two specification gaps, both involving the field rendering and content authoring sub-phases.

---

## 2. Verification Table

| Plan claim | Verification result | Notes |
|---|---|---|
| Parser stores `## Adam (Adam)` heading verbatim as `name` | ✓ Verified | `state.current = { name, slug: name.toLowerCase()... }` — no parens stripping |
| 1,153 `--` occurrences across content | Plausible, not exhaustively counted | Sampled files have many `--` ranges (`Gen 5:1--5`, `1 Enoch 106--107`, `*AJ* 17.168--173`, `Sura 11:25--49`, etc.) |
| Matthew people lack lifespan field | ✓ Verified | Yeshua/Miryam/Yosef/Herodes/Yochanan: no `**Lifespan:**` field |
| birthYear/deathYear not rendered as Field rows | ✓ Verified | `person-card.tsx` field-render block has no `<Field label={labels.birthYear}>` |
| Lifespan currently mid-list | Partially correct | Lifespan is at position 15 of ~21 fields — actually quite late, not mid-list. The proposed move to position 2 is sound; the description is inaccurate |
| `<details>` lacks `name` attribute on PersonCard | ✓ Verified | Line ~291 |
| Chapter pages lack breadcrumb | ✓ Verified | `chapter-view.tsx` header: just h1 + ShareButton |
| Eve/Sarai have no timeline anchor | ✓ Verified | Both have `**Year from creation:** not stated` |
| HTML `<details name>` browser support | ✓ Accurate | Chrome 120, Firefox 121, Safari 17.2, Edge 120 — all Dec 2023 |
| Curiosities sub-block uses `<details>` (so 6.6E names them separately) | ✗ **Inaccurate** | `CuriositiesBlock` in `person-card.tsx` uses `<div>`, not `<details>`. The conflict the plan guards against does not exist. Minor — defensive code is harmless. |
| Phase 6 has shipped (v3.3 ruleset, generation-references, genesis-watersheds) | ✓ Verified | All exist; PEOPLE.md files declare `**Ruleset:** v3.3` |
| i18n keys `people.birthYear`/`people.deathYear` already exist (plan: "already present in alias table for parser; reuse for UI") | ✓ Verified for all 4 locales | All four message files (`en.json`, `pt-br.json`, `de.json`, `es.json`) have both keys under the `people` block. Plan's wording conflates parser aliases (in `people-parser.ts`) with i18n message keys (in `messages/*.json`) — distinct artifacts — but the practical conclusion holds: **6.6D's i18n step is a complete no-op.** EN: "Birth year"/"Death year". PT-BR: "Ano de nascimento"/"Ano de morte". DE: "Geburtsjahr"/"Todesjahr". ES: "Año de nacimiento"/"Año de muerte". |
| Chapter pages have only prev/next nav + global home link | ✓ Verified | `chapter-nav.tsx` has only prev/next chapter links — no breadcrumb to the book landing. The "home link" the plan references is the global app-bar (not chapter-specific). The breadcrumb gap is real; 6.6F's diagnosis stands. |

---

## 3. Red Flags — Resolve Before Execution

### 3.1 Sub-phase 6.6D's field reorder list is incomplete and would silently drop fields

The plan proposes this 13-item field render order:

```
1. Meaning
2. Lifespan (moved)
3. Birth year (NEW)
4. Death year (NEW)
5. Profession
6. Social class
7. Hometown
8. Places lived
9. Father / Mother / Siblings / Spouses / Children
10. Age at fatherhood
11. Cause of death
12. Character arc
13. Books appearing in
```

But the **current** `person-card.tsx` renders these in addition:

- `crossBookSee` (currently first — Matthew uses this for Avraham etc. linking back to Genesis)
- `inBook` (currently second — "**In Matthew:** First in the genealogy...")
- `generationsFrom` (currently third — chip block showing distance from reference figures)
- archaeology + extraBiblical (in their own bordered block)
- regionsByText (in its own block with safeguard pointer)
- curiosities (in its own bottom block)

If a developer takes 6.6D's list literally and replaces the entire field-rendering block with the 13-item list, **six existing field renders disappear from the UI**. Most critically:

- Matthew's cross-book references (Avraham, Yitschaq, Ya'aqov, Yehudah — all `**See:** genesis/PEOPLE.md` entries) become broken cards showing only the genealogical role text (since their other fields are not authored — they rely on the cross-book pointer).
- The regionsByText safeguard pointer (Phase 1H-3 anti-ethnogenesis discipline) disappears.
- All curiosities content disappears.

**Required fix:** 6.6D must explicitly state its scope is the *biographical-fields block only* — i.e., the reorder applies between the `generationsFrom` block (top) and the `archaeology/extraBiblical` block (bottom). Specify the order as:

```
[unchanged top blocks: crossBookSee, inBook, generationsFrom]
1. Meaning
2. Lifespan
3. Birth year (NEW)
4. Death year (NEW)
5. Profession
6. Social class
7. Hometown
8. Places lived
9. Father / Mother / Siblings / Spouses / Children
10. Age at fatherhood
11. Cause of death
12. Character arc
13. Books appearing in
[unchanged bottom blocks: archaeology, regionsByText, curiosities]
```

Or rewrite the plan to enumerate every render in order.

### 3.2 Sub-phase 6.6G's content format will silently break the timeline for the figures it adds

The plan's 6.6G data table proposes:

| Person | Birth year | Historical year (existing or new) |
|---|---|---|
| Yeshua | c. 4 BCE (PROBABLE...) | -4 (already in file) |
| Miryam | c. 20 BCE (POSSIBLE...) | c. -20 (already in file) |
| Yosef | c. 30 BCE (POSSIBLE...) | c. -25 (already in file) |
| Herodes | 73 BCE (DOCUMENTED...) | -73 (already in file) |
| Yochanan | c. 5 BCE (POSSIBLE...) | -5 (already in file) |

Two problems:

**(a) The existing Miryam and Yosef historicalYear values do not parse.** Their current file values are `c. -20 (approximate birth, highly uncertain)` and `c. -25 (approximate birth, highly uncertain)`. The parser's `parseInt10()` calls `Number.parseInt("c. -20", 10)`, which returns `NaN` because the string starts with `c`. The parseInt function only succeeds on strings that *start* with optional whitespace then optional sign then digits. The `c. ` prefix breaks parsing.

This means **Miryam and Yosef are currently silently absent from the Matthew timeline** — and the plan's 6.6H ("Important women timeline visibility audit") is meant to verify timeline visibility but doesn't actually diagnose this format-parsing bug.

By contrast, Yeshua's `**Historical year:** -4 (approximate birth, BCE — placed before Herod's death)` parses correctly to `-4` because parseInt stops at the first non-digit *after* a valid number. Yochanan's `-5` and Herodes's `-73` likewise parse correctly. Only the `c. -N` prefixed values fail.

**(b) The plan's recommendation introduces more `c. ` prefixed values without acknowledging the parsing issue.** If 6.6G is executed as-described, the new birthYear/deathYear *strings* are fine (they're not parseInt'd), but the *historicalYear* values that would also be authored (or already authored) won't parse. Result: the women whose lifespans 6.6H is supposed to surface remain absent from the timeline.

**Required fix:**

1. Sub-phase 6.6G must include a content fix to existing Miryam and Yosef historicalYear/historicalYearEnd values: convert `c. -20` → `-20`, `c. -25` → `-25`. The "approximate" qualification belongs in the human-readable lifespan text (`**Lifespan:** ~33-37 years (approximate)`), not in a parseInt'd field.
2. Document a project-wide convention in the plan: *numeric anchor fields (`historicalYear`, `historicalYearEnd`, `yearFromCreation`, `yearFromCreationEnd`) must be bare integers. Approximation, qualification, and confidence belong in the lifespan/note fields.*
3. 6.6H verification step should explicitly check `parseInt` succeeds on every numeric anchor field.

Without this fix, 6.6G adds entries to the data model that the timeline can already render (the bare ints), and 6.6H fails its audit goal because the women added in 6.6G with `c. ` prefixes never appear on the timeline.

---

## 4. Significant Concerns

### 4.1 Sub-phase 6.6H proposes adding timeline anchors for figures whose lifespans the text does not state

The plan says:

> Targeted content fixes: add timeline anchors for any authored women who don't currently have them.

But Eve has `**Year from creation:** not stated` — because Genesis does not give Eve a birth or death year. Sarai is the same — `not stated within Gen 1--12` (Genesis 17 mentions her age, but that's outside the file's scope; Genesis 23 records her death at 127, also outside).

Adding speculative numeric anchors for Eve would mean inventing dates the text does not give. This conflicts with the Prime Directive: *"do not clarify what the source text leaves ambiguous."*

The plan acknowledges this risk indirectly — "use POSSIBLE/UNCERTAIN confidence and document source" — but the timeline UI does not render confidence per-person. A bar on the timeline implies a knowable lifespan to anyone glancing at the chart.

**Suggested:**

Three options, plan should pick one:

1. **Accept the gap.** Eve and Sarai are excluded from the timeline because the text gives no anchor. Document this in the editorial-log entry for 6.6H. The accordion list still shows them; only the SVG bar is absent.
2. **Render with implicit-anchor styling.** Add a "speculative anchor" mode to the timeline (dashed bar, lighter opacity) for entries with `timelineAnchorConfidence: "POSSIBLE" | "UNCERTAIN"`. Requires schema + UI changes — larger scope than 6.6H suggests.
3. **Compute Sarai from Gen 17:17 + 23:1.** Sarah was 90 at Isaac's birth (Gen 17:17) and Abraham was 100 (Gen 17:17); died at 127 (Gen 23:1). With Avram's birth at AM 1948 and Isaac at AM 2048, Sarai born AM 1958, died AM 2085. This requires importing data from outside Gen 1–12 file scope (a documented decision per Rule 28). Eve remains unanchorable.

The plan's current framing leans toward option 3 implicitly without saying so. Make it explicit, and address Eve.

### 4.2 6.6B parser fix changes slug derivation — verify no URL impact

Currently, heading `## Adam (Adam)` produces `slug = "adam-(adam)"` (because `name.toLowerCase().replace(/\s+/g, "-")` doesn't strip parens). After the fix, slug becomes `"adam"`.

Looking at the codebase:
- `people-timeline.tsx` uses `slug` only as React `key` — no impact.
- `person-card.tsx` uses `slug` only inside `key` for curiosity titles — no impact.
- I see no slug-based URL routing or deep-linking in the people page.

So slug change appears safe. **But the plan should explicitly verify this.** If anyone (now or later) adds slug-based anchors (e.g., `/people#adam-(adam)` shareable links), pre-existing URLs would break post-fix.

**Suggested:** Add to 6.6B DoD: "Verify no code references slug-based URL anchors. If found, document the migration."

### 4.3 6.6C Rule 29 risk rating may be overstated [CORRECTED 2026-05-09 — original audit claim was WRONG]

**Original audit claim (incorrect):** I argued that the "Mandatory disclaimer at top" requirement applies only to companion files, not Book-Level Introductions, and therefore 6.6C had more design flexibility than the plan rated.

**Correction:** Verified directly against `docs/rules/RULES-CORE.md` §Book-Level Introductions, which states: *"Book introductions provide historical, compositional, and textual-transmission context at the book level. They follow the same dual-label system **and disclaimer requirement** as chapter companions."* The disclaimer requirement applies equally to introductions. My audit was wrong on this point.

**What still holds:** The plan's recommendation (collapsed `<details>` labeled "Reading note" / "Nota de leitura" / "Hinweis zum Lesen" / "Nota de lectura") is Rule-29-compliant because the disclaimer remains in the DOM and is keyboard-accessible — "visible when expanded" satisfies the requirement. The MEDIUM risk rating in the plan is correct.

**Plan author's response:** Verified the rule citation, kept MEDIUM risk rating, kept collapsed-details recommendation. Correct call.

### 4.4 6.6A regex coverage — ES residue is unexplained

The plan reports 1,153 occurrences of `--` (EN 334 / PT-BR 203 / DE 205 / **ES 411**). ES has nearly twice the count of any other locale.

This suggests one of:

- ES content has more verse-range citations (plausible — ES Genesis chapters were heavily regenerated in Phase 4 and may contain more cross-references).
- ES has a different range-formatting convention that the regex doesn't fully capture.
- ES has non-numeric `--` patterns (e.g., word ranges) that exist in ES but not other locales.

**Suggested:** Sub-phase 6.6A should include an ES-specific pre-sweep audit: dump the unique `--` patterns from ES content and verify the regex covers all of them before the bulk sweep. The plan mentions a "pre-sweep diagnostic" but doesn't break it down per-locale.

### 4.5 Improvement-1 description is inaccurate but recommendation is sound

The plan says: "Currently lifespan appears mid-list in expanded card; trivial reorder."

Actual position: lifespan is field #15 of ~21 (after ageAtFatherhood, before causeOfDeath). This is *late*, not mid-list.

The recommendation (move to position 2 after meaning) is sensible and matches user feedback. Just the description is off.

**Suggested:** Change the description to "Currently lifespan appears late in the field list; user feedback wants it visible early."

---

## 5. Minor Issues and Improvements

### 5.1 6.6E curiosities accordion conflict is a non-issue

The plan says:

> **Curiosities sub-block:** also uses `<details>` — give it a different name (e.g., `name="curiosities-${person.slug}"`) so it doesn't conflict with the parent accordion

But `CuriositiesBlock` in `person-card.tsx` uses a `<div>` container with `<div>` items, not `<details>`. There's no `<details>` in the curiosities block to conflict with.

**Suggested:** Drop the curiosities `name` attribute from 6.6E. If curiosities ever do become collapsible, address it then.

### 5.2 6.6B test 4 ("explicit field wins") edge case

The plan's 4th test: "Heading `## Avraham (Abraham)` + explicit `**Familiar name:** Abraham (the father)` → explicit field wins."

The logic in the proposed parser is: heading-extracted familiarName is set first; then if the explicit `**Familiar name:**` field appears, it overrides. In file order, this means the explicit field wins.

But the parser already processes lines in order — the existing FIELD_LINE handler for `familiarName` would simply assign over whatever was extracted from the heading. No special "override" logic needed. The test is fine; the implementation is straightforward.

**Suggested:** Note in the implementation comment that override is implicit via line-order processing, not requiring explicit precedence handling.

### 5.3 6.6A residue check should be locale-specific

The plan's verification: `grep -rohE "[0-9]+--[0-9]+" content/` returns 0.

But this only checks numeric-numeric patterns. The plan also mentions word-range patterns (`Mosheh--Yehoshua`) for spot-check. Make this explicit:

```bash
grep -rohE "[0-9]+--[0-9]+" content/  # numeric ranges, should be 0
grep -rohE "\w+--\w+" content/        # word ranges, manually review
```

**Suggested:** Add both grep patterns to the DoD.

### 5.4 Editorial-log entry count

Plan estimates "4-6 new entries." With 8 sub-phases and the rule of "any change in scope of Rule 28 needs a log entry," this is probably an undercount:

- 6.6B: parser change touching how names display → log entry
- 6.6C: disclaimer placement → log entry
- 6.6D: field reorder → log entry (UI-only, may not need)
- 6.6F: breadcrumb → no log (pure navigation)
- 6.6G: 5 figures × dates and lifespans, all confidence-labeled → at least 1 combined entry, possibly 5 individual
- 6.6H: timeline anchors for women → log entry (depending on chosen option per §4.1)

Realistic count: 4-7 entries. Plan's 4-6 is close.

**Suggested:** Be explicit per sub-phase whether a log entry is required, then count.

### 5.5 6.6G "DOCUMENTED" labels for Herod

The plan labels Herod's birth (73 BCE) and death (4 BCE) as DOCUMENTED with citations to Josephus *AJ* 14.158, 17.190 and *BJ* 1.203, 1.665.

Per RULES-CORE.md Rule 29, DOCUMENTED is "for LATER RECEPTION entries where the tradition is historically attested. It is distinct from VERIFIED (textual fact) — DOCUMENTED means 'this reception tradition exists and is well-attested,' not 'the interpretation is textually correct.'"

Herod's dates from Josephus are historical-archaeological evidence, not later reception. The correct label per Rule 29 is **HISTORICAL / ARCHAEOLOGICAL — VERIFIED** or **— PROBABLE**, not LATER RECEPTION — DOCUMENTED.

**Suggested:** Re-read Rule 29 claim-type / confidence definitions before authoring 6.6G. The dual-label pairing matters: DOCUMENTED pairs with LATER RECEPTION; VERIFIED/PROBABLE pairs with HISTORICAL / ARCHAEOLOGICAL.

### 5.6 Test count baseline is asserted but not verifiable from plan

Plan claims 792 tests baseline. Without running `pnpm test` it can't be verified. The plan's prior tracking (Phase 1H added 12 tests; multiple parsers exist) makes 792 plausible but worth confirming as a DoD pre-step.

**Suggested:** Add to 6.6 pre-execution: "Verify current test count: `pnpm test` should report ≥ 792 passing. Use this as the baseline for `+4 new` claim."

### 5.7 `<details name>` keyboard navigation

Plan says: "Native `<details>` retains keyboard nav, focus rings, ARIA semantics. No additional ARIA needed."

This is true for the `<details>` element itself. But adding the `name` attribute makes the group an exclusive accordion. For screen readers, this should ideally announce as a tab list or accordion semantically. Native `<details>` is announced as "summary/disclosure" — works, but a screen-reader user may not realize the cards are an exclusive group.

**Suggested:** Add to 6.6E DoD: "Test with VoiceOver / NVDA — verify the exclusive-accordion behavior is reasonably discoverable. If not, consider `aria-label` on the parent container indicating 'people list, single-expand'."

This is a refinement, not a blocker.

### 5.8 6.6H Bat-Sheva edge case

Plan notes Bat-Sheva is "in Matthew genealogy mention only (no full bio in matthew/PEOPLE.md); no timeline data — that's correct (and expected pending fuller authoring or Phase 13 cross-book canonical structure)."

Verified: Matthew EN PEOPLE.md has Uriyah (Bat-Sheva's husband) but no Bat-Sheva entry; she is referenced only obliquely as "the *one* of Uriyah." The Matthew narrative explicitly avoids naming her. Authoring a Bat-Sheva entry in matthew/PEOPLE.md would conflict with the text's deliberate circumlocution.

**Suggested:** 6.6H should explicitly note Bat-Sheva is intentionally absent from matthew/PEOPLE.md per the text's own treatment, and her bio belongs in samuel/PEOPLE.md or kings/PEOPLE.md when those are authored. Document this in the editorial log so the question doesn't reopen.

### 5.9 i18n keys `people.birthYear`/`people.deathYear` already exist in all four locales — 6.6D's i18n step is a no-op

Verified across all four message files:

| Locale | birthYear | deathYear |
|---|---|---|
| EN  | "Birth year" | "Death year" |
| PT-BR | "Ano de nascimento" | "Ano de morte" |
| DE  | "Geburtsjahr" | "Todesjahr" |
| ES  | "Año de nacimiento" | "Año de muerte" |

The plan's wording ("already present in alias table for parser; reuse for UI") technically conflates two things — the parser's alias table matches markdown field labels in the content files, while the i18n message keys drive UI display text. They are distinct artifacts. **But the practical conclusion is correct:** 6.6D does not need to add any i18n keys.

**Suggested:** 6.6D's plan text could say "i18n keys already exist in all 4 locales; only `person-card.tsx` needs the new `<Field label={labels.birthYear}>` and `deathYear` renders." That makes the no-op nature explicit and avoids the conflation.

---

## 6. What Works Well

- **Diagnostic accuracy.** Every verifiable bug claim checks out against the actual code.
- **HTML-native accordion choice (6.6E).** Zero JS, leverages platform, graceful degradation, correct browser-support claim. This is the right way to do this.
- **Sub-phase ordering.** Independent items first (6.6A sweep, 6.6B parser, 6.6E accordion, 6.6F breadcrumb), then dependent items (6.6D before 6.6G, 6.6H last). Rational.
- **Per-sub-phase DoD with concrete verification.** "Visual smoke at `/{locale}/genesis/chapter/5` (heavy with date ranges)" is a specific, falsifiable check, not vague.
- **Risk table with severity ratings.** Standard hygiene from prior phases, maintained.
- **Architectural compliance checklist.** DDD layering, Tailwind v4 OKLCH, Lucide stroke width, WCAG 2.2 AA — explicit checklist enforces consistency.
- **Open decision called out (6.6C).** Plan does not silently assume the recommendation; flags it for user decision.
- **Cross-cutting integrity sweep §9.** After-each-sub-phase audit is the right discipline for keeping meta-docs in sync.

---

## 7. Required Conditions Before Execution

In priority order:

1. **Fix 6.6D field-reorder list to preserve cross-book/inBook/generations/archaeology/regions/curiosities blocks.** Without this, six render paths disappear silently.
2. **Fix 6.6G content format conflict with parser.** Existing `c. -20`/`c. -25` historicalYear values for Miryam and Yosef must be normalized to bare integers. Document the project-wide convention: numeric anchor fields are bare integers; approximation/confidence belongs in lifespan/note fields. Add a 6.6H verification step that `parseInt` succeeds on every numeric anchor.
3. **Resolve 6.6H Eve/Sarai handling.** Pick one of: accept-the-gap, speculative-anchor-styling, or import-from-outside-scope. Document choice + Prime Directive reasoning in the editorial-log entry.
4. **Fix 6.6G claim-type labels for Herod.** DOCUMENTED pairs with LATER RECEPTION; HISTORICAL / ARCHAEOLOGICAL pairs with VERIFIED/PROBABLE. The Josephus citations are historical evidence, not reception.
5. **Drop the curiosities `name` attribute from 6.6E.** No `<details>` in CuriositiesBlock to conflict with.
6. **Re-read RULES-CORE.md §Book-Level Introductions before 6.6C.** Confirm the disclaimer is not as mandatory for introduction files as for companion files; the recommendation may have more flexibility than the plan claims.

The remaining items (§5) are improvements that can be addressed during execution.

---

## 8. Recommendation

**Approve after items 1–4 are addressed.** Items 1 and 2 are execution-blockers — running the plan as written would produce broken UI (item 1) or fail the timeline goal of 6.6H (item 2). Items 3 and 4 are governance-quality issues that should land before content is authored.

This is a small, focused polish phase. Most of the plan is correct and falsifiable. The two critical issues stem from the plan operating on the *symptoms* (missing fields, missing timeline figures) without fully tracing to the *mechanisms* (the field-render block has more parts than the plan enumerates; the historicalYear field is parseInt'd and rejects `c. ` prefixes).

After fixes, execution risk is low. The 5–6 hour estimate is plausible for the corrected scope.

The Standard-vs-Emergency Lock Protocol question from the prior cycle does not apply here — Phase 6.6 makes no rule changes (RULES-CORE.md is untouched). All changes are content authoring + UI polish.

---

**Audit complete.** Claims verified against the actual codebase, content files, and Rule 29 / Prime Directive.

---

## Post-revision review (2026-05-09)

After Claude Code revised `NEW_PLAN.md` per this audit, conducted a second-pass review of the revised plan. Findings below.

### Original audit items — absorption status

**Critical items (§3) — fully absorbed:**

- **§3.1 (6.6D field reorder)** — Resolved. Plan now has explicit 23-position render specification with `[unchanged top blocks]` / `[biographical-fields block — REORDERED]` / `[unchanged bottom blocks]` delimiters. Risk row in §6.6D explicitly marked "ELIMINATED."
- **§3.2 (numeric-anchor format)** — Resolved. Project-wide convention added (bare integers; approximation in lifespan/note text). Existing content fix table for Miryam/Yosef. parseInt verification commands in DoD. 6.6H now explicitly depends on this fix.

**Significant concerns (§4) — three resolved, one corrected against me:**

- **§4.1 (Eve/Sarai)** — Resolved. Option 1 chosen with Prime Directive reasoning. Sarai's Phase 12 deferral documented.
- **§4.2 (slug audit)** — Resolved. Added to 6.6B DoD with grep command.
- **§4.3 (Rule 29 disclaimer)** — **CORRECTED — my audit was wrong.** See §4.3 above for the correction.
- **§4.4 (ES regex residue)** — Resolved. ES-specific pre-sweep added.
- **§4.5 ("mid-list" description)** — Substance fixed in 6.6D action ("MOVED (was at position 15)"); original §1 table description still says "mid-list." Minor; not worth re-flagging.

**Minor items (§5) — all absorbed:** §5.1 (curiosities `name` dropped), §5.2 (line-order comment), §5.3 (dual residue grep), §5.5 (Herod claim-type → HISTORICAL/ARCHAEOLOGICAL — VERIFIED), §5.6 (test count baseline), §5.7 (screen-reader test), §5.8 (Bat-Sheva), §5.9 (i18n no-op).

**§5.4 (editorial-log entry count)** — Partially absorbed. Plan estimates 6–7 entries (up from 4–6); per-sub-phase breakdown referenced but not enumerated to the level §5.4 suggested. Acceptable as-is.

### New sub-phase 6.6I (dead-code + dead-content audit) — review

Added by user request, not from this audit. The sub-phase is well-designed: 3-stage gate (detect/classify/act), risk-tiered categories, explicit out-of-scope HIGH-risk deferrals (Domain types, dangling cross-references, markdown sections in parsed files, allow-list, CHANGELOG files), strong false-positive callouts for dynamic-key patterns (`t(\`book.${book}\`)`) and forward-looking parser aliases, REPORT-only stance for `depcheck`/`knip`, ordering LAST is correct.

**Three small refinements, none blockers:**

#### R1. Effort estimate is tight

Plan estimates 1.5–2 hours. Realistic estimate: **2.5–3 hours**. Reasons:

- Each `pnpm test && pnpm build && pnpm lint && pnpm content:lint` cycle takes ~2–3 minutes; with 5+ removal batches, that's 10–15 minutes just on test runs.
- Tool installs (`depcheck`, `knip`) plus initial classification reviews.
- Item #7's i18n-key script is a small project itself — handling template literals, nested keys (`people.inBook.${book}`), `useTranslations()` aliases, and conditional fallbacks is non-trivial. Easily 30 min for the script alone.
- Item #6 (knip) likely has high false-positive volume for this project. The `PersonEntry` schema has many fields parsed but not yet rendered (`verseCount`, `keyEvents`, `keySpeeches`, `firstMention`, `mentionedIn`, `historicityStatus`, `languagesSpoken`, `inLaws`). knip will flag many of these. Each requires manual KEEP-with-reason review.

**Suggested:** Re-estimate to 2.5–3 hours; total phase estimate moves from 7–8h to 8–9h.

#### R2. §7 Risks table missing a 6.6I-specific row

The Risks table at §7 has 7 rows covering 6.6A–6.6H. No 6.6I row. The 6.6I section internally describes a MEDIUM/LOW risk depending on gating discipline, but §7 should reflect this for consistency.

**Suggested:** Add row 8 to §7:

```
| 8 | 6.6I auto-removal false-positive (knip / depcheck / i18n script flag forward-API or dynamic-reference items) | MEDIUM without 3-stage gate; LOW with it | The 3-stage detect/classify/act gate is mandatory. REPORT-only for high-risk tools. Per-batch DoD verification (test + build + lint + content-lint) between every removal batch. Revertable per batch via git checkout. |
```

#### R3. 6.6I editorial-log entry is a category mismatch

Per Rule 28 (Review & Sign-off Workflow) and §EDITORIAL LOG SPECIFICATION §L1, the editorial log records translation/governance decisions: glossary deviations, formula variations, edition-policy interpretations, textual-variant decisions, gender-mismatch documentation, divine-name-policy, Rule 19 priority resolutions, reviewer disagreements, etc. A code-cleanup audit doesn't fit any of those triggers.

**Suggested:** 6.6I closure documentation belongs in `docs/audit/FIX_IMPLEMENTATION.md` (as a 6.6I closure entry, like Phase 6 closure was documented), or in a dedicated cleanup-log file. The editorial log can still receive entries for any rule-affecting findings (e.g., if a parser alias removal affects rule application or surfaces a glossary inconsistency), but the bulk of 6.6I's audit summary doesn't belong there.

### Forward-tracking items — surfaced for tracking, not blockers

**FT1. Familiar-name redundancy post-6.6B.** Item #11 in 6.6I is correctly deferred (out of 6.6 scope). After 6.6B's parser fix, `**Familiar name:** Adam` lines on entries where the heading-extracted value matches will be structurally redundant. This is a known future cleanup. Should land in `DEFERRED_TASKS.md` (or equivalent forward-tracking doc) so it isn't lost between phases.

**FT2. Orphan content `.md` files audit.** Not enumerated in 6.6I's 11 categories: are there `.md` files in `content/` that aren't loaded by any route or parser (e.g., a stale chapter file authored but not referenced)? Could be added as low-risk Item #12, or deferred explicitly with a tracking item. Not a 6.6I blocker; mentioning so it isn't silently missed.

### Verdict on revised plan

**Plan is ready for execution.** The two original execution-blockers (§3.1, §3.2) are fully resolved with explicit, testable specifications. The §4.3 dispute resolved correctly against this audit. 6.6I is sound; the three R-items above are refinements, not gating.

After the three R-items are folded in (effort re-estimate, §7 risk row, 6.6I closure-log relocation) and the two FT-items are tracked, execute in the order specified in §4.

---

**Audit and post-revision review complete.** All findings verified against the actual codebase, content files, and RULES-CORE.md. One self-correction logged (§4.3).
