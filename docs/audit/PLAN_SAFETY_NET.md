# Plan — Step 2: Safety Net (CI, parity, label robustness, lint hardening)

**Program:** `docs/audit/LAUNCH_PROGRAM.md` — Step 2 (D13, D14, D16).
**Date:** 2026-11-19
**Status:** REVIEWED (independent adversarial review, §10 — 1 blocker + 14 findings folded in) → revised → execution approved by the lead ("proceed", 2026-11-19, same workflow as Step 1: plan → review → fix → implement → 5-reviewer implementation review → fix → merge when green).
**Branch:** `safety-net` (from `main` @ `7f5e3b5`) → PR → merge when the full gate **and CI** are green.

---

## 1. Goal

Make the gate trustworthy before Steps 3–5 change content at scale: every check runs automatically, catches the classes of defect found in the audit and Step 1, and cannot pass vacuously. No reader-visible change except the defect classes that must be cleared before their guard can block (playbook T-14).

## 2. Evidence (measured 2026-11-19 on `main` @ `7f5e3b5`)

| Area | Current state |
|---|---|
| CI | **None** — no `.github/`; every gate is manual |
| Lockfiles | `package-lock.json` (2026-05-02) **and** `pnpm-lock.yaml` (2026-06-14); `packageManager` = pnpm 9; no `engines` |
| content-lint lists | 9 hardcoded per-book lists (`CONTENT_DIRS` … `EDITORIAL_LOGS`), §0.11 glob, §0.12 hash + file list; `ES_NT_CHAPTER_FILES` hardcodes chapter numbers; all `grep`/`perl` stderr → `/dev/null` |
| §0.3 ES diacritics | scoped to NT dirs only; its 5 tokens have **5 hits** in `es/genesis/study` (ch 5/7/8: `Edicion` ×2, `Espanol` ×3) |
| legacy ES diacritics | scoped to genesis/john/matthew only (0 hits elsewhere today) |
| legacy vosotros | case-sensitive; misses `Vosotros sois dioses` (Ps 82:6 citation, `es/genesis/study/CHAPTER-6-CONTEXT.md:93`) |
| §0.1 version stamps | blocks only v3.0–v3.2; **137** `v3.3`/`v3.3.2` stamps remain (non-chapter files; re-stamp is Step 4d) |
| §0.11 DE `Name (Name)` | `grep` backreference misses umlaut-initial names under macOS BSD grep |
| Shared rule IDs | 7 rules share `legacy`, two share `0.7` → one allow-list entry suppresses across rules |
| Labels | `labels.ts` substring match, VERIFIED checked first → `UNVERIFIED`/`NO VERIFICADO` → VERIFIED, `IMPROBABLE` → PROBABLE, no warning. Real labels rely on prefix matching (`WISSENSCHAFTLICHER VERGLEICH` ×25 vs alias `WISSENSCHAFTLICH`; `vergleichende Parallele` ×38) |
| Label guard | covers enrichment + introduction only (not prophecy readings, people curiosities) |
| Conservation gate | expected values rebuilt from the same parsed objects → cannot detect raw-markdown loss |
| Parity | no test for EN ↔ PT/DE/ES file sets, verse numbers, marker counts, companion entries; **companion entries currently differ in 10 file×locale sets** (the audit's 9 + Gen 9 F5 missing in PT-BR/ES; Step 4b D12); dual-label counts differ in 11 companions |
| activation-consistency | checks registry ↔ BOOK_ORDER ↔ HEBREW_BIBLE ↔ i18n `book.*` + one lint substring; **not** `bookLabels`, inBook aliases, §0.12/RULES-CORE allow-list, editorial log, non-EN content |
| People field resolution | `resolveField` fallback is substring-based: Luke `Note — divergence from Matthew` → `crossBookSee` (×4 locales; the row is then **dropped from the card**), DE `Erstnennung in Matthäus` → `inBook`, `Querverweis` → `crossBookSee`; DE lacks aliases for firstMention/booksAppearingIn/historicityStatus/deathYear/locations/placesLived; ES `Esposo/a(s)` → nothing; DE Acts `In der Apostelgeschichte` → nothing (B11) |
| Vacuous tests | `if (!raw) continue/return` (people-parser ×4), `if (herod)`, `if (ane)`; validity asserts that the fallback always satisfies while `console.warn` is mocked |
| i18n | parity holds (264 keys × 4) but only `book.*` is tested |
| vitest | `include` = `src/**/*.test.ts` (a `.tsx` test would be silently skipped) |

## 3. Workstreams

### WS1 — CI (first)
`.github/workflows/gate.yml`: on `push` to `main` and `pull_request`; `ubuntu-latest`; Node 22; pnpm from `packageManager` (pnpm/action-setup); `pnpm install --frozen-lockfile`; then `test`, `lint`, `typecheck`, `content:lint`, `build` as separate steps. Set `LC_ALL=C.UTF-8` explicitly; `pnpm/action-setup` **without** `version` (reads `packageManager`). The build fetches Google Fonts (`next/font/google`) — needs network; accepted, retried once on failure. **Acceptance = an actual green run on the PR**; merging (D14) waits for it. Branch protection with required checks is a lead-side GitHub setting (offered, not changed by this step). (the runner uses GNU grep — differences from macOS BSD grep surface here, not locally).

### WS2 — content-lint hardening (`scripts/content-lint.sh`)
1. **Generate book lists from the filesystem** (`content/<locale>/<book>/`); one `HB_BOOKS="genesis"` definition; `ES_NT_*` = ES books not in `HB_BOOKS`; chapter files by glob. Abort with an error if any generated list is empty.
2. **Make tool errors fail the lint.** Removing `2>/dev/null` alone is insufficient (review F1, blocker): `matches=$(grep … | filter_allowlist)` takes awk's exit status, so a broken regex / missing path still prints "passed". Capture grep's own status (0/1 normal, ≥2 = error → `ERRORS+=1`) and perl's; injection-test a bad path and a bad regex.
3. **§0.3 → all of `content/es`** after fixing its 5 hits; **legacy ES diacritics → all `content/es`**.
4. **vosotros rule case-insensitive**; allow-list the Ps 82:6 citation (same treatment as the two existing biblical-citation entries).
5. **§0.1**: keep blocking for < v3.3; add **warn-only** for `v3.3`/`v3.3.x` **in `content/` only** (editorial logs keep 28 historical mentions) — promote after the Step 4d re-stamp. (Deviation from the program's "< v3.4 stale" wording, recorded in LAUNCH_PROGRAM.)
6. **§0.11** via `perl -CSD` with `(\p{Lu}[\p{Ll}']+) \(\1\)` (umlaut-safe **and** keeps apostrophe names like `Ya'aqov`); injection-test both.
7. **§0.12** file list → `content/*/*/PEOPLE.md`.
8. **Distinct rule IDs** for the 7 `legacy` rules and §0.7a/§0.7b; migrate allow-list entries 1:1.
9. **§0.6** (PEOPLE.md per locale) generalized from John to every book.
10. **§0.3c precision** (routed from Step 1): flag the italic indefinite only after a capitalized word (`der Mächtige *Eine*`, `o Poderoso *Um*`), so a legitimate sentence-initial Rule-11 addition (`*Eine* Stimme`) passes; perl `-CSD`.
11. **No double scanning:** generated lists must not include both a book dir (recursive) and its `study/` subdir.
12. **bash 3.2 compatible** (macOS `/bin/bash` 3.2.57; CI bash 5.2): no `mapfile`, associative arrays, `${x,,}`; run the lint under both.
13. Widen §0.3 tokens with the remaining front-matter words on the same lines (`Companero`, `Capitulo`, `Historico`, `Analisis`, `Recepcion`) after fixing them (review F13).

### WS3 — label robustness (`src/domain/content/labels.ts`)
Match an alias only at a **word start** — `(?<![\p{L}\p{M}])` with the `u` flag (JS `\b` is ASCII-only); suffixes allowed (`WISSENSCHAFTLICHER`, `MÖGLICHE`); scan **every** occurrence. A match directly preceded by a negation/diminisher (`NOT`/`NICHT`/`NÃO`/`NAO`/`NO`/`NON`/`POCO`/`POUCO`/`WENIG`/`KAUM`) is **skipped and the search continues** (so `PROBABLE (NO VERIFICADO)` → PROBABLE); if nothing valid remains → warn + fallback. Pin today's **compound-label** behaviour (306 labels like `VERIFIED (…); POSSIBLE INFERENCE — UNCERTAIN (…)` collapse to the first pair) with unit tests; the policy question routes to Step 4. **Zero-change proof:** snapshot every resolved claim/confidence across all content before and after (temporary script) — diff must be empty. Unit tests for `UNVERIFIED`, `NICHT VERIFIZIERT`, `IMPROBABLE`, `IMPOSSIBLE`, range labels, and all aliases. Extend the "no unrecognized-label warning" guard to **prophecy readings**; people curiosities have **0** labels today, so that extension is explicitly future-only (asserted).

### WS4 — tests
1. **Cross-locale parity test** (new): per book — identical file set across locales; per chapter — identical verse-number sequence; per file — equal `@@` / `{a:` / `{t:` counts; per companion — equal `### ` entry count. plus per-companion **dual-label count**. Known gaps live in explicit `KNOWN_GAPS` maps keyed by **file × locale** with exact counts (10 entry gaps, 11 label-count gaps); the test fails if a gap **changes in either direction**. A `PILOT_BOOKS` exemption (empty today) lets an EN-first new-book branch pass (review F11); playbook documents it. Heading parity is **companions only** (chapter files legitimately differ: EN Acts/1 Peter lack the edition subtitle; DE Genesis has extra sections).
2. **Raw-count reconciliation** (new, independent oracle for conservation's blind spot): raw verse headers vs parsed verses; companion `### ` vs parsed entries; prophecy entries; people `## ` minus `## H.` sources and an explicit list of the 4 genealogy-table headings (not imported from the parser, to stay independent) vs parsed persons — per file. Plus **expected verse counts per chapter for every book** (NA28/BHS versification), so a verse dropped in EN and copied everywhere is still caught.
3. **activation-consistency extended**: `bookLabels` has every book; RULES-CORE see-target allow-list has every book; `docs/editorial-log/<book>.md` exists; content exists in all 4 locales; lint `HB_BOOKS` equals `HEBREW_BIBLE`; **content-driven**: every PEOPLE entry with a cross-book `See` pointer resolves a typed `inBook` (fixes B11). **People field resolution (review F3):** make the `resolveField` fallback word-start based (no `ver` inside `divergence`), add the missing DE/ES aliases, and add a test that each person resolves the same set of typed fields as its EN twin (explicit known gaps) and that no label resolves via a substring inside a word. People-data snapshot before/after: only the intended changes. Replace the lint-substring assertion with one matching the generated lists.
4. **i18n parity test**: identical key sets and `{placeholder}` sets across the 4 message files.
5. **De-vacuum** existing tests (assert presence instead of skipping; remove fallback-satisfying validity asserts in favour of the warn guard); widen real-content loops to all `AVAILABLE_BOOKS` where the assertion is book-agnostic.
6. ~~vitest `.tsx` include~~ — dropped (no jsdom; would do nothing).

### WS5 — repo hygiene & docs
Remove `package-lock.json`; add `"engines": { "node": "22.x" }` (`>=22` would make Vercel pick the newest major). Docs: CONTRIBUTING (CI is part of the gate; trailer wording), playbook B.1 (lists generated; activation test now covers all touchpoints), PENDING, EXECUTION_HISTORY, LAUNCH_PROGRAM progress.

## 4. Non-goals (deferred, recorded)
shellcheck on `scripts/` · `noUncheckedIndexedAccess` · promoting warn-only rules (§0.3d, §0.1-v3.3, §0.10–§0.13) · the conservation gate's value-level comparison (partly covered by WS3 snapshot + WS4.2) · content fixes beyond the classes a new guard requires.

## 5. Execution order
WS5 lockfile/engines → WS1 CI (commit early so every later commit is checked) → WS3 labels (with snapshot) → WS2 lint (fix → guard) → WS4 tests → docs → full gate locally + CI green → served-HTML smoke (labels render unchanged) → 5-reviewer implementation review → fixes → merge.

## 6. Acceptance criteria
- CI green on the PR (all five gate steps on GNU/Linux).
- `pnpm test` passes with the new tests; conservation unchanged (408 / 20,599).
- Label snapshot diff = 0 across all content; new negation tests pass.
- content-lint passes; every generated list non-empty; stderr not suppressed.
- Parity test passes with `KNOWN_GAPS` = exactly the 10 entry gaps + 11 label-count gaps (file × locale).
- People-data snapshot diff contains only the intended alias/fallback fixes (each listed in the PR).
- Lint passes under macOS bash 3.2 and CI bash 5.2.
- Removing a book from any touchpoint, or injecting a defect of each guarded class, makes the gate fail (spot-proven by injection).

## 7. Risks
| Risk | Mitigation |
|---|---|
| GNU vs BSD grep behaviour differs → CI red or silently different | CI is the arbiter; `LC_ALL=C.UTF-8`; perl for Unicode-sensitive rules; injection-test locally and on CI |
| Label matcher change alters a resolved label | Full-corpus before/after snapshot must be byte-identical |
| Removing stderr suppression surfaces noise | Fix the cause (empty glob, missing dir) rather than re-suppress |
| Parity test too strict / flaky | Deterministic counts only; explicit `KNOWN_GAPS`; no fuzzy matching |
| Removing `package-lock.json` breaks someone's npm flow | Project declares pnpm only; documented in CONTRIBUTING |

## 8. Rollback
Single PR; tooling/test-only except the 5 ES token fixes, the B11 alias, and the allow-list migration — all revertable by `git revert -m 1 <merge>`.

## 9. Effort
≈ 1.5–2 days (as scheduled in the program).

## 10. Plan review (independent adversarial review, 2026-11-19)

| # | Sev. | Finding | Resolution |
|---|---|---|---|
| F1 | blocker | Removing `2>/dev/null` doesn't fail the lint — pipeline status comes from awk | WS2.2: capture grep/perl status (≥2 = error) + injection tests |
| F2 | should | 10 companion gaps, not 9 (Gen 9 F5 PT-BR/ES) | KNOWN_GAPS by file × locale; D12 updated |
| F3 | should | `resolveField` substring fallback: Luke "divergence" → crossBookSee (row dropped), DE mis-/un-resolved labels, ES spouses | WS4.3 field-resolution fix + parity test + snapshot |
| F4 | should | People curiosities have 0 labels — guard would be vacuous | Asserted as future-only |
| F5 | should | 306 compound labels collapse to the first pair; label counts differ in 11 companions | Pinned by tests; policy → Step 4; label-count parity with known gaps |
| F6 | should | Matcher: skip-and-continue on negation; `\p{L}` lookbehind; diminishers (POCO/WENIG/KAUM) | WS3 updated (0 changes across 45 claim + 305 confidence distinct labels, per the reviewer's re-implementation) |
| F7 | should | perl §0.11 needs `-CSD` and the apostrophe | WS2.6 |
| F8 | should | Local bash 3.2 vs CI 5.2 | WS2.12 |
| F9 | should | CI: fonts need network; no `version` in action-setup; required checks | WS1 |
| F10 | should | §0.6 John-only; §0.3c sentence-initial precision routed from Step 1 | WS2.9 / WS2.10 |
| F11 | should | Strict parity breaks EN-first new-book branches | `PILOT_BOOKS` exemption + playbook |
| F12 | should | §0.1 v3.3 warning must exclude editorial logs | WS2.5 (content/ only) |
| F13 | nice | §0.3 fix leaves the same front-matter lines half-fixed | WS2.13 |
| F14 | nice | No independent verse counts beyond Genesis | WS4.2 expected counts for all books |
| F15 | nice | engines `22.x`; `.tsx` include useless; double scanning; 265 i18n keys; people-heading independence; chapter heading parity invalid | Folded in (WS5, WS4.6, WS2.11, WS4.2, WS4.1) |

Verified by the reviewer (no change needed): widened §0.3 = exactly 5 hits; widened legacy diacritics = 0; case-insensitive vosotros adds only Ps 82:6; no rule currently *relies* on stderr suppression; file sets, verse sequences and marker counts identical across locales; current lint passes unchanged on Ubuntu 24.04 (GNU grep 3.11, bash 5.2, C.UTF-8 and POSIX) with identical per-rule counts; lockfile valid for `--frozen-lockfile`.
