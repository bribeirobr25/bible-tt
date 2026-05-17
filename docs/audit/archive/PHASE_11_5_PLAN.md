# Phase 11.5 — Prophecy parser `scholarlyNote` field

**Created:** 2026-05-13
**Revised:** 2026-05-13 post-audit (`docs/audit/archive/AUDIT_PHASE_11_5_PLAN.md`) — 1 critical execution-blocker + 2 significant + 2 minor findings absorbed.
**Source:** `docs/audit/archive/AUDIT_PHASE_11_PLAN.md` round-1 finding C1 (parser silently drops `**Scholarly note:**`); `docs/audit/archive/PHASE_11_PLAN.md` §10 forward-tracking item; `docs/feedback/DEFERRED_TASKS.md` Phase 6.6 forward-tracking item C (the pre-existing prophecy-parser bug)
**Status:** drafted; revised post-audit; awaiting project-lead approval before execution

## Audit revisions absorbed (2026-05-13)

Independent audit (`docs/audit/archive/AUDIT_PHASE_11_5_PLAN.md`) verified the plan's claims against the actual codebase. All 5 findings absorbed after verification:

- **Critical — `finalizeEntry` is a field-by-field constructor, not a `...spread`.** Verified at `src/infrastructure/content/prophecy-parser.ts` lines 215–225: the function explicitly names every field in its return object (`verseRef`, `title`, `textSays`, `context`, `subject`, `readings`, `fulfillmentStatus`, `fulfillmentNotes`). Adding the dispatch branch without also adding `scholarlyNote: raw.scholarlyNote` to the return object would silently drop the value at finalization — re-creating the original bug. Plan §3.2.1 now explicitly shows the `finalizeEntry` update, and step 11.5.2 DoD requires verifying the field round-trips end-to-end.
- **Significant — i18n key naming convention.** Verified at `src/ui/prophecy/prophecy-view.tsx` lines 62, 71, 81 + `src/infrastructure/i18n/messages/en.json`: the established pattern is `prophecy.fields.*` (e.g. `prophecy.fields.textSays`, `prophecy.fields.context`, `prophecy.fields.readings`, `prophecy.fields.subject`, `prophecy.fields.status`). The plan's original `prophecy.scholarlyNote` would have broken this convention. Corrected to `prophecy.fields.scholarlyNote`.
- **Significant — label asymmetry resolution (Option B).** Verified at `prophecy-view.tsx` lines 106–110: `fulfillmentNotes` renders as an unlabeled `<p>` italic paragraph. The plan's original labeled-header design for `scholarlyNote` would have created two visually-inconsistent trailing sections in the same card. Resolved via **Option B** (match existing pattern — no label header for scholarlyNote either), keeping the small `border-t` divider for visual separation. Rationale: lower scope risk (no Phase 11 fulfillmentNotes UI change), consistent rendering pattern. In Genesis CHAPTER-3 the reader rarely sees both fields populated simultaneously, so asymmetry concern is minimal in practice.
- **Minor 1 — test count.** Bumped from +2 tests to +5 tests: one per locale variant (EN, PT-BR, DE, ES dispatch) + 1 absent-field invariant (scholarlyNote is `undefined` when the field is missing — the round-trip through `finalizeEntry` is the critical thing to verify).
- **Minor 2 — single-line constraint for scholarlyNote.** Added explicitly to §5 Decisions table: the same R2.1 single-line `FIELD_LINE` capture constraint that governs `fulfillmentNotes` applies to `scholarlyNote`. Future authoring of Gen 9 / Gen 12 scholarly notes (if any) must keep the entire value on one line.
**Trigger:** small code-change phase to make `**Scholarly note:**` lines reach the UI; resolves a silent-content-loss bug that has affected Genesis prophecy files since their original authoring.

---

## 1. Goal (one sentence)

Add a parsed-and-rendered `scholarlyNote` field to the prophecy domain so that the 4 `**Scholarly note:**` lines in Genesis CHAPTER-3-PROPHECY × 4 locales (currently silently dropped by the parser) reach readers in Prophecy view-mode.

## 2. Problem statement

The current parser (`src/infrastructure/content/prophecy-parser.ts` dispatch at lines 137–189) recognizes only: `verse`, `text says`, `context`, `subject`, `fulfillment status`, `fulfillment notes`, `readings`. Any other `**Key:**` line matches the `FIELD_LINE` regex but falls through all dispatch branches without storing. `**Scholarly note:**` is silently dropped.

**Verified scope (2026-05-13 grep audit):**
- 4 `**Scholarly note:**` lines exist in `content/{en,pt-br,de,es}/genesis/study/CHAPTER-3-PROPHECY.md` (1 per locale, in the Gen 3:15 "seed of the woman" entry).
- 0 `**Scholarly note:**` lines in `content/*/genesis/study/CHAPTER-{9,12}-PROPHECY.md`.
- 0 `**Scholarly note:**` lines in any Phase 11 prophecy file (John 3 / Matthew 1+2) — Phase 11 bundled scholarly content into `**Fulfillment notes:**` per the round-1 audit fix.

Total impact: 4 silently-dropped lines becoming visible. No content migration required — the lines already exist in correct format and surface; they just need parser+UI support.

## 3. Approach

### 3.1 Domain change

Add optional `scholarlyNote?: string` field to `ProphecyEntry` in `src/domain/content/types.ts`. Optional because existing CHAPTER-9 / CHAPTER-12 / John 3 / Matthew 1+2 prophecy entries don't have one.

### 3.2 Parser dispatch (7 lines added)

Add to the existing dispatch chain after the `fulfillment notes` branch:

```ts
} else if (
  key.includes("scholarly note") ||
  key.includes("nota acadêmica") ||
  key.includes("nota académica") ||
  key.includes("wissenschaftliche anmerkung")
) {
  current.scholarlyNote = value;
}
```

Locale labels verified against existing Genesis prophecy files (`grep "^**Scholarly note|Nota acadêmica|Nota académica|Wissenschaftliche Anmerkung" content/*/genesis/study/CHAPTER-3-PROPHECY.md`).

Per audit R2.1 (single-line constraint from Phase 11 round 2): the `**Scholarly note:**` value is captured by the same `FIELD_LINE` regex, so the same single-line discipline applies. The 4 existing Genesis lines are already single-line — verified.

### 3.2.1 `finalizeEntry` update — CRITICAL (audit blocker fix)

**`finalizeEntry` does NOT use spread/rest** — it explicitly names every field in its return object. If only §3.2's dispatch is added without updating `finalizeEntry`, `scholarlyNote` is parsed into `current` and then silently dropped at finalization. The UI receives `undefined`, scholarly notes stay invisible — exactly the original bug, re-introduced.

**The required additional change** to `finalizeEntry` (`src/infrastructure/content/prophecy-parser.ts` lines 215–225):

```ts
function finalizeEntry(
  raw: Partial<ProphecyEntry> & { readings: ProphecyReading[] },
): ProphecyEntry {
  return {
    verseRef: raw.verseRef || "",
    title: raw.title || "",
    textSays: raw.textSays || "",
    context: raw.context || "",
    subject: raw.subject || "",
    readings: raw.readings,
    fulfillmentStatus: raw.fulfillmentStatus || "DEBATED",
    fulfillmentNotes: raw.fulfillmentNotes,
    scholarlyNote: raw.scholarlyNote, // ← NEW: required to round-trip the field end-to-end
  };
}
```

Without this single-line addition, the §3.2 dispatch is a no-op from the UI's perspective.

### 3.3 UI render — Option B (match existing pattern; audit fix)

Add to `src/ui/prophecy/prophecy-view.tsx` after the `fulfillmentNotes` block (currently lines 106–110). Match the **existing unlabeled `<p>` pattern** for visual consistency (audit Significant 2 — label asymmetry resolution):

```tsx
{entry.scholarlyNote && (
  <p className="text-xs text-text-muted italic mt-2 pt-2 border-t border-border-muted">
    {entry.scholarlyNote}
  </p>
)}
```

Differences from fulfillmentNotes (the upstream block):
- **No label** — matches the existing unlabeled-italic-paragraph pattern of `fulfillmentNotes` (verified at lines 106–110)
- **Visual differentiator only:** `mt-2 pt-2 border-t border-border-muted` adds a small spacer + top-border so the scholarly note is visually distinct from fulfillmentNotes when both are present (rare in current content — Genesis CHAPTER-3 has only the scholarly note populated; fulfillmentNotes is empty there)

Position rationale: scholarly note goes BELOW fulfillment notes because the structure pattern in Genesis files is: Readings (the 3-tradition lens) → fulfillment notes (the claim) → scholarly note (textual/grammatical critique). This matches the cognitive flow readers expect.

Render style: plain text (no `dangerouslySetInnerHTML`), matching the fulfillmentNotes treatment per audit R2.1 caveat. Italics in source markdown won't render; Greek/Hebrew Unicode renders fine.

**i18n key NOT needed for the render block** (audit Significant 2 — Option B): since there is no label header rendered, no i18n string is referenced. The i18n key is still added in §3.4 for future use (if a future enhancement adds labels to both trailing blocks symmetrically), but the Phase 11.5 UI does not consume it. This is a deliberate choice — defining the key upfront makes Option-A migration (add labels to both) a one-line UI change if reader feedback warrants it.

### 3.4 i18n key — `prophecy.fields.scholarlyNote` (audit fix)

Add `prophecy.fields.scholarlyNote` to all 4 locale message files (`src/infrastructure/i18n/messages/{en,pt-br,de,es}.json`).

**Pattern correction:** the original plan used `prophecy.scholarlyNote` at the top level, but the established convention (verified at `src/ui/prophecy/prophecy-view.tsx` lines 62, 71, 81 + existing `prophecy.fields.*` keys: `textSays`, `context`, `readings`, `subject`, `status`) is `prophecy.fields.*` for prophecy-entry field labels. Corrected to:

```json
"prophecy": {
  ...,
  "fields": {
    "textSays": "Text says",
    "context": "Context",
    ...,
    "scholarlyNote": "Scholarly note"
  }
}
```

Locale values:
- EN: `"Scholarly note"`
- PT-BR: `"Nota acadêmica"`
- DE: `"Wissenschaftliche Anmerkung"`
- ES: `"Nota académica"`

Per §3.3, the UI does not currently reference this key (Option B unlabeled rendering), but adding the key now preserves the option of a future Option-A migration without re-editing 4 locale files.

### 3.5 Tests — 5 new tests (audit Minor 1)

Original plan had +2 tests. Audit recommended one test per locale variant plus an absent-field invariant for end-to-end round-trip verification — the critical concern given the §3.2.1 `finalizeEntry` gap that's easy to miss.

Add 5 parser tests to `src/infrastructure/content/__tests__/prophecy-parser.test.ts`:

1. **EN dispatch:** `**Scholarly note:** Some note.` → `entry.scholarlyNote === "Some note."` (also verifies `finalizeEntry` round-trips the field)
2. **PT-BR dispatch:** `**Nota acadêmica:** ...` → same field populated
3. **DE dispatch:** `**Wissenschaftliche Anmerkung:** ...` → same field populated
4. **ES dispatch:** `**Nota académica:** ...` → same field populated
5. **Absent-field invariant:** an entry with NO `**Scholarly note:**` line → `entry.scholarlyNote === undefined` (verifies the field is properly typed as optional and `finalizeEntry` doesn't accidentally default to an empty string or null)

Test count: 23 → 28 (was originally +2 = 25; revised to +5 = 28 per audit).

Tests 1–4 are the critical ones — they verify the §3.2 dispatch AND the §3.2.1 finalizeEntry round-trip work together. If §3.2.1 is forgotten, all 4 tests fail (the dispatch populates `current.scholarlyNote` but `finalizeEntry` drops it).

## 4. Files touched

| File | Change |
|------|--------|
| `src/domain/content/types.ts` | Add `scholarlyNote?: string` to `ProphecyEntry` interface |
| `src/infrastructure/content/prophecy-parser.ts` | Two changes (audit fix): (1) add 7-line dispatch branch (§3.2); (2) **add `scholarlyNote: raw.scholarlyNote` to the `finalizeEntry` return object** (§3.2.1, critical) |
| `src/ui/prophecy/prophecy-view.tsx` | Add 5-line unlabeled-italic conditional render block after fulfillmentNotes (Option B match-pattern per §3.3 audit fix) |
| `src/infrastructure/i18n/messages/en.json` | Add `prophecy.fields.scholarlyNote: "Scholarly note"` (audit fix: `.fields.` namespace) |
| `src/infrastructure/i18n/messages/pt-br.json` | Add `prophecy.fields.scholarlyNote: "Nota acadêmica"` |
| `src/infrastructure/i18n/messages/de.json` | Add `prophecy.fields.scholarlyNote: "Wissenschaftliche Anmerkung"` |
| `src/infrastructure/i18n/messages/es.json` | Add `prophecy.fields.scholarlyNote: "Nota académica"` |
| `src/infrastructure/content/__tests__/prophecy-parser.test.ts` | Add 5 new tests (test count 23 → 28; audit fix: per-locale dispatch tests + absent-field invariant) |

**Total: 8 files, all code/config — no content changes required.** The 4 existing Genesis CHAPTER-3-PROPHECY scholarly-note lines start rendering automatically.

## 5. Decisions pinned

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Render position** | Below fulfillmentNotes, separated by horizontal border-top + small margin | Matches the cognitive flow of existing Genesis files (Readings → fulfillment-notes → scholarly-note) |
| **Render style — label or unlabeled** (audit Sig 2) | **Option B — unlabeled**, matching the existing `fulfillmentNotes` unlabeled-italic-`<p>` pattern at `prophecy-view.tsx` lines 106–110 | Lower scope risk (no Phase 11 fulfillmentNotes UI change); consistent rendering pattern across all prophecy trailing blocks; Genesis CHAPTER-3 rarely populates both fields simultaneously so visual ambiguity is minimal. Option A (add labels to both) is a future enhancement if reader feedback warrants — the i18n key is defined now to make the future migration one line. |
| **Markdown support** | Plain text, same as fulfillmentNotes | Consistency with the prior block; avoids re-introducing the R2.1 single-line constraint concern with markdown processing differences; future enhancement possible if needed |
| **Field-key locale variants** | EN / PT / DE / ES per locale verification of existing Genesis files | Matches the labels actually authored in Genesis CHAPTER-3-PROPHECY across the 4 locales |
| **i18n key namespace** (audit Sig 1) | `prophecy.fields.scholarlyNote` (NOT `prophecy.scholarlyNote`) | The existing convention in `src/infrastructure/i18n/messages/en.json` + `prophecy-view.tsx` is `prophecy.fields.*` for field-label keys (e.g. `prophecy.fields.textSays`, `.context`, `.readings`). Top-level `prophecy.scholarlyNote` would break the namespace. |
| **`**Scholarly note:**` single-line constraint** (audit Minor 2) | Same R2.1 constraint as `**Fulfillment notes:**` — entire value must be on one line | The `FIELD_LINE = /^\*\*(.+?):\*\*\s*(.*)$/` regex captures `(.*)` only to end-of-line. Multi-line values silently drop content after the line break. The 4 existing Genesis CHAPTER-3-PROPHECY scholarly-note lines are already single-line — verified. Future authoring of Gen 9 / Gen 12 / other prophecy file scholarly notes MUST keep the entire value on one line. |
| **`finalizeEntry` round-trip** (audit Critical) | The §3.2 dispatch MUST be paired with a §3.2.1 update to `finalizeEntry`'s return object | The function is a field-by-field constructor (not `...spread`); missing field means silently dropped value. Tests #1–4 in §3.5 catch this regression. |
| **Phase 11 content migration** | NONE — leave fulfillmentNotes-bundled scholarly content as-is | Phase 11 files were intentionally bundled per round-1 audit fix; moving content back would create churn for no UI gain. Future content cycles can optionally separate if reader feedback warrants. |
| **Genesis CHAPTER-9 / CHAPTER-12 retroactive enrichment** | OUT OF SCOPE | These files have no scholarly-note lines currently; not introducing new ones is a content-author decision per Rule 28, not a Phase-11.5 mechanical fix. |
| **Test count change** | 23 → 28 (+5; was originally +2) | One test per locale variant (EN/PT/DE/ES) + 1 absent-field invariant. Tests #1–4 also serve as round-trip verification for §3.2.1 (would fail loudly if finalizeEntry doesn't preserve the field). |

## 6. Execution sequence

**Pre-execution baseline check:** `pnpm test` reports 796/796 + prophecy-parser 23/23. Re-verify at execution time per the established discipline.

| Step | Scope | Effort |
|------|-------|--------|
| **11.5.1** | Add `scholarlyNote?: string` to `ProphecyEntry` domain type | 5 min |
| **11.5.2** | Add parser dispatch (§3.2) **AND** add `scholarlyNote: raw.scholarlyNote` to `finalizeEntry` return object (§3.2.1 — audit Critical fix). DoD for this step: write a manual quick-check test BEFORE running the suite — `parseProphecyMarkdown` on a minimal entry with `**Scholarly note:** foo` and verify the entry has `scholarlyNote === "foo"`. If `undefined`, `finalizeEntry` wasn't updated. | 15 min |
| **11.5.3** | Add the 5 new parser tests (per-locale dispatch + absent-field invariant per §3.5); verify they pass (`pnpm test` → 801/801) | 15 min |
| **11.5.4** | Add UI render block in `prophecy-view.tsx` (Option B unlabeled-italic per §3.3) + 4 i18n keys (`prophecy.fields.scholarlyNote` per §3.4) | 15 min |
| **11.5.5** | Verify rendering at `/{locale}/genesis/chapter/3#prophecy` for all 4 locales (the 4 silently-dropped notes now visible) | 15 min |
| **11.5.6** | Editorial-log entry (`docs/editorial-log/genesis.md` — new entry 2026-05-13-102) + meta-doc sync (CLAUDE.md test count 796 → 801; PENDING.md note; DEFERRED_TASKS.md Phase 6.6 item C / Phase 11 §10 closure) | 30 min |
| **11.5.7** | Final integrity sweep: `pnpm test 801/801`; `pnpm content:lint`; `pnpm build`; visual confirm | 10 min |

**Total: ~1.75 h** (slightly higher than original 1.5h estimate due to the +3 additional tests and the explicit step-11.5.2 round-trip-verification discipline).

After each step: `pnpm test` + `pnpm content:lint` + `pnpm build` (build only after UI changes ship).

## 7. Editorial-log entry

One entry — Genesis log (this is a Genesis-content-affecting fix, even though no Genesis content actually changes — the existing Scholarly note lines start rendering):

- **`docs/editorial-log/genesis.md` Entry 2026-05-13-102** — Phase 11.5 scholarlyNote parser+UI fix. Cite: Rule 28 (review workflow — the existing Scholarly note lines in CHAPTER-3-PROPHECY were authored at Gen 3 cycle but never reached the UI due to parser-dispatch gap). Cross-reference: `docs/audit/archive/AUDIT_PHASE_11_PLAN.md` C1 (the original finding); `docs/audit/archive/PHASE_11_5_PLAN.md` (this plan); the 4 affected Genesis files.

## 8. Definition of Done

- `scholarlyNote?: string` exists on `ProphecyEntry` domain type
- Parser dispatches `**Scholarly note:**` / `Nota acadêmica` / `Wissenschaftliche Anmerkung` / `Nota académica` correctly (verified by 5 new tests per §3.5)
- **`finalizeEntry` return object includes `scholarlyNote: raw.scholarlyNote`** (audit Critical — required for end-to-end round-trip; verified explicitly in tests #1–4)
- UI renders scholarlyNote unlabeled-italic with `border-t` divider below fulfillmentNotes when present (Option B per §3.3)
- 4 i18n keys added across 4 locale message files at the **`prophecy.fields.scholarlyNote`** path (audit Sig 1 — `.fields.` namespace; NOT `prophecy.scholarlyNote` top-level)
- **`pnpm test`** reports 801/801 (was 796/796 + 5 new prophecy-parser tests per §3.5; audit Minor 1)
- **`pnpm content:lint`** exit 0 (1 pre-existing warn-only signal unchanged)
- **`pnpm lint`** Biome clean
- **`pnpm build`** clean across all 4 locales × 3 books
- Visual verification: `/{locale}/genesis/chapter/3` Prophecy tab now shows the previously-hidden Gen 3:15 scholarly note in all 4 locales
- Genesis CHAPTER-9 / CHAPTER-12 prophecy renders unchanged (no scholarly notes there to break)
- Phase 11 (John 3 / Matt 1+2) prophecy renders unchanged (no scholarly notes there; fulfillmentNotes still renders as before)
- Editorial-log entry 2026-05-13-102 logged
- DEFERRED_TASKS.md Phase 6.6 item C marked RESOLVED 2026-05-13 via Phase 11.5
- PHASE_11_PLAN.md §10 forward-tracking item annotated as RESOLVED via this Phase 11.5

## 9. Risks + mitigations

| # | Risk | Severity | Mitigation |
|---|------|----------|-----------|
| 1 | Existing Genesis prophecy renders break (regression in fulfillmentNotes / readings) | LOW | UI change is additive (a new conditional block after existing render). No existing render path modified. Visual smoke at Gen 3 / 9 / 12 confirms. |
| 2 | Parser regression from new dispatch branch | LOW | Dispatch is additive (one more `else if`). 23 existing tests cover all prior fields; +2 new tests cover the new field. |
| 3 | i18n key missing in a locale causes runtime crash | LOW | i18n key added in all 4 locales upfront. Pre-execution test catches absence (next-intl raises). |
| 4 | Phase 11 fulfillmentNotes now feels redundant with scholarlyNote | LOW (cosmetic) | Phase 11 bundled scholarly content into fulfillmentNotes intentionally — no migration. Genesis CHAPTER-3 will display BOTH fulfillmentNotes AND scholarlyNote where authored. Different content domains: fulfillmentNotes = the claim; scholarlyNote = the textual-critical observation. |
| 5 | Audit R2.1 single-line constraint not communicated for new field | LOW–MEDIUM | The Genesis CHAPTER-3 scholarly-note lines are already single-line (verified). Plan §3.2 explicitly notes the same R2.1 constraint applies. Future authors will reference Phase 11 §5 conventions table where R2.1 is documented. |

## 10. Out of scope

- **Genesis CHAPTER-9 + CHAPTER-12 retroactive scholarly-note authoring** — these files have no scholarly notes today; adding them is a content-author decision per Rule 28, not a Phase 11.5 mechanical concern.
- **Phase 11 (John 3 / Matt 1+2) content migration** — fulfillmentNotes is the intentional Phase 11 home for scholarly content per the round-1 audit C1+C2 fix. No migration.
- **Generalize the parser to dispatch arbitrary new fields** — explicit dispatch is the right pattern for parser-validated content; no general-purpose field bag.
- **Add scholarlyNote to chapter companion (CHAPTER-N-CONTEXT.md) parser** — different parser, different content type. Not a concern here.

## 11. Status

**Drafted:** 2026-05-13 by claude-opus-4-7
**Revised:** 2026-05-13 post-audit — 1 critical + 2 significant + 2 minor findings absorbed (see "Audit revisions" block at top)
**Pre-execution test baseline:** `pnpm test` reports 796/796 + prophecy-parser 23/23 (verified at draft time; re-verify at execution time per established discipline)
**Auditor recommendation:** "After those five items are addressed, the phase is clean: no Lock Protocol, no content changes, ~1.5h plausible, and step 11.5.5 immediately confirms the fix worked." — all 5 items now addressed.
**Awaiting:** project-lead approval before execution
**Trigger to start:** any green-light from project lead — execution can begin immediately at step 11.5.1

---

**Plan author:** claude-opus-4-7, 2026-05-13 (revised post-audit same day)
**Audit:** `docs/audit/archive/AUDIT_PHASE_11_5_PLAN.md` — verdict "After those five items are addressed, the phase is clean." 1 critical execution-blocker (finalizeEntry field-by-field constructor → silent field-drop without explicit update) + 2 significant concerns (i18n key namespace `prophecy.fields.*` not `prophecy.*`; label asymmetry between fulfillmentNotes/scholarlyNote rendering — Option B chosen for minimal scope) + 2 minor (test count bumped 2 → 5; single-line constraint stated explicitly in §5).
**Cross-references:** `docs/audit/archive/AUDIT_PHASE_11_5_PLAN.md` (independent audit absorbed pre-execution); `docs/audit/archive/AUDIT_PHASE_11_PLAN.md` round-1 finding C1 (parser drops `**Scholarly note:**`); `docs/audit/archive/PHASE_11_PLAN.md` §10 forward-tracking item (b) (this is the "(a) code fix" path); `docs/feedback/DEFERRED_TASKS.md` Phase 6.6 forward-tracking item (resolves the pre-existing prophecy-parser bug); `src/infrastructure/content/prophecy-parser.ts` lines 137–189 (current dispatch) + lines 215–225 (`finalizeEntry` constructor — must be updated per §3.2.1); `src/ui/prophecy/prophecy-view.tsx` lines 62/71/81 (existing `prophecy.fields.*` i18n key usage) + lines 106–110 (insertion point for new render block matching the unlabeled-italic pattern); `content/{en,pt-br,de,es}/genesis/study/CHAPTER-3-PROPHECY.md` (the 4 currently-silently-dropped scholarly notes that this plan unblocks).
