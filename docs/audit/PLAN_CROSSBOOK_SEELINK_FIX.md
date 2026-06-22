# Plan — Fix cross-book see-stub link (parser drops `crossBookSeeBook`)

**Status:** PLANNED (awaiting sign-off) · **Date:** 2026-06-22 · **Class:** code fix (parser mapping) + regression test · **Risk:** Low code / Medium blast-radius (project-wide render change)

---

## 1. Problem (root cause confirmed against source)

Cross-book see-only PEOPLE stubs (e.g. Mark→Matthew, Matthew→Genesis) render the pointer as **plain text, not a clickable link**, in **every book and locale**. Discovered during Mark propagation (2026-06-21); it predates that work (affects en/matthew + en/mark on `main`).

**Root cause:** `people-parser.ts` parses `current.crossBookSeeBook` from the See value (line ~273, regex `^([a-z][a-z-]*)\/PEOPLE\.md$`), the domain type declares it (`types.ts:271`), and `person-card.tsx` consumes `person.crossBookSeeBook` (line ~145). **But the parser's final `return {…}` object map (line ~518) omits `crossBookSeeBook: raw.crossBookSeeBook`** → it is always `undefined` → `CrossBookSeeField`'s `if (!book || !bookLabels[book])` guard always takes the plain-text fallback branch.

Verified it is the **only** field set-during-parse-but-not-returned (diff of `current.*` assignments vs the return map → sole gap: `crossBookSeeBook`).

## 2. The fix

One line, in the `people-parser.ts` final object map (alongside `crossBookSee: raw.crossBookSee,`):
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

No existing test asserts `crossBookSeeBook` survives parsing. Add a **people-parser regression test**: parse a stub with `**See:** matthew/PEOPLE.md` → assert `entry.crossBookSeeBook === "matthew"` (and a non-stub → `undefined`). This locks the pass-through so it can't silently drop again.

## 5. Scope

- **In scope:** the 1-line parser map addition + 1 regression test. Possibly a tiny README phrasing confirm (the "clickable cross-book link" claim becomes true).
- **Out of scope:** no content changes; no UI/parser logic changes beyond the pass-through; the deeper "fetch-and-merge canonical bio" (that's the separate C3 PENDING item).

## 6. Validation gate

| # | Check | Pass |
|---|---|---|
| G1 | `pnpm test` incl. the new regression test | green; new test asserts `crossBookSeeBook` flows |
| G2 | conservation | **11,831-class total unchanged** (field is not a conservation unit — verified; emitPeople untouched) |
| G3 | `pnpm lint` · `pnpm build` | clean |
| G4 | served-HTML — **authored target now links** | `curl …/en/mark/people` → `href="/en/matthew/people"` present (was 0); same for `…/en/matthew/people` → `/en/genesis/people` cross-book link (distinct from the footer's genesis link — assert the in-card `.fv > a`) |
| G5 | served-HTML — **dangling target still plain text** | a john stub → `exodus/PEOPLE.md` renders as plain text, no `href="/…/exodus/people"` |
| G6 | visual (Docker MCP) | a people page with a working cross-book link (Mark→Matthew) + one with a dangling ref (John→Exodus) render correctly; link styled per design (`.text-accent`, focus ring) |
| G7 | all 4 locales | the link renders in en/pt-br/de/es (label localized via `book.*` i18n) |

## 7. Risks & rollback

- **Risk:** a stub target that IS in bookLabels but whose people route doesn't exist → 404 link. Mitigated: bookLabels only contains the 4 authored books, all with live `/people` routes.
- **Risk:** render change surprises a reviewer expecting plain text. Mitigated: this is the *designed* behavior (README), and the change is documented here + in the commit.
- **Rollback:** revert the 1-line change (+ test). No data/schema/content impact.

## 8. Commit / merge

Own atomic commit (`fix(people): …`), separate branch off `main`, PR per the standing authorization gate. Not bundled with content. Update PENDING (close the bug item) + EXECUTION_HISTORY.
