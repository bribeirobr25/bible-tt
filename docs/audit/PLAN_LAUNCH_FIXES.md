# PLAN — Launch Program Step 4: Fixes

**Date:** 2026-11-20
**Status:** Batch 1 — REVIEWED (2 adversarial plan reviewers: 1 blocker, 13 major, 18 minor — all applied, §B1.12) → EXECUTED 2026-11-20 (deviations §B1.13) → IMPLEMENTATION-REVIEWED (5 reviewers, §B1.14; fixes applied) → merge on green. Batches 2–8 are outlined in §2; each gets its own detailed section (written, reviewed and fixed) before it starts.
**Program:** `LAUNCH_PROGRAM.md` Step 4 (decisions D1–D16 + L1–L8 govern; this plan changes none of them).
**Inputs:** `PROJECT_STATE_AUDIT.md` §3 (code findings B1–B12 + latent risks), `CONTENT_SWEEP_FINDINGS.md` (counts, routes, L1–L8), `PLAN_BASELINE_RECOVERY.md` §10 and `PLAN_SAFETY_NET.md` §11 (deferrals routed to Step 4).

---

## 1. Process (lead instruction, 2026-11-20)

Every batch runs the same loop:

1. **Plan the batch** (its own section below) → **adversarial plan review** → fix the plan (architecture, STANDARDS, gates, playbook).
2. **Execute** on its own branch.
3. **5-agent adversarial implementation review.**
4. **Triage** the findings.
5. **Fix** carefully (no new bugs, regressions or side effects), re-run the full gate.
6. **Merge** on green (D14) and start the next batch.

The lead authorized commit, push and merge without asking until the program ends (Step 5 included). After the program the normal flow returns (the assistant does everything except merge into `main`). **Lead questions inside a batch** (Mark PROPHECY, audit §6 waters/water, the D11 name-table proposal that D11 sends "for audit") are decided by the assistant with a stated recommendation, logged, and reported to the lead in the batch report; the lead may override after merge (lead instruction 2026-11-20: proceed, stop only for what genuinely needs the lead). A one-line heads-up precedes the Step 5 go-live (DNS / public deploy).

**If GitHub billing blocks CI** (the required `gate` check cannot run, so `main` cannot be merged) — branch protection is never weakened:
- each next batch branches from the previous batch's branch (stacked PRs); the full gate runs locally on every branch;
- the stack is merged in order with **merge commits** (squash/rebase would duplicate commits in the next PR); the repo has `delete_branch_on_merge`, so GitHub retargets the next PR to `main`;
- after each merge: merge `origin/main` into the next branch, **regenerate the sweep snapshot** (its files conflict across a stack), push, and wait for a fresh `gate` run (the check is `strict`);
- the merge order is kept in §3; **Step 5's public go-live waits for batch 3** (so model-name provenance never goes public).

**Lead decisions (2026-11-20):** L1–L8 approved as recommended in `CONTENT_SWEEP_FINDINGS.md` §3 — L1 (A) whole contraction italic · L2 (A) the rule as written: verse cards are not sections · L3 (A) unmark God's words quoted by another speaker + unmark John 3:16–21 · L4 rendering + any TT-voice sentence restating it · L5 (A) rules page to 30 rules + link "(Rule N)" to it, plain provenance statement without model/context details, "Tier 2" → "note" · L6 (A) keep vós, convert the 12 John `vocês` · L7 (A) follow the "anointed one" lock · L8 (A) logged launch waiver, relocate the 168 notes of 6+ sentences.

---

## 2. Batch map

Ordering: code before content (the renderer must show what content fixes produce; Sources must render under D2); rules before content (every content fix cites the corrected rule); mechanical before judgment; the largest judgment classes last.

| Batch | Strand | Content | Ends with | Est. days |
|---|---|---|---|---|
| **1** | 4a code | §B1 below | sweep re-run: Sources `after-4a` → `now` | 1.5 |
| **2** | 4d rules & docs | RULES-CORE: "## THE 29 RULES" heading (:90) → 30, D7 §I3, D10 marker table (+ the Rule 30 text that still says `@@` renders bold, and "ochre" for `{a:}`), 30-rule wording, stale internals, the real 8-touchpoint checklist (+ the non-existent `people.inBook.{slug}` key), L1 Rule 11 contraction wording + the :378 vs :266/:921 conflict, **L5 Rule 28 amendment** (RULES-CORE:604, :743, :1109 require the model identifier — keep it in front matter / the editorial log, show readers a plain statement), the editorial-log table row with an unescaped pipe (`PLAN_BASELINE_RECOVERY` :139). RULES-GS: D9 wording. Editorial logs: L3 (reversal of A-004 + the 1 Peter scope entry), L6, L7 (supersede the "per GS" lines), D7 + D11 (1 Peter ψυχή, Kefa), D8 (`mark.md`). Templates (L5 provenance), `CHANGELOG-v3.4.md`, version headers, STANDARDS, HOW-TO-READ, README/CLAUDE trees, transliteration-decisions, PENDING; v3.3 → v3.4 re-stamp (125 fields + 8 prose stamps, keep the 4 Luke 3 citations); activation-consistency `heroTagline`/`sectionKick` + source-stub checks; content-lint allow-list table scoping (`PLAN_SAFETY_NET` I19). **Rule-table edits made later** (D11 names in batch 5, S21 glossary rows and labels in batch 4) are recorded as dated addenda in `CHANGELOG-v3.4.md` by the batch that makes them | §0.1 back to blocking | 1.5 |
| **3** | 4b mechanical content | mojibake (14), doubled articles (4), meta leaks (IDs, repo paths incl. INTERNAL rows in Sources tables, log references, process/propagation words), stale name policy (148), DE `YHWH` → `JHWH`, D9 DE Yehudim (+ Yehudi/Yehudit) → Jehudim, PT/ES `yehudim` casing, L5 provenance + "Tier 2", markers in backticks (152), unbalanced `@@` (32), markers in table cells (52) + odd asterisk, nested italics (`*… *magoi* …*`, Matt 2–3 notes), ASCII `->`, front-matter defects (`vorlaufig`, `es/john/PEOPLE.md` H1/Status), ⚠️ icons | cleared classes → blocking content-lint (T-14) | 2 |
| **4** | 4b translation rulings | D7 ψυχή, D8 son of man (incl. mentions), Rule 20 titles (S20), Spirit/Word TT voice, glossary locks (S3 + L4), Rule 25 LORD forms (170 + 105 review), L3 unmark, L7, L1 contraction italics, L6 vós, divine-speech coverage (S6a 89), CR ≠ verse (S6e: 20 words + 69 punctuation), italic balance review (S7b), marker governance (S21 bare slashes, `{a:}`/`{t:}` values → glossary rows or log entries, the `{t:Hades}` threshold question), labels (S22 + the PENDING unregistered-labels item), §0.3d calques (17) then §0.3d promoted to blocking, carried single-verse items (findings §4), `*magoi*`, Mark PROPHECY lead question | may split when planned | 4 |
| **5** | 4b names | D11 table-extension proposal → tables → alignment of all books (Kefa, Silvanus = Silas, Moshe/Mosheh …), L2 gloss strip (CR 209 + verse 591 + notes 150 + apparatus 270), gloss placement (S6e 279 study-only / 32 CR-only), redundant pairs | S5c/S5d cleared | 2.5 |
| **6** | 4b ES orthography | ≥ 2,119 tokens + 250 ambiguous + 23 spurious, per-token review; the `el`/`él`, `tu`/`tú`, `mi`/`mí`, `se`/`sé` reading pass (findings headline 1, PENDING) | S11 cleared | 2.5 |
| **7** | 4b companions | D12 (25 EN-only entries × PT/DE/ES, `KNOWN_ENTRY_GAPS` emptied), L8 (relocate the 168 notes of 6+ sentences; the waiver is logged in the editorial log + PENDING, not in RULES-CORE) | parity test with no known gaps | 2 |
| **8** | 4c scope | DAAT draft (incl. Q2 Ramban verification, new matthew.md log ID), Iakobos / Jesus's-brothers Acts PEOPLE entry; audit §6 waters/water lead question | — | 1 |

**Re-estimate (LAUNCH_PROGRAM:56):** ≈ 17 working days for Step 4 (was 5–7), Step 5 unchanged (2.5–3.5). Batch 1 absorbs one Step 5 item (B6 = the `not-found` pages).

**Explicit deferrals to Step 5 (audit §3.2/§3.4):** sitemap/hreflang checks, ChapterNav and LegacyHashRedirect latent risks, client bundle size, hardcoded English aria-labels and OG alt texts.

---

## 3. Merge order

| # | Branch | PR | Merged |
|---|---|---|---|
| 1 | `fixes-b1-code` | #18 | — |

---

## B1. Batch 1 — Code (4a)

**Branch:** `fixes-b1-code` from `main` @ `d9f4ec9`. **No content file changes** (`git diff --stat main -- content/` stays empty).

### B1.1 Sources rendering (audit B2, D2)

Sources-consulted blocks (source table + editorial provenance) exist in every companion (§H, 128), introduction (§G, 28), PROPHECY file (§H, 56) and 6 of 7 PEOPLE files (24) — **59 per locale, 236 in all**. Only PEOPLE renders them today. No Sources block contains `###`/`####`; content follows Sources only as `## I.` (24 files); Sources is the last H2 in every PROPHECY file.

- **Parser helper (DRY):** `src/infrastructure/content/sources-block.ts` — `isSourcesHeading(h2Text)` (heading **words**, anchored like the sweep's `SOURCES_H2`, incl. "Herangezogene Quellen"; never the letter — companion §G is Curiosities; must not match `5. AT-Quellenbreite`, `A. Source Text Features`, `Texto-Fonte`) and `cleanSourcesBlock(lines)` (people-parser's cleaning). The people parser imports both.
- **Domain:** `sources?: string` on `EnrichmentData`, `IntroductionData`, `ProphecyData` (`PeopleData` has it).
- **Enrichment parser:** a Sources H2 opens a raw capture to the next H2 and is **no longer a 0-entry section**. This changes `sections` (one fewer per file): `hasDeeperContent` and the Deeper tabs stay true only because every companion has other sections — asserted by a test. Dead code removed: `"sources"` in `context-view.tsx` `SECTION_ORDER`, the Sources filter in `introduction-view.tsx`, the intro `sectionLabels.sources` entry, `finalizeSection`'s Sources comment. Tests updated: `enrichment-parser.test.ts:86-89`, `introduction-parser.test.ts:38, :58-61`.
- **Prophecy parser:** a Sources H2 closes the open entry and opens the raw capture.
- **UI:** one `SourcesBlock` component (`src/ui/shared/sources-block.tsx`) — a closed `Disclosure` (≥ 44 px summary target) titled `study.sourcesConsulted` (the existing `people.sourcesConsulted` moved, not duplicated), body `renderMarkdownSafe(sources, "note", { locale })`. Rendered last in `ContextView` (also in its empty state), `IntroductionView`, the prophecy view and the People page (replacing its ad-hoc block).
- **Structured layer + conservation:** new unit kind `sources` for enrichment, introduction, prophecy **and people** (people sources are not counted today). Expected: −128 `enrichment-section`, −28 `intro-section`, +236 `sources`, −3 supplementary (ES TOC, B1.8) → 20,599 → **20,676**; the measured figure is recorded per kind. **Raw reconciliation:** parsed Sources blocks = raw Sources H2s = 59 per locale.
- **Sweep:** Sources render state `after-4a` → `now` (`zones.mjs:89, :227, :312`; `content-sweep.mjs:174-186`; `checks.test.mjs:174-224`); `KNOWN_TOC` (`checks.mjs:934`) and the `zones.mjs:41` mirror gain the ES TOC titles; snapshot regenerated; `CONTENT_SWEEP_FINDINGS.md` header note + headline 2 `after-4a` counts updated.
- **Interim content note:** until batch 3, the rendered provenance names the model ("Drafted by Claude Opus 4.8 (1M context)") and some Sources tables show INTERNAL rows with repo paths (e.g. `docs/editorial-log/matthew.md`). `main` is not public; Step 5's go-live waits for batch 3.

### B1.2 Activation gate (audit B1)

- Shared guard `isActiveBook(book)` (domain registry, from `AVAILABLE_BOOKS`) called **before any file read** by every `[book]` page, `generateMetadata`, and the **7 `opengraph-image.tsx` routes** under `[book]` → `notFound()`.
- `export const dynamicParams = false` on every `[book]` dynamic page and OG route.
- Guard test: a static scan asserting every `src/app/[locale]/[book]/**/{page,opengraph-image}.tsx` exports `dynamicParams = false` and calls the guard.
- Verification: a temporary draft book dir, production build, `curl` → 404 (then remove the dir).

### B1.3 404 pages (audit B6; Step 5 item)

- `src/app/[locale]/not-found.tsx`: localized, styled (inside the locale layout: fonts, app bar, footer), links home and to the books list.
- `src/app/[locale]/[...rest]/page.tsx` calling `notFound()` (next-intl pattern; Next's router falls through to it when a `dynamicParams = false` route has no match).
- `src/app/not-found.tsx` for paths the middleware skips: its own `<html lang="en">`/`<body>` and the global stylesheet.
- Verified on a production build: `/de/nope`, `/de/nope/chapter/1`, `/de/genesis/chapter/99`, `/en/nope` → 404 with `lang` = the locale, the localized heading and the app bar; `/nope.txt` → the root page.

### B1.4 Rules page — 30 rules (audit B5, L5) — **review blocker fixed**

- **The page names the wrong rule for ~half the numbers** (e.g. 5 "Locked Glossary" vs RULES-CORE "Respect Source Grammar", 20 "Poetic Structure" vs "Capitalization", 27 "Formatting Standards" vs "Inclusive & Gendered Language"). All 30 `landing.ruleNname`/`ruleNshort` strings are **re-sourced from the RULES-CORE `#### Rule N:` headings and rule text**, in 4 locales.
- `ALL_RULE_NUMS` = 30; the big number derives from its length; every "29" message string → 30.
- Test: EN `ruleNname` equals the RULES-CORE heading for N = 1–30 (so the page cannot drift again); messages-parity covers the keys.
- Each rule card gets `id="rule-N"` with `scroll-margin-top` for the 64 px app bar.

### B1.5 Rule-reference links (L5)

- `renderMarkdownSafe`/`renderInlineSafe` take an optional `{ locale }`, threaded into `convertTable` for cells. With a locale, `linkRuleRefs` turns "Rule N"/"Rule-N" (+ Regra/Regel/Regla) with N in 1–30 into `<a class="tt-ruleref" href="/{locale}/rules#rule-N">`; it runs on escaped text before emphasis and never inside a tag. Content has ≈ 2,446 references (sweep S9; a plain grep finds 2,447: Rule 624 · Regel 617 · Regra 604 · Regla 602), all 1–30, no plural/list forms.
- **Locale comes from props/params** (async server components cannot call `useLocale()`): pages pass `locale`; client components use `useLocale()`.
- **Which call sites link:** note/companion/introduction/prophecy/people **bodies** and Sources. **Not linked:** entry titles inside `<summary>`/`<h3>` (24 titles carry "(Regra 30)"), book-card values (rendered inside a `<Link>` — no nested `<a>`), scripture (verse cards, continuous reading), UI strings.
- Style: underlined (WCAG 1.4.1, not colour alone), the existing link token, visible focus ring; inline links fall under the WCAG 2.5.8 inline exception (recorded in TT-DESIGN-SYSTEM next to the 44×44 rule).

### B1.6 Renderer hardening (audit B3, B4; sweep S15)

- **Empty table cells** (B3): `convertTable` keeps empty cells (strip only the outer pipes); rows shorter than the header pad; same in the `markdown-parser.ts` glossary parser. Fixture: Genesis 8 chiasm table.
- **Emphasis = CommonMark flanking** (B4): `*` opens only if left-flanking (next char not whitespace, and not punctuation unless preceded by whitespace/punctuation), closes only if right-flanking (mirror); `**` likewise; emphasis never crosses a newline. Real fixtures (all 4 locales where present): `luke/INTRODUCTION.md:179` `א*, A, B*`, `john/CHAPTER-1.md:336` `𝔓66, 𝔓75, א*, B, C*;`, `luke/study/CHAPTER-2-CONTEXT.md:157` `B*, ℵ*`, `de/1-peter/study/CHAPTER-5-PROPHECY.md:121`, Mark INTRODUCTION E2; intra-word `n*a*` still italicizes; every existing render test passes unchanged.
- **Markers:** `@@…@@`, `{t:…}`, `{a:…}` never cross a newline (no real span does); unbalanced stays literal.
- **Tables:** header cells are rendered with the inline renderer (Genesis 12 headers `Curse (*arar*)`), table HTML is re-inserted **after** the marker and emphasis passes, with a **function** replacer (a string replacer interprets `$&`).
- **Known visible change:** the nested-italics lines in EN/PT Matthew 2–3 notes (`*For fuller discussion of the *magoi*'s …*`, 5 lines) change from inverted italics to nested italics (`<em>…<em>magoi</em>…</em>`); batch 3 still cleans the source.
- **JsonLd:** `</script>` and `<!--` are escaped in serialized JSON-LD (audit §3.2; security).

### B1.7 Parser and loader latent risks (audit §3.2)

- **Continuous reading:** drop only a paragraph matching `^\*[^*]+\*$` (the authored "Prose view…" note — every chapter has exactly one); never delete lines. Fixture `*The* man … *him*`. Raw reconciliation + conservation show zero change today.
- **Verse blocks:** verse text after notes or a `---` is no longer dropped (audit latent risk; 0 today) — appended to the verse or reported by the completeness guard.
- **Loader errors:** `fs-content-repository.ts` treats `ENOENT`/`ENOTDIR` as absent (`null`) and rethrows anything else so a parse error fails the build; the book guard (B1.2) runs before any read. STANDARDS §7 updated to match.
- **`IntroductionView`** renders `section.intro` like `ContextView` (0 today; parity).
- **Person slugs** drop quote characters (`PLAN_BASELINE_RECOVERY` :138; `people-parser.ts:344`); stable IDs and existing anchors checked for changes.

### B1.8 Smaller UI bugs

| Item | Fix |
|---|---|
| **Status pill + badges** (sweep headline 12, D15) | domain `parseReviewStatus(raw)` → `provisional` · `reviewed` · `signedOff` · `null` (keywords for all 4 locales; the corpus has 4 values today); the chapter pill **and** the 4 hard-coded badges (`[book]/page.tsx:129`, `background:94`, `introduction:102`, `people:148`) print `status.*` (`people.provisional` moved into a `status` namespace with `reviewed`/`signedOff`); unknown → today's short-word fallback. Test: every chapter/companion in every locale classifies |
| **ES TOC as a section** (S16) | "TABLA DE CONTENIDOS" (3 files) added to `SKIPPED_SECTIONS`; chapter-completeness test |
| **B7 progress bar** | below the 64 px app bar (`top-16`) on the app bar's layer, visible; reduced motion turns the transition off |
| **B12 intro §F label** | `sectionLabels` key `readingInTt` (the camelCased id) → message `readingInTT` |
| **B8 hero** | reproduced first; reduced-motion resize redraws the static frame; unmount calls `forceContextLoss()` before `dispose()` |
| **B9 Deeper tabs** | reproduced first; a single sub-tab renders no `tablist`; with 2 tabs each `aria-controls` points to an existing panel; the People link sits outside the `tablist` |
| **B10 copy-verse-link** | reproduced first; the `setTimeout` is cleared on unmount; the copied verse is highlighted with a class (not `:target`, which `replaceState` cannot set) |
| **D10 stale comments** | `render-markdown-safe.ts` and `globals.css` marker comments describe the live colours (`{a:}` bold body colour, `@@` red) |

### B1.9 Docs

`LAUNCH_PROGRAM.md` (L1–L8 approved, the batch process in D13, Step 4 re-estimate, Step 5 text: B6 done in batch 1, go-live after batch 3, progress log), `CONTENT_SWEEP_FINDINGS.md` (§3 decisions recorded, Sources render state), this plan, `EXECUTION_HISTORY.md`, `CLAUDE.md` (tests, conservation count), `README.md` test count, `STANDARDS.md` §7, `TT-DESIGN-SYSTEM.md` (inline-link exception), `PENDING.md`, `PROJECT_STATE_AUDIT.md` B-table (fixed in Step 4 batch 1).

### B1.10 Gate and verification

- `pnpm test` · `lint` · `typecheck` · `content:lint` · `build` (restore `next-env.d.ts`); sweep regenerated and byte-stable across two runs.
- Visual check on a production build (port 3001; kill next-server by port PID): a companion + a PROPHECY Deeper door with Sources, an introduction, a People page, the rules page (30 cards, `#rule-30` deep link), a rule link in a note, the 404 pages, the progress bar, the Genesis 8 and 12 tables, the Luke INTRODUCTION sigla line — at 375 / 768 / 1440 (design system), EN + DE (+ PT/ES spot checks).
- No content file changes.

### B1.11 Out of scope for batch 1

Content edits (batches 3–7), rule files (batch 2), Pagefind/licence/headers/analytics and the chapter-head gutter / mobile title clipping (Step 5), the deferrals listed in §2.

### B1.12 Plan review log (2026-11-20)

Two independent adversarial reviewers (code/architecture; completeness/standards). All findings applied above:

- **Blocker:** rules page names wrong for ~half the rules → B1.4 re-sourced from RULES-CORE + drift test.
- **Major:** stray-`*` rule still mis-paired sigla (13 real lines) → full CommonMark flanking + fixtures; table re-insertion would break header italics → inline-rendered headers; `useLocale()` impossible in async server components → locale from params; Sources figures wrong (+177 → −156/+236, sections do change) → corrected with consequences; OG routes unguarded → guarded; four 4a items missing (person slugs, D10 comments, verse text after notes, `$&` replacer) → added; D15 badges hard-coded → routed through `parseReviewStatus`; L5 conflicts with Rule 28 → amendment scheduled in batch 2; rule-table edits after batch 2 → CHANGELOG addenda per batch + missing log supersessions added to batch 2; Step 4 items unassigned (Mark PROPHECY, ES pronoun pass, re-estimate, I19 allow-list scoping, the log-table pipe, S15 markers in cells, gloss placement, S13 Yehudi/Yehudit, §0.3d promotion) → assigned in §2; lead questions without a checkpoint → §1 rule; stacked-PR fallback underspecified → merge commits, restack, sweep regeneration, go-live after batch 3.
- **Minor:** `@@` blank-line rule had no effect → "never crosses a newline"; magoi nested italics listed; 404 checks now use DE and a middleware-skipped path; rule-link call sites enumerated (no titles, cards, scripture); duplicate i18n keys consolidated; extra sweep files listed; ENOTDIR handled; `:target` → class; Sources raw reconciliation; ⚠️ icons and L8 waiver de-duplicated; STANDARDS §7 + design-system docs listed; Step 5 deferrals explicit; visual widths per the design system; B8–B10 reproduced before fixing.

### B1.13 As executed — deviations from the plan

- **`dynamicParams = false` dropped (B1.2).** On Next 16 every unmatched param then logs an internal `NoFallbackError` before falling through to `[...rest]` — runtime-error noise on every 404 in production logs. The in-page `isActiveBook` guard (before any read) closes B1 on its own; the static-scan test now asserts the guard and the *absence* of `dynamicParams = false`. Verified with a temporary draft book: all 9 page/OG URLs → 404, server log clean.
- **404 server HTML (B1.3).** The localized page renders correctly in a browser (lang, app bar, fonts), but Next serves the not-found response as its error shell and renders the page client-side (the root layout passes children through, so there is no root `<html>`). Status 404 + `noindex` are correct; no-JS visitors see a blank page. Recorded for Step 5 (options: a root layout that owns `<html lang>` via the locale param, or `experimental.globalNotFound`).
- **Emphasis rule (B1.6).** Strict CommonMark broke authored shapes (`**Noach (Noah)**s`, `*disse-*lhes`, `**"… (**ἐγκόπτεσθαι**)."**`). As built: a single `*` before punctuation opens only after whitespace/punctuation (keeps sigla literal); `**` opens before any non-space; any run after a non-space may close. A full-corpus old-vs-new render diff (every parsed text field × note/prose/inline) showed only intended changes.
- **Found while building:** note titles ending `*WORD***` left a stray `*` at the start of ~1,100 note bodies (1,116 title lines), inverting their italics; the title regex now consumes one level of inner italics. Rule 1/11/25 example strings on the landing/rules page were also wrong and are corrected.
- **Badges (B1.8):** the book hub, introduction, People and Background badges read the `**Status:**` line of INTRODUCTION/PEOPLE/CONTEXT (`front-matter.ts`); a file without one reads as provisional, as before.
- **Also changed (not in the plan text):** `.rshort` 13.5 → 14 px (design-system minimum) and the status pill 11 → 12 px; person slugs changed for 30 entries (24 quote characters: Ya'aqov ×4 forms, Kena'ani, "She in Babylon" — and, after review, 6 with `/` or parentheses: Yosef Barsabbas / Justus, Herodes (Herod)); no HTML anchor or link uses person slugs, so only structured ids change (pre-launch).
- **Not changed:** the per-unknown-slug on-demand render (with `dynamicParams` on, each unknown `[book]` URL is rendered and cached once; harmless on Vercel, unbounded on a self-hosted disk, and on a case-insensitive filesystem a case-variant URL can overwrite a real page's cache entry) → decided together with the server-rendered 404 in Step 5.

### B1.14 Implementation review (2026-11-20, 5 adversarial reviewers)

Renderer + parsers · routing/build/visual · data integrity + mutation testing · i18n/rules content · plan/docs fidelity. **No blockers.** Every finding fixed in PR #18 except the Step 5 items above:

- **Renderer/parsers** (full-corpus diff of 82,276 parsed strings, 300k fuzz inputs: no regression, no XSS): note titles printed `*…*` literally → rendered inline (no rule links in titles); a `>` line after `---` could become scripture and a wrapped note line could become verse text → `>` lines are always notes, an unprefixed line directly under a note line is a lazy continuation; Sources blocks ended in `---` line breaks → rules dropped, blank runs collapsed; 11 ES book-level files label the status `Estado`/`Estatus` → read; slugs kept `/` and parentheses → `personSlug`.
- **Routing/build/visual** (production build, 375/768/1440 px, EN + DE; draft-book guard; OG; JSON-LD; sitemap): Deeper tablist had no accessible name → labelled; 404 server HTML and on-demand cache → Step 5 with a concrete recommendation; pre-existing gutters/brand clipping/table-wrapper focus → Step 5.
- **Data integrity + tests** (55 copy-based mutants, 17 survived): the conservation gate only proved a Sources block exists → an independent raw-line reconciliation (kills the dropped-line mutant); the emphasis matcher was quadratic (1.3 s at 20k runs) and its 200 ms timing test flaked once → delimiter stack + per-kind bottoms (40k runs in ~26 ms; identical output on 164,552 corpus renders), generous budget; untested: table-cell isolation, SourcesBlock on each page type, StatusPill fallback, loader rethrow, `parseReviewStatus` order, typographic-quote slugs, `isSourcesHeading` anchoring, H2-after-Sources in PEOPLE/PROPHECY → tests added; hard-coded 59 Sources per locale → per-file check + equal count across locales; `linkRuleRefs` range → `RULE_COUNT`.
- **i18n/rules** (all 30 summaries checked against RULES-CORE): Rule 28 short claimed "no verse ships without review" (the site ships provisional verses) → reworded ×4; Rule 25 example called "LORD" a "later" tradition (Rule 3 corollary) → neutral ×4; Rule 30 short lacked its restraint clause; Rule 4 short said "italicized" (renders as a marker); DE Rule 15 "Drei-Ausgaben-Regel" clashed with Rule 24 editions → "Drei-Ebenen-Regel"; PT/DE/ES examples lacked markdown/locale quotes; PT/ES subjunctive and "capitaliza"; status pill full text was tooltip-only → screen-reader suffix; RULES-CORE "THE 29 RULES" heading and the Rule 30/marker-table colour text → batch 2.
- **Plan/docs fidelity:** the S8 pill-word and S15 siglum classes still counted fixed defects → retired (20,420 → 20,337); B6 overclaimed → "fixed client-side"; latent risks marked; STANDARDS guard row; Step 5 deferrals and the day total (24–26) in LAUNCH_PROGRAM; D13 records the billing fallback, the go-live heads-up and the D11 table reporting; PR number recorded.

