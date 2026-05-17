# Audit of `PHASE_11_PLAN.md` (John & Matthew Prophecy Material — Option C)

**Date:** 2026-05-13
**Auditor:** Claude Opus 4.7 (independent review)
**Scope:** `docs/audit/archive/PHASE_11_PLAN.md` — 12 content files (3 chapters × 4 locales), 6 prophecy entries, execution in 7 steps (~7 h estimate).
**Method:** Verified plan claims against actual code: `src/infrastructure/content/prophecy-parser.ts`, `src/ui/prophecy/prophecy-view.tsx`, `src/ui/shared/chapter-view.tsx`, `src/domain/content/types.ts`. Verified Genesis prophecy schema from `content/en/genesis/study/CHAPTER-3-PROPHECY.md` and `CHAPTER-12-PROPHECY.md`. Verified John 3 CONTEXT cross-reference targets (§A6, §B2). Verified editorial-log numbering from `docs/editorial-log/john.md` (ends J-019). Verified fulfillment-status token table against `parseFulfillmentStatus`.
**Status:** Plan has two critical gaps that produce silently invisible content. Plus four significant concerns and authoring-discipline notes. Option C strategic choice is sound; cross-references and tokens are verified correct.

---

## 1. Executive Summary

Option C (hybrid — author prophecy files only for the three densest prophetic chapters) is the right call. The §4 decision table's fulfillment-status choices are appropriate. All cross-reference targets check out: John 3 CONTEXT has §A6 (*Hypsōthēnai*) and §B2 (bronze serpent / Numbers 21:8-9) exactly as cited. The locale token table is fully accurate — BEANSPRUCHT, REIVINDICADA, RECLAMADA, DEBATTIERT/DEBATIDA/DEBATIDO — all confirmed in `parseFulfillmentStatus`. No code changes are needed.

However the plan contains two critical gaps that will produce silently broken content if executed as written:

**Critical gap 1:** The plan's "Scholarly note" field does not exist in the parser or the UI. Any `**Scholarly note:** ...` line matches the field-line regex but falls through the parser's field-dispatch without being stored — silently dropped. `ProphecyCard` in `prophecy-view.tsx` renders only `title`, `fulfillmentStatus`, `verseRef`, `textSays`, `context`, `readings`, and `fulfillmentNotes`. There is no scholarly-note rendering element. Authors following the plan's DoD will write scholarly notes that never appear in the UI.

**Critical gap 2:** The plan's `→ See [target]` cross-reference lines are specified to go inside the Scholarly note. Since scholarly notes are silently dropped, all cross-references embedded in them are also dropped.

Both gaps share the same fix: move scholarly content and cross-references into `**Fulfillment notes:**`, which IS parsed and rendered. But `fulfillmentNotes` renders as plain text (no markdown), so `→ See M-002` won't be a hyperlink and `*parthenos*` won't italicize. The plan needs to acknowledge this and adjust authoring expectations accordingly.

---

## 2. Verification Table

| Plan claim | Verification result | Notes |
|---|---|---|
| `prophecy-view.tsx` exists and renders Prophecy tab | ✓ Verified | `ProphecyView` rendered in `chapter-view.tsx` at `{mode === "prophecy" && prophecy && <ProphecyView data={prophecy} />}` |
| Prophecy tab hidden when no entries (`hasProphecy` check) | ✓ Verified | `const hasProphecy = prophecy && prophecy.entries.length > 0` + mode filter |
| Parser auto-discovers PROPHECY files — no code changes | ✓ Consistent with Genesis pattern | Genesis 3/9/12 PROPHECY files confirm the pattern |
| John 3 CONTEXT §A6 *Hypsōthēnai* cross-reference target | ✓ Verified | §A6 "lifted up as double meaning" — confirmed present with exact bronze-serpent link |
| John 3 CONTEXT §B2 bronze-serpent background | ✓ Verified | §B2 "The bronze serpent — Numbers 21:8–9 as interpretive key" — confirmed |
| M-001 §Composite / §Typological / §Temporal-resultive / §Unresolved targets | ✓ Verified | All four formula types present as table rows in M-001 |
| M-002 *parthenos*/*almah* slash policy target | ✓ Verified | Entry M-002 has full rationale |
| BEANSPRUCHT (DE CLAIMED) token in parser | ✓ Verified | `n.includes("BEANSPRUCHT")` confirmed |
| REIVINDICADA (PT-BR CLAIMED) token | ✓ Verified | `n.includes("REIVINDICADA")` confirmed |
| RECLAMADA (ES CLAIMED) token | ✓ Verified | `n.includes("RECLAMADA")` confirmed |
| DEBATTIERT / DEBATIDA / DEBATIDO (DEBATED) tokens | ✓ Verified | All three confirmed |
| "Scholarly note" field parsed and rendered | ✗ **CRITICAL — WRONG.** | Not a recognized parser field. Silently dropped. Not rendered in ProphecyCard. See §3.1. |
| `→ See [target]` lines in Scholarly note are rendered | ✗ **CRITICAL — WRONG.** | Dropped with the scholarly note. See §3.2. |
| `subject` field rendered to readers | ✗ **Parsed but NOT rendered.** | `ProphecyEntry.subject` is set by parser. `ProphecyCard` has no rendering path for it. See §4.1. |
| `fulfillmentNotes` renders markdown | ✗ **Plain text only.** | `{entry.fulfillmentNotes}` — no `dangerouslySetInnerHTML`. Markdown won't format. See §4.2. |
| `textSays` and `context` render markdown | ✗ **Plain text only.** | Both render as plain string interpolation. |
| Reading text renders markdown | ✓ Verified | `r.reading` uses `dangerouslySetInnerHTML` + `renderMarkdownSafe` — markdown works here. |
| Editorial-log J-020 is next available for John | ✓ Verified | `docs/editorial-log/john.md` ends at J-019 (Phase 7 John). J-020 is next. |
| Test baseline 796/796 + 23 prophecy tests | Unverified (no test run) | Stated as "verified at draft time." See §4.4. |

---

## 3. Critical Gaps — Must Resolve Before Execution

### 3.1 "Scholarly note" does not exist in the parser or UI — silently dropped

The plan's §4 states that "each entry carries a '**Scholarly note:**' paragraph." The DoD (§8) lists Scholarly note as a required field:

> Each entry has: Verse, Text says, Context, Subject, Fulfillment status, Readings, **Scholarly note**, and a → See [target] cross-reference line.

**Verified against `prophecy-parser.ts`:** The parser dispatches recognized field keys using `key.includes(...)` checks for: `verse/versículo/vers`, `text says/texto dice/texto diz/text sagt`, `context/contexto/kontext`, `subject/sujeto/sujeito/gegenstand`, `fulfillment status/erfüllungsstatus`, `fulfillment notes/notas/anmerkungen`, `readings/lecturas/leituras/lesarten`. Any other `**Key:** Value` line matching `FIELD_LINE` is processed but falls through all checks without storing its value. "scholarly note" / "nota académica" / "wissenschaftliche Anmerkung" — none match. The content is silently discarded.

**Verified against `prophecy-view.tsx`:** `ProphecyCard` renders: `entry.title`, `entry.fulfillmentStatus`, `entry.verseRef`, `entry.textSays`, `entry.context`, `entry.readings`, `entry.fulfillmentNotes`. No scholarly-note element exists. The `ProphecyEntry` interface in `types.ts` has no `scholarlyNote` field.

**This bug already exists in the Genesis prophecy files.** `content/en/genesis/study/CHAPTER-3-PROPHECY.md` has `**Scholarly note:** The Hebrew *hu* ("he")...` — this scholarly note renders in the markdown file but is silently dropped when parsed. Phase 11 is following a broken pattern from Genesis without recognizing it is broken.

**Required fix:** All scholarly content planned for "Scholarly note" must be authored in `**Fulfillment notes:**` instead. That key IS recognized (`key.includes("fulfillment notes") || key.includes("notas") || key.includes("anmerkungen")`) and IS rendered by `ProphecyCard` as a small italic paragraph at the bottom of each card.

Revised authoring pattern:

```markdown
**Fulfillment notes:** Hosea's original context describes Israel's historical exodus, not a future-tense prophecy. Matthew's use is typological reapplication, attested in Second Temple Jewish interpretation. → See M-001 §Typological.
```

Update §4 last paragraph, §5 cross-reference format row, §8 DoD, and §9 Risk 3 to reflect this.

### 3.2 `→ See [target]` cross-references placed in Scholarly note are also dropped

The plan's §5 convention table specifies:

> **Cross-reference format** | `→ See [target]` lines **at the end of each entry's Scholarly note**.

Since scholarly notes are silently dropped, every cross-reference pointer specified in the plan is also dropped. Readers will see no pointer to M-001, M-002, or CONTEXT §A6/§B2.

**Required fix:** Move `→ See [target]` lines into `**Fulfillment notes:**` alongside the scholarly content. Per §4.2, note that the arrow renders as plain text (not a hyperlink), which is still readable as a directional pointer. Update §5 cross-reference format row accordingly.

---

## 4. Significant Concerns

### 4.1 `subject` field is parsed but never rendered — invisible to readers

`ProphecyEntry` in `types.ts` has `subject: string`. The parser stores it. `ProphecyCard` has no rendering path for `entry.subject`. The field is in the data model but invisible to readers.

The plan's DoD requires "Subject" as a listed field. This is achievable for data-model integrity, but the value will not appear in the Prophecy view. This is consistent with how the existing Genesis prophecy files handle Subject (they have the field, it's parsed, it's not shown) — likely intentional.

**Suggested:** Add a note to §4: "The Subject field serves as internal metadata and authoring context. It is parsed and stored in the data model but not currently rendered in ProphecyCard — consistent with existing Genesis prophecy files."

### 4.2 `fulfillmentNotes` renders as plain text — no markdown

After the §3 fix, scholarly content and cross-references land in `fulfillmentNotes`. `ProphecyCard` renders this as:

```jsx
<p className="text-xs text-text-muted italic">
  {entry.fulfillmentNotes}
</p>
```

No `dangerouslySetInnerHTML`. No `renderMarkdownSafe`. Consequences:
- `*parthenos*` renders as `*parthenos*` (asterisks visible).
- `→ See M-002` renders as the literal string (no link).
- `**bold**` renders as `**bold**` (asterisks visible).

The `→ M-002` pointer is still readable as plain text — functional as a directional pointer. But authors should not use markdown in `fulfillmentNotes`.

**Contrast:** Reading text (`r.reading`) IS markdown-rendered via `renderMarkdownSafe`. Markdown, including `*italics*` and links, works in reading body text. Authors wanting styled content or clickable links should embed them in the reading body.

**Suggested:** Add to §5 conventions table:

> **Markdown in fields** | `textSays`, `context`, `fulfillmentNotes` render as plain text — no markdown. Readings render markdown. Place any styled citations or links inside the reading body.

### 4.3 Reading line regex requires single-line format — multi-line readings are silently truncated

The parser uses:

```javascript
const READING_LINE = /^- \*\*(.+?)(?:\s*\/\s*(.+?))?\*\*:\s*(.+)\s*\[(.+?)\]$/;
```

Each reading must be a single unbroken line ending with `[CONFIDENCE]` at the very end (`$` anchor). A multi-line reading only captures the first line and loses the rest. A blank line between readings terminates the readings block — readings after the blank line are silently dropped. Trailing whitespace after `]` also breaks the match.

This is consistent with Genesis prophecy file conventions, but Phase 11's entries (especially Hos 11:1 typological note and Natsri unresolved-source discussion) are descriptively richer and may tempt editors to add line breaks.

**Suggested:** Add to §5 conventions table:

> **Reading format** | Each reading is a single unbroken line: `- **Tradition**: Reading text. [CONFIDENCE]`. No trailing whitespace after `]`. No blank lines between readings — a blank line terminates the reading block and subsequent readings are dropped silently.

### 4.4 Test baseline asserted at draft time; should be re-verified before step 11.1

The plan states "pnpm test reports 796/796 + prophecy-parser 23/23 (verified at draft time)." J-019 (Phase 7 John) is also dated 2026-05-13. Phase 7 is content-only (no new parser tests) so 796/796 should be stable, but a same-day draft assertion is a weak baseline.

**Suggested:** Strengthen §6 pre-execution check: "Run `pnpm test` and `pnpm content:lint` immediately before step 11.1, regardless of the draft-time assertion. Record the actual count in editorial-log entry J-020."

---

## 5. Minor Issues and Authoring Notes

### 5.1 DoD entry-count wording is ambiguous

§8 DoD: "All 12 files authored with **6 prophecy entries each per locale**."

"6 entries each per locale" reads as 6 entries per file (36 entries total), which is wrong. Correct counts: John 3 has 1 entry; Matthew 1 has 1 entry; Matthew 2 has 4 entries. Total per locale: 6 entries across 3 files.

**Suggested:** Change to "6 prophecy entries total across the 3 files per locale (1 in John 3; 1 in Matt 1; 4 in Matt 2)."

### 5.2 Islamic readings for non-engaged passages need explicit model wording

For the Natsri unresolved-source entry (Matt 2:23), the Quran has no engagement with the specific source of "Natsri." The plan notes this correctly but doesn't give model wording. A concrete template for the executor:

```
- **Islamic**: The Quran does not address the specific origin of the title "Natsri" (Nazarene). Isa (Jesus) is presented as prophet and word of God (Surah 19:30-34), but his connection to Natseret is not discussed. [DOCUMENTED]
```

`[DOCUMENTED]` is correct here — the Quran's silence is an attested state of the tradition.

### 5.3 `inReadings` terminates on `**` — `**Fulfillment notes:**` must follow readings correctly

After the last reading line, the next `**` line (whether `**Fulfillment notes:**` or a blank line) correctly sets `inReadings = false`. Standard Genesis file ordering is:

```markdown
**Readings:**
- **Jewish**: ... [DOCUMENTED]
- **Christian**: ... [DOCUMENTED]
- **Islamic**: ... [DOCUMENTED]
**Fulfillment notes:** ...
```

This ordering works. Blank lines before `**Fulfillment notes:**` also work. The only failure mode is a non-`**`, non-blank, non-reading-format line appearing after the readings — this would be ignored, not parsed as part of any field.

### 5.4 M-018 editorial-log numbering is likely correct but should be re-verified

The plan says M-018 is next for Matthew. J-019 cross-references "M-017 (sister entry, Matthew block)" — confirming M-017 has been authored as the Phase 7 Matthew entry. M-018 should therefore be correct. However, this was not directly verified against the current state of `docs/editorial-log/matthew.md`. Recommend checking before authoring M-018 to avoid duplicate numbering.

---

## 6. What Works Well

- **Option C rationale is sound.** John 3, Matthew 1, Matthew 2 are the genuinely densest prophetic chapters in scope. The choice avoids Option B's duplication problem while meaningfully populating the Prophecy view.
- **§4 decision table pre-resolves all six entries.** Pinning fulfillment status, reading confidence, and cross-reference targets before execution is exactly the right discipline. Locale propagation can be mechanical rather than interpretive.
- **Cross-reference targets are all verified correct.** John 3 CONTEXT §A6, §B2, M-001 (all four formula types), M-002 — every target exists and contains the content described. This is the audit's most important positive finding.
- **Fulfillment-status token table is fully accurate.** All locale variants confirmed in parser code. Risk 4 is genuinely low.
- **Canary execution pattern (11.1 first).** Correct discipline. Author one file, verify UI tab appears and content renders, then propagate.
- **Hos 11:1 typological framing (Risk 2).** The plan's "typological reapplication, not future-tense prophecy" framing is theologically precise and matches M-001 §Typological language exactly.
- **No duplication of M-001 / M-002 (Risk 3).** The plan correctly designates these as cross-reference targets rather than restating their content in the prophecy entries.
- **Islamic silence acknowledged proactively.** Stating explicitly that the Quran doesn't engage certain texts (rather than omitting the Islamic reading) is the correct approach.
- **No Lock Protocol question.** Phase 11 makes no rule changes, no schema changes, no code changes. Clean content-only phase.

---

## 7. Required Conditions Before Execution

In priority order:

1. **Replace all "Scholarly note" with "Fulfillment notes" throughout the plan (§3.1).** Update §4 last paragraph, §5 cross-reference format row, §8 DoD required fields, and §9 Risk 3 phrasing.
2. **Update `→ See [target]` placement to Fulfillment notes (§3.2).** Update §5 cross-reference format row.
3. **Add plain-text limitation note for `fulfillmentNotes` to §5 (§4.2).** Authors should not use markdown in Fulfillment notes.
4. **Fix DoD entry-count wording from "6 each" to "6 total across 3 files" (§5.1).** Prevents confusion about per-file expectations.
5. **Add single-line reading format requirement to §5 (§4.3).** No multi-line readings, no trailing whitespace after `[CONFIDENCE]`, no blank lines between readings.
6. **Add Subject-is-metadata note to §4 (§4.1).** Prevents executor from searching for subject text in the UI.

---

## 8. Recommendation

**Approve after items 1–6 are addressed.** Items 1 and 2 are genuine execution-blockers — running the plan as written produces 12 PROPHECY files where all scholarly content and every cross-reference are silently discarded and never rendered. The Prophecy tab would appear, entries would show title / fulfillment-status / verseRef / textSays / context / readings, but the scholarly context and cross-reference pointers the plan specifically designs for would be invisible.

After fixes, this is a well-scoped, clean content phase. The strategic choice, entry selection, fulfillment-status decisions, and cross-reference targets are all sound. The ~7h estimate is plausible for 6 entries × 4 locales + editorial-log + meta-doc sync.

No Lock Protocol. No code changes. Execute step 11.1 (EN John 3 canary) first; verify the Prophecy tab appears and `fulfillmentNotes` content renders in the italic paragraph; then propagate to the remaining 11 files.

---

**Audit complete (round 1).** All code claims verified against `prophecy-parser.ts`, `prophecy-view.tsx`, `chapter-view.tsx`, `types.ts`. All content cross-reference targets verified against actual files. One systemic bug identified in the existing Genesis prophecy files (scholarly notes silently dropped) — addressed in plan revision.

---

## Post-Revision Second-Pass Verification (2026-05-13)

After Claude Code revised the plan (absorbing all round-1 findings), conducted a deeper verification pass covering areas not checked in round 1: `fs-content-repository.ts` (file path construction and failure modes), `scripts/content-lint.sh` (what rules apply to PROPHECY files), `src/ui/shared/render-markdown-safe.ts` (exact markdown rendering in reading cards), `prophecy-parser.test.ts` (what the 23 tests actually cover and document), and `content/en/genesis/study/CHAPTER-9-PROPHECY.md` (additional schema reference).

### Round-2 Verification Table

| Area verified | Finding | Impact on plan |
|---|---|---|
| `readProphecy` file path | `content/{locale}/{book}/study/CHAPTER-{N}-PROPHECY.md` — exactly matches plan §3 | ✓ Confirmed correct |
| `readProphecy` failure mode | Returns `null` on file-not-found → `hasProphecy = false` → tab hidden | ✓ Current John/Matt behavior confirmed |
| `generateStaticParams` | Built from `CHAPTER-N.md` files only — not from PROPHECY files | ✓ No code changes needed, confirmed |
| Content-lint §0.1 (ruleset stamp) | Applies to `$STUDY_DIRS` including study/ — checks PROPHECY files for stale v3.0/3.1/3.2 stamps | ✓ Plan's front-matter `v3.3` is correct |
| Content-lint §0.2 (em-dash) | Applies to `$STUDY_DIRS` — ` -- ` in PROPHECY file content triggers blocking error | ⚠ **New concern — see §R2.2** |
| Content-lint: Ruleset presence | §0.1 only flags WRONG versions, NOT missing versions | ⚠ Missing Ruleset line passes lint — DoD must rely on visual inspection |
| `renderMarkdownSafe("note")` | Handles `**bold**` → `<strong>`, `*italic*` → `<em>`, `\n` → `<br/>`, `\n- ` → `<br/>•`. No link rendering | ✓ Italic/bold work in readings; `→ See M-002` in reading body = plain text |
| `fulfillmentNotes` multi-line | `FIELD_LINE = /^\*\*(.+?):\*\*\s*(.*)$/` captures `(.*)` on the SAME line only | ⚠ **New concern — see §R2.1** |
| Test file: UNFULFILLED parser comment | Comment says "FULFILLED checked before UNFULFILLED" but code checks UNFULFILLED first — comment is stale | Non-blocking; stale documentation in test file |
| Test coverage: locale fulfillment tokens | DE/PT/ES fulfillment status tokens (BEANSPRUCHT etc.) verified against source code but NOT exercised in test suite | Acceptable; plan verifies tokens against parser code directly |
| Genesis 9 PROPHECY — sub-tradition format | `- **Christian / Scholarly**: ...` uses `/` separator → `r.subTradition` field — rendered in ProphecyCard | Phase 11 doesn't use sub-traditions, but the feature exists if needed |
| Genesis 9 PROPHECY — empty fulfillmentNotes | `**Fulfillment notes:**` with no value is valid (stored as empty string → ProphecyCard renders nothing) | ✓ Consistent with plan |

### R2.1 `fulfillmentNotes` content must be on the same line as the field key — not stated explicitly

The parser captures `fulfillmentNotes` via the `FIELD_LINE` regex:

```javascript
const FIELD_LINE = /^\*\*(.+?):\*\*\s*(.*)$/;
// key = fieldMatch[1].trim().toLowerCase()  → "fulfillment notes"
// value = fieldMatch[2].trim()              → everything after **: on that one line
```

`fieldMatch[2]` is `(.*)` — everything to the end of the current line. Content on a second line does not match `FIELD_LINE` (no `**Key:**` prefix) and is silently discarded.

This means the following authoring pattern **silently loses all content**:

```markdown
**Fulfillment notes:**
Matthew quotes the LXX (parthenos) rather than the Hebrew (almah).
Isaiah 7:14's original context addresses King Achaz. → See M-002.
```
Result: `fulfillmentNotes = ""` — nothing renders.

The correct pattern (key + value on ONE line):

```markdown
**Fulfillment notes:** Matthew quotes the LXX (parthenos) rather than the Hebrew (almah). Isaiah 7:14's original context addresses King Achaz during the Syro-Ephraimite crisis (c. 735 BCE); Matthew applies typologically. → See M-002.
```
Result: entire string renders in ProphecyCard italic paragraph. ✓

The revised plan shows a single-line example (correct), but §5 conventions table does not explicitly state: *"the field key and its entire value must be on the same line; content on subsequent lines is silently dropped."* This is the same kind of implicit constraint as the reading single-line rule (S2), which the revision DID make explicit.

**Required fix:** Add to §5 conventions table:

> **`fulfillmentNotes` field format** | Key and entire value on ONE line: `**Fulfillment notes:** Full scholarly framing here. → See M-002.` Content after a line break is silently dropped by the parser's `FIELD_LINE` regex. Long lines are acceptable; line breaks are not.

### R2.2 Content-lint §0.2 (em-dash) applies to PROPHECY file content — year-range `--` triggers a blocking error

`scripts/content-lint.sh` applies rule `§0.2` to `$STUDY_DIRS` (which includes `content/{locale}/{book}/study/`). Rule §0.2 checks for ` -- ` (space-hyphen-hyphen-space) and fails the lint if found:

```bash
check_pattern "0.2" "Raw em-dash residue ' -- ' (use em-dash —)" " -- " "$CONTENT_DIRS $STUDY_DIRS $PEOPLE_FILES"
```

ProphecyCard's `fulfillmentNotes` renders as plain text. Authors may inadvertently write year ranges or compound dates using `--` shorthand (e.g., `735 BCE -- the Syro-Ephraimite crisis` or `Mic 5:1 -- composite formula`). If ` -- ` appears anywhere in any PROPHECY file, `pnpm content:lint` fails with a blocking error, causing `pnpm build` to fail.

The plan's `§0.2` risk is not mentioned. The plan's DoD requires `pnpm content:lint` exit 0 — this constraint implicitly covers it, but authors won't know to avoid ` -- ` in PROPHECY content without an explicit note.

**Required fix:** Add to §5 conventions table or authoring notes:

> **Em-dash in fulfillmentNotes** | Use the Unicode em-dash `—` (or a comma/semicolon) for ranges and compounds. Do NOT use ` -- ` (space-hyphen-hyphen-space) — this triggers content-lint §0.2 and blocks the build. Applies to all text in all PROPHECY fields.

### R2.3 Stale parser test comment — not a Phase 11 issue, but documentation debt

`prophecy-parser.test.ts` contains a test for UNFULFILLED with this comment:

```javascript
it("UNFULFILLED: known parser limitation — all forms collide with FULFILLED check", () => {
  // Parser bug: parseFulfillmentStatus checks FULFILLED (and its localized
  // forms ERFÜLLT, CUMPLIDA, CUMPRIDA) before UNFULFILLED. Every known
  // localized form of UNFULFILLED contains a substring that fires the
  // FULFILLED branch first, making UNFULFILLED unreachable.
```

But the current parser code checks UNFULFILLED **before** FULFILLED:

```javascript
if (n.includes("UNFULFILLED") || n.includes("UNERFÜLLT") || n.includes("NO CUMPLIDA") || n.includes("NÃO CUMPRIDA"))
  return "UNFULFILLED";
if (n.includes("FULFILLED") || n.includes("ERFÜLLT") || n.includes("CUMPLIDA") || n.includes("CUMPRIDA"))
  return "FULFILLED";
```

The described bug does not exist in the current code. The test expectation (`toBe("UNFULFILLED")`) is correct and passes. The comment was written when the bug existed and was not updated when the bug was fixed. A future developer reading the comment might try to "fix" a non-issue.

Phase 11 does not use UNFULFILLED status (all entries use CLAIMED, DEBATED, or PARTIAL), so this is not a Phase 11 blocker. But the test comment should be updated in a future maintenance pass. Forward-track in `DEFERRED_TASKS.md` or fix in step 11.7.

### R2.4 Content-lint does not verify Ruleset line is present

Lint rule §0.1 pattern:
```bash
"\*\*Ruleset:\*\* v3\.0|\*\*Ruleset:\*\* v3\.1|\*\*Ruleset:\*\* v3\.2|..."
```

This flags **wrong** versions but does NOT flag **missing** Ruleset lines. A PROPHECY file with no `**Ruleset:**` line at all passes lint without error. The plan requires front-matter `**Ruleset:** v3.3` for each file, but lint won't catch omissions.

This is consistent with how other content files are treated (lint checks for wrong, not missing). It's not unique to Phase 11. The plan's post-execution DoD audit pass should explicitly include: *check that each of the 12 PROPHECY files has `**Ruleset:** v3.3` in front-matter.*

### Round-2 Required Additions

Both R2.1 and R2.2 should be addressed before execution — one is a silent data loss risk, the other is a build-blocking lint risk. R2.3 and R2.4 are non-blockers.

1. **R2.1 (must fix before execution):** Add explicit statement to §5 conventions: `fulfillmentNotes` key and value must be on one line. Content after a line break is silently dropped.
2. **R2.2 (must fix before execution):** Add explicit note to §5: no ` -- ` in PROPHECY content (use `—`); triggers content-lint §0.2 and blocks build.
3. **R2.3 (improvement):** Update the stale UNFULFILLED test comment in `prophecy-parser.test.ts`. Minimal effort; do it in step 11.7.
4. **R2.4 (improvement):** Add to post-execution DoD audit: verify `**Ruleset:** v3.3` present in all 12 files.

### Round-2 Confirmed Correct

- All round-1 critical findings (C1 scholarly-note, C2 cross-references) fully and correctly absorbed in the revision ✓
- All round-1 significant findings (S1–S4) correctly absorbed ✓
- File path `content/{locale}/{book}/study/CHAPTER-{N}-PROPHECY.md` matches plan §3 ✓
- No `generateStaticParams` changes needed ✓
- Italic/bold formatting works in reading text via `renderMarkdownSafe` ✓
- All locale fulfillment-status tokens verified against parser source ✓
- Canary execution pattern (11.1 first) still the right discipline ✓

### Round-2 Recommendation

**Approve after R2.1 and R2.2 are addressed.** Both are short additions to §5 conventions (two table rows). After those additions, execute at step 11.1. The stale test comment (R2.3) can be fixed in step 11.7 alongside editorial-log entries — low effort, good hygiene.
