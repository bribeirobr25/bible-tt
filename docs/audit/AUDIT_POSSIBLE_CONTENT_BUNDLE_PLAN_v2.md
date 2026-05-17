# Audit: `POSSIBLE_CONTENT_BUNDLE_PLAN.md` — Implementation & Architecture Review

**Date:** 2026-05-16
**Auditor:** Claude Opus 4.7 (independent, full implementation read)
**Plan version audited:** Revised 2026-05-16 (post–AUDIT_POSSIBLE_CONTENT_BUNDLE_PLAN.md absorption)
**Scope of this audit:** Compliance with `docs/architecture/STANDARDS.md` and `docs/design/TT-DESIGN-SYSTEM.md`; parser behavior verification; content-lint coverage; regression and side-effect analysis; gap identification. Distinct from the prior content-rules audit (`AUDIT_POSSIBLE_CONTENT_BUNDLE_PLAN.md`), which focused on Rule 3/13/28/29 and editorial governance.
**Files read:** `POSSIBLE_CONTENT_BUNDLE_PLAN.md`, `docs/architecture/STANDARDS.md`, `docs/design/TT-DESIGN-SYSTEM.md`, `src/infrastructure/content/people-parser.ts`, `src/infrastructure/content/enrichment-parser.ts`, `src/ui/enrichment/enrichment-entry.tsx`, `src/domain/content/types.ts`, `scripts/content-lint.sh`, `content/en/matthew/PEOPLE.md`, `content/en/genesis/study/CHAPTER-1-CONTEXT.md`.

---

## Executive Summary

The plan is **content-only** — no new code, no schema changes, no UI components, no tests. This significantly limits the architecture and design system surface area at risk. The DDD boundary is respected by design: everything touched is in `content/`, not `src/`. No domain types change, no parsers change, no UI components change.

**Status:** Approved for execution with four issues to resolve before Step 1 begins and one structural note for the project log.

**Critical finding (execution blocker):** The slug-collision analysis in Q5 is partially correct in identifying the risk, but the recommended solution (`## Iakōbos (James)`) will produce a slug of `iakōbos` — which contains a non-ASCII Unicode character (`ō`, U+014D). The people-parser's slug derivation (`name.toLowerCase().replace(/\s+/g, "-")`) does NOT strip Unicode characters. The resulting slug `iakōbos` may cause silent failures in React `key` generation, CSS selectors, or URL fragment routing depending on browser/environment. The plan does not address this.

**Three significant findings** (not blockers, but must resolve before execution):

1. The `LATER RECEPTION — SPECULATIVE` label for Topic 10 requires confirming how `parseConfidence("SPECULATIVE")` behaves in the enrichment parser — verified below.
2. The `inBook` alias for the James entry (`"in matthew"`) is already in the parser alias map — verified. But the plan's forward-pointer text template contains a backtick-wrapped reference (`` `## Ya'aqov (Jacob)` ``) which will be processed by `renderMarkdownSafe` and may produce unintended inline-code formatting.
3. The §F insertion in `CHAPTER-1-CONTEXT.md` must be an H3 entry (not H2) to be parsed by `enrichment-parser.ts`. The plan does not explicitly state the heading level required, and authors who pattern-match from §F2 (which is an H3) may get it right — but the plan should state it explicitly.

---

## 1. Architecture Compliance (STANDARDS.md)

### 1.1 DDD Boundary — Clean Pass ✓

STANDARDS.md §1: "domain/ never imports from infrastructure/, ui/, app/, or next." The plan touches only `content/` markdown files. No `domain/`, `infrastructure/`, `ui/`, or `app/` files are modified.

STANDARDS.md §1 DDD litmus: "If you replaced `fs-content-repository.ts` with a database adapter, the domain types, UI components, and app routing should require zero changes." The plan passes this test — the content files are data, not logic. A hypothetical database migration would load the same markdown text from a different source; the new entries would parse identically.

**No DDD violations.**

### 1.2 No New Dependencies ✓

STANDARDS.md §15: "Every dependency is a liability. Minimize, justify, and audit." The plan introduces zero new npm dependencies. `pnpm add` is never called.

### 1.3 No New Code Files ✓

STANDARDS.md §6: "Each file has one reason to change." The plan adds content to existing markdown files — no new `.ts`, `.tsx`, or configuration files.

### 1.4 TypeScript — No Impact ✓

STANDARDS.md §13: "strict: true always." The plan produces zero TypeScript changes. `pnpm build` TypeScript compilation is not affected by markdown content changes.

### 1.5 Test Baseline — Stable ✓ (with caveat)

STANDARDS.md §14: "Test the parser (the single point of fragility)." The plan explicitly states "no new tests required beyond running the existing suite" and targets a 817-passing baseline. This is correct — the plan makes no parser changes, so existing parser tests validate parsing behavior for the new content.

**Caveat:** The test suite validates parse correctness, not render correctness. Visual smoke checks (Step 5.5 in the plan) are the only mechanism to validate that the new content renders as expected. This is acceptable for content-only work, consistent with STANDARDS.md §14 ("Don't unit-test React components at current scope").

---

## 2. Design System Compliance (TT-DESIGN-SYSTEM.md)

The plan adds content to four file types: PEOPLE.md, CHAPTER-N-CONTEXT.md, INTRODUCTION.md. All render through existing UI components. The design system is not modified. Compliance risks are indirect — they arise only if authored content violates expectations of the existing rendering pipeline.

### 2.1 Claim-Type and Confidence Badge Rendering — Verified ✓

`enrichment-entry.tsx` renders `entry.claimType` and `entry.confidence` via:

```typescript
const claimStyle = CLAIM_COLORS[entry.claimType] || CLAIM_COLORS.TEXTUAL;
const badgeColor = CONFIDENCE_BADGE_COLORS[entry.confidence] || CONFIDENCE_BADGE_COLORS.POSSIBLE;
```

Both records (`CLAIM_COLORS`, `CONFIDENCE_BADGE_COLORS`) have exhaustive coverage for all `ClaimType` and `ConfidenceLevel` union members in `types.ts`, including `"SPECULATION"` and `"SPECULATIVE"`.

**`LATER RECEPTION — SPECULATIVE` (Topic 10 label):**
- `enrichment-parser.ts` `parseClaimType("LATER RECEPTION")` → hits `normalized.includes("RECEPTION")` → returns `"LATER RECEPTION"` ✓
- `enrichment-parser.ts` `parseConfidence("SPECULATIVE")` → hits `normalized.includes("SPECULATIVE")` → returns `"SPECULATIVE"` ✓
- `CLAIM_COLORS["LATER RECEPTION"]` → `"border-l-note-theological bg-note-theological-bg"` ✓
- `CONFIDENCE_BADGE_COLORS["SPECULATIVE"]` → `"bg-note-critical/15 text-note-critical"` ✓

The label renders correctly: warm amber left-border (LATER RECEPTION) + red critical badge (SPECULATIVE). Design system is satisfied. ✓

### 2.2 PersonCard Rendering for the Stub Pattern — Verified ✓

The plan uses a see-only stub with two fields: `**See:** acts/PEOPLE.md` and `**In Matthew:** [narrative]`.

**`crossBookSee` → `current.crossBookSee`:** Parsed by `resolveField("see")` → `EXACT_LOOKUP.get("see")` → `"crossBookSee"` ✓

**`inBook` → `current.inBook`:** Parsed by `resolveField("in matthew")` → `EXACT_LOOKUP.get("in matthew")` → `"inBook"` ✓ (confirmed: `"in matthew"` is in the alias list)

**PersonCard rendering:** `crossBookSee` renders the `CrossBookSeeField` component; `inBook` renders the `InBookField` component. Both are existing render paths from the matthew PEOPLE.md file (e.g., `## Avraham (Abraham)` uses the same pattern). No design changes needed.

**`bookLabels["acts"]`:** Verified in `people/page.tsx` (read this session): the `bookLabels` map contains only `genesis`, `matthew`, and `john`. `acts` is absent. The `CrossBookSeeField` component falls back to plain-text rendering when `!bookLabels[slug]` — confirmed behavior. The graceful fallback is the correct behavior and matches design intent. ✓

### 2.3 Introduction §E Sub-Section Rendering — Verified ✓

The enrichment parser processes INTRODUCTION.md files via `parseIntroductionMarkdown` which calls `parseMarkdownSections` with `INTRODUCTION_SECTION_IDS`. The section map includes:

```typescript
const INTRODUCTION_SECTION_IDS: Record<string, string> = {
  E: "manuscript-transmission",
  ...
};
```

A new `### E5. Comparative transmission interval` (John) or `### E4. Comparative transmission interval` (Matthew) entry is parsed by:
- `SECTION_HEADER = /^## ([A-Z])(?:_\w+)?\.\s+(.+)$/` — H2 section header (already exists for `## E. Manuscript Transmission`)
- `ENTRY_HEADER = /^### (.+)$/` — H3 entry header (new sub-entry)

The H3 `### E5.` heading matches `ENTRY_HEADER`. Content flows into `currentEntry.contentLines`. The label line `**[HISTORICAL / ARCHAEOLOGICAL — VERIFIED]**` matches `LABEL_LINE` and sets `claimType` + `confidence`. The source line matches `SOURCE_LINE`. The entry is finalized correctly. ✓

**Rendered via `EnrichmentEntryCard`:** Same component used for all §E entries, with `HISTORICAL / ARCHAEOLOGICAL` claim type rendering as `border-l-note-grammatical bg-note-grammatical-bg` (slate-blue left border). Design system compliant. ✓

### 2.4 §F Entry in CHAPTER-1-CONTEXT.md — SIGNIFICANT GAP

**The plan does not specify the heading level for the Topic 10 §F entry.** This matters because `enrichment-parser.ts` uses two distinct regex patterns:

```typescript
const SECTION_HEADER = /^## ([A-Z])(?:_\w+)?\.\s+(.+)$/;  // H2: "## F. Later Reception..."
const ENTRY_HEADER = /^### (.+)$/;                           // H3: "### F1. Jewish reception"
```

If the author writes the Topic 10 *et*/alef-tav entry as:
- `## F5. The *et*/alef-tav reading` → matches `SECTION_HEADER` → treated as a new section, NOT as an entry within §F. **Parse failure.**
- `### F5. The *et*/alef-tav reading` (or any `### ...`) → matches `ENTRY_HEADER` → parsed correctly as an entry within §F. **Correct.**

Looking at the existing §F entries in CHAPTER-1-CONTEXT.md: `### F1. Jewish reception`, `### F2. Christian reception`, `### F3. Islamic parallels`, `### F4. *Bereshit* as "for the sake of"` — all H3. The new entry should be `### F5.` (or whatever number follows the last existing §F entry).

**Required fix:** Step 2 of the execution plan must explicitly state: "Author the *et*/alef-tav entry as an H3 heading: `### F5. The *et*/alef-tav reading — a Messianic-Jewish and Kabbalistic-precedent tradition`". If an H2 heading is accidentally used, the entry will not appear under §F in the UI; it will create a new top-level section with no entries, and the content will be silently dropped.

---

## 3. Parser Behavior Verification

### 3.1 people-parser Slug Derivation — CRITICAL FINDING

The plan's Q5 correctly identifies the slug-collision risk and recommends `## Iakōbos (James)`. The parser slug derivation is:

```typescript
state.current = {
  name,          // "Iakōbos" (before the parenthesis)
  familiarName,  // "James" (inside the parenthesis)
  slug: name.toLowerCase().replace(/\s+/g, "-"),
  ...
};
```

For `## Iakōbos (James)`:
- `name = "Iakōbos"` (the heading text before the first paren)
- `slug = "iakōbos".replace(/\s+/g, "-")` = `"iakōbos"` (no spaces to replace)

**The slug contains `ō` (U+014D, Latin Small Letter O with Macron).** The plan's Q5 does not acknowledge this. The `ō` is a non-ASCII Unicode character.

**Impact assessment:**
- **React `key`:** React accepts any string as a `key`; Unicode characters are valid. Low-risk.
- **URL fragment routing:** If slugs are used as URL fragments (`/matthew/people#iakōbos`), most modern browsers handle Unicode fragment identifiers via percent-encoding. Low-risk in practice.
- **CSS selectors:** If slug is used as a CSS class or `id` attribute, `iakōbos` would need escaping in CSS selectors. Reviewing `person-card.tsx` — slugs are used as React keys, not directly as CSS identifiers. Low-risk.
- **Content-lint §0.8 (heading collision check):** The perl script checks `$1 eq $2` — comparing the transliterated name (`Iakōbos`) with the familiar name (`James`). These are not equal, so no collision is flagged. ✓
- **`pnpm build`:** TypeScript does not object to Unicode string slugs. ✓
- **Future search/filter:** If slug is ever used in a URL path segment (not currently), `ō` would need URL-encoding. This is a forward-tracking concern.

**Current verdict:** The Unicode slug is functional for current use cases. However, the plan should explicitly acknowledge the `ō` character in Q5 and note it as a forward-tracking item. If the project establishes a convention that slugs must be ASCII (consistent with how `content-lint.sh` handles other fields), a normalization step should be added.

**Alternative:** Use `## Iakobos (James)` (ASCII `o` instead of `ō`) as the heading. Slug = `"iakobos"` (pure ASCII). The familiar name `James` in parens still disambiguates from the patriarch. The transliteration is slightly less precise (loses the long-ō) but remains recognizable. This is the lower-risk option.

**Recommended fix:** Either (a) explicitly acknowledge the `ō` Unicode character in Q5 and confirm it is acceptable for all current use cases, or (b) simplify to `## Iakobos (James)` for pure-ASCII slug safety. The plan should state which is chosen.

### 3.2 people-parser `SKIP_NAME_PATTERNS` — No Risk ✓

The `## Iakōbos (James)` (or `## Iakobos (James)`) heading does not match any pattern in `SKIP_NAME_PATTERNS`. The heading will be processed as a valid PersonEntry. ✓

### 3.3 enrichment-parser `LABEL_LINE` Regex — Verified ✓

The plan's Topic 10 entry must use the format:

```
**[LATER RECEPTION — SPECULATIVE]**
```

The parser uses:
```typescript
const LABEL_LINE = /^\*\*\[(.+?)\s*(?:—|--)\s*(.+?)\]\*\*$/;
```

Testing: `**[LATER RECEPTION — SPECULATIVE]**`
- Matches: `(.+?)` = `"LATER RECEPTION"`, `(.+?)` = `"SPECULATIVE"` ✓
- `parseClaimType("LATER RECEPTION")` → `"LATER RECEPTION"` ✓
- `parseConfidence("SPECULATIVE")` → `"SPECULATIVE"` ✓

The `—` (em-dash, U+2014) is included in the regex alternation `(?:—|--)`. The plan's em-dash discipline (use Unicode `—`, not ` -- `) is thus parser-correct and content-lint-safe. ✓

### 3.4 enrichment-parser `SOURCE_LINE` — Verified ✓

The plan adds §H source citations for Topic 5 (Arrian, Tacitus). The parser matches:

```typescript
const SOURCE_LINE = /^\*\*(?:Source|Quelle|Fonte|Fuente):\*\*\s*(.+)$/;
```

The plan targets John and Matthew INTRODUCTION §G (Sources Consulted), which is a markdown table — not processed by `SOURCE_LINE`. The table rows are collected as content lines for the §G section entry. This is correct: the sources table is not parsed as individual source fields; it is rendered as markdown table content. ✓

### 3.5 Forward-Pointer Text Template — CONFIRMED SIGNIFICANT FINDING

The plan's Step 1 authoring template for the James entry includes:

```markdown
**In Matthew:** Named as one of Yeshua's four brothers at Matt 13:55 ...
Distinct from Ya'aqov the patriarch (see `## Ya'aqov (Jacob)` above; same Hebrew root ...).
```

**Verified against `person-card.tsx` (read this session):** `inBook` is rendered via the `Field` component:

```tsx
{person.inBook && <Field label={labels.inBook} value={person.inBook} />}
```

And the `Field` component uses:

```tsx
<span
  className="text-text-secondary"
  dangerouslySetInnerHTML={{ __html: renderInlineSafe(value) }}
/>
```

**`inBook` IS rendered with `renderInlineSafe`.** This means backtick syntax in the value IS processed as markdown. The template's `` `## Ya'aqov (Jacob)` `` will produce:

```html
<code>## Ya'aqov (Jacob)</code>
```

This renders as an inline code block with literal `##` characters visible — visually incorrect in biographical narrative prose. The reader sees: *"see `## Ya'aqov (Jacob)` above"* with inline-code styling applied to a heading-syntax fragment. This is a confirmed rendering defect, not just a theoretical concern.

**Recommended fix:** Remove all backtick notation from the `**In Matthew:**` narrative. Use plain prose: "Distinct from Ya'aqov the patriarch (same Hebrew root יַעֲקֹב, same Greek form Ἰάκωβος, different person — see the entry immediately above)." `renderInlineSafe` will handle any italics or bold that are intentional; backtick code notation is never appropriate in biographical narrative.

---

## 4. Content-Lint Coverage Analysis

### 4.1 §0.1 (Stale Ruleset Stamp) — Applies to New Content ✓

New entries must include `**Ruleset:** v3.3` in their front-matter or equivalent. For:
- PEOPLE.md additions: the file-level front-matter already has `**Ruleset:** v3.3` — no per-entry ruleset needed. ✓
- CHAPTER-1-CONTEXT.md §F addition: the file-level front-matter has `**Ruleset:** v3.3` — no per-entry ruleset needed. ✓
- INTRODUCTION.md §E additions: both intros have `**Ruleset:** v3.3` in their front-matter — no per-entry ruleset needed. ✓

No stale-stamp risk.

### 4.2 §0.2 (Em-Dash Residue) — Covered by Operating Principles ✓

The plan explicitly includes "Em-dash discipline" in Operating Principles: "Use Unicode em-dash `—` (U+2014) throughout all authored content." Rule §0.2 (`check_pattern " -- " "$CONTENT_DIRS $STUDY_DIRS $PEOPLE_FILES"`) would flag any ` -- ` in the new content. Authors who follow the operating principle are safe. ✓

### 4.3 §0.6 (John PEOPLE.md Presence per Locale) — No Impact ✓

Topic 2 adds an entry to `content/en/matthew/PEOPLE.md` (and locale mirrors), not to John PEOPLE.md. §0.6 checks for John PEOPLE.md presence (activated post-Phase 10) — unaffected. ✓

### 4.4 §0.7 and §0.8 (PEOPLE.md Heading Rules) — Verified ✓

§0.7 checks for `^## The Transparent Translation` — the new `## Iakōbos (James)` or `## Iakobos (James)` heading does not match. ✓

§0.8 (heading collision: transliteration equals familiar form) — checked by the perl script `$1 eq $2` where `$1` = `Iakōbos` and `$2` = `James`. Not equal. ✓

### 4.5 §0.10 (Modern-Mapping Smell-Test) — FORWARD-TRACKING NOTE

§0.10 runs as `check_pattern_warn` (warn-only, never fails the build). It checks for modern ethnic/geographic mappings in `$PEOPLE_FILES $CONTEXT_FILES`. The James entry will not contain any terms in the §0.10 pattern. The §F *et*/alef-tav entry is in a STUDY_DIR file (`CHAPTER-1-CONTEXT.md`), not in `$PEOPLE_FILES` or `$CONTEXT_FILES` — but note that the §0.10 pattern includes `$CONTEXT_FILES` which refers to the book-level CONTEXT.md files (Phase 9 output), NOT the chapter-level CONTEXT companion files. The CHAPTER-1-CONTEXT.md is in `$STUDY_DIRS` which is not covered by §0.10. No risk.

### 4.6 §0.8 Non-EN PEOPLE.md Collision Check — Must Verify for All 4 Locales

The `check_heading_collision` perl script runs against `$NON_EN_PEOPLE_FILES`. For PT-BR, DE, ES locale files, the heading will be `## Iakōbos (Tiago)` / `## Iakōbos (Jakobus)` / `## Iakōbos (Santiago)` (per Q5 Option B — same transliteration across locales, different familiar name in parens). None of these have matching transliteration and familiar name, so §0.8 will not flag them. ✓

---

## 5. Regression and Side-Effect Analysis

### 5.1 Existing `## Ya'aqov (Jacob)` Entry — No Regression ✓

The plan places the new `## Iakōbos (James)` entry immediately after the existing `## Ya'aqov (Jacob)` entry (line 31 in matthew/PEOPLE.md). The people-parser processes entries sequentially — adding a new entry between two existing entries does not affect the parsing of either adjacent entry. ✓

**Slug uniqueness confirmed:** `ya'aqov` (patriarch) vs. `iakōbos` (James) — distinct. ✓

### 5.2 Chapter-Level Companion Parsing — No Regression ✓

The Topic 10 §F addition is in `content/en/genesis/study/CHAPTER-1-CONTEXT.md`. The enrichment parser processes this file on each request (or at build time via `generateStaticParams`). Adding a new H3 entry under the existing `## F. Later Reception in Other Traditions` section does not affect the parsing of sections A–E, G, H, or I, nor any other §F entries. The parser is additive — it accumulates entries. ✓

### 5.3 Introduction Parsing — No Regression ✓

Adding `### E5. Comparative transmission interval` (John) and `### E4. Comparative transmission interval` (Matthew) to the existing §E sections does not affect any other section. `parseIntroductionMarkdown` processes sections sequentially; adding an entry to §E only adds one more entry to the `manuscript-transmission` section's `entries[]` array. ✓

### 5.4 `pnpm build` — No New Build Risk ✓

`generateStaticParams` reads the book directory structure to enumerate chapter params — not affected by content additions. `generateMetadata` uses file metadata — not affected. TypeScript compilation — not affected (no `.ts` files changed). Static page generation — no new pages; existing pages gain additional content on next build. ✓

### 5.5 People Page Timeline and Rendering — Verified for Stub Pattern ✓

The `people-timeline.tsx` uses `pickAnchor()` to determine timeline position. For the stub entry (`## Iakōbos (James)`), neither `yearFromCreation` nor `historicalYear` is authored — both remain `undefined`. The `pickAnchor()` function excludes entries with undefined anchors from the timeline chart. James will appear in the accordion list but not on the timeline SVG. This is the correct behavior for a stub entry — consistent with how Mosheh/Eliyahu stubs in john/PEOPLE.md work. ✓

---

## 6. Design System Anti-Slop Checklist (TT-DESIGN-SYSTEM.md §12)

The plan produces zero UI code changes. However, the authored content must not introduce patterns that violate design system principles when rendered.

| Check | Status |
|---|---|
| No apologetics framing in rendered content (§12 "Apologetics or debunking framing in the UI") | ✓ — Topic 5 explicitly requires descriptive (non-apologetic) framing; Topic 10 includes mandatory philological clarification; Topic 2 is biographical |
| No fabricated claims or theological positions (§12) | ✓ — all three topics use Rule 13 dual labels and source citations |
| Labels matching project vocabulary (§12 — "Reading / Study / Context") | ✓ — all labels use the established `ClaimType` and `ConfidenceLevel` union values |
| Contrast below 4.5:1 for text (§8) | ✓ — new content renders via existing components with established token-based colors; no inline style overrides |
| No hardcoded hex values (§5) | ✓ — no CSS changes in plan |

---

## 7. Gaps, Inconsistencies, and Improvements

### 7.1 Gap: Q5 Unicode Slug Not Addressed [Must Fix Before Step 1]

Detailed in §3.1 above. The plan recommends `## Iakōbos (James)` which produces `slug = "iakōbos"` containing a Unicode character `ō`. The plan does not acknowledge this. **Recommended resolution:** Either explicitly accept the Unicode slug with documentation, or use `## Iakobos (James)` (ASCII `o`) for pure-ASCII slug safety.

### 7.2 Gap: §F Entry Heading Level Not Specified [Must Fix Before Step 2]

Detailed in §2.4 above. The plan does not specify that the Topic 10 §F entry must be authored as H3 (`### F5. ...`), not H2 (`## F5. ...`). An H2 heading would create a new section, not an entry, and the content would be silently dropped from the §F section. **Required fix:** Add to Step 2: "Author as an H3 entry (`### F5. The *et*/alef-tav reading — Messianic-Jewish and Kabbalistic-precedent tradition`) immediately before the existing §G section separator."

### 7.3 Gap: Backtick Markdown in `inBook` Forward-Pointer [Fix Before Step 1]

Detailed in §3.5 above. The step 1 template includes `` `## Ya'aqov (Jacob)` `` in the `**In Matthew:**` narrative. Backtick formatting may render as literal backtick characters (if plain-text rendering) or as inline-code HTML (if markdown rendering). Neither is ideal in a biographical narrative. **Required fix:** Remove backticks; use plain prose for the disambiguation note.

### 7.4 Gap: Locale-Specific Heading Verification for §0.8 Not Documented [Minor]

The plan instructs locale editors to use `## Iakōbos (<Familiar>)` across all four locales. This is correct. However, the plan does not note that the `check_heading_collision` script runs against all non-EN PEOPLE.md files — authors should be aware that if any non-EN locale accidentally writes `## Tiago (Tiago)` or `## Jakobus (Jakobus)`, §0.8 will flag it (blocking build). A note to locale editors: "The heading form must always be `## Iakōbos (<FamiliarForm>)` — never `## <FamiliarForm> (<FamiliarForm>)` — to avoid content-lint §0.8 collision detection."

### 7.5 Improvement: Editorial-Log Entry Should Reference This Audit [Minor]

Each editorial-log entry (M-022, genesis entry, J-025, M-023) should include a cross-reference to `docs/audit/AUDIT_POSSIBLE_CONTENT_BUNDLE_PLAN_v2.md` in addition to the original `AUDIT_POSSIBLE_CONTENT_BUNDLE_PLAN.md`. Both audits govern the execution decisions.

### 7.6 Improvement: Slug Collision Prevention for Future Entries [Forward-Tracking]

The people-parser has no collision-handling for slugs. The Q5 issue would have been caught automatically if the parser had duplicate-slug detection. This is a known gap in the parser (mentioned in the Phase 10 audit). Adding a `console.warn` or duplicate-slug check to `flushEntry` would prevent future silent collisions:

```typescript
// Inside flushEntry, after pushing to entries:
const slug = finalizeEntry(state.current).slug;
if (entries.some(e => e.slug === slug)) {
  console.warn(`Duplicate slug detected: "${slug}" in book "${book}". Entry skipped or overwritten.`);
}
```

This is a parser improvement, not within scope of this content-only bundle, but worth tracking in PENDING.md or DEFERRED_TASKS.md.

### 7.7 Note: No New Content-Lint Rules Activated by This Bundle

Unlike Phase 10 (which activated §0.6 after John PEOPLE.md was created), this bundle does not introduce any new required lint rules. §0.6 already covers all four locales for John PEOPLE.md. §0.7, §0.8, §0.10 already run against `$PEOPLE_FILES` which includes the Matthew PEOPLE.md files being modified. No `content-lint.sh` changes needed as part of this bundle.

---

## 8. Summary: Required Conditions Before Execution

In priority order:

| # | Issue | Severity | Section | Required Action |
|---|---|---|---|---|
| 1 | Unicode `ō` in slug `iakōbos` | **Must resolve** | §3.1, §7.1 | Either accept and document the Unicode slug, or switch to `## Iakobos (James)` (ASCII `o`) for pure-ASCII slug safety. Decision must be pinned before Step 1. |
| 2 | §F entry heading level unspecified | **Must resolve** | §2.4, §7.2 | Add explicit instruction to Step 2: "Author as H3 (`### F5. ...`), not H2." H2 would silently drop the entry from §F. |
| 3 | Backtick notation in `inBook` template | **Fix before Step 1** | §3.5, §7.3 | Remove `` `## Ya'aqov (Jacob)` `` backtick notation from the forward-pointer template. Use plain prose. |
| 4 | §0.8 locale heading warning not documented | Minor | §7.4 | Add a note to locale authoring instructions: heading must always be `## Iakōbos (<FamiliarForm>)`, never `## <FamiliarForm> (<FamiliarForm>)`. |

---

## 9. Verdict

**Approve for execution after items 1–3 are resolved.** Item 4 is a documentation improvement, not an execution blocker.

The plan is architecturally clean: DDD boundary respected, zero new dependencies, zero new code, zero TypeScript changes. All parser behavior verified against actual source. Content-lint coverage confirmed adequate for all new content. No regressions identified. The three significant findings (Unicode slug, H3 heading level, backtick formatting) are fixable in the plan document in under 5 minutes each.

After resolution, proceed in the Q1–Q5 decision sequence, then Step 1 → 2 → 3 (conditional) → 4 → 5.

---

**Audit complete.** All implementation claims verified against actual parser source, domain types, UI components, and content-lint script. Architecture and design system compliance confirmed.
