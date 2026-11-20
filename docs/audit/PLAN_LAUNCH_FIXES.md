# PLAN — Launch Program Step 4: Fixes

**Date:** 2026-11-20
**Status:** Batch 1 — merged (PR #18, §B1). **Batch 2 — rules & docs:** plan reviewed (2 reviewers, §B2.11) → executed 2026-11-20 (§B2.12) → implementation-reviewed (5 reviewers, §B2.13; fixes applied) → merge on green (PR #19). Batches 3–8 are outlined in §2; each gets its own detailed section (written, reviewed and fixed) before it starts.
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

**Lead decisions (2026-11-20):** L1–L8 approved as recommended in `CONTENT_SWEEP_FINDINGS.md` §3 — L1 (A) whole contraction italic · L2 (A) the rule as written: verse cards are not sections · L3 (A) unmark God's words quoted by another speaker + unmark John 3:16–21 · L4 rendering + any TT-voice sentence restating it · L5 (A) rules page to 30 rules + link "(Rule N)" to it, plain provenance statement without model/context details, "Tier 2" → "note" · L6 (A) keep vós, convert the 12 `vocês` (11 John + Matthew 3:9, per reading copy — counted in batch 2) · L7 (A) follow the "anointed one" lock · L8 (A) logged launch waiver, relocate the 168 notes of 6+ sentences.

---

## 2. Batch map

Ordering: code before content (the renderer must show what content fixes produce; Sources must render under D2); rules before content (every content fix cites the corrected rule); mechanical before judgment; the largest judgment classes last.

| Batch | Strand | Content | Ends with | Est. days |
|---|---|---|---|---|
| **1** | 4a code | §B1 below | sweep re-run: Sources `after-4a` → `now` | 1.5 |
| **2** | 4d rules & docs | RULES-CORE: "## THE 29 RULES" heading (:90) → 30, D7 §I3, D10 marker table (+ the Rule 30 text that still says `@@` renders bold, and "ochre" for `{a:}`), 30-rule wording, stale internals, the real 8-touchpoint checklist (+ the non-existent `people.inBook.{slug}` key), L1 Rule 11 contraction wording + the :378 vs :266/:921 conflict, **L5 Rule 28 amendment** (RULES-CORE:604, :743, :1109 require the model identifier — keep it in front matter / the editorial log, show readers a plain statement), the editorial-log table row with an unescaped pipe (`PLAN_BASELINE_RECOVERY` :139). RULES-GS: D9 wording. Editorial logs: L3 (reversal of A-004 + the 1 Peter scope entry), L6, L7 (supersede the "per GS" lines), D7 + D11 (1 Peter ψυχή, Kefa), D8 (`mark.md`). Templates (L5 provenance), `CHANGELOG-v3.4.md`, version headers, STANDARDS, HOW-TO-READ, README/CLAUDE trees, transliteration-decisions, PENDING; v3.3 → v3.4 re-stamp (125 fields + 8 prose stamps, keep the 4 Luke 3 citations); activation-consistency `heroTagline`/`sectionKick` + source-stub checks; content-lint allow-list table scoping (`PLAN_SAFETY_NET` I19). **Rule-table edits made later** (D11 names in batch 5, S21 glossary rows and labels in batch 4) are recorded as dated addenda in `CHANGELOG-v3.4.md` by the batch that makes them | §0.1b back to blocking | 1.5 |
| **3** | 4b mechanical content | mojibake (14), doubled articles (4), meta leaks (IDs, repo paths incl. INTERNAL rows in Sources tables, log references, process/propagation words), stale name policy (148), DE `YHWH` → `JHWH`, D9 DE Yehudim (+ Yehudi/Yehudit) → Jehudim, PT/ES `yehudim` casing, L5 provenance + "Tier 2", markers in backticks (152), unbalanced `@@` (32), markers in table cells (52) + odd asterisk, nested italics (`*… *magoi* …*`, Matt 2–3 notes), ASCII `->`, front-matter defects (`vorlaufig`, `es/john/PEOPLE.md` H1/Status), ⚠️ icons; **from batch 2:** the Luke 3 "v3.3.2 cross-book convention" phrase (S10 `citation`, 4 lines; §0.1b filters it, so only the sweep tracks it), the stray `</content>` line in `pt-br`/`es` `luke/CONTEXT.md`, the companion §H/§I order (24 files: 1 Peter 1–5 + Acts 3 × 4 put Sources before §I), reader provenance lines → the Rule 28 plain statement | cleared classes → blocking content-lint (T-14) | 2 |
| **4** | 4b translation rulings | D7 ψυχή, D8 son of man (incl. mentions), Rule 20 titles (S20), Spirit/Word TT voice, glossary locks (S3 + L4), Rule 25 LORD forms (170 + 105 review), L3 unmark, L7, L1 contraction italics, L6 vós, divine-speech coverage (S6a 89), CR ≠ verse (S6e: 20 words + 69 punctuation), italic balance review (S7b), marker governance (S21 bare slashes, `{a:}`/`{t:}` values → glossary rows or log entries, the `{t:Hades}` threshold question), labels (S22 + the PENDING unregistered-labels item), §0.3d calques (17) then §0.3d promoted to blocking, carried single-verse items (findings §4), `*magoi*`, Mark PROPHECY lead question; **from batch 2:** the Genesis bare-nephesh Rule 1 deviations (e.g. 12:5 "persons") + their `CHANGELOG-v3.4.md` addendum, the PT `vocês` object/verb forms (Matthew 3:2–3, 3:7–11; John 1:51), the χριστός TT-voice restatements (DE Acts "Messias" incl.), the extra D7 sites (John 2:22 note, DE Matthew 3 note), and the lead question whether Rule 20 lowercase in notes extends beyond "son of man" | may split when planned | 4 |
| **5** | 4b names | D11 table-extension proposal → tables → alignment of all books (Kefa, Silvanus = Silas, Moshe/Mosheh …), L2 gloss strip (CR 209 + verse 591 + notes 150 + apparatus 270), gloss placement (S6e 279 study-only / 32 CR-only), redundant pairs | S5c/S5d cleared | 2.5 |
| **6** | 4b ES orthography | ≥ 2,119 tokens + 250 ambiguous + 23 spurious, per-token review; the `el`/`él`, `tu`/`tú`, `mi`/`mí`, `se`/`sé` reading pass (findings headline 1, PENDING) | S11 cleared | 2.5 |
| **7** | 4b companions | D12 (25 EN-only entries × PT/DE/ES, `KNOWN_ENTRY_GAPS` emptied), L8 (relocate the 168 notes of 6+ sentences; the waiver is logged in the editorial log + PENDING, not in RULES-CORE) | parity test with no known gaps | 2 |
| **8** | 4c scope | DAAT draft (incl. Q2 Ramban verification, new matthew.md log ID), Iakobos / Jesus's-brothers Acts PEOPLE entry; audit §6 waters/water lead question | — | 1 |

**Re-estimate (LAUNCH_PROGRAM:56):** ≈ 17 working days for Step 4 (was 5–7), Step 5 unchanged (2.5–3.5). Batch 1 absorbs one Step 5 item (B6 = the `not-found` pages).

**Explicit deferrals to Step 5 (audit §3.2/§3.4):** `engines.node` / Node-version enforcement (batch 2, CONTRIBUTING), sitemap/hreflang checks, ChapterNav and LegacyHashRedirect latent risks, client bundle size, hardcoded English aria-labels and OG alt texts.

---

## 3. Merge order

| # | Branch | PR | Merged |
|---|---|---|---|
| 1 | `fixes-b1-code` | #18 | 2026-11-20 (`5f30632`) |
| 2 | `fixes-b2-rules-docs` | #19 | — |

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


---

## B2. Batch 2 — Rules & docs (4d)

Branch `fixes-b2-rules-docs`. **Principle:** the rule files must say what the lead decided before content batches 3–8 cite them. This batch changes **no translation**. It changes rule/doc text, 133 version stamps in content, the §0.1b lint rule, the sweep's provenance check, and two test files. Every content application of D7/D8/D9/L1/L3/L4/L6/L7 stays in its batch (3–5). The editorial logs record the decisions now ("log before drafting", CLAUDE.md). *Plan reviewed by 2 adversarial reviewers (§B2.11); this is the fixed plan.*

### B2.1 Rules amendment v3.4.1 — protocol path

These changes **modify** existing rule text (RULES-CORE §Amendment and Lock Protocol :1156 onward). They are therefore a **re-opening**, not an emergency amendment: emergency amendments cover additive changes only, and v3.3 skipped its window *because* it was purely additive (CHANGELOG-v3.3, RULES-CORE:1487).
- **Step 1:** a written proposal, `docs/rules/proposals/v3.4.1-launch-corrections.md`. This creates the `proposals/` directory that RULES-CORE:1039 and :1159 already cite.
- **Step 2:** an impact assessment. No signed-off verses are affected: all content is `provisional` (D2) and no file says otherwise. The proposal also counts the provisional content each change will touch in batches 3–5.
- **Step 3:** the 14-day window is **waived by the lead**. Rule 28 (:601) gives the lead the power to "authorize exceptions". Decisions D7/D9/D10 (2026-11-19), D8 (2026-11-19) and L1/L4/L5/L6 (2026-11-20) are the acceptance, made under D2 (provisional launch) and D13 (the batch process).
- **Steps 4–5:** a version bump. Affected verses are re-reviewed by Rule 28 later, as for all provisional content.

**Version: v3.4.1.** It is a point release, but the changelog lists each change honestly as a *modification*. Earlier point releases (v3.3.1/v3.3.2) were additive clarifications.

**Content stamps stay v3.4.** Point releases have never re-stamped content. The full v3.2→v3.3 bump did, but v3.4.1 adds no rule and no marker, so a v3.5 re-stamp of every file would be churn without information.

**Supplements:** RULES-GS (v3.2) and RULES-HB (v3.3.1) both change in this release. Each records it as "v3.4.1 (CORE release)". From now on a supplement's version names the CORE release that amended it, which closes the gap in the GS list (it currently ends at v3.1, :380).

Updated to match: the CLAUDE.md Rulesets line, and the i18n `rulesHeroKicker` ("Ruleset v3.4" → v3.4.1, 4 locales; `rules-messages`/messages-parity stay green).

**RULES-CORE.md**
1. **Rule count and version.**
   - `## THE 29 RULES` (:90) → `## THE 30 RULES`. The guard stays in `rules-messages.test.ts`.
   - Header `Ruleset v3.4` → v3.4.1. Footer `END OF CORE RULESET v3.3` → v3.4.1.
   - "rules 1-29" (:1450) → 1–30.
   - Front-matter spec "Ruleset: v3.3" (:886) → v3.4.
   - PROJECT METADATA (:1534–1543): 7 books, v3.4.1, and a pointer to EXECUTION_HISTORY.
   - VERSION HISTORY: a **new v3.4.1 entry**. The v3.4 entry keeps its text plus "(`{a:}` colour corrected in v3.4.1 — D10)".
2. **D7 — glossary for ψυχή / נֶפֶשׁ.**
   - §I3 (:997) states the D7 rendering: ψυχή / bare נֶפֶשׁ = life/being · vida/ser · Leben/Wesen · vida/ser, and נֶפֶשׁ חַיָּה = living being(s).
   - **RULES-HB gets the bare `נֶפֶשׁ` row now.** §G4 (:1061) requires a term aligned across both supplements to appear in both, and RULES-GS:41/:261 already give נֶפֶשׁ = life/being. It goes in through the §G3 no-wait mode (:1056), as part of the same proposal, `provisional` pending the Hebraist (Rule 28).
   - The row changes no translation in this batch. Batch 4 logs the Genesis contextual deviations, e.g. Gen 9:4 "life" and 12:5 "persons", as Rule 1 deviations, alongside the D7 sweep.
   - **Sweep effect:** a new HB table row can add S3/S21 hits. Every added row in the snapshot diff is explained in §B2.9.
3. **D10 — marker table.**
   - The marker table (:919–925) and the Rule 30 text (:909 "bold in the divine accent colour") are rewritten to match the live CSS (`globals.css:532–539`): `{t:}` teal + bold · `{a:}` bold, body colour · `@@` red, not bold · `*added*` grammatical-blue italic. Each row is checked against the CSS.
   - Same fix in `AUTHORING-PLAYBOOK.md:141` (`{a:}` "ochre").
4. **L1 — Rule 11 and contractions.**
   - Rule 11 (:266) gets a **contraction clause**: an added article fused with a preposition (PT `na/do/pelo`, DE `im/zum/vom`, ES `al/del`) is marked by italicizing the **whole contraction**. An inserted article never doubles an existing one.
   - The clause cross-references RULES-GS:91, which already states DE `vom`/`zum`, so the two can't diverge.
   - **:378 narrowed:** "words added for target grammar — including a fused contraction — are Rule 11 A (italic). Rendering a source expression by a target idiom (§I2) is governed by the idiom policy (with its Tier-2 note), not Rule 11." This removes the conflict and adds no new marking duty to §I2 idioms.
   - The heading `#### **Rule 11: Signal All Additions**` is unchanged (`rules-messages.test.ts:52`).
   - Impact recorded in the proposal: the batch-4 L1 counts (PT 36 + 13, DE 5 + 5, ES 4 + 2).
5. **L5 — Rule 28 provenance.**
   - **Internal record:** the full record (model identifier, version, date, prompt summary, reviewer decision) stays mandatory in an **internal record** — the book's editorial log, plus the new provenance record below.
   - **Reader-facing line:** reader-facing files carry only one plain statement per locale, with no model, version, context window, prompt or vendor detail.
     - EN "AI-assisted draft, not yet reviewed."
     - PT "Rascunho assistido por IA, ainda não revisado."
     - DE "KI-gestützter Entwurf, noch nicht geprüft."
     - ES "Borrador asistido por IA, aún no revisado."
     - Decided by the assistant under D13 and reported to the lead. It replaces "Drafted by: AI (Claude, Anthropic)" because a vendor name is still model detail. Only one DE form exists, so the "Entworfen von" / "Verfasst von" split ends.
   - **Granularity:** Rule 28:605 ("each AI-assisted verse must record…") is amended to the granularity that is actually kept: **per file**, in the provenance record, and **per book/batch** in the log.
   - Also updated: :743 (companion checklist) and :1109 (log-schema field: "internal; never reader-facing").
   - **Before batch 3 strips the reader lines, nothing may be lost:**
     - Every reader-facing provenance line, the 645 S9 `ai-provenance` hits (file, line, text, 4 locales), is copied into **`docs/editorial-log/ai-provenance-record.tsv`**, generated from the sweep snapshot and checked against a fresh grep.
     - **1 Peter gets its missing log entry**: `1-peter.md` has no AI-provenance record at all.
   - **Sweep S9** (`scripts/sweep/checks.mjs:769–771`) exempts exactly the 4 approved statements, so batch 3 can clear the class and promote it.
6. **L4 — scope of glossary locks.** One sentence in Rule 1 / §I3: a locked rendering governs the translation and any TT-voice sentence that restates it. Genre and reception uses keep their own forms, e.g. "the Gospel of Mark", church-historical "baptism", Greek lemmas.
7. **L6 — Rule 10 PT register clause** (:222 "Not archaic"; :1188 "contemporary formal Brazilian Portuguese"). The PT verse text keeps the classical second-person plural *vós* — the logged corpus register (EXECUTION_HISTORY:90) — as the one sanctioned archaism, for consistency with the Almeida tradition the PT edition positions against. Everything else stays contemporary formal.
8. **D8 — "son of man" lowercase everywhere.** Rule 20 :449 ("body-text lowercase applies only to inline references and verse text") → body text **including notes and companions**. Section headings keep heading case, and DE keeps grammatical noun capitalization. The lead's word was "everywhere". Notes are included; the lead can override this after merge.
9. Editorial-log schema table: the `Reviewers` row (:1111) has an unescaped `|` → `\|`. **Pipe escaping is limited to RULES-CORE**, because the sweep's table parser splits on every `|` (`rule-tables.mjs:82`) and reads RULES-HB/GS tables.
10. **New-book checklist** (:835–843, "5 SYNCHRONIZED CHANGES") → a short PEOPLE-specific list that points to `AUTHORING-PLAYBOOK.md` B.1 as the one full list.
    - The non-existent `people.inBook.{slug}` key goes, and so does the hand-kept lint allow-list (generated since Step 2).
    - Same fix in the playbook (row 5 at :73 and the "not yet checked" sentence at :78) and in CLAUDE.md.
11. **D9 leftovers:** RULES-CORE:388, :392 → "Yehudim (DE Jehudim)". **Stale internals:** a grep for `29`, removed paths and version claims across the live sections.

**RULES-GS.md:** D9 (:105) → EN/PT/ES Yehudim, **DE Jehudim** (yod → J, as JHWH; `john.md` J-006), matching :127. The corpus line (:11, "stub, filled on authoring") → the actual Greek corpus. Version list: v3.4.1.
**RULES-HB.md:** the bare-נֶפֶשׁ row (item 2); "Rules 1-29" (:551) → 1–30; version list: v3.4.1.

### B2.2 `CHANGELOG-v3.4.md` (new)

- **v3.3 → v3.4** (2026-06-17): Rule 30 and the Text-Highlight Markers. Reconstructed from RULES-CORE VERSION HISTORY and EXECUTION_HISTORY, and labelled as such.
- **v3.4.1** (this batch): a per-file table in the CHANGELOG-v3.3 format, every row marked *modification* or *addition*.
- **"Dated addenda"**: later batches append here (batch 4 glossary rows, labels and the Genesis nephesh deviations; batch 5 D11 name tables).

### B2.3 Editorial logs

**Each affected log gets:**
- a **"Launch Program decisions (2026-11-19/20)"** section of schema entries: `## Entry <ID>`, Verse(s), Language(s) affected, Rule(s) invoked, Decision, Alternatives, Justification, AI provenance, Status `provisional`, Reviewers `unassigned` — RULES-CORE :1101–1113;
- superseded entries marked `superseded` **with a forward pointer** (§L2, :1137);
- superseded lines annotated inline, dated, in the existing 1-peter.md:57 pattern. History is never deleted.

**Per log:**
- **`acts.md`:** L3 — A-004 (:20) `superseded` → new entry (Acts 2:17–21, 2:34, 3:25 unmarked). Also the Rule-30 scope bullet. L7 — :57 "Messiah", plus a check of the "= the Messiah" gloss in A-005 (:30). D7 — :65 "my soul" (Acts 2:27).
- **`1-peter.md`:** L3 — scope :21–26 (1:16 and 2:6 unmarked). L7 — :34, :43, :52. D7 (:57) and D11 (:40) notes exist; wording confirmed. **L5 — the missing AI-provenance entry.**
- **`john.md`:** L3 — **J-036** (:548, which declared 3:16–21 marked) `superseded`, cross-referenced to J-007 (the reason: "when in doubt, do not mark"). L6 — a new **corpus-wide** register entry (also referenced from the 1 Peter, Acts and Genesis logs): *vós* kept; the 12 John `vocês` → *vós* in batch 4. D8 — J-018 (:270–272, Title Case in notes) superseded. D9 — J-006 confirmed DE Jehudim.
- **`mark.md`:** D8 — :52. L1 — :116 DE contraction convention generalized to all locales.
- **`genesis.md`:** D8 — :1392–1396. D7 — new entry pointing to the HB row (batch 4 logs the deviations).
- **`matthew.md`:** D8 — :206.
- **`luke.md`:** new entries for D7 (Luke 1:46 …) and L7 (Luke 2); the log has no lines to supersede.
- **All 7 logs:** the header `Ruleset version in force` → v3.4.1 (genesis/john/matthew still say v3.3). Plus a one-line content re-stamp record (precedent: john.md:548, matthew.md:554).
- **Not in this batch:** the L8 waiver (batch 7).

### B2.4 Templates, transliteration decisions

- **`docs/templates/*`:**
  - stamp v3.0 → v3.4;
  - companion status `draft` → `provisional`;
  - "derived directly from the Hebrew text" → HB/GS-neutral;
  - the duplicated Sources table inside §I goes;
  - the provenance block follows amended Rule 28.
- **`transliteration-decisions.md`:**
  - header/version;
  - adds *nephilim*, *tebah*, *gopher*, *Pesach*, *Hakeldama* and the GS terms already decided in the logs, each with its log reference;
  - fixes the self-contradicting *Chava* line.
- The full `{t:}` ↔ glossary/log reconciliation (S21) stays in batch 4.

### B2.5 Reader guide and project docs (audit §7)

- **`HOW-TO-READ-TT.md`:**
  - the Read/Notes/Deeper doors;
  - the 4 markers with their live colours (D10);
  - Greek specifics: Yehudim/Jehudim, and κύριος "the Lord" with its note;
  - HB/GS where "Hebrew" meant both;
  - per-book logs.
- **`STANDARDS.md`:**
  - the real file map and routes (`src/proxy.ts`, `[book]/chapter/[n]`; no `VALID_BOOKS`/view toggle);
  - the SEO table as shipped;
  - dependencies from `package.json`;
  - counts → a pointer to CLAUDE.md.
- **`TT-DESIGN-SYSTEM.md`:**
  - the "migration (in progress)" note goes;
  - the anti-slop vocabulary becomes Read/Notes/Deeper;
  - the inclusive section adds ES;
  - the tablist pattern → URL doors (the Deeper sub-tabs keep the tablist).
- **`CLAUDE.md` / `README.md`:**
  - trees (7 books; `src/` without `hooks/`, with `marketing/` and `prophecy/`; app `background/`, `rules/`, `start/`; 8 logs; the guides including the playbook);
  - the URL table (`/`, `/books`, `/rules`);
  - D9 wording (CLAUDE.md:102, :124);
  - the Rulesets line;
  - **test counts after this batch's new tests**.
- **`CONTRIBUTING.md`:** a model-neutral co-author trailer; counts → a pointer.
- **`AUTHORING-PLAYBOOK.md`:** :73, :78, :131 (D9), :141 (D10).
- **`EXECUTION_HISTORY.md`:** the ruleset trail gains v3.4 and v3.4.1, plus a batch 2 entry.
- **`PENDING.md`:**
  - last-updated date;
  - done items removed (§5 `Name (Name)`, the "untracked" `achados-arqueologicos.md`, the stale Mary-as-Ark gating);
  - the dangling :79 `COMPANION-RESEARCH.md` fixed;
  - Step 4 cross-references.
- **`docs/source-analysis/README.md`:** :13 and :21 (lists 3 logs). Also `greek/README.md:3`: the Greek corpus = Mark, Luke 1–3, Acts 1–3, 1 Peter.
- **`CONTENT_SWEEP_FINDINGS.md`:** S8 `ruleset-v3.3` and S10 stamp/prose classes → fixed (batch 2).
- **Audit archive status headers** (PLAN_MARK_PROPAGATION, PLAN_LUKE_EXPANSION, PLAN_ACTS_EXPANSION, PLAN_TIER3_REUSABILITY, MULTI_BOOK_EXPANSION_PLAN, ARCHITECTURE_DRY_AUDIT, REDESIGN_MIGRATION_PLAN): one dated status line each; the bodies are untouched.
- **Accepted, not fixed** (recorded in PENDING):
  - the `X_PLAN` / `PLAN_X` naming drift: renaming would break hundreds of historical references;
  - the 4 plans without audits (Acts, Tier4 name-dedup, methodology-restamp — all executed and merged; DAAT gets its audit in batch 8);
  - `docs/redesign/` (a standalone, unwired prototype — historical; its "29 rules" stays).
- **Dangling references.** The scanner (scratchpad `dangling.py`):
  - resolves bare filenames by basename and `../` links relative to the citing file;
  - skips placeholders (`CHAPTER-N`, `{…}`).
- **The split for dangling references:**
  - **Live** (fixed; 0 at the gate): rule-file text outside VERSION HISTORY, guides, templates, architecture, design, CLAUDE/README/CONTRIBUTING, PENDING, source-analysis READMEs, editorial-log **headers**.
  - **Historical** (kept as written; they describe what existed then): RULES-CORE VERSION HISTORY, changelogs, editorial-log **entries**, audit plans/audits, EXECUTION_HISTORY, `docs/redesign/`.
  - `SCHEMA-FUTURE.sql` (not `.md`, cites `PLAN.md`) → post-launch with its other defects.

### B2.6 Content re-stamp

**Exactly 133 lines in `content/`:**
- **125 stamp fields** (`**Ruleset|Regelwerk|Reglas|Regras|Conjunto de Regras|Conjunto de Reglas|Conjunto de reglas:** v3.3` → `v3.4`, parenthetical untouched; not parsed by any parser and not rendered);
- **8 prose stamps** ("TT ruleset (v3.3)", genesis/john INTRODUCTION × 4 locales; rendered).

**Kept:** the 4 Luke 3 citations ("v3.3.2 cross-book convention"). They are a reader-facing process leak on lines batch 3 rewrites anyway (S9 repo path) → **batch 3 to-do: remove the phrase**.

**How it's done:** scripted with anchored patterns, then verified by count (133) and a word diff showing only `v3.3` → `v3.4` tokens.

### B2.7 Lint: §0.1b → blocking

- **§0.1b** becomes blocking (`check_pattern`/emit-error, same id) over `content/`.
- **Not allow-listed:** amendment citations (`v3.3.N` followed by a convention word in the 4 languages) are excluded by a filter inside the rule, so batches 3, 6 and 7 can rewrite those lines without breaking the lint or the allow-list test.
- Editorial logs stay excluded.
- The comment "rules at v3.3" → v3.4.
- The batch map's "§0.1 back to blocking" means §0.1b — §0.1 is already blocking.
- **Expected:** `pnpm content:lint` keeps its warning set minus §0.1b.

### B2.8 Tests

**`activation-consistency.test.ts`:**
- **Hero tagline:** `heroTagline` is split on ` · `; for every activated book, each locale must contain `${book label} 1–${max chapter}`, with the max chapter derived from `content/en/<book>/CHAPTER-*.md`. The segment count must equal the number of active books.
- **Section kick:** the `sectionKick` count word equals the number of active books (number words 1–12 per locale).
- **Source stubs:** match `^${slug}(-.*)?\.md$` in `docs/source-analysis/{greek|hebrew}/`. `KNOWN_SOURCE_STUB_GAPS` equals exactly `["john", "matthew"]` (exact equality, as `locale-parity.test.ts:200`).
- **See-target allow-list:** scoped to the table after the stable anchor prefix "Allow-list of valid `**See:**` target slugs". The test asserts the anchor exists and the table has ≥ `active.length` rows.
- **`people.inBook`** is named neither in RULES-CORE nor in the playbook.

**`rules-messages.test.ts`:** `## THE {N} RULES` equals `RULE_COUNT` and the count of rule headings.

### B2.9 Gate and verification

**Gate commands:**
- `pnpm test`, `pnpm lint`, `pnpm typecheck`;
- `pnpm content:lint` (§0.1b blocking, green);
- `pnpm build` (then restore `next-env.d.ts`).

**Conservation:** the file and unit counts are recorded **before and after** via the same derivation the gate uses (a scratch script). They must be identical (408 / 20,676).

**`pnpm content:sweep` regenerated — expected diff, exactly:**
- S8 `ruleset-v3.3` −125;
- S10 `stamp-field` −125, S10 `prose-stamp` −8 (S10 `citation` 4 unchanged);
- S9 `ai-provenance` unchanged, since no reader line changes yet;
- plus any rows caused by the new HB נֶפֶשׁ row, listed and explained;
- anything else is a defect.

**Other checks:**
- a Markdown table cell-count check on every edited table;
- the dangling-reference scanner: live = 0.

### B2.10 Out of scope (routed — the §2 rows are authoritative)

- **Batch 3:** D9 (DE Jehudim), the reader provenance lines → the Rule 28 plain statement, "Tier 2" in reader text, the 4 doubled articles, the Luke 3 "v3.3.2 convention" phrase, the stray `</content>` lines, the companion §H/§I order.
- **Batch 4:** D7, D8, L1 (contractions), L3, L4, L6, L7 content; the Genesis nephesh deviations.
- **Batch 7:** the L8 waiver.
- **Step 5:** `engines.node`.
- **Post-launch:** `SCHEMA-FUTURE.sql`.

### B2.11 Plan review log (2026-11-20, 2 adversarial reviewers: 0 blockers, 10 major, 11 minor — all applied)

**Governance**
- **Protocol path:** a re-opening with a lead waiver, not the additive-only emergency path. The false "amendments never re-stamped content" claim was corrected.
- **D7:** the HB bare-נֶפֶשׁ row is added now (§G4), not routed.
- **L5:**
  - provenance loss was certain (1 Peter has no log record), so a provenance record and a 1 Peter entry were added;
  - the DE form is named;
  - "vendor = model detail" is decided;
  - per-verse → the granularity actually kept.
- **L1:** the :378 rewrite was narrowed, so §I2 idioms gain no marking duty; it cross-references RULES-GS:91.
- **D8 "everywhere":** the genesis/john/matthew Title-Case log lines and Rule 20:449 are added.
- **L6/L4:** rule text added (Rule 10 PT clause; lock scope); the citation was corrected to EXECUTION_HISTORY:90.
- **L3:** J-036, not J-007; A-004 marked `superseded` with a forward pointer.
- **L7:** 1-peter.md:34 added. **D7:** acts.md:65 added; Luke gets new entries.
- **Schema:** new entries follow the schema.
- **Leftovers:** D9 and D10 leftovers in RULES-CORE, CLAUDE.md and the playbook.
- **Line numbers and stale counts:** "Rules 1-29" in HB, :1450, :886, the new VERSION HISTORY entry, the GS version gap.

**Execution**
- **Sweep diff:** the sweep snapshot loses 258 rows (not "no diff"); exact expectations written.
- **Pipe escapes:** limited to RULES-CORE (the sweep parses HB/GS tables).
- **Luke 3 citations:** excluded by filter, not allow-listed (allow-listed lines would break in batches 3/6/7); the phrase routed to batch 3.
- **Sweep S9:** must exempt the approved provenance statement.
- **Tagline test:** checks label + chapter range (the "no non-activated" assertion could never fail).
- **Anchors and guards:** the anchor uses a stable prefix plus a row floor; the rule-count guard moved to `rules-messages`; the stub regex is exact; the gap list uses exact equality.
- **Missed docs:** source-analysis README:21, the log headers at v3.3, `rulesHeroKicker`, naming drift / un-audited plans / `docs/redesign/` given an explicit disposition.
- **Dangling-reference split:** by section, with scanner resolution rules; PENDING:79 fixed.
- **Conservation:** counts recorded before and after.
- **Docs:** CLAUDE.md counts updated after the new tests; one cross-book log record of the re-stamp; line references corrected.

### B2.12 As executed — deviations from the plan

- **Sweep S9 needed no exemption.** The S9 patterns are case-sensitive (`"Drafted by"`, `"Not yet reviewed"`), and none of the four approved statements matches them. A guard test was added instead (`checks.test.mjs`, "plain provenance statements are not flagged"), so a future pattern change cannot start flagging them.
- **Provenance record = 252 lines.** The sweep's 645 S9 `ai-provenance` hits fall on 252 distinct lines, matching a fresh grep exactly. Each row also carries the following lines of its provenance block (date, reviewer), because those are separate list lines.
- **L6 count corrected.** The 12 PT `vocês` are 11 in John and 1 in Matthew 3:9. Matthew 3:2–3 and 3:8–9 also have `vocês` verb forms with no pronoun, which the sweep's pronoun count missed. Recorded in J-037 and in the proposal's impact table.
- **D8 → Rule 20 covers all titular nouns in notes**, not only "son of man". The superseded log clauses (J-018, M-013, genesis 099) also kept "Son of God" in Title Case in notes. Rule 20 governs titular nouns as one class, so the amended :449 applies to all of them. **Assistant decision under D13, for the lead to confirm or override** (batch 4 applies it).
- **Found during execution:** RULES-GS's transliteration note listed *mabbul*, which RULES-HB renders "flood". Corrected in v3.4.1 and added to the changelog.
- **Docs beyond the plan (accepted):**
  - AUTHORING-PLAYBOOK §5 PT row now records *vós* (L6); trap T-20 now records the L1 decision.
  - The companion template puts Sources last (as Genesis does). The 1 Peter companions put §H Sources before §I → **batch 3 (structure check)**, not a rule defect.
- **Conservation test** gains an opt-in count report (`CONSERVATION_REPORT=1`): 408 / 20,676 before and after.
- **Forward reference kept:** `LAUNCH_PROGRAM.md` names `PLAN_LAUNCH.md`, the Step 5 plan that does not exist yet.

### B2.13 Implementation review (2026-11-20, 5 adversarial reviewers)

Five reviewers: rules fidelity · editorial logs · docs accuracy · code/lint/tests (copy-based mutants) · plan/process fidelity. **No blockers.** Every finding is fixed, apart from the items routed below.

- **Decision boundary (D13)** — assistant decisions had been recorded as lead decisions.
  - **Rule 20** had been extended to *all* titular nouns in notes. It is now **narrowed back to D8** ("son of man"), with an exception for quotations and reception history. The extension is an open lead question (PENDING) for batch 4.
  - **Rule 28** — per-batch granularity, the 4-locale wording, the dropped vendor name — and treating the lead's approvals as the 14-day **window** waiver are now marked "assistant decision (D13), pending lead confirmation" in the rule text, changelog, proposal (†), logs and PENDING.
- **Rule text**
  - **§I3:** life/being is a **pair** (the context selects the member, not a slash; Rule 2 slash only where both senses are live), in the GS row too. HB row: example Gen 9:4 → 12:5 (9:4 already reads "life").
  - **Rule 11:** contractions are open-ended (any preposition + article: PT `ao/à/num…`, DE `am/ans/beim/ins…`).
  - **Rule 1:** an L4 pointer.
  - **Rule 10:** *vós* object/possessive forms.
  - **Idiom policy:** now cites §I2's note.
  - **Rule 28:** the opening "No verse ships without documented review" (false: the site ships provisional) is reworded; the unplanned "after review" line is removed.
  - **§0.12:** lint wording (generated list + `FORWARD_SLUGS`); the 8 touchpoints named.
  - **HB:** group-name note DE Jehudim.
  - **Protocol citations:** §G3 "Hybrid mode", §G4 "Locking", `proposals/glossary-nephesh.md` (the §G2 format), "to be logged in batch 4".
  - **Changelog/VERSION HISTORY/proposal:** completed (book-introduction spec, *mabbul*, GS clauses, version lists, PT register note).
- **Editorial logs**
  - The deleted *Chava* history is restored.
  - A-009 includes DE (43 "Messias" outside verse text).
  - The Messiah, *vocês* and object-form counts are given per reading copy and file class, so batch 4 is sized correctly.
  - Extra D7 sites have pointers (John 2:22 note, DE Matthew 3 note).
  - Schema: non-enum "superseded in part" status → cross-references; mark/acts/1-peter headers completed.
  - Provenance entries are added to every log whose reader lines name a model (John credited Opus 4.6 only in the reader text).
  - P-013 commit dates corrected; *tebah* invented reason removed.
- **Lint §0.1b (MAJOR):** the citation filter dropped whole lines and matched "conventions"/"Unconventional", so a real stale stamp could pass.
  - It now strips only the **4 exact citation phrases** and re-checks the rest of the line.
  - A grep error is a tool error, not a silent pass.
  - Stamp fields without the `v` are caught.
  - Proven on a repo copy: a stamp sharing a line with a citation → exit 1.
- **Tests**
  - The allow-list check also requires "Currently authored" for activated books.
  - The sectionKick guard covers ≤ 12 books and documents the noun-gender assumption.
  - The "THE N RULES" regex cannot span lines.
- **Docs**
  - **STANDARDS:** i18n fallback (invalid locale vs a missing key → `messages-parity`); ChapterShell has no pager.
  - **HOW-TO-READ:** Rule 30 includes the Spirit; the "Documented" label; caveats where content is not yet aligned (Jehudim, contractions).
  - **Playbook:** the *vós* row notes batch 4.
  - **Template:** H-last is a convention (24 companions differ → batch 3).
  - METHOD.md "Rules 1–30"; lint messages "content stamps v3.4, rules v3.4.1"; PENDING wording.
- **Routing completed in §2:**
  - batch 3: Luke 3 citation phrase, stray `</content>` lines, §H/§I order;
  - batch 4: Genesis nephesh deviations, PT object/verb forms, χριστός restatements incl. DE, extra D7 sites, the Rule 20 lead question;
  - Step 5: `engines.node`;
  - §B2.10 now matches §2.
- **Environment note:** under machine load, Vitest can end a fully-passing run with "Timeout calling onTaskUpdate" (exit 1). The cause is outside the branch; watch it in CI.
