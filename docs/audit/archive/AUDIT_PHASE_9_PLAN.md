# Audit of `PHASE_9_PLAN.md` (Book Context Page — Cross-Chapter Motifs)

**Date:** 2026-05-14
**Auditor:** Claude Opus 4.7 (independent review)
**Scope:** `docs/audit/archive/PHASE_9_PLAN.md` — 12 new content files (3 books × 4 locales), new domain type + parser + UI component + page replacement; ~32–47h estimate (Option A canary).
**Method:** Verified plan claims against: `src/app/[locale]/[book]/context/page.tsx` (placeholder confirmed), `src/ui/enrichment/enrichment-entry.tsx` (EnrichmentEntryCard props + type system), `src/ui/enrichment/context-view.tsx` (sibling pattern), `src/domain/content/types.ts` (existing ClaimType union and type model), `src/lib/content-loader.ts` (extension pattern), `src/infrastructure/content/fs-content-repository.ts` (readXxx patterns), `docs/editorial-log/john.md` (J-entry numbering).
**Status:** Plan has one critical execution blocker (TypeScript type mismatch that prevents `pnpm build`), three significant concerns, and several minor issues. Strategic direction is correct; code infrastructure design needs one key correction before step 9.4.

---

## 1. Executive Summary

The plan's strategic direction is right: the Book Context surface is a genuine gap, cross-chapter motifs are the correct content primitive for a book-level view, Option A canary is the correct execution model, and Option A flat schema (`motifs[]`) is the right data shape for the count. The step sequencing (code-first at steps 9.4–9.8, then canary at 9.9, then project-lead gate at 9.10 before locale fan-out) is correct discipline.

Most plan claims verify correctly against the actual codebase:

- **`context/page.tsx` is confirmed as a placeholder** (`{t("nav.comingSoon")}`) ✓
- **`EnrichmentEntryCard` exists** at `src/ui/enrichment/enrichment-entry.tsx` ✓
- **`content-loader.ts` extension pattern** (`getPeopleData`, `getProphecyData`) is the right template for `getBookContextData` ✓
- **`fs-content-repository.ts` extension pattern** (`readPeople`, `readProphecy`) is the right template for `readBookContext` ✓
- **`BookContextData` does not yet exist** in `types.ts` — plan correctly requires adding it ✓
- **CONTEXT.md file path** (`content/{locale}/{book}/CONTEXT.md`) is consistent with PEOPLE.md and INTRODUCTION.md patterns ✓

However, the plan contains one critical design gap that would cause `pnpm build` to fail, and three significant concerns that need resolution before step 9.4 begins.

---

## 2. Verification Table

| Plan claim | Verification result | Notes |
|---|---|---|
| `context/page.tsx` is a "Coming soon" placeholder | ✓ Verified | `{t("nav.comingSoon")}` confirmed |
| `EnrichmentEntryCard` at `src/ui/enrichment/enrichment-entry.tsx` | ✓ Verified | Confirmed; takes `{ entry: EnrichmentEntry }` |
| `EnrichmentEntryCard` can receive `BookContextMotif` directly | ✗ **CRITICAL.** | `EnrichmentEntry.claimType: ClaimType` (strict union). `BookContextMotif.claimType: string` is not assignable to `ClaimType`. TypeScript error blocks build. See §3.1. |
| `BookContextMotif` proposed claimTypes "STRUCTURAL", "LINGUISTIC", "TYPOLOGICAL", "NARRATIVE" | ✗ **Not in `ClaimType` union.** | `ClaimType` in `types.ts` has 8 members, none of these. Passing them to `EnrichmentEntryCard` fails type-check. See §3.1. |
| `context-view.tsx` ("sibling pattern to mirror") | ✓ Verified, with caveat | Exists; handles section-grouped `EnrichmentData` — structurally different from flat motif list. See §5.1. |
| `fs-content-repository.ts` extension with `readBookContext` | ✓ Pattern exists | `readPeople` / `readProphecy` are correct templates |
| `content-loader.ts` extension with `getBookContextData` | ✓ Pattern exists | `getPeopleData` / `getProphecyData` are correct templates |
| `BookContextData` absent from `types.ts` | ✓ Verified | Not present — plan correctly adds it |
| `slug` field — "Extracts slug from heading" (test case 3) | ✗ **Derivation unspecified.** | No `**Slug:**` field in markdown schema. Parser must auto-derive from title. Derivation algorithm undocumented. See §3.2. |
| Editorial-log: J-024 (John Phase 9) | ✗ **Speculative.** | john.md ends at J-021 (Phase 10 closure). J-022/J-023 depend on Phase 8 + Phase 11.5 execution before Phase 9. See §3.3. |
| Editorial-log: M-021 (Matthew Phase 9) | ✗ **Speculative.** | Not independently verified. See §3.3. |
| `sortByConfidence` / motif ordering | ✗ **Unresolved.** | Plan says "preserve authoring order" (test case 10). But `book-context-view.tsx` design doesn't specify. If `ContextView` pattern is reused, confidence sorting overrides. See §3.4. |
| Diagnostic grep `^### A[0-9]+\.` | ✓ Valid for verified files | John 2 entries use `### A1.` format. Pattern correct for existing files. See §5.2 for edge case. |
| Content-lint §0.2 (em-dash) covers CONTEXT.md | ✓ Via `$CONTENT_DIRS` | Recursive grep covers `content/{locale}/{book}/CONTEXT.md` |
| Content-lint §0.7 (leftover TT H2) covers CONTEXT.md | ✗ **Not covered.** | `$PEOPLE_FILES` hardcoded list doesn't include CONTEXT.md. See §4.1. |
| Illustrative motif: "Hour has not yet come — Jn 2, 7+" | ✗ **Contradicts §3 scope rule.** | §3 scope says "cite only chapters within currently-authored range (Jn 1–3)." Jn 7+ is out of scope. See §5.3. |
| CONTEXT.md path consistent with PEOPLE.md/INTRODUCTION.md | ✓ Verified | `content/{locale}/{book}/CONTEXT.md` — consistent |
| Test baseline 801 + 8 = 809+ | ✓ Plausible, with caveat | Depends on Phase 11.5 execution before Phase 9. Verify at step 9.4 pre-check. |

---

## 3. Critical and Significant Findings

### 3.1 `BookContextMotif.claimType: string` creates a TypeScript build error when reusing `EnrichmentEntryCard` [CRITICAL — EXECUTION BLOCKER]

The plan's §5.1 proposes:

```typescript
export interface BookContextMotif {
  claimType: string; // "TEXTUAL" | "STRUCTURAL" | "LINGUISTIC" | "TYPOLOGICAL" | "NARRATIVE" | "HISTORICAL / ARCHAEOLOGICAL"
  ...
}
```

And the Q4 recommendation says: "Reuse `EnrichmentEntryCard` directly."

**Verified against `enrichment-entry.tsx`:**

```typescript
export function EnrichmentEntryCard({ entry }: { entry: EnrichmentEntry }) { ... }
```

And `EnrichmentEntry`:
```typescript
export interface EnrichmentEntry {
  claimType: ClaimType; // strict union — 8 members
  ...
}
```

And `ClaimType`:
```typescript
export type ClaimType =
  | "TEXTUAL" | "STRONG INFERENCE" | "POSSIBLE INFERENCE"
  | "COMPARATIVE PARALLEL" | "LATER RECEPTION"
  | "HISTORICAL / ARCHAEOLOGICAL" | "SCIENTIFIC COMPARISON" | "SPECULATION";
```

**The problem:** `BookContextMotif.claimType: string` is NOT assignable to `EnrichmentEntry.claimType: ClaimType`. TypeScript will error when any code passes a `BookContextMotif` (or any object with `claimType: string`) to `EnrichmentEntryCard`. This blocks `pnpm build`.

Additionally, `CLAIM_COLORS` and `CLAIM_TYPE_KEYS` in `enrichment-entry.tsx` are `Record<ClaimType, string>` — exhaustive records keyed on the 8 existing ClaimType members. Values like "STRUCTURAL", "LINGUISTIC", "TYPOLOGICAL", "NARRATIVE" would fall through the record lookup (handled by `|| CLAIM_COLORS.TEXTUAL` runtime fallback, but caught at compile time by TypeScript's exhaustiveness checking if `ClaimType` were extended).

**Three viable paths — plan must pick one:**

**Path A (Recommended): Restrict `BookContextMotif.claimType` to the existing `ClaimType` union.** Map motif claim types to existing union members:
- "STRUCTURAL" → "TEXTUAL" (structural features of the source text)
- "LINGUISTIC" → "TEXTUAL" (language-level features)
- "TYPOLOGICAL" → "COMPARATIVE PARALLEL" (cross-text interpretive pattern)
- "NARRATIVE" → "STRONG INFERENCE" (inferred from narrative structure)

This requires zero changes to `ClaimType`, `CLAIM_COLORS`, `CLAIM_TYPE_KEYS`, or `enrichment-entry.tsx`. `BookContextMotif.claimType: ClaimType` type-checks cleanly. Motifs can be passed to `EnrichmentEntryCard` via a simple adapter: `{ title, claimType, confidence, content, source }`. The semantic granularity is lower than the plan implies, but the display is consistent with the rest of the app.

**Path B: Extend `ClaimType` with motif-specific values.** Add "STRUCTURAL", "LINGUISTIC", "TYPOLOGICAL", "NARRATIVE" to the union. Requires updating:
- `types.ts` `ClaimType` union (add 4 members)
- `enrichment-entry.tsx` `CLAIM_COLORS` record (add 4 color entries)
- `enrichment-entry.tsx` `CLAIM_TYPE_KEYS` record (add 4 i18n key entries)
- `enrichment-parser.ts` `parseClaimType()` (add 4 dispatch branches)
- 4 locale i18n message files (add `claimType.structural`, `claimType.linguistic`, `claimType.typological`, `claimType.narrative` keys)

More code changes than the plan implies in "Reuse `EnrichmentEntryCard` directly." Not a blocker if the plan accepts the scope, but Path A is simpler.

**Path C: Create a `MotifCard` variant** (the Q4 alternative). Avoids the type mismatch by using a component that accepts `BookContextMotif` directly. Defers the claimType mapping decision. Higher code cost; may be more honest about the long-term design.

**Required fix:** The plan must resolve this in the §6 Q4 decision or add a sub-decision to step 9.4. The current plan's combination of "claimType: string" + "Reuse EnrichmentEntryCard" is internally contradictory and will block compilation.

### 3.2 `slug` derivation is unspecified — test case 3 ("Extracts slug from heading") has no implementation spec

The plan's `BookContextMotif.slug` field (e.g., "toledot-spine") appears in §5.1 but the markdown schema in §5.2 shows no explicit `**Slug:**` field. The parser test case 3 says "Extracts slug from heading" — implying the slug is auto-derived from the `## 1. Toledot spine` heading text.

But the derivation algorithm is not documented:
- Remove the leading number (`1. ` → truncate)?
- Lowercase + hyphenate: `"Toledot spine"` → `"toledot-spine"`?
- Strip special characters (italics, parentheses, Hebrew): `"The *eretz* semantic shift"` → `"the-eretz-semantic-shift"` or `"eretz-semantic-shift"`?
- Handle collisions (two motifs with similar titles)?

For the parser test suite to be well-specified, the derivation algorithm must be documented. Without it, test case 3 has no basis for the expected output.

**Suggested approach:** Document the derivation as: strip the leading `N. ` prefix, lowercase the remainder, replace non-alphanumeric characters with hyphens, collapse multiple hyphens, trim leading/trailing hyphens. For the example `## 1. The *eretz* semantic shift`, the markdown rendering strips `*` → `"The eretz semantic shift"` → slug `"the-eretz-semantic-shift"`. If the slug is only used as a React `key` (not in URLs), collisions are low-risk; note this in the parser spec.

**Required fix:** Add the slug derivation algorithm to §5.2 parser design or §5.3 test cases. Update test case 3 with a concrete input/expected-output pair.

### 3.3 Editorial-log entry numbers J-024 (John) and M-021 (Matthew) are speculative and depend on unconfirmed phase execution order [SIGNIFICANT]

john.md ends at J-021 (Phase 10 closure, 2026-05-14). Between J-021 and the Phase 9 John entry (which the plan calls J-024), three entries must be authored:

- **J-022:** Phase 8 John (Section I coverage audit) — Phase 8 has not yet executed.
- **J-023:** Unknown — possibly Phase 11.5 John (if the `scholarlyNote` fix creates a John-specific editorial-log entry), or another not-yet-planned entry.

The plan's J-024 assignment implicitly assumes both J-022 and J-023 are authored before Phase 9 begins. If Phase 8 doesn't create a John editorial-log entry (because Phase 8 canonies on a Genesis chapter), J-023 would be Phase 9 — making the Phase 9 John entry J-022 or J-023, not J-024.

Similarly, M-021 for Matthew depends on M-019 (Phase 11.5? or Phase 8 canary?) and M-020 being authored first.

**Required fix:** Remove hardcoded entry numbers from steps 9.17. Replace with: "Verify the current last entry in `docs/editorial-log/john.md` (currently J-021) and `docs/editorial-log/matthew.md` before authoring Phase 9 entries. J-number = last_J + 1 at the time of authoring."

### 3.4 `sortByConfidence` vs. authoring-order — `book-context-view.tsx` design leaves this unresolved [SIGNIFICANT]

The plan's parser test case 10 says "Preserves order of motifs as written." But the UI component design is not specified.

Looking at `context-view.tsx`:
```typescript
{sortByConfidence(section.entries).map((entry, i) => (
  <EnrichmentEntryCard key={`${section.id}-${i}`} entry={entry} />
))}
```

The chapter-level Context view sorts entries by confidence (VERIFIED → PROBABLE → POSSIBLE → ...). If `book-context-view.tsx` mirrors this pattern, authoring order is overridden — the *toledot* motif (VERIFIED) would always render before a narrative motif (POSSIBLE), regardless of which the project lead wants to surface first.

For chapter Context entries, confidence sorting makes sense — the reader sees the most certain information first. For cross-chapter motifs, the editorial ordering likely matters more: the author may want to surface the most structurally significant motifs first (e.g., *toledot* spine before wife-sister episodes), regardless of confidence level.

**Required fix:** Step 9.6 (UI component) should explicitly specify: "Render motifs in authoring order — do NOT apply `sortByConfidence`. The ordering in CONTEXT.md is the editorial ordering; confidence labels are informational."

---

## 4. Significant Concerns

### 4.1 Content-lint §0.10 (modern-mapping smell-test) doesn't cover CONTEXT.md files — §0.7/§0.8 are PEOPLE.md-specific and correctly excluded

Verified against `scripts/content-lint.sh`:

**Rules that cover CONTEXT.md** (via `$CONTENT_DIRS` recursive `-rEn` grep over directories):
- §0.1 (stale ruleset stamps) ✓ — `$CONTENT_DIRS` includes `content/{locale}/{book}/`, recursive scan covers CONTEXT.md
- §0.2 (em-dash residue) ✓ — same `$CONTENT_DIRS` scope

**Rules that are PEOPLE.md-specific** and do NOT need to cover CONTEXT.md:
- §0.7 (`^## The Transparent Translation` leftover heading) — this is the specific PEOPLE.md Phase 1A artifact pattern. CONTEXT.md uses `## 1. Motif title` format; this rule is not relevant.
- §0.8 (heading collision: `## Translit (Translit)`) — this is the PEOPLE.md convention where transliterated and familiar forms coincide. Not applicable to CONTEXT.md H2 motif headings.

**The genuine gap — §0.10 (modern-mapping smell-test) uses `$PEOPLE_FILES` only:**

```bash
check_pattern_warn "0.10" "Modern-mapping smell-test in PEOPLE.md (anti-ethnogenesis review)" \
  "\b(Russia|Europe|Africa|Asia|Slavic|Aryan|Caucasian|Hamitic|Japhetic peoples|Semitic peoples)\b" \
  "$PEOPLE_FILES"
```

`$PEOPLE_FILES` is a hardcoded list of PEOPLE.md files only. The Genesis CONTEXT.md motifs will include entries about *toledot* genealogies, neighboring peoples (Canaan, Egypt, Mesopotamia), and ethnic/geographic groups. These are prime candidates for the kind of modern-mapping language the anti-ethnogenesis safeguard protects against. The John CONTEXT.md motifs (Yehudim light/darkness contrast) may also touch on group identity language. §0.10 as currently scoped will silently miss all of this in CONTEXT.md files.

**Suggested:** Add to step 9.17 (closure): "Extend content-lint.sh §0.10 to also check CONTEXT.md files. Add a `$CONTEXT_FILES` variable listing all 12 `content/{locale}/{book}/CONTEXT.md` paths and include it in the §0.10 `check_pattern_warn` call. §0.1 and §0.2 already cover CONTEXT.md via recursive `$CONTENT_DIRS` — no change needed for those rules."

### 4.2 Illustrative motif "Hour has not yet come — Jn 2, 7+" contradicts §3's scope rule

Plan §3 out-of-scope states: "motif entries cite ONLY chapters within the currently-authored range (Gen 1–12, Jn 1–3, Mt 1–3)."

Plan §4.4 illustrative John motifs include:
> `Jn — "Hour has not yet come" — Jn 2, 7+ — narrative (Jn 2 first; **forward-pointers**)`

Jn 7 is outside the authored range Jn 1–3. The plan acknowledges this by parenthetically noting "forward-pointers" — but this contradicts the scope rule. If forward-pointers to unwritten chapters are allowed in the illustrative list, the scope rule needs to explicitly carve out this case.

**Two options:**
1. **Restrict the motif to Jn 1–3 occurrence only.** "Hour has not yet come" is first introduced in Jn 2:4. The motif entry discusses that Jn 2's "my hour has not yet come" is the opening statement of a recurring trajectory, with a cross-reference note that the hour arrives in Jn 12 (currently unwritten). This is fine and doesn't require listing Jn 7 in `chapters: [7]`.
2. **Explicitly allow forward-pointer annotations in motif body text.** Keep `chapters: [2]` (the authored chapter) and mention Jn 7/12/17 in the body text as future trajectory. The `chapters` field then strictly records authored chapters where the motif appears, not every chapter where it might appear eventually.

**Suggested:** Option 2. Update §5.1 to document: "`chapters: number[]` lists only chapters within the currently-authored range where the motif substantively appears. Forward-trajectory notes belong in the motif body text, not in the chapters array." Remove "Jn 7+" from the illustrative motif's chapter list.

---

## 5. Minor Issues

### 5.1 "Sibling pattern to mirror" framing for `book-context-view.tsx` is imprecise

The plan cross-references `context-view.tsx` as the "sibling pattern to mirror" for `book-context-view.tsx`. But `context-view.tsx` renders section-grouped `EnrichmentData` with `<details>` accordion elements, each section containing multiple entries sorted by confidence. `book-context-view.tsx` renders a flat `BookContextMotif[]` list with no section grouping.

The structural differences are significant:
- No `<details>` accordion needed (motifs are top-level, each worth its own visible card)
- No section taxonomy (no SECTION_ICONS, no SECTION_ORDER, no section count badge)
- No confidence sorting (authoring order per §3.4 fix)
- The `EnrichmentData.disclaimer` wrapper may or may not be appropriate for motifs (the CONTEXT.md has its own disclaimer block)

`context-view.tsx` is a useful reference for how `EnrichmentEntryCard` is used, but describing it as a "sibling pattern" implies more structural similarity than exists. Step 9.6 should clarify: "Reference `context-view.tsx` for `EnrichmentEntryCard` usage pattern, but do NOT mirror its section-grouping, accordion, or confidence-sort structure."

### 5.2 Diagnostic grep may miss §A entries with non-numbered headers

The diagnostic command:
```bash
grep -E "^### A[0-9]+\\." "$ch"
```
...matches entries like `### A1. Title`. From the John 2 CONTEXT.md read in this audit, the entries use `### A1.`, `### A2.` etc. — the numbered format is confirmed for that file.

However, the template at `docs/templates/contextual-companion-template.md` shows `### [Feature title]` (no letter-number prefix). If any companion file uses unnumbered entries like `### Creation-by-speech motif` (without the `A1.` prefix), the grep misses them.

This is a diagnostic tool, not a correctness check — false negatives produce an incomplete candidate list, not an incorrect one. But the plan should note: "The grep detects cross-chapter recurrence only for §A entries using the `### A{N}.` numbered format. Any unnumbered §A entries are not detected by this diagnostic; a supplementary manual scan of §A sections is recommended."

### 5.3 Test baseline and `pnpm test` DoD: 801 + 8 = 809+ assumes Phase 11.5 has shipped

The DoD says "`pnpm test` passes (801 + 8 = 809+)." The 801 baseline itself was the Phase 11.5 pre-execution baseline. If Phase 11.5 added parser tests (AUDIT_PHASE_11_5_PLAN §4.3 recommended 4–6 new tests, not 2), the current baseline could be 803–807, not 801.

**Suggested:** Add to step 9.4 pre-execution: "Run `pnpm test` to establish the actual current baseline before writing Phase 9 parser tests. Use that count as the base for the '+ ≥ 8' target."

### 5.4 i18n keys: `nav.bookContext` and `nav.bookContextDescription` already exist

The page currently calls `t("nav.bookContext")` and `t("nav.bookContextDescription")` — these i18n keys must already exist in all 4 locale files (the page wouldn't compile otherwise). Phase 9 needs to add NEW keys for motif-specific UI labels (e.g., `bookContext.chapters`, `bookContext.disclaimer`, `bookContext.motifCount`, `bookContext.comingSoon`), not the navigation labels.

The plan's §3 says "i18n labels: new keys in 4 locale message files for 'Cross-chapter motifs', section headings, etc." but should explicitly clarify which keys are NEW (motif-specific) vs. which already exist (nav labels).

**Suggested:** Add to §8 (conventions) or step 9.8: "New i18n keys required: at minimum `bookContext.disclaimer` (the about-this-surface text), `bookContext.chapters` (label for the chapter list), and any motif-view-specific labels needed by `book-context-view.tsx`. The navigation keys `nav.bookContext` and `nav.bookContextDescription` already exist and do not need to be added."

### 5.5 `EnrichmentEntryCard` renders markdown in `entry.content` via `renderMarkdownSafe` — motif body text should be markdown-safe

`EnrichmentEntryCard` renders `entry.content` via:
```jsx
<div dangerouslySetInnerHTML={{ __html: renderMarkdownSafe(entry.content, "note") }} />
```

This means motif body text (the `body` field in `BookContextMotif`, which becomes `content` in the adapted `EnrichmentEntry`) will be rendered as markdown. This is the correct behavior — motifs will have italicized source terms, bold, etc. But the plan should document this explicitly in §8 conventions: "Motif body text is rendered as markdown via `renderMarkdownSafe`. Use `*italics*` for source-language terms, `**bold**` for emphasis. Em-dash convention applies. Do NOT use markdown link syntax `[text](url)` — links are not rendered by `renderMarkdownSafe`."

(This is the same constraint established in AUDIT_PHASE_11_PLAN §4.2 for `fulfillmentNotes` — but motif body renders WITH markdown, unlike `fulfillmentNotes`. The distinction matters for authors.)

---

## 6. What Works Well

- **Strategic decision to build Book Context now** is correct. With People, Prophecy, Introduction, and Section I all authored or underway, the book-level cross-chapter surface is the natural next step.
- **Option A flat schema (`motifs: BookContextMotif[]`)** is right for the scale (8–12 motifs per book). Section-grouping would add UI complexity without information gain.
- **Option A canary + propagation** execution model with Genesis EN first is well-reasoned. Genesis has the richest motif material and the project lead is most familiar with the content.
- **Option A canary checkpoint at step 9.10** (project-lead gate after Genesis EN) is the right structural discipline. Schema issues surface before 24 locale translations are committed.
- **Code-first sequencing (steps 9.4–9.8 before any content)** is correct. Parser + tests + UI verified working before authoring begins — matches the Phase 11 discipline.
- **Parser test cases (§5.3)** cover the important edge cases: missing-file null return, disclaimer block skipped, multiple motifs, optional source field.
- **Three-input motif-candidate methodology** (editorial-log → recurring §A → recurring §F/H) is a principled prioritization that anchors motif selection in prior project-lead-vetted decisions.
- **Null fallback on context page** — books without CONTEXT.md render the existing "Coming soon" placeholder. Zero regression risk during Phase 12 when new chapters are added before their CONTEXT.md is updated.
- **Cross-reference structure ("what's new about reading across chapters")** is identified as the key value-add of motif entries vs. duplicate chapter companion content. This is the right framing.
- **Risk table is comprehensive** — the "authored entries duplicate §A entries" risk (High likelihood, Medium impact) correctly identifies the main quality risk.
- **§5.3 test case 8** ("Returns null for missing/unreadable file") mirrors the null-safety pattern used in all other parsers. ✓
- **`readPeople` pattern** in `fs-content-repository.ts` is the exact right template for `readBookContext`. ✓

---

## 7. Required Conditions Before Execution

In priority order:

1. **Resolve the `claimType` type mismatch (§3.1) before step 9.4.** This is the only true execution blocker. The plan must pick one path (A: restrict to existing `ClaimType`; B: extend `ClaimType`; C: new `MotifCard` component) and document the approach in the Q4 answer or a new Q5 at step 9.3. Path A (use existing `ClaimType` union with semantic remapping) is recommended as the lowest-friction option.

2. **Document slug derivation algorithm (§3.2) in §5.2 or §5.3.** Without this, test case 3 has no specified expected output, and the parser implementation will be underspecified.

3. **Remove hardcoded J-024 and M-021 from step 9.17 (§3.3).** Replace with "verify current last entry before authoring." Add dependency note: Phase 8 John/Matthew editorial-log entries (J-022, M-019?) and any Phase 11.5 entries must be authored before Phase 9 entries receive their ID numbers.

4. **Specify authoring-order vs. confidence-sort in step 9.6 UI design (§3.4).** Explicitly state that `book-context-view.tsx` renders motifs in authoring order (no `sortByConfidence`).

5. **Fix illustrative motif "Hour has not yet come — Jn 2, 7+" (§4.2).** Remove Jn 7+ from the chapter list; restrict `chapters[]` to authored range. Update §5.1 doc to clarify that forward-trajectory references belong in body text, not `chapters` array.

6. **Add content-lint `$CONTEXT_FILES` note to step 9.17 for §0.10 (§4.1).** The 12 new CONTEXT.md files should be added to the `§0.10` modern-mapping smell-test check after authoring completes. `§0.1` and `§0.2` already cover CONTEXT.md via `$CONTENT_DIRS` recursive scan — no change needed for those.

7. **Add test baseline verification to step 9.4 pre-check (§5.3).** Run `pnpm test` and record actual count before writing Phase 9 parser tests.

---

## 8. Recommendation

**Approve after items 1–5 are addressed.** Item 1 (type mismatch) is the only build-blocking issue; the other four are specification gaps that would cause authoring errors or schema confusion during step 9.4–9.6 execution. Items 6–7 are improvements for the DoD and meta-doc sync step.

The plan is well-conceived and the execution model is sound. The code infrastructure work (steps 9.4–9.8) is well-sequenced with the canary checkpoint (step 9.10) as the right quality gate before locale fan-out. After the type mismatch is resolved, this is the cleanest new-surface phase since Phase 10 (PEOPLE.md).

No Lock Protocol question applies — Phase 9 adds no rule changes. The code changes (new domain type, new parser, new UI component, page replacement) are additive and isolated. The null-fallback pattern ensures zero regression risk for the existing app during partial authoring states.

---

**Audit complete (round 1).** Claims verified against `context/page.tsx`, `enrichment-entry.tsx`, `context-view.tsx`, `types.ts`, `content-loader.ts`, `fs-content-repository.ts`, and `editorial-log/john.md`.

---

## Post-Verification Checks (2026-05-14)

After round-1 audit, verified two additional sources: `src/infrastructure/i18n/messages/en.json` (i18n key landscape) and `scripts/content-lint.sh` (exact rule coverage). Three findings, one correction to round-1.

### PV.1 §4.1 corrected — §0.7/§0.8 are PEOPLE.md-specific; §0.10 is the real gap

Verified `content-lint.sh` directly. `§0.1` (stale stamps) and `§0.2` (em-dash) use `$CONTENT_DIRS` with `grep -rEn` — recursive, covers `content/{locale}/{book}/CONTEXT.md`. No gap for these rules. `§0.7` (leftover `## The Transparent Translation` H2) and `§0.8` (`## Translit (Translit)` heading collision) are PEOPLE.md-specific patterns that don't apply to CONTEXT.md's `## N. Motif title` format. §4.1 updated in round-1 to reflect this. The genuine gap is `§0.10` (modern-mapping smell-test), which uses `$PEOPLE_FILES` (hardcoded list) and will miss motif entries about neighboring peoples in Genesis and John CONTEXT.md files.

### PV.2 §5.4 confirmed — `nav.bookContext`, `nav.bookContextDescription`, `nav.comingSoon` all exist

Verified in `en.json`:
- `"bookContext": "Book Context"` ✓
- `"bookContextDescription": "A panoramic view of the most significant scholarly, historical, and textual topics across all chapters."` ✓
- `"comingSoon": "Content coming soon."` ✓

The plan's §5.4 finding is confirmed: these keys are pre-existing and Phase 9 must add ONLY motif-surface-specific keys (e.g., `bookContext.disclaimer`, `bookContext.chapters`).

### PV.3 `claimType` i18n keys confirmed as exhaustive 8-key set — strengthens §3.1 Path B cost estimate

Verified in `en.json`:
```json
"claimType": {
  "textual": "TEXTUAL",
  "strongInference": "STRONG INFERENCE",
  "possibleInference": "POSSIBLE INFERENCE",
  "comparativeParallel": "COMPARATIVE PARALLEL",
  "laterReception": "LATER RECEPTION",
  "historicalArchaeological": "HISTORICAL / ARCHAEOLOGICAL",
  "scientificComparison": "SCIENTIFIC COMPARISON",
  "speculation": "SPECULATION"
}
```

Exactly 8 keys — one per `ClaimType` union member. **Path B** (extend `ClaimType` with "STRUCTURAL", "LINGUISTIC", "TYPOLOGICAL", "NARRATIVE") would require adding 4 new i18n keys per locale × 4 locales = 16 new i18n entries, in addition to the code changes already enumerated in §3.1 (`CLAIM_COLORS`, `CLAIM_TYPE_KEYS`, `parseClaimType`). This makes **Path A** (restrict `BookContextMotif.claimType` to the existing 8-member `ClaimType` union) even more clearly the lower-friction option.

### PV.4 `prophecy.fields.scholarlyNote` key confirmed — Phase 11.5 i18n shipped for EN

`en.json` has `"prophecy": { "fields": { ..., "scholarlyNote": "Scholarly note" } }` — this confirms Phase 11.5 has executed and the scholarlyNote i18n key is live. Not a Phase 9 concern, but relevant to the test baseline: Phase 11.5 likely added parser tests that move the baseline above 801. Verify at step 9.4 pre-check as noted in §5.3.

### Summary of changes to audit file

- **§4.1 rewritten** to correct the §0.7/§0.8 claim and identify §0.10 as the genuine gap.
- **§5.4** unchanged — confirmed correct.
- **§3.1 Path B** cost now includes "+ 4 new i18n keys × 4 locales" as a verified addition.
- **Required condition 6** in §7 updated to reference §0.10 (not §0.7/§0.8).

---

## Round-2 Audit (2026-05-14) — Revised Plan Review + Phase 8 State Verification

After Claude Code revised the plan (absorbing all round-1 + PV findings), conducted a full round-2 review of the revised plan. Also read `docs/audit/archive/PHASE_8_TRIAGE.md` to understand Phase 8's execution state, which directly affects the editorial-log numbering claim.

### R2.1 All round-1 + PV findings absorbed correctly — with one key correction needed on §3.3

The revised plan absorbs every round-1 critical, significant, and minor finding:

- **§3.1 (Critical — ClaimType)** ✔ Q5 added; Path A chosen; semantic remap table in §5.1; `claimType: ClaimType` in interface. Build-safe.
- **§3.2 (Slug derivation)** ✔ Full §5.2.1 algorithm with 4 concrete examples. Test case 3 updated with input/output fixtures.
- **§3.4 (Authoring order)** ✔ Step 9.6 and §5.1 both explicitly state no `sortByConfidence`.
- **§4.1 (§0.10 lint gap)** ✔ Step 9.17 updated with `$CONTEXT_FILES` extension.
- **§4.2 (Forward-pointer scope)** ✔ "Jn 7+" removed from chapters array; body-text convention documented in §5.1.
- **§5.1–5.5 (Minor items)** ✔ All addressed in step 9.6 guidance, §8 conventions, step 9.8 i18n distinction.

**§3.3 (editorial-log numbers) — PARTIALLY correct, but the claim needs qualification:**

The revised plan states: *“Verified: john.md ends at J-023 — Phase 8 added J-022, post-Phase-8 cleanup added J-023.”*

Verified via `PHASE_8_TRIAGE.md` (dated 2026-05-14): Phase 8 planned J-022 for John and M-020 for Matthew at step 8.11. The triage concludes: *“Step 8.4a is the next execution action.”* This means the triage was written BEFORE Phase 8 content execution. Whether Phase 8 has since been executed and J-022/M-020 added cannot be independently verified from the triage alone. The plan’s defensive note (“verify last entry at execution time”) is retained in step 9.17 — this remains mandatory regardless.

### R2.2 Phase 8 Triage reveals key context for Phase 9 planning

From `PHASE_8_TRIAGE.md`:
- **Q1 = Option A Maximal** chosen for Phase 8 (all 18 chapters × 4 locales, not canary)
- **12 genuine-gap (i) cells** identified across gen/4, gen/9, gen/10, gen/11, gen/12, john/2, john/3, matt/2, matt/3 — all chapter-narrative-specific entries the Gen 1/Jn 1 anchor cannot address
- **Genesis 2–12 cross-reference quote-blocks** (44 files) as mechanical step 8.4a
- **Total Phase 8 effort**: 14–24h; 144 file-edits

This means Genesis 2–12 chapter companions will all have `> **Cross-reference:** see Gen 1 anchor` blocks added by Phase 8. This is the Section I convention the Phase 8 audit (AUDIT_PHASE_8_PLAN §3.2) diagnosed. Phase 9 motif work is consistent with and independent of this — no conflict.

### R2.3 New minor gap in revised plan: Unicode normalization in slug derivation is specified but not decided

The revised plan’s §5.2.1 slug algorithm includes this example:

> `## 3. *Anōthen* / “born from above” double meaning` → `anothen-born-from-above-double-meaning` (note: the `ō` Unicode character is preserved or replaced with `o` depending on the regex’s Unicode handling — parser test fixtures should pin this behavior)

The plan correctly flags this as a loose end but **doesn’t resolve it**. Two options:

1. **Preserve `ō` as-is** — slug becomes `anōthen-born-from-above-double-meaning`. Valid URL-safe? Not all environments handle Unicode slugs reliably as React keys, though it’s technically fine.
2. **Normalize to ASCII** — apply Unicode normalization (NFD decomposition then strip combining characters): `ō` → `o`, `ā` → `a`, etc. Slug becomes `anothen-born-from-above-double-meaning`. More portable.

Since slugs serve ONLY as React `key` values (per the plan’s own collision-policy note), both options work correctly. But the test fixture must pin one behavior to prevent test flakiness across environments. **Recommended: normalize to ASCII** (option 2) — more portable, avoids Unicode collation surprises in the test runner.

**Required fix:** §5.2.1 should state: “Unicode characters in titles are normalized to ASCII before slugging: apply NFD decomposition and strip non-ASCII characters. Example: `ō` → `o`, `ā` → `a`.” Update test fixture for `## 3. *Anōthen*` accordingly.

### R2.4 Project-lead decisions captured (Q1–Q5) — step 9.3 gate PASSED

All five Q-decisions confirmed by the project lead:

| Decision | Answer | Notes |
|---|---|---|
| **Q1 — Authoring depth** | **Medium** (~300 words, 2–3 paragraphs + source) | Matches existing §A companion depth |
| **Q2 — Schema** | **Option A flat** (`motifs: BookContextMotif[]`) | Audit-validated; no grouping needed at 8–12 motifs |
| **Q3 — Execution scope** | **Option A Canary** (Genesis EN → John+Matthew EN → locale mirrors, ~32–47h) | Different from Phase 8’s Maximal; correct call — Phase 9 motif authoring is editorial-judgment-intensive, canary methodology is right |
| **Q4 — UI component** | **Reuse EnrichmentEntryCard** | Audit-validated; MotifCard deferred to Phase 9.5 |
| **Q5 — ClaimType** | **Path A** (restrict to existing 8-member union; semantic remap) | Audit-confirmed only build-safe option without additional code changes; zero extra i18n entries |

**Step 9.3 is now formally passed.** Execution begins at step 9.4 (domain type + parser + tests) after R2.3 (Unicode normalization in §5.2.1) is absorbed into the plan.

### R2.5 Verification table update row

| Plan claim | Round-2 result | Notes |
|---|---|---|
| john.md ends at J-023 (Phase 8 added J-022) | ⚠️ Plausible but unverified | Phase 8 Triage planned J-022 at step 8.11; whether Phase 8 has executed is unconfirmed from available files |
| Phase 8 chose Option A Maximal (all 18 chapters) | ✔ Verified | PHASE_8_TRIAGE.md confirms Q1 = Option A Maximal |
| 12 genuine-gap cells identified in Phase 8 | ✔ Verified | Triage §2 lists 12 cells across 8 chapters |
| Unicode slug for `ō` (“anōthen”) | ⚠️ Unresolved in plan | Plan flags but doesn’t decide. See R2.3. |
| All round-1 + PV findings absorbed by revised plan | ✔ Verified (with §3.3 caveat) | All structural fixes correct; editorial-log number verification mandatory at execution time |

### Round-2 Required Additions

1. **R2.3 (should fix before step 9.4):** Add Unicode normalization decision to §5.2.1 slug algorithm. Recommend ASCII normalization (NFD + strip non-ASCII). Update test fixture for `## 3. *Anōthen*` with concrete expected slug.
2. **R2.4 (RESOLVED):** Project-lead decisions on Q1/Q3/Q5 captured above. Step 9.3 gate passed.

### Round-2 Verdict

**Plan is approved pending R2.3 only.** All five Q-decisions are now locked. R2.3 (Unicode normalization, 2-line addition to §5.2.1) is the single remaining item before step 9.4 begins. The plan’s defensive “verify at execution time” instruction for editorial-log numbers correctly handles the unverified J-023 state.

**Execution order after R2.3 is absorbed:**
1. Step 9.4 — Domain type + parser + tests (code-first)
2. Step 9.5 — Repository + content-loader extension
3. Step 9.6 — `book-context-view.tsx` (flat list, authoring order, EnrichmentEntryCard adapter)
4. Step 9.7 — Page replacement
5. Step 9.8 — i18n (new motif-specific keys only)
6. Step 9.9 — Genesis EN canary (8–12 motifs at Medium depth)
7. Step 9.10 — Project-lead canary checkpoint
8. Steps 9.11–9.17 — John+Matthew EN → locale mirrors → integrity sweep → closure
