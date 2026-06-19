# Audit — MULTI_BOOK_EXPANSION_PLAN.md

**Date:** 2026-06-17
**Auditor:** Claude Opus 4.8 (independent review)
**Plan reviewed:** `docs/audit/MULTI_BOOK_EXPANSION_PLAN.md` (status: "AUDITED — awaiting project-lead go-ahead")
**Method:** Verified every load-bearing claim against the **current** codebase and docs, not the plan's self-report or any prior-session memory (the lead flagged that much has changed — confirmed: the ruleset is now **v3.4**, Rule 30 was added today). Read in full this session: `RULES-CORE.md` (v3.4, complete — incl. Rule 29 v3.3.2 cross-book machinery, Rule 30, the new-book activation checklist, the see-target allow-list), `RULES-HB.md` (complete), `docs/source-analysis/METHOD.md` (complete), `src/domain/books/registry.ts`, `src/lib/content-loader.ts`, `src/infrastructure/content/fs-content-repository.ts`, `src/ui/shared/render-markdown-safe.ts`, `src/app/[locale]/books/page.tsx`, `src/app/[locale]/[book]/page.tsx`, `src/app/[locale]/[book]/chapter/[chapter]/page.tsx`, and the `docs/` + `src/` trees.
**Status:** ◑ **APPROVE the strategy and content method; one Significant architectural correction required before "activate as content lands" can be trusted.** The plan's scholarly spine (Phase-A gating, METHOD.md mandate, Rule-30 usage, see-only-stub handling) is accurate and well-grounded against the current rules and code. But its **app-activation model (§5) misdescribes how books are gated** — `AVAILABLE_BOOKS` is *not* the master gate; pages self-activate from the filesystem. This changes how new content must be staged. Details below.

---

## Executive summary

This is a strong, current-aware plan. Unlike a plan written from stale memory, its rule citations line up with the **v3.4** state of the repository:

- **Rule 30 (Divine Speech Marking) is real AND implemented.** It was added to `RULES-CORE.md` today (v3.4), and the `@@…@@` → `.divine` marker is live in `render-markdown-safe.ts`. The plan's Mark/Luke treatment (mark God's voice at Mark 1:11; narrator OT-citation *not* marked; Gabriel/angel excluded-by-default-and-logged) maps **exactly** to Rule 30's actual scope table. Verified.
- **The METHOD.md per-lexeme process the plan makes mandatory exists verbatim** — cite form → morphology → full semantic range → concordance triangulation → ancient/modern split → traditional-contrast → render-twice → confidence label. The plan's §2 is an accurate restatement, and the "corpus entry is a deliverable" rule matches METHOD.md §6.
- **The Phase-A gate is genuinely necessary, not ceremony.** `RULES-HB.md` confirmed: it has **no** poetry/wisdom coverage (its genre note stops at "Genesis 1 liturgical / Genesis 2+ narrative"). Parallelism, terseness/Rule-11 recalibration, superscriptions, *selah*, refrains, acrostics, and *hevel*-class thesis words are all genuinely unspecified. Gating Psalms/Proverbs/Ecclesiastes behind a supplement is the right call.
- **The cross-book PEOPLE machinery the plan leans on is real** — Rule 29 carries the v3.3.2 see-only-stub convention, the 5-change new-book activation checklist, and the see-target allow-list, all verbatim as the plan describes.

**The one material problem:** §5 claims books are "filesystem-discovered but gated by a central whitelist (`AVAILABLE_BOOKS`, master gate, ~30 call-sites)." **This is not how the code works.** `listBooks()` scans the filesystem and returns any directory containing a `CHAPTER-N.md`; the chapter/book routes' `generateStaticParams` use `listBooks`/`getAllChapterParams` directly and **never consult `AVAILABLE_BOOKS`.** `AVAILABLE_BOOKS` only gates SEO metadata. So drafting a chapter file *publishes a routable page on the next build* — partially activated (no SEO, not in the `/books` index) but live. The plan's "activate in the app only as content lands" safety story (§10.3) is therefore not controllable the way the plan assumes. This is fixable and must be decided before Phase B drafting begins.

---

## Verification table

| # | Plan claim | Result | Evidence (verified this session, v3.4) |
|---|---|---|---|
| 1 | Mark/Luke need **no new rules** (Greek already validated) | ✓ | RULES-GS exists; Rule 30, Ioudaioi policy, Greek Article System all in force. Plan correctly scopes Greek as method-complete. |
| 2 | Rule 30 marks God's voice / Yeshua / Spirit; excludes narrator + Angel-of-YHWH (logged) | ✓ | `RULES-CORE.md` Rule 30 scope table verbatim. Mark 1:11 "you are my son" = direct divine speech → marked; opening Isaiah/Malachi citation = narrator → not marked. Plan's §4.2/§6 accurate. |
| 3 | Rule-30 marking is executable (`@@…@@`) | ✓ | `render-markdown-safe.ts` `applyHighlightMarkers`: `@@([\s\S]*?)@@` → `<span class="divine">`. Nesting of `*added*`/`{t:}` inside `@@…@@` handled. Live today. |
| 4 | METHOD.md per-lexeme process is the mandatory fidelity core | ✓ | `METHOD.md` §2 (8-step lexeme process) + §6 (corpus schema) verbatim. Plan §2 is faithful. |
| 5 | Corpus entry under `docs/source-analysis/{hebrew,greek}/` is a deliverable | ✓ (with nuance) | Dirs exist; `hebrew/` has Gen 1:1–1:13 worked examples; `greek/` + `aramaic/` are README-only (no Greek precedent yet). METHOD.md §6 calls the corpus "internal working material, never quoted verbatim into user-facing content" — the plan treats it correctly as an evidence trail, but see Minor 3. |
| 6 | Hebrew poetry/wisdom gap → extend RULES-HB first (Phase A gates Phase C) | ✓ | `RULES-HB.md` has no poetry/wisdom section; genre note covers only Gen 1 vs Gen 2+. Gap is real; gate is justified. |
| 7 | Full-parity apparatus = chapters + INTRODUCTION (§G mandatory) + CONTEXT companions (§A–I, §H mandatory) + book CONTEXT.md + PEOPLE/PROPHECY where warranted | ✓ | Matches Rule 29 (companion A–I, H mandatory; §I World-at-the-Time) + introduction spec (A–G, G mandatory) + genre-adapted intro table (Poetry & Wisdom row adds Poetic Structure + Performance/Liturgical to §D). Plan's "where warranted" matches the AVAILABLE-not-mandatory pattern. |
| 8 | Intro genre adaptation exists for Poetry & Wisdom | ✓ | Rule 29 "Genre-adapted section variations" table: Psalms/Proverbs/Ecclesiastes → add Poetic Structure + Performance & Liturgical Context to §D. Plan §C.3 consistent. |
| 9 | See-only-stub convention; Matthew = NT canonical home; no re-canonicalization | ✓ (with caveat) | Rule 29 v3.3.2 verbatim. Caveat: rule says canonical home is "the book where the person's narrative arc is most substantive." For Yeshua, Mark/Luke arguably rival Matthew — but deferring to the existing home is the conservative, correct call. See Minor 1. |
| 10 | 5-change new-book activation checklist for PEOPLE | ◑ | Rule 29 verbatim: (1) author 4 locales, (2) `bookLabels` in `people/page.tsx`, (3) parser aliases in `people-parser.ts`, (4) i18n `people.inBook.{book}`, (5) `content-lint.sh §0.12` allow-list. Plan §4.4/§5.5 accurate AS FAR AS IT GOES — but the checklist itself is incomplete vs. the actual script: `content-lint.sh` hardcodes ~8 per-book file-list variables, not just §0.12. See Significant 1. |
| 11 | See-target allow-list must gain the new slugs | ◑ | Rule 29 allow-list currently: genesis, matthew, john, acts, exodus, kings, isaiah. mark/luke/psalms/proverbs/ecclesiastes are NOT in it. This is covered by checklist step 5 but the plan never says the *5 books themselves* need adding as valid see-targets if they become canonical homes (e.g., Luke as canonical home for Zechariah/Elizabeth). See Minor 2. |
| 12 | "Books are filesystem-discovered but **gated by `AVAILABLE_BOOKS` (master gate, ~30 call-sites)**" | ✗ | **`listBooks()` does not consult `AVAILABLE_BOOKS`.** Chapter/book route `generateStaticParams` → `getAllChapterParams`/`getAvailableBooks` → `listBooks` (filesystem only). `AVAILABLE_BOOKS` is imported only in `generateMetadata` (returns `{}` for unlisted books). It is a 3-entry const, not a ~30-call-site gate. See Significant 1. |
| 13 | `BOOK_ORDER` controls book-index order; plan sets canonical order | ◑ | `/books` page has `const BOOK_ORDER = ["genesis","john","matthew"]` (hardcoded, separate from `AVAILABLE_BOOKS`). Plan's §8.3 order reorders the existing gospels (John currently precedes Matthew) and inserts the new books — a real change, not an append. Also a second `HEBREW_BIBLE` Set gates the corpus label and is unmentioned. See Significant 1 + Minor 4. |
| 14 | Conservation gate re-run after any poetic-line parser change | ✓ | `conservation.test.ts` exists; plan §4 Phase A + §7 correctly require re-running it after the parser touch. Sound. |
| 15 | Scope ≈ 170–200 content files | ✓ (reasonable) | 8–10 files/locale/book × 4 × 5 arithmetic is sound; "where warranted" will trim PEOPLE/PROPHECY for the wisdom books. |
| 16 | Greek apparatus discipline covers Mark | ◑ | RULES-GS §Greek Textual Tradition is full (NA28, variant-significance threshold, special-case table). But the plan's §6 Mark notes omit Mark's own text-critical profile: **Mark 1:1** `υἱοῦ θεοῦ` ("son of God") is a famous NA28-bracketed variant, and **Mark 1:2** ("in Isaiah the prophet" vs "in the prophets") is a classic attribution variant — both inside the 1–3 pilot scope. See Minor 6. |
| 17 | `content-lint.sh` auto-discovers / covers new books | ✗ | Script hardcodes genesis/john/matthew in `CONTENT_DIRS`, `STUDY_DIRS`, `PEOPLE_FILES`, `NON_EN_PEOPLE_FILES`, `CONTEXT_FILES`, `EDITORIAL_LOGS`, etc., and §0.12's allow-list + globs only those three. New books are **silently unlinted** until every list is extended. See Significant 1. |
| 18 | Corpus-is-internal boundary is enforced, not just policy | ✓ (corroborates Minor 3) | `content-lint.sh §0.13` greps `content/` + `src/` for the external contributor's name + video-persona phrases, keeping them out of user-facing surfaces while allowing them in `docs/source-analysis/`. The plan's "corpus = internal evidence" posture is machine-guarded. |

---

## Findings

### Significant

**Significant 1 — §5's activation model is inaccurate; `AVAILABLE_BOOKS` is not the gate, so drafting content auto-publishes routable pages.**
The plan's §5 says books are "filesystem-discovered (`listBooks` scans `content/{locale}/{book}/`) but gated by a central whitelist: add slug to `AVAILABLE_BOOKS` (master gate; ~30 call-sites)." Verified against the code, this is wrong in a way that affects safety and sequencing:

- `listBooks()` (`fs-content-repository.ts`) returns **every** `content/{locale}/*` directory that contains a `CHAPTER-N.md`. No whitelist filter.
- `generateStaticParams` for `[book]` and `[book]/chapter/[chapter]` call `getAvailableBooks`/`getAllChapterParams`, which call `listBooks` — **never** `AVAILABLE_BOOKS`.
- `AVAILABLE_BOOKS` is imported in exactly two route files, used only inside `generateMetadata` to return `{}` (suppress SEO) for unlisted books. The `[book]` page's runtime `notFound()` gate also uses `getAvailableBooks` (filesystem), not `AVAILABLE_BOOKS`.

**Consequence:** the moment `content/{locale}/mark/CHAPTER-1.md` exists, the next build statically generates `/{locale}/mark` and `/{locale}/mark/chapter/1` (+ notes/deeper if those files exist) as **live, routable pages** — but with empty `<title>/<description>` (SEO suppressed) and absent from the `/books` index (its `BOOK_ORDER` is hardcoded to the current three). That is a *partial-activation* state: reachable by direct URL and crawlable if linked, yet metadata-less and unlisted. This directly contradicts §10.3 ("activate each book in the app only as its content lands") — activation is not yours to withhold once the files are in `content/`.

**This is the most important thing to fix before Phase B drafting.** Options, in rough order of cleanliness:
1. **Make `AVAILABLE_BOOKS` the real gate:** filter `listBooks` (or `getAvailableBooks`/`getAllChapterParams`) through `AVAILABLE_BOOKS`. Then the plan's §5 model becomes true, drafting is decoupled from publishing, and "activate when ready" = "add the slug." This is the smallest change that makes the plan's own description correct, but it's a parser-seam/SSG change → re-run conservation + full build, and confirm no existing route regresses.
2. **Stage drafts outside `content/`** until activation (e.g., a `content-draft/` tree), moving them in at activation time. No code change, but heavier authoring workflow.
3. **Accept partial activation** and add an explicit `noindex` + "draft" treatment for not-yet-activated books. Weakest; leaves half-live pages.

Pick one and write it into §5/§7 as a definition-of-done item. Until then, the plan's incremental-pilot story (draft Mark 1 EN, review, *then* expose) cannot be guaranteed.

**Related — the activation surface is bigger than §5's five points.** Verified against the actual files, adding a book touches at least these places, several unmentioned by the plan:
- `src/domain/books/registry.ts` — `AVAILABLE_BOOKS` (today only suppresses SEO; becomes the real gate if option 1 is taken).
- `src/app/[locale]/books/page.tsx` — `BOOK_ORDER` **and** `HEBREW_BIBLE` Set (corpus label).
- `src/app/[locale]/[book]/page.tsx` — a **second** `HEBREW_BIBLE` Set (same risk, different file).
- `src/infrastructure/i18n/messages/{en,pt-br,de,es}.json` — `book.{slug}` display name (separate from the `people.inBook.{slug}` key in the Rule-29 checklist).
- `scripts/content-lint.sh` — **~8 hardcoded per-book file-list variables** (`CONTENT_DIRS`, `STUDY_DIRS`, `PEOPLE_FILES`, `NON_EN_PEOPLE_FILES`, `CONTEXT_FILES`, `EDITORIAL_LOGS`, the ES/PT-specific lists) **plus** the §0.12 allow-list hash + glob. Miss any and the new book's content silently escapes linting — the one gap most likely to pass unnoticed, because nothing fails; checks just don't run.
- Rule 29 see-target allow-list (in `RULES-CORE.md`) + the §0.12 Perl hash must agree.

The plan should replace §5's five-bullet sketch with a verified activation checklist covering all of the above, and ideally add a test or lint that **fails** when a book is in `content/` but missing from any of these lists (closing the silent-escape gap permanently).

### Minor

**Minor 1 — Yeshua's canonical PEOPLE home is asserted as Matthew without engaging Rule 29's "most substantive arc" test.**
§8.6 fixes the canonical home as "Matthew (NT canonical home)." Rule 29 says the canonical home is "typically the book where the person's narrative arc is most substantive." With Mark and Luke landing, Yeshua's most substantive arc is debatable (Luke is longer; Mark is the narrative spine). Deferring to the existing Matthew home is defensible and conservative (avoids re-canonicalization churn), but the plan should *say* it's choosing stability over the "most-substantive" heuristic, and log that as the rationale — otherwise a future reviewer will read it as an oversight. One sentence in §8.6.

**Minor 2 — The five new books are not added to the see-target allow-list as *canonical homes*, only as stub *sources*.**
Checklist step 5 adds new books to the allow-list so their PEOPLE files can *point out*. But Luke introduces figures whose canonical home is Luke itself (Zechariah, Elizabeth, Gabriel-as-person?, Simeon, Anna) and Mark/Luke may need to be valid *targets* for future books' stubs. The allow-list currently lacks mark/luke/psalms/proverbs/ecclesiastes entirely. Confirm step 5 adds them as allow-listed slugs (it should), and note which new figures get **full** canonical entries in Luke vs. see-only stubs — that's an authoring decision the plan should pre-flag for the Luke editorial log.

**Minor 3 — "Corpus entry is a deliverable" is correct, but METHOD.md §6 calls the corpus internal-only; keep the deliverable/visibility distinction explicit.**
The plan rightly makes corpus entries mandatory evidence (§2.3). METHOD.md §6 is emphatic that the corpus is "internal working material… never quoted verbatim into user-facing content," carries no contributor persona, and feeds Tier 1/2 + companion §A/§D. The plan doesn't contradict this, but since it elevates the corpus to "deliverable," add a half-sentence that the deliverable is an *internal* auditable artifact, not shipped content — so an executor doesn't mistakenly surface corpus prose in a companion file.

**Minor 4 — The `/books` index has a second gate (`HEBREW_BIBLE` Set) and a hardcoded `BOOK_ORDER`, both unmentioned in §5.**
Activating a book in the index requires editing **two** constants in `books/page.tsx` (and the same `HEBREW_BIBLE` Set also lives in `[book]/page.tsx` for the corpus label): `BOOK_ORDER` (order) and `HEBREW_BIBLE` (corpus tag — Psalms/Proverbs/Ecclesiastes must be added or they'll be mislabeled "Greek Scriptures"). §5's activation list should add: "extend `BOOK_ORDER` and `HEBREW_BIBLE` in `books/page.tsx` **and** the `HEBREW_BIBLE` Set in `[book]/page.tsx`." Small, but it's exactly the kind of two-places-out-of-sync miss that ships a Hebrew book labelled Greek.

**Minor 5 — Proper-name tables are Genesis-1–12-scoped; "carries over the existing tables" undersells the Psalms/Proverbs name work.**
§A says the supplement "carries over the existing proper-name tables." `RULES-HB.md`'s table is explicitly "GENESIS 1-12." Psalms 3 (Absalom), Proverbs 1 (Solomon), and the Davidic superscriptions need name-table entries with the v3.2 first-occurrence convention across 4 locales. Most exist elsewhere in the corpus, but the plan should treat name-table *extension* (not just carry-over) as a Phase-A/Phase-C task.

**Minor 6 — Mark's own text-critical variants aren't pre-flagged, though RULES-GS demands they be handled.**
RULES-GS §Greek Textual Tradition sets a variant-significance threshold ("affects meaning," "early-papyri/major-majuscule support," or "widely known from other translations") and a special-case table. Mark 1–3 contains at least two variants that clear that bar and are exactly the kind a pattern-matching draft would smooth over: **Mark 1:1** — `υἱοῦ θεοῦ` ("son of God") is bracketed/disputed in NA28 (absent from א* among others); and **Mark 1:2** — the citation is attributed "in Isaiah the prophet" (NA28) vs. the Byzantine "in the prophets," a classic case. The plan's §2.4 covers apparatus-grounding generically, but the Mark editorial log should pre-register these two as required Tier-2 variant notes in the pilot (and Mark 1:1 may warrant a 🔴 CRITICAL note per the GS first-occurrence convention). Pre-flagging them now is cheap insurance against the central fidelity risk the plan itself names. (Mark 16:9–20, the famous longer-ending special case, is out of the 1–3 scope but worth a forward-note.)

### Not defects (verified good)

- **Rule 30 usage is exactly right and current.** The plan reads the brand-new rule correctly, including the excluded/logged cases — impressive given it was authored the same day.
- **The fidelity argument (§2, §9) is the right hill.** "Plausible TT-looking text from pattern-matching English translations" genuinely is the central risk, and the METHOD.md + corpus-evidence + Rule-28 gate is the correct mitigation. This is the plan's strongest section.
- **Phase A→C gating is correctly motivated** by a real, verified gap in RULES-HB.
- **Greek-first sequencing is sound** — Mark/Luke are unblocked; the Hebrew half is the long pole. The pilot-first discipline (Mark 1 EN, then scale) matches how the project has shipped before.
- **RULES-GS is genuinely complete, not a stub** — verified directly: NA28 base text, 30-term glossary × 4 locales, divine-name Option C, Greek aspect system, Ioudaioi three-sense policy, genre rules. The plan's "no new rules for Greek" is correct.
- **The corpus-internal boundary is machine-enforced** (`content-lint.sh §0.13`), corroborating the plan's posture that source-analysis evidence never leaks into user-facing content.
- **Conservation-gate re-run after the parser touch** is correctly required.

---

## Recommendation

**APPROVE the strategy, the content-fidelity method, and the phase sequence.** The plan is accurate against the current v3.4 ruleset and the live implementation on every scholarly and governance point I checked — including the same-day Rule 30, which it uses correctly and which is genuinely implemented in the renderer.

**Before Phase B drafting begins, resolve Significant 1:** decide and document how new-book content is gated, because the plan's stated `AVAILABLE_BOOKS` "master gate" does not exist in the code — pages self-activate from the filesystem. The cleanest fix is to make `getAvailableBooks`/`getAllChapterParams` filter through `AVAILABLE_BOOKS` (turning the plan's own description into reality), re-running the conservation gate and full build to confirm no route regression. Then fold the Minor items into §5/§8 (the `BOOK_ORDER` + `HEBREW_BIBLE` second gates, the see-target allow-list additions, the name-table *extension*, the Yeshua-canonical-home rationale, and the corpus-is-internal note).

With Significant 1 fixed, the pilot is correctly chosen: **Mark 1 (EN) full-stack** is the right first artifact — it exercises Rule 30, the companion §A–I, the people see-only stubs, and the activation path end-to-end, on the unblocked Greek side, before any scaling. The Hebrew pilot (Psalms 1 EN) correctly waits on Phase-A sign-off.

*Method note: this audit verified rules, method, and the activation/rendering implementation directly against the current files — including RULES-GS (complete, not a stub), `content-lint.sh` (hardcoded per-book), and the Rule-30 renderer (`@@…@@` live). It did not execute the green gate (no shell) — `pnpm test`/`build`/`lint`/`content:lint` remain the executor's last-mile check, and Significant 1's fix specifically requires a fresh build + conservation run to confirm no route regression.*
