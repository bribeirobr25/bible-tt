# Audit — PLAN_TIER4_CODE_DRY.md

**Date:** 2026-06-20
**Auditor:** Claude Opus 4.8 (independent review)
**Plan reviewed:** `docs/audit/PLAN_TIER4_CODE_DRY.md` (status: DRAFT — lightweight, self-audited)
**Mandate:** verify no regression, content loss, side-effect, or rule/DDD/DRY compliance issue — against actual source, not the plan's self-report or its self-audit table.
**Method:** Read directly this session: the 3 disclaimer sites (`introduction-view`, `context-view`, `book-context-view`), the 2+1 source-line sites (`enrichment-entry`, `book-context-view`, `person-card`'s curiosity `<div className="src">`), `note-block` + `notes-view` (S1c token map), `person-card` (`parseCrossBookSlug` — S2a), `domain/content/types.ts` (`PersonEntry`/`PeopleData` shapes), `people-parser.ts` (where `crossBookSee` is emitted + the `rawFields` exclusion), `content-loader.ts` + `structured.ts` `emitPeople` (the conservation surface — S2a/S2b's load-bearing claim). Could not run the gate (no shell).
**Status:** ✅ **APPROVE — accurate and low-risk; the self-audit holds.** Every enumerated site, count, and consumer claim checks out against source, including the two that most needed verifying: `emitPeople` confirms `sources` does NOT feed conservation (so S2b's "safe" upgrade is justified) and the additive `crossBookSeeBook` field is conservation-safe *as long as it isn't added to the emitter*. Three small precision notes below (parser-emits-`undefined` fallback, the emitter footgun, and the conditional-wrap nuance). None blocks.

---

## Executive summary

Tier 4 is the smallest and lowest-risk tier: three render-equivalent UI helper extractions (S1a–c) and three DDD-low placement fixes that move derivation out of `ui`/`app` into the parser/domain (S2a–c). Each is guarded by the matching equivalence assertion (byte-identical HTML for UI; parse-snapshot + conservation + rendered-output for parser changes). The risk-classing is correct, and unlike a bigger refactor, the blast radius here is genuinely tiny.

The plan's self-audit table is, on verification, **accurate** — a contrast worth stating, because the same table format in earlier tiers contained a mis-cited example (Tier 3) and an over-stated divergence. Here the enumerated facts hold:
- **S1a:** all 3 `tt-disclaimer` sites are byte-identical markup (`<div className="tt-disclaimer" dangerouslySetInnerHTML={{__html: renderInlineSafe(x)}}/>`), differing only in the argument. ✓
- **S1b:** exactly 2 identical `<p className="src" …>` source-line sites; `person-card`'s curiosity source is a `<div className="src">{raw}</div>` (no i18n, no `renderInlineSafe`) — **correctly excluded**. ✓
- **S1c:** `NoteType` has exactly 4 members; `note-block.TYPE` (keyed by uppercase enum) and `notes-view.CHIPS` (lowercase i18n keys) both derive from the same 4 note→color facts in different shapes — the plan flags the shape difference. ✓
- **S2a:** `parseCrossBookSlug` is real domain logic in `ui/` (`/^([a-z][a-z-]*)\/PEOPLE\.md$/i` + `.toLowerCase()`), a genuine `STANDARDS.md` DDD-low violation. ✓
- **S2b:** the load-bearing claim — **`emitPeople` never reads `sources`** — is verified true, so pre-cleaning `sources` in the parser cannot shift conservation. ✓

---

## Verification table (plan claim vs. source)

| # | Plan claim | Verified? | Evidence |
|---|---|---|---|
| 1 | S1a: 3 identical `tt-disclaimer` divs (intro, context, book-context) | ✓ | All three are `<div className="tt-disclaimer" dangerouslySetInnerHTML={{__html: renderInlineSafe(…)}}/>`. intro + book-context wrap in `{x && …}`; context always-renders with `data.disclaimer || t(...)` fallback. Markup identical; only the arg differs. |
| 2 | S1b: exactly 2 identical `<p className="src">` sites + person-card excluded | ✓ | enrichment-entry + book-context: `<p className="src" dangerouslySetInnerHTML={{__html: renderInlineSafe(t("enrichment.source",{source}))}}/>` (both `{source && …}`). person-card curiosity: `<div className="src">{c.source}</div>` (raw, no i18n). Correctly excluded. |
| 3 | S1c: `NoteType` = 4 members; one map drives note-block + legend | ✓ | `types.ts`: `NoteType = CRITICAL\|LEXICAL\|GRAMMATICAL\|THEOLOGICAL`. note-block `TYPE` (uppercase→{cls,dot}); notes-view `CHIPS` (lowercase key+color). Same 4 facts, two shapes — derivation must reproduce both. |
| 4 | S1b: both source-line consumers are server-component-safe (next-intl `useTranslations`, no `"use client"`) | ✓ | enrichment-entry uses `useTranslations` with no `"use client"`; book-context-view same. `<SourceLine>` with `useTranslations` matches — no boundary issue. |
| 5 | S2a: `parseCrossBookSlug` is domain logic in UI; regex needs `/i`+`.toLowerCase()` | ✓ | person-card: `pointer.match(/^([a-z][a-z-]*)\/PEOPLE\.md$/i)` → `match[1].toLowerCase()`. Slug used twice: `href=\`/${locale}/${slug}/people\`` AND `bookLabels[slug]`. Real DDD-low violation. |
| 6 | S2a: `crossBookSeeBook` additive field is conservation-safe | ✓ (with footgun) | `emitPeople` emits `crossBookSee` into `person.meta` but NOT `crossBookSeeBook` (doesn't exist yet). Additive field is conservation-safe **only if not added to `emitPeople`'s meta**. See Finding 2. |
| 7 | S2b: `sources` has one render consumer + not in conservation | ◑ | `people/page.tsx` is the only *renderer* (does the `.replace(/^>\s?/gm,"").replace(/^[-*]\s+/gm,"• ")`); `emitPeople` **never reads `data.sources`** → conservation can't shift (verified directly). **But "one consumer" is imprecise:** the people-parser test also asserts on `sources` (`toBeTruthy()` across 4 locales × 3 books). It won't break (cleaned string is still truthy), but it's a second consumer. See Finding 3. |
| 8 | S2b: the two `replace`s just relocate to the parser | ✓ | The parser already accumulates `sourcesLines` and emits `sources = state.sourcesLines?.join("\n").trim()`. Moving the 2 replaces there is a clean relocation; route renders `sources` directly. |
| 9 | S2c: `chapter-shell` splits `metadata.status` inline | ✓ | chapter-shell `shortStatus` = `data.metadata.status.split(/\s[—–-]\s|\s\(/)[0]…`. Borderline presentation; the plan's "defer if not a clean 1-field add" is the right hedge. |
| 10 | Coverage: no other disclaimer/src/note-map sites | ✓ | Read all data-rendering views (intro/context/book-context/enrichment-entry/note-block/notes-view/person-card/chapter-shell). The 3/3(−1)/2 enumeration is complete. |
| 11 | DDD: new shared UI → `ui/shared/`; moved logic → parser/domain | ✓ | S1a–c add pure presentation components in `ui/shared/`; S2a–c move derivation into `infrastructure`/`domain`. Strictly improves layering. |

---

## Findings

### Minor (precision notes — the actions are right, the plan should state these so the executor doesn't miss them)

**Minor 1 — S2a: specify that the parser emits `crossBookSeeBook` as `undefined` for unparseable pointers, so the UI's plain-`Field` fallback triggers identically.** Today `CrossBookSeeField` calls `parseCrossBookSlug(pointer)`; on `null` (pointer doesn't match `…/PEOPLE.md`) it renders `<Field value={pointer} wide />` — the raw pointer as plain text. After the move, the UI keys off `person.crossBookSeeBook`. For byte-identical output the parser must emit `crossBookSeeBook = undefined` (not `""`) when the regex misses, and the UI must keep: *if `crossBookSeeBook` and `bookLabels[crossBookSeeBook]` → link; else → plain `Field` with the raw `crossBookSee` pointer.* The plan says "UI keeps the plain-`Field` fallback" but doesn't pin the parser's `undefined`-on-miss contract. Pin it — it's the one behavioral edge in S2a.

**Minor 2 — S2a footgun: do NOT add `crossBookSeeBook` to `emitPeople`'s `meta`.** `emitPeople` currently selects specific `PersonEntry` fields into the `person` unit's `meta` (including `crossBookSee`). The additive `crossBookSeeBook` field is conservation-safe **precisely because `emitPeople` won't emit it** — leave it out of the emitter and conservation stays byte-identical. If the executor reflexively adds it to `meta` "for completeness," that's a reviewed conservation meta-delta (and pointless, since nothing consumes it there). State explicitly: the field is UI-only; the emitter is untouched. (This is the inverse of the usual worry — here the safe move is to *not* propagate the field.)

**Minor 3 — S1a/S1b: the conditional wrap stays at the call site; the component must not add its own `{x && …}`.** intro-view and book-context-view wrap the disclaimer in `{data.disclaimer && (…)}` (renders nothing when empty); context-view always renders with a fallback. Likewise the two source lines are wrapped in `{source && (…)}`. The `<Disclaimer html>` / `<SourceLine source>` components must render their element **unconditionally** from the props they're given, leaving the `&&` guard at each call site — otherwise an always-rendering component would emit an empty `<div className="tt-disclaimer">`/`<p className="src">` where today there is nothing, failing the byte-identical gate. The plan implies this ("callers pass the already-resolved string") but should say it for the *conditional*, not just the fallback. The render-diff catches it, but it's the single most likely S1 slip.

**Finding 3 — S2b: the plan says `sources` has "exactly one consumer"; there are two. The second is a test, and it's an opportunity, not a problem.** Beyond the people route, `__tests__/people-parser.test.ts` has `it("captures the Sources Consulted section for genesis, matthew and john")` asserting `expect(r.sources).toBeTruthy()` across all 4 locales × 3 books. Because it's a *truthiness* check (not a snapshot), relocating the two `.replace()` calls into the parser leaves it **green** — the cleaned string is still truthy. So this does not break S2b, but: (a) the plan's self-audit claim "**One** consumer (the people route); verified" is wrong and should be corrected, so an executor who greps and finds the test isn't confused about whether they broke something; and (b) this test is the natural place to **lock the new parser contract** — after S2b, add an assertion that `r.sources` no longer contains a leading `>` or `- ` bullet (i.e. the cleanup now happens in the parser). That converts a latent truthiness check into a real regression lock for the relocated behavior. The full consumer map is now exhaustive: **route renders it, this test truthiness-asserts it, `emitPeople` ignores it, the people opengraph-image doesn't touch it** (all verified this session).

### Confirmed safe (verified, no action)

- **S1c cannot add or drop a chip** — `NoteType` is a closed 4-member union; deriving the legend from one map is strictly safe. The shape difference (uppercase enum keys vs lowercase i18n keys) is real and the plan flags it; the derivation just needs to map enum→lowercase for the `notes.${key}` lookup.
- **S2b is genuinely conservation-safe** — `emitPeople` does not read `sources`; the *rendering* consumer is the people route (plus a truthiness-only test, Finding 3). The "defer→safe" upgrade is correct. Guard = rendered-output equivalence on the people Sources section.
- **person-card source-line correctly excluded from `<SourceLine>`** — it's a different element (`<div>` vs `<p>`), different content (raw `c.source` vs `t("enrichment.source",{source})`), no `renderInlineSafe`. Folding it in would change markup. Leave it (the plan's answer to its own Open-question 2 is correct).
- **DDD posture improves, never regresses** — S2a removes a regex-derivation from `ui/`; S2b removes string-munging from `app/`; both land in `infrastructure`. This is the rare refactor that *raises* `STANDARDS.md` compliance.
- **The parser already structurally supports S2a/S2b** — `applyField` has the `crossBookSee` case and deliberately excludes it from `rawFields` (so no duplicate raw row); `parsePeopleMarkdown` already accumulates `sourcesLines`. Both moves slot into existing seams, not new machinery.

---

## On the open questions

- **Q1 (do S2b/S2c, or just S2a + Strand 1):** Do **Strand 1 + S2a + S2b**; treat **S2c as defer-by-default**. S2a is the clear DDD win (regex out of UI). S2b is now verified conservation-safe and is a real `app/`-layer cleanup (string-munging out of the route) — cheap and worth it. S2c (`statusShort`) is borderline presentation formatting; promoting a display-only string-split to a domain field is arguably *worse* DDD (domain carrying a presentation concern), so the plan's "defer if not a clean 1-field add" is right — I'd lean **defer outright** unless you want the `ChapterMetadata` field for another reason.
- **Q2 (person-card source-line stays separate):** **Agreed, verified.** Different element + raw content; excluding it is correct.

---

## Recommendation

**APPROVE.** This is a clean, low-risk, correctly-guarded tier, and its self-audit is — on verification against source — accurate. Sequence as written (S1a → S1b → S1c → S2a → S2b, each its own gated revertible commit), fold in the three Minor precision notes (parser emits `undefined` on miss; do **not** add `crossBookSeeBook` to `emitPeople`; keep the conditional wrap at the call site), and defer S2c unless the domain field earns its place independently.

The guard-selection is right per change class: byte-identical HTML for the UI extractions (S1), and rendered-output equivalence for S2b (since the parsed `sources` string *intentionally* changes, a snapshot of it would diff by design — the rendered output is the invariant). The one claim that carried the whole S2b risk — "conservation doesn't see `sources`" — is verified true in `emitPeople`, so the upgrade from defer to safe is sound.

*Method note: every enumerated site, the `NoteType` arity, the `parseCrossBookSlug` regex, and the `emitPeople` conservation surface were verified against source. The byte-identical HTML diffs (S1), people-data snapshot (S2a), rendered-output equivalence (S2b), and the full gate (`pnpm test`/`lint`/`build`/`content:lint` + conservation 11,831) were not run here (no shell) — they remain the executor's last-mile proof. New branch `tier4-code-dry` off `main`; production untouched.*

---

## Addendum (deeper pass, 2026-06-20) — `sources` consumer surface closed

After the main audit I closed the one residual that touched a load-bearing claim I'd partly taken on the plan's word: S2b's "exactly one consumer of `PeopleData.sources`." Mapped every reader against source:
- **`people/page.tsx`** — renders it (does the two `.replace()`s today). ✓ the one the plan names.
- **`people/opengraph-image.tsx`** — read in full; does **not** touch `sources` (only `t(book.*)` + static title). ✓
- **`structured.ts` `emitPeople`** — does **not** read `sources` (confirmed in main audit). ✓ conservation-safe.
- **`__tests__/people-parser.test.ts`** — **does** assert `r.sources` (`toBeTruthy()`, 4 locales × 3 books). A second consumer the plan missed; stays green after S2b (truthiness, not snapshot). → **Finding 3.**

So the plan's "one consumer" is imprecise (there are two: route + test), but the conclusion holds — S2b is safe, the test passes, and the test is the right place to add a regression lock for the relocated cleanup. **Verdict unchanged: APPROVE.** The remaining unverifiable items are execution-time (HTML diffs, snapshots, full gate) and cannot be closed by more reading. This is final.
