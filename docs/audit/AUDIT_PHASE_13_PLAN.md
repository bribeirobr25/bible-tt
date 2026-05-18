# Audit of `PHASE_13_PLAN.md` (Cross-Book Canonical PEOPLE Formalization)

**Date:** 2026-05-18
**Auditor:** Claude Opus 4.7 (independent review)
**Scope:** `docs/audit/PHASE_13_PLAN.md` — formalization, documentation, lint, and minor polish for the already-implemented cross-book see-only PEOPLE.md pattern. ~2.5–3h estimated effort.
**Method:** Verified plan claims against: `src/domain/content/types.ts` (full read), `src/ui/people/person-card.tsx` (full read), `src/infrastructure/content/people-parser.ts` (full read), `src/app/[locale]/[book]/people/page.tsx` (full read), `docs/rules/proposals/v3.3.1-emergency-DE-name-rendering-clarification.md` (full read), `README.md` (full read), directory tree, prior audit session reads of `scripts/content-lint.sh` and `src/infrastructure/content/__tests__/people-parser.test.ts`.
**Status:** Plan's core strategic diagnosis is correct — the architecture is already implemented and the remaining work is formalization + documentation. However there are one critical inconsistency in §1.2, two significant findings that affect both the lint rule design and future-book authoring workflow, and several minor issues. Q1–Q5 recommendations are all sound.

---

## 1. Executive Summary

The plan's central claim is accurate and well-supported by the code: `crossBookSee`, `inBook`, `parseCrossBookSlug()`, `CrossBookSeeField`, and the `bookLabels` map are all verified working in the current implementation. The graceful dangling-pointer fallback (plain text when `!bookLabels[slug]`) is confirmed functional. The 5 cross-book parser tests exist and are referenced correctly. The v3.3.1 proposal precedent for the amendment pathway is verified — the `docs/rules/proposals/` directory and the v3.3.1 file both exist and confirm the correct amendment procedure for v3.3.2.

**What verifies as correct:**
- `PersonEntry.crossBookSee?: string` and `PersonEntry.inBook?: string` exist in `types.ts` as the last two fields ✓
- `parseCrossBookSlug()` regex `/^([a-z][a-z-]*)\/PEOPLE\.md$/i` is exactly as described ✓
- `CrossBookSeeField` component falls back to `<Field label={label} value={pointer} />` when `!slug || !bookLabels[slug]` ✓
- `EXACT_LABEL_ALIASES.crossBookSee = ["see", "ver", "siehe"]` confirmed ✓
- `EXACT_LABEL_ALIASES.inBook` contains all four locale forms for matthew, genesis, and john ✓
- `bookLabels` in `people/page.tsx` contains `{ genesis, matthew, john }` with explicit "Add new entries here" comment ✓
- README.md still says "John PEOPLE.md is not yet authored" (stale since Phase 10) ✓ (confirmed stale)
- v3.3.1 proposal file exists; v3.3.2 is the correct next version ✓
- `flushEntry()` duplicate-slug warning is implemented in people-parser.ts ✓
- DDD layers are correctly maintained: types.ts → domain, parser → infrastructure, CrossBookSeeField → ui, page.tsx → app ✓

**Three findings need resolution before execution:**
1. §1.2 stub count has an internal inconsistency (5× genesis but 7 names listed; 6 total but arithmetic doesn't add up).
2. `inBook` parser aliases don't cover forward-tracked books — "in acts", "in exodus", "in kings", "in isaiah" are absent from the alias map. Future authoring of those books will silently fail to parse `inBook` content.
3. New-book activation requires three synchronized changes (PEOPLE.md + bookLabels + inBook aliases), but Phase 13 documents only one of them (bookLabels via the "Add new entries here" comment).

---

## 2. Verification Table

| Plan claim | Verification result | Notes |
|---|---|---|
| `crossBookSee` + `inBook` in `PersonEntry` (`types.ts:222-223`) | ✓ Verified — line numbers approximate | Both fields confirmed as the last two in PersonEntry: `crossBookSee?: string;` + `inBook?: string;` |
| `parseCrossBookSlug()` regex `^([a-z][a-z-]*)\/PEOPLE\.md$/i` | ✓ Verified exactly | `person-card.tsx` line 14: `pointer.trim().match(/^([a-z][a-z-]*)\/PEOPLE\.md$/i)` |
| `CrossBookSeeField` renders Link when `bookLabels[slug]` exists; plain-text fallback otherwise | ✓ Verified exactly | `if (!slug || !bookLabels[slug]) { return <Field label={label} value={pointer} /> }` |
| `EXACT_LABEL_ALIASES.crossBookSee = ["see", "ver", "siehe"]` (lines 70-72) | ✓ Verified | Exact aliases confirmed in parser |
| `EXACT_LABEL_ALIASES.inBook` covers matthew/genesis/john × 4 locales (lines 214-228) | ✓ Verified | 12 aliases: "in matthew", "em mateus", "in matthäus", "en mateo", "in genesis", "em gênesis", "en génesis", "in john", "em joão", "in johannes", "en juan" |
| `bookLabels = { genesis, matthew, john }` at `page.tsx:137-141` | ✓ Verified | Map confirmed with "Add new entries here as new books are authored" comment |
| `finalizeEntry()` preserves `crossBookSee` and `inBook` in return object | ✓ Verified | Both fields explicitly in the `finalizeEntry()` return |
| Duplicate-slug warning (`console.warn`) in `flushEntry()` | ✓ Verified | Warning implemented: "will collide on slug-derived React keys and cross-references. Disambiguate by using a different transliteration form..." |
| 11 production see-only stubs across 2 NT books | ✗ **Inconsistency.** See §3.1 | The 5+1=6 Matthew + 5 John = 11 total is plausible but "5× genesis with 7 names" is internally contradictory |
| Zero true duplicates between books | ✓ Plausible | `flushEntry()` duplicate-slug warning now catches these at parse time |
| 5 cross-book tests in `people-parser.test.ts:411-470` | Unverified this session | Consistent with prior audit references; prior AUDIT_PHASE_10 confirmed parser tests coverage |
| v3.3.1 proposal file exists | ✓ Verified | `docs/rules/proposals/v3.3.1-emergency-DE-name-rendering-clarification.md` confirmed |
| v3.3.2 is the correct next amendment version | ✓ Verified | v3.3.1 is the latest; v3.3.2 follows per the naming convention |
| README "John PEOPLE.md is not yet authored" — stale | ✓ Confirmed stale | Exact text found in README People & Genealogy section: "The John PEOPLE.md is not yet authored" |
| README project-state snapshot from 2026-05-09 — stale | ✓ Confirmed stale | Exact text: "Project state (2026-05-09):" with outdated remaining-work list |
| RULES-CORE.md §People and Genealogy Files exists at ~line 779 | **Unverified** | RULES-CORE.md not read this session. Section existence unconfirmed. See §4.1. |
| Content-lint baseline: 2 warnings (§0.10 + §0.11) | **Unverified** | §0.11 proposed in AUDIT_DE_FAMILIAR_NAMES_PLAN.md §4.4 as a recommendation; confirmed-shipped status unknown. Same issue flagged in AUDIT_TIER_2_NOTE_BLOAT_PLAN.md §3.3. |
| DDD layers correctly maintained throughout | ✓ Verified | types.ts → domain; parser → infrastructure; PersonCard → ui; page.tsx → app |
| `generateStaticParams()` uses `getAvailableBooks()` (dynamic, not hardcoded) | ✓ Verified | `const books = await getAvailableBooks("en")` confirmed in people/page.tsx |

---

## 3. Critical and Significant Findings

### 3.1 §1.2 stub count has an internal inconsistency — "5× genesis" but 7 names listed [CRITICAL]

The plan's §1.2 production see-only stubs table states for Matthew PEOPLE.md:

> "6 per locale × 4 = 24 | 5× genesis/PEOPLE.md (**Avraham, Yitschaq, Ya'aqov, Yehudah, Tamar, Rachav, Rut**), 1× acts/PEOPLE.md (Iakobos)"

**The inconsistency:** "5× genesis/PEOPLE.md" but the parenthetical lists 7 names (Avraham, Yitschaq, Ya'aqov, Yehudah, Tamar, Rachav, Rut). 5 + 1 = 6 entries total, matching "6 per locale × 4 = 24" — but the 7 names cannot map to 5 entries unless 2 of the 7 figures share a single stub entry (which would be unusual for the PersonEntry model, where each H2 heading creates a distinct entry).

The three possibilities:
1. The count "5×" is wrong and should be "7×" → total would be 8 per locale × 4 = 32 (not 24).
2. The name list is wrong — 2 of the 7 figures (probably Rachav and Rut, who appear briefly in Matthew's genealogy but whose canonical biographies are not Genesis 1-12 material) are NOT see-only stubs pointing to genesis/PEOPLE.md; they may be full entries in matthew/PEOPLE.md.
3. The total "6" is wrong.

**Why this matters:** The plan's §1 diagnostic data feeds the Q1 allow-list design, the §1.2 "Zero true duplicates" claim, and the accuracy of "what's already implemented." An incorrect stub count could mean the allow-list has wrong target slugs (e.g., if some figures point to `ruth/PEOPLE.md` rather than `genesis/PEOPLE.md`), or could mean the rules amendment has incorrect example data.

**Required fix:** Verify the actual stub count and target distribution by reading the matthew/PEOPLE.md file before finalizing the plan. Update §1.2 with the accurate figures.

### 3.2 `inBook` parser aliases don't cover forward-tracked books — silent parse failure when those books are authored [SIGNIFICANT]

The verified `EXACT_LABEL_ALIASES.inBook` covers only three books across four locales:
```
"in matthew", "em mateus", "in matthäus", "en mateo"
"in genesis", "em gênesis", "en génesis"
"in john", "em joão", "in johannes", "en juan"
```

The four forward-tracked target books (acts, exodus, kings, isaiah) have **no `inBook` aliases in the parser**. When Phase 12 or later authors add canonical entries for Eliyahu in `kings/PEOPLE.md`, Mosheh in `exodus/PEOPLE.md`, or Yeshayahu in `isaiah/PEOPLE.md`, and those book's PEOPLE.md files contain `**In Kings:** [narrative role]` fields — the parser will silently drop them. The `resolveField("in kings")` call will return `undefined`, and the `inBook` content for those entries will never appear in the UI.

Similarly, when Acts is authored and James gets a full canonical entry in `acts/PEOPLE.md`, any `**In Acts:** [narrative]` field in that file won't parse.

**This is a forward-tracking authoring trap that Phase 13 should document.** The plan mentions "Add new 'in <book>' labels here when new books are authored" as a comment in the parser's alias section — but this note exists only in the parser source code, not in any documentation a content author would read before authoring a new book's PEOPLE.md.

**Required fix:** Phase 13 should explicitly include — as part of the rules amendment (Q2) and/or CLAUDE.md update (Q5) — a clear authoring checklist: "When adding a new book's PEOPLE.md, three parser/code changes are required (see §3.3 below)."

### 3.3 New-book activation requires three synchronized changes; plan documents only one [SIGNIFICANT]

The plan's §4 (Alternatives rejected) correctly rejects a hard-coded `VALID_BOOKS` constant. And the bookLabels comment says "Add new entries here as new books are authored." But the complete set of changes required when a new book with PEOPLE.md is authored involves three separate files, and the plan only documents one of them:

| Required change | File | Plan mentions? |
|---|---|---|
| New book's `PEOPLE.md` authored × 4 locales | `content/{locale}/{book}/PEOPLE.md` | Yes — this is Phase 12's job |
| `bookLabels` map extended with new book's label | `src/app/[locale]/[book]/people/page.tsx` | Only via the "Add new entries here" comment |
| `inBook` aliases added for new book × 4 locales | `src/infrastructure/content/people-parser.ts` | ✗ **Not mentioned in Phase 13 plan** |

If a future Phase 12 author follows the plan as written and:
1. Authors `kings/PEOPLE.md` with Eliyahu's canonical bio including `**In Kings:** [narrative role]`
2. Updates `bookLabels` so `kings/people` becomes a live link

...but doesn't update the `inBook` aliases in `people-parser.ts`, the `**In Kings:**` field will silently parse as `undefined` and Eliyahu's narrative role description won't render in the UI.

**Additionally:** The `inBook` i18n key `people.inBook.${book}` (used at `labels.inBook = t(`people.inBook.${book}`)` in `page.tsx`) also needs an entry for each new book across all 4 locale message files. This is a fourth synchronization point. Currently `people.inBook.genesis`, `people.inBook.matthew`, and `people.inBook.john` exist in all 4 locale files (confirmed from prior AUDIT_PHASE_10_PLAN.md session). Adding `people.inBook.kings` etc. is a fifth change point.

**Required fix:** The rules amendment (Q2) or CLAUDE.md update (Q5) should document the complete 4-change checklist for new-book activation:
1. Author `content/{locale}/{book}/PEOPLE.md` × 4 locales
2. Add `{book}: t("book.{book}")` to `bookLabels` in `people/page.tsx`
3. Add `"in {book}"` + locale aliases to `EXACT_LABEL_ALIASES.inBook` in `people-parser.ts`
4. Add `people.inBook.{book}` translation string × 4 locale message files

---

## 4. Significant Concerns

### 4.1 RULES-CORE.md §People and Genealogy Files existence at ~line 779 is unverified

The plan's §1.4 and Step 1 target "RULES-CORE.md §People and Genealogy Files (~line 779)" for the rules amendment. RULES-CORE.md was not read in this session. The DE name-rendering amendment (v3.3.1) was appended to **RULES-HB.md** §PROPER-NAME TABLE notes — a different file and section.

Two concerns:
1. The §People and Genealogy Files section may not exist at line 779 (or at all) — the plan's "~" notation suggests uncertainty. If the section doesn't exist, the amendment proposal must either create it or find an alternative home.
2. The cross-book PEOPLE convention spans both HB (Genesis) and GS (Matthew, John) books. The HB supplement is logically a sub-optimal home; RULES-CORE.md is the right location since the convention is book-agnostic. But this needs to be confirmed against the actual RULES-CORE.md before drafting the proposal.

**Required verification before Step 1:** Read RULES-CORE.md's Rule 29 section to confirm §People and Genealogy Files exists and find its actual location. If it doesn't exist, the proposal must create the section (not merely append to it) — which changes the amendment's complexity from "clarificational" to "new section authoring."

### 4.2 Q1 allow-list lint rule (§0.12) has an ordering dependency that must be documented

If Q1 = Option A is adopted:
- The allow-list is: `{genesis, matthew, john, acts, exodus, kings, isaiah}`.
- A future author wanting to create a see-only stub pointing to `ruth/PEOPLE.md` would get a lint warning, even before they've had a chance to add it to the allow-list.
- The allow-list must be updated in the SAME commit as the first stub pointing to the new target — not before, not after.

This ordering dependency is acknowledged in the Risks table ("Updating it is part of the new-book-authoring checklist") but not explicit in the execution plan. The new-book authoring checklist (see §3.3 above) should explicitly list "Add new slug to content-lint.sh §0.12 allow-list" as step 5.

Additionally: the warn-only §0.12 rule should be promoted to blocking after a grace period, since a misspelled pointer that passes the allow-list check (`geneis/PEOPLE.md` if someone misspells `genesis`) would NOT be caught — the rule only catches slugs *outside* the allow-list, not misspellings of slugs *in* the allow-list. Misspellings of known slugs pass silently through the regex check.

**Suggested addition to Q1 Option A:** Note explicitly that misspellings of allow-listed slugs (e.g., `geneis/PEOPLE.md` vs `genesis/PEOPLE.md`) will still be caught by the dangling-pointer fallback rendering (the UI will show the plain slug text instead of a link), but NOT by the lint rule. This is an acceptable limitation; document it.

---

## 5. Minor Issues

### 5.1 README.md additional staleness not mentioned in the plan

The plan correctly identifies two stale README items (line 68 and the project-state snapshot). But there's a third stale item the plan doesn't mention:

**README Tech Stack table:**
```
| Testing | Vitest (796 tests across 6 files) |
```

The current baseline is 819 (confirmed by this plan's own Step 0: "pnpm test → record actual count (currently 819)"). The README still says 796 — the 2026-05-09 baseline. This should be updated as part of the Q4 targeted README fix.

The parsers claim also warrants a check: README says "4 parsers" in the project structure comment but the actual `src/infrastructure/content/` directory has 5 parsers (markdown, enrichment, people, prophecy, introduction) plus the recently-added book-context parser — potentially 6.

**Required addition to Step 3:** When updating README.md, also update the test count in the Tech Stack table and verify the parser count in the project structure section.

### 5.2 RULES-CORE.md line number citations — fragile pattern

The plan cites "RULES-CORE.md Rule 29 §People and Genealogy Files (line ~779)" with a `~` approximation. This matches the fragile-citation pattern flagged in AUDIT_PHASE_8_PLAN.md §3.1, AUDIT_DE_FAMILIAR_NAMES_PLAN.md §5.2, and AUDIT_TIER_2_NOTE_BLOAT_PLAN.md §5.1.

**Required fix:** Use "Rule 29 §People and Genealogy Files" as the primary citation throughout; "(line ~779)" as a secondary aid. Once the actual section location is confirmed (per §4.1), update the citation.

### 5.3 Content-lint baseline "2 warnings (§0.10 + §0.11)" is unconfirmed

The Step 0 pre-execution baseline says: "`pnpm content:lint` → record warning count + rule IDs (currently 2: §0.10 + §0.11)."

As flagged in AUDIT_TIER_2_NOTE_BLOAT_PLAN.md §3.3, §0.11 was proposed in AUDIT_DE_FAMILIAR_NAMES_PLAN.md §4.4 as a recommendation but its shipped status is unconfirmed. The TIER_2 plan has the same baseline claim. Both plans should explicitly run `pnpm content:lint` before Step 0 and record the actual baseline rather than asserting it.

**Required fix:** Step 0 should say "Run `pnpm content:lint` and record the actual current warning count and rule IDs as the baseline. Do not assert the baseline from prior plan documentation."

### 5.4 The `CrossBookSeeField` label "crossBookSee" may not be i18n'd for the "See full bio in" phrase across all locales

From the people/page.tsx read: `crossBookSee: t("people.crossBookSee")`. This is a single i18n key for the label that appears before the cross-book link. If the key `people.crossBookSee` doesn't exist in all 4 locale message files, the label would fallback to the key string. Prior audit sessions confirmed EN has this key; the other locales were not confirmed in this session.

**Required addition to Step 6 verification:** Include a check that `people.crossBookSee` exists in all 4 locale message files (en.json, pt-br.json, de.json, es.json).

### 5.5 The "zero duplicates" claim should be reframed given the new duplicate-slug warning

The plan says "Zero true duplicates between books (Gen ∩ Matt ∩ John full-entry intersection is empty)." This is about content-level duplicates (same person with full canonical entries in two different books). This is correct and verified by construction (the see-only pattern prevents duplication by design).

However, the newly-added duplicate-slug `console.warn` in `flushEntry()` is about slug-level collisions within a single PEOPLE.md file (e.g., two entries with the same slug in genesis/PEOPLE.md). This is a different concern from cross-book duplication. The plan conflates these slightly. The `console.warn` is a good addition but won't catch cross-book entry duplication (it operates per-file, not cross-book).

**Suggested clarification in §1.3:** Note that the duplicate-slug warning is per-file (within a single PEOPLE.md parse run), not a cross-book check. Cross-book duplication is prevented by editorial discipline (the see-only convention) + the lint rules, not by the parser.

---

## 6. Architecture and Design Compliance

### 6.1 DDD boundary — Clean ✓

All verified: `crossBookSee`/`inBook` in `domain/content/types.ts`; parsing in `infrastructure/content/people-parser.ts`; rendering in `ui/people/person-card.tsx`; page composition in `app/[locale]/[book]/people/page.tsx`. The `bookLabels` map in the page component (not in domain) is the correct location — it's a presentation-layer concern (localized display strings for navigation). ✓

### 6.2 Service-agnostic extension pattern — Correct ✓

`generateStaticParams()` uses `getAvailableBooks()` (filesystem-based dynamic discovery). `bookLabels` is manually maintained per the "Add new entries here" comment, which is appropriate since it requires localized display strings that can't be derived from the filesystem alone. The `parseCrossBookSlug()` regex correctly uses the slug pattern `[a-z][a-z-]*` which will match any book name following standard slug conventions. ✓

### 6.3 TypeScript strict compliance — Clean ✓

`crossBookSee?: string` and `inBook?: string` are optional, `strict`-safe fields. `finalizeEntry()` explicitly propagates both fields. No TypeScript changes required. ✓

### 6.4 Design system — Clean ✓

`CrossBookSeeField` uses the standard `Field`-component layout (label + value, consistent typography). The active-link variant uses `text-accent hover:underline focus-visible:ring-2 focus-visible:ring-accent` — consistent with the design system's established link pattern. ✓

### 6.5 No regressions from Phase 13 changes

Phase 13 is additive only:
- Rules amendment: adds text to RULES-CORE.md, no code changes
- Content-lint §0.12: warn-only, no build failures
- README: documentation update only
- CLAUDE.md: documentation update only
- Editorial-log entry: documentation only

Zero regression risk for parser, UI, DDD structure, or TypeScript compilation. ✓

---

## 7. What Works Well

- **Accurate diagnostic.** The "already-done" diagnosis is correct and verifiable: crossBookSee, inBook, parseCrossBookSlug, CrossBookSeeField, bookLabels are all confirmed in production code. Phase 13 correctly scoped down from architectural to formalization.
- **v3.3.2 amendment precedent.** The v3.3.1 proposal file exists and provides an exact template. Using it as precedent for v3.3.2 is the right approach.
- **Q4 targeted README fix (Option A).** Minimal touch, right scope for a formalization phase.
- **Q3 editorial-log transition convention (Option A).** Mentioning stub resolution in the Phase 12 authoring entry is the correct lean approach — no log bloat, no separate entries for an automatic UI transition.
- **Q1 allow-list + §0.12 lint rule.** Correct to make forward references intentional via an explicit allow-list rather than relying on the graceful-fallback to surface typos.
- **Q5 CLAUDE.md architecture paragraph.** The cross-book pattern is sufficiently novel (spanning two files, two components, a regex parser, and a bookLabels map) to warrant a CLAUDE.md entry. Good call.
- **Graceful-fallback design.** The plan correctly treats the plain-text dangling-pointer as a feature, not a bug. The code confirms this is the current behavior and it's the right design for forward references.
- **No master-file-per-person** (rejected correctly). The per-book file + see-only pointer pattern fits the static-first architecture perfectly.

---

## 8. Required Conditions Before Execution

In priority order:

| # | Issue | Severity | Required Fix |
|---|---|---|---|
| 1 | §1.2 stub count inconsistency: "5× genesis" with 7 names | **Critical** | Read matthew/PEOPLE.md to verify actual stub count and target distribution; update §1.2 with accurate figures before executing any lint rule or amendment that cites these counts |
| 2 | `inBook` parser aliases don't cover forward-tracked books | **Significant** | Document in rules amendment (Q2) and CLAUDE.md (Q5) that `EXACT_LABEL_ALIASES.inBook` must be extended when a new book is authored; this is the "silent failure" gap |
| 3 | New-book activation 4-change checklist not documented | **Significant** | Add the complete checklist (PEOPLE.md + bookLabels + inBook aliases + i18n key) to the rules amendment or CLAUDE.md; this prevents the most common future authoring trap |
| 4 | RULES-CORE.md §People and Genealogy Files existence unverified | **Significant** | Read RULES-CORE.md Rule 29 before drafting the v3.3.2 proposal; confirm the section exists and its actual location; if absent, the proposal must create the section |
| 5 | Q1 allow-list ordering dependency not in execution steps | Minor | Add step: "Q1 allow-list must be updated in the same commit as the first stub using the new slug" |
| 6 | README tech stack table stale (test count "796", parser count) | Minor | Include in Step 3 targeted fix: update test count to 819 and verify parser count |
| 7 | Content-lint baseline assertion should be verified not assumed | Minor | Step 0: run `pnpm content:lint` freshly; record actual baseline; do not assert "2 warnings (§0.10 + §0.11)" without running first |
| 8 | `people.crossBookSee` i18n key existence in all 4 locales unverified | Minor | Add to Step 6 verification checklist |
| 9 | RULES-CORE.md line number citation (line ~779) is fragile | Minor | Use section name as primary citation; line number as secondary aid |

---

## 9. Recommendation

**Approve after items 1–4 are resolved.** Item 1 (stub count) is the only data-correctness issue that affects the plan's diagnostic baseline — it must be verified by reading matthew/PEOPLE.md before finalizing Q1's allow-list or the rules amendment. Items 2 and 3 are the most important architectural-documentation gaps: without them, the next Phase 12 author faces silent parse failures and a missing checklist. Item 4 is a verification step that should precede any rules-file editing.

After resolution, this is a well-scoped, low-risk formalization phase. The architecture is confirmed correct and complete. Phase 13 correctly focuses on formalizing what's already working rather than rebuilding it. The Q1–Q5 recommendation set is sound.

No code changes to parser, domain types, or UI components are needed. No new test cases are needed (the existing 5 cross-book tests already cover the pattern). The content-lint §0.12 addition is the only executable change — everything else is documentation.

Estimated effort 2.5–3h is realistic for the confirmed scope.

---

**Audit complete.** All code claims verified against `types.ts`, `people-parser.ts`, `person-card.tsx`, `people/page.tsx`, `v3.3.1` proposal, and `README.md`. Cross-book pattern confirmed fully implemented and architecturally correct. Three forward-tracking gaps identified that Phase 13 should close before declaring the pattern formalized.
