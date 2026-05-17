# Audit of `PHASE_10_PLAN.md` (Author John PEOPLE.md)

**Date:** 2026-05-14
**Auditor:** Claude Opus 4.7 (independent review)
**Scope:** `docs/audit/archive/PHASE_10_PLAN.md` — 4 new files at `content/{en,pt-br,de,es}/john/PEOPLE.md`, 11 entries × 4 locales = 44 entries, ~18.5h estimate.
**Method:** Verified plan claims against: `src/infrastructure/content/people-parser.ts`, `src/ui/people/person-card.tsx`, `src/app/[locale]/[book]/people/page.tsx`, `src/infrastructure/content/__tests__/people-parser.test.ts`, `src/infrastructure/i18n/messages/{en,pt-br,de,es}.json`, `content/en/matthew/PEOPLE.md`, `docs/editorial-log/john.md`.
**Status:** Plan is strategically sound. No execution blockers. Two significant specification gaps that need addressing before authoring begins. Several minor clarifications that will prevent silent authoring errors.

---

## 1. Executive Summary

The plan's strategic decisions are all correct: Option C scope (John 1–3 only), the 4 scope-category classification, the Yeshua see-only direction (→ matthew/PEOPLE.md), the Yehudim group-entry deviation, the OT-figure dangling-pointer stubs, the cross-book see-only pattern mirror from Matthew. The §5 conventions table is thorough and the locale alias verifications are accurate.

Everything that was verified against the actual code:

- `bookLabels` map in `people/page.tsx` already has `genesis`, `matthew`, **`john`** — plan claim verified ✓
- `inBook` parser aliases include `"in john"`, `"em joão"`, `"in johannes"`, `"en juan"` — plan claim verified ✓
- `crossBookSee` aliases `["see", "ver", "siehe"]` match plan's §5 table — verified ✓
- `parseCrossBookSlug` provides graceful fallback for unknown-book slugs — verified ✓ (with a mechanism caveat; see §3.2)
- `people.inBook.john` i18n key exists in all 4 locale message files — verified ✓
- Editorial-log john.md ends at J-020 (Phase 11 closure, 2026-05-13) — J-021 is correct next entry ✓
- Test count: people-parser.test.ts has exactly 51 tests (counted) — plan's "51/51" claim verified ✓
- Cross-book see-only pattern in matthew/PEOPLE.md confirmed: `**See:** genesis/PEOPLE.md` + `**In Matthew:** ...` — plan's proposed John mirror is correct ✓
- Matthew/PEOPLE.md Yochanan entry confirmed as a full bio entry — exists, has complete fields ✓

Two significant specification gaps were found, both involving fields that are described as rendered by the UI but will actually be silently dropped by the parser.

---

## 2. Verification Table

| Plan claim | Verification result | Notes |
|---|---|---|
| `bookLabels` map already has `john` | ✓ Verified | `people/page.tsx`: `john: t("book.john")` present |
| `"in john"` alias in `inBook` field dispatch | ✓ Verified | `EXACT_LABEL_ALIASES.inBook` includes `"in john"`, `"em joão"`, `"in johannes"`, `"en juan"` |
| `crossBookSee` aliases: EN `see`, PT-BR `ver`, DE `siehe`, ES `ver` | ✓ Verified | `EXACT_LABEL_ALIASES.crossBookSee: ["see", "ver", "siehe"]` |
| `parseCrossBookSlug` returns `null` for unknown slugs | ✗ **Partially wrong.** | Returns the slug (e.g., `"exodus"`); `!bookLabels[slug]` triggers fallback, not a `null` return. See §3.2. |
| Cross-book see-only pattern: `**See:** book/PEOPLE.md` + `**In Book:** ...` | ✓ Verified | Confirmed in `content/en/matthew/PEOPLE.md` (Avraham, Yitschaq entries) |
| `people.inBook.john` i18n key exists in all 4 locales | ✓ Verified | All 4 message files have `"inBook": { "genesis": ..., "matthew": ..., "john": ... }` |
| Editorial-log john.md ends at J-020 | ✓ Verified | J-020 = Phase 11 Option C closure (2026-05-13). J-021 is correct next. |
| Test count 51/51 people-parser tests | ✓ Verified | Counted: 4+5+9+2+2+14+4+4+3+4 = 51 tests across all describe blocks |
| Test baseline 801/801 | Unverified (no test run) | See §4.4 re: Phase 11.5 execution status |
| Yehudim group entry parses correctly via `**First mention:**` anchor | ✓ Verified (with caveat) | Parser uses H2 heading, not `Verse` field. See §3.1 (critical specification error). |
| `**Senses:**` field renders in Yehudim PersonCard | ✗ **Wrong.** | Unknown field — silently ignored. See §3.3. |
| `**Note:**` field in full entries renders in PersonCard | ✗ **Wrong.** | `note` not in `EXACT_LABEL_ALIASES` — silently ignored. See §3.4. |
| `buildRenderItems` skips dividers for non-genesis books | ✓ Verified | `if (book !== "genesis") continue;` — flat chronological list for John ✓ |
| People page 404s for `/john/people` currently | ✓ Verified | `getPeopleData` returns `null` with no file → `notFound()` |
| No new parser tests needed (schema unchanged) | ✓ Verified | PersonEntry schema is identical; all existing patterns already covered |
| SKIP_NAME_PATTERNS won't match `## Yehudim (...)` | ✓ Verified | No pattern matches "Yehudim" or its surrounding text |
| `**Historical year:**` bare integer convention per audit §3.2 of AUDIT_NEW_PLAN | ✓ Cited correctly | `parseInt10()` helper in parser; convention documented in Entry 2026-05-09-101 |

---

## 3. Significant Concerns

### 3.1 §4.3 parser anchor description is wrong — people-parser does NOT check for a `Verse` field

Plan §4.3:

> "Parser will skip the H2 entry if no `Verse` field is present, but here we use first-mention as the anchor."

**This is false.** The `Verse` field is a prophecy-parser concept (`parseProphecyMarkdown` checks `current?.verseRef`). The people-parser (`parsePeopleMarkdown`) has no `Verse` field at all. Its entry boundary is the H2 heading, and its finalization check is `if (state.current?.name)` — i.e., any H2 heading that's not in `SKIP_NAME_PATTERNS` creates a parseable entry.

The Yehudim group entry WILL parse correctly because:
- `## Yehudim (the Judeans / the Jews)` → `state.current = { name: "Yehudim", familiarName: "the Judeans / the Jews", ... }`
- `**First mention:** Jn 1:19` → `raw.firstMention = "Jn 1:19"`
- `**Mentioned in:** ...` → `raw.mentionedIn = [...]`
- `**Key events:** ...` → `raw.keyEvents = [...]`
- `flushEntry` fires at the next H2 → `state.current?.name` is `"Yehudim"` → entry added

The conclusion (Yehudim parses fine) is correct. The mechanism description is wrong.

**Required fix:** Remove the parenthetical "Parser will skip the H2 entry if no `Verse` field is present" from §4.3. Replace with the accurate statement: "The people-parser anchors on the H2 heading for the entry boundary. `**First mention:**` provides the `firstMention` field; `**Mentioned in:**` provides `mentionedIn`. No `Verse` field exists in the people-parser — that's the prophecy-parser. Unknown fields (`**Group entry:**`, `**Senses:**`, `**Cross-reference:**`) are silently ignored."

This matters because a future executor who re-reads §4.3 may try to add a `**Verse:**` field to the Yehudim entry (thinking it's required) and wonder why nothing breaks — or worse, misapply the concept.

### 3.2 Dangling-pointer fallback mechanism description is inaccurate

Plan §4.2: "the dangling pointer renders gracefully per `parseCrossBookSlug` returning `null`."

**Not quite.** Looking at `person-card.tsx`:

```typescript
function parseCrossBookSlug(pointer: string): string | null {
  const match = pointer.trim().match(/^([a-z][a-z-]*)\/PEOPLE\.md$/i);
  return match ? match[1].toLowerCase() : null;
}

// Later in CrossBookSeeField:
const slug = parseCrossBookSlug(pointer);
if (!slug || !bookLabels[slug]) {
  return <Field label={label} value={pointer} />;
}
```

For `**See:** exodus/PEOPLE.md`:
- `parseCrossBookSlug("exodus/PEOPLE.md")` returns `"exodus"` (not `null`) — the regex matches
- `bookLabels["exodus"]` is `undefined`
- `!bookLabels[slug]` is `true` → fallback fires

`parseCrossBookSlug` returns `null` only when the pointer doesn't match the expected shape (e.g., a malformed pointer with spaces or no `/PEOPLE.md` suffix). The graceful fallback for valid-but-unknown-book pointers is triggered by the `!bookLabels[slug]` check, not by a `null` return.

**Practical impact:** The rendering is exactly as described — the UI shows `[See full bio in label] | exodus/PEOPLE.md` as plain-text field. But the description of the mechanism is wrong, and if anyone ever adds `exodus` to `bookLabels` (when Exodus is authored), the pointer will automatically start rendering as a live link without any change to the John PEOPLE.md files. That's good behavior and should be noted.

**Required fix:** §4.2 and §9 Risk 3 should say "because `bookLabels['exodus']` is undefined, the `CrossBookSeeField` renders a plain-text fallback" rather than "parseCrossBookSlug returns null."

Also: note that the plain-text rendering shows the raw pointer value `exodus/PEOPLE.md` (not `See: exodus/PEOPLE.md`). The UI label comes from `t("people.crossBookSee")` = "See full bio in". So the reader sees:

```
See full bio in  exodus/PEOPLE.md
```

Not "See: exodus/PEOPLE.md" as the plan describes. A cosmetic difference, but worth accurate documentation.

### 3.3 Yehudim `**Senses:**`, `**Cross-reference:**`, and `**Group entry:**` fields are silently ignored — the 3-sense breakdown will NOT appear in the PersonCard UI

The plan's §4.3 describes the Yehudim group entry with fields including `**Senses:**` (3-sense breakdown) and `**Cross-reference:**`. These fields are not in `EXACT_LABEL_ALIASES` in `people-parser.ts`. They will be silently dropped by `resolveField()` returning `undefined` — neither stored nor rendered.

The only fields from the Yehudim entry that WILL render in the PersonCard are:
- Name/familiarName from H2 heading: "Yehudim / (the Judeans / the Jews)"
- `firstMention` field → shown if PersonCard renders it (currently `firstMention` is NOT in the PersonCard render list — it's stored but not displayed)
- `mentionedIn` field → not rendered individually in PersonCard (no `<ListField label={labels.mentionedIn}>` in the current render list)
- `keyEvents` field → also not in PersonCard render list

**More specifically:** looking at the current PersonCard render paths, neither `firstMention`, `mentionedIn`, nor `keyEvents` are rendered as visible UI elements. The PersonCard renders: crossBookSee, inBook, generationsFrom, nameMeaning, lifespan, birthYear, deathYear, profession, socialClass, hometown, placesLived, father, mother, siblings, spouses, children, ageAtFatherhood, causeOfDeath, characterArc, booksAppearingIn, archaeologicalEvidence, extraBiblicalMentions, regionsByText, curiosities. The Yehudim group entry has NONE of these fields.

**Result:** The Yehudim PersonCard accordion would expand to show... nothing. Just the header (name, no lifespan, possibly a historicityStatus badge). An empty expanded card.

This is a significant problem. The plan intends the Yehudim entry to surface the 3-sense Ioudaioi Policy breakdown for readers, but the UI will not render any of the authored content.

**Options:**

1. **Use the `characterArc` field** for the 3-sense breakdown as a prose summary. `characterArc` IS rendered by PersonCard. The full sense-breakdown could be authored as a multi-sentence paragraph in `**Character arc:**`. Rename the field in the markdown to match; content would read as: "Three senses of *hoi Yehudim* in John: (1) Geographic/ethnic — the Judeans... (2) Institutional — the Jerusalem leadership... (3) Polemical/adversarial — those who oppose Yeshua..." This is a workaround but requires no code change and the content renders. Anti-misuse note could go in `**Note:**` (not rendered) or integrated into the characterArc text.

2. **Use `archaeologicalEvidence`** or `extraBiblicalMentions` as free-text receptacles for the policy note. Both ARE rendered in PersonCard (under the archaeology/extra-biblical block).

3. **Add new parser fields** (`groupSenses`, `policyNote`) — scope-expanding code change, outside Phase 10.

4. **Accept that Yehudim renders as an empty accordion** and treat the entry as internal metadata only (for editors, not readers). The entry still demonstrates the group-entry pattern and documents the J-006 reference in the markdown file. Readers can access J-006 content via the chapter companion §C2 of John 1 CONTEXT (which already has the three-sense breakdown).

**Recommended:** Option 1 (repurpose `**Character arc:**` for the 3-sense breakdown as prose). This is the path of least resistance and produces a useful reader experience without code changes. The plan should pick one option explicitly and document it.

**Required fix:** §4.3 must acknowledge which PersonCard fields will actually render Yehudim content. The claim that `**Senses:**` and `**Cross-reference:**` are rendered content fields is wrong.

### 3.4 `**Note:**` field in §4.1 full entry shape is not parsed or rendered

Plan §4.1 lists `**Note:**` as a field in the full entry shape:

> `**Note:**` (free-form, e.g. for textual variants)

But `note` is not in `EXACT_LABEL_ALIASES` in `people-parser.ts`. A `**Note:**` line will be processed by `FIELD_LINE` regex (it matches) but `resolveField("Note")` returns `undefined`, so the value is silently discarded. It is NOT stored in `PersonEntry` and NOT rendered in the PersonCard.

Looking at `content/en/matthew/PEOPLE.md`: the Note fields are visible in the raw markdown file (e.g., Yeshua's "The name etymology is stated in the text itself...") but they are entirely absent from the UI. They serve as human-readable documentation in the PEOPLE.md file only — visible to editors, not to readers.

**This is a convention established by Matthew PEOPLE.md, not a bug.** But the plan's §4.1 should clarify this explicitly so locale editors don't waste effort writing detailed `**Note:**` content expecting it to appear in the UI. The Note field is markdown-only documentation.

**Required fix:** Add to §4.1: "Note: `**Note:**` is NOT a recognized parser field and is NOT rendered in the PersonCard. It is markdown-only documentation visible in the raw content file for editorial purposes."

---

## 4. Significant Concerns (continued)

### 4.1 Yochanan full-entry duplication with matthew/PEOPLE.md — content coordination needed

Matthew/PEOPLE.md already has a comprehensive Yochanan the Immerser entry (verified) covering his birth year, father/mother (from Luke), locations, key events, extra-biblical mentions (Josephus *AJ* 18.116–119), and character arc — all from a Matthew 1–3 scope perspective.

Phase 10's John Yochanan entry is a full entry. The plan acknowledges Phase 13 will merge these, but does not specify what the John Yochanan entry adds or how it avoids contradicting Matthew's entry.

Concretely:
- Matthew's Yochanan `**Historical year:** -5` — what does John's use?
- Matthew's Yochanan `historicityStatus: PROBABLE` — John's should match
- Matthew's extra-biblical citations (Josephus *AJ* 18.116–119) — should John duplicate, or cross-reference?

The two entries are on different pages (`/matthew/people` vs `/john/people`) so there's no immediate UI conflict, but reader inconsistency between the two entries is a real risk if independently authored.

**Suggested:** Add to §6 step 10.1 authoring notes: "Yochanan's John entry should use identical `historicityStatus`, `historicalYear`, `historicalYearEnd`, and extra-biblical citations as the Matthew entry. Only the `**In John:**` narrative summary, `**Key events:**` (John-specific scenes), and `**Mentioned in:**` (John references) differ. Cross-check against `content/en/matthew/PEOPLE.md` Yochanan entry before finalizing. Document any intentional divergences in the J-021 editorial-log entry."

### 4.2 `historicalYear` for Nathanael and Nikodemos (POSSIBLE historicity) warrants explicit sourcing in J-021

The plan proposes `**Historical year:** [integer]` for all 6 full entries, including Nathanael (POSSIBLE historicity, only attested in John) and Nikodemos (POSSIBLE historicity, only attested in John + later rabbinic tradition). For these two figures, assigning a bare integer historicalYear is substantively more speculative than for Kefa or Andreas (who appear in Acts and Pauline letters and Josephus).

The numeric-anchor convention (Entry 2026-05-09-101) requires bare integers and puts qualification prose in `**Birth year:**`. But it doesn't resolve how speculative a historicalYear value can be before it becomes Rule 13-violating.

**Suggested:** J-021 should document for each figure the source basis for the assigned historicalYear (e.g., "working back from typical disciple ages at Yeshua's ministry c. 27 CE, assuming adult male c. 20-35 years old → birth c. 1 BCE–7 CE; midpoint 5 CE used"). This is both good editorial-log discipline and protection against a Rule 28 reviewer flagging "where does this date come from?"

### 4.3 OT stub sort-order on the John people page

For the three OT dangling-pointer stubs (Mosheh, Eliyahu, Yeshayahu), the plan's §4.2 shape is:
```markdown
## Mosheh (Moses)
**See:** exodus/PEOPLE.md
**In John:** [narrative]
```

These entries have no `historicalYear` or `yearFromCreation`. The `sortChronological` function puts them at `Number.POSITIVE_INFINITY` — they appear AFTER all historically-anchored disciples at the bottom of the list. Similarly for the Yehudim group entry (no anchor).

This is fine behavior, but the plan should confirm it explicitly. The list order will be approximately:
1. Yochanan (-5 CE)
2. Yeshua (-4 CE)
3. Disciples (~5 CE each)
4. Nikodemos (~5 CE)
5. Mosheh (no anchor → bottom)
6. Eliyahu (no anchor → bottom)
7. Yeshayahu (no anchor → bottom)
8. Yehudim (no anchor → bottom)

OT figures appearing after 1st-century disciples is chronologically odd but functionally harmless since the accordion list renders all of them regardless of sort. Confirm this is the intended reader experience.

---

## 5. Minor Issues

### 5.1 Phase 11.5 execution may affect the 801/801 test baseline

The plan states "Pre-execution test baseline: `pnpm test` reports 801/801 (verified at draft time)." Phase 11.5 (prophecy parser `scholarlyNote` field) was also drafted on 2026-05-13 and proposes adding 2 new parser tests (or 4-6 per the AUDIT_PHASE_11_5_PLAN.md §4.3 recommendation). If Phase 11.5 has been executed before Phase 10 begins, the baseline would be 803-805, not 801.

**Suggested:** Strengthen the pre-execution check instruction: "Run `pnpm test` and record the actual current count. Use that count as the baseline for Phase 10 (not the 801 draft-time assertion). If it differs from 801, note whether Phase 11.5 has been executed and adjust accordingly."

### 5.2 Content-lint §0.2 em-dash rule applies to PEOPLE.md files — explicit note needed

Phase 11 audit R2.2 (captured in AUDIT_PHASE_11_PLAN.md) established that `content-lint.sh §0.2` applies to `$STUDY_DIRS`. The PEOPLE.md files are likely in `$PEOPLE_FILES` or `$CONTENT_DIRS` — also covered by §0.2. Any ` -- ` (space-hyphen-hyphen-space) in John PEOPLE.md content triggers a blocking lint error.

The plan's §5 conventions table includes the em-dash note as the last row ("Per people-parser.ts FIELD_LINE..."). But the em-dash rule deserves its own explicit row:

> **Em-dash in all fields** | Use Unicode em-dash `—` for ranges and compounds. Do NOT use ` -- ` — this triggers content-lint §0.2 and blocks the build. Applies to all fields in all PEOPLE.md files.

Historical date ranges are common in biographical content: "c. 27–30 CE", "Matthew 3 — the immersion narrative." Authors will instinctively reach for `--` without this warning.

### 5.3 `firstMention` and `mentionedIn` are stored but not rendered by PersonCard

The plan instructs authoring `**First mention:**` and `**Mentioned in:**` fields for all entries (and uses `firstMention` as the Yehudim anchor). These fields ARE parsed and stored in PersonEntry. But looking at the current PersonCard render list, neither `firstMention` nor `mentionedIn` is rendered as a visible UI element.

This is consistent with how Matthew PEOPLE.md works — these fields exist in the data model but don't appear in the card. Authors should know this to set expectations correctly (especially for the Yehudim entry, where `firstMention` was described as the "anchor" but won't be visible to readers).

**Suggested:** Add a clarifying note in §4: "Note: `**First mention:**` and `**Mentioned in:**` are parsed into the data model but are not currently rendered by PersonCard as visible fields. They serve as internal data fields (e.g., for future search/filter features) and as authoring documentation."

### 5.4 `**Group entry:** true` marker in Yehudim entry will confuse future editors

The plan proposes `**Group entry:** true` as "an explicit marker; parser ignores unknown fields gracefully." While harmless to the parser, a future editor reading the file and expecting this marker to have behavior may be confused when it appears to do nothing.

**Suggested:** Replace with a markdown comment or move the group-entry documentation to a H1/H3 heading or file-level note block. Alternatively, accept the unknown-field marker but add a comment in J-021 explaining it's purely editorial documentation.

### 5.5 `**Cross-reference:**` field in Yehudim entry

The plan says the Yehudim entry will have `**Cross-reference:** docs/editorial-log/john.md Entry J-006 + docs/rules/RULES-GS.md §Ioudaioi Policy`. This is an unknown field — silently ignored by the parser. It's useful for editors reading the markdown but won't render in the UI.

If the goal is to surface the Ioudaioi Policy for readers, this needs to be embedded in a rendered field (see §3.3 above). If it's purely editorial documentation, it can stay as an unknown field — but label it as such ("This field is editorial documentation only; it does not render in the UI").

### 5.6 `inBook` label context on the John people page

The people page builds `inBook: t(`people.inBook.${book}`)` where `book` is the current page's book. On the John people page, this becomes `t("people.inBook.john")` = "In John" for ALL entries — regardless of whether their `inBook` content was authored as `**In John:** ...` or some other field.

For Yeshua's see-only entry in John PEOPLE.md:
- `**In John:** [narrative about Yeshua's role in John 1–3]` → renders with label "In John" ✓

For Mosheh's stub:
- `**In John:** [Mosheh referenced at Jn 1:17, 1:45, 3:14]` → renders with label "In John" ✓

For the Yehudim group entry (if it uses `**In John:**` rather than `**Key events:**`):
- Would render with label "In John" ✓

This is all coherent. Just ensure that locale editors use `**In John:**` / `**Em João:**` / `**In Johannes:**` / `**En Juan:**` for the inBook field — not a free-form "In the Gospel of John:" or similar that won't match the parser's exact aliases.

---

## 6. What Works Well

- **Strategic scope selection.** John 1–3's 11 figures (6 full + 1 see-only + 1 group + 3 OT stubs) is a well-calibrated scope. Not too ambitious (doesn't cover all John figures), not too minimal (lights up the People view meaningfully for a complete reading of John 1–3).
- **Cross-book see-only mirror is architecturally correct.** Using Yeshua as a see-only to matthew/PEOPLE.md mirrors the Avraham/Yitschaq/Ya'aqov pattern already established. The pattern is verified working in the existing codebase.
- **`bookLabels` map pre-verified.** John is already in the map — no code change needed. This was verified.
- **`inBook` and `crossBookSee` locale aliases all verified.** Locale propagation can be mechanical.
- **Yehudim group-entry thinking is right.** Treating Yehudim as a group entry with schema deviation is appropriate given its importance in John and the J-006 Ioudaioi Policy. The direction is correct even if the field-rendering details need work (§3.3).
- **OT-figure dangling-pointer stubs.** Better reader experience than omitting entirely. The graceful-fallback rendering is verified working.
- **Numeric-anchor convention cited.** All `historicalYear` values will be bare integers per Entry 2026-05-09-101. This is the right practice.
- **Phase 7 readability conventions applied at authoring time.** Technical terms in biographical content (Pesach, Yarden, etc.) glossed on first use per file — the right approach for a new file rather than a retrospective sweep.
- **J-021 editorial-log entry.** Documenting the 4 scope-category decisions in the editorial log is good discipline for Phase 13's cross-book canonical refactor.
- **Effort estimate at 18.5h.** Plausible for 44 entries × 4 locales with the canary-first execution pattern. The 5h EN canary is reasonable given the complexity of the Yochanan and Yeshua entries.
- **§9 Risk table is comprehensive.** All 9 risks are real and their mitigations are appropriate.
- **No code changes needed.** Schema is unchanged; `bookLabels` already has john; parser aliases already cover john. Clean content-only phase.

---

## 7. Project-Lead Decisions Requested by Plan (§11)

These are architectural decisions the plan explicitly flags for project-lead approval. Audit position on each:

**§3 Scope-category table:** The classification is correct. The "OT-referenced see-only-to-future-books" approach (Mosheh, Eliyahu, Yeshayahu) is better than skipping them entirely — these figures are prominent enough in John 1 that a reader asking "who is Mosheh?" deserves at least a pointer. Recommend **approve**.

**§4.2 Yeshua see-only direction (→ matthew/PEOPLE.md):** Correct. Matthew PEOPLE.md is the canonical Yeshua home until Phase 13. The Phase 13 refactor is explicitly forward-tracked. Recommend **approve**.

**§4.3 Yehudim group-entry schema:** The direction is right but the §3.3 gap (rendered fields) must be resolved first. Recommend **approve after §3.3 is resolved** — pick which PersonCard field carries the 3-sense breakdown (recommendation: `**Character arc:**`).

**§5 historicity ratings:** PROBABLE for Yochanan + Andreas + Kefa + Philippos (Josephus + Acts attestation), POSSIBLE for Nathanael + Nikodemos (John-only), VERIFIED for Yehudim (group historicity). These are defensible and consistent with how Matthew PEOPLE.md calibrates ratings. Recommend **approve**.

---

## 8. Required Conditions Before Execution

In priority order:

1. **Fix §4.3 parser anchor description (§3.1).** Remove the false "Parser will skip the H2 entry if no `Verse` field is present" claim. This is a people-parser vs prophecy-parser confusion.
2. **Resolve Yehudim group entry UI rendering (§3.3).** Decide which PersonCard field carries the 3-sense breakdown. Recommended: use `**Character arc:**` for the sense-prose and `**Extra-biblical mentions:**` or `**Archaeological evidence:**` for the anti-misuse safeguard note. Both fields render in PersonCard. Update §4.3 accordingly.
3. **Clarify `**Note:**` field status (§3.4).** Add an explicit note that `**Note:**` is not parsed or rendered — it's markdown-only documentation. Update §4.1.
4. **Update `parseCrossBookSlug` mechanism description (§3.2).** Fix the "`null` for unknown slugs" description to "unknown-book slug → `!bookLabels[slug]` triggers plain-text fallback." Update §4.2 and §9 Risk 3.
5. **Add em-dash convention row to §5 (§5.2).** Prevent build-blocking ` -- ` occurrences in biographical content.
6. **Add Yochanan cross-entry coordination note to §6 (§4.1).** Specify that John's Yochanan entry must use identical historical anchors and historicity rating as Matthew's entry; document any John-specific differences in J-021.

---

## 9. Recommendation

**Approve after items 1–6 are addressed.** Items 1–4 are specification correctness issues that will produce authoring errors if left unresolved. Items 5–6 are authoring discipline gaps. All six are short fixes.

After fixes, this is a well-designed content phase. The technical infrastructure (parser, UI, bookLabels, i18n keys) is all verified in place. The strategic decisions (scope, schema, see-only patterns) are sound. The effort estimate is realistic.

No Lock Protocol. No code changes. Execute at step 10.1 (EN canary); verify People view renders for `/en/john/people` before locale propagation.

---

## Post-Verification: Content-lint + Repository Path Checks (2026-05-14)

After writing the initial audit, verified two additional files: `scripts/content-lint.sh` and `src/infrastructure/content/fs-content-repository.ts`. Three findings, two of which affect the plan's §8 DoD.

### PV.1 Content-lint §0.6 is deferred pending Phase 10 — activation belongs in Phase 10 DoD [MUST FIX]

`scripts/content-lint.sh` contains this comment:

```bash
# §0.6 — John PEOPLE.md absence — DEFERRED until after Phase 10.
# Activated post-Phase 10:
#   for each locale, fail if content/<loc>/john/ exists without PEOPLE.md.
```

The rule body is commented out. Phase 10's §8 DoD does not mention activating it. This means:
- During Phase 10 execution, `pnpm content:lint` will pass even if only 3 of 4 locale PEOPLE.md files are created.
- After Phase 10 closes, no automated check enforces that all 4 locale files exist.

**Required fix:** Add to §8 DoD step 10.8 (meta-doc sync): "Activate content-lint §0.6 — uncomment the rule body in `scripts/content-lint.sh` so that a missing John PEOPLE.md in any locale fails the lint. Update `$PEOPLE_FILES` and `$NON_EN_PEOPLE_FILES` variables to include the 4 new files (see PV.2)." The §0.6 activation should be committed in the same step as the 4th locale file is authored.

### PV.2 `$PEOPLE_FILES` and `$NON_EN_PEOPLE_FILES` must be updated — three lint rules silently skip John PEOPLE.md until then [MUST FIX]

The lint script defines:
```bash
PEOPLE_FILES="content/en/genesis/PEOPLE.md content/pt-br/genesis/PEOPLE.md content/de/genesis/PEOPLE.md content/es/genesis/PEOPLE.md content/en/matthew/PEOPLE.md content/pt-br/matthew/PEOPLE.md content/de/matthew/PEOPLE.md content/es/matthew/PEOPLE.md"
NON_EN_PEOPLE_FILES="content/pt-br/genesis/PEOPLE.md content/de/genesis/PEOPLE.md content/es/genesis/PEOPLE.md content/pt-br/matthew/PEOPLE.md content/de/matthew/PEOPLE.md content/es/matthew/PEOPLE.md"
```

John PEOPLE.md files are NOT in either variable. Three rules are affected:
- **§0.7** (`PEOPLE_FILES`): does not check John PEOPLE.md for leftover `## Transparent Translation` H2 headings. An accidentally-included TT H2 in john/PEOPLE.md would not be caught.
- **§0.8** (`NON_EN_PEOPLE_FILES`): does not check John PEOPLE.md for heading collision (`## Translit (Translit)` pattern). Locale editors writing same-form headings would not be flagged.
- **§0.10** (`PEOPLE_FILES`): does not run the modern-mapping smell-test on John PEOPLE.md. Given the Yehudim entry may reference geographic/ethnic terminology, this check is particularly relevant.

**What IS covered:** §0.1 (stale ruleset stamps) and §0.2 (em-dash) both use `$CONTENT_DIRS` which includes `content/{locale}/john` — the `grep -rEn` recursive scan WILL cover john/PEOPLE.md via directory scan. No gap for these two rules.

**Required fix:** After authoring all 4 John PEOPLE.md files, update `content-lint.sh`:
```bash
PEOPLE_FILES="...existing... content/en/john/PEOPLE.md content/pt-br/john/PEOPLE.md content/de/john/PEOPLE.md content/es/john/PEOPLE.md"
NON_EN_PEOPLE_FILES="...existing... content/pt-br/john/PEOPLE.md content/de/john/PEOPLE.md content/es/john/PEOPLE.md"
```

Add this as an explicit sub-step in §8 DoD step 10.8. Updating these variables takes ~2 minutes but prevents an entire class of silent lint gaps from persisting post-Phase 10.

### PV.3 `listBooks` confirms John is already in static params — /john/people route is pre-generated [VERIFIED]

`fs-content-repository.ts` `listBooks` returns any directory under `content/{locale}/` that contains at least one `CHAPTER-N.md` file. Since `content/en/john/CHAPTER-1.md`, `CHAPTER-2.md`, `CHAPTER-3.md` exist, `listBooks("en")` already returns `"john"`. The people page's `generateStaticParams` therefore already includes john in the static params, generating the `/john/people` route at build time.

Currently, the route 404s because `readPeople(locale, "john")` hits the `catch` branch (no file → returns `null`) → `notFound()`. After Phase 10 creates the files, the same route renders correctly with no build configuration changes needed. ✓

This also confirms: `readPeople` path = `content/{locale}/{book}/PEOPLE.md` — exactly what the plan specifies in §1 Goal statement. ✓

### Updated Required Conditions (addition to §8)

The two PV.1 and PV.2 findings add to the Required Conditions in §8:

7. **Activate content-lint §0.6 in step 10.8 (PV.1).** Uncomment the §0.6 rule body in `scripts/content-lint.sh` as part of the Phase 10 meta-doc sync step. This ensures a missing locale PEOPLE.md fails lint going forward.
8. **Update `$PEOPLE_FILES` and `$NON_EN_PEOPLE_FILES` in step 10.8 (PV.2).** Add all 4 John PEOPLE.md paths to these variables so §0.7 (leftover TT H2), §0.8 (heading collision), and §0.10 (modern-mapping smell) cover the new files.

---

**Audit complete.** All code claims verified against `people-parser.ts`, `person-card.tsx`, `people/page.tsx`, `fs-content-repository.ts`, `content-lint.sh`, test file, 4 i18n message files, `matthew/PEOPLE.md`, and `editorial-log/john.md`.
