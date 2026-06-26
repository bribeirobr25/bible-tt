# Audit — PLAN_1PETER_EXPANSION.md

**Date:** 2026-06-26
**Auditor:** Claude Opus 4.8 (independent review)
**Plan reviewed:** `docs/audit/PLAN_1PETER_EXPANSION.md` (status: PLANNED — self-audited; awaiting project-lead audit)
**Mandate:** verify no regression, content loss, side-effect, or rule/DDD compliance issue — against actual source, not the plan's self-report. This is a **new-book activation + authoring-from-source** plan, and the **first epistle** + the **first leading-digit slug** in the corpus, so the bar is: are the activation touchpoints complete and correctly located, does the `1-peter` slug actually work through every surface, and is the genre adaptation real against the parsers/rules?
**Method:** Read directly this session: `registry.ts` (current `AVAILABLE_BOOKS`), the full current `scripts/content-lint.sh` (per-book lists + §0.11 glob + §0.12 hash/glob/regex), `person-card.tsx` (`CrossBookSeeField` + the slug consumer), `activation-consistency.test.ts` (the Phase-0 backstop + its slug-extraction regexes). Cross-referenced the Luke + cross-book-see-link + Mark audits this session (the slug-parsing regex in `people-parser.applyField`, the CARD/count-string wiring, the RULES-CORE 5-change checklist). Could not run the gate (no shell).
**Status:** ◑→✅ **APPROVE the approach and scope, but ONE substantive finding must be resolved before Phase 0 — the `1-peter` slug is incompatible with the two `([a-z][a-z-]*)` cross-book slug-parsing regexes.** The plan's self-audit #1 checked four surfaces where a leading digit is fine and declared the slug safe; it missed the two surfaces (the §0.12 validator regex and the `parseCrossBookSlug` UI regex) where a leading digit silently fails. For 1 Peter *itself* this is latent (its stubs all point outward to `mark`), but it breaks the moment any book see-stubs *to* `1-peter` — i.e. the very `2-peter` precedent this plan exists to set. Every other touchpoint (1–8) is verified accurate against current source. Resolve the slug question (widen both regexes, or choose a non-digit slug), then this is a clean APPROVE.

---

## Executive summary

The pipeline has matured a lot since Luke: there's now an `AUTHORING-PLAYBOOK.md` with numbered traps, an `activation-consistency.test.ts` that turns a half-activated book into a red build, and Acts has shipped. This plan rides that maturity well — it correctly identifies 1 Peter as the **epistle-genre pilot**, sizes the famous cruxes (3:18–22, 1:1–2, the household code), reframes PROPHECY to "OT-in-argument," and lands the genre adaptations (§B Recipient Community, §D Epistolary Conventions) on the right RULES-CORE genre row. The activation touchpoint list is, with one exception, complete and correctly located against the *current* source — I verified the §0.12 hash/glob, the §0.11 DE glob, the per-book lists, the count string, and the corpus fall-through all match what the plan says to change.

The self-audit is honest on most points — notably self-audit #2 (correctly catches that `1-peter` is NOT forward-tracked in §0.12, unlike Acts which already was) and #4 (corpus fall-through). But **self-audit #1 — the slug-safety claim — is where it slips**, and it's the headline finding. The reasoning enumerates four places a leading digit is fine ("route segment, content dir, i18n key, activation-consistency extraction") and concludes the slug is safe. All four are individually correct — I verified them. But the corpus has **two slug-parsing regexes that both anchor on `[a-z]`**, and the self-audit checked neither:
- §0.12's validator: `/^\*\*(?:See|Ver|Siehe):\*\*\s+([a-z][a-z-]*)\/PEOPLE\.md/i`
- `people-parser.applyField`'s `crossBookSee` case (consumed by `person-card.tsx`): `/^([a-z][a-z-]*)\/PEOPLE\.md$/i`

A slug beginning with `1` matches neither. The consequence is precise and bounded (Finding 1).

---

## Verification table (plan claim vs. source)

| # | Touchpoint / claim | Verified? | Evidence |
|---|---|---|---|
| 1 | `AVAILABLE_BOOKS` += `1-peter` | ✓ | Currently genesis/matthew/mark/luke/john/acts (6). Static gate. Correct. |
| 2 | `BOOK_ORDER` append after `acts` | ✓ | (Luke audit) `BOOK_ORDER` in books/page.tsx; activation test enforces it ⊇ AVAILABLE_BOOKS both ways. Correct. |
| 3 | `bookLabels` += `1-peter` | ✓ | (cross-book audit) `bookLabels` map keyed by slug; bracket lookup works with leading digit. Needed. |
| 4 | `people-fields.ts` `inBook` aliases | ✓ | Needs `"in 1 peter","em 1 pedro","in 1. petrus","en 1 pedro"`. Correct pattern. |
| 5 | i18n `book["1-peter"]` + heroTagline + **sectionKick "Six"→"Seven"** | ✓ | 6 books today → "Six books"; bracket-key `book["1-peter"]` works; activation test asserts `book.<slug>` in all locales. Correct, incl. the count trap. |
| 6 | content-lint per-book lists + §0.11 DE glob | ✓ | CONTENT/STUDY/PEOPLE/NON_EN_PEOPLE/CONTEXT/ES_NT_DIRS/ES_NT_CHAPTER/EDITORIAL_LOGS all hardcode books (now incl. luke+acts); §0.11 glob now incl. mark/luke/acts. 1-peter needs adding to each. Accurate. |
| 7 | §0.12 allow-list — 3 places (doc + hash + glob) | ✓ | `%allowed` hash = genesis/matthew/mark/luke/john/acts/exodus/kings/isaiah (no 1-peter); glob = those 6 books' PEOPLE.md (no 1-peter). Both need 1-peter. Plus RULES-CORE doc. Self-audit #2 correct. **But see Finding 1: the hash entry is necessary-but-not-sufficient because the regex won't capture a `1-peter` slug.** |
| 8 | New files (editorial-log, source stub) | ✓ | `EDITORIAL_LOGS` list pattern + source-analysis dir. Correct. |
| — | Corpus default (1-peter → Greek) | ✓ | Two `HEBREW_BIBLE = {genesis}` sets; 1-peter falls through to Greek Scriptures; activation test asserts the two sets agree. No edit needed. Self-audit #4 correct. |
| — | activation-consistency backstop checks 1↔2↔5↔6 | ✓ | Test asserts content exists, BOOK_ORDER ⊇ active (both ways), HEBREW sets agree, i18n `book.<slug>` all locales, content-lint CONTENT_DIRS coverage. Its slug-extraction regexes (`[^"']+`, bracket-key, substring) are all leading-digit-safe. Robust backstop. |
| — | **Slug `1-peter` works on every surface** | ✗ | **Breaks the two `([a-z][a-z-]*)` slug-parsing regexes (§0.12 validator + `parseCrossBookSlug`/`applyField`).** Self-audit #1 missed these. Finding 1. |
| — | Peter's PEOPLE home = mark; 1-Peter stubs Kefa→mark | ✓ (consistent) | Outgoing `mark` slug matches `[a-z]` fine, so 1 Peter's own stubs render correctly — which is *why* the slug defect is latent for 1 Peter. |

---

## Findings

### Substantive — resolve before Phase 0

**Finding 1 — the `1-peter` slug is incompatible with the two cross-book slug-parsing regexes; self-audit #1's "slug is safe" conclusion checked the wrong surfaces.** Both the §0.12 lint validator and the people-parser's cross-book-slug parser (consumed by `person-card.tsx`'s `CrossBookSeeField`) capture the target slug with `([a-z][a-z-]*)` — **first character must be `[a-z]`**. `1-peter` starts with `1` and matches neither. Consequences, precisely:

- **§0.12 validator:** a pointer `**See:** 1-peter/PEOPLE.md` doesn't match the regex → it is silently **skipped**, neither validated nor flagged. So even after touchpoint 7 adds `'1-peter' => 1` to the `%allowed` hash, the hash is never consulted for a `1-peter` pointer (the regex never captures it). A typo like `**See:** 1-petr/PEOPLE.md` would sail through unvalidated. The hash edit is necessary-but-not-sufficient.
- **UI (`parseCrossBookSlug` in `people-parser.applyField` → `CrossBookSeeField`):** an incoming `**See:** 1-peter/PEOPLE.md` parses to `crossBookSeeBook = undefined` → `CrossBookSeeField` renders the **plain-text fallback** (the raw `1-peter/PEOPLE.md` string) instead of a link.

**Is 1 Peter itself affected?** No — and this is the trap. 1 Peter's *own* see-stubs all point **outward to `mark`** (`**See:** mark/PEOPLE.md`), and `mark` matches `[a-z]` fine, so 1 Peter ships with working links and a clean §0.12. The defect is **latent**. It becomes **active** the moment any book see-stubs *to* `1-peter` — which is exactly what `2-peter` will do first (Kefa/Silvanus/Markos canonical-home references back to 1 Peter), and the plan explicitly sets `1-peter` as **the `N-book` precedent** (§9 decision 5). So the plan is encoding a precedent that the cross-book machinery, as written, cannot consume.

**Resolution — a real design choice for §9 decision 5 (which currently presents it as mere style):**
- **Option A — widen both regexes** to `([a-z0-9][a-z0-9-]*)` (or `([a-z][a-z0-9-]*)` won't help — the *first* char is the digit; must be `[a-z0-9]`). Two-line change, preserves the clean `1-peter`/`2-peter` slugs, and is the durable fix for the whole epistle trajectory (1-2 Peter, 1-3 John later). Add a regression test: a `1-peter` see-stub parses to `crossBookSeeBook === "1-peter"` and §0.12 captures+validates it. **Recommended.**
- **Option B — choose a non-digit slug** (`first-peter`, `peter-1`). Zero code change, but uglier routes/i18n keys and it *also* sets the precedent (so `second-peter`, `first-john`…). Inferior.

Either way, the plan must **stop treating decision 5 as a stylistic precedent and treat it as "Option A requires a verified 2-regex widening + test; Option B avoids code change."** This is the one thing that should block Phase 0 until decided, because the slug is touchpoint 1 and everything keys off it.

### Minor

**Minor 1 — touchpoint 7's `%allowed`-hash edit is correct but, on its own, dead code until Finding 1 is resolved.** If Option A (widen regex) is taken, `'1-peter' => 1` in the hash becomes live and necessary. If Option B (non-digit slug) is taken, the hash entry uses the chosen slug. Either way the hash edit stays — just note in the plan that under the current regex it would never fire, so the regex fix is the *enabling* change, not the hash entry.

**Minor 2 — the epistle-genre parser assumption deserves an explicit spike, like Luke's canticle spike.** §6 says the INTRODUCTION §B/§D and OT-in-argument PROPHECY "only differ in content emphasis; parsers key on A–G intro sections + the prophecy entry structure, which are unchanged." That's almost certainly right (the intro parser keys on the `## A.`–`## G.` letter headers, genre-agnostic; the prophecy parser keys on entry fields, not on "fulfillment vs. allusion" semantics). But it's an *assumption about the first epistle*, and the cheap way to de-risk it is to author **one** companion section of each new shape first (the §D Epistolary-Conventions intro block + one OT-in-argument prophecy entry) and run the parsers before authoring all five chapters' worth — same logic as the Luke Magnificat-renderer spike. If a parser assumes a narrative-only header or a fulfillment-status enum value the epistle reframe doesn't supply, learn it on one entry, not five chapters in.

**Minor 3 — `book["1-peter"]` heroTagline/sectionKick count: confirm Acts is already "Six" before bumping to "Seven."** Touchpoint 5 bumps "Six books" → "Seven." That presumes the *current* string reads "Six" (i.e. Acts already bumped it from "Five"). Six books are active, so it *should* read "Six" in all 4 locales — but since the Acts plan, not this one, owned that bump, add a one-line Phase-0 check: grep the four locales' `sectionKick` actually says the six-equivalent before changing it, so a stale "Five" (if Acts missed a locale) doesn't get silently bumped to a wrong "Seven." (The heroTagline should already list Acts too — same check.)

**Minor 4 — household-code (2:18–3:7) restraint is well-framed; make the Tier-2 "flag, don't import" an explicit Rule-3 + Rule-28 editorial-log item, not just prose.** §2/§6 handle this correctly (render the Greek — ὑποτάσσω, "weaker vessel," Sarah 3:6 — flag interpretive history in Tier-2, import nothing). Given it's the highest-restraint passage in the book and a likely reviewer flashpoint, require a `1-peter.md` editorial-log entry for the household-code rendering decision (per Rule 28's required-trigger for theologically loaded choices), so the Hellenist/lead see the decision was logged, not silently made. Same for 3:18–20 (spirits in prison) and 4:6.

### Confirmed safe (verified, no action)

- **Touchpoints 1–6, 8 are complete and correctly located** against current source (post-Luke, post-Acts). The §0.12 hash+glob, §0.11 DE glob, per-book lists, EDITORIAL_LOGS, corpus fall-through all match the plan.
- **Self-audit #2 and #4 are accurate** — `1-peter` genuinely absent from the §0.12 allow-list (unlike Acts); corpus fall-through to Greek Scriptures needs no edit.
- **The activation-consistency test is a real, robust backstop** and is itself leading-digit-safe (its extraction uses `[^"']+`, bracket-key, and substring — none anchored on `[a-z]`). So a half-activated `1-peter` is a red build, and the *test* won't be fooled by the slug — only the two production regexes are.
- **Genre framing is correct** — §B/§D land on the RULES-CORE "Letters & Epistles" genre row; the A–G intro structure (G mandatory) is unchanged; PROPHECY's dual-label + citation-vs-allusion system carries over with "fulfillment status" reread as mode-of-deployment. The parsers are content-agnostic about this (pending Minor 2's spike).
- **OT-citation divine-name handling is right** — κύριος in 1:25 / 2:3 / 3:12 = YHWH under Option C; DE→JHWH, ES·PT→YHWH in the citations on propagation. Matches the corpus systematics.
- **Scope + phasing + EN checkpoint** mirror the proven Acts/Luke sequence; the EN checkpoint before propagation is correctly the load-bearing human gate, and the cruxes (3:18–22, 1:1–2, household code, 4:6) are the right items to flag for it.
- **Rollback is clean** — additive (new files + registrations); revert = remove 1-peter content + the registrations.

---

## On the decisions (§9)

1–2 (scope/depth, lead-confirmed) and 3–4 (AI-draft→provisional→Rule-28; EN checkpoint) are the established pattern — fine. **6 (OT-in-argument PROPHECY reframe)** is the right call and parser-safe (pending Minor 2). **5 (slug) is the one that matters and is mis-framed as style** — it's the Finding-1 design decision: Option A (widen both `[a-z][a-z-]*` regexes to admit a leading digit + regression test) keeps `1-peter`; Option B (`first-peter`) avoids the code change. Decide this *first*, because touchpoint 1 and the whole `N-book` epistle trajectory hang on it.

## Recommendation

**APPROVE the scope, depth, genre framing, and phasing** — the plan is well-reasoned and the activation list is accurate everywhere I could check it except the slug. **Resolve Finding 1 before Phase 0:** the `1-peter` slug silently fails the two cross-book slug-parsing regexes (§0.12 validator + `parseCrossBookSlug`), latent for 1 Peter itself (outgoing stubs → `mark` work) but active the instant `2-peter` points back — the precise precedent this plan sets. Take Option A (widen both regexes to `[a-z0-9][a-z0-9-]*` + a `1-peter` round-trip regression test) to keep the clean slug and de-risk the whole 1-2 Peter / 1-3 John trajectory, or Option B (non-digit slug) to avoid touching code. Then fold in the minors: the epistle-parser spike (one §D block + one OT-in-argument prophecy entry before bulk authoring); the pre-bump count-string check; and editorial-log entries for the household-code / spirits-in-prison / 4:6 renderings.

With the slug resolved, this is a clean, well-scoped genre pilot that correctly de-risks the epistle trajectory behind a human checkpoint — and the slug fix, done once via Option A, pays for every `N-book` epistle that follows.

*Method note: the activation surface (registry, content-lint §0.11/§0.12, the two HEBREW_BIBLE sets via the activation test, the slug-parsing regexes in content-lint + person-card + people-parser) was verified against current source this session. EN authoring quality, the genre-parser spike, marker/header parity, and the full gate are execution-time — not runnable here; the Rule-28 Hellenist review is the human safety net the plan correctly centers. Additive new-book work on a feature branch off main; production untouched until PR.*

---

## Addendum (deeper pass, 2026-06-26) — Option A verified non-regressive; no third slug site

Finding 1 recommends **Option A: widen both `([a-z][a-z-]*)` regexes to `([a-z0-9][a-z0-9-]*)`**. Before standing behind that as *safe*, I closed the one residual that could undercut it: does widening have a side effect, and are there really only two slug-parsing sites? Read the full `people-parser.ts` this session (rather than citing the regex from the prior audit):

1. **Exact regex confirmed at source:** `applyField`'s `crossBookSee` case is `value.trim().match(/^([a-z][a-z-]*)\/PEOPLE\.md$/i)` → `seeMatch[1].toLowerCase()`. Matches the §0.12 perl regex's anchor. Both verified this session.
2. **No third slug-parsing site.** The only `PEOPLE.md`-pointer slug capture in the parser is this one case. Every *other* slug in the parser is **heading-derived** (`baseSlug = name.toLowerCase().replace(/\s+/g, "-")`), not pointer-parsed. So Finding 1's blast radius is exactly two regexes — confirmed, not assumed.
3. **Option A is non-regressive — the `/i` flag already proves it.** The regex is *already* case-insensitive and already `.toLowerCase()`s the capture, so it already matches `Mark/PEOPLE.md`, `MARK/...`, etc. Widening `[a-z]`→`[a-z0-9]` only newly admits a leading **digit**; it does **not** newly admit any malformed pointer that should fail — a space (`foo bar/PEOPLE.md`) still fails (space ∉ `[a-z0-9-]`), an empty slug (`/PEOPLE.md`) still fails (needs ≥1 leading char). The character-class change is strictly additive for digits. So Option A cannot regress an existing-passing or existing-failing pointer. **Recommendation upgraded from "recommended" to "verified safe."**
4. **1 Peter's internal person slugs are unaffected either way.** Kefa/Silvanus/Markos entries get heading-derived slugs (`silvanus`, etc.) independent of the `1-peter` book slug; the book slug only appears in the route, `bookLabels[book]`, and incoming cross-book pointers. So the finding is exactly as bounded as stated, and Option A's fix is precisely scoped to incoming-pointer parsing.

**Nothing in the deeper pass changes the verdict. APPROVE the approach; resolve Finding 1 before Phase 0 — and Option A is now verified side-effect-free, so it's the clear choice over Option B.** The remaining items — EN authoring quality, the epistle-parser spike, marker/header parity, the full gate — are execution-time and can't be closed by more reading. This is final.
