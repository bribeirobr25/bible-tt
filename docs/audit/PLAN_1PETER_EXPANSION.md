# Plan — 1 Peter 1–5 (new book, full treatment, 4 locales) — the EPISTLE GENRE PILOT

**Status:** PLANNED — self-audited + **externally AUDITED ✅ APPROVE** (`AUDIT_1PETER_EXPANSION_PLAN.md`, 2026-06-26; Finding 1 + 4 minors verified against source & folded in) · awaiting lead go-ahead to execute · **Date:** 2026-06-26 · **Class:** content authoring (new book, from source) + new-book activation + **first epistle-genre book** + a 2-regex slug-machinery widening · **Risk:** Medium-High (*authoring from Greek*; Rule-28 provisional; **the pipeline's first Letter**; famous cruxes 3:18–22)

> **External-audit disposition (Finding 1 verified against source this session; Option A adopted):**
> - **Finding 1 (substantive) — the `1-peter` slug fails the corpus's TWO cross-book slug-*parsing* regexes; self-audit #1 checked the wrong surfaces.** Verified at source: `scripts/content-lint.sh:235` (§0.12 validator) and `src/infrastructure/content/people-parser.ts:272` (`applyField` `crossBookSee` → `crossBookSeeBook`, consumed by `person-card.tsx`'s `CrossBookSeeField`) both capture the target with **`([a-z][a-z-]*)`** — first char must be `[a-z]`. `1-peter` (leading `1`) matches neither → a `**See:** 1-peter/PEOPLE.md` pointer is (a) silently **skipped** by §0.12 (never validated against the `%allowed` hash) and (b) parsed to `crossBookSeeBook = undefined` → the UI renders the **plain-text fallback**, not a link. **Latent for 1 Peter** (its own stubs point *out* to `mark`, which matches `[a-z]`), **active the instant `2-peter` (or any book) points back to `1-peter`** — the very `N-book` precedent this plan sets. My self-audit #1 verified four leading-digit-*safe* surfaces (route / content dir / i18n key / activation-test extraction) and missed these two slug-*parsing* sites. **Confirmed no third slug-parsing site** (grep: only `people-parser.ts:272` parses a pointer slug; every other parser slug is heading-derived).
> - **Resolution = Option A (verified side-effect-free):** widen BOTH regexes `([a-z][a-z-]*)` → `([a-z0-9][a-z0-9-]*)` + add a `1-peter` round-trip regression test (`crossBookSee` parses to `crossBookSeeBook === "1-peter"`; §0.12 captures+validates a `1-peter` pointer). Non-regressive: the regexes are already `/i` + `.toLowerCase()`, so widening only newly admits a leading **digit** — a space or empty slug still fails. This is the durable fix for the whole 1–2 Peter / 1–3 John trajectory and is now **Phase 0a** (a code prerequisite, before the content touchpoints). It promotes **§9 decision 5 from a style choice to this design decision.**
> - **Minor 1 (folded):** the touchpoint-7 `%allowed` hash entry (`'1-peter' => 1`) is **dead code until Phase 0a widens the §0.12 regex** — the regex must capture the slug before the hash is ever consulted. The regex widening is the *enabling* change; the hash entry is necessary-but-not-sufficient.
> - **Minor 2 (folded):** added **Phase 1.0 — epistle-parser spike** (author ONE §D Epistolary-Conventions intro block + ONE OT-in-argument PROPHECY entry, run the intro + prophecy parsers, before bulk-authoring 5 chapters) — the Luke-canticle-spike logic, applied to the first epistle's two novel companion shapes.
> - **Minor 3 (verified):** `sectionKick` reads `Six/Seis/Sechs/Six` and heroTagline lists Acts in **all 4 locales** (confirmed this session) — the Acts bump landed cleanly, so Six→Seven is safe; Phase 0 still greps-before-bumping as a guard.
> - **Minor 4 (folded):** the **household-code (2:18–3:7), spirits-in-prison (3:18–20), and 4:6** renderings each require an explicit `1-peter.md` editorial-log entry (Rule-28 theologically-loaded-decision trigger), not just Tier-2 prose — so the Hellinist/lead see the decision was logged, not silently made.

> Follows `docs/guides/AUTHORING-PLAYBOOK.md` Track B + **trap T-16 (epistle genre)**. Reuses the Acts template (`PLAN_ACTS_EXPANSION.md`, audited APPROVE) but 1 Peter is **argument, not narrative** — the first time the pipeline meets a Letter.

> **Confirmed by project-lead (2026-06-26):** **scope = all 5 chapters** (the first fully-complete NT book; ~105 verses ≈ Acts 1–3's 99); **depth = full, genre-adapted** (per-chapter CONTEXT + PROPHECY, INTRODUCTION/CARD, thin PEOPLE, book CONTEXT, all 4 locales). EN-from-Greek → provisional → Rule-28, and the EN checkpoint before propagation, carry over from the established GS pattern (Acts A-001/A-002).

> **Self-audit disposition (verified against the codebase):**
> 1. **Slug = `1-peter`** (mirrors the canonical short-name; sets the pattern for `2-peter` later). A leading digit is fine for the route segment, the content dir, the i18n key (`book["1-peter"]`), and the activation-consistency extraction (string match). Flagged as a decision (§9) since it's a precedent.
> 2. **`1-peter` is NOT forward-tracked in the §0.12 allow-list** (`content-lint.sh:238-239` = genesis/matthew/mark/luke/john/acts + exodus/kings/isaiah). Touchpoint 7 must add it to (a) the RULES-CORE doc list, (b) the §0.12 `%allowed` hash, (c) the §0.12 scan glob. (Contrast Acts, which was already in the hash.)
> 3. **Peter's canonical PEOPLE home is `mark/PEOPLE.md`** (the fullest Twelve-roster; Acts see-stubbed Kefa → mark). 1 Peter's PEOPLE see-stubs **Kefa → mark/PEOPLE.md**; Silvanus + Markos are brief entries here (verify whether mark/PEOPLE already carries a Markos entry → see-stub if so). **No genealogy.**
> 4. **Corpus default needs no edit** — 1 Peter → Greek Scriptures via the `HEBREW_BIBLE = {genesis}` fall-through. Gate-verify "Greek Scriptures" renders.
> 5. **§0.3b/§0.3c** (ES diacritic + anti-calque guards) recurse `content/es`/`content/de` → es/de `1-peter` auto-covered.

---

## 1. What this is (and how it differs from Acts)

Add **1 Peter 1–5** as a new book in **all 4 locales**, full genre-adapted treatment. Authored from the Greek (NA28) first → `provisional` pending Hellenist (Rule 28) → propagate.

**The crucial difference: 1 Peter is an EPISTLE.** Every prior book (Genesis, the gospels, Acts) is narrative; 1 Peter is a *letter* — opening salutation (1:1–2), body of exhortation, closing greetings (5:12–14). This is **playbook trap T-16 in action** (the first epistle is a deliberate genre milestone). The verse pipeline still applies (verse text is verse text), but three companion shapes adapt:
- **INTRODUCTION** gains **§B Recipient Community** (the five provinces; the "elect exiles of the diaspora"; their social situation / suffering) and **§D Epistolary Conventions** (Greco-Roman letter form; the household code / *Haustafel* 2:18–3:7; the amanuensis question, 5:12 "through Silvanus"). Sections stay A–G (G mandatory) per the RULES-CORE genre table; emphasis shifts.
- **PEOPLE** is **thin** — author (Kefa), co-senders/bearers (Silvanus, Markos), the recipient communities (described, not profiled). **No genealogy, no timeline.**
- **PROPHECY** companions reframe to **OT-in-argument**: 1 Peter uses the HB *paraenetically and typologically* (the living-stone catena; Isa 53; Ps 34; Exod 19:6; Hosea), not as "prediction → fulfillment." The "Note on mode of allusion" header reframes for an epistle; citation-vs-allusion + the dual-labels still apply, but "fulfillment status" is read as *how the OT is deployed* (quoted / echoed / typological).

**Source language / rules:** Koine Greek → **RULES-GS** (κύριος Option C; Greek article system; canonical `κύριος (kyrios)` metadata line; Option-B traditions Reina-Valera/Almeida/Luther; markers `@@`/`{t:}`/`{a:}`/`*added*`).

## 2. 1-Peter-specific realities (sized before planning)

- **Volume:** 1 Pet 1 = 25 v, 2 = 25, 3 = 22, 4 = 19, 5 = 14 → **~105 verses** (the whole book; ≈ Acts 1–3). First **complete** NT book in the corpus.
- **Connections to what's on `main`:** by **Kefa (Peter)** — protagonist of Acts 1–3; the recipients' provinces (Pontus, Galatia, Cappadocia, Asia, Bithynia, 1:1) overlap the **Acts 2:9** diaspora-nations list; **Isa 53** (2:21–25) is the same Servant/*pais* thread as **Acts 3:13,26**; "my son **Markos**" (5:13) ties to the gospel of Mark.
- **OT-density → PROPHECY warranted for most chapters:**
  - 1:16 — Lev 11:44–45 / 19:2 ("be holy, for I am holy").
  - 1:24–25 — Isa 40:6–8 ("all flesh is grass… the word of *the Lord* endures").
  - 2:3 — Ps 34:8 ("taste and see that *the Lord* is good").
  - 2:4–8 — the **living-stone catena**: Isa 28:16 + Ps 118:22 + Isa 8:14.
  - 2:9–10 — Exod 19:6 ("royal priesthood, holy nation") + Hosea 1–2 ("not my people / my people").
  - 2:21–25 — **Isa 53** (the suffering Servant; the densest NT use).
  - 3:10–12 — Ps 34:12–16. 3:14–15 — Isa 8:12–13. 4:18 — Prov 11:31. 5:5 — Prov 3:34.
  - κύριος in the citations = **YHWH** (Option C): 1:25; 2:3; 3:12.
- **The famous cruxes (Tier-2 + Rule-13; the Hellenist's headline items):**
  - **3:18–20 — "he went and proclaimed to the spirits in prison"** (the descent / proclamation; multiple readings — preserve, don't resolve).
  - **3:21 — baptism "now saves you"** (the flood antitype; "appeal/pledge of a good conscience").
  - **1:1–2 — the salutation** (foreknowledge of the Father / sanctification of the Spirit / sprinkling of the blood of Yeshua — a triune-shaped greeting; render without importing later dogma, Rule 3).
  - **2:8 — "they stumble… as they were appointed"** (election/destiny language).
  - **3:1–7 — the household code (wives/husbands)** + 2:18–25 (slaves) — theological *and* social restraint: render the Greek (submission, "weaker vessel," Sarah/Abraham 3:6) faithfully, flag the interpretive history in Tier-2, import nothing (Rule 3).
  - **4:6 — "the gospel was preached even to the dead."**
- **Rule 30 (divine speech):** 1 Peter is exhortation, not narrative — little/no direct divine speech in the author's voice. The OT citations carry God's first-person speech where the source does (e.g. "be holy, for **I** am holy," 1:16 = God speaking in Lev) → `@@…@@` per A-004 precedent; confirm per-citation at authoring.
- **Strategic/locked terms (match the corpus):** {a:wind/spirit} (πνεῦμα); Χριστός = "Messiah"/"anointed"; ἐλπίς "hope"; ἀναγεννάω "born anew/again"; *paroikoi*/*parepidēmoi* "resident-aliens/sojourners"; ψυχή "soul"; the **"stone"** (λίθος) word-field; ὑποτάσσω "submit/be subordinate" (the household code).

## 3. New-book activation — the 8 touchpoints (Phase 0)

1. `src/domain/books/registry.ts` — add `"1-peter"` to `AVAILABLE_BOOKS`.
2. `src/app/[locale]/books/page.tsx` — `BOOK_ORDER` → append `"1-peter"` after `"acts"` (General Epistles follow the gospels+Acts; no Paulines yet).
3. `src/app/[locale]/[book]/people/page.tsx` — `bookLabels`: add `"1-peter": t("book.1-peter")`.
4. `src/infrastructure/content/people-fields.ts` — `inBook` aliases: `"in 1 peter","em 1 pedro","in 1. petrus","en 1 pedro"`.
5. `src/infrastructure/i18n/messages/{en,pt-br,de,es}.json` — `book["1-peter"]` (1 Peter / 1 Pedro / 1. Petrus / 1 Pedro) + `books.heroTagline` (+ "1 Peter 1–5") + `books.sectionKick` **"Six books" → "Seven books"** (localized) — all 4 locales.
6. `scripts/content-lint.sh` — register `1-peter` in `CONTENT_DIRS`/`STUDY_DIRS`/`PEOPLE_FILES`/`NON_EN_PEOPLE_FILES`/`CONTEXT_FILES` (+ `ES_NT_DIRS`/`ES_NT_CHAPTER_FILES` for chs 1–5, GS) + `EDITORIAL_LOGS` + §0.11 DE glob (`content/de/1-peter/CHAPTER-*.md`).
7. **Cross-book see-target allow-list — THREE places** (`1-peter` is NOT yet forward-tracked): (a) `docs/rules/RULES-CORE.md` doc list, (b) §0.12 `%allowed` hash (`'1-peter' => 1`), (c) §0.12 scan glob (`content/*/1-peter/PEOPLE.md`).
8. New files: `docs/editorial-log/1-peter.md` + `docs/source-analysis/greek/1-peter.md` (NA28 working notes; Rule 28).

**Backstop:** `activation-consistency.test.ts` checks 1↔2↔5↔6 — run `pnpm test` after Phase 0. Content-lint paths added as each locale lands (avoid grep-on-missing-file).

## 4. Phases

**Phase 0a — Slug-machinery widening (CODE PREREQUISITE — audit Finding 1).** Before any content/activation: widen the two cross-book slug-parsing regexes to admit a leading digit, so the `1-peter` slug (and every future `N-book`) is consumable by the cross-book machinery:
- `scripts/content-lint.sh` §0.12 validator (line ~235): `([a-z][a-z-]*)` → `([a-z0-9][a-z0-9-]*)`.
- `src/infrastructure/content/people-parser.ts` `applyField` `crossBookSee` (line ~272): `([a-z][a-z-]*)` → `([a-z0-9][a-z0-9-]*)`.
- Add a regression test (`people-parser.test.ts`): a `**See:** 1-peter/PEOPLE.md` stub → `crossBookSeeBook === "1-peter"`; and a §0.12 pointer to `1-peter` is captured + validated (not silently skipped). Gate (886 tests still green; the widening is non-regressive — `/i`+`toLowerCase` already prove case-handling; space/empty still fail).

**Phase 0 — Activation + scaffold** (the 8 touchpoints; open `1-peter.md` + the source stub). **Grep the 4 locales' `sectionKick`/heroTagline before bumping** (Minor 3 guard). Gate green.

**Phase 1 — EN authoring (the crux + the genre pilot).** From NA28 + `METHOD.md`. Sub-stages, each gated:
0. **Epistle-parser spike (FIRST — audit Minor 2):** author ONE `## D. …` Epistolary-Conventions block in a stub INTRODUCTION + ONE OT-in-argument PROPHECY entry; run the introduction-parser and prophecy-parser (`pnpm test`) to confirm they ingest the epistle shapes (the intro parser keys on `## A.`–`## G.` headers; the prophecy parser on entry fields + the dual-label/citation-vs-allusion system — all expected genre-agnostic). If a parser assumes a narrative-only header or a fulfillment-status enum the epistle reframe doesn't supply, fix once and record in the playbook — *before* authoring 5 chapters.
1. **Chapters 1→5**: transparent main text; Tier-2 verse notes (dual-labelled, Rule-13 on the cruxes — 3:18–20, 3:21, 1:1–2, 3:1–7); glossary; reading guide (+ marker legend); chapter overview; markers; κύριος Option C + canonical metadata line. **Render the household code (2:18–3:7) faithfully; flag, don't import (Rule 3).**
2. **Companions** (study/CHAPTER-1…5-CONTEXT): §I "World at the Time" (Asia Minor under Rome ~60–90 CE; the social situation of the *paroikoi*; household structures; the suffering/persecution context) + enrichment.
3. **INTRODUCTION** — **CARD first** (5 fields; "What" = the letter, its recipients, its purpose: hope under suffering) + §A–F **with the epistle adaptations (§B Recipient Community, §D Epistolary Conventions)** + mandatory §G Sources + disclaimer. New GS terms via the glossary-expansion procedure.
4. **PEOPLE** — thin: Kefa (see-stub → mark/PEOPLE.md), Silvanus + Markos (brief entries, or see-stubs if mark carries them), recipient communities described. **No genealogy.**
5. **CONTEXT** (book-level motifs: hope-under-suffering; exile/diaspora identity; the living stone & the new people; following the suffering Christ; holiness; submission/household order).
6. **PROPHECY** (chapters warranting it — most; the OT-in-argument reframe).
**→ CHECKPOINT: project-lead review of the EN book before propagation** (the riskiest gate; the spirits-in-prison + household-code renderings are the specific items to eyeball).

**Phases 2 / 3 / 4 — Propagate PT-BR / DE / ES** (mirror-EN: Almeida/Luther/Reina-Valera; **DE→JHWH, PT/ES→YHWH** in the OT citations; marker parity = EN per file [scripted diff — T-18]; ES ustedes + diacritics [T-09/10]; anti-calque [T-12]; no redundant `Name (Name)` [T-08]). Each locale gated + visually checked, one at a time.

**Phase 5 — Docs.** EXECUTION_HISTORY; PENDING (1 Peter done; Rule-28 review; trajectory → Galatians/Romans/James); CLAUDE.md + README scope (**seven books**); editorial-log finalized; **append epistle-pipeline lessons to the playbook** (refine T-16 from "anticipated" to "exercised").

## 5. Validation gate (per phase)

- `pnpm test` incl. conservation (additive), completeness + label guards, **activation-consistency 8/8**.
- **Marker parity** (propagation: `@@`/`{t:}`/`{a:}` = EN per file; scripted count-diff — T-18, the hard gate).
- Divine name: κύριος Option C; canonical metadata; **DE→JHWH / ES·PT→YHWH** in the OT citations (the §-quotes are the YHWH-bearing spots).
- Cross-book see-stub (Kefa → mark) resolves to a live `/people` link; §0.12 covers 1-peter (scan glob includes `content/*/1-peter/PEOPLE.md`).
- `pnpm lint` · `content:lint` (incl. ES §0.3/§0.3b/§0.4) · `pnpm build` (all 1-peter routes prerender).
- Activation: `/{locale}/1-peter` + `/1-peter/chapter/{1..5}` (+notes/deeper) + `/1-peter/people` + `/1-peter/introduction` + `/1-peter/background` all 200; in books index + app-bar + sitemap.
- **Wiring-to-users:** `/books` shows 1 Peter with a populated glance (CARD); book-hub at-a-glance + SEO `<title>`; `sectionKick` "Seven books"; heroTagline lists 1 Peter — all 4 locales. Corpus = "Greek Scriptures".
- **Genre check:** INTRODUCTION renders §B/§D; PROPHECY companions read as OT-in-argument; no genealogy/timeline on the People page (correct for an epistle).
- Visual (Docker MCP): a chapter (the household-code section; markers), Deeper (dual-labels + OT-in-argument prophecy), People (thin, see-stub link), book hub — per locale.

## 6. Risks & rollback

- **Translation accuracy (highest):** AI-draft EN from Greek → `provisional` → Hellenist; EN checkpoint = the human go/no-go. The cruxes (3:18–22, 1:1–2, 4:6) are theologically loaded — render faithfully, flag in Tier-2, import nothing (Rule 3).
- **Household code (2:18–3:7):** social + theological sensitivity — the highest-restraint passage. Render the Greek (ὑποτάσσω, "weaker vessel," Sarah's example), give the interpretive history in Tier-2, take no side in the main text. Specific Rule-3 / Rule-28 review item.
- **Genre-pipeline first run:** the epistle INTRODUCTION (§B/§D) and the OT-in-argument PROPHECY are new shapes — verify the parsers ingest them (they key on A–G intro sections + the prophecy entry structure, which are unchanged; only the *content emphasis* differs). If any parser assumption breaks, fix once and record (playbook).
- **Slug `1-peter` (leading digit):** verify routes/SEO/i18n key resolve (gate item). Rollback: purely additive (new files + registrations); revert = remove 1-peter content + the registrations.

## 7. Branch / authorization

Feature branch `1-peter-expansion` off `main`; PR per the standing authorization gate; one book at a time; **EN checkpoint before propagation**. Authorship: AI-draft → provisional → Rule-28 (Hellenist).

## 8. Next-book trajectory (recorded)

After 1 Peter, continue the Epistles per the lead's recorded order: **Galatians** (tightest Acts interlock), **Romans** (theological keystone), **James** (Jerusalem/Jesus-brother). Each its own audited `PLAN_{BOOK}_EXPANSION.md`. 1 Peter, as the genre pilot, de-risks all of them.

## 9. Decisions

1. **Scope:** ✅ **all 5 chapters** (lead-confirmed 2026-06-26) — the first complete NT book.
2. **Depth:** ✅ **full, genre-adapted** (lead-confirmed).
3. **EN authorship path:** AI-draft → provisional → Rule-28 (established GS pattern). *Confirm.*
4. **EN checkpoint** before propagation (established). *Confirm.*
5. **Slug `1-peter` + Option-A regex widening** (audit Finding 1 — NOT a style choice). `1-peter` is kept *because* Phase 0a widens the two `([a-z][a-z-]*)` slug-parsing regexes to `([a-z0-9][a-z0-9-]*)` (verified non-regressive) + a round-trip regression test — the durable fix for the whole `N-book` epistle trajectory. (Option B, a non-digit slug like `first-peter`, would avoid the code change but is uglier and still sets a precedent — rejected.) *Confirm Option A.*
6. **PROPHECY reframe for the epistle** — "OT-in-argument" (quoted / echoed / typological), keeping the dual-label + citation-vs-allusion system. *Confirm the framing.*
