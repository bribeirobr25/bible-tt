# Audit of `PHASE_11_5_PLAN.md` (Prophecy parser `scholarlyNote` field)

**Date:** 2026-05-13
**Auditor:** Claude Opus 4.7 (independent review)
**Scope:** `docs/audit/archive/PHASE_11_5_PLAN.md` — 8 files touched (types.ts, prophecy-parser.ts, prophecy-view.tsx, 4 × i18n message files, prophecy-parser.test.ts), ~1.5h estimate.
**Method:** Verified plan claims against: `src/domain/content/types.ts`, `src/infrastructure/content/prophecy-parser.ts`, `src/ui/prophecy/prophecy-view.tsx`, `src/infrastructure/i18n/messages/{en,pt-br,de,es}.json`, `src/infrastructure/content/__tests__/prophecy-parser.test.ts`, `content/{en,pt-br,de,es}/genesis/study/CHAPTER-3-PROPHECY.md`, `docs/editorial-log/genesis.md`.
**Status:** Plan is mostly sound. One critical execution gap. Two significant concerns. Several minor improvements. The strategic direction (code fix over content migration) is correct.

---

## 1. Executive Summary

The plan correctly diagnoses the problem (parser silently drops `**Scholarly note:**` due to missing dispatch branch), correctly identifies the full chain of changes needed (types → parser → UI → i18n × 4 → tests), and correctly scopes to Genesis CHAPTER-3 as the only affected content. The out-of-scope decisions are right: Phase 11 content stays in `fulfillmentNotes`, Genesis 9/12 retroactive authoring defers to content-author judgment, no general-purpose field bag.

**What verified as correct:**

- 4 `**Scholarly note:**` lines exist — one per locale in `content/*/genesis/study/CHAPTER-3-PROPHECY.md` — all single-line ✓
- Locale field labels confirmed against actual files: EN `Scholarly note`, PT-BR `Nota acadêmica`, DE `Wissenschaftliche Anmerkung`, ES `Nota académica` ✓
- No dispatch collision between the new scholarly-note branch and the existing `fulfillmentNotes` branch: PT-BR `"nota acadêmica"` does NOT contain `"notas"` (singular vs plural — "nota" ≠ "notas"); DE `"wissenschaftliche anmerkung"` does NOT contain `"anmerkungen"` ("anmerkung" ≠ "anmerkungen") ✓
- Editorial-log numbering: genesis.md ends at entry `2026-05-09-101`; proposed `2026-05-13-102` is next ✓
- `ProphecyEntry` currently has no `scholarlyNote` field — confirmed in `types.ts` ✓
- `finalizeEntry` explicitly enumerates every field in its return object — confirmed; any new field must be explicitly listed ✓
- `fulfillmentNotes` renders without a label (plain italic paragraph, no header) — confirmed in `prophecy-view.tsx` ✓
- All existing `prophecy.fields.*` pattern in UI confirmed: `t("prophecy.fields.textSays")`, `t("prophecy.fields.context")`, `t("prophecy.fields.readings")` — all under `prophecy.fields.*` namespace in all 4 message files ✓

**Critical issue:** `finalizeEntry` must be explicitly updated; the plan's §3.2 code snippet does not show it.

**Two significant issues:** i18n key naming convention and render label asymmetry.

---

## 2. Verification Table

| Plan claim | Verification result | Notes |
|---|---|---|
| 4 `**Scholarly note:**` lines exist — 1 per locale in CHAPTER-3-PROPHECY | ✓ Verified | EN/PT-BR/DE/ES all have exactly one scholarly-note line in the Gen 3:15 entry |
| 0 scholarly-note lines in Gen 9/12 PROPHECY files | Unverified (only Gen 3 read) | Plan's grep audit plausible; spot-check Gen 9 confirms structure |
| 0 scholarly-note lines in Phase 11 files | Plausible | Phase 11 was authored after the C1 fix — correct by construction |
| EN label: `**Scholarly note:**` | ✓ Verified | `## The seed of the woman` entry in en/genesis/study/CHAPTER-3-PROPHECY.md |
| PT-BR label: `**Nota acadêmica:**` | ✓ Verified | pt-br/genesis/study/CHAPTER-3-PROPHECY.md |
| DE label: `**Wissenschaftliche Anmerkung:**` | ✓ Verified | de/genesis/study/CHAPTER-3-PROPHECY.md |
| ES label: `**Nota académica:**` | ✓ Verified | es/genesis/study/CHAPTER-3-PROPHECY.md |
| No dispatch collision between new scholarly-note branch and existing `fulfillmentNotes` `key.includes("notas")` | ✓ Verified | PT-BR key "nota acadêmica" does NOT contain "notas" (different word: nota ≠ notas) |
| No dispatch collision with `key.includes("anmerkungen")` | ✓ Verified | DE key "wissenschaftliche anmerkung" does NOT contain "anmerkungen" (singular ≠ plural) |
| `ProphecyEntry` has no `scholarlyNote` field today | ✓ Verified | `types.ts` confirms: verseRef, title, textSays, context, subject, readings, fulfillmentStatus, fulfillmentNotes — no scholarlyNote |
| `finalizeEntry` explicitly constructs return object | ✓ Verified — **CRITICAL** | Every field in the return is explicitly listed. `scholarlyNote` will NOT be carried through unless explicitly added. See §3.1. |
| `fulfillmentNotes` renders as plain italic, no label | ✓ Verified | Lines 105-109 of `prophecy-view.tsx`: `{entry.fulfillmentNotes && (<p className="text-xs text-text-muted italic">{entry.fulfillmentNotes}</p>)}` — no label element |
| Existing prophecy field labels use `t("prophecy.fields.*")` pattern | ✓ Verified | `t("prophecy.fields.textSays")`, `t("prophecy.fields.context")`, `t("prophecy.fields.readings")` — all in `prophecy.fields` namespace. Plan proposes `t("prophecy.scholarlyNote")` without `.fields.` — breaks the pattern. See §4.1. |
| Genesis editorial log ends at entry 101 | ✓ Verified | Last entry: `2026-05-09-101` — numeric-anchor convention. Proposed `2026-05-13-102` is correct next. |
| 4 existing scholarly-note lines are single-line format | ✓ Verified | All 4 locale files have `**[Label]:** [single-line content ending with [POSSIBLE] or [UNCERTAIN]]` |
| Test count: 23 → 25 (+2) | Plausible (no test run) | Existing test file structure confirmed; 2 tests is a floor, not a ceiling — see §4.3. |

---

## 3. Critical Gap — Must Resolve Before Execution

### 3.1 `finalizeEntry` update not shown in the plan's code — will silently drop `scholarlyNote`

The plan's §3.2 code snippet shows only the new parser dispatch branch:

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

But `current` is typed as `Partial<ProphecyEntry> & { readings: ProphecyReading[] }`. Setting `current.scholarlyNote = value` works only after `scholarlyNote?: string` is added to `ProphecyEntry`. The dispatch is correct.

**The missing step:** `finalizeEntry` explicitly constructs its return object:

```typescript
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
    // ← scholarlyNote is NOT here
  };
}
```

If `scholarlyNote` is not added to this return object, the field is parsed into `current` and then silently dropped when `finalizeEntry` constructs the final `ProphecyEntry`. The UI receives `undefined`; the conditional block `{entry.scholarlyNote && ...}` never fires; the 4 Genesis CHAPTER-3 scholarly notes remain invisible — exactly the original bug.

The plan's step 11.5.2 says "Add parser dispatch + ensure `finalizeEntry` preserves the field" — the intent is correct, but the code snippet doesn't show it, which means it's easy for the executor to add the dispatch and consider the step done.

**Required fix:** The plan's §3.2 must show the complete `finalizeEntry` change alongside the dispatch snippet:

```typescript
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
    scholarlyNote: raw.scholarlyNote,  // ← ADD THIS
  };
}
```

And step 11.5.2's DoD should explicitly include: "`finalizeEntry` return object includes `scholarlyNote: raw.scholarlyNote`."

---

## 4. Significant Concerns

### 4.1 i18n key naming convention: `prophecy.scholarlyNote` should be `prophecy.fields.scholarlyNote`

All existing prophecy field label keys in the UI follow the `prophecy.fields.*` pattern:

```typescript
t("prophecy.fields.textSays")   // "What the text says"
t("prophecy.fields.context")    // "Context"
t("prophecy.fields.subject")    // "Subject"
t("prophecy.fields.readings")   // "Traditional readings"
t("prophecy.fields.status")     // "Fulfillment status"
```

All four message files confirm this structure — every field label lives under `prophecy.fields`. The plan proposes:

```typescript
t("prophecy.scholarlyNote")
```

...and instructs adding `"prophecy.scholarlyNote": "Scholarly note"` to each locale's message file. This places the key at the top level of `prophecy`, alongside `prophecy.title`, `prophecy.disclaimer`, `prophecy.fulfillment.*` — not grouped with the field labels under `prophecy.fields.*`.

This works mechanically (next-intl resolves dot-notation), but breaks the established convention. Future maintenance — e.g., someone searching for all prophecy card field labels, or grepping `prophecy.fields` — will miss the scholarly-note key. It also creates an inconsistency where `subject` (which has no UI render, same as the pre-existing behavior) IS under `prophecy.fields.subject`, while `scholarlyNote` (which DOES render) is not.

**Required fix:** Use `prophecy.fields.scholarlyNote` (and `prophecy.fields.scholarlyNote` in all 4 i18n files). The UI render should be `t("prophecy.fields.scholarlyNote")`. Update §3.3 and §3.4 accordingly.

### 4.2 `fulfillmentNotes` has no label; the plan gives `scholarlyNote` a label — design asymmetry needs justification

Looking at the current ProphecyCard render:

```tsx
{entry.fulfillmentNotes && (
  <p className="text-xs text-text-muted italic">
    {entry.fulfillmentNotes}
  </p>
)}
```

No label. It renders as an unlabeled italic paragraph. The plan proposes scholarly note with a labeled section:

```tsx
{entry.scholarlyNote && (
  <div className="mt-3 pt-3 border-t border-border-muted">
    <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
      {t("prophecy.scholarlyNote")}
    </p>
    <p className="text-xs text-text-muted italic">
      {entry.scholarlyNote}
    </p>
  </div>
)}
```

This creates two types of trailing-paragraph blocks: one labeled (scholarly note), one unlabeled (fulfillment notes). A reader looking at the Gen 3:15 card would see: readings, then an unlabeled italic line (fulfillment notes), then a labeled "Scholarly note" section (scholarly note). The unlabeled block reads as a caption or footnote with no declared purpose; the labeled block reads as a named section.

The asymmetry is a design choice that needs to be explicit. Two options:

**Option A (simpler — add label to `fulfillmentNotes` too):** Update `fulfillmentNotes` render to match `scholarlyNote` format — both labeled, both separated by a horizontal border. This requires touching one extra line in `prophecy-view.tsx` and adding `prophecy.fields.fulfillmentNotes` to all 4 message files. Cleaner UI; symmetrical.

**Option B (simpler — omit label on `scholarlyNote` too):** Drop the label from the scholarly-note render, matching `fulfillmentNotes` style. The two trailing paragraphs are ordered: fulfillment notes (italic, unlabeled) → scholarly note (italic, unlabeled, below a horizontal rule). The border alone separates them visually. No i18n key for label needed.

The plan should pick one. Currently the plan is inconsistent without explanation.

**Suggested:** Choose Option A (add label to both) — it makes the card structure uniform and improves scannability, at minimal cost (one extra line in views, 4 i18n keys: `prophecy.fields.fulfillmentNotes`). If the existing `fulfillmentNotes` behavior has been intentionally label-free, document why in §5 decisions.

### 4.3 Two new tests are a floor — locale-variant dispatch merits dedicated coverage

The plan adds 2 tests: "EN happy path + locale variant dispatch." But a robust test suite for a 4-locale parser change covers:

1. EN `**Scholarly note:** Some note.` → `entry.scholarlyNote === "Some note."`
2. PT-BR `**Nota acadêmica:** Some note.` → `entry.scholarlyNote === "Some note."`
3. DE `**Wissenschaftliche Anmerkung:** Some note.` → `entry.scholarlyNote === "Some note."`
4. ES `**Nota académica:** Some note.` → `entry.scholarlyNote === "Some note."`
5. Entry without `**Scholarly note:**` → `entry.scholarlyNote === undefined` (absent field stays absent)
6. Entry with both `**Scholarly note:**` AND `**Fulfillment notes:**` → both fields populated independently

Tests 1-4 directly verify that locale dispatch works. The existing test file uses parameterized patterns for locale variants (e.g., the confidence-label tests cover DOKUMENTIERT/DOCUMENTADO). That same pattern applies here.

The plan's "+2 tests → 23 → 25" is minimally viable but misses the absent-field invariant and the co-presence invariant. Suggest 4-6 new tests → 23 → 27/29. "Test count: 23 → 25" should change accordingly.

---

## 5. Minor Issues

### 5.1 `scholarlyNote` single-line constraint not stated in §3.2 or §5

Phase 11 audit R2.1 established that ALL fields captured by `FIELD_LINE = /^\*\*(.+?):\*\*\s*(.*)$/` must have their key and entire value on one line. Content after a line break is silently dropped. This applies to `scholarlyNote` exactly as it applies to `fulfillmentNotes`.

The 4 existing Genesis scholarly-note lines are all single-line (verified — each ends with `[POSSIBLE]` or `[UNCERTAIN]`). So no Genesis content is at risk now.

But the plan says §3.2: "the same R2.1 constraint applies. The 4 existing Genesis lines are already single-line — verified." This is correct but tucked inside a parenthetical. §5 Decisions should list it explicitly as a pinned decision:

> **`scholarlyNote` field format** | Same single-line constraint as `fulfillmentNotes` (per Phase 11 audit R2.1) — key and entire value on one line. Content after a line break is silently dropped by the `FIELD_LINE` regex.

This matters for future authoring of Gen 9/12 scholarly notes (when out-of-scope authoring eventually happens).

### 5.2 Content-lint §0.2 (em-dash) applies to PROPHECY files — scholarly note content already clean

Per Phase 11 audit R2.2, `content-lint.sh §0.2` applies to `$STUDY_DIRS` and blocks on ` -- ` (space-hyphen-hyphen-space). Phase 11.5 requires no new content authoring — the 4 existing scholarly-note lines are clean (verified). So this is not a Phase 11.5 risk; mentioning for completeness.

If future authors enrich Gen 9/12 with scholarly notes, the same constraint applies (use `—`, not ` -- `).

### 5.3 `subject` field has the same "parsed but not rendered" status — plan correctly documents this

The plan's §5 (Decisions) and §3.1 (Domain change) document that `scholarlyNote?: string` is optional for backward compatibility. The existing `subject` field in `types.ts` is also parsed but not rendered (per AUDIT_PHASE_11_PLAN §4.1). The plan notes at §5 "Phase 11 content migration: NONE" and correctly analogizes to the Genesis pattern.

No action required, but a brief mention that `scholarlyNote` IS rendered (unlike `subject`) helps distinguish the two fields for future readers of the plan.

### 5.4 Plan claims "dispatch at lines 137-189" — not independently verified

The plan references "lines 137–189" for the parser dispatch. The actual parser file is ~215 lines long with the dispatch starting roughly at line 113 (inside `parseProphecyMarkdown`). Line numbers shift with code changes and are implementation details. The plan's cross-reference should use function names rather than line numbers: "inside `parseProphecyMarkdown`, field dispatch section."

### 5.5 Editorial-log entry type: is this a translation/governance decision?

The plan proposes the entry in `docs/editorial-log/genesis.md`. Per Phase 11 audit §5.3 (which flagged a similar issue for Phase 11), the editorial log's §EDITORIAL LOG SPECIFICATION records translation/governance decisions. A parser+UI code fix is not a translation decision.

However, the argument for logging it here is stronger than for Phase 11 (which was pure content authoring): Phase 11.5 affects what readers see in the Genesis Prophecy view — the scholarly note on Gen 3:15 becomes visible for the first time. That IS a governance event for Genesis content. The existing pattern (Entry 2026-04-26-087 for architecture refactoring) shows code/infrastructure changes ARE logged here when they affect how Genesis content renders.

The plan's approach is acceptable. The entry should note that this is a parser+UI fix affecting Genesis content visibility, not a translation choice per se.

---

## 6. What Works Well

- **Diagnosis is correct.** The plan accurately traces the problem (parser dispatch gap → silent drop → no UI render) and correctly attributes it to the existing Genesis CHAPTER-3 files, not to Phase 11.
- **Scope is correctly bounded.** No content migration, no Phase 11 touch, no Gen 9/12 retroactive authoring — all correctly out of scope.
- **No dispatch collision.** The plan's proposed locale-key dispatch strings are correctly chosen to avoid colliding with the existing `fulfillmentNotes` dispatch (PT-BR "nota" ≠ "notas"; DE "anmerkung" ≠ "anmerkungen"). This is verified.
- **Position rationale (§3.3) is correct.** Scholarly note below fulfillment notes matches the Genesis file's own field ordering (Readings → Fulfillment notes → Scholarly note). Cognitive-flow argument holds.
- **Plain-text render choice is correct.** Consistent with `fulfillmentNotes` treatment; no new markdown-rendering inconsistency introduced.
- **Forward-tracking is honest.** §10 explicitly defers Gen 9/12 retroactive enrichment to content-author judgment, and Phase 11 content migration is explicitly not planned. Both are correct calls.
- **Single-line constraint acknowledged.** The plan recognizes the same R2.1 constraint applies to `scholarlyNote`; the 4 existing lines are verified clean.
- **Editorial-log numbering verified correct.** `2026-05-13-102` is the next available entry.
- **Effort estimate (~1.5h) is plausible.** 8 files, all well-scoped; the dispatch branch itself is 7 lines; the UI change is 8 lines; the i18n changes are 4 × 1 line; the type change is 1 line. The primary time cost is testing and the visual verification step.

---

## 7. Required Conditions Before Execution

In priority order:

1. **Show the `finalizeEntry` update in §3.2 explicitly (§3.1).** The code snippet must include `scholarlyNote: raw.scholarlyNote` in the return object. Add it to step 11.5.2 DoD: "`finalizeEntry` return object includes `scholarlyNote: raw.scholarlyNote`." Without this, the parser parses the field and then drops it.
2. **Fix i18n key to `prophecy.fields.scholarlyNote` (§4.1).** Update §3.3 render snippet and §3.4 i18n section. All 4 locale files add the key under `"fields"`, not at the `"prophecy"` root.
3. **Resolve `fulfillmentNotes` label asymmetry (§4.2).** Decide: Option A (add label to both) or Option B (omit label from scholarly note). Document the choice in §5 Decisions.
4. **Increase test count to 4-6 (§4.3).** One test per locale variant + absent-field invariant + co-presence invariant. Update "test count 23 → 25" to the correct target.
5. **Add single-line constraint to §5 Decisions (§5.1).** Binds future authoring for Gen 9/12 scholarly notes.

---

## 8. Recommendation

**Approve after items 1–5 are addressed.** Item 1 is the only true execution-blocker — adding the dispatch without updating `finalizeEntry` produces a silent no-op that exactly replicates the original bug. Items 2-5 are correctness and consistency improvements that cost minutes to implement.

After fixes, this is a straightforward, low-risk change. It is additive (one new optional field on one existing interface, one new conditional block in the UI, one new dispatch branch in the parser), it has no impact on any existing render paths, and the visual verification step (step 11.5.5) immediately confirms whether the 4 previously-silent scholarly notes are now visible.

No Lock Protocol. No content changes required. Execution begins at step 11.5.1 (types.ts). The ~1.5h estimate is plausible for the corrected scope.

---

**Audit complete.** All code claims verified against `types.ts`, `prophecy-parser.ts`, `prophecy-view.tsx`, all 4 i18n message files, `prophecy-parser.test.ts`, all 4 Genesis CHAPTER-3-PROPHECY locale files, and `docs/editorial-log/genesis.md`.
