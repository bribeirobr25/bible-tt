# Plan — Step 1: Baseline Recovery (pivot-fidelity commit + 1 Peter merge)

**Program:** `docs/audit/LAUNCH_PROGRAM.md` — Step 1 (decisions D1, D7, D13, D14, D16).
**Date:** 2026-11-19
**Status:** **EXECUTED 2026-11-19** (commits `ffea172` / `857a2b2` / `7f88bdc` / `6164fe0` + review fixes; PR #15) · REVIEWED (independent adversarial review, §9; implementation review, §10) · approved for execution by the project lead (2026-11-19: "after the plan is reviewed and fixed or improved, implement it"; D1 amendment confirmed, §4).
**Branch:** `baseline-recovery` (from `main` @ `b4dc719`) → PR → merge when the full gate is green (D14).

---

## 1. Goal

Bring the two bodies of finished work stranded outside `main` onto `main`, so every later step builds on the true baseline:

1. **Orphaned commit `333a373`** — pivot-fidelity audit (`docs/audit/PIVOT_FIDELITY_AUDIT.md`), its DE/ES content fixes, lint guards `§0.3b`/`§0.3c`, and its PENDING follow-ups. Pushed to `luke-propagation` ~10h after PR #12 merged, so it never reached `main`.
2. **Branch `origin/1-peter-expansion`** — book #7 (1 Peter 1–5 × 4 locales, 72 content files), its plan + audit, editorial log, source-analysis stub, the leading-digit slug regex widening (+ regression test), and the activation touchpoints.

**Non-goals (later steps):** corpus-wide ψυχή alignment (D7) and name alignment (D11) → Step 4; audit §3 bug fixes → Step 4a; safety-net work (incl. §0.3c precision, UTF-8 locale in CI) → Step 2; `/start` "coming soon" copy → Step 4.

## 2. Pre-flight evidence (trial worktree + independent review, 2026-11-19)

| Check | Result |
|---|---|
| `333a373` scope | 14 files, no hidden extras; applies cleanly onto `main`; `next-env.d.ts` drops out |
| Its fixes still needed on `main` | Yes — DE `der Mächtige *Eine*` ×2 (+ note), ES `se exultó` ×4, `en el era vida` ×4, `se cernia` ×2; all 32 `*esta*`→`*está*` edits verified as the copula |
| Its fixes complete? | **No** — two gaps (review F2): `es/genesis/CHAPTER-1.md` "cuya semilla *está* en el," (Gen 1:11–12, 4 occurrences on 3 lines; Hebrew *zar'o-bo* → pronoun *él*) claimed in the commit body but never applied; `es/john/CHAPTER-1.md` "**En el era vida.**" (capital E) missed because §0.3b is case-sensitive |
| `1-peter-expansion` | merge-base `1e4132d`; only doc divergence from `main`; changes no other book's content; only `CLAUDE.md` conflicts textually; the two inputs share only `PENDING.md` + `content-lint.sh` (disjoint hunks) → pivot-first ordering is safe |
| Full gate on recovered + merged tree | **887 tests**, conservation **408 files → 20,599 units**, Biome, `tsc`, content-lint (1 pre-existing §0.10 warn), build **516 static pages** incl. all `/{locale}/1-peter/**` |
| 1 Peter content vs guards | 0 hits on §0.3b/§0.3c tokens; DE JHWH 115×, YHWH 0× |
| Author emails | `333a373` + the 10 branch commits use the private address; branch commits already exist on `origin` |

## 3. Semantic conflicts to resolve during the merge

| # | Where | Resolution |
|---|---|---|
| S1 | `CLAUDE.md` Verified state (textual conflict) | Take branch scope + test lines (7 books, 887 tests, conservation 408/20,599); keep `main`'s **Current program** line; "Next up (post-launch)" = Galatians → Romans → James + Genesis 13–50. Resolve by hand (no blanket `--theirs`) |
| S2 | `PENDING.md` | Keep the 1 Peter DONE entry + pivot follow-ups; re-word the "NT Epistles — next: Galatians" bullet as **post-launch**; annotate the audit-pointer headlines (1 Peter unmerged / `333a373` orphaned) as **resolved by Step 1**; "Last updated" → 2026-11-19 |
| S3 | `EXECUTION_HISTORY.md` | Keep the branch's 1 Peter entry (historical); add a new top entry for this step |
| S4 | Recovered `333a373` text | Its PENDING hunk and commit body say "folded into the Luke-propagation PR" / "886 tests; conservation 288/15945" — reword the PENDING hunk to "recovered onto `main` 2026-11-19 (orig. `333a373`)"; the recovery commit message gets a preface explaining provenance + current gate numbers above the preserved original body |
| S5 | `PROJECT_STATE_AUDIT.md` §1 | Add a dated status note: both §1 items resolved by Step 1 (keep findings as historical record) |
| S6 | `1-peter.md` (editorial log) | Its ψυχή = "soul" line contradicts D7 → add a dated note: superseded by D7 (life/being), corpus-wide re-rendering in Step 4 |

## 4. D1 amendment (confirmed by the project lead, 2026-11-19)

D1 originally required 1 Peter's ψυχή and "Kefa" naming fixes **before** merge. Both are corpus-wide (ψυχή = "soul" already ships in Luke 1:46, 2:35, Acts 2:27, 2:41; Kefa/Peter naming drifts in Mark/John/Acts), so a 1 Peter-only fix would create a new inconsistency. **Lead decision:** merge 1 Peter as authored; apply D7 (**life/being, confirmed again with the wider impact**) and D11 uniformly across all 7 books in Step 4. Recorded by amending D1 and the Step 1/4 rows in `LAUNCH_PROGRAM.md`.

## 5. Execution steps

1. **Branch:** `git switch -c baseline-recovery main`; ensure repo `user.email` = no-reply (D16).
2. **Recover `333a373`:** `git cherry-pick -n 333a373`; drop `next-env.d.ts` if staged. **Complete the two missing fixes** (Gen 1:11–12 `está en el,` → `está en él,` ×4; John 1 note `En el era vida` → `En él era vida`). **Tighten §0.3b** to `\b[Ee]n el era\b` and add `está\*? en el,`. Reword the PENDING hunk (S4). Commit under no-reply with a provenance preface + preserved original body. Gate: `content:lint` + `pnpm test`.
3. **Merge 1 Peter:** `git merge --no-ff --no-commit origin/1-peter-expansion`; resolve S1–S2 by hand; check `git diff --check` and `git grep -n '^<<<<<<<\|^>>>>>>>'` (no `node_modules` walk); diff resolved `CLAUDE.md`/`PENDING.md` against both parents; commit (no-reply).
4. **Source-anchored spot check of 1 Peter (D1 "review")**, PT/DE/ES sample (chapters 2–4): Rule 11 italics transfer (e.g. `pt-br/1-peter/CHAPTER-4.md:62` "sofrido na *carne*" — σαρκί is in the Greek, so the italic is a pivot artifact), anti-calque (§0.3c class), DE JHWH in citations, marker parity. **Fix unambiguous artifacts in this step**; log the class + counts as Step 3 sweep input (not a full sweep).
5. **Docs commit:**
   - `EXECUTION_HISTORY.md` — new top entry "Step 1 — Baseline recovery".
   - `LAUNCH_PROGRAM.md` — amend D1 (§4); Step 4b gains "1 Peter ψυχή/Kefa + corpus-wide D7/D11"; progress-log row.
   - `PENDING.md` — S2; `PROJECT_STATE_AUDIT.md` — S5; `1-peter.md` — S6.
   - `README.md` — scope line (L11), People line "Currently authored for … Acts" (L58), "6 books × 4 locales" tree comment (L122), editorial-log link list (L101, L131) gains mark/luke/acts/1-peter, project-state paragraph + tech table → 7 books / 887 tests.
   - `AUTHORING-PLAYBOOK.md` — B.1 row 5 example "Five→Six" → generic "{N}→{N+1} books"; T-16 marked **exercised** (1 Peter); new trap **T-19 leading-digit slugs** (cross-book slug regexes must admit `[a-z0-9]`; fixed in 1 Peter Phase 0a).
6. **Full gate:** `pnpm test` · `pnpm lint` · `pnpm typecheck` · `pnpm content:lint` · `pnpm build`; `git checkout next-env.d.ts` before staging.
7. **Served-HTML + visual verification** (production build, `pnpm start` :3001; Playwright):
   - `/{locale}/books` × 4: 7 books, "Seven books" kicker, hero tagline lists 1 Peter, 1 Peter under **Greek Scriptures**.
   - `/{locale}/1-peter` hub × 4: at-a-glance card has all 5 fields; `/chapter/1`, `/chapter/3/notes`, `/chapter/2/deeper`, `/people`, `/introduction`, `/background` → 200.
   - 404: `/en/1-peter/chapter/6`, `/en/1-peter/chapter/6/notes`. Redirect: `/en/1-peter/1` → `/en/1-peter/chapter/1`.
   - People: Kefa stub renders the **link to Mark** *and* the localized "In 1 Peter / Em 1 Pedro / In 1. Petrus / En 1 Pedro" field.
   - Introduction: §B4/§D3 epistle headings present × 4.
   - OG images: `/{locale}/1-peter/opengraph-image` and `/chapter/1/opengraph-image` return PNG.
   - Sitemap: 1 Peter URLs × 4 locales with hreflang alternates.
   - Recovered fixes in served HTML: `/de/luke/chapter/1` (no "Mächtige Eine"), `/es/luke/chapter/1` (`exultó`), `/es/john/chapter/1` (`en él era vida`, `En él era vida` in notes), `/es/genesis/chapter/1` (`se cernía`, `está en él`).
   - DE 1 Peter OT citations: JHWH in served HTML.
   - Screenshots: 1 Peter chapter (EN, DE) desktop + mobile.
8. **PR** `baseline-recovery` → `main` with gate + verification results; merge **server-side** via `gh pr merge --merge` (preserves the 10-commit history; no squash), when green (D14).
9. **Post-merge:** `git switch main && git pull`; list remote branches (`1-peter-expansion`, `luke-propagation`) for lead cleanup (not deleted).

## 6. Gates & acceptance criteria

- Tests ≥ 887 pass; conservation additive (≥ 408 files / ≥ 20,599 units); activation-consistency includes `1-peter`.
- Biome, `tsc`, content-lint (only the pre-existing §0.10 warn), build green.
- Zero conflict markers; `next-env.d.ts` not committed.
- Every §5.7 check passes.
- Docs coherent: no scope/project-state line still says 6 books / 886 tests; nothing says Galatians is next *before* launch; no recovered text claims "folded into the Luke PR".

## 7. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Push rejected (email privacy) | Re-authored recovery commit + no-reply merge commit; merge via `gh pr merge --merge` (server-side, avoids the CLI push check for the branch's pre-existing commits). No squash fallback (would break §8 rollback and history) |
| Hand-resolution of `CLAUDE.md`/`PENDING.md` loses/duplicates lines | Diff against both parents; post-implementation review |
| Recovered §0.3c guard false-positives on legitimate sentence-initial Rule-11 article additions (e.g. "*Eine* Stimme") | None today (trial lint clean on all 7 books); precision fix scheduled in Step 2 |
| `\b` after `ó` depends on a UTF-8 locale | Note for Step 2 CI (set `LC_ALL=C.UTF-8`/`en_US.UTF-8`) |
| 1 Peter carries pivot artifacts (propagated without §0.3c/anti-calque tooling) | §5.4 spot check + fixes; class logged for Step 3 |
| Merge changes behaviour beyond 1 Peter | Code diff limited to registry/BOOK_ORDER/bookLabels/aliases/i18n/regex widening (+1 test), verified non-regressive; conservation additive proves no loss in existing books |

## 8. Rollback

Single PR, merge commit. `git revert -m 1 <merge>` restores prior `main`; the recovery commit and the docs commit can be reverted independently.

## 9. Plan review (independent adversarial review, 2026-11-19)

| # | Severity | Finding | Resolution |
|---|---|---|---|
| F1 | blocker | §4 deviation overrode locked D1 without lead sign-off; 1 Peter log adds a ψυχή = "soul" decision contrary to RULES-GS | Lead confirmed D1 amendment + D7 (life/being); D1 amended in program doc; S6 note in `1-peter.md`; Step 4b scope extended (§4, §5.5) |
| F2 | should-fix | `333a373` claimed Gen 1:11–12 `está en él` but never applied it; capital `En el era vida` survives (case-sensitive guard) | Fixes completed + §0.3b tightened (§5.2) |
| F3 | should-fix | Recovered PENDING hunk/commit body say "folded into the Luke-propagation PR", stale gate numbers | S4 rewording + provenance preface |
| F4 | should-fix | PENDING/audit headlines stale after merge | S2 + S5 |
| F5 | should-fix | D1 "review" had no content-review step; PT 1 Peter italicizes source words (pivot artifact) | §5.4 source-anchored spot check |
| F6 | should-fix | Missed README lines (L58, L122, L131) + playbook (Five→Six example, T-16 exercised, leading-digit trap) | §5.5 |
| F7 | should-fix | Squash fallback unnecessary and conflicts with rollback | Dropped; `gh pr merge --merge` |
| F8 | should-fix | Verification gaps (404, redirect, OG, corpus label/tagline, CARD, inBook field, sitemap hreflang, §B4/§D3) | Added to §5.7 |
| F9 | nice | Marker-check walks `node_modules`; §0.3c precision; UTF-8 `\b`; `/start` copy; stale worktree step | `git diff --check`/`git grep`; §0.3c + UTF-8 → Step 2; `/start` → Step 4; worktree step removed |

## 10. Implementation review (5 independent reviewers, 2026-11-19)

Run after implementation, before merge: (1) merge/recovery integrity, (2) code + tooling robustness, (3) content correctness, (4) docs coherence, (5) runtime/visual/links (production server, Playwright 1280×900 + 390×844). No regression in the six existing books; every hunk of both inputs accounted for; crawl of 80 pages / 132 links / 76 sitemap URLs (+hreflang) all 200; 0 console/hydration errors.

**Fixed in PR #15:**

| Source | Finding | Fix |
|---|---|---|
| R5 | Prophecy cards rendered raw `**…**`, `*…*`, `@@…@@`, `{a:…}` (pre-existing on Luke/Acts, worst on 1 Peter) | `prophecy-view.tsx`: title/textSays/context/fulfillmentNotes/scholarlyNote through the safe renderer |
| R5 | Glossary term column showed raw `{a:…}`; notes tooltip kept markers | `glossary-panel.tsx`: term via `renderInlineSafe`; markers stripped from notes |
| R5 | Glossary forced horizontal scroll on mobile (≤690px at 390px) | `glossary-panel.tsx`: wrap below `sm`, `min-w-0`/`overflow-wrap`, no `shrink-0` on cells |
| R2 | §0.3b/§0.3c matched bold (`**Una**`, `**esta**`); `\bse exultó\b` silent under C locale | Anchored on non-asterisk boundaries; trailing `\b` dropped; injection-tested (bold passes, defects fail, C locale fails) |
| R2 | Lowercase pivot calques (`tu santo *uno*`, `den heiligen und gerechten *einen*`, `santo e justo *um*`) unguarded | New warn-only **§0.3d** (blocking after the class is cleared, T-14) |
| R3 | 1 Peter claims Isa 40:8 has YHWH/κύριος; "verbatim"; "omits the middle clauses" | Corrected ×4 locales (chapter overview + note + glossary + cross-ref table, book CONTEXT, INTRODUCTION, companion §, PROPHECY ×4 spots) + `1-peter.md`: source reads "our God" (MT + LXX); κυρίου is 1 Peter's substitution; the LXX itself lacks MT 40:7 |
| R3 | Rule-11 italics on words present in the Greek: 2:18 οἰκέται, 1:7 δέ | Italics removed ×4 locales (bold glossary term untouched) |
| R3 | DE 2:6 "es steht … enthalten"; PT 2:15 "homens" for generic ἀνθρώπων (Rule 27) | "es ist … enthalten"; "das pessoas insensatas" |
| R3 | ES John 1 note accents (line edited by the recovery); 27× spurious `generaciónes` | Fixed; `generaciónes` added to §0.3b |
| R2 | ES Luke 1:49 note still said "TT supplies *uno*" after the DE/ES calque fix | Note corrected |
| R5 | 1 Peter People headers nested names ("Silvanus (Silvanus (also Silas))") | `Familiar name` → `Also known as` (×4 locales): familiar form from the heading, detail kept as a row |
| R1 | Recovery commit's "original message" abridged | Full original preserved at tag `archive/333a373` |
| R4 | Doc coherence (program status, D7/Step-1 rows, plan status, counts, T-20 method, post-launch labels, `CLAUDE.md` tree) | Fixed across LAUNCH_PROGRAM, EXECUTION_HISTORY, PENDING, PLAN_1PETER_EXPANSION, PROJECT_STATE_AUDIT §8, CLAUDE.md, playbook |

**Deferred (routed, with owner step):**

| Finding | Step |
|---|---|
| activation-consistency misses `bookLabels`, `inBook` aliases, lint lists/§0.12, editorial log; `ES_NT_CHAPTER_FILES` hardcodes chapters (R2) | 2 |
| Lowercase calque content (~17 lines, §0.3d); "LORD/SENHOR/HERR/SEÑOR" in note prose (1 Peter 59, Acts 45+) against Rule 25; editorial IDs + literal `@@…@@` + repo file paths in reader notes (R3, R5); ES Genesis accent backlog (~100 incl. Gen 4:9 "No se"); `*se cernía*` italic scope; PT vós/vocês register decision (corpus split); 1:16 future ἔσεσθε; 2:6 ἐπ' αὐτῷ referent divergence; Silvanus = Silas identification (D11) | 3 → 4b |
| DE Acts `In der Apostelgeschichte` alias (audit B11); person slugs keep quote characters (R2) | 4a |
| `RULES-CORE.md` Editorial-Log table row with an unescaped pipe character (row renders 7 columns); `CLAUDE.md` 5-change checklist vs 8 touchpoints | 4d |
| Cross-book "See" link lands at page top (no per-person anchor) (R5); chapter-head gutter + mobile title clip; ASCII `->` in supplementary headings | 5 |
| Remote branches `1-peter-expansion` / `luke-propagation` — for lead cleanup (history preserved by the merge + tag) | lead |

