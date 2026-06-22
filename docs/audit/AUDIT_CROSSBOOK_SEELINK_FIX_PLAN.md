# Audit — PLAN_CROSSBOOK_SEELINK_FIX.md

**Date:** 2026-06-22
**Auditor:** Claude Opus 4.8 (independent review)
**Plan reviewed:** `docs/audit/PLAN_CROSSBOOK_SEELINK_FIX.md` (status: PLANNED — self-audited 2026-06-22)
**Mandate:** verify no regression, content loss, side-effect, or rule/DDD/DRY compliance issue — against actual source, not the plan's self-report or its self-audit block. This is a **one-line parser pass-through fix + regression test**, so the bar is: is the root cause exactly as described, is the field genuinely conservation-invisible, and is the render-change behavior matrix accurate?
**Method:** Read directly this session: `people-parser.ts` (the `applyField` `crossBookSee` case + the `finalizeEntry` return map — the claimed drop site), `person-card.tsx` (`CrossBookSeeField` guard — the consumer), `types.ts` (the `crossBookSeeBook` declaration), `people/page.tsx` (the `bookLabels` definition + the consumer wiring). Cross-referenced the Tier-4 S2a audit (this fix completes that change) and the `emitPeople` conservation surface verified there. Could not run the gate (no shell).
**Status:** ✅ **APPROVE — the root cause is exactly as described, the fix is correct and minimal, and it's provably conservation-safe.** Every load-bearing claim checks out against source. The one correction: the fix belongs in **`finalizeEntry`**, not the `parsePeopleMarkdown` top-level return — the plan's prose conflates the two (calls it "the parser's final return object map, line ~518"), though it correctly identifies the insertion point (next to `crossBookSee: raw.crossBookSee`). Pin that so the one-liner lands in the right function. Otherwise airtight.

---

## Executive summary

This is a genuine, precisely-diagnosed bug with a correct one-line fix. I traced the full chain against source and it is exactly as the plan states:

1. **Parsed:** `applyField`'s `crossBookSee` case sets *both* `current.crossBookSee = value` **and** `current.crossBookSeeBook = seeMatch ? seeMatch[1].toLowerCase() : undefined` (regex `^([a-z][a-z-]*)\/PEOPLE\.md$/i`).
2. **Dropped:** `finalizeEntry(raw)` — the function that assembles the final `PersonEntry` — returns `…crossBookSee: raw.crossBookSee, inBook: raw.inBook` but **omits `crossBookSeeBook`**. So the parsed slug is discarded; every `PersonEntry.crossBookSeeBook` is `undefined`.
3. **Consumed (always fallback):** `CrossBookSeeField`'s guard `if (!book || !bookLabels[book]) return <Field value={pointer} />` — with `book` always `undefined`, it always renders the plain-text path, never the `<Link>`.

The fix — add `crossBookSeeBook: raw.crossBookSeeBook,` to `finalizeEntry`'s return — is the minimal correct completion of the Tier-4 S2a change (which added the parse + type + UI-consumption but missed the pass-through). The type already declares the field (with a doc comment "Derived in the parser so the UI carries no slug-parsing logic"), so the one-liner type-checks immediately.

Critically for safety: this fix is on the **right side of the Tier-4 Minor-2 footgun line.** That audit warned "do NOT add `crossBookSeeBook` to `emitPeople`'s meta" (which would shift conservation). This plan adds it to `finalizeEntry` — the *domain object* — not to `emitPeople`. `emitPeople` emits `person` units as `d.entries.map(p => p.name)` (name only) and never reads `crossBookSeeBook`, so the fix cannot move any conservation count or content. Self-audit #4 is verified correct.

The render change (self-audit #2) is real and is the *designed* behavior: an authored stub stops showing the raw `"matthew/PEOPLE.md"` path and starts showing the localized book label (`bookLabels[book]`) as a link. That's a UX improvement, not data loss; dangling targets keep the raw-pointer fallback. The plan correctly flags this so a reviewer doesn't mistake it for a regression.

---

## Verification table (plan claim vs. source)

| # | Plan claim | Verified? | Evidence |
|---|---|---|---|
| 1 | `crossBookSeeBook` is parsed in `applyField` | ✓ | `crossBookSee` case sets `current.crossBookSeeBook = seeMatch ? seeMatch[1].toLowerCase() : undefined`. Regex `^([a-z][a-z-]*)\/PEOPLE\.md$/i`. |
| 2 | …declared in the domain type | ✓ | `types.ts` `PersonEntry`: `crossBookSeeBook?: string;` + doc comment ("Derived in the parser so the UI carries no slug-parsing logic"). |
| 3 | …consumed in `person-card.tsx` | ✓ | `PersonCard` passes `person.crossBookSeeBook` → `CrossBookSeeField`'s `book` prop; guard `if (!book \|\| !bookLabels[book])` else `<Link href={/${locale}/${book}/people}>`. |
| 4 | …but **dropped from the return map** (sole omission) | ✓ (with location correction) | `finalizeEntry` returns `crossBookSee: raw.crossBookSee` but NOT `crossBookSeeBook`. Confirmed it's the only field set-in-`applyField`-but-absent-from-`finalizeEntry`. **But it's `finalizeEntry`, not the `parsePeopleMarkdown` return — see Finding 1.** |
| 5 | Fix = 1 line next to `crossBookSee: raw.crossBookSee,` | ✓ | Correct insertion point (inside `finalizeEntry`); type already declared → type-checks. |
| 6 | `bookLabels` = exactly the 4 authored books | ✓ | `people/page.tsx`: `{ genesis, matthew, mark, john }` via `t("book.*")`. So authored→link, unauthored→plain-text fallback. Matrix correct. |
| 7 | Conservation-safe (`crossBookSeeBook` not a unit) | ✓ | `emitPeople` emits `person` = `name` only (Tier-4 verified); never reads `crossBookSeeBook`. G2 solid. On the right side of the Tier-4 Minor-2 footgun. |
| 8 | No 404 risk (bookLabels books all have live routes) | ✓ | All 4 are `AVAILABLE_BOOKS`; `getAvailableBooks(locale)` gates the page; `/[book]/people` route exists for each. |
| 9 | Render change = localized label replaces raw path (designed) | ✓ | `CrossBookSeeField` link branch renders `{bookLabels[book]}`, not the pointer. Authored stub text changes path→label. Correctly flagged, not data loss. |
| 10 | G4 footer-collision: footer targets `genesis/people` everywhere | ◑ | Not re-read this session, but the *mitigation* is sound regardless (see Finding-free note below). mark→matthew / john→matthew are footer-collision-free positive asserts; matthew→genesis via in-card `.fv > a` selector is strictly more precise than a bare grep either way. |

---

## Findings

### Minor (one precision fix; the rest confirmations)

**Finding 1 — the fix belongs in `finalizeEntry`, not the `parsePeopleMarkdown` top-level return; the plan's prose conflates them.** The plan says the omission is in "the parser's final `return {…}` object map (line ~518)" and "the parser's final object map." In the actual source there are *two* return objects:
- `parsePeopleMarkdown` returns `{ book, entries, genealogies, sources }` (the top-level `PeopleData`).
- `finalizeEntry(raw)` returns the per-entry `PersonEntry` — and *this* is the one ending `…crossBookSee: raw.crossBookSee, inBook: raw.inBook` that omits `crossBookSeeBook`.

The plan's self-audit #1 correctly says the insertion is "alongside `crossBookSee: raw.crossBookSee,`" — which is in `finalizeEntry` — so the *intent* is right and the executor following self-audit #1 will land it correctly. But the §1/§2 prose ("the parser's final return object map") could misdirect someone to `parsePeopleMarkdown`'s return, where adding `crossBookSeeBook` would be a no-op (that object has no such field and isn't where `PersonEntry` is built). **Fix:** change the prose to name `finalizeEntry` explicitly. One word; prevents a wasted edit.

**Minor 2 — add the negative case to the regression test, and one malformed-pointer case.** §4 proposes asserting `entry.crossBookSeeBook === "matthew"` for a `**See:** matthew/PEOPLE.md` stub and `undefined` for a non-stub. Good. Add one more: a *malformed* pointer (e.g. `**See:** matthew/people.md` lowercase, or `**See:** Matthew` with no `/PEOPLE.md`) → assert `crossBookSeeBook === undefined` **and** `crossBookSee === <raw value>` (so the plain-text fallback still fires). This locks the regex's failure mode, not just its success, and documents that a malformed pointer degrades gracefully rather than throwing. Cheap; closes the other half of the contract.

**Minor 3 — confirm the `/i` flag's interaction with the lowercased slug is intended (it is, but worth a test note).** The regex is `^([a-z][a-z-]*)\/PEOPLE\.md$/i` — case-insensitive, then `seeMatch[1].toLowerCase()`. So `Matthew/PEOPLE.md`, `matthew/people.md`, `MATTHEW/PEOPLE.MD` all resolve to `"matthew"`. That's the right robustness, but it means the *content* convention (`matthew/PEOPLE.md`, capital PEOPLE) is enforced only by content-lint, not the parser. Fine — just make the regression test assert one case-variant resolves correctly so the `/i` + `.toLowerCase()` behavior is pinned (a future "tightening" of the regex to exact-case would then fail the test loudly instead of silently breaking real stubs).

### Confirmed safe (verified, no action)

- **Root cause is exact.** Parsed in `applyField`, dropped in `finalizeEntry`, always-fallback in `CrossBookSeeField`. The one-line pass-through is the correct, minimal fix.
- **Conservation cannot move.** `emitPeople` reads `name` only; `crossBookSeeBook` is never serialized. G2 holds by construction. This fix is correctly on the domain-object side, not the emitter side (respecting the Tier-4 Minor-2 footgun).
- **No 404 risk.** `bookLabels` ⊆ `AVAILABLE_BOOKS`, all with live `/people` routes; the page is gated by `getAvailableBooks(locale)`.
- **The render change is the designed behavior, correctly disclosed.** Authored stub: raw path → localized link label. Dangling stub: unchanged plain-text raw pointer. No data loss (the pointer's information is preserved as the link target + label).
- **G4's test design is sound** (footer-collision-aware). Using mark→matthew / john→matthew as positive asserts and an in-card selector for matthew→genesis is the right way to avoid the false positive that masked the bug at discovery — and it's correct independent of the exact footer target.
- **DDD/DRY intact.** The fix keeps slug-derivation in the parser (domain-derived field) and out of the UI — exactly what the `crossBookSeeBook` doc comment intends. No new dependency direction; the UI's `CrossBookSeeField` already carries zero parsing logic.
- **Scope discipline is right.** One line + one test; the "fetch-and-merge canonical bio" is correctly deferred to the separate C3 PENDING item.

---

## On the open items

- **README phrasing (§5):** worth doing in the same commit — the "clickable cross-book link" claim becomes *true* only after this fix, so confirming/adjusting the README wording alongside it keeps docs and behavior in sync. Low effort, closes the loop.
- **Commit hygiene (§8):** own atomic `fix(people):` commit, separate branch, not bundled with content — correct and consistent with the house pattern.

## Recommendation

**APPROVE.** The bug is real and precisely diagnosed, the one-line fix is correct and minimal, the type already declares the field, and it's provably conservation-safe (verified against `emitPeople`, and correctly on the domain-object side of the Tier-4 Minor-2 footgun). Fold in **Finding 1** (name `finalizeEntry` explicitly in §1/§2 so the edit lands in the right function) and the two test refinements (Minor 2 malformed-pointer negative case; Minor 3 case-variant assertion) before execution. The validation gate is well-constructed — especially G4's footer-collision-aware design and the G5 dangling-fallback check, which together prove the fix links what should link and leaves the graceful fallback intact for what shouldn't.

This is the smallest and cleanest of the recent plans: a single dropped field, caught by a render-behavior discrepancy, fixed by completing a return map the type already anticipated.

*Method note: the parse → drop → consume chain, the type declaration, the `bookLabels` set, and the conservation surface were verified against source (people-parser.ts, person-card.tsx, types.ts, people/page.tsx, cross-referenced to the Tier-4 emitPeople reading). The regression test, the served-HTML curls (G4/G5), and the full gate (test/lint/build + conservation) are execution-time — not runnable here. One-line code change on a feature branch off main; production untouched until PR.*

---

## Addendum (deeper pass, 2026-06-22) — "sole omission" claim verified

The one residual that could have broadened the fix was self-audit #1's claim that `crossBookSeeBook` is the **only** field set during parse but dropped from `finalizeEntry`'s return. If a second field were also set-but-dropped, this plan would be fixing one symptom of a wider pattern and leaving a sibling bug live. I diffed every `current.X =` assignment in `applyField` against `finalizeEntry`'s return keys:

- **Every** field `applyField` sets is present in `finalizeEntry`'s return **except `crossBookSeeBook`.** `timelineAnchor` — the one field set indirectly (as a side-effect of the `yearFromCreation`/`historicalYear` cases) — *is* returned, so it's not a second gap.
- The fields `finalizeEntry` returns that `applyField` doesn't set (`slug`, `name`, `familiarName`, `suffix`, `rawFields`, `note`, `curiosities`, `verseCount`) are all populated on other paths (the entry-header parse; the curiosity/note flush). Their presence is correct, not a mismatch.

**So `crossBookSeeBook` is genuinely the sole set-but-dropped field.** Self-audit #1 is verified correct, and the one-line fix is *complete* — not one instance of a broader return-map drift. Nothing in the deeper pass changes the verdict. **APPROVE stands. This is final.** The remaining items — the regression test, the G4/G5 curls, and the full gate — are execution-time and can't be closed by more reading.
