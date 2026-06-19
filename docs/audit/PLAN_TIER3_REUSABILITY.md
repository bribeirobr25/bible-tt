# Execution Plan — Tier 3: Reusability / God-File / Parser-Plumbing Consolidation

**Date:** 2026-06-19 · **Status:** ✅ EXECUTED 2026-06-19 — **WS1 done** (shared `<Disclosure>` at 9 sites; DOM-equivalent HTML across 10 pages × 4 locales, 0 diffs), **WS2 done** (extracted `people-fields.ts`; people-parser 948→560 lines; people-data snapshot identical), **WS3 dropped** (false-DRY per §13/§14). Gate green throughout (882 tests, lint, build, content:lint, conservation 11831). Previously APPROVED by external audit (`AUDIT_TIER3_REUSABILITY_PLAN.md`) for WS1+WS2. FIELD_LINE divergence is real-in-code but **latent in output** (verified by `pick()` simulation; my earlier "active" framing corrected). WS1 +10th site (app/people Sources) + className join unit-test (Minor 1) + per-site chevron table (Minor 2); WS2 +no-closure-over-loop-state DoD check (Minor 3). person-card `tt-person` stays separate. Awaiting project-lead go-ahead to execute (WS1 first). **Branch:** `content-multibook-expansion`. **Source:** `ARCHITECTURE_DRY_AUDIT.md` (UI Finding 1; DDD god-file finding; parser Findings 5/7) + `PENDING.md` (Tier 3). **Risk class:** LOW behavioral risk — **pure structural refactor, no behavior/content/value change**; the correct guard is **byte-identical rendered HTML (UI) / identical parse output (parsers)**, not resolved-values (Tier 2) or render output (Tier 1).

> Carries the Tier-1/2 learnings: (1) embed an empirical pre-validation grounded in source (§12 — the call-site variant matrix + duplication inventory); (2) pick the guard that matches the change class — here **rendered-HTML / parse-output equivalence**; (3) small, independently-gated, revertible steps; (4) locate by symbol/pattern, not line number; (5) external-audit + self-audit before execution.

---

## 0. Three independent workstreams

Tier 3 is **three unrelated refactors** that happen to be the remaining DRY items. They share no code and can be done in any order, as separate sessions, or as a subset. Recommended order by value/risk:

| WS | What | Why first/last | Risk |
|----|------|----------------|------|
| **WS1** | Shared `<Disclosure>` component (~8–10 `<details>` sites) | Biggest LOC win, highest visibility; do first | LOW (HTML-diff gated) |
| **WS3** | Shared parser plumbing (`FIELD_LINE`/headers/`SOURCE_LABELS`/`stripBlockquote`) | Mechanical; small | LOW (parse-output gated) |
| **WS2** | Split the 948-line `people-parser.ts` into focused modules | Largest; do last | LOW-MED (pure module move) |

Each WS below is self-contained: its own scope, guard, steps, rollback. **None changes content, resolved values, or rendered output** — all guards assert *equivalence*.

---

## WS1 — Shared `<Disclosure>` component

### Objective
Replace the hand-rolled `<details className="tt-details">` summary/chevron/body scaffold (duplicated across ~8 sites) with one `src/ui/shared/disclosure.tsx`, with **byte-identical rendered HTML** at every call site (so the global accordion behavior — CSS `details[name]` exclusivity + first-open + `.chev` rotation, all already single-sourced in `globals.css` — is untouched).

### Call-site inventory + variant matrix (measured 2026-06-19)
10 `<details>` across 9 files. They fall into two groups:

| Site | `name` | `open` | class extras | summary shape |
|------|--------|--------|--------------|---------------|
| `study/notes-view` (reading guide) | `notes-acc` | `open` | `max-w-[46rem] mx-auto` | simple: `<span>{title}</span>` + chev |
| `study/supplementary-section` | `notes-acc` | `firstOpen && i===0` | `scroll-mt-24` + `id` | simple |
| `enrichment/context-view` (outer) | `deeper-acc` | `si===0` | — | simple |
| `enrichment/introduction-view` | `intro-acc` | (varies) | — | simple |
| `shared/chapter-shell` (overview) | *(none)* | `open` | body `prose …` | simple |
| `enrichment/book-context-view` | `bg-acc` | `i===0` | — | **rich**: rendered title + chapters list |
| `prophecy/prophecy-view` | `prophecy-acc` | `open` | — | **rich**: title+ref + (badge + chev grouped) |
| `enrichment/context-view` (nested) | *(varies)* | — | — | **rich/nested** |
| `people/person-card` | `people-acc` | `open` | **`tt-person`** (not tt-details) | **rich**, different base class |

### API (covers the matrix)
```tsx
function Disclosure({
  name, open, id, className, summary, bodyClassName, chevron = true, children,
}: {
  name?: string; open?: boolean; id?: string;
  className?: string;        // appended after the base "tt-details"
  summary: React.ReactNode;  // slot — simple text OR a rich node
  bodyClassName?: string;    // appended after the base "body"
  chevron?: boolean;         // true → append <span class="chev">›</span> as last summary child
  children: React.ReactNode;
})
```
- **Simple group (5 sites):** `<Disclosure name=… open=… summary={t(title)}>…</Disclosure>` — `chevron` default appends the `›`.
- **Rich group (prophecy, book-context, context-view-nested):** pass the full custom summary node and `chevron={false}` where the chev is grouped with other elements (prophecy's badge+chev) so the component doesn't double-append. The component still owns the `tt-details` + `body` + `name`/`open` scaffold.
- **`person-card` (`tt-person`):** **out of WS1 scope** — distinct base class + profile-specific structure; folding it in would add a `base`-class prop for one site. Leave as-is; note in PENDING.

### Risk gates
| # | Risk | Mitigation |
|---|------|------------|
| W1-R1 | Rendered HTML drift (class order, attrs, chev placement) | **Byte-identical HTML diff** per page before/after (see guard); the CSS accordion is unchanged. |
| W1-R2 | Accordion exclusivity/first-open breaks (the `name=` groups) | Preserve each site's exact `name`/`open`; interaction check (one open at a time per door) via MCP or a DOM test. |
| W1-R3 | Rich-summary chev double/miss | `chevron={false}` for grouped-chev sites; HTML diff catches it. |
| W1-R4 | SSR `dangerouslySetInnerHTML` summaries (book-context rendered title) | Pass through unchanged as the summary slot; diff confirms. |

### Validation (the guard = rendered-HTML equivalence)
- **Baseline capture:** before any edit, curl every disclosure-bearing page across 4 locales (deeper, notes, background, introduction, chapter Read overview, people) → save normalized HTML of the `<details>` subtrees. After each conversion, re-curl and **assert byte-identical** (modulo nothing — must match).
- `pnpm test · lint · build · content:lint` green; conservation N/A (no content) but run it (must stay 11831).
- **MCP visual + interaction:** on a deeper page, confirm accordion still opens exclusively (open B closes A) and first item is open.

### Steps (one commit per group; revertible)
1. Create `disclosure.tsx` + a small render/DOM test (synthetic props → expected markup).
2. Convert the **5 simple sites**; HTML-diff each page = identical; gate.
3. Convert the **rich sites** (book-context, prophecy, context-view-nested) with `chevron={false}`; HTML-diff; MCP interaction check.
4. (Optional) bring `person-card`/`tt-person` in via a `base` prop, or leave + note.

---

## WS2 — Split `people-parser.ts` (948 lines, 25 top-level symbols)

### Objective
Decompose the largest parser into focused modules **with zero parse-output change** (pure module move). It mixes ~5 concerns: field-label alias resolution, origin/historicity enum coercion, genealogy/generation table parsing, the entry state machine, and final assembly.

### Proposed split (infrastructure layer, no public-API change)
- `people-fields.ts` — `EXACT_LABEL_ALIASES` + `resolveField` + `parseOriginType` + `parseHistoricityStatus` (the distinct single-copy enums, untouched).
- `people-tables.ts` — genealogy/generation table parsing (`parseTableRow`, `flushGenealogy`, generation parsing).
- `people-parser.ts` — the entry state machine + `finalizeEntry` + the public `parsePeopleMarkdown` (imports the two above).

Public export (`parsePeopleMarkdown`) unchanged → no consumer touched.

### Risk gates / validation (guard = identical parse output)
- **People-data snapshot** (like Tier-2's R1): snapshot `parsePeopleMarkdown` output for all 13 PEOPLE.md before the split; after, assert byte-identical.
- Existing `people-parser.test.ts` (58 tests) stays green — the per-fixture regression lock.
- **Conservation** unchanged (person / person-region counts + the people text multiset).
- `pnpm test · lint · build` green.

### Steps
1. Extract `people-fields.ts` (move + import); gate + people snapshot identical.
2. Extract `people-tables.ts`; gate + snapshot identical.
3. Leave the state machine in `people-parser.ts`; final gate. (Each step independently revertible.)

---

## WS3 — Shared parser plumbing (audit Finding 5/7)

### Objective
Extract the regexes/constants re-declared across the 5 parsers into one `src/infrastructure/content/shared/parse-helpers.ts`, **with identical parse output**:
- `FIELD_LINE` (`**Label:** value`) — ~5 copies (markdown, prophecy, book-context, people, enrichment inline).
- `H2`/`H3`/`H4` header regexes — ~4+ copies.
- `SOURCE_LABELS` (`source|fonte|quelle|fuente`) — 3 differing expressions (book-context array, enrichment regex, people inline).
- `stripBlockquote` (`line.replace(/^>\s*/, "")`) — repeated.
- (Finding 7) the warn-and-default pattern — already centralized for claim/confidence in `labels.ts`; fold any remaining.

**Caveat (executor must verify at execution):** the copies are *near*-identical but may differ subtly (e.g. trailing `\s*`, anchoring). For each, confirm the unified form matches every consumer's current behavior — or keep a per-consumer variant. The parse-output snapshot is the gate.

### Risk gates / validation (guard = identical parse output, all surfaces)
- **Full parse-output snapshot** across all content (extend the Tier-2 R1 approach to all parsed fields, not just claim/confidence) before/after = identical.
- **Conservation unchanged** (11831 units, every kind) — this is the strong content-loss guard for parser plumbing.
- All parser unit tests green; `lint`/`build` green.

### Steps
1. Create `parse-helpers.ts` with the unified regexes/constants + unit tests (each regex vs the variants it replaces).
2. Wire parsers one at a time, each: conservation + that parser's tests + snapshot identical, before the next.

---

## Cross-cutting

**DDD/DRY:** WS1 → `ui/shared`; WS2 → `infrastructure/content` (same layer, finer modules); WS3 → `infrastructure/content/shared`. No new dependency directions; all reduce duplication.

**Locate-by-symbol (Tier-1 learning):** target `<details className="tt-details"`, `parsePeopleMarkdown`, `FIELD_LINE`/`SOURCE_LABELS`/`stripBlockquote` — line numbers in this plan are indicative.

**Rollback:** every step is one revertible commit; no content edits, no schema, no migrations.

**Definition of done (per WS):** its guard passes (HTML-diff identical / parse snapshot identical / conservation unchanged) + full gate green + docs updated + production `main` untouched.

---

## Open questions for project-lead
1. **Do all three WS now, or a subset?** They're independent; WS1 is the highest-value/lowest-risk and a good standalone.
2. **WS1 — fold `person-card` (`tt-person`) into `<Disclosure>`** via a `base`-class prop, or leave it separate (recommended: leave; it's a distinct visual treatment)?
3. **WS3 scope** — include only the dual-label-adjacent helpers (`SOURCE_LABELS`, `stripBlockquote`) now and defer the `FIELD_LINE`/header unification, or do all of Finding 5 at once?

---

## 12. Pre-execution audit — empirical grounding (2026-06-19)

Grounded against source before sign-off (Tier-1/2 method):
- **WS1:** enumerated **10 `<details>` sites across 9 files**; confirmed the **simple (5) vs rich (4) + person-card** split and the distinct accordion `name` groups (`notes-acc`, `deeper-acc`, `bg-acc`, `intro-acc`, `prophecy-acc`, `people-acc`) — so exclusivity is per-door and must be preserved verbatim. The chevron literal appears in 8 files. The `<Disclosure>` API above is sized to cover every observed variant (name/open/id/class-extras/summary-slot/chevron-control); the byte-identical-HTML gate is what proves it.
- **WS2:** `people-parser.ts` is **948 lines / 25 top-level symbols** (already down from 1027 after Tier 2 removed its label logic) — still the largest parser; the split is a pure module move (public `parsePeopleMarkdown` unchanged).
- **WS3:** confirmed `SOURCE_LABELS` exists in ≥3 differing forms across parsers (book-context array vs enrichment regex vs people inline) — real duplication; the unified form must be behavior-verified per consumer (parse-output snapshot is the gate).
- **Risk class confirmed:** none of the three changes content, resolved values, or rendered output by design — every guard asserts *equivalence* (HTML / parse-output / conservation). This is why Tier 3 is lower-risk than Tier 1 (visible render change) or Tier 2 (content-meaning values), despite touching many files.

**Residuals for execution (cannot be closed statically):** the byte-identical HTML diffs (WS1), the people-data + full parse snapshots (WS2/WS3), the accordion interaction check, and the full gate — the executor's last-mile proof.

---

## 13. Self-audit addendum (2026-06-19) — plan corrected

Red-teamed against source (Tier-2 method). Findings, each verified:

### WS3 is largely a FALSE-DRY trap — DE-SCOPE to `SOURCE_LABELS` only (or drop)
The audit's parser Finding 5 over-stated the opportunity. Exact-comparing the "duplicated" regexes:
- **`FIELD_LINE` differs in code; the risk is LATENT (verified) — do NOT unify anyway.** markdown's `METADATA_LINE = /^\*\*(.+?):\*\*\s*(.+)$/` uses `(.+)`; prophecy/book-context/people use `(.*)`. Empty-value `**Label:**` lines *do* exist (~14 across `de/genesis/CHAPTER-9.md` + `CHAPTER-10.md`, incl. `**Gibbor-Kette:**` (ch10:534) and `**Wie der Text markiert ist:**`), and `extractMetadata` scans the **whole file**, so unifying to `(.*)` would add those as empty-value keys to its `meta` dict. **However**, parsed *output* does not change: `extractMetadata` keeps the first occurrence and `pick()` returns the first needle match, and the real valued metadata (top block) always precedes the empty-value body lines — verified by simulation on the strongest collision (`pick("gottesname")` vs `**Verteilung der Gottesnamen in Gn 9:**`): identical result under `(.+)` and `(.*)`. So the divergence is **real in code but latent in output**. **Do NOT unify `FIELD_LINE`** — divergent regexes, different empty-value semantics, zero benefit, and a fragile future-collision surface for no gain. *(Corrected after external audit: my earlier "active parse risk" framing was overstated; the example is real but the output is unchanged.)*
- **Header regexes are semantic coincidence, not duplication.** `/^## (.+)$/` appears 4× but as `SECTION_HEADER`/`ENTRY_HEADER`/`MOTIF_HEADER` (different meanings), and enrichment's is entirely different (`/^## ([A-Z])(?:_\w+)?\.\s+(.+)$/`). Sharing one generic `H2` constant would couple unrelated concepts — an anti-pattern. **Do NOT unify headers.**
- **`stripBlockquote` differs too:** markdown `/^>\s?/`, others `/^>\s*/`, enrichment also `/^>\s*/gm`. Not identical → unifying risks subtle change. **Verify or leave.**
- **`SOURCE_LABELS`** is the only genuinely-duplicated, same-purpose item (same 4 words: `source|fonte|quelle|fuente`, in 3 forms — book-context array, enrichment regex, people inline). **Safe to unify; this is the entire defensible WS3.**
- **Net:** reduce WS3 to a shared `SOURCE_LABELS` constant (+ derived regex), or drop WS3 as low-value. The original "5 FIELD_LINE + 4 header + stripBlockquote copies" framing is mostly coincidental-or-divergent regexes that should stay separate.

### WS1 refinements
- **10th site confirmed:** `src/app/[locale]/[book]/people/page.tsx` "Sources consulted" `<details>` (simple shape, in the `app/` layer) — include it; `ui/shared/disclosure` is importable from `app/`.
- **Accordion is pure native HTML+CSS** — `globals.css` `.tt-details[open] > summary .chev` + native `details[name]` exclusivity; **no JS controls `open` state** (verified). So `<Disclosure>` only needs to preserve `name`/`open`/`className`/`.chev`/`.body` markup — no state machine to replicate. Strengthens W1-R2.
- **className byte-identical gotcha (W1-R5, new):** naively templating `` `tt-details ${className ?? ""}` `` emits a trailing space (`class="tt-details "`) that FAILS the byte-identical gate. The component must conditionally join (`[base, className].filter(Boolean).join(" ")`) — same for `body`/`bodyClassName`. The HTML-diff gate catches this.

### WS2 confirmed feasible
`people-parser` functions are mostly pure with explicit args (`parseTableRow(line)`, `resolveField(label)`, `parseOriginType`/`parseHistoricityStatus(raw)`, `flushGenealogy(...)`); the mutable `ParseState` is confined to the entry loop. The split is a clean module move; executor verifies `flushGenealogy`'s signature doesn't close over state.

### Completeness — audit items NOT covered by Tiers 1–3 (tracked, not dropped)
These remain open after Tiers 1–3 + this Tier-3 (they're smaller/independent; **Tier 4 / low-priority**):
- **UI Finding 5:** `<Disclaimer>` / `<SourceLine>` helpers (`tt-disclaimer` + `className="src"` repeated across context-view/book-context-view/introduction-view/enrichment-entry/person-card); route `BookContextView` motifs through `EnrichmentEntryCard`.
- **UI Finding 6:** one `NOTE_TYPE_TOKENS` map shared by the notes legend + `NoteBlock` (note-type→color defined twice).
- **DDD-Low:** `person-card` `parseCrossBookSlug` (emit `crossBookSourceBook` from the parser instead); `people/page.tsx` blockquote cleanup → parser; `chapter-shell` short-status → derived field.
- **Tier-4 content pass:** the ~120 redundant `Name (Name)` (PENDING §5).

**Verdict:** WS1 (with the 10th site + className note) and WS2 are sound. **WS3 should be cut to `SOURCE_LABELS` or dropped** — the self-audit shows most of it is false-DRY that would risk parse-output changes. The plan's guards (HTML-diff, parse snapshot, conservation) would catch any such change, but it's better to not attempt the divergent unifications at all.

---

## 14. External audit applied (2026-06-19)

External audit (`AUDIT_TIER3_REUSABILITY_PLAN.md`): **APPROVE WS1 + WS2; endorse the WS3 de-scope.** It verified the technical basis against source (FIELD_LINE divergence real, headers coincidental, stripBlockquote divergent, only SOURCE_LABELS safe; WS1 10-site inventory + className gotcha + native accordion; WS2 clean module move). Findings, each re-verified against source before accepting:

1. **Finding 1 — FIELD_LINE risk reclassified ACTIVE → LATENT (auditor substantially right; example dispute resolved).** The auditor read ch9 + ch11 and concluded the empty-value lines don't exist and the risk is latent. Verification: (a) the example **does** exist — `**Gibbor-Kette:**` is in **CHAPTER-10** (which the auditor did not read), and there are ~14 empty-value `**Label:**` lines across ch9/10; so "the cited example doesn't exist" is incorrect. (b) **But the auditor's core point is right:** simulating `extractMetadata`/`pick()` under `(.+)` vs `(.*)` shows **no parsed-output change** (first-occurrence-wins + real metadata precedes the body empty-value lines; the `pick("gottesname")` collision candidate returns the same value both ways). So my "active parse risk" framing was overstated → corrected to **latent in output, real in code** (§13). The de-scope decision is unaffected and stands.
2. **Minor 1 — accepted:** add a `<Disclosure>` step-1 **component unit test** asserting `className` join is exact (no `className` → `class="tt-details"`; `className="x"` → `class="tt-details x"`; same for `bodyClassName`) — catch the trailing-space gotcha before per-page diffs.
3. **Minor 2 — accepted:** before converting, write a **per-site chevron decision table** (component-appended vs summary-embedded): simple + book-context = `chevron` appended; prophecy = `chevron={false}` (grouped with badge). A wrong choice is a byte-diff.
4. **Minor 3 — accepted:** WS2 definition-of-done adds an explicit review step — **no extracted helper references a symbol from the entry-loop scope** (`state`/`seenSlugs`); `flushGenealogy` must take them as explicit args.
5. **Q1/Q3 — WS3 → drop-or-fold:** both audits agree WS3 is marginal even at `SOURCE_LABELS`-only. Recommendation: **drop WS3** (or fold the one `SOURCE_LABELS` constant into the WS2 session); do not unify FIELD_LINE/headers/stripBlockquote.
6. **Q2 — leave `person-card`/`tt-person` separate** (distinct base class; a `base`-prop for one site isn't worth it).

**Net:** execute **WS1 standalone first** (HTML-diff gated; +the Minor-1/2 items), **WS2** second (people-data snapshot + 58 tests + conservation + Minor-3 review step), **drop/fold WS3**. Status → APPROVED (WS1+WS2); awaiting project-lead go-ahead.
