# Plan — Tier 4 Strand 3: redundant `Name (Name)` content pass (v3.3.1)

**Date:** 2026-06-20 · **Status:** ✅ EXECUTED 2026-06-20 — 118 redundant `Name (Name)` removed (114 ASCII + 4 accented-capital `Ägypten`); content-lint §0.11 cleared; gate green, conservation 11831. The 16 lowercase `kyrios (kyrios)` (templated Divine-Name-Policy metadata) flagged for a separate decision (term, not a Name; possibly a mangled `kyrios (κύριος)`). **Branch:** `tier4-name-dedup` off `main`. **Source:** `PENDING.md` §5 + RULES-HB v3.3.1 ("never produce redundant `Name (Name)`"). **Risk class:** LOW-MED — a **content** change (visible text in tables/prose), but mechanical + rule-mandated; no code change.

## Finding (investigation 2026-06-20)
114 `X (X)` identical-doubling occurrences across 28 files — **all genuine v3.3.1 redundancies**. The `\(\1\)` pattern only matches *identical* pairs, so the feared "intentional comparison-cell" exception (e.g. `Lamech (Cainite)`) **cannot** be matched — there are no false positives. Breakdown: 32 PEOPLE `## Name (Name)` headings · 48 table cells · 34 prose. By locale: **de 88 · es 12 · en 10 · pt-br 4** (the project already flags these via `content:lint §0.11` DE-parens warn + `§0.8` heading-collision warn).

## Fix
Mechanical per-file replace `([A-Z][\w'’.-]+) \(\1\)` → `\1` (collapse the doubling to a single occurrence). Language-agnostic (removes a duplicate, not a translation).

## Why it's safe per category
- **PEOPLE headings (render-equivalent):** people-parser parses `## Name (Familiar)` → `name` + `familiarName`; person-card renders `familiarName` only when `!== name` (already suppressed for `X (X)`). Removing `(X)` → `familiarName` undefined → **rendered output identical**; conservation tracks `name` (unchanged).
- **Tables/prose (visible cleanup):** removing the redundant `(X)` is the intended v3.3.1 fix; conservation gate recomputes text multisets from the parse (symmetric) and unit counts are unchanged → conservation stays 11,831.

## Guards
- `pnpm test · lint · build · content:lint` green; **conservation 11,831 unchanged**.
- **`content:lint §0.11`/`§0.8` warnings clear** (the redundancies they track are removed) — a positive signal.
- **grep confirms 0 remaining `X (X)`** post-pass.
- Render check: PEOPLE pages byte-identical (headings); a table/prose page shows *only* the paren removed.
- All content ships `provisional` (Rule 28) as usual; log in editorial logs.

## Steps
1. Capture baseline render of affected PEOPLE pages (headings render-equivalence).
2. Mechanical replace across `content/**/*.md`; print per-file change count.
3. Validate: gate · conservation · §0.11/§0.8 cleared · 0 remaining · render check.
4. Editorial log (genesis/john/matthew) + EXECUTION_HISTORY + PENDING.
5. Commit → PR → merge on authorization.

## Open question
None blocking — this is rule-mandated redundancy removal, sanctioned by the project's own §0.11 warn. (If you'd rather restrict to EN now and leave de/es/pt to locale editors, say so; default = all locales, since it's compliance cleanup, not translation.)

---

## Addendum — `kyrios (kyrios)` metadata fix (analysis-grounded, 2026-06-20)

**Investigation (not a guess).** The `kyrios (kyrios)` doublings are in the **Divine-Name-Policy chapter-metadata line** (GS books). The corpus has two forms of this line:
- **Canonical (12 chapters):** `… Option C — κύριος (kyrios) rendered as "the Lord" …` — Greek script + transliteration, i.e. the RULES-GS "**Source-script (Transliteration)**" convention. Present in en/john 1-3, de/john 1-3, pt-br/john 1-3.
- **Mangled (16 chapters):** `… Option C — kyrios (kyrios) …` — the Greek `κύριος` was replaced by the transliteration, producing the redundant doubling. In: en mark 1-3 + matthew 1-3; de matthew 1; es john 1-3 + matthew 1-3; pt-br matthew 1-3.

**Therefore the correct fix is NOT "collapse to `kyrios`"** (that would lose the Greek script and *diverge from* the 12 canonical chapters). It is to **restore `κύριος (kyrios)`** — making all GS Divine-Name-Policy lines consistent with the established convention.

**Fix:** per-file replace the exact substring `kyrios (kyrios)` → `κύριος (kyrios)` (only the leading bare `kyrios`; the parenthetical translit + the locale prefix + the rest of the sentence are untouched). 16 occurrences, 1 per file.

**Safety / compliance:**
- **Not rendered:** `divineNamePolicy` metadata has no UI consumer (verified) → zero visual change; this is a data-consistency correction.
- **Conservation:** chapter *metadata* isn't a tracked conservation unit (verse/note/paragraph/glossary/… are) → 11,831 unchanged.
- **Rules:** restores the RULES-GS Source-script (Transliteration) form; κύριος (UTF-8 Greek) already exists in 12 chapters, so encoding is proven.
- **Scope honesty:** this is a *term + restore-script* metadata fix, distinct from the `Name (Name)` removals above — logged separately.

**Guards:** `pnpm test · lint · build · content:lint` green · conservation 11,831 · grep shows **0 `kyrios (kyrios)`** and **28 GS chapters all `κύριος (kyrios)`** · diff-integrity: only the Divine-Name-Policy line changed, only `kyrios`→`κύριος`.
