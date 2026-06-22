# Plan — Fix cross-book see-stub link (parser drops `crossBookSeeBook`)

**Status:** PLANNED — **externally AUDITED ✅ APPROVE** (`AUDIT_CROSSBOOK_SEELINK_FIX_PLAN.md`, 2026-06-22; findings verified against source + folded in) · **Date:** 2026-06-22 · **Class:** code fix (parser mapping) + regression test · **Risk:** Low code / Medium blast-radius (project-wide render change)

> **External-audit disposition (all findings verified true & folded in):**
> - **Finding 1 — name the function: the fix is in `finalizeEntry`, not `parsePeopleMarkdown`.** Verified: `people-parser.ts` has two `return {`: `parsePeopleMarkdown` (line 509 → `PeopleData {book, entries, …}`) and **`finalizeEntry` (line 517-518 → the per-entry `PersonEntry`)**. The `crossBookSee: raw.crossBookSee` line (562) is inside `finalizeEntry` — that is where `crossBookSeeBook` goes. Adding it to `parsePeopleMarkdown`'s return would be a no-op. §1/§2 reworded to say `finalizeEntry` explicitly.
> - **Minor 2 — regression test gets a malformed-pointer negative case** (e.g. `**See:** Matthew` with no `/PEOPLE.md`) → assert `crossBookSeeBook === undefined` AND `crossBookSee === raw value` (graceful fallback still fires). Locks the regex failure mode.
> - **Minor 3 — case-variant assertion** (`Matthew/PEOPLE.md` → `"matthew"`) to pin the `/i` + `.toLowerCase()` behavior, so a future regex tightening fails loudly.
> - Audit re-verified the **"sole omission"** claim by diffing every `applyField` `current.X=` against `finalizeEntry`'s return → `crossBookSeeBook` is genuinely the only set-but-dropped field (fix is complete, not one symptom of wider drift). Conservation-safety, bookLabels set, no-404, and the G4 footer-collision design all confirmed correct.

> **Self-audit disposition (verified against source 2026-06-22):**
> 1. **Only the book is missing — the pointer already renders.** `crossBookSee: raw.crossBookSee,` IS in the return map (line 51 of the block); `crossBookSeeBook` is the sole omission. So today the stub shows the raw pointer text ("matthew/PEOPLE.md"); the fix adds link resolution.
> 2. **Displayed text changes for authored targets (not just clickability).** After the fix, an authored stub renders the **localized book label** (`bookLabels[book]` = `t("book.matthew")` → "Matthew"/"Mateus"/"Matthäus"/"Mateo") as a link, replacing the raw "matthew/PEOPLE.md" path. This is the designed behavior (better UX) — noted so it isn't mistaken for data loss. Dangling targets keep showing the raw pointer (fallback).
> 3. **G4 footer-collision trap (the false positive that fooled the discovery).** site-footer links to `genesis/people` on every page. So `href=".../matthew/people"` on a mark/john people page is **uniquely** the cross-book link (footer never targets matthew) → use mark→matthew + john→matthew as the clean positive assertions. matthew→genesis collides with the footer → assert via the in-card `.fv > a` selector, not a bare href grep. G4 rewritten accordingly.
> 4. **Sole consumer + conservation-proof.** Only `person-card.tsx:145` reads `crossBookSeeBook` (no structured-layer/SEO consumer). Conservation's `person` unit = `d.entries.map(p => p.name)` (name only) — `crossBookSeeBook` is never serialized into any unit, so the fix cannot shift conservation counts/content (G2 solid).
> 5. Authored link targets actually present in the corpus: **matthew** (from john + mark stubs) and **genesis** (from matthew stubs); unauthored forward-refs (exodus/isaiah/kings/acts) stay plain text.

---

## 1. Problem (root cause confirmed against source)

Cross-book see-only PEOPLE stubs (e.g. Mark→Matthew, Matthew→Genesis) render the pointer as **plain text, not a clickable link**, in **every book and locale**. Discovered during Mark propagation (2026-06-21); it predates that work (affects en/matthew + en/mark on `main`).

**Root cause:** `people-parser.ts` parses `current.crossBookSeeBook` in `applyField`'s `crossBookSee` case (line ~273, regex `^([a-z][a-z-]*)\/PEOPLE\.md$/i`), the domain type declares it (`types.ts:271`), and `person-card.tsx` consumes `person.crossBookSeeBook` (line ~145). **But `finalizeEntry(raw)` — the per-entry `PersonEntry` builder (line 517-518), NOT `parsePeopleMarkdown`'s `PeopleData` return (line 509) — returns `…crossBookSee: raw.crossBookSee` (line 562) and omits `crossBookSeeBook`** → it is always `undefined` → `CrossBookSeeField`'s `if (!book || !bookLabels[book])` guard always takes the plain-text fallback branch.

Verified it is the **only** field set-during-parse-but-not-returned (diff of `current.*` assignments vs the return map → sole gap: `crossBookSeeBook`).

## 2. The fix

One line, in **`finalizeEntry()`** (people-parser.ts ~line 562, alongside `crossBookSee: raw.crossBookSee,` — **not** `parsePeopleMarkdown`'s return at line 509):
```ts
crossBookSeeBook: raw.crossBookSeeBook,
```
This completes the Tier-4 S2a change (which added the parse + type + UI-consumption but missed the pass-through).

## 3. Behavior matrix (why this is safe — verified)

`CrossBookSeeField`: `if (!book || !bookLabels[book]) → plain-text <Field value={pointer}>` else `<Link href={/${locale}/${book}/people}>{bookLabels[book]}</Link>`.

`bookLabels` (people/page.tsx:99-104) = { genesis, matthew, mark, john } (all 4 authored books).

| Stub target | In bookLabels? | Before fix | After fix |
|---|---|---|---|
| `genesis`, `matthew` (authored — actual link targets in the corpus) | yes | plain text (bug) | **link** ✓ |
| `exodus`, `isaiah`, `kings`, `acts` (unauthored forward-refs) | no | plain text | **plain text** (graceful dangling-pointer fallback — unchanged) ✓ |

So authored targets start linking; unauthored forward-references keep the graceful fallback the README already promises. Corpus today: 56 stubs across 12 files; the link-target books present are genesis + matthew (+ mark/john reachable if ever targeted).

## 4. Test gap (this is why the bug shipped — close it)

No existing test asserts `crossBookSeeBook` survives parsing. Add a **people-parser regression test** with four cases (audit Minor 2/3):
1. **Authored stub** `**See:** matthew/PEOPLE.md` → `entry.crossBookSeeBook === "matthew"` **and** `entry.crossBookSee === "matthew/PEOPLE.md"` (pass-through proven for both fields).
2. **Non-stub** (a normal entry, no See field) → `crossBookSeeBook === undefined`.
3. **Malformed pointer** `**See:** Matthew` (no `/PEOPLE.md`) → `crossBookSeeBook === undefined` **and** `crossBookSee === "Matthew"` (graceful fallback: the plain-text path still fires, parser doesn't throw).
4. **Case-variant** `**See:** Matthew/PEOPLE.md` → `crossBookSeeBook === "matthew"` (pins the regex `/i` + `.toLowerCase()`, so a future exact-case "tightening" fails loudly instead of silently breaking real stubs).

This locks both the success and failure modes of the pass-through + regex contract.

## 5. Scope

- **In scope:** the 1-line parser map addition + 1 regression test. Possibly a tiny README phrasing confirm (the "clickable cross-book link" claim becomes true).
- **Out of scope:** no content changes; no UI/parser logic changes beyond the pass-through; the deeper "fetch-and-merge canonical bio" (that's the separate C3 PENDING item).

## 6. Validation gate

| # | Check | Pass |
|---|---|---|
| G1 | `pnpm test` incl. the new regression test | green; new test asserts `crossBookSeeBook` flows |
| G2 | conservation | **11,831-class total unchanged** (field is not a conservation unit — verified; emitPeople untouched) |
| G3 | `pnpm lint` · `pnpm build` | clean |
| G4 | served-HTML — **authored target now links** (footer-collision-free) | `curl …/en/mark/people` → `href="/en/matthew/people"` present (was 0) — **uniquely the cross-book link** since the footer only targets `genesis/people`. Same for `…/en/john/people` → `href="/en/matthew/people"`. For `…/en/matthew/people` → genesis: assert the **in-card** link (`class="fv"` span containing `href="/en/genesis/people"`), NOT a bare href grep (footer also links genesis — the exact false positive that masked this bug at discovery). |
| G5 | served-HTML — **dangling target still plain text** | on `…/en/john/people`, the `exodus/PEOPLE.md` (+ isaiah/kings) stubs render as plain text — **no** `href="/…/exodus/people"` / `…/isaiah/people` / `…/kings/people`. Confirms the graceful dangling-pointer fallback is preserved. |
| G4b | displayed text | authored stub now shows the localized book label (e.g. "Mateus") not the raw "matthew/PEOPLE.md" path; dangling stub still shows the raw pointer. |
| G6 | visual (Docker MCP) | a people page with a working cross-book link (Mark→Matthew) + one with a dangling ref (John→Exodus) render correctly; link styled per design (`.text-accent`, focus ring) |
| G7 | all 4 locales | the link renders in en/pt-br/de/es (label localized via `book.*` i18n) |

## 7. Risks & rollback

- **Risk:** a stub target that IS in bookLabels but whose people route doesn't exist → 404 link. Mitigated: bookLabels only contains the 4 authored books, all with live `/people` routes.
- **Risk:** render change surprises a reviewer expecting plain text. Mitigated: this is the *designed* behavior (README), and the change is documented here + in the commit.
- **Rollback:** revert the 1-line change (+ test). No data/schema/content impact.

## 8. Commit / merge

Own atomic commit (`fix(people): …`), separate branch off `main`, PR per the standing authorization gate. Not bundled with content. Update PENDING (close the bug item) + EXECUTION_HISTORY.
