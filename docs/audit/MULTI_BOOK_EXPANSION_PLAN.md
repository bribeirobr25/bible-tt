# Multi-Book Expansion Plan — Mark, Luke, Psalms, Proverbs, Ecclesiastes (ch. 1–3)

**Status:** AUDITED + INDEPENDENTLY REVIEWED — all open questions resolved (§8); the independent audit (`AUDIT_MULTI_BOOK_EXPANSION_PLAN.md`) was verified against the live code and **incorporated** (see §5 Phase 0, §9). **Awaiting project-lead's final go-ahead to begin execution.** No drafting starts until that go-ahead.
**Created:** 2026-06-17. **Audited:** 2026-06-17. **Independent review incorporated:** 2026-06-17.
**Key correction from review:** `AVAILABLE_BOOKS` is *not* a render gate — content auto-publishes. A new **Phase 0 (activation-gate hardening)** is now a prerequisite before Phase B. See §5.
**Lead sign-off 2026-06-17:** Phase 0 / Option 1 (make `AVAILABLE_BOOKS` the real gate) **APPROVED**. Plan **APPROVED FOR EXECUTION** — proceeding incrementally, gated per book, starting with Phase 0 then Mark. All content ships `provisional` (Rule 28).
**Owner decision (this session):** delay Genesis 13–50 (Phase 12); open five new books breadth-first, **first 3 chapters each, at full apparatus parity.**

---

## 0. Decisions already taken (frame this plan)

1. **Hebrew poetry/wisdom gap → extend RULES-HB *first*.** Author a poetry/wisdom supplement and obtain sign-off **before** any Psalms/Proverbs/Ecclesiastes drafting.
2. **Apparatus depth → FULL PARITY.** Each book ships at the same standard as Genesis/John/Matthew: chapters + INTRODUCTION + chapter-level CONTEXT companions (§A–I incl. §I "World at the Time") + book-level `CONTEXT.md` + PEOPLE + PROPHECY **where warranted** (the "include only with substantive content" rule still governs each section/file). Nothing deferred.
3. **Source-text fidelity → the METHOD.md per-lexeme process is MANDATORY** for every pericope; output ships `provisional` pending Hebraist/Hellenist review (Rule 28). See §2.
4. **Start point → plan first** (this document), then a single-chapter full-stack pilot before scaling.

---

## 1. Scope & deliverables

Five books, two genres:

| Book | Source | Genre | Ruleset | PEOPLE? | PROPHECY? | Risk |
|---|---|---|---|---|---|---|
| **Mark** (Markos) | Greek | narrative gospel | RULES-GS (existing) | Yes (shares figures w/ Mt/Jn → see-only stubs) | Yes (messianic) | Low |
| **Luke** (Loukas) | Greek | narrative gospel (+ hymns ch.1) | RULES-GS (existing) | Yes (+ genealogy in-text ch.3) | Yes | Low–Med |
| **Psalms** (Tehillim) | Hebrew | lyric poetry | RULES-HB **+ poetry supplement** | Likely thin (superscription names) | Ps 2 (royal/messianic) | High until supplement |
| **Proverbs** (Mishlei) | Hebrew | wisdom / instruction | RULES-HB **+ poetry supplement** | Likely none (Solomon attribution → intro) | Unlikely | High until supplement |
| **Ecclesiastes** (Qohelet) | Hebrew | wisdom / reflective | RULES-HB **+ poetry supplement** | Likely none | Unlikely | High until supplement |

PEOPLE/PROPHECY are authored **only where the text warrants** — consistent with how existing books decide (e.g. not every Genesis chapter has a PROPHECY file). For the wisdom books this likely means no PEOPLE page and only Psalm 2 carrying prophecy; those judgments get logged.

**Per book, per locale (full apparatus):**
- `CHAPTER-1/2/3.md` — TT chapter (verses, Reading Guide, Notes, glossary).
- `INTRODUCTION.md` — sections A–F as warranted, **§G Sources mandatory**, disclaimer block.
- `study/CHAPTER-1/2/3-CONTEXT.md` — contextual companion (§A–I, only §H Sources mandatory; **§I "World at the Time"** with the established multi-scenario / Option-C structure).
- `study/CHAPTER-N-PROPHECY.md` — where warranted.
- `CONTEXT.md` — book-level cross-chapter motifs.
- `PEOPLE.md` — where warranted (Mark, Luke).

**Plus, not in `content/`:**
- `docs/editorial-log/{book}.md` — per book.
- `docs/source-analysis/{hebrew,greek}/` — worked-example corpus entries for the pericopes drafted (the evidence behind Tier 1/2 renderings). **This is a deliverable, not optional** (see §2).

**Rough file count (full parity):** ~3 ch-context + 3 chapter + 1 intro + 1 book-context (+ PEOPLE/prophecy where warranted) ≈ **8–10 files/locale/book × 4 locales × 5 books ≈ 170–200 content files**, + 5 editorial logs + corpus entries. Larger than the lean option, but each book ships at the project's real standard. (Still well under Genesis 13–50.)

---

## 2. Source-text fidelity — the non-negotiable core

The TT's fidelity is **not** "writing in TT style." It is the per-lexeme source-analysis method in `docs/source-analysis/METHOD.md`, which operationalizes the Prime Directive + Rules 1–29 at the lexeme/clause level. Every existing chapter was built on it. **The single biggest risk in AI-assisted drafting is producing plausible TT-*looking* text by pattern-matching existing English translations rather than analyzing the source.** That would look right and be hollow — the exact compromise this project forbids.

**Therefore, mandatory for every pericope drafted under this plan:**
1. Run the **METHOD.md §2 per-lexeme process** on the actual Hebrew/Greek: cite the form, decompose morphology, state full semantic range, **triangulate by concordance**, separate ancient/modern sense, contrast traditional renderings, **render twice** (literal → smoothed), label confidence (Rule 13).
2. Note **macro-structure first** (word count, fronting, verb–subject order, repetition, parallelism) before the word-by-word pass.
3. Record the analysis as a **worked-example corpus entry** under `docs/source-analysis/{hebrew,greek}/` — this is an **internal** auditable evidence trail feeding the main text, Tier-2 notes, and companion §A/§D. Per METHOD.md §6 it is *never quoted verbatim into user-facing content* and carries no contributor persona (machine-guarded by `content-lint.sh §0.13`). *(Audit Finding 5: `greek/` currently holds only a README — Mark will produce the **first** Greek corpus entries; establish the file pattern from the existing `hebrew/genesis-*` examples.)*
4. Ground variant decisions in the apparatus (**BHS/BHQ** for Hebrew, **NA28** for Greek), not memory. *(Apparatus-access question for audit — §8.)*
5. **All output ships `provisional`** and enters the Rule-28 review gate. The Hebraist/Hellenist sign-off is the fidelity backstop; AI drafting does not bypass it.

If a pericope cannot be honestly grounded (no apparatus, irrecoverable ambiguity), it is flagged, not guessed.

---

## 3. Genre reality check (why the Hebrew books are gated)

- **Mark & Luke** sit inside the already-validated method: Koine Greek, the Greek Article System, the Ioudaioi policy, Rule-30 divine speech (God's voice + Yeshua's speech; angels and narrator OT-citations excluded), no `{t:}` transliterations. **No new rules required.**
- **Psalms / Proverbs / Ecclesiastes** break new ground:
  - **Parallelism** (synonymous/antithetic/synthetic) is the load-bearing structure — must be *shown*, not flattened to prose.
  - **Terseness & construct chains** — poetry omits particles/articles the narrative method assumes; Rule-11 added-words fires constantly → needs a poetry threshold.
  - **Superscriptions, *selah*, liturgical notations** (Psalms) — keep/transliterate/bracket convention needed.
  - **Refrains & repetition** — preserved verbatim, never stylistically varied (a real AI-drafting risk).
  - **Qohelet's *hevel*** — the thesis-word ("vapor/breath/futility"); a Rule-2 ambiguity decision setting the whole book's tone.

This is why Phase A gates Phase C.

---

## 4. Phased execution

### Phase A — RULES-HB poetry/wisdom supplement *(blocks Phase C; can run parallel to B)*
**Deliverable:** a poetry/wisdom section in `docs/rules/RULES-HB.md` (audit Q1: **inline section + version bump**, not a sibling file), covering: line-structure rendering, parallelism preservation, Rule-11 added-word recalibration for terse poetry, superscription + *selah* + notation convention, refrain/repetition fidelity, thesis-term ambiguity (*hevel*) handling, acrostic/wordplay policy. **Audit Minor 5:** the RULES-HB proper-name table is explicitly scoped `GENESIS 1-12`; this is **name-table *extension*** (not mere carry-over) — add entries with the v3.2 first-occurrence convention across 4 locales for Absalom (Ps 3), Solomon (Prov 1), the Davidic superscriptions, etc. (treat as a Phase-A/Phase-C task).
**Possible code touch:** a **poetic-line representation** in the chapter markdown + parser/UI (lines within a verse). Scoped here so Phase C authors to a stable format; re-run the conservation gate after any parser change. *(Audit Q2 decides docs-only vs docs+code.)*
**Process:** draft → lead audit → RULES-HB version bump + CHANGELOG → **sign-off before C.**

### Phase B — Mark 1–3 + Luke 1–3 (full apparatus) *(no blockers; start here)*
EN-first → PT-BR → DE → ES, per book. For each chapter: source-analysis (§2) → chapter file → companion (§A–I) → prophecy (where warranted) → propagate locales. Then book INTRODUCTION + book CONTEXT.md + PEOPLE.md, all locales.
1. `docs/editorial-log/mark.md`, `luke.md`; log name forms, Rule-30 scope per chapter, key variants **before** drafting.
2. **Mark 1–3** full stack. (Opening OT citation = narrator, not Rule-30; God's voice 1:11 = marked.)
3. **Luke 1–3** full stack. (Magnificat 1:46–55 + Benedictus 1:68–79 = hymns → line structure even in Greek; Gabriel = angel, Rule-30 excluded by default + logged; genealogy in 3:23–38 in-text.)
4. **PEOPLE cross-book handling:** Mark/Luke share figures with Matthew/John (Yeshua, Yochanan the Immerser, Miriam, etc.). Apply the RULES-CORE Rule-29 v3.3.2 see-only-stub convention + the **5-change new-book activation checklist** so canonical entries aren't duplicated. This is the one place this batch touches the cross-book machinery.
5. App activation for mark + luke (§5). Gate after each book.

### Phase C — Psalms 1–3, Proverbs 1–3, Ecclesiastes 1–3 (full apparatus) *(after Phase A sign-off)*
Same per-chapter flow, under RULES-HB + the new supplement.
1. `docs/editorial-log/{psalms,proverbs,ecclesiastes}.md`.
2. Each chapter: source-analysis (Hebrew corpus entry) → chapter (with poetic lines) → companion → propagate.
3. INTRODUCTIONs frame authorship debates (Davidic superscriptions, Solomonic attribution, Qohelet identity) with the dual-label/confidence system — no side taken.
4. PEOPLE only if warranted; Psalm 2 prophecy. App activation. Gate after each book.

---

## 5. App activation — corrected after independent audit (2026-06-17)

> **Correction (audit Significant 1, verified against the code):** the earlier draft claimed `AVAILABLE_BOOKS` is a "master gate (~30 call-sites)." **False.** `listBooks()` is a pure filesystem scan; `generateStaticParams` (both `[book]` and chapter routes) and the runtime `notFound()` gates resolve from the filesystem (`getAvailableBooks`/`getAllChapterParams`), **never** from `AVAILABLE_BOOKS`. `AVAILABLE_BOOKS` is imported in 16 files but used *only* for SEO metadata (`return {}`), OG-image name fallback, and app-bar nav-highlighting — **it gates nothing that renders.** Net effect: the instant `content/{locale}/mark/CHAPTER-1.md` exists, the next build publishes `/{locale}/mark` and `/{locale}/mark/chapter/1` as live, routable pages — just SEO-less and absent from `/books`. "Activate only when ready" is therefore **not controllable** under the current code.

### Phase 0 — Activation-gate hardening *(PREREQUISITE; must land before Phase B drafting)*
Make `AVAILABLE_BOOKS` the genuine gate so drafting is decoupled from publishing (audit-recommended Option 1):
1. Filter `getAvailableBooks` / `getAllChapterParams` (in `content-loader.ts`) — or `listBooks` itself — through `AVAILABLE_BOOKS`, so static-param generation and the `notFound()` gates only expose whitelisted slugs.
2. Add a **guard test** (or `content-lint` check) that **fails** when a directory exists under `content/{locale}/` but its slug is missing from any required list (registry, `BOOK_ORDER`, both `HEBREW_BIBLE` sets, i18n `book.*`, the content-lint file-lists, the see-target allow-list). This closes the *silent-escape* gap (audit Finding 17) permanently — a half-activated book becomes a red build, not an invisible one.
3. Re-run the **conservation gate + full build**; confirm no existing route regresses (the existing three books must still resolve identically).
*Result: a drafted book stays invisible until its slug is added to `AVAILABLE_BOOKS` — the plan's "activate as content lands" story becomes real. Mark 1 EN can then be drafted and reviewed without exposing a half-built `/mark`.*

### Per-book activation checklist (the *verified* full surface)
When a book is ready to go live, edit **all** of:
1. **`src/domain/books/registry.ts`** — add slug to `AVAILABLE_BOOKS` (after Phase 0, the real gate).
2. **`src/app/[locale]/books/page.tsx`** — add to `BOOK_ORDER` **and** to the `HEBREW_BIBLE` set (Psalms/Proverbs/Ecclesiastes → Hebrew, or they mislabel as "Greek Scriptures"). *Note: canonical order (§8.3) reorders the existing gospels (John currently precedes Matthew) — a visible change to the live `/books` page, not a pure append.*
3. **`src/app/[locale]/[book]/page.tsx`** — add to the **second** `HEBREW_BIBLE` set (corpus label on the book hub).
4. **i18n `book.{slug}`** display name in all four `messages/{locale}.json` (separate from the `people.inBook.{slug}` key in the Rule-29 checklist) — audit Q4: familiar form.
5. **`scripts/content-lint.sh`** — extend **every** hardcoded list the new book touches: `CONTENT_DIRS`, `STUDY_DIRS`, `PEOPLE_FILES`, `NON_EN_PEOPLE_FILES`, `CONTEXT_FILES`, `EDITORIAL_LOGS` (+ any ES/PT-specific lists if applicable) **and** the §0.12 Perl allow-list hash. *(The Phase-0 guard test backstops this, but extend the lists so checks actually run.)*
6. **Rule 29 see-target allow-list** (in `RULES-CORE.md`) — add the new slugs so PEOPLE stubs can point to/from them (audit Minor 2).
7. **PEOPLE activation** (Mark/Luke) — the Rule-29 5-change checklist (`bookLabels` in `people/page.tsx`, parser aliases in `people-parser.ts`, i18n `people.inBook.{book}`, content-lint §0.12, 4-locale authoring).
8. **`src/app/[locale]/start/page.tsx`** — *optional* reading-plan step folding.

---

## 6. Translation/method notes seeded per book (for the editorial logs)

- **Mark:** abrupt OT-citation opening (narrator, not divine speech); God's voice 1:11 marked; *euthys* ("immediately") repetition preserved; shortest/fastest gospel. **Pre-register two NA28 variants inside the pilot scope (audit Minor 6, RULES-GS variant-significance threshold):** **1:1** `υἱοῦ θεοῦ` ("son of God") is bracketed/disputed (absent from א* a.o.) — likely a 🔴 CRITICAL Tier-2 note at first occurrence; **1:2** attribution "in Isaiah the prophet" (NA28) vs. "in the prophets" (Byzantine) — required Tier-2 variant note. (Forward-note: Mark 16:9–20 longer-ending special case is out of 1–3 scope.)
- **Luke:** orderly-account prologue (1:1–4, Theophilus); Magnificat + Benedictus hymns; genealogy ch.3.
- **Psalms 1–3:** Ps 1 (two ways); Ps 2 ("YHWH said… you are my son" — divine speech + later-reception messianic, dual-labeled); Ps 3 superscription ("of David, fleeing Absalom") + *selah* (3:2,4,8) — first test of the Phase-A convention.
- **Proverbs 1–3:** prologue/purpose (1:1–7); "fear of YHWH = beginning of knowledge"; personified Wisdom.
- **Ecclesiastes 1–3:** Qohelet superscription; *hevel havelim* (1:2) thesis decision; 3:1–8 "a time for everything."

---

## 7. Definition of done (per book + overall)

Standard gate (`CONTRIBUTING.md`): `pnpm test` · `pnpm lint` · `pnpm build` · `pnpm content:lint` · i18n parity (4 locales) · conservation gate. Plus:
- Parser auto-discovers new files (no change for Greek; **possible poetic-line parser tweak** from Phase A for Hebrew → re-run conservation).
- Source-analysis corpus entry exists for every drafted pericope (§2).
- Every chapter `provisional` (Rule 28); new content logged in `docs/audit/PENDING.md` under the review gate.
- Decisions logged in `docs/editorial-log/{book}.md`.
- `CLAUDE.md` scope + `README.md` scope + `EXECUTION_HISTORY.md` updated as each phase lands.

---

## 8. Audit decisions (RESOLVED — lead sign-off 2026-06-17)

1. **RULES-HB supplement form → inline section in `RULES-HB.md` + version bump** (keep one Hebrew ruleset; CHANGELOG entry).
2. **Poetic-line representation → YES, make the small parser/UI change** so Hebrew poetry renders as real lines (bicola/tricola). Phase A is therefore **docs + code**; re-run the conservation gate after the parser change.
3. **Book order → canonical biblical order:** Genesis · Psalms · Proverbs · Ecclesiastes · Matthew · Mark · Luke · John. *(Audit note: this **reorders** the two existing gospels — `BOOK_ORDER` currently lists John before Matthew — so it's a visible change to the live `/books` page, not a pure append. Confirm at sign-off.)*
4. **Display names → familiar form as the label** ("Psalms", "Mark"); the transliterated form (Tehillim, Markos…) is introduced inside the INTRODUCTION per the name-rendering convention.
5. **Source apparatus → draft now, flag variant calls for Rule-28 review** (matches current provisional posture; BHS/BHQ + NA28 grounding is the reviewer's backstop).
6. **PEOPLE canonical-home → see-only stubs.** Mark/Luke point to the existing canonical entries (Matthew is the NT canonical home); no re-canonicalization. *(Audit Minor 1: Rule 29 says the canonical home is "the book where the arc is most substantive" — with Luke (longest) and Mark (narrative spine) landing, Yeshua's home is arguably debatable. We choose **stability over the most-substantive heuristic** to avoid re-canonicalization churn; this rationale is logged, not an oversight.)* **Audit Minor 2:** figures whose canonical home is genuinely Luke (Zechariah, Elizabeth, Simeon, Anna) get **full** entries in Luke, not stubs; the Luke editorial log pre-flags which figures are full-vs-stub. The new slugs (mark, luke, psalms, proverbs, ecclesiastes) must be added to the see-target allow-list as valid **targets**, not just sources.

---

## 9. Risks

- **Content auto-publishes before activation** (audit Significant 1, verified) — drafting a chapter file makes a live SEO-less page on the next build; `AVAILABLE_BOOKS` gates nothing that renders. → mitigated by **Phase 0** (make it the real gate) + a guard test that fails on half-activated books.
- **Silent lint-escape for new books** (audit Finding 17) — `content-lint.sh` hardcodes the three current books; a new book runs *no* content checks until every list is extended, and nothing fails to warn you. → mitigated by the Phase-0 guard test + the §5 checklist.
- **Hebrew book mislabelled "Greek Scriptures"** (audit Minor 4) — two separate `HEBREW_BIBLE` sets must both gain the wisdom slugs. → in the §5 checklist.
- **Hebrew poetry under-served by current rules** → mitigated by Phase A gating.
- **AI pattern-matching instead of source analysis** → mitigated by the mandatory METHOD.md process + corpus-entry evidence trail + Rule-28 review (§2). *The central integrity risk.*
- **AI paraphrase drift in poetry** (smoothing parallelism, varying refrains) → explicit refrain-fidelity rule + per-chapter logging + pilot review.
- **PEOPLE duplication across gospels** → Rule-29 see-only-stub convention + activation checklist (§4 Phase B).
- **Scope is real** (~170–200 files + corpus) → mitigated by pilot-first and per-book gating; sequence Greek (unblocked) ahead of Hebrew.

---

## 10. Sequencing & pilots (recommended)

1. **Phase A drafted in parallel** with Phase B (Greek books don't depend on it) so the Hebrew half isn't calendar-blocked.
2. **Full-stack pilot before scale:** **Mark 1 (EN)** — source-analysis + chapter + companion + (prophecy if any) — reviewed by you against the existing-book bar, *then* propagate/scale. After Phase A sign-off, **Psalms 1 (EN)** as the Hebrew pilot before scaling Proverbs/Ecclesiastes.
3. **Activate each book in the app only as its content lands.**

**Critical path:** Phase A sign-off is the long pole for the Hebrew half; the Greek half ships independently and first.

---

*Next action after audit: create `docs/editorial-log/mark.md`, run the Mark 1 source-analysis, and draft the Mark 1 (EN) full-stack pilot — while drafting the RULES-HB poetry supplement for sign-off in parallel.*
