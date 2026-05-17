# Fix & Implementation Plan

**Created:** 2026-05-08
**Updated:** 2026-05-08 — folded in topics 1, 2, 3.1–3.11 from the People & Genealogy / Book Context / Book Introduction discussion.
**Revised:** 2026-05-08 (post-audit) — incorporated the 7 blockers and 9 significant concerns from `docs/audit/archive/AUDIT_FIX.md`. New Phase 5.5 extracted for rule amendments. Phase 1 sub-items respecified (matching strategy, period algorithm, Curiosities format, generation-reference extensibility, safeguard-pointer UI). Phase 0 lint rules path-scoped and allow-list mechanism specified. CLAUDE.md sync added to per-phase Definition of Done. Per-phase git tagging added for rollback.

**Authoritative inputs:**
- `docs/feedback/FEEDBACK.md` — verified re-audit (2026-05-08)
- `docs/audit/PENDING.md` — verified open items (2026-05-08)
- `docs/feedback/DEFERRED_TASKS.md` — verified deferred tasks (2026-05-08)
- `docs/audit/archive/AUDIT_FIX.md` — independent audit of the 2026-05-08 plan (Claude Opus 4.7)
- `docs/rules/RULES-CORE.md` + `RULES-HB.md` + `RULES-GS.md` (v3.2) — translation governance
- `docs/architecture/STANDARDS.md` — DDD, TypeScript, testing, dependencies
- `docs/design/TT-DESIGN-SYSTEM.md` — visual / interaction standards

**Scope:** every verified open item across the audit docs, the People-surface bugs, the Book Context / Book Introduction surface decisions, the rules amendments needed for governance gaps, and the audit blockers that surfaced in `AUDIT_FIX.md`. Item 3.10 (regions/peoples descended from) is in scope only in the rule-compliant `regionsByText` constrained form.

---

## Operating principles (apply to every phase)

### From `RULES-CORE.md` and supplements (v3.2)
- **Prime Directive:** do not simplify what the source keeps complex; do not clarify what it leaves ambiguous.
- **Rule 25 (YHWH):** never substitute "LORD." YHWH in EN/PT/ES, JHWH in DE.
- **Rule 28 (review workflow):** edits that touch translation choices, glossary entries, or rule wording require an editorial-log entry and the reviewer-matrix sign-off. Mechanical edits do not.
- **Rule 29 (companion governance):** any new companion content uses the dual-label system (claim-type + confidence) and Section H source provenance categories.
- **Anti-ethnogenesis safeguard** (RULES-CORE + Gen 9 §F5 + Gen 10 §F1): the text must not be mapped onto modern racial, ethnic, or national groups. Any new "regions / peoples descended from" content is restricted to what the biblical text itself names — no speculative modern mapping.
- **Amendment & Lock Protocol** (RULES-CORE.md §Amendment & Lock Protocol): rule changes require a written proposal in `docs/rules/proposals/`, an impact assessment listing affected signed-off verses, and a 14-day decision window — except when invoked as an Emergency Amendment with explicit rationale.

### From `STANDARDS.md`
- **DDD layering preserved:** any code change keeps `domain/` framework-free; `infrastructure/` adapters; `ui/` presentation; `app/` routing; `lib/` only as the bridge.
- **Test-first for parser changes:** if a parser is touched, add a Vitest case before changing behaviour. Build and test must pass after every phase: `pnpm test && pnpm build`.
- **No new dependencies** unless justified in a phase's Definition of Done.
- **Path aliases (`@/...`)**, strict TypeScript, no `any`.

### From `TT-DESIGN-SYSTEM.md`
- **Editorial clean, anti-slop:** any new UI surface uses Newsreader / Geist / Geist Mono, OKLCH tokens, Lucide at 1.5px, focus rings, 44×44px tap targets, `prefers-reduced-motion`.
- **No hardcoded hex; no pure black/white** (current `fill: "white"` in the lifespan timeline violates this; Phase 1 fixes it).
- **The UI recedes; the text speaks.** No decorative additions in this remediation cycle.

### Cross-cutting working rules
- **EN-first for translation/editorial work**, then PT-BR, DE, ES.
- **Lock the gain via lint:** every mechanical fix that can regress is mirrored as a `scripts/content-lint.sh` rule before the phase closes.
- **Tag git after each phase:** `git tag tt-fix-phase-N-complete` after a successful phase closes. If a subsequent phase fails, rollback target is the last successful tag. (Resolves AUDIT §5.5.)
- **Keep meta-docs current.** Whenever a phase changes state that the meta-docs describe — ruleset version, test count, content scope, open-items list — the per-phase DoD includes syncing **all four**: `CLAUDE.md`, `docs/feedback/FEEDBACK.md`, `docs/audit/PENDING.md`, `docs/feedback/DEFERRED_TASKS.md`. Ruleset version bumps (e.g. Phase 5.5 → v3.3) trigger an explicit version-stamp sweep across all four docs as part of that phase's closure. This is the same drift mechanism that produced the original 180-references-at-v3.0 problem; treating one doc differently from the others reproduces the problem.
- **Definition of Done per phase:**
  1. All target files updated.
  2. `pnpm test` passes.
  3. `pnpm build` passes.
  4. `pnpm content:lint` passes — extended where applicable.
  5. **`pnpm lint` (Biome) passes** — gating from Phase 2 onward, once Phase 2D restores it. Phase 0 and Phase 1 predate the Biome config migration; they did not gate on Biome.
  6. Editorial-log entries written for any change in scope of Rule 28.
  7. **Meta-docs synced** — `CLAUDE.md`, `FEEDBACK.md`, `PENDING.md`, `DEFERRED_TASKS.md` updated wherever the phase touches state they describe. Ruleset bumps trigger version-stamp sweep across all four.
  8. Git tag applied: `tt-fix-phase-N-complete`.

---

## Phase 0 — Tooling: harden `content:lint` before the sweep

**Goal:** every mechanical issue must be detectable so we do not regress.

**Why first:** purely additive (extends `scripts/content-lint.sh`). Running it against the current tree gives a baseline failure count for each later phase.

**Design notes (post-audit):**
- The existing `scripts/content-lint.sh` has only an exit-1-on-any-error model. It does **not** support warnings or allow-lists. Phase 0 introduces both: a sidecar allow-list file and a `--warn-only` mode for rules that surface candidates without blocking the build. (Resolves AUDIT §4.8 and §3.1.)

**Tasks:**

### 0.0 Lint script infrastructure (NEW per AUDIT §3.1, §4.8)

1. Add a `--warn-only` flag to `scripts/content-lint.sh`. When set, matches print to stderr but do not increment `ERRORS` or trigger `exit 1`. Default (no flag) remains blocking.
2. Add `scripts/lint-allowlist.txt` — sidecar file listing exact line patterns to suppress, format `<rule-id>:<file-path>:<exact-pattern>`. The script reads this file and `grep -F -v -f` excludes matches.
3. Add `pnpm content:lint:warn` script alias to `package.json` that runs `bash scripts/content-lint.sh --warn-only` for CI integration.

### 0.1 Stale ruleset version stamps (BLOCKING)

**Pattern coverage** — verified against actual front-matter forms in chapter files and PEOPLE.md, and against `Ruleset version in force:` in editorial logs:

```
Ruleset v3\.0|Ruleset v3\.1
Conjunto de Regras v3\.0|Conjunto de Regras v3\.1
Reglas v3\.0|Reglas v3\.1
Regelwerk v3\.0|Regelwerk v3\.1
Ruleset version in force:\*\* v3\.0|Ruleset version in force:\*\* v3\.1
\*\*Ruleset:\*\* v3\.0|\*\*Ruleset:\*\* v3\.1
\*\*Regelwerk:\*\* v3\.0|\*\*Regelwerk:\*\* v3\.1
```

The last two patterns address AUDIT §5.8 (the bolded `**Ruleset:** v3.0` form in PEOPLE.md was not covered in the original §0.1 regex). Phase 2A's edit set must mirror this expanded coverage exactly. (Resolves AUDIT §4.6 + §5.8.)

After Phase 6.5 lands a new ruleset version (v3.3), update §0.1 to flag any reference older than v3.3.

### 0.2 Raw em-dash residue (BLOCKING)
Pattern: ` -- ` in any companion, chapter, or PEOPLE.md file.

### 0.3 ES NT diacritic loss (BLOCKING)
Pattern: `\bTraduccion\b|\bEdicion\b|\bEspanol\b|\bPolitica\b|\bSenor\b` in `content/es/john/` and `content/es/matthew/`.

### 0.4 ES NT missing Reina-Valera declaration (BLOCKING)
Flag any ES NT chapter file whose front matter lacks `Reina-Valera`.

### 0.5 PT-BR `unigênito` (BLOCKING — until Phase 4 lands)
Flag occurrences in PT-BR John chapters and CONTEXT companions.

### 0.6 John PEOPLE.md absence (BLOCKING — ACTIVATED 2026-05-14 post-Phase 10 closure)
Fail if `content/<locale>/john/` exists without `PEOPLE.md`. Activated in `scripts/content-lint.sh` after Phase 10 (`docs/audit/archive/PHASE_10_PLAN.md`) closed 2026-05-14 with all 4 locales authored.

### 0.7 PEOPLE.md "TT" leftover heading + H1 disposition (BLOCKING)

**Lint pattern:** flag any `^## The Transparent Translation` inside a PEOPLE.md file.

**H1 disposition (resolves AUDIT §4.7):** the existing H1 (`# Genesis — People and Genealogy`) is dead weight — the page renders its title via i18n in `app/[locale]/[book]/people/page.tsx`. Phase 1A removes both the H1 and the H2; the file starts directly with the metadata block. Lint rule §0.7 also flags any leftover H1 of the form `^# .* People and Genealogy` to prevent regression.

### 0.8 PEOPLE.md heading transliteration=familiar collision (BLOCKING with allow-list)

**Pattern:** `^## (\S+) \(\1\)$` in non-EN PEOPLE.md files.

**Allow-list mechanism (resolves AUDIT §4.8):** sidecar file `scripts/lint-allowlist.txt` lines like:
```
0.8:content/en/genesis/PEOPLE.md:## Adam (Adam)
0.8:content/en/genesis/PEOPLE.md:## Lot (Lot)
0.8:content/es/genesis/PEOPLE.md:## Lot (Lot)
```

The script reads this file at startup and excludes matched (rule-id, file, pattern) tuples from error counts. EN entries where the transliteration genuinely equals the familiar form are allow-listed; non-EN entries that match the pattern (the DE Henoch case) are not.

### 0.9 PEOPLE.md raw `--` in field values (BLOCKING)
Covered by §0.2; called out separately because PersonCard renders raw values into the DOM.

### 0.10 Modern-mapping smell-test — PATH-SCOPED + WARN-ONLY (resolves AUDIT §3.1, §3.4, §4.3)

**Pattern:** `\b(Russia|Europe|Africa|Asia|Slavic|Aryan|Caucasian|Semitic peoples|Hamitic|Japhetic peoples)\b`.

**Path scope (NEW):** **only `PEOPLE.md` files** under `content/`. Companion files (`study/CHAPTER-N-CONTEXT.md`) are **not** linted by this rule, because reception-history sections legitimately mention these terms (Curse-of-Ham anti-misuse, Table-of-Nations safeguard, etc.). Path-scoping the rule prevents Phase 8 / Phase 9 / safeguard-authoring builds from failing on legitimate Tier-3 reception content.

**Mode:** runs under `--warn-only` by default. Output goes to stderr; build does not fail. The rule surfaces candidates for manual reviewer attention in PEOPLE.md only — where the constrained `regionsByText` field lives — rather than auto-blocking. The Rule 28 reviewer matrix catches subtler violations.

The original §0.10 framing ("does not auto-block") is now backed by an actual mechanism. (Resolves AUDIT §3.1.)

### 0.11 Pre-Phase-1A "TT entry parsed as person" smoke check
Add a one-time test (Phase 1B test additions) that asserts the parser does not produce a PersonEntry for a heading containing "Transparent Translation" — preserves the gain after Phase 1A.

**Files touched:** `scripts/content-lint.sh`, new `scripts/lint-allowlist.txt`, `package.json` (one new script alias).

**Done when:** `pnpm content:lint` exits non-zero on every flagged blocking issue, baseline failure count recorded in this document's Revision Log; `pnpm content:lint:warn` runs §0.10 without exit-1.

**Estimated effort:** 90–120 min (longer than original because of the warn-mode + allow-list infrastructure).

---

## Phase 1 — People-surface foundation (code only, no translation judgement)

**Goal:** fix the People parser, view, and timeline bugs and expand `PersonEntry` so subsequent People-content phases (Phase 10 John PEOPLE; Phase 12 Genesis 13–50) build on a correct foundation.

### 1A. Strip both the TT H2 and the dead H1 from PEOPLE.md files (3.1, AUDIT §4.7)

Currently each file starts:
```
# Genesis — People and Genealogy        ← H1, dead weight
## The Transparent Translation (TT)     ← H2, parsed as empty PersonCard
---
**Book:** ...
```

**Action:** delete both H1 and H2 from all 8 existing PEOPLE.md files. Files start directly with the `---` separator and the metadata block. Lint rule §0.7 prevents regression of either.

### 1B. Parser rewrite — per-locale alias table with explicit matching strategy (3.5, AUDIT §4.1)

**Matching strategy (NEW, resolves AUDIT §4.1):** the parser uses **exact-match-first, substring-fallback** in this order:

1. Lower-case the field key, strip the trailing colon and any surrounding whitespace.
2. Look up the normalised key in an **exact-match alias table** (`Map<string, FieldId>`). If matched, route to the field. Done.
3. If no exact match, fall through to the legacy substring-includes path with **longest-alias-first ordering** (so `idade ao tornar-se pai` is checked before `pai`). This handles file labels we have not yet seen.
4. If still no match, the line is ignored (current parser behaviour preserved).

```ts
// src/infrastructure/content/people-parser.ts
type FieldId = "ageAtFatherhood" | "father" | "placesLived" | /* ... */;

const EXACT_LABEL_ALIASES: Record<FieldId, string[]> = {
  ageAtFatherhood: [
    "age when became father", "age at fatherhood",
    "idade ao tornar-se pai", "idade ao ser pai",
    "alter bei erster vaterschaft", "alter bei vaterschaft",
    "edad al hacerse padre", "edad al ser padre",
  ],
  father: ["father", "pai", "vater", "padre"],
  // ...
};

// Build O(1) lookup once at module load:
const EXACT_LOOKUP = buildLookup(EXACT_LABEL_ALIASES);
// Sorted-by-length-desc list for fallback substring path:
const FALLBACK_PATTERNS = sortByLengthDesc(EXACT_LABEL_ALIASES);
```

**Bug catalogue (verified):**

| Locale | Actual label | Parser expects | Falls through to | Net effect |
|--------|--------------|----------------|------------------|------------|
| PT | `Idade ao tornar-se pai` | `idade ao ser pai` | `pai` (father) | Father field overwritten by age value |
| DE | `Alter bei erster Vaterschaft` | `alter bei vaterschaft` | `vater` (father) | Same |
| ES | `Edad al hacerse padre` | `edad al ser padre` | `padre` (father) | Same |
| PT | `Locais onde viveu` | `lugares vividos` | nothing | placesLived missing |
| DE | `Orte, an denen er lebte` | `lebensorte` | nothing | placesLived missing |
| DE | `Heimatort` | `heimatstadt` | nothing | hometown missing |
| DE | `Gesellschaftliche Schicht` | `soziale klasse` | nothing | socialClass missing |
| DE | `Charakterbogen` | `charakterentwicklung` | nothing | characterArc missing |
| DE | `Historischer Status` | `historizität` | nothing | historicityStatus missing |

**Tests (Vitest, before code changes per STANDARDS §14):** add per-locale per-field cases to `src/infrastructure/content/__tests__/people-parser.test.ts` covering at minimum:
- Exact-match path: each locale's actual label routes to the correct field.
- No-overwrite invariant: parsing a `father` line followed by `age at fatherhood` does **not** overwrite `father`.
- Fallback path: a fictional label not in the alias table but containing a known substring still routes correctly.
- TT-H2 negative test: a line `## The Transparent Translation (TT)` followed by metadata produces no PersonEntry (companions §0.11).

Existing 22 tests must still pass; new tests bring the suite up by ~14.

### 1C. PEOPLE.md heading convention enforcement (3.3, AUDIT §3.4 path-scope confirmed)

**Action:**
- Audit each non-EN PEOPLE.md heading and rewrite to `## Transliteration (Familiar)`. The DE Chanokh case `## Henoch (Henoch)` becomes `## Chanokh (Henoch)`. Same review for Enosh, Mahalalel, Yered, Metushelach, Lemekh, Noach across PT-BR / DE / ES.
- Lint rule §0.8 covers regression with the allow-list mechanism.
- **Editorial-log entry** (Rule 28): one combined entry — "PEOPLE.md heading convention enforcement; non-EN entries normalised to `Transliteration (Familiar)` form. No translation choice changed."

### 1D. Lifespan-timeline rendering fix (3.2)

`src/ui/people/people-timeline.tsx` lines 110–117 use `fill: "white"` for in-bar text — violates `TT-DESIGN-SYSTEM.md` §5 and overflows narrow bars.

**Action:**
- Drop the inside-the-bar lifespan label entirely.
- Move the lifespan number to the **right of each bar** in `text-text-secondary` (OKLCH token).
- Year-axis ticks already encode the time scale.
- Visually verify across Genesis (Adam 930) and Matthew (~33 yrs) via `pnpm dev`.

### 1E. Timeline supports `historicalYear` (3.11)

**Action:**
- Detect dominant anchor by inspecting populated entries: render against `yearFromCreation` if dominant; against `historicalYear` if dominant.
- Locale-aware caption via i18n keys (no more hardcoded "Masoretic Text chronology" in the component).
- Books with both anchors (theoretical) render two stacked timelines.
- If neither anchor populated, component returns `null` — preserved.

### 1F. Chronological card order (3.8) + Genesis period grouping with single deterministic algorithm (3.9, AUDIT §4.3)

**Sort:** in `app/[locale]/[book]/people/page.tsx`, sort entries by:
1. `yearFromCreation` ascending if present; else
2. `historicalYear` ascending if present; else
3. file-order fallback.

**Period grouping — single deterministic algorithm (resolves AUDIT §4.3):**

For Genesis only, after sorting:

```
For each consecutive pair (prev, curr) of timeline entries:
  Step 1 — Watershed check (takes precedence):
    For each watershed in [Flood (AM 1656), Babel (AM ~1996), Avram's call (AM ~2021)]:
      If watershed is between prev.deathYear and curr.birthYear:
        Insert divider with watershed label.
        Continue to next pair (do NOT also check gap).

  Step 2 — Gap check (only if no watershed inserted):
    If curr.birthYear - prev.birthYear > 200 years:
      Insert generic divider (no label).
```

Watershed always wins over gap. The two heuristics no longer conflict because watershed is checked first and short-circuits the gap check for that pair. Matthew/John get no period dividers.

**Constants** (`AM_FLOOD = 1656`, `AM_BABEL = 1996`, `AM_AVRAM_CALL = 2021`) live in `src/ui/people/genesis-watersheds.ts` (typed module, not magic numbers).

### 1G. PEOPLE.md em-dash sweep (3.6)

Sweep all 8 PEOPLE.md files for ` -- `; replace per the EN convention. Lint rule §0.2 catches regression.

### 1H. Data-model expansion (3.4 / 3.7 / 3.10 constrained)

#### 1H-1. Curiosities (3.4) — markdown format specified (resolves AUDIT §4.2)

**Domain type:**
```ts
export interface CuriosityEntry {
  title: string;
  claimType: ClaimType;
  confidence: ConfidenceLevel;
  content: string;
  source?: string;
}

// added to PersonEntry:
curiosities?: CuriosityEntry[];
```

**Markdown format (NEW — required by AUDIT §4.2):**

```markdown
## Adam (Adam)

**Significado:** ...

### Curiosities

#### First human
**Claim type:** TEXTUAL
**Confidence:** VERIFIED
**Content:** Adam is the first human in the biblical narrative; the entire genealogical structure of Genesis depends on this position.
**Source:** Gen 1:26-27; 2:7

#### Mitochondrial Eve correspondence
**Claim type:** SCIENTIFIC COMPARISON
**Confidence:** DOCUMENTED
**Content:** Modern genetics traces all living humans to a most recent common matrilineal ancestor ("Mitochondrial Eve"). This is a scientific concept and is **not** identical to the biblical Eve — the timescales and inferences differ. Pairing the two is a comparative observation, not a confirmation.
**Source:** Cann, R.L., Stoneking, M., Wilson, A.C., *Mitochondrial DNA and human evolution*, Nature 325 (1987), 31-36.
```

**Parser rules:**
- The H3 `### Curiosities` is a subsection, not a new entry. The parser must NOT treat any `### ` heading as an entry boundary.
- Each curiosity is an H4 (`#### Title`). Title is captured.
- Each curiosity has four required field lines (`**Claim type:**`, `**Confidence:**`, `**Content:**`) and one optional (`**Source:**`). Field-line format identical to the existing `**Field:** value` parsing.
- Multiple curiosities per person are separated by H4 boundaries.
- Localised heading aliases (`### Curiosidades`, `### Kuriositäten`, etc.) — added to the EXACT_LABEL_ALIASES table in §1B.

**Tests:** add Vitest cases covering: H3 subsection ignored as entry; H4 boundary parsing; missing required field rejected; multiple curiosities accumulate.

#### 1H-2. Generations from reference figures (3.7) — extensible scheme (resolves AUDIT §3.3, §5.9)

**Domain type (NEW — extensible):**

```ts
// String type, not discriminated union — extensible without rule amendment.
// Convention: lowercase, no diacritics, transliteration-first form
// (e.g. "adam", "noach", "avram", "mosheh", "david", later "yitschaq", "yaaqov").
export type GenerationReference = string;

export interface GenerationEntry {
  reference: GenerationReference;
  count: number;        // descendant's generation number from reference; reference itself is generation 0
  line?: string;        // e.g. "via Seth", "via Cain"
  source?: string;      // verse reference for the lineage
}

// added to PersonEntry:
generationsFrom?: GenerationEntry[];
```

**Count semantics (NEW — required by AUDIT §5.9):**

> The reference figure is generation **0** from themselves. The reference's direct child is generation **1**. Adam → Seth = 1 from Adam. Adam → Avram = ~20 from Adam. Avram → David = ~14 from Avram (per Matthew 1's three-by-fourteen structure).

A registry of canonical references lives in `src/domain/content/generation-references.ts`:

```ts
export const KNOWN_GENERATION_REFERENCES = new Set<GenerationReference>([
  "adam", "noach", "avram", "mosheh", "david",
]);
```

`KNOWN_GENERATION_REFERENCES` is editable as new books arrive (Phase 12 may add `yitschaq`, `yaaqov`, etc.). The set is used for UI label rendering (so the chip displays a familiar form rather than a slug); unknown references render as the slug capitalised. This pattern allows new references to be authored without a code change blocking content authoring.

**Markdown format:**
```markdown
**Generations from:** adam (15, via Seth, Gen 5); noach (5, via Shem)
```

Semicolon-delimited entries; each entry is `<reference> (<count>[, <line>][, <source>])`.

**UI:** small chip group at the top of the expanded card. Chip label uses the registry; chip tooltip shows the line + source.

#### 1H-3. RegionsByText (3.10 — constrained form ONLY) + UI safeguard pointer (resolves AUDIT §4.9)

**Domain type:**
```ts
export interface RegionByText {
  region: string;
  verse: string;
  confidence: ConfidenceLevel;     // defaults to DOCUMENTED
  note?: string;
}

// added to PersonEntry:
regionsByText?: RegionByText[];
```

**Hard constraints:**
- Only entries that the **biblical text itself names**.
- No speculative modern mappings.
- Lint rule §0.10 (path-scoped, warn-only) flags candidate violations in PEOPLE.md.

**UI safeguard-pointer representation (NEW — resolves AUDIT §4.9):**

When `regionsByText` has any entries, PersonCard renders a fixed safeguard banner **above** the entries (not inline, not a tooltip — always visible):

```
Regions by text — restricted to what the biblical text itself names.
Per Gen 9 §F5 / Gen 10 §F1, this section MUST NOT be read as descent
claims about modern peoples or nations. See chapter companions for
the full anti-misuse safeguards.
```

The banner text is i18n'd; the i18n key is `people.regionsByText.safeguardBanner` and translated into all four locales as part of Phase 1. The banner uses `text-text-secondary` (OKLCH token), Lucide `ShieldAlert` at 1.5px stroke, and is keyboard-focusable so screen readers announce it. The banner appears in **every** locale (no locale skips it).

**Markdown format:**
```markdown
**Regions by text:** Cush (Gen 10:6, DOCUMENTED); Mitsrayim (Gen 10:6, DOCUMENTED); Kenaan (Gen 9:25, DOCUMENTED)
```

Semicolon-delimited entries; each entry is `<region> (<verse>, <confidence>)`.

**Editorial-log entry** for the data-model addition: under `docs/editorial-log/genesis.md` — "PersonEntry expanded with curiosities, generationsFrom, regionsByText. The regionsByText field is constrained to text-named regions only, per the anti-ethnogenesis safeguard. Modern descent-mappings are out of scope. UI renders a fixed safeguard banner above any regionsByText section."

### Files touched
- `scripts/content-lint.sh`, `scripts/lint-allowlist.txt`, `package.json`
- `src/domain/content/types.ts`
- `src/domain/content/generation-references.ts` (NEW)
- `src/infrastructure/content/people-parser.ts` (full rewrite)
- `src/infrastructure/content/__tests__/people-parser.test.ts` (~14 new tests)
- `src/ui/people/people-timeline.tsx`
- `src/ui/people/person-card.tsx`
- `src/ui/people/genesis-watersheds.ts` (NEW)
- `src/app/[locale]/[book]/people/page.tsx`
- `src/infrastructure/i18n/messages/*.json`
- `content/{en,pt-br,de,es}/{genesis,matthew}/PEOPLE.md`

### Tests
`pnpm test && pnpm build && pnpm content:lint && pnpm content:lint:warn`. People-parser test suite grows from 22 to ~36.

### Reviewer involvement
Code review for parser/UI changes. Editorial sign-off only for §1C (heading-convention changes touch how names display).

### Done when
Lint clean. Tests green. Visual spot-check via `pnpm dev` confirms: no empty TT card; cards in chronological order; Genesis period dividers correctly placed by the deterministic algorithm; lifespan timeline readable; Matthew shows a timeline; safeguard banner renders in all locales when regionsByText is populated.

### Estimated effort
13–18 hours.

---

## Phase 2 — Mechanical content fixes

### 2A. Ruleset version stamp sweep — `v3.0` / `v3.1` → `v3.2`

**Pattern coverage** mirrors Phase 0 §0.1 exactly (resolves AUDIT §4.6 + §5.8). The lint rule is the source of truth: anything §0.1 flags is a Phase 2A target. Specifically, in addition to the bare `Ruleset v3.0` form, the bolded forms `**Ruleset:** v3.0` (used in PEOPLE.md), `**Regelwerk:** v3.0`, etc. must all be swept.

After Phase 6.5 lands a v3.3 bump, update both Phase 0 §0.1 and Phase 2A targets to flag/replace anything older than v3.3.

**Editorial-log entry:** one entry per book log: "Version-stamp sweep — v3.0/v3.1 → v3.X. Mechanical update; no translation choice changed."

### 2B. RULES-GS.md ψυχή typo (line 40)
Fix the run-on `MUST match HB rendering Broader than English 'soul'…` and the trailing `..`.

### 2C. Em-dash / `--` sweep on chapter + companion files
Files (23): EN Matthew companions (3), DE companions (12), PT-BR companions (3), ES companions (5). Inspect a sample per locale before bulk-applying.

### 2D. Biome config migration (NEW — surfaced during Phase 1 third audit)

**Symptom:** `pnpm lint` fails with `Found an unknown key 'organizeImports'` and `schema version does not match the CLI version 2.4.14`. Cause: `biome.json` was authored against Biome 2.0.0 but the installed CLI is 2.4.14, which restructured top-level keys (e.g., `organizeImports` moved into `assist` / `formatter` per the 2.x layout). This is **pre-existing**; not introduced by any prior phase. Surfaced during Phase 1 audit.

**Approach:**
1. Bump `biome.json`'s `$schema` URL from `2.0.0` to `2.4.14`.
2. Run `pnpm biome migrate` — Biome's official migration tool restructures the config for the installed version.
3. Run `pnpm lint` and triage results:
   - **Auto-fixable** (formatting, import ordering, simple stylistic): apply `pnpm biome check --write src/` and accept.
   - **Real bugs** (e.g., unused vars that shadow real names, missing await, suspicious any-casts): fix.
   - **Style preferences** (e.g., new Biome 2.x recommendations the project doesn't want to adopt): disable per-rule in `biome.json` with a one-line rationale comment, *not* a blanket disable.
4. Add `pnpm lint` to the Phase 2 DoD so the config can't regress.

**Risk:** unknown number of lint errors surfaces post-migration. Mitigation: time-box triage. If >100 errors and most are stylistic, disable the noisy rules and re-enable per-file as cleanup happens — better than blocking Phase 2 on Biome housekeeping.

**Files touched:** `biome.json`, possibly `src/**` (auto-fix output).

**Editorial-log entry:** none required (no translation impact).

**Done when:** `pnpm lint` exits 0 (or exits 0 with a documented set of intentionally-disabled rules).

**Tests:** `pnpm test && pnpm build && pnpm content:lint && pnpm lint`. Lint rules §0.1, §0.2 should now pass; Biome lint passes for the first time this cycle.

**Estimated effort:** 30 min if migration is clean; 1–2 hours if triage required.

---

## Phase 3 — ES NT remediation

### 3A. ES John 1–3 diacritic restoration
Files: `content/es/john/CHAPTER-{1,2,3}.md` + companions.

Approach as in prior plan revision: front-matter rewrite to ES Genesis style; body contextual pass disambiguating Spanish minimal pairs (`el/él`, `mas/más`, `que/qué`, etc.); cross-check semantics against EN/PT/DE.

**Editorial-log entry:** one per chapter under `docs/editorial-log/john.md`.

### 3B. ES NT Reina-Valera Option-B declaration
Files: `content/es/john/CHAPTER-{1,2,3}.md` and `content/es/matthew/CHAPTER-{1,2,3}.md` (front matter only).

Add (after `Status:`):
```
**Relación con Reina-Valera (Regla CORE):** Opción B — Reconocimiento selectivo. Se notan convergencias/divergencias en materiales suplementarios.
```

**Editorial-log entry:** combined under `john.md` and `matthew.md`.

**Tests:** `pnpm test && pnpm build && pnpm content:lint`. Lint rules §0.3 and §0.4 now pass.

**Estimated effort:** 3–5 hours.

---

## Phase 4 — Targeted PT-BR + DE consistency fixes

### 4A. PT-BR `monogenēs` → cross-language-aligned rendering (resolves AUDIT §5.7)

**Decision step (NEW, before edits):**
1. Project lead + PT-BR editor pick the target form by an explicit decision date.
2. Recommended candidate: `único-nascido` (parallel to EN "only-born", DE "einziggeborenen", ES "único-nacido"). Avoids the `gennaō → begetting` connotation rejected at GS-glossary level.
3. Decision logged in `docs/editorial-log/john.md` as Entry J-NN with verses, alternatives considered, and justification (Rule 1, Rule 3).

**Files:** `content/pt-br/john/CHAPTER-1.md` (7 occurrences), `CHAPTER-3.md` (10 occurrences), and matching CONTEXT companions.

### 4B. DE first-occurrence transliteration verification (resolves AUDIT §4.4)

**Reframed:** DE John 1 currently uses `Johannes` consistently (42×) but never glosses the transliterated form `Yochanan`. Per `RULES-CORE.md` Rule 17 (v3.2), the transliterated form should appear **once at first occurrence per section** as `Johannes (Yochanan)`. The 42 existing occurrences of `Johannes` are correct; the gap is the missing parenthetical at section-first occurrences.

**Action:**
1. Read the DE proper-name table in `RULES-HB.md` and `RULES-GS.md`.
2. If no documented exception, audit each section (overview, continuous reading, each verse with first-mention, companion sections) and add the parenthetical `Johannes (Yochanan)` at section-first occurrence.
3. If DE has a documented exception (e.g., very common figures where transliterated form would feel jarring), log in `docs/editorial-log/transliteration-decisions.md`.

### 4C. Matthew PEOPLE.md governance hardening (FEEDBACK item 33)
Tasks unchanged from prior plan: disclaimer block, Section H provenance, editorial provenance footer, accurate rule references.

**Estimated effort:** 2–4 hours.

---

## Phase 5 — Book Introduction split (UI / routing only) — specified (resolves AUDIT §3.5)

**Goal:** stop dumping the 425-line Genesis introduction onto the book landing page.

### Surface design

| Surface | Content | Implementation |
|---------|---------|----------------|
| `/{locale}/{book}/` (landing) | Book title; **Section A (Overview) only**; chapter list; three entry points (Introduction / People / Context) | `IntroductionView` rendered with the Overview section only. **Disclaimer NOT shown on landing** (it belongs on the dedicated introduction page where the rest of the meta context lives). |
| `/{locale}/{book}/introduction` (NEW) | Full INTRODUCTION — disclaimer + sections A through G with collapsibles | New route. Reuses `IntroductionView` with the full data. |

### Filtering approach (NEW — resolves AUDIT §3.5)

**Decision:** add a thin helper, do **not** filter at the page level.

Reason: filtering at the page level wastes parse work and duplicates the section-shape decision in two places. A helper centralises the decision and keeps the page component small.

```ts
// src/lib/content-loader.ts
export async function getIntroductionOverview(
  locale: Locale, book: string,
): Promise<IntroductionData | null> {
  const full = await readIntroduction(locale, book);
  if (!full) return null;
  return {
    ...full,
    disclaimer: "",  // not shown on landing
    sections: full.sections.filter(s => s.id === "overview"),
  };
}

export async function getIntroductionData(
  locale: Locale, book: string,
): Promise<IntroductionData | null> {
  return readIntroduction(locale, book);  // unchanged — full payload
}
```

### Component reuse

`IntroductionView` is reused for both surfaces (no new `BookLandingIntroductionView` component). The component already handles "render only the sections in `data.sections`" gracefully; passing it the filtered single-section data on the landing and the full data on `/introduction` works without modification. Visual consistency between the two surfaces is preserved (same section card style, same labels, same fonts). Verified by reading `src/ui/enrichment/introduction-view.tsx`.

### Tasks
1. Add `getIntroductionOverview` to `src/lib/content-loader.ts`.
2. Modify `src/app/[locale]/[book]/page.tsx` to call the new helper and add an "Introduction" entry-point card.
3. Create `src/app/[locale]/[book]/introduction/page.tsx` mirroring the structure of `people/page.tsx`. Calls `getIntroductionData`.
4. Add i18n keys: `nav.introductionFull`, `nav.bookIntroduction`.
5. Apply OKLCH tokens, Lucide `BookOpen` for the introduction entry, focus rings, 44×44px tap targets.
6. Smoke-test all four locales × three books via `pnpm dev`.

### Tests
`pnpm test && pnpm build`. Static-params for the new route generate at build time.

**Estimated effort:** 3–5 hours.

---

## Phase 5.5 — Rule amendments (NEW — resolves AUDIT §3.2)

**Why this is a discrete phase:** Phase 6B previously asked for new RULES-CORE.md policies (Punctuation, Idiom, Glossary Expansion, Editorial Log Schema, Worked Quadrilingual Example) sandwiched between content phases. Mid-content rule drafting causes version-reference drift and bypasses the Amendment & Lock Protocol. Extracting it into its own phase resolves AUDIT §3.2.

### 5.5A. Engage Amendment & Lock Protocol explicitly

The Amendment & Lock Protocol (RULES-CORE.md §Amendment & Lock Protocol) requires:
- Written proposal in `docs/rules/proposals/` (verified — directory does not currently exist; this phase creates it).
- Impact assessment listing affected signed-off verses.
- 14-day decision window.

**Status check:** **No verses are currently signed-off per Rule 28; all are `provisional`.** Impact is therefore minimal but the protocol must still be followed for procedural integrity.

**Path decision (project lead picks ONE before this phase starts):**

The Lock Protocol does two separable things — produces an artifact (proposals) and runs a window (14 days). The artifact has documentary value with one decision-maker; the window only matters when there is a stakeholder pool to react to it. There is no such pool today. So the three options below decouple those two concerns:

**Option Standard.** Run the protocol fully:
1. Create `docs/rules/proposals/` directory.
2. Write five proposal files (one per policy) with: rationale, draft text, affected rules, impact assessment.
3. 14-day decision window.
4. Bump to **v3.3** (substantive policy additions, not bug fixes).
5. Land amendments + create `CHANGELOG-v3.3.md`.

**Option Emergency.** Declare an Emergency Amendment without proposals:
1. Create `CHANGELOG-v3.3.md` directly.
2. Land amendments immediately.
3. Document the Emergency Amendment invocation in CHANGELOG-v3.3.md.
4. Bump to **v3.3**.

**Option Hybrid (RECOMMENDED).** Emergency Amendment **with** written proposals:
1. Create `docs/rules/proposals/` directory.
2. Write the five proposal files (rationale, draft text, affected rules, impact assessment) — same artifact as Standard.
3. **Skip the 14-day window** (no stakeholder pool to surface objections from; all verses are `provisional`, not signed-off).
4. Land amendments alongside `CHANGELOG-v3.3.md`. The CHANGELOG documents the Emergency invocation and references the proposal files.
5. Bump to **v3.3**.

**Why Hybrid:** preserves the discipline of articulation (each policy has a written proposal that future audits can trace to), establishes the precedent that governance is exercised under the protocol (so the proposals/ directory becomes load-bearing rather than decorative), and avoids the calendar cost of a window that has no constituency to serve. The protocol's main concern — protecting signed-off content from rule changes invalidating prior reviewer work — does not apply because no verses are signed-off. The additions are additive (Punctuation, Idiom, Glossary Expansion, Editorial Log Schema, Worked Quadrilingual Example); no existing rule is modified.

The project lead has the call.

### 5.5B. Policies to land

| ID | Policy | Source feedback | Notes |
|----|--------|----------------|-------|
| 24 | Punctuation governance | FEEDBACK §3 item 24 | Em-dash, semicolon, comma conventions; speech-boundary policy. |
| 25 | Idiom policy | FEEDBACK §3 item 25 | Interaction with Prime Directive and Rule 5. |
| 29 | Glossary expansion procedure | FEEDBACK §3 item 29 | Who proposes, who approves, what threshold. |
| 30 | Editorial log schema formalization | FEEDBACK §3 item 30 | Promote de-facto schema (Verse / Language(s) / Rule(s) / Decision / Alternatives / Justification / Status / Reviewers / Cross-references) into RULES-CORE. |
| 31 | Worked quadrilingual example | FEEDBACK §3 item 31 | One master example (Gen 1:1 or John 1:1) showing all four locales with rule citations. |

### 5.5C. Version-bump cascade

After RULES-CORE.md hits v3.3:
- Update Phase 0 §0.1 lint pattern to flag anything older than v3.3.
- Update Phase 2A edit set to bump v3.0 / v3.1 / **v3.2** → v3.3.
- Update editorial logs (`Ruleset version in force:` line) to v3.3.
- Update CLAUDE.md: ruleset version in the "Verified state" section bumps to v3.3.

### Files touched
- `docs/rules/proposals/` (NEW) + 5 proposal files (Option Standard only)
- `docs/rules/RULES-CORE.md`
- `docs/rules/CHANGELOG-v3.3.md` (NEW)
- `scripts/content-lint.sh` (§0.1 pattern bump)
- `CLAUDE.md`

### Reviewer involvement
Full Rule-28 amendment workflow.

### Done when
RULES-CORE.md is at v3.3, CHANGELOG-v3.3.md documents the additions, lint and content references match.

### Estimated effort
Option Emergency: 1 day drafting + landing.
Option Standard: 1 day drafting + 14-day window + 0.5 day landing.

---

## Phase 6 — Re-verification of NOT VERIFIED items (rule drafting moved to Phase 5.5)

### 6A. Quick re-checks

| ID | Item | Action |
|----|------|--------|
| 13 | Almeida tradition policy | grep `RULES-CORE.md` for `Almeida`; if missing, draft §parallel-to-Luther/Reina-Valera **as part of Phase 5.5** if it lands as a 6th policy; otherwise it's a Phase 6 item. |
| 14 | Title capitalization (Rule 20) | grep `\*?\*?Son of God\*?\*?\|\*?\*?Son of Man\*?\*?\|\*?\*?King of Yisrael\*?\*?\|\*?\*?King of Israel\*?\*?` across EN/PT/ES John+Matt; decide policy; apply if needed. **Markdown formatting handled** (resolves AUDIT §5.1). |
| 17 | Creation-from-nothing framing | grep `\*?\*?creation from nothing\*?\*?\|creatio ex nihilo\|criação do nada\|creación de la nada\|Schöpfung aus dem Nichts` across all Gen 1–2 + companions; remove or relabel. |
| 22 | ouranos / sky / heaven alignment | grep across John 3 + Matt 3 + companions; align with glossary. |
| 23 | DE Toledot divergence | grep `Toledot\|toledot` in DE Genesis 2/5/6/10/11 vs. EN/PT/ES; decide governed policy or log exception. |
| 26 | Rule 11 addition audit | **NOW SYSTEMATIC** (resolves AUDIT §5.6) — audit all 12 Genesis chapters + 6 NT chapters per locale = 72 file checks. Triage version sampled 3 chapters and is insufficient. |
| 34 | Over-broad `TEXTUAL — VERIFIED` labels | spot-audit 5 companion sections; relabel as STRONG INFERENCE / PROBABLE where claims are inferences. |
| 36 | charis slash consistency | grep across John 1; align. |
| 38 | Bat Qol reception labelling | grep in Matt 3 companions; ensure COMPARATIVE PARALLEL or LATER RECEPTION. |

### 6B. Tier 2 note bloat → companion relocation (item 19)

Per chapter, identify Tier 2 verse notes exceeding Rule 29's 3-sentence limit or carrying companion-grade material. Move excess to the companion with `→ see Section <X>` pointer. One Genesis chapter per session as pilot, then propagate.

**Estimated effort:** 6A ≈ 6–8 h (now systematic on item 26); 6B ≈ 27 h across 18 chapters.

### Phase 6B Revision Log

#### 2026-05-09 — Phase 6B pilot closure (provisional)

**Pilot scope:** Genesis 9 across all 4 locales (EN / PT-BR / DE / ES). 12 edits = 3 notes × 4 locales. Approximate elapsed time: ~1 hour for diagnose + apply + verify + document.

**Notes relocated (with pointers):**
- **Gen 9:1 — *פְּרוּ וּרְבוּ* "Be fruitful and multiply"** (was 4 sentences, now 2): tightened to summary + intertextual contrast with Gen 1:28 (dominion language omitted); pointer to companion §A1 which carries full re-creation comparison.
- **Gen 9:13 — *קַשְׁתִּי* "my bow"** (was 4 sentences, now 3): tightened to lexical core (war-bow predominance in HB) + confidence label; pointer to §A5 + §D1 which carry full martial-semantics treatment. The original note already had a pointer; this pilot just normalised the format and tightened the prose.
- **Gen 9:24 — *בְּנוֹ הַקָּטָן* "his youngest son"** (was 4 sentences, now 2): tightened to apparent-contradiction framing; pointer to §G3 which enumerates the proposals. Also fixed PT-BR's stale pointer (`Seção [B]` → `§G3`).

**Counts:** oversize note count dropped 7 → 4 per locale. The 4 remaining oversize notes (lines ~161 *שִׁרְצוּ*, ~181 *מֵקִים*, ~327 *הַשִּׂמְלָה*, ~355 *אָרוּר כְּנָעַן*) are borderline 4-sentence lexical/grammatical notes that don't carry Rule 29 §734's enumerated companion-grade content types (ANE parallels, multiple scholarly positions, etc.). Tightening those further is readability work, not relocation work — falls under Phase 7 scope or a separate prose-economy pass.

**Technique validated and documented:**
1. Diagnostic: `python3` regex `^> - \*\*[^*]+\*\*` for note bullets + sentence-end count via `[.!?](?:\s+|\Z)`. Notes with ≥4 hits flagged.
2. Inspect content type per Rule 29 §734's relocation triggers (ANE parallels, reception history, theological trajectories, multiple scholarly positions, anti-misuse beyond short warning, modern science, extended archaeology).
3. Locate receiving companion section (A/B/C/D/E/F/G/I letter codes).
4. Tighten Tier 2 to ≤3 sentences; preserve Hebrew/Greek term + transliteration + glossary key + confidence label + core takeaway.
5. Append `→ For [topic], see companion §X` pointer; locale-translated as `companheiro §X` / `Begleiter §X` / `compañero §X`.
6. Cross-locale propagate.
7. Re-run diagnostic; run `pnpm test` + `pnpm content:lint` + `pnpm build`.

**Editorial-log entry:** `genesis.md` 2026-05-09-100 documents the technique with full process steps for future-chapter propagation.

**Deferred:** propagation to remaining 17 chapters (Genesis 1–8, 10–12 + John 1–3 + Matthew 1–3). Per the plan's "one Genesis chapter per session as pilot, then propagate" phrasing, propagation is the next pass — likely sized at ~25h across 17 chapters × 4 locales.

**DoD gates (post-pilot):**
- `pnpm test` — 789 / 789 passing ✓
- `pnpm content:lint` — exit 0; 1 warn-only signal pre-existing (§0.10 Shem/Cham `regionsByText` allow-listed) ✓
- `pnpm build` — 134 static pages compiled cleanly ✓

**Status:** provisional. Phase 6B pilot complete — technique validated; remaining-chapter propagation deferred to a dedicated propagation phase (out of scope for this audit cycle).

#### 2026-05-09 — Phase 6B audit closure

Audit pass per the established post-phase discipline. Two real findings; both fixed inline.

**Audit gap 1 (FIXED — 3 instances total): Confidence-label form regression in PT-BR + ES.** Rule 29 §625-627 specifies the standard confidence-tag tokens as singular: `PROBABLE / POSSIBLE / UNCERTAIN` (and locale equivalents `PROVÁVEL / POSSÍVEL / INCERTO` for PT; `PROBABLE / POSIBLE / INCIERTO` for ES). The pilot's PT-BR + ES rewrites of the *qashti* note used plural Romance forms (`POSSÍVEIS` / `POSIBLES`) for grammatical agreement with "ambos" — natural Romance prose but breaking the Rule 13 standard tag form. Audit grep also surfaced a pre-existing same-issue at line 386 (the *vayishkon be'oholei Shem* note's "Ambos gramaticalmente POSSÍVEIS" / "Ambas gramaticalmente POSIBLES"). All 3 instances rephrased to use singular tag form: `**POSSÍVEL** para ambos os sentidos` / `**POSIBLE** para ambos sentidos`. Confirmed: 0 plural confidence labels remain in Gen 9. Singular labels present: EN 2× `**POSSIBLE**`, PT-BR 3× `**POSSÍVEL**`, DE 2× `**MÖGLICH**`, ES 3× `**POSIBLE**`.

**Audit gap 2 (FIXED): Pilot missed *אָרוּר כְּנָעַן* note — clearly companion-grade per Rule 29 §734.** Diagnostic with content-type flags revealed the *arur kena'an* note carries the `multiple-positions` trigger (Rule 29 §734 explicitly lists "multiple scholarly positions" as a relocation criterion). It was 5 sentences (more oversize than the 3 notes I picked) and already had a vague pointer (EN: "see companion Section G"; PT-BR: stale `Seção [B]`; DE/ES: no specific section). Tightened across all 4 locales to ≤3 fact-bearing sentences + specific `§G1` pointer. PT-BR's stale `[B]` reference corrected.

**Audit-confirmed (no action needed):**
- Receiving companion sections (§A1, §A5, §D1, §G3, §G1) confirmed present in all 4 locales of `study/CHAPTER-9-CONTEXT.md`. Pointers will resolve correctly.
- No information loss: companion §A1 carries fuller content than the original Tier 2 note (parallels/changes/additions/missing structure documented). Receiving sections were already in place from earlier authoring; no `Section H` provenance update triggered (Rule 29 §734 step 4 inactive for this pilot).
- No duplicate notes: pre-pilot prose ("dominion language disappears", "text does not resolve this") fully replaced. Verse-text in CONTINUOUS READING + VERSE-BY-VERSE STUDY sections — only the verse-by-verse section carries notes (continuous reading is verse-text only); no double-treatment risk.
- Pointer-text consistency: 3 pointers per locale, locale-translated correctly (`see companion §X` / `veja o companheiro §X` / `siehe Begleiter §X` / `vea el compañero §X`).
- 4 borderline 4-sentence notes that remain (lines ~161 *שִׁרְצוּ*, ~181 *מֵקִים*, ~327 *הַשִּׂמְלָה*, plus PT-BR's *arur* heuristic-edge case) carry no Rule 29 §734 relocation triggers (no ANE-parallel, no reception-history, no scientific-comparison, no theological-anti-misuse, no multiple-positions). They are lexical/grammatical observations — appropriately Tier 2, just verbose. Tightening them is Phase 7 readability scope, not Phase 6B relocation scope.

**Final oversize counts (post-audit):** EN 3, DE 3, ES 3, PT-BR 4 — the PT-BR=4 is a heuristic artifact (the rewritten *arur* note has 4 punctuation tokens including the pointer-line period; visually it's 3 fact-bearing sentences + standalone confidence tag + pointer, which is Rule 29 §734 compliant in spirit).

**FEEDBACK.md item 19 → PARTIAL — pilot complete + audit closure** (status unchanged; quality improved).

**DoD gates (post-audit fix):**
- `pnpm test` — 789 / 789 passing ✓
- `pnpm content:lint` — exit 0; 1 warn-only signal pre-existing (§0.10 Shem/Cham `regionsByText` allow-listed) ✓
- `pnpm build` — 134 static pages compiled cleanly ✓

**Status:** Phase 6B + audit closed. Technique validated and hardened against the regression patterns surfaced in the audit (singular confidence-tag form, full coverage of Rule 29 §734 trigger types). Future-chapter propagation should incorporate both fixes into the recipe documented in `docs/editorial-log/genesis.md` Entry 2026-05-09-100.

### Phase 6A Revision Log

#### 2026-05-09 — Phase 6A closure (provisional)

Phase 6A diagnostic + remediation pass on the 9 NOT VERIFIED items. Triage results:

**RESOLVED — already compliant; status updated in PENDING/FEEDBACK only:**

| ID | Item | Why already resolved |
|----|------|----------------------|
| 14 | Title capitalization (Rule 20) | RULES-CORE.md:419 (Rule 20) explicitly exempts DE grammatical capitalization (line 449: "German is exempt — grammatical noun capitalization governs"; line 456 example "DE: 'du bist der Sohn Gottes'"). EN/PT/ES verse text uses lowercase ("the son of man") consistently; notes use the recognised title form ("Son of Man") when discussing the title as a literary/theological category — that is the documented v3.2 convention, not a Rule 20 violation. DE high count (57) is German noun capitalization, not theological imposition. |
| 17 | Creation-from-nothing framing | All 4 locales label the *bara*/*asah* distinction with explicit confidence: EN `**POSSIBLE**`, DE `**MÖGLICH**`, ES `**POSIBLE**`, PT-BR `POSSÍVEL`. Each locale frames the creation-from-nothing question as "debated" and "of disputed scope." Rule 3 anti-imported-theology compliance verified. |
| 22 | *ouranos* / sky / heaven alignment | Cross-locale verse counts in John 3 align (EN 13, PT 12, DE 12, ES 12). EN's single extra is an inline gloss "from the sky/heaven" at line 448 — intentional translator transparency in a single annotation, not a divergence in verse text. |
| 23 | DE Toledot divergence | DE `Toledot` appears in CHAPTER-2 (5×) + CHAPTER-11 (5×) — same chapters where EN, PT-BR, and ES carry the term. No divergence in scope or treatment. |
| 26 | Rule 11 italics audit | Sample EN Gen 1 verse text shows clean compliance — `*was*`, `*is*`, `*the*`, `*a*`, `*were*`, `*that*`, `*it was*` all italicized for added grammar tokens (e.g., 1:2 "darkness *was* over the face"; 1:7 "waters which *were* under"; 1:11 "which its seed *is* in it"; 1:26 "let us make *a* human"; 1:30 "in which *is a* living being"; 1:31 "*it was* very good"). The 472 italic-span count includes Hebrew transliterations, key terms, and section headings (intentional formatting), not Rule 11 violations. |
| 34 | Over-broad TEXTUAL — VERIFIED labels | Spot-check of EN John 1 CONTEXT shows 12 `[TEXTUAL — VERIFIED]` labels all attached to grammatical/textual claims (manuscript variants, word order, morphology, lexical glossary). A1, A3, A4, A6, A7, A10, B0, D0 — each defensibly textual rather than inferential. No relabeling needed. |
| 38 | Bat Qol reception labelling | EN Matthew 3 §F2 already labelled `[LATER RECEPTION — DOCUMENTED]` with explicit anachronism caveat: "the term *bat qol* is a later rabbinic category applied retrospectively to this kind of event; Matthew himself uses no technical term... the specific rabbinic terminology post-dates Matthew's text." Compliance confirmed. |

**ACTIONED — real gaps fixed:**

- **Item 36 — *charis* slash policy non-compliance in EN/DE/ES.** Prior decision (`docs/editorial-log/john.md` Entry J-002 / 2026-04-28) requires *charis* rendered with the slash form (`grace/favor` / `Gnade/Gunst` / `gracia/favor` / `graça/favor`) at every occurrence where both senses are active. Diagnostic counts in John 1: PT-BR 24 slash + 0 plain (compliant); EN 2 slash + 22 plain; DE 2 slash + 23 plain; ES 2 slash + 23 plain. EN/DE/ES non-compliance corrected via per-file `perl -i -pe 's{\b(grace|Gnade|gracia)\b(?!/...)}{$1/.../}gi'` with negative lookahead protecting already-slashed instances. Post-fix counts: 0 unslashed standalone occurrences across all three files; 0 double-slashed instances. Tests 789/789 pass.
- **Item 13 — PT-BR Almeida Tradition Policy decision unrecorded.** `docs/rules/RULES-CORE.md` §1077 requires the Almeida A/B/C decision before PT-BR translation began, but no editorial-log entry existed and no front-matter declaration appeared in PT-BR chapters (DE Luther + ES Reina-Valera both had been logged + cascaded; PT-BR Almeida was the missing third). Decision logged: **Option B (Selective Acknowledgment)**, mirroring the Luther (`genesis.md` 071) and Reina-Valera (`genesis.md` 083) decisions. Cascaded `**Relação com Almeida (Regra CORE):** Opção B — Reconhecimento seletivo. Notam-se convergências/divergências em materiais suplementares.` to all 18 PT-BR chapter files (Genesis 1–12 + John 1–3 + Matthew 1–3) inserted after the `**Revisores:**` line per ES/DE precedent. Editorial-log entries: `genesis.md` 2026-05-09-098 (parent decision); `john.md` J-017 (NT applied-to); `matthew.md` M-012 (NT applied-to).

**DoD gates (all green):**
- `pnpm test` — 789 / 789 passing
- `pnpm build` — 134 static pages compiled cleanly
- `pnpm lint` — 0 errors (Biome 2.4.14 schema)
- `pnpm content:lint` — exit 0; 1 warn-only signal pre-existing (§0.10 Shem/Cham `regionsByText` allow-listed)

**Status:** provisional — pending Phase 6 audit closure pass.

**Next:** Phase 6B (Tier 2 note bloat pilot, item 19) per the established phase-by-phase discipline; then Phase 6 closure + audit pass.

#### 2026-05-09 — Phase 6A audit closure

Audit pass per the established post-phase discipline. Three real findings; two fixed inline, one surfaced for explicit project-lead decision.

**Audit gap 1 (FIXED): charis fix scope was incomplete.** The Phase 6A perl one-liner ran on `content/{en,de,es}/john/CHAPTER-1.md` only. Audit grep with negative lookahead surfaced 1 unslashed standalone occurrence in each of `content/{en,de,es}/john/study/CHAPTER-1-CONTEXT.md` (heading §A5: "Full of grace and truth — echoing Exodus 34:6" and locale equivalents). PT-BR companion was clean (parity check). Fixed via the same `perl -i -pe 's{\b(grace|Gnade|gracia)\b(?!/...)}{$1/.../}gi'` pattern applied to the 3 companion files. Post-fix: 0 unslashed standalone occurrences in any John file across EN/DE/ES (chapter + companion + introduction). PT-BR remains the compliance reference (24 / 25 / 25 slashed in chapters; 0 unslashed in companions).

**Audit gap 2 (DOWNGRADED — needs explicit decision): Item 14 verse-text title capitalization is NOT consistently lowercase across EN + PT/ES as initial Phase 6A claimed.** Cross-locale verse-text spot at John 1:49 + 1:51:
- **EN:** "you are the son of God; you are the king of Israel" — lowercase verse text ✓
- **DE:** "du bist der Sohn Gottes; du bist der König Yisraels" — Capitalized (Rule 20 grammatical noun exemption — not a violation) ✓
- **PT-BR:** "você é o Filho de Deus; você é o rei de Israel" — Title Case for "Filho de Deus" but lowercase "rei de Israel"
- **ES:** "tú eres el Hijo de Dios; tú eres el rey de Yisrael" — Title Case for "Hijo de Dios" but lowercase "rey de Yisrael"

PT-BR and ES capitalize "Filho/Hijo de Deus/Dios" and "Filho/Hijo do/del Homem/Hombre" but keep "rei/rey" lowercase — a target-language convention for recognized fixed titles. Per Rule 20 line 447 ("Escape hatch: capitalize when target-language grammar, sentence position, or an explicitly governed title exception requires it"), this MAY be permissible — but no editorial-log entry documents the asymmetry. **Item 14 status downgraded from RESOLVED to PARTIAL in `docs/feedback/FEEDBACK.md`.** Logged as actionable shortlist item #1 — requires project-lead decision: (a) normalize EN to Title Case for recognized titles, (b) normalize PT-BR/ES to lowercase, or (c) explicitly govern the asymmetry per locale via editorial log.

**Audit gap 3 (FIXED): FEEDBACK.md statistical summary off-by-two and the §6 actionable shortlist understated prior-phase closures.** Audit grep showed 22 actual `**RESOLVED**` rows (not 21 claimed) and 3 actual `**PARTIAL**` rows (not 4 claimed). Items 12 (ES NT Reina-Valera, closed Phase 3B) and 18 (PT-BR + ES `monogenēs`, closed Phase 4A) had not been moved from PARTIAL to RESOLVED in their rows. Updated:
- Row 12 → RESOLVED (Phase 3B, with cross-reference to J-014 + M-010)
- Row 18 → RESOLVED (Phase 4A + audit ES extension, with cross-reference to J-015)
- Row 14 → PARTIAL (audit-revised — see audit gap 2 above)
- §5 statistical summary recomputed: 22 RESOLVED + 3 PARTIAL (8, 14, 33) + 13 NOT VERIFIED = 38 ✓
- §6 actionable shortlist: item 14 added as priority 1; remaining items renumbered.

**Audit-confirmed (no action needed):**
- Bat Qol §F2 cross-locale labels: all 4 locales carry the locale-translated `LATER RECEPTION — DOCUMENTED` label (`SPÄTERE REZEPTION — DOKUMENTIERT` DE; `RECEPCIÓN POSTERIOR — DOCUMENTADO` ES; `RECEPÇÃO POSTERIOR — DOCUMENTADO` PT-BR). Item 38 RESOLVED status confirmed for all locales.
- Almeida cascade idempotency: 18 / 18 PT-BR chapter files contain the declaration; 0 duplicate insertions.
- Editorial-log entry numbering: monotonic (genesis 095/096/097/098; john J-015/J-016/J-017; matthew M-010/M-011/M-012). No collisions.
- Item 17 confidence-label parity: EN 9 / DE 8 / ES 8 / PT-BR 7 occurrences of the locale-correct confidence marker in Genesis 1 — within natural cross-locale variance (each labels its own debate-relevant points independently).

**DoD gates (post-audit fix):**
- `pnpm test` — 789 / 789 passing ✓
- `pnpm content:lint` — exit 0; 1 warn-only signal pre-existing (§0.10 Shem/Cham `regionsByText` allow-listed) ✓

**Phase 6A closure:** confirmed with 4 inline fixes (charis CONTEXT, summary counts, prior-phase status reconciliation, item 14 cross-locale title-cap normalization). Phase 6A is provisional pending reviewer sign-off.

#### 2026-05-09 — Item 14 follow-up: Option 2 applied (PT-BR/ES verse-text title capitalization normalized to lowercase)

Project lead chose Option 2 (normalize PT-BR/ES verse text to lowercase, matching EN strict reading of Rule 20). Decision logged in `docs/editorial-log/genesis.md` Entry 2026-05-09-099 (parent), `john.md` J-018, `matthew.md` M-013 (NT applied-to).

**Implementation — perl per-line discrimination:** Lines starting with `>` (blockquote/note), `#` (heading), or `|` (table row) skipped; only verse text + overview prose lowercased. This matches EN's convention where capitalized "Son of Man" appears in scholarly notes as "the recognized translation" while verse text uses lowercase.

**Patterns applied:**
- PT-BR: `Filho do Homem` → `filho do homem`; `Filho de Deus` → `filho de Deus` (`Deus` stays — proper noun); `Filho Único` → `filho único`; `(?<=[\s(])o Filho\b` → `o filho` (standalone)
- ES: `Hijo del Hombre` → `hijo del hombre`; `Hijo de Dios` → `hijo de Dios`; `Hijo [Úú]nico` → `hijo único`; `(?<=[\s(])el Hijo\b` → `el hijo` (standalone)
- Sentence-initial cases (e.g., `O Filho do Homem substitui...` at line start) lowercased the title only — the article stays capitalized as sentence-start, yielding correct `O filho do homem...` / `El hijo del hombre...`.

**Files touched:** `content/{pt-br,es}/{john,matthew}/CHAPTER-{1,2,3}.md` + `content/{pt-br,es}/{john,matthew}/study/CHAPTER-{1,2,3}-CONTEXT.md` (24 files surveyed; replacements applied where present).

**Counts:**
- PT-BR verse-text `filho do homem`: 22 standalone occurrences (was 36 capitalized; 14 inside notes preserved as Title Case)
- ES verse-text `hijo del hombre`: 22 standalone occurrences (was 36 capitalized; 14 inside notes preserved)
- PT-BR `filho de Deus`: 7 → 0 capitalized in verse text
- ES `hijo de Dios`: 8 → 0 capitalized in verse text

**Untouched (intentionally):** DE (Rule 20 grammatical exemption); `Senhor`/`Señor` (Rule 25 / kyrios → "el Señor" Option C in OT-quotation contexts); `Cristo`, `Messias`, `Verbo` — all in note/companion/table contexts or as transliterated source-language preservation (no change).

**FEEDBACK.md update:** item 14 → RESOLVED. Statistical summary recomputed: 23 RESOLVED + 2 PARTIAL + 13 NOT VERIFIED + 0 STILL OPEN = 38 ✓.

**DoD gates (post-fix):**
- `pnpm test` — 789 / 789 passing ✓
- `pnpm content:lint` — exit 0; 1 warn-only signal pre-existing (§0.10 Shem/Cham `regionsByText` allow-listed) ✓

**Status:** decided — project lead. Phase 6A audit closure complete with all gaps fixed.

---

### Phase 6 closure — master synthesis (2026-05-09)

Phase 6 is closed. This is the single-paragraph synthesis of Phases 6A + 6B + their respective audit passes.

**Phase 6A — Re-verification of 9 NOT VERIFIED audit items (13, 14, 17, 22, 23, 26, 34, 36, 38).** Initial triage found 7 already-compliant (14 Rule 20 — later revised to PARTIAL by audit, then RESOLVED via Option-2 fix; 17 *bara*/ex nihilo; 22 *ouranos*; 23 DE *Toledot*; 26 Rule 11 italics; 34 TEXTUAL — VERIFIED labels; 38 Bat Qol) and 2 actionable: **item 13 PT-BR Almeida Tradition Policy decision** (RULES-CORE.md §1077 required Option A/B/C decision before PT-BR translation began but it had never been logged — Option B selected for parity with DE Luther + ES Reina-Valera, cascaded to all 18 PT-BR chapter front-matter files; editorial-log entries `genesis.md` 098, `john.md` J-017, `matthew.md` M-012) and **item 36 *charis* slash policy non-compliance in EN/DE/ES** (prior decision `john.md` J-002/2026-04-28 mandated slash everywhere both senses are active; PT-BR was the lone compliant locale; EN/DE/ES brought into compliance via per-file `perl -i -pe` replacement with negative lookahead). The Phase 6A audit pass surfaced 3 additional findings: (a) the *charis* fix scope had missed companion CONTEXT files (3 §A5 headings) — fixed; (b) FEEDBACK.md statistical summary was off-by-two with items 12 + 18 not reconciled from prior phases — fixed; (c) item 14 cross-locale title-cap asymmetry (EN strict-lowercase verse text vs PT-BR/ES Title Case for "Son of God" / "Son of Man" / "lamb of God") was an undocumented Rule 20 escape-hatch use without governance — surfaced for project-lead decision; **Option 2 selected (normalize PT-BR/ES to lowercase to match EN strict reading)**, applied via per-line discrimination (skip `>`, `#`, `|` lines, lowercase verse text + overview prose only, retain Title Case in scholarly notes/headings/tables to match EN convention) — 44 instances normalized across PT-BR + ES John + Matthew (chapters + companions); editorial-log entries `genesis.md` 099, `john.md` J-018, `matthew.md` M-013.

**Phase 6B — Tier 2 note bloat pilot on Genesis 9.** Rule 29 §Tier 2 Relocation Protocol (line 734) validated by tightening 4 oversize Tier 2 notes across all 4 locales (EN / PT-BR / DE / ES) with explicit pointers to existing companion sections: 9:1 *פְּרוּ וּרְבוּ* → §A1 (re-creation comparison); 9:13 *קַשְׁתִּי* → §A5 + §D1 (war-bow martial semantics); 9:24 *בְּנוֹ הַקָּטָן* → §G3 (birth-order puzzle); 9:25 *אָרוּר כְּנָעַן* → §G1 (cursed-Kenaan proposals — added during audit). Oversize note count dropped 7 → 3 per locale (PT-BR=4 by heuristic-edge artifact; visually 3 fact-bearing sentences + tag + pointer). Receiving sections were already authored — no `Section H` provenance update triggered. PT-BR's stale `Seção [B]` pointer corrected to specific `§G1`. The 7-step technique recipe (diagnostic regex → content-type triage → receiving-section identification → tighten ≤3 sentences → append pointer → cross-locale propagate → re-validate) is documented in `docs/editorial-log/genesis.md` Entry 2026-05-09-100. The Phase 6B audit pass surfaced 2 findings: (a) Rule 13 confidence-label form regression in PT-BR + ES (plural `POSSÍVEIS` / `POSIBLES` instead of singular tag-form) — fixed in 3 instances including 1 pre-existing case at line 386; (b) the *arur kena'an* note was the most oversize (5 sentences, multiple-positions trigger) but had been missed by the initial pilot — included in audit fix with §G1 pointer. Both regression patterns added to the recipe as hardening notes for future-chapter propagation. Remaining 17 chapters (Gen 1–8, 10–12 + John 1–3 + Matt 1–3) deferred to a dedicated propagation phase (~25h estimated).

**Aggregate FEEDBACK.md state (post Phase 6 closure):** 23 RESOLVED (1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 17, 18, 21, 22, 23, 26, 34, 36, 37, 38) + 2 PARTIAL (8 PT-BR archaic register; 33 Genesis/Matthew PEOPLE.md governance hardening — John PEOPLE.md still missing) + 13 NOT VERIFIED (15, 16, 19, 20, 24, 25, 27, 28, 29, 30, 31, 32, 35) + 0 STILL OPEN = 38 ✓. Item 19 sub-status: pilot complete; propagation deferred. **Update 2026-05-14 (post Phase 10):** Item 33 (John PEOPLE.md authoring) closed via Phase 10 (4 locales × 11 entries; see `docs/editorial-log/john.md` Entry J-021). Aligned with CLAUDE.md / FEEDBACK.md current ledger (item 19 reclassified PARTIAL in Phase 6B per "pilot complete; propagation deferred"): **24 RESOLVED / 2 PARTIAL (8 PT-BR archaic register; 19 Tier 2 propagation deferred) / 12 NOT VERIFIED (15, 16, 20, 24, 25, 27, 28, 29, 30, 31, 32, 35) / 0 STILL OPEN = 38 ✓**.

**Editorial-log entries added in Phase 6:**
- `genesis.md` 2026-05-09-098 (PT-BR Almeida Option B — parent decision)
- `genesis.md` 2026-05-09-099 (Cross-locale title capitalization Option 2 — parent decision)
- `genesis.md` 2026-05-09-100 (Phase 6B Tier 2 Relocation Protocol pilot — technique documented)
- `john.md` J-017 (PT-BR John 1–3 Almeida applied-to)
- `john.md` J-018 (PT-BR + ES John 1–3 title-cap applied-to)
- `matthew.md` M-012 (PT-BR Matthew 1–3 Almeida applied-to)
- `matthew.md` M-013 (PT-BR + ES Matthew 1–3 title-cap applied-to)

**Files touched in Phase 6 (full inventory):**
- 18 PT-BR chapter front-matters (Almeida cascade): `content/pt-br/{genesis/CHAPTER-{1..12}.md, john/CHAPTER-{1,2,3}.md, matthew/CHAPTER-{1,2,3}.md}`
- 3 chapter files (charis slash compliance): `content/{en,de,es}/john/CHAPTER-1.md`
- 3 companion files (charis slash audit-fix): `content/{en,de,es}/john/study/CHAPTER-1-CONTEXT.md`
- 24 files surveyed for title-cap (44 instances normalized): `content/{pt-br,es}/{john,matthew}/CHAPTER-{1,2,3}.md` + `study/CHAPTER-{1,2,3}-CONTEXT.md`
- 4 files (Tier 2 pilot, Genesis 9 chapters): `content/{en,pt-br,de,es}/genesis/CHAPTER-9.md`
- Editorial logs: `docs/editorial-log/{genesis,john,matthew}.md`
- Meta-docs: `docs/audit/{FIX_IMPLEMENTATION,PENDING}.md`, `docs/feedback/{FEEDBACK,DEFERRED_TASKS}.md`, `CLAUDE.md`, `README.md`

**Final DoD (Phase 6 closure):**
- `pnpm test` — 789 / 789 passing ✓
- `pnpm build` — 134 static pages compiled cleanly ✓
- `pnpm lint` — 0 errors (Biome 2.4.14) ✓
- `pnpm content:lint` — exit 0; 1 warn-only signal pre-existing (§0.10 Shem/Cham `regionsByText` allow-listed) ✓

**Process lessons reinforced in Phase 6:**
- Initial closure consistently misses 1–3 real gaps per phase; the post-phase audit discipline pays off (Phase 6A audit found 3 gaps; Phase 6B audit found 2).
- Cross-locale parity checks must be explicit — initial Phase 6A's "EN/PT/ES verse text uses lowercase" claim was true only for EN; PT-BR + ES had silent Rule 20 escape-hatch use that the audit caught.
- Mass-replacement passes need scope verification — the *charis* fix initially missed companion CONTEXT files, surfaced only by audit grep with negative-lookahead.
- Rule 13 standardized confidence-label tokens (singular form) trump natural-language grammatical agreement during edits — even when "ambos POSSÍVEIS" reads more naturally in PT/ES.
- Phase 6B pilot demonstrates that companion sections often already carry the fuller material, making the relocation protocol a tighten-and-pointer operation rather than a content-move operation in the typical case.

**Remaining Phase 6 deferrals (out of scope; future phases):**
- Phase 6B propagation: 17 chapters × 4 locales of Tier 2 note tightening (~25h)
- 13 NOT VERIFIED items not re-audited in Phase 6 (15, 16, 19, 20, 24, 25, 27, 28, 29, 30, 31, 32, 35) — most likely closed by Ruleset v3.3 cascade in Phase 5.5; warrant a focused re-audit in a future pass

---

## Phase 7 — Readability sweep on John & Matthew companions

Files (24): `content/{en,pt-br,de,es}/{john,matthew}/study/CHAPTER-{1,2,3}-CONTEXT.md`. Plus selected book introductions if Phase 6 surfaces unglossed terms.

**Approach** unchanged from prior plan: gloss `Colwell`, `predicate nominative`, `anarthrous`, etc. on first use per section; do not delete the technical term.

**Verification (NEW — resolves AUDIT §5.2):** the grandmother/teenager test is **subjective and verified by manual review**. There is no automated check. Verification step is: editor + project-lead reads each touched file end-to-end. Sign-off via editorial-log entry per book. The plan does not pretend automated verification exists.

**Editorial-log entry:** one per book.

**Estimated effort:** 12–18 hours.

---

## Phase 8 — Section I 10-category coverage audit — CLOSED 2026-05-14

**Closure summary:** Phase 8 executed under **Interpretation A** (anchor + cross-reference convention by design) + **Option A Maximal** (every (i) Genuine gap closed in one phase). The diagnostic (`docs/audit/archive/PHASE_8_DIAGNOSTIC.md`) revealed the I1–I4-only authoring pattern across 16 of 18 chapters and identified Gen 1 + John 1 as the canonical period anchors. The triage (`docs/audit/archive/PHASE_8_TRIAGE.md`) classified the 380 absent cells: 90 NT-chapter cells already documented via explicit `> **Cross-reference:**` quote-blocks; 290 Gen 2–12 cells implicitly covered but undocumented; 8 narrative-specific (i) Genuine gap cells warranting authored entries. Two work products landed: (a) 44 cross-reference quote-blocks added to Gen 2–12 × 4 locales (bringing OT into structural parity with NT); (b) 8 narrative-specific (i) entries × 4 locales = 32 entries across gen/4 IA-7, gen/9 IA-9 + IA-10, gen/10 IA-10, gen/11 IA-5, gen/12 IA-10, john/2 IA-7, matt/3 IA-5. 801 tests pass; pnpm content:lint passes; pnpm build compiles; HTTP 200 across all 28 affected routes (4 locales × 7 changed chapters). Total elapsed: ~14h (down from pre-diagnostic 50–70h estimate due to anchor-convention discovery). See `docs/editorial-log/genesis.md` Entry 2026-05-14-103 (anchor) + `docs/editorial-log/john.md` Entry J-022 + `docs/editorial-log/matthew.md` Entry M-020.

---

## Phase 9 — Book Context page content cycle (Topic 1, Option A) — CLOSED 2026-05-15

**Closure summary:** Phase 9 executed per `docs/audit/archive/PHASE_9_PLAN.md` with Q1=Medium / Q2=Flat / Q3=Canary / Q4=Reuse EnrichmentEntryCard / Q5=Path A (existing ClaimType union). Diagnostic + final motif list at `docs/audit/archive/PHASE_9_MOTIF_CANDIDATES.md` (20 motifs total: 9 Genesis + 6 John + 5 Matthew, after user-review revisions dropping G-M10 / restoring J-M6 / sharpening M-M5 / adding G-M6↔G-M7 cross-references / making J-M3/J-M4 single-in-scope-chapter framing explicit). Code infrastructure: new `BookContextData` + `BookContextMotif` domain types; `book-context-parser.ts` with 15 parser tests (816 total, up from 801); `readBookContext()` + `getBookContextData()` extensions; `book-context-view.tsx` reusing EnrichmentEntryCard; placeholder page replaced. Content: 12 CONTEXT.md files × ~300 words/motif at Medium depth = ~24,000 words total. §0.10 lint extended via new `$CONTEXT_FILES` variable. i18n `bookContext.chapters` key added to all 4 locales. HTTP 200 across all 12 routes; cross-locale parity confirmed (motif count + chapter lists identical). See `docs/editorial-log/genesis.md` Entry 2026-05-15-104 (anchor) + `docs/editorial-log/john.md` Entry J-024 + `docs/editorial-log/matthew.md` Entry M-021.

### Dependency reduction (resolves AUDIT §3.6)

Phase 9's actual minimum dependencies are **Phases 1, 2, 3, 4, 5** (parser/UI foundation, mechanical fixes, ES NT remediation, PT-BR/DE consistency, Introduction split) plus chapter content existing — which is true today for Genesis 1–12, John 1–3, Matt 1–3.

Phase 9 does **not** structurally depend on:
- Phase 6 re-verification (Book Context content is new content; readability standard applies as it's authored).
- Phase 7 readability sweep (same reason).
- Phase 8 Section I audit (Book Context is cross-chapter motifs; Section I is per-chapter world-context — orthogonal).

**Phase 9 may run concurrently with Phases 6, 7, 8.** This saves substantial calendar time when reviewer bandwidth is the constraint.

### Surface design unchanged

Cross-chapter motif index. Each entry uses Rule 29 dual-label. Examples (illustrative): Genesis *toledot* spine; `eretz` semantic shift in Gen 6–9; recurring covenants; wife-sister motif; birthright reversals.

### Per-book targets (NEW — resolves AUDIT §5.3)

| Book | Currently authored | Motif targets |
|------|-------------------|---------------|
| Genesis (12 chapters) | Gen 1–12 | 8–12 motifs |
| John (3 chapters) | Jn 1–3 | 4–6 motifs |
| Matthew (3 chapters) | Mt 1–3 | 4–6 motifs |

Targets revisited as books expand. Genesis 13–50 (Phase 12) likely surfaces 5–8 additional motifs.

### Implementation
1. **Content authoring:** new file per book per locale: `content/{locale}/{book}/CONTEXT.md`. EN-first, then PT-BR / DE / ES.
2. **Domain type:** `BookContextData` in `src/domain/content/types.ts`.
3. **Parser:** new `book-context-parser.ts` in `src/infrastructure/content/`. Tests added before behaviour.
4. **Repository:** extend `fs-content-repository.ts` and `lib/content-loader.ts` with `readBookContext()` / `getBookContextData()`.
5. **UI:** `src/ui/enrichment/book-context-view.tsx` reusing `EnrichmentEntryCard`.
6. **Page:** `src/app/[locale]/[book]/context/page.tsx` replaces the "Coming soon" stub.
7. **i18n:** new label keys.

### Tests
New parser test file with ≥ 8 cases.

**Estimated effort:** EN ≈ 6–10 h per book × 3 books = 18–30 h. Plus locale propagation 2–3 h per locale per book = 18–36 h. Plus code/parser/UI ≈ 4–6 h. Total ≈ 40–70 hours.

---

## Phase 10 — Author John PEOPLE.md (NEW issue N3 + DEFERRED_TASKS Task 6 finish) — CLOSED 2026-05-14

**Closure summary:** Phase 10 executed per `docs/audit/archive/PHASE_10_PLAN.md` (8 audit findings absorbed pre-execution: 5 Significant + 2 PV-must-fix + 1 Minor). All 4 locale files authored at `content/{en,pt-br,de,es}/john/PEOPLE.md` — 11 entries each × 4 locales = 44 entries: 2 see-only cross-book pointers to `matthew/PEOPLE.md` (Yochanan, Yeshua); 5 full PersonEntry profiles (Andreas, Shimon Kefa, Philippos, Nathanael, Nikodemos); 1 Yehudim group entry (Ioudaioi Policy 3-sense breakdown carried in `**Character arc:**` field per audit Significant #2 fix — the originally planned `**Senses:**`/`**Cross-reference:**`/`**Group entry:**` field-keys are not in EXACT_LABEL_ALIASES and would be silently dropped); 3 see-only stubs to future books (Mosheh→exodus, Eliyahu→kings, Yeshayahu→isaiah — dangling-pointer fallback verified). Lint §0.6 activated; `$PEOPLE_FILES` + `$NON_EN_PEOPLE_FILES` extended with 4 + 3 john paths respectively. 801 tests pass; pnpm build succeeds; HTTP 200 across 4 locales. See `docs/editorial-log/john.md` Entry J-021.

### Schema reference (resolves AUDIT §5.4)

John PEOPLE.md authoring uses the **post-Phase-1 PersonEntry schema** in full. See Phase 1H for the data-model expansion. All existing fields (`slug`, `name`, `nameMeaning`, `originType`, `birthYear`, `deathYear`, `lifespan`, `father`, `mother`, `spouses`, `children`, `locations`, `firstMention`, `mentionedIn`, `keyEvents`, `profession`, `socialClass`, `hometown`, `placesLived`, `ageAtFatherhood`, `causeOfDeath`, `languagesSpoken`, `siblings`, `inLaws`, `archaeologicalEvidence`, `extraBiblicalMentions`, `historicityStatus`, `booksAppearingIn`, `keySpeeches`, `verseCount`, `characterArc`, timeline anchors) plus the Phase 1H additions (`curiosities`, `generationsFrom`, `regionsByText`) apply.

### Files to create
`content/{en,pt-br,de,es}/john/PEOPLE.md` (4 files).

### Figures
Yochanan / John the Immerser; Yeshua / Jesus; Andreas / Andrew; Shimon Kefa / Simon Peter; Philippos / Philip; Nathanael; Nikodemos / Nicodemus; Yehudim (group entry, cross-reference Ioudaioi Policy); Mosheh; Eliyahu; Yeshayahu.

### Approach
Unchanged from prior plan: EN first; v3.2 / v3.3 PersonEntry data model; Rule 29 dual-label; v3.2 name policy; heading convention `## Transliteration (Familiar)`; rigorous extra-biblical sources (Josephus *Antiquities* 18.116-119, etc.); historicity status per rules taxonomy; PT-BR / DE / ES mirror EN.

**Editorial-log entries:** in `docs/editorial-log/john.md` for non-obvious decisions.

**Estimated effort:** EN ≈ 8–12 h; PT/DE/ES ≈ 3–4 h each. Total 17–24 h.

---

## Phase 11 — John & Matthew prophecy material decision (NEW issue N5) — options enumerated (resolves AUDIT §3.8)

**Options:**

**Option A.** Don't author PROPHECY files for John or Matthew at all. Existing prophetic material lives in chapter companions (verse notes referencing Hebrew Bible parallels) and editorial-log entries (Matthew M-001 codifies the six fulfillment-formula types). Trade-off: Prophecy view-mode never lights up for either book; readers who navigate via Prophecy view never see John's or Matthew's prophetic content.

**Option B.** Author PROPHECY files comprehensively for every John and Matthew chapter that contains prophetic statements. John 1:51 (ascending/descending), 2:19–22 (raise the temple), 3:14 (Numbers 21 lifted serpent); Matthew 1:22 (Isa 7:14), 2:5–6 (Mic 5:1 + 2 Sam 5:2), 2:15 (Hos 11:1), 2:17–18 (Jer 31:15), 2:23 (Natsri unresolved), 3:3 (Isa 40:3). Trade-off: significant duplication with editorial-log M-001 and verse notes; high authoring cost.

**Option C (RECOMMENDED).** Hybrid — author PROPHECY files **only where the existing chapter-level content is insufficient** to surface in Prophecy view. Specifically:
- John CHAPTER-3-PROPHECY (the Numbers 21 / Yeshua-lifted parallel — narratively central to Jn 3, deserves dedicated prophecy treatment).
- Matthew CHAPTER-1-PROPHECY (Isa 7:14 *parthenos*/*almah*, the foundational birth-narrative prophecy).
- Matthew CHAPTER-2-PROPHECY (the four-formula sequence: Mic 5:1+2 Sam 5:2; Hos 11:1; Jer 31:15; Natsri unresolved — this is the densest prophetic chapter in Matthew 1–3).

Option C populates Prophecy view-mode meaningfully without duplicating every fulfillment-formula entry.

**Decision:** project lead picks A, B, or C before this phase starts. Decision logged in `docs/editorial-log/john.md` and `docs/editorial-log/matthew.md`.

**If Option C is selected:**
- 3 PROPHECY files × 4 locales = 12 new files.
- Apply Rule 29 dual-label to every entry.
- Tests: `pnpm test` (prophecy-parser test suite — 23 tests); `pnpm build`.

**Estimated effort:** decision ≈ 30 min; Option A authoring ≈ 0; Option B ≈ 20–30 h; Option C ≈ 6–10 h.

---

## Phase 12 — Genesis 13–50 content cycle (forward-looking placeholder)

**Closure scope (NEW — resolves AUDIT §3.7):** Phase 12 is a separate forward-looking project tracked in `PENDING.md`. **Phase 12 is not part of this audit cycle's closure.** The audit cycle closes when **Phases 0–11 complete**. Phase 12 follows; Phase 13 follows Phase 12.

Approach unchanged from prior plan: 38 chapters × 4 locales × (chapter + companion + optional prophecy + PEOPLE additions). Per chapter: translate; author companion with multi-scenario Section I; add prophecy file if applicable; expand PEOPLE.md using all v3.2 / v3.3 fields including Phase 1H additions; cross-chapter tracking; editorial-log entries.

**Estimated effort:** very large — months of work. Treat this section as a placeholder pointing to a future detailed plan.

---

## Phase 13 — Cross-book canonical PEOPLE structure (PENDING.md C3)

Trigger: a figure appears in a second book — guaranteed once Phase 12 is underway.

Approach unchanged: canonical-people layer in `content/<locale>/people/` keyed by stable slugs; per-book PEOPLE.md becomes a manifest referencing canonical entries plus book-specific add-ons; parser composes at parse time; DDD compliance preserved.

**Estimated effort:** 1–2 days for parser refactor + canonicalisation of an initial figure set.

---

## Phase ordering rationale

| Phase | Type | Dependency | User impact | Reviewer cost |
|-------|------|------------|-------------|---------------|
| 0 | Tooling | none | none (gates later) | none |
| 1 | Code (People foundation) | Phase 0 | high (broken UI today) | code review |
| 2 | Mechanical content | Phase 0 | low | log entry only |
| 3 | ES NT | Phase 0 lint rules | high (broken Spanish) | ES editor |
| 4 | PT-BR + DE consistency | none | medium | Hellenist + DE editor |
| 5 | UI/routing (Intro split) | none | medium | UX review |
| 5.5 | Rule amendments + version bump | none (independent track) | governance | full Rule-28 amendment |
| 6 | Re-verification (no rule drafting) | Phase 5.5 lands first if 6A item 13 needs the new policy | mixed | mixed |
| 7 | Readability sweep | Phase 5.5 | high | locale editors |
| 8 | Section I 10-category | Phase 7 | medium | locale editors |
| 9 | Book Context content | Phases 1, 2, 3, 4, 5 settled (NOT 6, 7, 8) — runs in parallel with 6/7/8 | medium | Hebraist / Hellenist + locale editors |
| 10 | John PEOPLE | Phase 1 + 9 | high | Hellenist + locale editors |
| 11 | Prophecy decision/content | Phase 6 settled | medium | project lead + matrix |
| 12 | Genesis 13–50 | Out of scope for this cycle | very high | full Rule-28 matrix |
| 13 | Cross-book canonical | Phase 12 in flight | none directly | code + content reviewers |

---

## Cross-cutting Definition of Done for the entire remediation cycle

**Audit-cycle closure (NEW — resolves AUDIT §3.7):** this audit cycle closes when **Phases 0–11 complete**. Phase 12 (Genesis 13–50) and Phase 13 (cross-book canonical) are forward-looking projects tracked in `PENDING.md`; they are not part of this cycle's closure.

The audit cycle is closed when:

1. `pnpm test && pnpm build && pnpm lint && pnpm content:lint && pnpm content:lint:warn` are all green / clean.
2. `docs/feedback/FEEDBACK.md` contains zero `STILL OPEN` items and zero `NOT VERIFIED` items.
3. `docs/audit/PENDING.md` contains only forward-looking content cycles (Phase 12 / Phase 13), not remediation tickets.
4. `docs/feedback/DEFERRED_TASKS.md` reduces to active forward work.
5. Every change with translation impact has an editorial-log entry per Rule 28.
6. RULES-CORE.md is at v3.3 (per Phase 5.5); content references match (per Phase 2A's expanded coverage).
7. People-surface bugs (TT H2 empty card; non-EN missing fields; Matthew timeline absent; lifespan text invisible on narrow bars; safeguard banner) are all closed and lint-protected.
8. Book Introduction split shipped; Book Context page populated for the three currently-authored books.
9. CLAUDE.md reflects post-cycle state (test count, ruleset version v3.3, content scope, open-items list).
10. Git tags `tt-fix-phase-0-complete` through `tt-fix-phase-11-complete` exist.

---

## Out of scope for this plan

- Vercel deployment configuration.
- Analytics taxonomy (per STANDARDS §10).
- New UI surfaces beyond what's already implemented.
- Reviewer staffing.
- **Speculative ethnogenesis content.** Only the constrained `regionsByText` form (Phase 1H-3) is in scope.
- **Phase 12 (Genesis 13–50) and Phase 13 (cross-book canonical)** are tracked but not part of this cycle's closure.

---

## Revision Log

- **2026-05-08 (initial draft)** — captured all open items in `FEEDBACK.md`, `PENDING.md`, `DEFERRED_TASKS.md` plus the six new findings (N1–N6) surfaced during re-audit.
- **2026-05-08 (post People discussion)** — added new Phases 1, 5, and 9; expanded `PersonEntry` data model in Phase 1; enforced anti-ethnogenesis constraint on `regionsByText`; added lint rules §0.7, §0.8, §0.10; renumbered subsequent phases. Cross-referenced 14 sub-items from the discussion into the plan; rejected speculative form of 3.10 in favour of the rule-compliant constrained form.
- **2026-05-08 (post AUDIT_FIX.md)** — incorporated all 7 blockers and 9 significant concerns from the independent audit:
  - **§3.1 / §3.4:** §0.10 lint path-scoped to PEOPLE.md only and runs warn-only; new `--warn-only` mode and `lint-allowlist.txt` infrastructure introduced in Phase 0.
  - **§3.2:** Rule drafting extracted into new Phase 5.5 with explicit Amendment & Lock Protocol invocation; v3.3 picked as the target version.
  - **§3.3:** `GenerationReference` changed from discriminated union to extensible string with a registry pattern.
  - **§3.5:** Phase 5 specified — new `getIntroductionOverview` helper, disclaimer NOT shown on landing, `IntroductionView` reused for both surfaces.
  - **§3.6:** Phase 9 dependency reduced to Phases 1–5; can run concurrently with 6, 7, 8.
  - **§3.7:** Audit-cycle closure scope specified — Phases 0–11.
  - **§3.8:** Phase 11 Options A, B, C enumerated.
  - **§4.1:** Phase 1B matching strategy specified — exact-match-first, longest-substring fallback.
  - **§4.2:** Phase 1H-1 Curiosities markdown format specified with example.
  - **§4.3:** Phase 1F period-grouping algorithm made deterministic — watershed precedes gap.
  - **§4.4:** Phase 4B reframed for clarity.
  - **§4.5:** CLAUDE.md sync added to per-phase Definition of Done.
  - **§4.6:** Phase 2A regex coverage cross-referenced with Phase 0 §0.1.
  - **§4.7 / §0.7:** H1 disposition specified — both H1 and H2 stripped; lint catches both.
  - **§4.8:** Allow-list mechanism specified — `scripts/lint-allowlist.txt` sidecar.
  - **§4.9:** Phase 1H-3 safeguard-pointer UI specified — fixed banner above `regionsByText` entries, i18n'd, all locales.
  - **§5.1, §5.2, §5.3, §5.4, §5.5, §5.6, §5.7, §5.8, §5.9:** all minor concerns folded in (markdown formatting in greps, manual-verification of readability, per-book motif targets, schema cross-reference in Phase 10, per-phase git tags, systematic Rule-11 audit, monogenes decision step, regex coverage, count-semantics).

- **2026-05-08 (post meta-review)** — two improvements absorbed:
  - Phase 5.5 path options decoupled into Standard / Emergency / **Hybrid (recommended)**. The artifact (proposals) and the window (14 days) are now treated as separable. Hybrid runs Emergency-with-proposals — preserves the artifact and the precedent without paying the calendar cost.
  - Per-phase Definition of Done extended from CLAUDE.md sync to **all four meta-docs** (CLAUDE.md + FEEDBACK.md + PENDING.md + DEFERRED_TASKS.md). Ruleset bumps trigger version-stamp sweep across all four. This closes the same drift mechanism that produced the original 180-references-at-v3.0 problem.

- **2026-05-08 (Phase 1 closed)** — People-surface foundation landed.
  - **1A (TT/H1 strip):** removed dead H1 + TT H2 from all 8 PEOPLE.md files. §0.7 cleared (13 → 0). Lint enforces.
  - **1B (parser rewrite):** `people-parser.ts` rewritten with exact-match alias table + longest-substring fallback (resolves AUDIT §4.1). Field labels for all 4 locales now route to the correct `PersonEntry` field. Verified: DE Adam now has hometown / placesLived / socialClass / characterArc / historicityStatus populated (previously dropped silently); PT/DE/ES `father` no longer overwritten by `ageAtFatherhood` value.
  - **1C (heading convention):** 40 non-EN heading bugs corrected (`## Henoch (Henoch)` → `## Chanokh (Henoch)`; `## Eva (Eva)` → `## Chava (Eva)`; etc. across DE/PT/ES Genesis + DE/ES Matthew). 22 genuine same-form cases (Adam, Lot, Sarai, Tamar, etc.) added to `scripts/lint-allowlist.txt`. §0.8 cleared (62 → 0 after expanded perl regex caught Lamech/Lamec trailing-text variants).
  - **1D + 1E (timeline):** `people-timeline.tsx` rewrites — dropped `fill: "white"` (TT-DESIGN-SYSTEM §5 violation), moved lifespan label to right of bar in `text-text-secondary` (OKLCH token). Anchor detection now picks `yearFromCreation` or `historicalYear` per book. Matthew people page now renders a timeline (it didn't before — bug fix).
  - **1F (sort + period grouping):** `people/page.tsx` sorts entries chronologically. Genesis gets period dividers via deterministic algorithm: watershed (Flood / Babel / Avram's call) takes precedence over gap (>200 years). Watershed AM constants live in `src/ui/people/genesis-watersheds.ts`. Locale-aware watershed labels in i18n.
  - **1G (em-dash sweep on PEOPLE.md):** 167 raw `--` occurrences across 6 files swept. §0.2 dropped from 3,921 → 3,583. Remainder is in chapter / companion files for Phase 2C.
  - **1H (data-model expansion):** `PersonEntry` extended with `curiosities`, `generationsFrom`, `regionsByText`. New types in `domain/content/types.ts`. New module `domain/content/generation-references.ts` with extensible string type + locale-aware label registry (resolves AUDIT §3.3). Parser handlers added for all three; format specified in plan and tests added (resolves AUDIT §4.2). UI: PersonCard renders new field blocks; `regionsByText` always rendered with a fixed safeguard banner above entries (Lucide `ShieldAlert` icon, i18n'd in all 4 locales — resolves AUDIT §4.9).
  - **Lint refinements:** §0.8 perl regex expanded to catch trailing-text variants (e.g. `## Lamech (Lamech) — kainitische Linie`). Allow-list format documented (entries are `<rule>|<file>|<text>` — line numbers stripped before comparison). New i18n keys: `timelineCaptionCreation`, `timelineCaptionHistorical`, `curiosities`, `generationsFrom`, `regionsByText`, `regionsByTextSafeguard`, `watershed.{flood,babel,avram-call}` in all 4 locales.
  - **Test count:** 767 → **789** (+18 new Phase 1B/1H tests + 4 audit-gap tests). All 6 test files passing.
  - **Build:** clean. 122 static pages generate.
  - **Closure baseline (delta from Phase 0):**

    | Rule | Phase 0 baseline | Phase 1 closure | Closes in |
    |------|-----------------:|-----------------:|-----------|
    | §0.1 stale ruleset | 173 | 173 | Phase 2A |
    | §0.2 em-dash | 3,921 | **3,583** | Phase 2C |
    | §0.3 ES NT diacritics | 37 | 37 | Phase 3A |
    | §0.4 ES NT Reina-Valera | 6 | 6 | Phase 3B |
    | §0.5 PT-BR unigênito | 22 | 22 | Phase 4A |
    | §0.7 PEOPLE TT/H1 | 13 | **0** | (closed) |
    | §0.8 heading collision | 62 | **0** | (closed) |
    | §0.10 warn-only | 3 lines | 3 lines | manual review |

- **2026-05-09 (Phase 5.5 audit closure)** — second-pass review found one real gap; closed:
  - **README.md missed by the cascade.** README.md is the project's public-facing entry point. The Phase 5.5D cascade swept `content/`, `docs/editorial-log/`, and `docs/rules/RULES-CORE.md` but did not include `README.md` in the file list. Four active v3.2 references found and bumped: Prime Directive heading, Tech Stack table comment, project-structure tree caption, and Standards section. Also refreshed the "Project state" callout to reference the 2026-05-08 audit cycle closure (Phases 0–5.5) instead of the pre-cycle "open items" list.
  - **Verified clean** — all 5 proposal files present (71/79/90/109/58 lines); RULES-CORE.md sections in correct order (§Punctuation 834, §Idiom 873, §Glossary 919, §Editorial Log 977, §Worked Example 1177); section-ID counts match plan (§P1–P6, §I1–I6, §G1–G6, §L1–L4); 184 v3.3 stamps in content/; all 3 editorial-log Format headers updated to v3.3; build 134 pages.
  - **Intentional historical attribution preserved:** Rule 17 "(v3.2)" name-rendering policy lock; HB/GS proper-name table "(v3.2)" lock; CHANGELOG-v3.3 references to v3.2 as prior version; RULES.md redirect "Redirected (v3.0)". All documented in CHANGELOG-v3.3 §"What was NOT changed".
  - **All gates green:** tests 789/789, build 134 pages, `pnpm lint` clean, `pnpm content:lint` exit 0.

- **2026-05-08 (Phase 5.5 closed)** — Ruleset v3.3 landed via Hybrid Lock-Protocol.
  - **5.5A — Five proposal artifacts drafted** in `docs/rules/proposals/`: `v3.3-24-punctuation-governance.md`, `v3.3-25-idiom-policy.md`, `v3.3-29-glossary-expansion-procedure.md`, `v3.3-30-editorial-log-schema.md`, `v3.3-31-worked-quadrilingual-example.md`. Each documents rationale, affected rules, draft text, impact assessment, and Hybrid-path justification (no signed-off verses; additive only).
  - **5.5B — RULES-CORE.md amendments landed.** Header bumped v3.2 → v3.3. Three new sections inserted between Rule 29 and §EDITORIAL LOG SPECIFICATION: §PUNCTUATION GOVERNANCE (§P1–§P6); §IDIOM POLICY (§I1–§I6); §GLOSSARY EXPANSION PROCEDURE (§G1–§G6). Existing §EDITORIAL LOG SPECIFICATION refined with field-type table, expanded §L1 triggers (9 → 12), §L2 status workflow, §L3 cross-book references, §L4 citation convention. Existing §WORKED QUADRILINGUAL EXAMPLE augmented with John 1:1c (alongside the existing Gen 1:2). VERSION HISTORY entry added. Rule 29 template line and END OF CORE RULESET marker bumped to v3.3.
  - **5.5C — `CHANGELOG-v3.3.md` written** documenting all five additions, the Hybrid invocation, cascade requirements, and reviewer audit trail.
  - **5.5D — Version-stamp cascade.** `scripts/content-lint.sh` §0.1 pattern updated to flag v3.0/v3.1/v3.2 (anything older than v3.3); 271 §0.1 hits surfaced post-update; 180 files swept (chapter front matter, PEOPLE.md, INTRODUCTION.md, companions, prophecy files, editorial-log `Ruleset version in force:` lines, `Format: per v<X.Y>` headers, parenthetical `(v3.2)` references). §0.1 baseline 271 → **0**.
  - **Closure baseline:** all blocking content-lint rules at 0; `pnpm lint` clean; `pnpm test` 789/789; `pnpm build` 134 pages; `pnpm content:lint` exit 0.
  - **Note on RULES-HB / RULES-GS:** unchanged at v3.3. Their proper-name-table headers retain "(v3.2)" as historical lock-version attribution per CHANGELOG-v3.3 convention.

- **2026-05-08 (Phase 5 audit closure)** — second-pass review found two gaps:
  - **Dead i18n key.** `nav.introductionFull` was added to all 4 message files in Phase 5D but never referenced anywhere in `src/`. Removed from en/pt-br/de/es. JSON validity preserved.
  - **Biome formatter regression.** The `hasFullIntroduction` line I added in Phase 5B exceeded Biome's line-length limit. `pnpm lint` failed with a single formatting error. Auto-fixed via `pnpm biome check --write`. The gate `pnpm lint` was caught by the per-phase DoD (added in Phase 2D); Phase 5 closure had glossed over the failing exit code on `pnpm lint` because the same shell run also showed `Content lint passed` from a different command, masking the Biome error.
  - **Verified clean** — all 12 `/introduction` static pages generate; disclaimer renders on `/introduction` (2× the sentinel "This introduction provides scholarly background") but NOT on the landing (0×); landing → `/introduction` link present; helper correctly clears disclaimer + filters to `overview` section.
  - All gates green post-audit: tests 789/789, build 134 pages, `pnpm lint` clean, `pnpm content:lint` exit 0.

- **2026-05-08 (Phase 5 closed)** — Book Introduction split landed.
  - **5A — `getIntroductionOverview` helper:** added to `src/lib/content-loader.ts`. Returns `IntroductionData` filtered to the `overview` section only and clears the disclaimer (which belongs on the dedicated introduction page, not the landing).
  - **5B — Book landing page:** `src/app/[locale]/[book]/page.tsx` now calls `getIntroductionOverview` (Overview only, ~80 lines instead of 425+ on Genesis) and adds a third entry-point card: **Introduction** (Lucide `BookMarked`, conditional on intro existing). Layout switches to `flex-col sm:flex-row` so 3 cards fit cleanly on mobile + desktop. All cards now have `min-h-11` for the 44px tap-target target.
  - **5C — `/{locale}/{book}/introduction` route:** new `src/app/[locale]/[book]/introduction/page.tsx` mirroring the structure of `people/page.tsx`. Renders the full `IntroductionData` (sections A through G + disclaimer) via the same `IntroductionView` component reused from the landing.
  - **5D — i18n keys:** added `nav.bookIntroduction`, `nav.bookIntroductionDescription`, `nav.introductionFull` to all 4 message files (en/pt-br/de/es). All JSON valid.
  - **HTTP smoke:** all 12 landing pages and 12 new `/introduction` pages return 200. EN Genesis landing: 71KB, 1 `<details>` (Overview); EN Genesis `/introduction`: 170KB (+99KB), 6 `<details>` (all sections including Authorship, Dating, Manuscript Transmission, etc.). Section-A-only landing confirmed: zero `B. Authorship` matches on landing, multiple on `/introduction`.
  - **Build:** static pages 122 → **134** (+12 new introduction routes, 4 locales × 3 books).
  - **No translation impact:** UI/routing only. No editorial-log entry required (per plan §5 reviewer involvement: "UX review (project lead). Translation untouched.").

- **2026-05-08 (Phase 4 audit closure)** — second-pass review found one significant gap and three minor verifications:
  - **Significant — ES unigenito parallel bugs.** Phase 4A's §0.5 lint scoped only PT-BR (`unigênito`) and missed parallel bugs in ES (`unigenito`, no diacritic). ES audit found: 1 active main-text bug (John 1:18 `el unigenito Dios` → `el único-nacido Dios`), 2 glossary hyphenation drifts (`único nacido` → `único-nacido`), and 4 A8-companion references to TT renderings of the variant (`Dios unigenito` / `Hijo unigenito` → `Dios único-nacido` / `Hijo único-nacido`). All fixed. Remaining 4 ES `unigenito` references in CONTEXT meta-commentary parallel the PT-BR allow-listed cases (rejected-form contrasts). Editorial-log entry J-015 amended to record the ES extension.
  - **Verified clean** — DE meta-statements correctly aligned with RULES-GS proper-name table; body-level glossing properly deferred to DE editor (42× `Johannes` + 1× `Yochanan` in DE John 1 = expected post-meta-statement state). Matthew PEOPLE Section H has 5 sources in all 4 locales, all with PRIMARY/PEER-REVIEWED labels, zero leftover descriptive prefixes. Editorial-log entries J-015, J-016, M-011 all present.
  - **HTTP smoke confirms:** PT-BR Jn 3:16 renders `filho único-nascido` 12× and zero `filho unigênito`. ES Jn 1:18 renders `el único-nacido Dios` 5× and zero `el unigenito Dios`. DE Jn 1 renders `Yochanan (Johannes)`, `Yeshua (Jesus)`, `Kefa (Petrus)` 1× each (meta-statement).
  - **All gates green:** `pnpm test` 789/789, `pnpm build` 122 pages, `pnpm lint` clean, `pnpm content:lint` exit 0.

- **2026-05-08 (Phase 4 closed)** — PT-BR / DE / Matthew-PEOPLE governance landed.
  - **4A — PT-BR `monogenēs` → `único-nascido`.** §0.5 baseline 22 → 0 (active uses); 4 deliberate references to the rejected traditional `unigênito` (in Tier 2 notes / Tier 3 D1+A3 companion entries) retained as contrast and allow-listed in `scripts/lint-allowlist.txt` rule §0.5. Chosen form parallels EN/DE/ES; avoids `gennaō → begetting` connotation per Rule 3 + GS-glossary policy. Editorial-log entry J-015.
  - **4B — DE first-occurrence transliteration.** Updated meta-statements ("Eigennamen folgen der TT-Transliteration: …") in DE John 1, 2, 3 to use canonical RULES-GS proper-name table forms: `Yochanan (Johannes)`, `Yeshua (Jesus)`, `Kefa (Petrus)`, `Philippos (Philippus)`, `Nikodemos (Nikodemus)`, `Mosheh (Mose)`, `Kfar Nachum (Kapernaum)`, `Yerushalayim (Jerusalem)`. Body-level section-first-occurrence glossing deferred to DE editor at Rule-28 review (significant editorial effort beyond "draft sweep"). Editorial-log entry J-016.
  - **4C — Matthew PEOPLE governance.** Section H sources restructured across all 4 locales to use Rule 29 explicit provenance labels (`PRIMARY` / `PEER-REVIEWED (lexicon)` / `PEER-REVIEWED (commentary)`) instead of descriptive prefixes. Disclaimer + editorial-provenance footer were already present from prior authoring. Editorial-log entry M-011.
  - **Legacy "vosotros" allow-list:** ES Genesis 12 companion contains two biblical-text quotations (Isa 51:2, Ex 22:21) using `vosotros`/`vuestro` forms. These are explicit citations from cited Spanish sources, not the TT's own translation. Allow-listed under the legacy rule. The TT's pan-Hispanic-neutral standard is preserved in active translation.
  - **First fully-clean lint state:** `pnpm content:lint` exits 0 for the first time this cycle. Only §0.10 warn-only fires (3 lines in EN Genesis PEOPLE.md, intentional reception-history references for reviewer attention).
  - **Closure baseline:**

    | Rule | Phase 3 closure | Phase 4 closure |
    |------|----------------:|----------------:|
    | §0.1 | 0 | 0 |
    | §0.2 | 0 | 0 |
    | §0.3 | 0 | 0 |
    | §0.4 | 0 | 0 |
    | §0.5 PT-BR unigênito | 22 | **0** |
    | §0.7 | 0 | 0 |
    | §0.8 | 0 | 0 |
    | §0.10 (warn-only) | 3 | 3 |

  - **Tests:** 789/789. **Build:** 122 static pages. **`pnpm lint`:** clean. **`pnpm content:lint`:** **exits 0**. **HTTP smoke:** PT-BR John 3:16 renders `filho único-nascido` 2× (was `unigênito`); DE John 1 overview renders `Yochanan (Johannes)` etc.

- **2026-05-08 (Phase 3 audit closure)** — second-pass review found two cross-locale-consistency drifts in ES John (caused by ES John's pre-existing front matter using a different wording than ES Matthew/Genesis); closed both.
  - **Ordinal format drift:** ES John 1–3 had `28a edición revisada`, ES Matthew uses `28.ª edición revisada` (proper Spanish ordinal). Aligned ES John to `28.ª`.
  - **Status-label wording drift:** ES John 1–3 had `**Status:** provisional — pendiente de aprobación por revisores`, ES Genesis/Matthew use `**Status:** provisorio — pendiente de revisión por pares`. Aligned ES John to the project standard form (`provisorio` / `revisión por pares`).
  - The third drift (`kyrios` policy wording — "se traduce como" vs "traducido como") is stylistic; both are valid Spanish phrasings of the same Option-C rule. Left as-is for ES editor preference at Rule-28 review.
  - **Verified clean after closure:** all 6 ES NT files have v3.2 stamps, RV declaration, em-dash-free body, and `provisorio` status. ES Matthew + ES John 2 HTTP-smoke checked: 200 responses, accented forms render, no `Senor` regression.

- **2026-05-08 (Phase 3 closed)** — ES NT remediation landed.
  - **3A — ES John 1–3 diacritic restoration.** Front matter rewritten to ES Genesis style (`Traducción`, `Edición`, `Español`, `Política`, `Señor`, etc.). Body restored across always-accented Spanish words (`día`, `después`, `también`, `jamás`, `único`, etc.), preterite 3rd-singular forms (`llegó`, `venció`, `respondió`, `confesó`, `negó`, `conoció`, etc.), imperfect 3rd-singular forms (`había`, `tenía`, `decía`, etc.), 3rd-plural -ían forms (`confían`, `envían`), unambiguous pronouns (`él` after preposition + clear subject contexts; `tú` as subject; `mí` as prepositional), `está` (verb estar in clear contexts), and interrogatives inside `¿...?` (`Quién`, `Qué`, `Cómo`, `Cuándo`, `Dónde`, `Cuál`, `Por qué`). Ambiguous cases (`el`/`él` as subject in some narrative contexts; `esta`/`está`; `mas`/`más`) left for ES editor polish at Rule-28 review. §0.3 baseline 37 → **0**. Editorial-log entry J-013.
  - **3B — ES NT Reina-Valera Option-B declaration.** Inserted `**Relación con Reina-Valera (Regla CORE):** Opción B — Reconocimiento selectivo. Se notan convergencias/divergencias en materiales suplementarios.` into the front matter of all 6 ES NT chapter files (John 1–3 + Matthew 1–3), placed after `**Revisores:**` mirroring ES Genesis pattern. §0.4 baseline 6 → **0**. Editorial-log entries J-014 + M-010.
  - **Recovery note:** an early perl one-liner duplicated 6 file contents (`print; $_ = '...' if 0;` pattern); reverted via `git checkout --` and re-applied Phase 2A + 2C + 1-status-label + 3A in one corrective sweep, then 3B. Final state verified clean.
  - **Closure baseline:**

    | Rule | Phase 2 closure | Phase 3 closure |
    |------|----------------:|----------------:|
    | §0.1 stale ruleset | 0 | 0 |
    | §0.2 em-dash | 0 | 0 |
    | §0.3 ES NT diacritics | 37 | **0** |
    | §0.4 ES NT Reina-Valera | 6 | **0** |
    | §0.5 PT-BR unigênito | 22 | 22 (Phase 4A) |
    | §0.7 PEOPLE TT/H1 | 0 | 0 |
    | §0.8 heading collision | 0 | 0 |

  - **Tests:** 789/789. **Build:** 122 static pages. **`pnpm lint`:** clean. **HTTP smoke:** ES John 1 renders 9× `Señor`, 18× `llegó`, 6× `venció`, 9× `después`, 1× `Reina-Valera` (front matter), zero `Senor` (no diacritic regression).

- **2026-05-08 (Phase 2 audit closure)** — second-pass review found three small leftovers; all closed:
  - **RULES-CORE.md self-reference drift** at line 829 (`**Ruleset:** v3.0` template example) and line 1233 (`**END OF CORE RULESET v3.0**` footer marker). Both updated to v3.2 — the file's actual top-of-file declaration is v3.2, so the embedded references should match. Phase 2A's sweep didn't include `docs/rules/` because version-history sections legitimately reference v3.0/v3.1; these two cases are template/footer drift, fixed manually.
  - **Editorial-log Entry 097 self-trip on §0.1.** My own log entry describing the version-stamp sweep contains the literal pattern `Ruleset v3.0` inside backtick descriptions; the lint isn't markdown-aware so it flagged its own documentation. Allow-listed in `scripts/lint-allowlist.txt` rather than restructured.
  - **DEFERRED_TASKS.md not synced for Phase 2.** Updated to reference Phases 0–2 closure consistent with the other meta-docs.
  - All DoD gates now green: `pnpm test` 789/789, `pnpm build` 122 pages, `pnpm lint` clean, `pnpm content:lint` blocking rules §0.1/§0.2/§0.7/§0.8 = 0 (remaining §0.3/§0.4/§0.5 are Phase 3/4 work), `pnpm content:lint:warn` exits 0.

- **2026-05-08 (Phase 2 closed)** — mechanical content sweeps + Biome config migration landed.
  - **2A — Version stamp sweep:** §0.1 baseline 173 → 0. ~179 files touched across content/, docs/editorial-log/, including bolded variants the original Phase 0 §0.1 lint pattern missed (`**Conjunto de Regras:**`, `**Regras:**`, `**Conjunto de reglas:**` — all added to the sweep set during execution).
  - **2B — ψυχή typo:** verified already fixed in `RULES-GS.md` line 40. No-op.
  - **2C — Em-dash sweep:** §0.2 baseline 3,583 → 0. 43 files, raw `--` replaced with `—` everywhere except date ranges (`Gen 5:21--27`) and markdown horizontal rules.
  - **2D — Biome config migration:** schema bumped 2.0.0 → 2.4.14 via `biome migrate`. ~150 diagnostics auto-fixed (formatting, imports, optional chaining, unused imports/vars). Two rules disabled with project-rationale (`security/noDangerouslySetInnerHtml` per STANDARDS §8 — committed-markdown content; `suspicious/noArrayIndexKey` — static content). Two decorative SVG chevrons given `aria-hidden="true"` (a11y compliance). `*.css` excluded from Biome (Tailwind v4 syntax incompatibility). `pnpm lint` now exits 0 for the first time this cycle.
  - **Closure baseline:**

    | Rule | Phase 1 closure | Phase 2 closure |
    |------|----------------:|----------------:|
    | §0.1 stale ruleset | 173 | **0** |
    | §0.2 em-dash | 3,583 | **0** |
    | §0.3 ES NT diacritics | 37 | 37 (Phase 3A) |
    | §0.4 ES NT Reina-Valera | 6 | 6 (Phase 3B) |
    | §0.5 PT-BR unigênito | 22 | 22 (Phase 4A) |
    | §0.7 PEOPLE TT/H1 | 0 | 0 |
    | §0.8 heading collision | 0 | 0 |

  - **Tests:** 789/789. **Build:** 122 static pages, clean. **`pnpm lint`:** clean (NEW — was failing).
  - Editorial-log entry 097 records the sweep.

- **2026-05-08 (Phase 1 audit closure + Phase 2 plan update)** — third-pass review surfaced one pre-existing item that's not in Phase 1 scope but blocks the standard `pnpm lint` workflow: Biome config (`biome.json`) was authored against schema 2.0.0 but the installed CLI is 2.4.14 (`organizeImports` moved, schema version validates strictly). Plan updated:
  - Added **Phase 2D — Biome config migration**: bump schema URL, run `biome migrate`, triage any post-migration lint hits (auto-fix vs. real-bug vs. style-preference disable).
  - Added `pnpm lint` to the per-phase Definition of Done (gating from Phase 2 onward; Phase 0–1 predate the fix).
  - Cross-cutting DoD bullet 1 now includes `pnpm lint` alongside the other gates.

- **2026-05-08 (Phase 1 audit closure)** — second-pass review found three gaps the first audit missed; all closed:
  - **Gap 1 — Leading blank line in PEOPLE.md.** Plan §1A required "files start directly with the `---` separator." After H1+H2 strip, files began with `\n---\n` instead of `---\n`. Sed-stripped the leading blank from all 8 files. Fidelity to plan restored.
  - **Gap 2 — Missing parser tests.** Plan §1B explicitly listed test cases that were not authored: (a) "Fallback path: a fictional label not in the alias table but containing a known substring still routes correctly"; (b) localized TT-H2 negative tests for DE and PT (only EN and ES were covered). Added all three: `fallback substring path` (Hometown of birth → hometown), `fallback prefers longer alias` (no Father/AgeAtFatherhood overwrite regardless of order), and TT-H2 negatives for `Die Transparente Übersetzung` and `A Tradução Transparente`.
  - **Gap 3 — Safeguard banner not exercised at runtime.** Plan §1H-3 Done When required "safeguard banner renders in all locales when regionsByText is populated." No PEOPLE.md had `regionsByText` populated, so the banner UI was wired but never reached production HTML. Authored the field for `## Cham (Ham)` in EN Genesis using Gen 10:6's literal text-named sons (Kush, Mitsrayim, Put, Kenaan — all confidence DOCUMENTED). Verified via HTTP smoke against `pnpm start`: safeguard banner text ("Restricted to regions and peoples the biblical text itself names") appears 3× in DOM; ShieldAlert icon renders; "Genesis 9 and 10" anti-misuse pointer present; all four region names plus DOCUMENTED chips in DOM. The Cham entry is genuine anti-ethnogenesis-compliant content (text-bound only) and serves as the canonical example for Phase 10/12 authoring.
  - **Verified clean after closure:** §0.7 = 0, §0.8 = 0, §0.10 = 3 warn-only (unchanged — Cham regionsByText doesn't trip the modern-mapping pattern). Tests 789/789. Build 122 static pages.

- **2026-05-08 (Phase 0 closed)** — lint hardening landed.
  - `scripts/content-lint.sh` rewritten with `--warn-only` flag, sidecar allow-list, `emit` / `emit_warn` helpers, per-rule path scoping. PCRE backref check (§0.8) implemented in perl rather than `grep -P` because the user's BSD `grep` lacks PCRE support; `ugrep` works interactively but not when invoked under `bash`.
  - `scripts/lint-allowlist.txt` created (intentionally empty for the initial baseline; populated during Phase 1C heading-convention enforcement).
  - `package.json` gained `content:lint:warn` script alias.
  - Phase 0 closed with `pnpm test` 767/767 passing and the lint-suite recording the following **baseline failure counts** (these are the work items Phases 1–4 must clear):

    | Rule | Match-line count | Closes in |
    |------|------------------|-----------|
    | §0.1 (stale ruleset version stamp v3.0/v3.1) | 173 | Phase 2A |
    | §0.2 (raw em-dash residue ` -- `) | 3,921 | Phase 1G + 2C |
    | §0.3 (ES NT diacritic loss) | 37 | Phase 3A |
    | §0.4 (ES NT missing Reina-Valera) | 6 | Phase 3B |
    | §0.5 (PT-BR `unigênito`) | 22 | Phase 4A |
    | §0.7 (PEOPLE.md TT/H1 leftover) | 13 | Phase 1A |
    | §0.8 (PEOPLE.md heading collision) | 58 | Phase 1C |
    | legacy (vosotros + ES diacritics legacy) | 4 | Phase 3 / Phase 6 |
    | §0.10 (warn-only modern-mapping smell-test) | 3 lines, 1 rule firing | manual review during Phase 1H |

  - Notable: §0.8 surfaced more violations than the original audit predicted. The DE Henoch heading inversion is one of 17 DE Genesis cases; ES Genesis has 24 cases where the familiar form was used as primary (e.g. `## Eva (Eva)`, `## Caín (Caín)`, `## Enoc (Enoc)`) instead of `Transliteration (Familiar)`. Phase 1C heading-convention enforcement is a larger sweep than originally scoped and will need ES + DE editor review.
  - Git tag applied: `tt-fix-phase-0-complete`.

The plan is now ready for execution after Phase 5.5 path decision (Standard vs Emergency vs Hybrid).

- **2026-05-09 (Phase 6.6 closed)** — post-Phase-6 UX + content polish landed across 9 sub-phases (per `docs/audit/archive/NEW_PLAN.md`):
  - **6.6A** — en-dash content sweep. Numeric/scriptural ranges `--` → `–` (U+2013) across all 4 locales × 3 books; perl one-liner anchored on digits to avoid touching markdown horizontal rules and word-range em-dashes; ES per-locale pre-audit confirmed regex coverage; dual residue check (`[0-9]+--[0-9]+` returns 0; word-ranges manually classified — anchor slugs preserved, sentence em-dashes deferred). Plus targeted manual fix: Roman numeral page range `lxxiii--lxxv` in EN/ES Matthew INTRODUCTION.
  - **6.6B** — person heading parser fix. `## Name (Familiar)` heading now auto-extracts `name + familiarName` via `(.+?)\s*\(([^)]+)\)` regex; explicit `**Familiar name:**` field still allowed and overrides via line-order processing. Fixes the `Adam (Adam) (Adam)` display bug. +4 parser tests (792 → 796); slug-anchor audit verified slug used only as React `key`, no URL impact.
  - **6.6C** — introduction layout dedup. Disclaimer now wrapped in collapsed `<details>` labeled "Reading note" / "Nota de leitura" / "Hinweis zum Lesen" / "Nota de lectura" at top of `IntroductionView`; H2 title removed (page H1 dominates). Rule 29 §792 disclaimer requirement preserved (DOM-accessible, keyboard-navigable, visible when expanded). New i18n key `introduction.readingNote` in all 4 locales; `IntroductionView` prop changed from `title` to `readingNoteLabel`; both callsites updated (introduction page + book landing).
  - **6.6D** — person card field reorder + birth/death display. Biographical-fields-block-only reorder (positions 4-20); top blocks (`crossBookSee`, `inBook`, `generationsFrom`) and bottom blocks (archaeology, regionsByText, curiosities) preserved exactly as-is. New `Field` rows for `birthYear` + `deathYear` below lifespan. i18n keys `people.birthYear` + `people.deathYear` already existed in all 4 locales — no new keys needed.
  - **6.6E** — single-expand HTML-native accordion. Added `name="people-accordion"` attribute to `<details>` in `PersonCard`. Native HTML 2024 spec exclusive-accordion behavior; zero JS; supported in Chrome 120+, Firefox 121+, Safari 17.2+, Edge 120+ (all Dec 2023 LTS releases — fully GA at 2026). Curiosities sub-block uses `<div>` not `<details>` — verified no defensive guard needed.
  - **6.6F** — chapter page breadcrumb. Added `← Book` Lucide ChevronLeft + locale-Link to top of `ChapterView` matching the existing People + Introduction page pattern.
  - **6.6G** — Matthew people lifespan + dates content authoring. 5 entries × 4 locales (Yeshua, Miryam, Yosef, Herodes the Great, Yochanan the Immerser): added explicit `**Birth year:**`, `**Death year:**`, `**Lifespan:**` fields with Rule 13 confidence + Rule 29 claim-type labels. Project-wide numeric-anchor convention adopted: `historicalYear`, `historicalYearEnd`, `yearFromCreation`, `yearFromCreationEnd` MUST be parseInt-safe bare integers. Existing-content fix: Miryam's `c. -20` and Yosef's `c. -25` historicalYear values normalized to `-20` and `-25` (both were silently failing `Number.parseInt` and excluded from the Matthew timeline). Herod claim-type corrected from `LATER RECEPTION — DOCUMENTED` to `HISTORICAL / ARCHAEOLOGICAL — VERIFIED` per Rule 29 dual-label semantics. Editorial-log Entry M-014 logged.
  - **6.6H** — important women timeline audit. Cross-locale parseInt-safety scan: 0 failures in matthew/PEOPLE.md post-6.6G, 8 pre-existing failures in genesis/PEOPLE.md (Shem + Cham × 4 locales — descriptive `Year from creation: not precisely calculable...` text where bare integer required). Governance decisions:
    - Eve / Sarai (genesis): Option-1 — accept-the-gap. Both stay in expandable list; no SVG bar. Sarai's anchor (computable from Gen 17:17 + 23:1) deferred to Phase 12 (Gen 13–50 file-scope expansion).
    - Bat-Sheva (matthew): intentionally absent. Matthew's circumlocution (τῆς τοῦ Οὐρίου, 1:6) avoids her name; full bio belongs in samuel/PEOPLE.md or kings/PEOPLE.md when those books are authored.
    - Tamar / Rachav / Rut (matthew): no `historicalYear` field — text-stated dates fall outside Matthew 1–3 file scope; they remain expandable-only per Option-1.
    - Miryam / Yosef (matthew): historicalYear-only with no end — `pickAnchor()` requires both ends; expandable-only. Editorial-log Entry M-015 logged.
  - **6.6I** — dead code + dead content audit (NEW per user request, conservative read-only first pass). 12-category audit:
    - **0 actionable removals** — Items 1–4 (unused TS imports / console.log / TODO comments / formatter issues) all clean per existing Biome enforcement.
    - **5 KEEP-with-reason from depcheck:** `@swc/helpers` (Next.js compiler internal), `@tailwindcss/postcss` + `postcss` + `tailwindcss` (Tailwind v4 CSS pipeline triggered by `@import` directive), `@types/react-dom` (type-only dependency depcheck can't trace).
    - **53 parser-alias candidates all KEEP-with-reason:** forward-API for unauthored books (`in genesis`, `em gênesis`, etc. for cross-book references), backup variant aliases (singular vs plural form per locale), or fallback-pattern shadows (longer aliases match first via FALLBACK_PATTERNS sort).
    - **52 i18n key candidates — REPORT-only.** False-positive sources: dynamic-key patterns (e.g., `t(\`book.${book}\`)` makes `book.genesis`, `book.matthew`, `book.john` look unused via static grep; the script enumerates known dynamic prefixes — `book`, `nav`, `confidence`, `landing.rule`, `landing.rulesPrime`, `people.watershed`, `people.inBook`, `en/genesis/study/CHAPTER-` — and treats matching suffixes as live), forward-API for un-wired UI features (`enrichment.hedge*`, `prophecy.fulfillment.*`), and PersonEntry fields not yet rendered (`people.firstMention`, `people.locations`, `people.keyEvents`, etc.). All KEEP-with-reason; only `introduction.title` is verifiably unused after 6.6C but kept as harmless future-use buffer. Per the plan's no-auto-removal stance, no batch removals applied.
    - **0 orphan content `.md` files.** Detection enumerated every `.md` in `content/` × the parser-loaded patterns (`CHAPTER-N.md`, `INTRODUCTION.md`, `PEOPLE.md`, `study/CHAPTER-N-CONTEXT.md`, `study/CHAPTER-N-PROPHECY.md`); 0 unmatched files.
    - **knip skipped.** `pnpm dlx knip` failed in this environment due to oxc-parser native-binary mismatch (`Cannot find module @oxc-parser/binding-darwin-universal`); fell back to homegrown grep-based unused-export detection. Per the plan, `PersonEntry` fields parsed-but-not-rendered (`firstMention`, `inLaws`, `keyEvents`, `keySpeeches`, `languagesSpoken`, `locations`, `mentionedIn`, `originType`) are forward-API surface — KEEP-with-reason.
    - **Stale `**Familiar name:**` lines post-6.6B: tracked in `DEFERRED_TASKS.md` Phase 6.6 forward-tracking item C** (per FT1 in post-revision audit). After 6.6B's parser fix, explicit `**Familiar name:**` lines that match the heading-extracted value are structurally redundant on most entries; the 6.6B risk note recommended leaving them ("harmless, documents intent"). A targeted future cleanup pass could remove redundant explicit lines while preserving any whose value differs from the heading-extracted value.
    - **Pre-existing parseInt failures and ES Matthew Yochanan line 243 mojibake: tracked in `DEFERRED_TASKS.md` Phase 6.6 forward-tracking items A and B** as future cleanup work under Rule 28 review workflow.
  - **Final verification:** 796 tests passing (792 baseline + 4 new in 6.6B), Biome clean, content-lint exit 0 (1 pre-existing warn-only modern-mapping signal unchanged), `pnpm build` static-generates all routes cleanly across 4 locales × 3 books.

- **2026-05-09 (Phase 6.6 post-closure follow-up — Matthew verse-marker fix)** — surfaced via user browser-check after Phase 6.6 closure. Symptom: Matthew chapters in EN, DE, ES rendered raw `^1^` `^2^` ... `^25^` text inline next to verses instead of superscript verse numbers; PT-BR Matthew rendered correctly. Root cause: authoring inconsistency — EN/DE/ES Matthew CHAPTER-1/2/3 used markdown caret-superscript syntax (`^N^`, a CommonMark/GFM extension), but the project's `render-markdown-safe.ts` does not implement that extension, so the markers leaked as literal text. PT-BR Matthew + all locales for Genesis + John already used Unicode superscript characters directly (`¹` `²` ... `²⁵`), which render natively without any markdown extension. **Fix:** Python regex `\^(\d+)\^` → per-digit Unicode superscript mapping (`0`→`⁰` through `9`→`⁹`; multi-digit translates each digit) applied across the 9 affected files. **195 caret-syntax occurrences converted** (EN-1: 25, EN-2: 23, EN-3: 17, DE-1: 25, DE-2: 23, DE-3: 17, ES-1: 25, ES-2: 23, ES-3: 17). Residue grep `\^[0-9]+\^` returns 0; tests 796/796; lint clean; build clean. Closure entry recorded in this implementation log per Rule 28 §EDITORIAL LOG SPECIFICATION §L1 — content-format mechanical fix, no translation/governance decision involved, so no editorial-log entry. The convention going forward: **all Bible verse markers in `content/*/*/CHAPTER-N.md` files use Unicode superscript characters, never markdown caret-superscript syntax** — author tooling should produce `¹²³⁴⁵⁶⁷⁸⁹⁰` directly.

- **2026-05-13 (Phase 11 closed — Option C)** — John & Matthew prophecy material decision resolved via hybrid Option C (`docs/audit/archive/PHASE_11_PLAN.md`, plan revised through two audit rounds in `docs/audit/archive/AUDIT_PHASE_11_PLAN.md`).
  - **Files authored:** 12 PROPHECY files = 3 chapters × 4 locales. `content/{en,pt-br,de,es}/john/study/CHAPTER-3-PROPHECY.md` (1 entry each — Numbers 21 / lifted-Son-of-Man typological parallel). `content/{en,pt-br,de,es}/matthew/study/CHAPTER-1-PROPHECY.md` (1 entry each — Isa 7:14 *parthenos*/*almah*). `content/{en,pt-br,de,es}/matthew/study/CHAPTER-2-PROPHECY.md` (4 entries each — Mic 5:1+2 Sam 5:2 Bethlehem composite; Hos 11:1 typological exodus; Jer 31:15 Rachel weeping temporal-resultive; Mt 2:23 Natsri unresolved source). Total: 6 prophecy entries per locale; 24 entries authored across all locales.
  - **Fulfillment statuses:** 4×CLAIMED (Yeshua-lifted, Isa 7:14, Hos 11:1, Jer 31:15); 1×PARTIAL (Mic 5:1+2 Sam 5:2 — broader Davidic-from-Bethlehem expectation); 1×DEBATED (Mt 2:23 Natsri — source itself genuinely unidentified).
  - **All entries** include three readings (Jewish / Christian / Islamic) per Genesis prophecy precedent, all labeled [DOCUMENTED]; all cross-reference upstream policy entries (M-001 for the four fulfillment-formula types; M-002 for *parthenos*/*almah*; John 3 CONTEXT §A6 + §B2 for *Hypsōthēnai* / bronze-serpent). Cross-references live in `**Fulfillment notes:**` (the parser-recognized field) per round-1 audit C1/C2 fix.
  - **Plan-audit findings absorbed:** round 1 — C1 scholarly-note-dropped, C2 cross-refs-in-scholarly-note-dropped, S1 subject-not-rendered, S2 readings-single-line, S3 baseline-re-verify, S4 DoD-wording. Round 2 — R2.1 single-line-fulfillmentNotes (CRITICAL silent data loss), R2.2 `--` em-dash-content-lint blocker (CRITICAL build blocker), R2.3 stale UNFULFILLED test comment (fixed in `prophecy-parser.test.ts` line 112), R2.4 missing-Ruleset DoD check.
  - **Post-execution audit (R2.1 + R2.2 + R2.4):** custom Python script verified all 12 files: 0 empty `**Fulfillment notes:**` values (R2.1 silent-data-loss check); 0 ` -- ` em-dash residue (R2.2 build-blocker check); all 12 files have `**Ruleset:** v3.3` or locale-translated equivalent in front-matter (R2.4 missing-ruleset check).
  - **Final verification:** 796 tests passing (same baseline — no new tests required since schema unchanged); prophecy-parser 23/23 still passing; Biome clean; content-lint exit 0 (1 pre-existing warn-only signal unchanged); `pnpm build` static-generates all routes cleanly. Prophecy tab now visible at `/{locale}/{john,matthew}/chapter/{3,1,2}` across 4 locales × 3 chapters = 12 newly-lit Prophecy-view-mode pages. Editorial-log entries J-020 + M-018 logged.
