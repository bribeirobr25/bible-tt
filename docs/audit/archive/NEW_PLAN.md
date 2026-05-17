# Phase 6.6 — Post-Phase-6 UX + Content Polish

**Created:** 2026-05-09
**Source:** User-reported issues + improvements after browser-testing the Phase 6 work
**Status:** Plan revised post-audit (2026-05-09). Approved for execution.

## Audit revisions (2026-05-09)

Independent audit (`docs/audit/archive/AUDIT_NEW_PLAN.md`) surfaced 2 execution blockers + 4 governance/correctness fixes + 6 minor improvements. All agreed-upon fixes incorporated below. One disagreement noted (§3 footnote on 6.6C disclaimer requirement).

**User-requested addition (2026-05-09 second pass):** sub-phase **6.6I — Dead code + dead content audit** added at the end of the execution sequence. The original plan was purely additive; the user requested an explicit cleanup pass with strong "no errors, regressions, or side-effects" guardrails. 6.6I is a conservative, gated audit (detect → classify → act per item, never auto-remove) covering 6 low-risk + 6 medium-risk categories (12 total); 5 high-risk categories (markdown sections within parsed files, Domain types, dangling cross-references, allow-list entries, CHANGELOG files) explicitly deferred to future passes.

**Post-revision audit (2026-05-09 third pass):** independent re-audit of the revised plan + 6.6I addition (`docs/audit/archive/AUDIT_NEW_PLAN.md` §"Post-revision review"). Auditor verdict: "Plan is ready for execution." Three small refinements (R1, R2, R3) absorbed:
- **R1** — 6.6I effort estimate bumped from 1.5–2h → **2.5–3h** (test cycle realism, i18n script complexity, knip FP volume on `PersonEntry` fields)
- **R2** — §7 Risks table gained an 8th row for 6.6I auto-removal false-positives
- **R3** — 6.6I closure documentation redirected from editorial-log to `FIX_IMPLEMENTATION.md` per Rule 28 / §EDITORIAL LOG SPECIFICATION §L1 (editorial log records translation/governance decisions, NOT code-cleanup audits)
Two forward-tracking items absorbed:
- **FT1** — Familiar-name redundancy post-6.6B explicitly tracked in `DEFERRED_TASKS.md` (added as 6.6I closure step)
- **FT2** — Orphan `.md` files in `content/` added as 6.6I Item #12 (LOW-risk, mechanical pattern-match against parser-loaded paths)
Auditor self-corrected one prior finding (§4.3 — Rule 29 disclaimer requirement DOES apply equally to introductions; my plan's MEDIUM rating was correct).

**Critical revisions absorbed:**
- **6.6D field-reorder list scoped to biographical-fields block only** (auditor §3.1 — original list would have silently dropped 6 surrounding render blocks: `crossBookSee`, `inBook`, `generationsFrom`, archaeology/extraBiblical, `regionsByText`, `curiosities`)
- **6.6G data table updated:** Herod claim-type changed from `LATER RECEPTION — DOCUMENTED` → `HISTORICAL / ARCHAEOLOGICAL — VERIFIED` per Rule 29 dual-label semantics (auditor §5.5)
- **Numeric-anchor convention added (parseInt-safe):** existing `c. -20` / `c. -25` historicalYear values for Miryam + Yosef silently fail `parseInt`, excluding them from the timeline. New 6.6G content fix + project-wide convention: numeric anchor fields (`historicalYear`, `historicalYearEnd`, `yearFromCreation`, `yearFromCreationEnd`) must be bare integers; approximation/confidence belongs in lifespan/note text (auditor §3.2)
- **6.6H Eve/Sarai handling:** picked **option 1 (accept the gap)** — text gives no birth/death year for Eve; Sarai's dates are computable from Gen 17:17 + 23:1 but those verses are outside Gen 1–12 file scope. Adding speculative anchors would violate the Prime Directive. Both included in expandable list (no SVG bar). Sarai's actual data deferred to Phase 12 (Gen 13–50 / 17:17 expansion) (auditor §4.1)
- **6.6E curiosities `name` attribute defensive guard dropped:** `CuriositiesBlock` uses `<div>` not `<details>`; no conflict to guard against (auditor §5.1)
- **6.6B slug verification added to DoD** (auditor §4.2)
- **6.6A locale-specific pre-sweep + dual residue check added** (auditor §4.4 + §5.3)
- **6.6E screen-reader testing added to DoD** (auditor §5.7)
- **6.6H Bat-Sheva edge case documented** as intentional absence per Matthew's circumlocution (auditor §5.8)

**Auditor finding partially disputed (one item):**
- **6.6C Rule 29 disclaimer rating** — auditor argued (§4.3) that the disclaimer-at-top requirement is "not enumerated for introductions in the same way" as for companions, suggesting the risk rating should be LOWER. Verified against `docs/rules/RULES-CORE.md` line 792: *"Book introductions provide historical, compositional, and textual-transmission context at the book level. They follow the same dual-label system **and disclaimer requirement** as chapter companions."* The disclaimer requirement applies equally — auditor was incorrect on this point. Keeping MEDIUM risk rating. **However, the practical recommendation (collapsed `<details>` with disclaimer still in DOM and keyboard-accessible) IS Rule-29-compliant** since the disclaimer remains visible when expanded; this is the right design path. Auditor's underlying conclusion (collapsed `<details>` works fine) stands; only the rule-citation is corrected.

---

## 1. Investigation summary

| # | Issue | Layer affected | Root cause |
|---|------|---------------|------------|
| **Content-1** | `--` shown for ranges (`80--90 CE`, `1:1--17`, `chapters 5--7`, `13:10--17`, `Mark 7:3--4`, `5:17--20; 23:2--3`, `AJ 17.168--173`) across all pages and locales | content/ files (4 locales) | en-dash never authored; Phase 2C swept ` -- ` (em-dash, with surrounding spaces) but not `--` (en-dash for numeric ranges, no surrounding spaces). **1,153 occurrences total** (EN 334 / PT-BR 203 / DE 205 / ES 411). |
| **Content-2** | `/book/introduction` shows two intro framings (page-header lede + Rule 29 disclaimer block) — feels duplicative | UI (`introduction/page.tsx` + `introduction-view.tsx`) + content disclaimer in markdown | Page header renders `t('nav.bookIntroduction')` + description; markdown's first blockquote is the Rule 29 mandatory governance disclaimer. Both currently render at full prominence. Rule 29 cannot be removed — must be visually de-emphasized. User prefers the page-header (shorter, concise). |
| **People-A** | Familiar name shown twice in expandable header (`Adam (Adam) (Adam)`, `Yeshua (Jesus) (Jesus)`) | parser (`src/infrastructure/content/people-parser.ts`) | Heading `## Adam (Adam)` is stored verbatim as `name`; explicit `**Familiar name:** Adam` populates `familiarName` separately; UI renders both. **Parser bug.** Fix: parse heading into `name + familiarName` automatically. |
| **People-B** | Lifespan + scripture-ref shown in summary header for Genesis but missing for Matthew (`Adam (Adam) 930 years (Gen 5:5)` vs. `Yeshua (Jesus)` with no info) | content (matthew/PEOPLE.md) | Genesis entries have `**Lifespan:** 930 years (Gen 5:5)` field populated; Matthew entries don't. Just unauthored — not a parser/UI bug. |
| **People-C** | Other missing fields in Matthew vs Genesis | content + UI | Yeshua/Miryam/Yosef/Herodes/Yochanan need: `birthYear`, `deathYear`, `lifespan`, `historicalYearEnd`. UI currently doesn't render `birthYear`/`deathYear` as separate Field rows either (they're embedded inside lifespan text in Genesis). |
| **UX-1** | Multiple expandable cards can be open simultaneously (no accordion) | UI (`person-card.tsx`) | Native HTML `<details>` supports `name="x"` attribute (HTML 2024 spec, all major browsers ≥ Dec 2023) — turns multiple `<details>` sharing a `name` into an exclusive accordion with **zero JS**. Currently no `name` attribute. |
| **UX-2** | Chapter pages lack "← Genesis" breadcrumb back to book landing | UI (`chapter-view.tsx` or chapter route) | People + Introduction pages have it; chapter pages only have prev/next-chapter navigation + home link. Inconsistent navigation. |
| **Improvement-1** | Lifespan should be 2nd field after meaning | UI (field render order) | Currently lifespan appears mid-list in expanded card; trivial reorder. |
| **Improvement-2** | Birth/death year display when expanded | UI + possibly content | `birthYear` / `deathYear` exist in `PersonEntry` schema but UI doesn't render them as standalone fields. Authoring is complete in Genesis (text format `"AM 1 (by definition)"`) but partial in Matthew (only `historicalYear` for some). |
| **Improvement-3** | Important women on timeline + expandable bio | content + UI | Sarai + Chava (Eve) authored in Gen 1–12 PEOPLE.md. Timeline filter `pickAnchor()` may exclude them depending on anchor data. Tamar/Rachav/Rut/Bat-Sheva/Miryam are in matthew/PEOPLE.md — verify timeline visibility. Phase 12 (Gen 13–50) will add Rebekah/Rachel/Leah/Bilhah/Zilpah/Dinah. |

**Decisions captured during planning:**
- 6.6A scope: **numeric/scriptural ranges only** (`\b\d+(?::\d+)?(?:-\d+)?(?:\.\d+)?\s*--\s*\d+(?::\d+)?(?:-\d+)?(?:\.\d+)?\b` → `–`). Show residue after numeric pass to catch any word-ranges.
- 6.6D field rendering: **add `birthYear` + `deathYear` as explicit Field rows** below lifespan. Some redundancy with lifespan text but maximum transparency.
- 6.6C disclaimer handling: **TBD — see §3 open decision below.** Recommended path: collapsed `<details>` at top of intro page.

---

## 2. Sub-phase breakdown

### 6.6A — Content `--` → `–` en-dash sweep

**Layer:** `content/{en,pt-br,de,es}/**/*.md`

**Approach:**
- perl one-liner with anchored regex: `\b(\d+(?::\d+)?(?:-\d+)?(?:\.\d+)?)\s*--\s*(\d+(?::\d+)?(?:-\d+)?(?:\.\d+)?)\b` → `$1–$2` (U+2013 EN DASH)
- **ES-specific pre-sweep audit (auditor §4.4):** ES has 411 occurrences (vs ~200 in EN/PT/DE). Before bulk sweep, dump ES-only unique patterns: `grep -rohE "\S+--\S+" content/es | sort | uniq -c | sort -rn` → review for any ES-specific formatting that the regex doesn't cover (e.g., word ranges, different punctuation).
- Run a separate audit pass for non-numeric ranges (e.g., `Mosheh--Yehoshua`, `David--Solomon`) — but those are rare; spot-check residue
- **Skip:** markdown horizontal rules (`---` standalone on line); already-em-dash sweep targets from Phase 2C; code blocks (we have none with raw `--`)
- Pre-sweep diagnostic per locale: dump all `--` patterns sorted by frequency to verify regex coverage. Run separately for each of `content/en`, `content/pt-br`, `content/de`, `content/es`.
- Run sweep
- **DoD residue check (auditor §5.3):** dual grep:
  - `grep -rohE "[0-9]+--[0-9]+" content/` → must return 0 (numeric ranges fully swept)
  - `grep -rohE "\w+--\w+" content/` → manually review residue for word-range edge cases

**DoD:**
- Pre-execution: confirm baseline test count (`pnpm test` reports ≥ 792 passing, per auditor §5.6)
- Tests pass (existing 792)
- Build clean
- Content lint exit 0
- Both grep patterns above produce expected results
- Spot-check 5+ locale pairs of representative patterns post-sweep
- Visual smoke at `/{locale}/genesis/chapter/5` (heavy with date ranges) + `/{locale}/matthew/chapter/2` (Josephus citations)

**Risk:**
- False positives on non-range double-hyphens (none currently observed in content)
- ES has highest count (411) — possibly higher density of ranges; addressed via per-locale pre-sweep audit above

**Effort:** ~30 min including verification.

---

### 6.6B — Person heading parser fix

**Layer:** `src/infrastructure/content/people-parser.ts`

**Approach:**
- At `ENTRY_HEADER` regex match (`/^## (.+)$/`), parse the captured heading text further:
  - If matches `/^(.+?)\s*\(([^)]+)\)\s*$/` → `name = $1`, `familiarName = $2` (auto-populated from heading)
  - Else `name = entire heading`, `familiarName` left undefined
- **Slug derivation note (auditor §4.2):** currently slug is `name.toLowerCase().replace(/\s+/g, "-")`. For `## Adam (Adam)`, this produces `"adam-(adam)"` (parens preserved). After the fix, slug becomes `"adam"`. **Verify no slug-based URL anchors exist** before changing — `grep -rE "people/.*#[a-z0-9-]+" src/` and grep for any anchor-link patterns. Currently slug is used only as React `key` (people-timeline + person-card curiosities) — no URL impact verified. Add to DoD below.
- Explicit `**Familiar name:**` field still allowed; if present, **overrides** the auto-extracted value (preserves authoring flexibility). **Implementation note (auditor §5.2):** override is implicit via line-order processing — heading is parsed first, then FIELD_LINE handler for `familiarName` simply assigns over the heading-extracted value. No special precedence logic needed.
- Tests added:
  1. Heading `## Adam (Adam)` → `name = "Adam"`, `familiarName = "Adam"` (no duplicate display in UI)
  2. Heading `## Avraham (Abraão)` → `name = "Avraham"`, `familiarName = "Abraão"`
  3. Heading `## Tamar` (no parens) → `name = "Tamar"`, `familiarName = undefined`
  4. Heading `## Avraham (Abraham)` + explicit `**Familiar name:** Abraham (the father)` → explicit field wins (line-order override)

**DoD:**
- 4 new parser tests pass (792 + 4 = 796)
- Build clean
- Visual smoke: `/genesis/people` Adam shows `Adam` only (no duplicate parens)
- **Slug-anchor audit:** `grep -rE "#[a-z][a-z0-9-]*" src/` for any URL-anchor references to slug values. If found, document migration. Currently expected: 0 hits in routing/linking code; slug used only as React `key`.

**Risk:**
- Existing content has BOTH `## Adam (Adam)` AND `**Familiar name:** Adam` redundantly. After fix, the explicit field becomes a no-op (same value). Not a bug, just redundant. Could sweep redundant fields out as 6.6B' optional cleanup — recommend leaving (harmless, documents intent).

**Effort:** ~30 min including tests.

---

### 6.6C — Introduction view duplicate-text resolution

**Layer:** `src/ui/enrichment/introduction-view.tsx` + `src/app/[locale]/[book]/introduction/page.tsx`

**Approach (recommended path — collapsed `<details>` at top):**
- Keep page header (`t('nav.bookIntroduction')` + description) as primary visual
- Render Rule 29 disclaimer inside a collapsed `<details>` element labeled with locale-translated "Reading note" / "Nota de leitura" / "Hinweis zum Lesen" / "Nota de lectura"
- Disclaimer remains visible to anyone curious (Rule 29 §625-627 + §734 compliance maintained)
- Page-header lede dominates the visual hierarchy

**Alternative paths (if user prefers):**
- **Footer placement:** disclaimer at bottom of page in muted styling — simpler but less prominent (Rule 29 reviewers may push back)
- **Shrink + de-emphasize:** keep current layout, reduce font size + opacity — least invasive but may not fully address the "feels duplicate" concern

**Editorial-log entry:** document the placement choice + Rule 29 compliance reasoning (which option chosen, why).

**DoD:**
- Visual review at `/{en,pt-br,de,es}/{matthew,john,genesis}/introduction`
- Rule 29 disclaimer remains accessible via DOM (not display:none)
- Tests pass; build clean; lint clean

**Risk:** Rule 29 §734 + §625-627 require visible governance disclaimer. Mitigation: keep readable (not display:none), just less prominent.

**Effort:** ~30 min (UI work + 4-locale visual review).

**Pending decision:** which of the three paths above (collapsed `<details>` recommended).

---

### 6.6D — Person card field reorder + birth/death year display

**Layer:** `src/ui/people/person-card.tsx` (i18n keys already exist in all 4 locales — auditor §5.9 verified)

**Approach (REVISED per auditor §3.1 — execution-blocker fix):**

The reorder applies **only to the biographical-fields block** between the existing top blocks and the existing bottom blocks. The full render order in `person-card.tsx` (lines ~305–360) becomes:

```
[unchanged top blocks — must remain in this order:]
1. CrossBookSeeField (when person.crossBookSee)
2. Field {inBook} (when person.inBook)
3. GenerationsBlock (when person.generationsFrom)

[biographical-fields block — REORDERED + NEW birth/death:]
4. Field {meaning}
5. Field {lifespan}              ← MOVED (was at position 15)
6. Field {birthYear}             ← NEW
7. Field {deathYear}             ← NEW
8. Field {profession}
9. Field {socialClass}
10. Field {hometown}
11. ListField {placesLived}
12. Field {father}
13. Field {mother}
14. ListField {siblings}
15. ListField {spouses}
16. ListField {children}
17. Field {ageAtFatherhood}
18. Field {causeOfDeath}
19. Field {characterArc}
20. ListField {booksIn}

[unchanged bottom blocks — must remain in this order:]
21. archaeology + extraBiblical (in their bordered block)
22. RegionsByTextBlock (with safeguard pointer)
23. CuriositiesBlock
```

**Critical:** the reorder must NOT remove or re-position the surrounding blocks. The `crossBookSee` link (Phase 6 follow-up), `inBook` narrative, `generationsFrom` chips, archaeology/extraBiblical bordered group, regionsByText safeguard, and curiosities are all preserved exactly as they exist today. Only the biographical-fields sub-block (positions 4–20) is touched.

- Add `<Field>` calls for `birthYear` + `deathYear` (NEW renders)
- Move `lifespan` Field call to position 5 (right after meaning, before birthYear)
- i18n: **no new keys needed** — all 4 locales already have `people.birthYear` + `people.deathYear` defined (auditor §5.9 verified: EN "Birth year"/"Death year"; PT-BR "Ano de nascimento"/"Ano de morte"; DE "Geburtsjahr"/"Todesjahr"; ES "Año de nacimiento"/"Año de muerte"). 6.6D's i18n step is a no-op.
- Show field only if value present (existing `Field` component pattern; no behavior change)

**DoD:**
- Visual review at `/genesis/people` (Adam, Eve, Noach, Avram) — confirms cross-book/inBook/generations + biographical reorder + archaeology/regionsByText/curiosities all render in order
- Visual review at `/matthew/people` (Yeshua, Miryam after 6.6G authoring) — confirms same
- Visual review at `/matthew/people` Avraham/Yitschaq see-only entries — confirms cross-book link still renders
- Tests pass (792); build clean; lint clean

**Risk:**
- ❌ ELIMINATED — original risk of "deleting 6 surrounding render blocks" addressed by the explicit scope above.
- Some Genesis lifespan strings already include birth/death context (e.g., `"930 years (Gen 5:5)"`). Showing all three fields creates some redundancy. Mitigation: show all when authored — readers benefit from explicit per-field reference; the lifespan field can carry computed totals + scripture refs while birth/death are absolute years.

**Effort:** ~30 min (UI changes only — i18n confirmed already in place).

---

### 6.6E — Single-expand accordion (HTML-native)

**Layer:** `src/ui/people/person-card.tsx`

**Approach:**
- Add `name="people-accordion"` HTML attribute to `<details>` element on PersonCard
- Native browser feature: any `<details>` sharing the same `name` value becomes an exclusive group — opening one auto-closes others
- Browser support:
  - Chrome 120+ (Dec 2023)
  - Firefox 121+ (Dec 2023)
  - Safari 17.2+ (Dec 2023)
  - Edge 120+ (Dec 2023)
  - All current LTS at 2026 — fully supported
- Zero JS, zero state management — leverages platform
- **Curiosities sub-block (auditor §5.1):** verified to use `<div>` containers, NOT `<details>` — no conflict to guard against. Original plan's defensive `name="curiosities-${slug}"` proposal dropped. If curiosities ever become collapsible in the future, address it then.

**DoD:**
- Visual smoke: open Adam, then Yeshua — Adam should auto-close
- Keyboard nav (Enter/Space) preserved
- Focus rings preserved (existing focus-visible styling)
- **Screen-reader test (auditor §5.7):** brief VoiceOver / NVDA pass — verify the exclusive-accordion behavior is reasonably discoverable. Native `<details>` is announced as "summary/disclosure," which works for individual cards but doesn't explicitly announce the exclusive-group behavior. If the screen-reader UX is confusing, add `aria-label="People list, single-expand"` to the parent `<div>` containing the accordion group as a hint. This is a refinement, not a blocker — apply if needed.

**Risk:** Older browsers without `name` support fall back to current behavior (multiple open). Graceful degradation, no breakage.

**Accessibility:** Native `<details>` retains keyboard nav, focus rings, ARIA semantics. Screen-reader exclusive-accordion discoverability addressed via DoD test above.

**Effort:** ~15 min including verification (+ 5 min if `aria-label` refinement needed).

---

### 6.6F — Chapter page breadcrumb navigation

**Layer:** `src/ui/shared/chapter-view.tsx`

**Approach:**
- Add `<Link href={`/${locale}/${book}`}>` element at top of ChapterView (matching the existing People/Introduction page pattern)
- Use `ChevronLeft` Lucide icon from `lucide-react` (already imported in similar pages)
- Style: `inline-flex items-center gap-1 text-sm text-text-muted hover:text-accent transition-colors duration-150 mb-4`
- Label: localized book name via `t(\`book.${book}\`)`
- Position: above the chapter title

**DoD:**
- Visual review at `/{en,pt-br,de,es}/{genesis/chapter/1, matthew/chapter/2, john/chapter/3}` — breadcrumb visible, click navigates to book landing
- Tests pass; build clean; lint clean

**Risk:** ChapterView is shared across all chapter routes; ensure layout doesn't break on mobile. Mitigation: visual review at multiple viewports.

**Effort:** ~20 min.

---

### 6.6G — Matthew people lifespan + dates content authoring

**Layer:** `content/{en,pt-br,de,es}/matthew/PEOPLE.md`

**Approach (5 entries × 4 locales):**

For each of: Yeshua, Miryam, Yosef, Herodes the Great, Yochanan the Immerser

#### Project-wide convention added (auditor §3.2 — execution-blocker fix)

**Numeric anchor fields are bare integers.** Specifically:
- `historicalYear`, `historicalYearEnd`, `yearFromCreation`, `yearFromCreationEnd` MUST contain only integer values (with optional leading minus sign for BCE)
- The parser uses `Number.parseInt(value, 10)` — strings like `c. -20` parse to `NaN` and silently exclude the figure from the timeline
- Approximation, qualification, and confidence belong in `lifespan` text, `birthYear` / `deathYear` text (which are display-only, not parseInt'd), and editorial-log notes — NOT in numeric anchor fields
- **Convention example:** instead of `**Historical year:** c. -20 (approximate birth, highly uncertain)`, author `**Historical year:** -20` + `**Birth year:** c. 20 BCE (POSSIBLE — assumes ~14 at conception)` + `**Lifespan:** not stated; ~60+ years per LATER RECEPTION traditions (POSSIBLE)`

#### Existing content fix (auditor §3.2 — required before timeline works)

Existing values that fail `parseInt`:

| File | Person | Current value | Fixed value |
|------|--------|--------------|-------------|
| `content/{en,pt-br,de,es}/matthew/PEOPLE.md` | Miryam | `**Historical year:** c. -20 (approximate birth, highly uncertain)` | `**Historical year:** -20` (move qualification to lifespan/birth-year text) |
| `content/{en,pt-br,de,es}/matthew/PEOPLE.md` | Yosef | `**Historical year:** c. -25 (approximate birth, highly uncertain)` | `**Historical year:** -25` (same) |

After fix, both Miryam + Yosef will appear on the Matthew timeline (currently silently absent due to parseInt failure). This is a precondition for 6.6H's timeline-visibility audit succeeding.

#### Authoring data table (REVISED per auditor §5.5)

Author the following fields with confidence labels per Rule 13. Claim-types per Rule 29 dual-label semantics:

| Person | Birth year (text) | Death year (text) | Historical year (parseInt-safe) | Lifespan | Claim-type — Confidence |
|--------|-------------------|-------------------|--------------------------------|----------|------------------------|
| Yeshua | c. 4 BCE (per Matt 2:1: Herod kills children "two years and under" → birth ~6–4 BCE) | c. 30 or 33 CE (Mark + Luke chronology vs John's three Passovers) | -4 (already in file) | ~33–37 years (range reflects birth + death uncertainty) | TEXTUAL — PROBABLE for birth; TEXTUAL — UNCERTAIN for death |
| Miryam | c. 20 BCE (assumes ~14 at conception, working back from Yeshua's birth) | not stated in NT (LATER RECEPTION traditions vary: ~AD 41, possibly later) | -20 (FIXED from `c. -20`) | not stated; ~60+ years per LATER RECEPTION traditions (POSSIBLE) | POSSIBLE INFERENCE — POSSIBLE |
| Yosef | c. 25 BCE (assumes mature artisan at marriage) | likely before Yeshua's ministry (absent from adult-life narratives) | -25 (FIXED from `c. -25`) | not stated | POSSIBLE INFERENCE — POSSIBLE |
| Herodes the Great | 73 BCE (Josephus *AJ* 14.158, *BJ* 1.203) | 4 BCE (Josephus *AJ* 17.190, *BJ* 1.665) | -73 (already in file) | 69 years | **HISTORICAL / ARCHAEOLOGICAL — VERIFIED** (CORRECTED from original plan's `LATER RECEPTION — DOCUMENTED`; per auditor §5.5: DOCUMENTED pairs only with LATER RECEPTION; Josephus historical citations are HISTORICAL evidence, not reception tradition) |
| Yochanan the Immerser | c. 5 BCE (Luke 1:36 makes him ~6 months older than Yeshua) | c. 30 CE (Josephus *AJ* 18.116–119; before Yeshua's death) | -5 (already in file) | ~35 years | TEXTUAL — POSSIBLE for birth; HISTORICAL / ARCHAEOLOGICAL — PROBABLE for death |

**Technique:**
- **First step:** apply existing-content fix above (Miryam + Yosef historicalYear normalization). Verify with `node -e 'console.log(Number.parseInt("-20", 10))'` (should output `-20`). 4 files × 1 fix each = 4 mechanical edits per locale.
- Author EN first; then propagate to PT-BR / DE / ES (following the existing translation workflow)
- All values labeled with locale-translated confidence tokens (POSSIBLE/PROBABLE/UNCERTAIN/VERIFIED) and claim-types per Rule 29
- Source-cite where extant (Josephus, Tacitus, Luke as cross-reference for chronological hints)
- One editorial-log entry: `genesis.md` 2026-05-09-101 (or later number); applied-to entries in `matthew.md` (M-014?)
- **Editorial-log MUST document:** the numeric-anchor convention (parseInt-safe bare integers), the Miryam/Yosef format fix, and Herod's HISTORICAL/ARCHAEOLOGICAL claim-type rationale

**DoD:**
- Pre-fix verification: `node -e 'console.log(Number.parseInt("c. -20", 10))'` outputs `NaN` (confirms bug)
- Post-fix verification: `node -e 'console.log(Number.parseInt("-20", 10))'` outputs `-20` (confirms parsing works)
- Visual review at `/matthew/people` Yeshua entry — birth/death/lifespan all populated and visible
- Visual review at `/matthew/people` timeline chart — Miryam + Yosef now visible (previously silently absent)
- Tests pass; build clean; lint clean
- Editorial-log entry documents source-of-data + confidence rationale + numeric-anchor convention + Herod claim-type fix

**Risk:** Date ranges for some figures are heavily debated. Mitigation: use UNCERTAIN where genuine; cite Josephus + textual evidence; per Rule 3, frame as "scholarly estimate" not "historical fact."

**Effort:** ~1.75 hours (EN drafting + Miryam/Yosef format fix per locale + cross-locale propagation + one editorial-log entry — slightly higher than original 1.5h estimate due to added format-fix work).

---

### 6.6I — Dead code + dead content audit (NEW — added 2026-05-09 per user request)

**Layer:** project-wide; `src/` + `content/` + `docs/`

**Premise:** the user requested an explicit dead-code / dead-content cleanup pass with **no errors, regressions, or side-effects**. The plan as originally drafted was purely additive. This sub-phase enforces a conservative, audit-first cleanup discipline.

#### Design principle: separate detection from removal

Every removal goes through a 3-stage gate:

1. **Detect** — automated tools or scripts produce a candidate list
2. **Classify** — manual per-item review: dead, dynamic-reference, intentional-future-use, or historically-accurate (e.g., revision-log content). Each flagged either `REMOVE` / `KEEP` / `ANNOTATE`
3. **Act** — only `REMOVE`-flagged items are deleted, one logical batch per commit, with `pnpm test && pnpm build && pnpm lint && pnpm content:lint` between each

Static analysis CANNOT distinguish dynamic references (`t(\`book.${book}\`)`), intentional future-API surface (exported types not yet imported), or historically-accurate content (editorial-log entries marked PENDING that were resolved later). Removing those would break things or rewrite history.

#### Scope (LOW-risk only — see "out of scope" below for HIGH-risk items deferred)

**Low-risk targets (mechanical, tool-detectable, obvious):**

1. **Unused TypeScript imports** — Biome already enforces. Confirm: 0 warnings (verified in scoping pass).
2. **Console-log / debug statements** in src/ — grep `console\.(log|debug)`. The 4 existing `console.warn` calls in `prophecy-parser.ts` + `enrichment-parser.ts` ARE intentional (tested for behavior — `console.warn for unrecognized labels`). KEEP.
3. **TODO / FIXME / HACK / XXX comments** — grep. Currently 0 hits (verified). KEEP this DoD as a "stays at 0" gate.
4. **Trailing whitespace + EOL inconsistencies** — Biome already handles via formatter.
5. **Unused npm dependencies** — run `pnpm dlx depcheck`. **REPORT only**, do not auto-remove. depcheck has well-known false positives (CLI-only deps, build-time-only deps, peer deps). Each candidate manually reviewed.

12. **Orphan content `.md` files** (NEW per post-revision audit FT2) — `content/` may contain `.md` files not loaded by any parser route. Detection: enumerate every `.md` file in `content/` and filter against expected patterns (`CHAPTER-N.md`, `INTRODUCTION.md`, `PEOPLE.md`, `study/CHAPTER-N-CONTEXT.md`, `study/CHAPTER-N-PROPHECY.md`). Anything not matching the parser-loaded patterns is a candidate orphan.
    - **CRITICAL false-positive sources:** template references in `docs/templates/*.md` (NOT in content/, but verify), in-progress drafts intentionally checked in but not yet wired to parsers (rare; would be flagged as `// DRAFT` in front matter)
    - **Action:** report orphans → manual per-item review → REMOVE if genuinely abandoned, KEEP-with-comment if intentional draft, DOCUMENT if part of incomplete authoring (e.g., a Phase 12 chapter file authored ahead of code support)
    - Default for ambiguous cases: KEEP and surface in `DEFERRED_TASKS.md`

**Medium-risk targets (need careful per-item review):**

6. **Unused TypeScript exports** — run `pnpm dlx knip` or equivalent. **REPORT only.** False positives include: types exported for external consumers, types used only in tests, types reserved as authoring-time API surface (e.g., `PersonEntry` fields not yet rendered). Each candidate reviewed against:
   - Is it used in tests? → KEEP
   - Is it part of the public domain types layer used by content authors? → KEEP
   - Is it referenced dynamically? → KEEP
   - Otherwise → flag for REMOVE; one removal per commit

7. **Unused i18n keys** — script that compares keys in `src/infrastructure/i18n/messages/*.json` against all `t(...)` and `t(\`...\`)` calls in src/. **CRITICAL false-positive sources:**
   - Dynamic keys: `t(\`book.${book}\`)` makes `book.genesis`, `book.matthew`, `book.john` look "unused" via static grep
   - Locale-fallback patterns: `t(key, {fallback: 'fallback'})` may suppress lookup on missing key
   - **Mitigation:** the script must enumerate template-literal patterns (`\`book.${...}\``, `\`people.inBook.${...}\``) and treat the prefix as live for any matching suffix the data could produce
   - **No auto-removal** — every flagged key reviewed; only static-only-truly-unused keys removed

8. **Unused parser aliases** in `EXACT_LABEL_ALIASES` — for each alias string, grep `content/**/*.md` for the corresponding `**Alias:**` field-line pattern. If 0 matches across all 4 locales × all 4 books, the alias is genuinely dead. **CRITICAL false-positive source:** authoring-future aliases for books not yet authored (e.g., `"in exodus"`, `"in luke"` would correctly show 0 matches today but exist for forward authoring). Each flagged alias must be reviewed:
   - Forward-looking? → KEEP with a comment
   - Removed feature? → REMOVE
   - Typo/shadowed by a longer alias? → fix or remove

9. **Stale proposal artifacts** in `docs/rules/proposals/` — currently 5 files (v3.3-24, v3.3-25, v3.3-29, v3.3-30, v3.3-31). Per Phase 5.5 closure design, **these were intentionally kept as audit-trail artifacts** documenting the proposal-to-rule transition. Verify each proposal's content has actually been integrated into `RULES-CORE.md`:
   - Diff each proposal against the corresponding RULES-CORE section
   - If proposal text matches what landed in RULES-CORE → proposal is fully integrated; **decide with project lead**: keep as audit trail (current Phase 5.5 default) OR remove since RULES-CORE supersedes
   - If proposal differs (drafts diverged) → KEEP, document why
   - Default recommendation: keep, since the audit-trail value for Rule 28 reviewer onboarding outweighs the small storage cost. Surface for decision, don't auto-remove.

10. **Stale "PENDING" markers in editorial-log entries** — found 5+ in `genesis.md` (e.g., line 125 "ein Tag"/"Tag eins" which was resolved in Entry 072; line 153 "Luther policy" which was resolved in Entry 071). These are HISTORICALLY ACCURATE — they represent state at the time the entry was written. **Do NOT remove.** Optional improvement: append a "→ RESOLVED in Entry XXX" annotation as a forward-pointer. This is content addition, not removal.

11. **Stale `**Familiar name:**` lines in PEOPLE.md** (post-6.6B) — after 6.6B, the parser auto-extracts `familiarName` from the heading. The explicit `**Familiar name:** Adam` lines on entries where they match the heading-extracted value become structurally redundant. **DEFER:** the 6.6B sub-phase's risk note explicitly recommends leaving them ("harmless, documents intent"). Re-evaluating this would need a cleanup pass that:
    - Identifies entries where `## Name (Familiar)` heading-extracted value === explicit `**Familiar name:**` value → redundant
    - Identifies entries where they differ → explicit field genuinely overrides; KEEP
    - **Out of scope for 6.6I.** Per post-revision audit FT1, **this MUST be tracked in `docs/feedback/DEFERRED_TASKS.md`** as part of 6.6I's closure step so it isn't lost between phases. Action: 6.6I closure adds an entry to DEFERRED_TASKS.md noting the post-6.6B familiar-name redundancy as a forward-tracked future cleanup pass.

#### Out of scope (HIGH risk — explicitly deferred to future passes)

These categories are explicitly NOT touched in 6.6I. Removing them risks side-effects beyond static-analysis tooling's reach:

- **Markdown sections within actively-parsed files** — even if a section appears unused, it may be parsed by code I haven't inspected, used by tests, or intentional authoring scaffolding. Requires per-section domain review.
- **Type definitions in `src/domain/`** that look unused — domain types are the authoring API surface and may be referenced via JSON schemas, OpenAPI generation, or future infrastructure. Requires architectural review.
- **Cross-references in docs/ that may dangle** — 132 unique IDs referenced. Even if an entry doesn't exist, the reference may be a valid future placeholder, a typo we don't want to silently rewrite, or a citation to an external system. Requires manual cross-reference per item.
- **`scripts/lint-allowlist.txt` entries** — already verified clean in the cross-cutting integrity audit; no action needed.
- **Old CHANGELOG-vN.md files** — version history; intentionally retained for audit trail and tooling that may diff against them.

#### Approach (per-batch, gated)

For each enumerated category 1–10:

1. **Detect** with the appropriate tool/script. Save the candidate list as a temporary report (e.g., `tmp/dead-code-batch-N.txt`).
2. **Classify** each candidate: `REMOVE` / `KEEP` / `ANNOTATE`. Document reasoning per item.
3. **Act** on `REMOVE` candidates one batch at a time:
   - Apply removal
   - Run `pnpm test && pnpm build && pnpm lint && pnpm content:lint`
   - If any DoD fails → `git checkout -- <file>` to revert that batch; flag as `KEEP` with the failure reason
   - Visual smoke test on relevant pages (people, introduction, chapters)
   - Commit with explicit message naming the category + count removed
4. **Document** the audit's findings (counts kept vs. removed) in editorial-log entry.

#### DoD

- All 11 categories enumerated above audited
- For each category: report exists with classifications
- All `REMOVE`-flagged items removed; tests + build + lint + content-lint clean after each batch
- For `KEEP`-flagged items: each has documented reasoning (forward-API, dynamic-reference, historical, etc.)
- For `ANNOTATE`-flagged items: optional follow-up (PENDING markers gain `→ RESOLVED in Entry XXX`)
- **Closure entry written to `docs/audit/FIX_IMPLEMENTATION.md` (NOT editorial log)** — per Rule 28 + §EDITORIAL LOG SPECIFICATION §L1, editorial-log entries record translation/governance decisions (glossary deviations, formula variations, edition-policy interpretations, divine-name policy, reviewer disagreements, etc.). Code-cleanup audit findings don't trigger any §L1 category. The 6.6I closure entry summarizes: how many candidates per category, how many removed, how many kept-with-reason. Editorial-log entries may still be added IF a specific finding affects rule application (e.g., a parser-alias removal surfaces a glossary inconsistency) — but only for the rule-affecting subset, not the whole audit.
- No regressions introduced (tests pass; build pages count unchanged; visual smoke clean)

#### Risk

- **MEDIUM** without the gating discipline above — auto-removing on tool reports has high false-positive rate for our project (extensive dynamic references, Domain types as future API surface, intentional audit-trail artifacts)
- **LOW** with the gating discipline — each removal individually verified + reversible

#### Effort

**~2.5–3 hours total** (revised upward per post-revision audit R1 — original 1.5–2h estimate was too tight):
- Tool installs (`depcheck`, `knip`) + initial detection runs: 30 min
- Per-category review + classification: 45 min (across 12 categories)
- i18n-key script (Item #7 — handling template-literal patterns, nested keys like `people.inBook.${book}`, `useTranslations()` aliases, conditional fallbacks): 30 min for the script alone
- knip false-positive review (Item #6 — many `PersonEntry` fields are parsed but not yet rendered: `verseCount`, `keyEvents`, `keySpeeches`, `firstMention`, `mentionedIn`, `historicityStatus`, `languagesSpoken`, `inLaws`. Each requires manual KEEP-with-reason review): 20 min
- Removals + per-batch DoD verification (`pnpm test && pnpm build && pnpm lint && pnpm content:lint` per batch — ~2-3 min × 5+ batches = 10-15 min on test cycles alone): 30 min
- 6.6I closure entry in `FIX_IMPLEMENTATION.md` (NOT editorial log — per Rule 28 / §L1 distinction; see R3 below): 15 min

#### Order in execution sequence

**6.6I runs LAST**, after 6.6A through 6.6H. Reasoning:
- 6.6B's parser fix may make some `**Familiar name:**` lines redundant (deferred to future cleanup, but the analysis happens here)
- 6.6D's field reorder, 6.6E's accordion, 6.6F's breadcrumb may add new imports / change which i18n keys are referenced — auditing against the latest stable state is more accurate
- 6.6G's content authoring touches many files; cleaning before would mean re-checking after
- 6.6H's content fixes likewise

Plus: 6.6I's per-batch test+build gates double as a final integration test for the whole 6.6 phase block.

---

### 6.6H — Important women timeline visibility audit

**Layer:** content audit + `src/ui/people/people-timeline.tsx`

#### Eve / Sarai handling — DECIDED: Option 1 (accept-the-gap) per auditor §4.1

**Both Eve and Sarai stay in the expandable bio list but do NOT receive speculative timeline anchors.** Reasoning:
- Eve: Genesis gives no birth or death year. Adding speculative anchors would invent dates the text does not state — direct violation of the Prime Directive ("do not clarify what the source text leaves ambiguous").
- Sarai: Sarai's dates ARE computable from Gen 17:17 + 23:1 (born AM 1958 per Avram's birth at AM 1948 + 90 years; died AM 2085 per age 127), but those verses are outside Gen 1–12 file scope. **Importing data outside the file's documented scope is a Rule 28 governance decision.** Deferred to Phase 12 (Gen 13–50 content cycle), where Genesis 17–23 enters the canonical scope and Sarai's anchors can be authored alongside the chapters that state them.

The accordion list still shows Eve and Sarai; only the SVG bar is absent until anchorable. This is **correct behavior** — it accurately reflects what the text states vs. what it leaves silent. Document this choice in the editorial-log entry.

#### Approach

1. **Audit current state (parseInt-safe verification per auditor §3.2):**
   - Genesis women authored: Chava (Eve), Sarai. **Confirm: both have `**Year from creation:** not stated`** → no timeline anchor → excluded by `pickAnchor()`. This is intentional per the Option-1 decision above; document only.
   - Matthew women authored: Tamar, Rachav, Rut, Miryam. Check that each has parseInt-safe `**Historical year:**` (bare integer). Tamar / Rachav / Rut may need verification — current values unknown until audit run.
   - **parseInt verification command:** `python3 -c "import re; ..."` or `node -e "..."` script that walks every numeric anchor field across the 4 locales × 2 books (genesis + matthew) and reports any `parseInt` failures
   - This verification is the audit's deliverable — finds any other dangling anchors beyond the Miryam / Yosef cases caught in 6.6G

2. **`pickAnchor()` filter audit:** read `src/ui/people/people-timeline.tsx` to confirm what determines timeline inclusion. Currently filters by presence of `timelineAnchor` ("creation" | "historical") AND a parseable `yearFromCreation` or `historicalYear`. Document the filter logic in the audit notes.

3. **Targeted content fixes (per Option-1 decision):** add parseInt-safe timeline anchors only for women whose dates the text states or strongly implies (e.g., Tamar's Gen-38-era anchor relative to Yehuda's lifespan IF Tamar is currently in genesis/PEOPLE.md). Do NOT speculate dates for Eve or Sarai; defer to Phase 12.

4. **Forward-look:** Phase 12 (Gen 13–50) will add Rebekah, Rachel, Leah, Bilhah, Zilpah, Dinah, Tamar (Gen 38), Asenat. The timeline filter must support them once authored — verify the existing `pickAnchor()` doesn't have name-specific exclusions (check now). When Phase 12 lands, Sarai's anchor (computed from Gen 17:17 + 23:1) is authored as part of that file-scope expansion.

#### Edge cases

- **Bat-Sheva (auditor §5.8):** **intentionally absent from matthew/PEOPLE.md**. The Matthew narrative deliberately uses circumlocution ("the *one* of Uriyah", τῆς τοῦ Οὐρίου, 1:6), avoiding her name. Authoring a Bat-Sheva entry in matthew/PEOPLE.md would conflict with the text's own treatment. Her bio belongs in `samuel/PEOPLE.md` or `kings/PEOPLE.md` when those books are authored. Document this in the editorial log to prevent the question reopening.
- **Anchor type consistency:** Genesis women have `creation` anchor (Chava would be AM 1 if anchored; Sarai AM 1958 if anchored). Matthew women have `historical` anchor (Miryam ~-20 BCE). Timeline UI must handle both (already does per Phase 1H work — verify in audit).
- **Tamar duplication:** Gen 38 Tamar (in eventual genesis/PEOPLE.md) is a different person from matthew/PEOPLE.md Tamar (genealogy ancestor). Verify both are authored separately when relevant; no merge.

#### DoD

- parseInt-verification script run across `content/*/{genesis,matthew}/PEOPLE.md` numeric-anchor fields — reports 0 NaN cases (after 6.6G fix)
- Visual review at `/{locale}/{genesis,matthew}/people` timeline chart — all authored women with state-able anchors visible; Eve and Sarai shown in expandable list but absent from chart (intentional)
- Editorial-log entry documents:
  - Option-1 decision for Eve/Sarai (Prime Directive compliance)
  - Bat-Sheva intentional-absence reasoning
  - parseInt-safe convention reaffirmation (cross-references 6.6G's editorial-log entry)
- Tests pass; build clean; lint clean

**Risk:** Some Hebrew Bible women may not have explicit chronology in the text. Mitigation: per Option-1 decision above, accept the gap — do not invent anchors.

**Effort:** ~45 min (audit + targeted fixes + visual review + editorial-log entry).

---

## 3. Decisions resolved

All major decisions resolved post-audit:

- **6.6A scope:** numeric/scriptural ranges only (regex anchored on digits), with locale-specific pre-sweep audit (especially ES with 411 occurrences)
- **6.6C disclaimer placement:** collapsed `<details>` at top labeled "Reading note" / "Nota de leitura" / "Hinweis zum Lesen" / "Nota de lectura". Disclaimer remains in DOM and keyboard-accessible — Rule 29 §line-792 disclaimer requirement satisfied (verified directly against rules text; auditor §4.3 incorrectly claimed introductions are exempt — they are not, but the collapsed-details approach still meets the requirement since the disclaimer remains visible when expanded)
- **6.6D field reorder:** scoped to biographical-fields block ONLY (positions 4–20); top blocks (`crossBookSee`, `inBook`, `generationsFrom`) and bottom blocks (archaeology, regionsByText, curiosities) preserved exactly as-is. i18n keys already exist in all 4 locales — no new keys needed.
- **6.6G claim-types:** Herod's Josephus citations relabeled from `LATER RECEPTION — DOCUMENTED` to `HISTORICAL / ARCHAEOLOGICAL — VERIFIED` per Rule 29 dual-label semantics (DOCUMENTED only pairs with LATER RECEPTION).
- **6.6G numeric-anchor convention:** bare integers in `historicalYear` / `historicalYearEnd` / `yearFromCreation` / `yearFromCreationEnd`. Approximation in lifespan/note text. Existing Miryam + Yosef `c. -20` / `c. -25` values normalized to bare ints.
- **6.6H Eve/Sarai:** Option 1 (accept-the-gap). Both stay in expandable list, no SVG bar. Sarai's eventual anchor authored in Phase 12 from Gen 17:17 + 23:1.
- **6.6H Bat-Sheva:** intentionally absent from matthew/PEOPLE.md per Matthew's circumlocution; bio belongs in future samuel/kings PEOPLE.md.

---

## 4. Recommended execution order

| Order | Sub-phase | Reason |
|-------|-----------|--------|
| 1 | **6.6A** en-dash sweep | Independent; mechanical; biggest immediately-visible content cleanup; affects every page |
| 2 | **6.6B** parser fix | Unblocks fixing the `Adam (Adam) (Adam)` display; small, well-scoped |
| 3 | **6.6E** accordion | Small, independent, immediate UX win |
| 4 | **6.6F** chapter breadcrumb | Small, independent, navigation consistency |
| 5 | **6.6D** field reorder + birth/death | Depends on 6.6B for clean data; UI-only |
| 6 | **6.6G** Matthew people lifespan + dates | Content authoring + Miryam/Yosef format fix; depends on 6.6D field structure being in place |
| 7 | **6.6C** introduction layout | Less urgent; design-judgment heavy |
| 8 | **6.6H** women timeline | Audit-driven; depends on 6.6G's parseInt-safe convention being applied |
| 9 | **6.6I** dead-code/content audit (NEW) | Runs LAST so it audits against the final stable state of 6.6A–H. Gated, per-batch, tool-driven. |

Each sub-phase: closure entry → audit → meta-doc sync (per established discipline).

---

## 5. Aggregate scope

| Layer | Files touched | Estimated effort |
|-------|---------------|------------------|
| Content sweeps (6.6A) | ~200 .md files across 4 locales (with ES per-locale audit step) | 35 min |
| Parser code (6.6B) | `people-parser.ts` + 4 new tests + slug-anchor verification | 30 min |
| UI code (6.6C, D, E, F) | `introduction-view.tsx`, `introduction/page.tsx`, `person-card.tsx`, `chapter-view.tsx` (no new i18n keys needed for 6.6D) | 1.25 h |
| Content authoring (6.6G) | 5 Matthew entries × 4 locales = ~80 fields + Miryam/Yosef format fix per locale | 1.75 h |
| Audit + targeted fix (6.6H) | timeline component verification + parseInt-safety audit + content gap-fill | 45 min |
| Dead-code/content audit (6.6I) | tool runs + 12-category review + per-batch removals with DoD gating | 2.5–3 h (revised per post-revision audit R1; original 1.5–2h underestimated test cycle + i18n script + knip false-positive review) |
| Editorial-log entries | 5–6 new entries (per auditor §5.4 explicit per-sub-phase counting: 6.6B parser change ✓, 6.6C disclaimer placement ✓, 6.6D UI reorder — optional, 6.6G content + numeric-anchor convention ✓, 6.6H Option-1 decision + Bat-Sheva ✓). 6.6I closure goes to `FIX_IMPLEMENTATION.md` not editorial log per post-revision audit R3 + Rule 28 §L1. | 30 min |
| **Total** | | **~8–9 hours** (vs original 5–6h estimate; increase from added audit-driven steps + new 6.6I cleanup pass + revised R1 effort estimate) |

DoD per sub-phase: 792+/792+ tests pass, build clean, lint clean, content-lint exit 0, visual review at `/genesis/people` + `/matthew/people` + `/john/people` + chapter routes across 4 locales.

**Pre-execution baseline (auditor §5.6):** verify `pnpm test` reports ≥ 792 passing before starting. Use this as the +N tests baseline for tracking.

---

## 6. Architectural compliance checklist

For each sub-phase:

- ✅ **DDD layering:** content/markdown changes stay in content/; parser changes stay in infrastructure/; UI changes stay in ui/; routing in app/
- ✅ **Static-first:** all changes preserve build-time parsing; no runtime fetching introduced
- ✅ **Tailwind v4 OKLCH:** no hardcoded hex; reuse existing tokens (text-muted, accent, border, etc.)
- ✅ **Lucide icons at 1.5px stroke:** ChevronLeft for breadcrumb (6.6F) — matches existing pages
- ✅ **WCAG 2.2 AA:** focus rings preserved on all interactive elements; tap targets ≥ 44×44px; `<details>` keyboard nav intact (6.6E)
- ✅ **Anti-slop:** no decorative animation added; minimal visual changes; no religious clichés in disclaimer wording (6.6C)
- ✅ **Translation rules:** Rule 29 disclaimer remains visible (6.6C); confidence labels per Rule 13 (6.6G); no theology imported in date estimates (6.6G uses POSSIBLE/UNCERTAIN per Rule 3)
- ✅ **Rule 28 review workflow:** all content changes carry `provisional` status; editorial-log entries logged with reviewer flag
- ✅ **Test coverage:** new fields + parser logic accompanied by Vitest cases (6.6B); no UI smoke tests required (manual visual review suffices per CLAUDE.md `For UI or frontend changes, start the dev server and use the feature in a browser`)

---

## 7. Risks + mitigations

| # | Risk | Severity | Mitigation |
|---|------|----------|-----------|
| 1 | 6.6A regex over-matches non-range double-hyphens | LOW | Numeric-only first pass; show residue before second pass; spot-check |
| 2 | 6.6B parser change breaks existing content with non-paren headings | LOW | Optional regex match; fall back to `name = full heading, familiarName = undefined`; test case for non-paren heading |
| 3 | 6.6C de-emphasized disclaimer flagged by Rule 29 reviewers | MEDIUM | Keep disclaimer accessible (not display:none); editorial-log entry documents placement reasoning |
| 4 | 6.6E single-expand may surprise users (have to re-open closed cards) | LOW | Native browser feature; well-known pattern; can be reverted by removing `name` attribute |
| 5 | 6.6G date estimates introduce theological/historical bias | MEDIUM | Use UNCERTAIN where genuine; cite Josephus + textual evidence; per Rule 3, frame as "scholarly estimate" not "historical fact" |
| 6 | 6.6H timeline filter exposes Phase 12 content gaps | LOW | Expected; gracefully skip absent persons; document remaining gaps for Phase 12 |
| 7 | Cumulative meta-doc drift after 9 sub-phases | LOW | After-each-sub-phase audit + final cross-cutting integrity check (per established Phase 6 discipline) |
| 8 | 6.6I auto-removal false-positive (knip / depcheck / i18n script flag forward-API or dynamic-reference items) | MEDIUM without 3-stage gate; LOW with it | The 3-stage detect/classify/act gate is mandatory. REPORT-only for high-risk tools. Per-batch DoD verification (test + build + lint + content-lint) between every removal batch. Revertable per batch via `git checkout`. Forward-API items (Domain types, parser aliases for unauthored future books) explicitly KEEP-with-reason. |

---

## 8. Post-execution validation

Run full DoD pipeline:
- `pnpm test` — should be 796+/796+ (792 baseline + 4 new tests in 6.6B)
- `pnpm build` — clean static generation
- `pnpm lint` — Biome clean
- `pnpm content:lint` — exit 0 (warn-only signals OK if pre-existing)
- Visual smoke test (manual):
  - `/{locale}/genesis/people` — Adam shows single-name display + lifespan as 2nd field; accordion exclusive
  - `/{locale}/matthew/people` — Yeshua shows lifespan + birth/death + see-only entries link to Genesis
  - `/{locale}/genesis/chapter/5` — verse refs use `–` not `--`
  - `/{locale}/matthew/chapter/2` — Josephus citations use `–` not `--`
  - `/{locale}/matthew/introduction` — page-header lede dominant; disclaimer accessible but not duplicative
  - `/{locale}/genesis/chapter/1` — breadcrumb "← Genesis" visible
  - All 4 locales × 3 books × 3 chapters minimum

---

## 9. Cross-cutting integrity sweep (final step)

After all sub-phases close, run:
- All meta-doc claims (CLAUDE.md / README.md / PENDING.md / FEEDBACK.md / DEFERRED_TASKS.md) reflect new state
- Editorial-log entry numbering monotonic (next entry from genesis.md 100 = 101, etc.)
- No stale phase/test-count claims across any document
- 6.6 closure entry in FIX_IMPLEMENTATION.md synthesizes the work like Phase 6 closure did

---

## 10. Status tracking

| Sub-phase | Status | Notes |
|-----------|--------|-------|
| 6.6A | NOT STARTED | Decided: numeric-only sweep + ES per-locale pre-audit + dual residue grep |
| 6.6B | NOT STARTED | 4 tests required + slug-anchor audit + line-order processing comment |
| 6.6C | NOT STARTED | Decided: collapsed `<details>` "Reading note" at top |
| 6.6D | NOT STARTED | Decided: biographical-fields-block-only reorder (top + bottom blocks preserved) + explicit birth/death fields. i18n no-op confirmed. |
| 6.6E | NOT STARTED | HTML-native; curiosities defensive-guard dropped (no `<details>` to conflict with); screen-reader test added to DoD |
| 6.6F | NOT STARTED | Breadcrumb pattern matching People/Introduction pages |
| 6.6G | NOT STARTED | 5 Matthew entries × 4 locales + Miryam/Yosef format fix + Herod claim-type CORRECTED to HISTORICAL/ARCHAEOLOGICAL — VERIFIED + numeric-anchor convention documented |
| 6.6H | NOT STARTED | Decided: Option 1 (accept-the-gap) for Eve/Sarai. parseInt-safety audit. Bat-Sheva intentional absence documented. |
| 6.6I | NOT STARTED (NEW) | Dead-code + dead-content audit. Read-only first; per-item review gates removal. 12 categories scoped (6 low-risk + 6 medium-risk; 5 high-risk deferred). Runs LAST after all other sub-phases. Effort revised to 2.5–3h per post-revision audit R1. Closure entry goes to `FIX_IMPLEMENTATION.md` (not editorial log) per R3. FT1 (familiar-name redundancy → DEFERRED_TASKS.md) + FT2 (orphan .md files → Item #12) absorbed. |

---

**Plan author:** claude-opus-4-7, 2026-05-09, post Phase 6 closure
**Audits:**
1. First pass — `docs/audit/archive/AUDIT_NEW_PLAN.md` §1–§7 (claude-opus-4-7, 2026-05-09): 2 execution-blockers + 4 governance/correctness items + 6 minor improvements absorbed; auditor §4.3 was incorrect — verified against RULES-CORE.md line 792.
2. User-requested addition (2026-05-09): 6.6I dead-code/content cleanup sub-phase added.
3. Second pass — `docs/audit/archive/AUDIT_NEW_PLAN.md` §"Post-revision review" (claude-opus-4-7, 2026-05-09): verdict "Plan is ready for execution"; R1/R2/R3 refinements absorbed; FT1/FT2 forward-tracking items absorbed; auditor self-corrected on §4.3.
**Status:** Plan revised through three audit passes. All decisions resolved. **APPROVED for execution.**
**Next action:** execute in recommended order (§4) with per-sub-phase audit + meta-doc sync; final cross-cutting integrity sweep on closure.
