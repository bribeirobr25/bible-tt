# Audit — PLAN_LUKE_EXPANSION.md

**Date:** 2026-06-22
**Auditor:** Claude Opus 4.8 (independent review)
**Plan reviewed:** `docs/audit/PLAN_LUKE_EXPANSION.md` (status: PLANNED — self-audited 2026-06-22, Q1–Q3 approved)
**Mandate:** verify no regression, content loss, side-effect, or rule/DDD/DRY compliance issue — against actual source, not the plan's self-report. This is a **new-book activation + authoring-from-source** plan, so the bar is: are the activation touchpoints complete and correctly located, and do the wiring claims (CARD, count strings, corpus default, auto-discovery) hold against source?
**Method:** Read directly this session: `registry.ts` (`AVAILABLE_BOOKS`), `books/page.tsx` (`BOOK_ORDER`, `HEBREW_BIBLE`, the `/books` glance), `[book]/page.tsx` (book-hub at-a-glance + SEO `what`, the second `HEBREW_BIBLE`), `messages/en.json` (count strings, `book.*`, `/start`), `scripts/content-lint.sh` (all per-book hardcoded lists + the §0.12 cross-book validator + its allow-list hash). Cross-referenced the Mark-propagation and cross-book-see-link audits this session. Could not run the gate (no shell).
**Status:** ✅ **APPROVE the plan and its approach — but the activation touchpoint list (Phase 0) is incomplete in two specific, verifiable ways that will silently under-protect Luke if not folded in.** The wiring self-audit (CARD, count strings, /start, auto-surfaces) is accurate; the corpus default is verified safe; the phasing/checkpoint discipline is right. The two gaps are both in `content-lint.sh` and both concern Luke's most see-stub-heavy-ever genealogy. Neither breaks the build; both leave Luke's cross-book pointers unvalidated. Fold in Findings 1–2 before Phase 0.

---

## Executive summary

This is the right plan for a hard task, and its self-audit is honest where I could check it. The genuinely valuable catches it already made — all verified against source:

- **CARD block is load-bearing (self-audit #1):** `books/page.tsx` builds the /books glance from `[card[0], card[1], card[2], card[4]]`; `[book]/page.tsx` gates the *entire* at-a-glance panel on `card.length > 0` and derives the book-hub SEO description from `card[0].value` (`what ? \`${title} — ${what}\` : …subtitle`). So no CARD → empty /books glance + no hub glance panel + weak SEO. Exactly as the plan states. ✓
- **The count string is a real trap (self-audit #2):** `en.json` has `books.sectionKick = "Four books, four languages"` — a literal "Four" that must become "Five," *in addition to* the `heroTagline` enumeration, in all 4 locales. ✓
- **/start needs no edit (self-audit #3):** `start.step4 = "The Gospels"` is generic; no step names a gospel slug. ✓ Avoids a wasted edit.
- **Auto-surfaces (self-audit #4):** `generateStaticParams`/breadcrumbs/people-page all key off `AVAILABLE_BOOKS` + `getAvailableBooks` filesystem scan. ✓

And the plan correctly frames the *real* risk: Luke is **authored from Greek**, not propagated, so Phase 1 (EN from NA28) is the crux and the EN checkpoint is the load-bearing human gate before 3× propagation.

**Where it's incomplete:** the Phase-0 touchpoint list misses two `content-lint.sh` edits that matter *specifically because Luke is the most cross-book-see-stub-heavy book in the corpus* (the ~76-name Luke-3 genealogy points at genesis + matthew throughout). Without them, Luke's outgoing cross-book pointers are never lint-validated — the very safety net §0.12 exists to provide, and the exact class of gap my Mark-EN audit caught (Mark allow-listed but not globbed; since fixed for Mark, now recurring for Luke). These are Findings 1–2.

---

## Verification table (plan claim vs. source)

| # | Touchpoint / claim | Verified? | Evidence |
|---|---|---|---|
| 1 | `registry.ts` `AVAILABLE_BOOKS` += luke | ✓ | `["genesis","matthew","mark","john"]`; static gate. Correct. |
| 2 | `books/page.tsx` `BOOK_ORDER` += luke | ✓ | `BOOK_ORDER = ["genesis","matthew","mark","john"]`; insertion `…mark,luke,john` is sensible canonical order. |
| 3 | `people/page.tsx` `bookLabels` += luke | ✓ | `bookLabels = {genesis,matthew,mark,john}` (verified in cross-book-see-link audit). Needs `luke: t("book.luke")`. |
| 4 | `people-fields.ts` `inBook` += luke aliases | ✓ | `inBook` currently ends at mark forms; needs `"in luke","em lucas","in lukas","en lucas"`. Correct. |
| 5 | i18n `book.luke` + heroTagline + **sectionKick count** | ✓ | `en.json`: no `book.luke`; `sectionKick`="Four books…"; heroTagline lists 4. All 3 edits needed × 4 locales. Self-audit #2 correct. |
| 6 | `content-lint.sh` per-book lists += luke | ◑ | `CONTENT_DIRS/STUDY_DIRS/PEOPLE_FILES/NON_EN_PEOPLE_FILES/CONTEXT_FILES/ES_NT_DIRS/ES_NT_CHAPTER_FILES/EDITORIAL_LOGS` all hardcode books — plan names these correctly. **But misses §0.11 glob and §0.12 glob+hash.** See Findings 1–2. |
| 7 | RULES-CORE see-target allow-list += luke | ◑ | The *enforced* allow-list is the perl `%allowed` hash **in content-lint.sh §0.12**, not just RULES-CORE.md. Touchpoint 7 must edit both. See Finding 1. |
| 8 | New files (editorial-log, source-analysis stub) | ✓ | Consistent with `EDITORIAL_LOGS` list + the source-analysis dir referenced by §0.13. Correct. |
| — | Corpus default (Luke → Greek Scriptures) | ✓ | **Two** `HEBREW_BIBLE = new Set(["genesis"])` (books/page + [book]/page); Luke not in either → falls through to `corpusGreek`. Auto-correct; no edit needed. Plan correctly omits it as a touchpoint. See Note A. |
| — | §0.14 unbalanced-bold covers Luke | ✓ | Uses `find content -name '*.md'` → auto-discovers Luke. No edit. |
| — | Conservation auto-discovers Luke | ✓ | (Mark audit) `walk(CONTENT_ROOT)` + per-file expected; no count to edit. |

---

## Findings

### Substantive (both are Phase-0 completeness gaps in `content-lint.sh`)

**Finding 1 — touchpoint 7 must edit the §0.12 allow-list *hash in content-lint.sh*, and add Luke's PEOPLE.md to the §0.12 *glob* — not just RULES-CORE.md.** The cross-book-pointer validator (§0.12) is the lint that catches a mistyped `**See:** geneis/PEOPLE.md` before it silently hits the graceful UI fallback. Two hardcoded things govern it:
- **The scan glob:** `content/*/genesis/PEOPLE.md content/*/john/PEOPLE.md content/*/matthew/PEOPLE.md content/*/mark/PEOPLE.md`. **Luke's PEOPLE.md is not covered** → none of Luke's outgoing cross-book pointers get validated. This is the exact gap my Mark-EN audit flagged (Mark was allow-listed but unglobbed); it was since fixed *for Mark* (mark is in the glob now) — and it recurs for Luke. **It matters most for Luke**, because the Luke-3 genealogy (~76 names) is the heaviest cross-book-see-stub payload in the project, all pointing at genesis/matthew. An unvalidated typo there = a silently-dangling link.
- **The allow-list hash:** `my %allowed = (genesis, matthew, mark, john, acts, exodus, kings, isaiah)`. `luke` is **not** in it. Luke's *outgoing* pointers target genesis/matthew (already allowed, so they pass) — but if any current or future book's PEOPLE.md ever points **to** luke, it would falsely warn until `luke => 1` is added. Add it now for completeness (it's part of "registering luke as a valid target").

The plan's touchpoint 7 says "add `luke` to the cross-book see-target allow-list" and points at RULES-CORE.md. RULES-CORE.md is the *documentation* of the allow-list; the *enforced* copy is the perl hash. **Fix:** touchpoint 7 = (a) RULES-CORE.md doc, (b) the §0.12 `%allowed` hash, **and** (c) add `content/*/luke/PEOPLE.md` to the §0.12 glob. The script's own §0.12 comment says exactly this ("update both this allow-list AND the proper-name entries per the 5-change new-book activation checklist") — so the script already knows it's a two-place edit; the plan should mirror that.

**Finding 2 — touchpoint 6 misses §0.11 (DE redundant-parens) glob.** §0.11 hardcodes `content/de/genesis/CHAPTER-*.md content/de/john/CHAPTER-*.md content/de/matthew/CHAPTER-*.md` — note **mark is already absent** (a pre-existing gap), and Luke would be too. So the DE `Name (Name)` redundant-parens regression check would **not scan DE Luke chapters**. Given Luke's heavy proper-name density (genealogy + canticles full of HB names), DE Luke is exactly where a redundant-parens slip is likely. **Fix:** add `content/de/luke/CHAPTER-*.md` to §0.11's glob in touchpoint 6. (Optionally also backfill `content/de/mark/CHAPTER-*.md` while there, closing the pre-existing Mark gap — but that's out of scope; just flag it.)

### Minor

**Minor 1 — make the corpus default an explicit verification line, not a silent assumption (Note A).** The plan correctly does *not* list a HEBREW_BIBLE edit (Luke→Greek is the fall-through default in both `books/page.tsx` and `[book]/page.tsx`). That's right. But add a one-line gate check ("Luke shows corpus = 'Greek Scriptures' on /books and the book hub") so it's verified, not assumed — and so the deferred Psalms/Proverbs/Ecclesiastes plan inherits the knowledge that *those* (Hebrew Bible) WILL need **both** `HEBREW_BIBLE` sets edited (a 9th/10th touchpoint that only applies to HB books). Worth recording now while the two-set structure is fresh.

**Minor 2 — the canticle intra-verse-line-break risk deserves a Phase-1.1 spike, not just "verify during authoring."** §2 + §6 flag that the Magnificat/Benedictus/etc. render "as prose with line breaks" and to "verify the renderer preserves intra-verse line breaks early." That's the right instinct, but it's buried as a risk. Promote it to an explicit **first** Phase-1 sub-step: author *one* canticle (Magnificat, 1:46-55), run it through `renderMarkdownSafe`, and confirm line breaks survive **before** authoring all of Luke 1 — because if the renderer collapses them (it processes markdown, and a single `\n` inside a verse may not yield a `<br>`), the fix is a renderer change that should be known before 170 verses are written. Cheap spike; de-risks the one genuinely novel rendering question Luke introduces.

**Minor 3 — Gabriel/Rule-30 exclusion is correct; log it as the Matthew-malakh precedent explicitly.** §2 correctly excludes Gabriel (*angelos*-class) from divine-speech marking (like Matthew's *malakh*), marks God's/Spirit's direct speech (baptism Bat-Qol 3:22), and treats the canticles as human speech. This is the right Rule-30 reading. Just ensure `luke.md` cites the Matthew *malakh*/Mark precedent so the Hellenist reviewer sees the marking decision was principled, not ad hoc — the exclusion of an angelic speaker is exactly the kind of call a reviewer will probe.

### Confirmed safe (verified, no action)

- **Wiring self-audit (#1–#4) is accurate** — CARD consumers, count strings, /start, and auto-surfaces all verified against source.
- **Corpus default is safe** — Luke auto-classifies as Greek Scriptures via fall-through in both HEBREW_BIBLE sites.
- **§0.14 unbalanced-bold + conservation both auto-discover Luke** — no edit; the completeness/label guards (Mark audit) apply unchanged.
- **The authored-from-source framing is honest** — the plan does not pretend Luke is propagation; it isolates the hard EN-authoring crux behind a human checkpoint and ships provisional under Rule-28, exactly as the existing GS books were produced.
- **Cross-book see-link fix is correctly leveraged** — the just-shipped `crossBookSeeBook` fix means Luke's genealogy stubs to genesis/matthew render as links (those routes exist); not-yet-authored targets keep the dangling fallback. The plan's reliance on it is sound (and Luke is its largest test).
- **Phasing + EN checkpoint + one-locale-at-a-time** mirror the proven Mark sequence; the EN checkpoint is correctly identified as the riskiest gate.
- **Rollback is clean** — additive (new files + registry entries); revert = delete content + unwind the touchpoints.

---

## On the open decisions (all three approved)

Q1 (AI-draft→provisional→Rule-28), Q2 (EN checkpoint before propagation), Q3 (mirror Matthew companion depth) are all the right calls and match the established GS pattern. Q2 is the single most important control in the plan — it's where a systemic Greek-authoring error is caught before propagation triples it. No issue.

## Recommendation

**APPROVE.** The plan's approach, phasing, and human-checkpoint discipline are right, and its wiring self-audit holds against source. Before Phase 0, fold in **Finding 1** (touchpoint 7 = RULES-CORE doc **+** §0.12 `%allowed` hash **+** `content/*/luke/PEOPLE.md` in the §0.12 glob — so Luke's heavy genealogy pointers are actually validated) and **Finding 2** (add DE Luke chapters to §0.11's glob). Add the three minors: an explicit corpus-default gate line; a Magnificat renderer spike *before* bulk Luke-1 authoring; and the Matthew-*malakh* precedent citation in `luke.md` for the Gabriel exclusion.

The activation touchpoints are otherwise complete and correctly located, and the EN-checkpoint-before-propagation structure is exactly the control a from-source new book needs. With Findings 1–2 folded in, Luke's defining characteristic — the largest cross-book genealogy in the corpus — is protected by the same lint that protects every other book, rather than silently exempted from it.

*Method note: the 8 touchpoints, the CARD/count-string/corpus wiring, and the content-lint per-book lists + §0.12 validator were verified against source (registry.ts, books/page.tsx, [book]/page.tsx, en.json, content-lint.sh, RULES-CORE.md; cross-referenced to the Mark + cross-book-see-link audits). The EN authoring quality, marker/header parity, canticle rendering, and full gate are execution-time — not runnable here, and the Rule-28 Hellenist review is the human safety net the plan correctly centers. Additive new-book work on a feature branch off main; production untouched until PR.*

---

## Addendum (deeper pass, 2026-06-22) — Finding 1's "two separate copies" claim verified against RULES-CORE.md

Finding 1 rests on the claim that the §0.12 lint allow-list (the perl `%allowed` hash) and RULES-CORE.md's allow-list are **two separate copies** — so "add luke to RULES-CORE" (the plan's touchpoint 7) is insufficient on its own. I had verified the perl hash directly but asserted the RULES-CORE side without reading it. Read the full `docs/rules/RULES-CORE.md` (§Rule 29 → People and Genealogy Files) to close it:

1. **RULES-CORE explicitly documents the dual-copy structure.** Its **"New-book activation checklist — 5 SYNCHRONIZED CHANGES"** lists, as step 5: *"Extend lint allow-list — `scripts/content-lint.sh` §0.12 rule: add `{new-book}` to the cross-book PEOPLE pointer allow-list."* So RULES-CORE *itself* confirms the §0.12 hash is a separate enforced copy that must be edited alongside the doc. **Finding 1 is verified correct** — and touchpoint 7 should adopt this 5-change framing (it currently maps to changes 2/3/4/5 across touchpoints 3/4/5/6/7 but doesn't name the checklist; aligning to RULES-CORE's own 5-change list would make the activation provably complete).
2. **The two allow-lists byte-match.** RULES-CORE's *"Allow-list of valid `**See:**` target slugs (v3.3.2 published list)"* table = `genesis, matthew, mark, john` (authored) + `acts, exodus, kings, isaiah` (forward-tracked) — **identical to the §0.12 perl hash** I read earlier. Two synchronized copies, neither lists `luke`. Confirms Finding 1's prescription exactly: add `luke` to **both**, plus the §0.12 glob.
3. **Bonus — the deferral is well-founded.** RULES-CORE's genre-adaptation table (Rule 29 → Book-Level Introductions) classifies the **Gospels as Narrative** → standard A–G introduction sections. Luke is therefore the Matthew/Mark template exactly as the plan claims. **Poetry & Wisdom** (Psalms, Proverbs, Ecclesiastes) is a *separate* genre row that adds **Poetic-Structure** and **Performance & Liturgical Context** sections to D — a genuinely different authoring shape. So the plan's scope decision to defer Psalms/Prov/Eccl ("unresolved Hebrew-poetry-genre question") is grounded in the ruleset, not just caution.

Note: RULES-CORE's front-matter spec example for editorial-log files still reads `**Ruleset:** v3.3` in one schema sample while the document header is v3.4 — a stale-stamp consistent with the systematic v3.3/v3.4 lag flagged in the kyrios audit (Finding 2). Not Luke's concern; noted for the same PENDING sweep.

**Nothing in the deeper pass changes the verdict. APPROVE the approach, fold in Findings 1–2 (now fully grounded in RULES-CORE's own checklist), stands.** The remaining items — EN authoring quality, the Magnificat renderer spike, marker/header parity, and the full gate — are execution-time and can't be closed by more reading. This is final.
