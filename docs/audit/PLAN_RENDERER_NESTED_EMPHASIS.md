# Execution Plan — Tier 1: Renderer Nested-Emphasis Hardening

**Date:** 2026-06-19 · **Status:** APPROVED by external audit (`AUDIT_RENDERER_NESTED_EMPHASIS_PLAN.md`, 2026-06-19) — all load-bearing code claims verified against source; 3 wording corrections applied (note-header mechanism §2/§3, test-file path §7, locate-by-symbol-not-line-number §7); R4 strengthened (confirmed zero raw markers in the densest Mark tables) + Rule-30 system-level assertion added. Awaiting project-lead sign-off on the 3 open decisions (§11) before code changes. **Branch:** `content-multibook-expansion`. **Source items:** `ARCHITECTURE_DRY_AUDIT.md` (F1) + `PENDING.md §5` (nested-`**…*x*…**`). **Risk class:** HIGH blast radius (the single pipeline all content flows through), LOW algorithmic risk (one tempered regex + a pure DRY extraction, proven below).

---

## 1. Objective & success criteria

Make `render-markdown-safe` render **one level of italic nested inside bold** (`**label *term*:**` → `<strong>label <em>term</em>:</strong>`) so the ~96 authored lines that currently emit literal `*`/`**` render correctly, **and** collapse the 4 duplicated emphasis passes into one helper so the behavior can't re-drift.

**Done when:**
- The ~96 affected content lines (all 4 locales) render with **0 stray `*`/`**`** and correct `<strong>`/`<em>` nesting.
- All existing behavior is **byte-identical** for non-nested content (verified by the existing 18 tests + new tests + cross-locale curl).
- Conservation counts unchanged (no content loss); `pnpm test · lint · build · content:lint` green; MCP visual clean on the worst-affected pages.
- The 4 emphasis copies become 1 (`applyEmphasis`), in the correct layer (`ui/shared`).

**Explicit non-goals (out of scope for Tier 1):** the `parseConfidence`/`parseClaimType` parser drifts (Tier 2 `labels.ts`); `confidence-tone`/`<Disclosure>` consolidation (Tier 2/3); `convertTable` hardcoded-Tailwind lift (Tier 3, F4); redundant `Name (Name)` pass (Tier 4).

---

## 2. Root cause (code-grounded)

`src/ui/shared/render-markdown-safe.ts` applies emphasis with `[^*]`-bounded regexes:
- bold `/\*\*([^*]+)\*\*/g` — the content class `[^*]+` **cannot contain a nested `*`**, so `**a *b* c**` never matches as bold; the subsequent italic pass then mis-pairs the surviving asterisks → literal `*`/`**` on screen.
- The pair is **duplicated 4×**: `convertTable` cells (L36-37), `renderInlineSafe` (L66-67), `renderMarkdownSafe` note branch (L105-106), prose branch (L110-111). (Pre-2026-06-18 the prose branch omitted bold entirely — that drift is already fixed; the 4 copies are now identical, which makes extraction safe.)

The emoji **note-card headers are unaffected** — verified mechanism (corrected per external audit 2026-06-19): a note **title** is rendered as **raw JSX** (`note-block.tsx:24` `{note.title}`) and never passes through `renderMarkdownSafe` at all; titles are authored **bold-only** (`🔴 **CRITICAL - RAQIA INTRODUCTION**`), with no nested italic. The italic *terms* live in the note **body** (which *does* go through the `note` subset) as **siblings**, not nested (`**בְּרֵאשִׁית** (*bereshit*)`) — a shape the current regex already handles. So this change neither affects note titles (they bypass the renderer) nor alters note bodies (sibling bold/italic is unchanged by the tempered regex). *(Caveat: because titles bypass the renderer, a note title authored with a nested `*term*` would show literal asterisks — zero exist today; the Step-3 `content:lint` guard would also catch this, closing the edge permanently.)*

---

## 3. Affected-content inventory (measured 2026-06-18/19)

96 non-note nested lines, evenly spread across locales (en 23 · de 25 · es 24 · pt-br 24):

| Surface | Count | Example |
|---|---|---|
| `CHAPTER-*.md` cross-ref / prose lines | 42 | `**Gen 2:4 / Gen 5:1 -> Matt 1:1 — *biblos geneseōs*:**` |
| `CONTEXT.md` (background pages) | 32 | `**John 1:5 — *katelaben***` (trailing-nest → the `***` form) |
| `INTRODUCTION.md` | 16 | `**The *waw*-consecutive system:**` |
| companion `study/*.md` | 6 | residual bold labels with a term |

All are the **"bold lead-in label with an italic term"** convention. The `***` substring found in ~20 files is **not** true bold-italic — it is the inner-italic-close abutting the bold-close at a label's end (`…*term***`). Confirmed buggy in production via curl on `/en/john/background` + `/en/matthew/background`.

---

## 4. Proposed solution

### 4a. Extract one `applyEmphasis` helper (DRY, no behavior change in this step)
```ts
function applyEmphasis(html: string): string {
  return html
    .replace(BOLD_RE, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}
```
Call it from all four sites. Order preserved: **markers → bold → italic** (markers already run first via `applyHighlightMarkers`). Bold must run before italic so the inner `*term*` is converted *after* the bold wrapper is in place.

### 4b. Harden the bold regex (the one behavioral change)
```ts
const BOLD_RE = /\*\*((?:[^*]|\*[^*]+\*)+?)\*\*/g;
```
A **tempered alternation**: bold content is a lazy sequence of either a non-asterisk char `[^*]` *or* a well-formed inner italic `\*[^*]+\*`. Because the two alternatives are mutually exclusive on their first char (`[^*]` vs `*`), there is **no ambiguity → linear time, no ReDoS**.

**Worked traces (the correctness proof):**
| Input | Bold capture | After italic pass | Verdict |
|---|---|---|---|
| `**bold**` | `bold` | `<strong>bold</strong>` | ✓ unchanged |
| `**The *waw* system:**` (mid-nest) | `The *waw* system:` | `<strong>The <em>waw</em> system:</strong>` | ✓ fixed |
| `**John 1:5 — *katelaben***` (trailing-nest) | `John 1:5 — *katelaben*` | `<strong>John 1:5 — <em>katelaben</em></strong>` | ✓ fixed |
| `***x***` (true bold-italic) | `*x*` | `<strong><em>x</em></strong>` | ✓ fixed |
| `**a** and **b**` (two spans) | `a`, then `b` | two `<strong>` | ✓ unchanged |
| `**a *b***` malformed-lone-`*` cases | (no match) | literal (same as today) | ✓ safe fallback |

Why the naive lazy `/\*\*(.+?)\*\*/` was rejected: on `**…*katelaben***` it stops at the *first* `**`, which falls inside the `***`, capturing `…*katelaben` and leaving a stray `*` that the italic pass then wraps around the `</strong>` tag. The tempered pattern consumes the inner `*term*` as a unit, so the bold close lands on the correct `**`.

### 4c. Route `convertTable` cells through `applyEmphasis`
Currently cells do their own 2-replace and therefore ignore the TT markers (`{t:}`/`{a:}`/`@@`). Routing them through the shared inline pipeline both removes the 4th copy and **adds** marker support in table cells. → This is a *new capability* in cells; see Risk R4 (must confirm no cell currently contains literal `{`/`@@` meant to display raw).

### 4d. Subset semantics unchanged
`note` keeps its `\n→<br/>` + `- → •`; `prose` keeps `\n→space`; only the emphasis step is shared. No consumer relied on prose-without-bold (that was the already-fixed drift).

---

## 5. Impact / blast-radius analysis

`renderMarkdownSafe`/`renderInlineSafe` have **~30 consumers** (every reading/study/enrichment surface + landing/books/rules/people/book routes). Ranked exposure:

- **High** — `continuous-reading` (verse prose), `verse-card` (mainText), `note-block`, `chapter-shell` overview, `enrichment-entry`, `book-context-view`, `context-view`: carry the affected labels and the most authored emphasis. Primary regression-watch surfaces.
- **Medium** — `prophecy-view`, `introduction-view`, `supplementary-section`, `people-card`, people route, book route.
- **Low** — landing/books/rules (i18n strings, simple/no nesting), glossary (already routes `translation` through `renderInlineSafe`).

Because the change is **purely additive for non-nested input** (every existing test input maps to an identical output per §4b traces), the expected regression surface is **only** the previously-broken nested lines (which improve) + table cells (R4).

---

## 6. Risk-specific gates (the four concerns)

| # | Risk | Mitigation / proof |
|---|---|---|
| R1 | **Regression in non-nested rendering** | §4b traces show identical output for plain bold/italic/multi-span; locked by the existing 18 tests + new tests; cross-locale curl diff on unaffected pages. |
| R2 | **Content loss** | Code-only change; **conservation counts must be byte-identical** before/after (gate). No `content/` edits in steps 1-3. |
| R3 | **Content-compliance (rules)** | Must not alter: Rule 11 `*added*` italics, Rule 30 `@@divine@@` (incl. nested `*added*` inside divine — existing test L89-94), Rule 2/4 `{a:}`/`{t:}` markers, dual-label `**[CLAIM — CONF]**` chips. All run *before* bold (markers) or are plain bold (labels) → covered by existing tests + new marker-with-nesting tests. No content semantics change — only previously-corrupted renders are corrected. |
| R4 | **Table-cell new marker support (4c)** | Audit all table cells for literal `{`/`@@`/`{t:` that are meant to display raw; if none (expected — markers are an authoring convention, not data), routing is safe. If any exist, keep cells on a bold+italic-only path. **External audit (2026-06-19) confirmed on the worst-case files:** the Mark 2 + Mark 3 GLOSSARY/CROSS-CHAPTER-TRACKING tables (the most marker-dense in the corpus) + Genesis 1 tables contain **zero raw `{t:`/`{a:`/`@@` cells** — markers appear only as described prose words. Still run the corpus-wide scan in Step 3. **Forward-looking:** once 4c lands, a marker authored in a *future* table cell renders as a styled span (a silent, desirable change the unbalanced-`**` lint won't flag) — so add the R4 raw-marker scan to the **new-book activation checklist** (re-runs as Luke/Psalms/etc. add tables). |
| R5 | **ReDoS / perf** | Tempered alternation is unambiguous → linear; add a long-pathological-input unit test (e.g. `'*'.repeat(5000)`) asserting fast return. |
| R6 | **DDD/DRY** | Change stays entirely in `ui/shared/render-markdown-safe.ts` (correct presentation layer); reduces 4 copies → 1; no new cross-layer dependency. |
| R7 | **EN-vs-other-locale parity** | The 4 EN content lines de-italicized ad-hoc on 2026-06-18 will, post-hardening, look *less* rich than their still-italic de/es/pt-br parallels. Step 4 re-italicizes them so all locales match (small, content edit, conservation-checked). |

---

## 7. Validation matrix

> **Executor note (per external audit):** locate edit sites by **symbol/pattern**, not the line numbers cited in this plan — line refs (e.g. the §4b `BOLD_RE` site, the divine-speech test) are approximate and drift. The test file is at `src/ui/shared/__tests__/render-markdown-safe.test.ts`.

**Unit tests (add to `src/ui/shared/__tests__/render-markdown-safe.test.ts`):**
1. mid-nest `**a *b* c**` → `<strong>a <em>b</em> c</strong>`
2. trailing-nest `**a *b***` → `<strong>a <em>b</em></strong>`
3. true triple `***x***` → `<strong><em>x</em></strong>`
4. plain bold / multi-span / italic-only → unchanged (regression lock)
5. marker + nest: `**see {t:raqia} *here***` and divine `@@"… *a* {t:raqia}"@@` (extend existing) → spans intact
6. table cell with `**x**`/`*x*` (+ a `{t:}` if 4c adopted) → correct
7. malformed/unbalanced (`**a *b**`, lone `*`) → safe literal fallback, no tag corruption
8. ReDoS: long input returns < a few ms

**Integration / system:**
- `pnpm test · lint · build · content:lint` green.
- **Conservation diff** = 0 (no unit-count change).
- **Cross-locale curl** (en/de/es/pt-br): the 96 lines → assert `0` literal `*`/`**` in the rendered (RSC-stripped) HTML on `/{loc}/john/background`, `/{loc}/matthew/background`, `/{loc}/genesis/introduction`, and ≥2 chapter Read pages with cross-ref labels.
- **MCP visual** screenshots of `/en/john/background` + `/en/genesis/introduction` (the worst offenders) confirming bold+italic labels, no asterisks, layout intact.
- **i18n strings** (`renderInlineSafe` consumer): re-run the old-vs-new diff over `messages/*.json` (must stay 0 diffs — §12); spot-check `/{loc}/rules` + landing render unchanged.
- **SEO/meta** (separate strip path): confirm `<meta name="description">` on a chapter page is unchanged before/after (no new `*`/`**`).
- **Rule 30 system-level lock** (per external audit): assert a real divine-speech line with an inner `*added*` word (e.g. Genesis 1:6) renders `<span class="divine">…<em>…</em>…</span>` intact on the live page — the Rule-30 regression lock as a *system* check, not only a unit test.

**Optional regression guard:** a `content:lint` check that flags *unbalanced* `**`/`*` in body lines (the only remaining unsupported shape post-hardening). Lightweight; decide during Step 3.

---

## 8. Sequencing (small, independently-gated commits)

1. **Refactor only** — extract `applyEmphasis` (old regex), call from all 4 sites. No behavior change. Gate + conservation green. *(Pure DRY; reviewable in isolation.)*
2. **Harden** — swap in `BOLD_RE` (tempered) inside `applyEmphasis`; add unit tests 1-5,7,8. Gate + cross-locale curl + MCP visual.
3. **Table cells** — route `convertTable` cells through `applyEmphasis` after the R4 audit; add test 6.
4. **Locale parity (content)** — re-italicize the 4 EN ad-hoc fixes (john ch1 §B4/§IB-7, genesis ch2 §D, john ch3 §); conservation-checked. Update `ARCHITECTURE_DRY_AUDIT.md` (mark these "active" items closed) + `PENDING.md §5` (remove the nested-emphasis item).
5. **Log** — `docs/editorial-log/` if any content changed (step 4); refresh `EXECUTION_HISTORY.md`.

Each step is a separate commit behind the full gate; stop/rollback at any step without affecting the prior one.

---

## 9. Rollback

Each step is one commit on `content-multibook-expansion`; `git revert` of step N restores the prior gate-green state. Step 1 (refactor) and Step 2 (hardening) are separable, so a problem found in hardening reverts to the clean extraction without losing the DRY win. No data migration, no schema, no content deletion → rollback is pure code revert.

---

## 10. Definition of done

`pnpm test` (incl. new emphasis tests) · `lint` · `build` · `content:lint` green · conservation diff = 0 · cross-locale curl shows 0 stray asterisks on the 96 lines · MCP visual clean on background + introduction · audit/PENDING docs updated · production `main` untouched (stays on `content-multibook-expansion` pending the Phase-cutover decision).

---

## 11. Open questions for project-lead

1. **Adopt 4c (table-cell marker support) now or defer?** It removes the 4th copy but introduces a new cell capability (R4). Recommend: yes, after the R4 audit shows no raw-`{`/`@@` cells.
2. **Step 4 locale parity** — re-italicize the 4 EN lines (recommended, for consistency) or leave them de-italicized? Either is gate-safe.
3. **content:lint unbalanced-`**` guard** — *promoted to recommended* by the §12 audit (the unbalanced fallback degrades messily, though 0 instances exist today). Include in Step 3.

---

## 12. Pre-execution audit — empirical validation (2026-06-19)

Rather than trust the §4b hand-traces, the proposed `applyEmphasis` (markers → tempered bold → italic) was reproduced faithfully in Node and run **old-vs-new over the entire corpus**. Results:

**Content corpus (`content/**/*.md`):**
- **31,057** lines containing `*` scanned.
- **1,025** lines change old→new, and **every one is a stray-asterisk fix** (old emitted literal `*`/`**`, new is clean). *(1,025 > 96 because the replica also processes note-header lines that the live parser strips before render; the 96 are the body-prose subset — both are fixed, neither regresses.)*
- **OTHER diffs (non-fix behavior change): 0.** ← empirically proves the plan's core claim "purely additive for non-nested input."
- **NEW introduces a stray `*` where OLD had none: 0.**
- **Invalid/unbalanced HTML in NEW output (proper tag-tree validator over em/strong/span): 0.**

**Spot checks (all correct):** `**a *b* c**`→`<strong>a <em>b</em> c</strong>` · trailing-nest `**John 1:5 — *katelaben***`→`<strong>John 1:5 — <em>katelaben</em></strong>` · `***x***`→`<strong><em>x</em></strong>` · `**a *b* c *d***` (multi) ✓ · plain/italic/no-emphasis unchanged. Malformed `**unbalanced *x**`→`*<em>unbalanced </em>x**` (messy but no real content hits it → motivates the Step-3 lint guard).

**i18n UI strings (`messages/*.json`, a `renderInlineSafe` consumer I'd missed):** 33 strings with `*`, **0 old-vs-new diffs** → UI strings entirely unaffected. *(Gap found and closed during this audit; added to scope/validation.)*

**SEO / metadata / OG:** `generateMetadata` builds descriptions via a **separate markdown-strip path**, not the visible renderer — verified clean in the built `<meta name="description">` ("What happens: God creates…", no `**`). Out of scope and **unaffected** by this change.

**ReDoS / performance:** the tempered alternation is unambiguous (mutually exclusive first char) → linear; measured **0.04–0.29 ms on 20k–80k-char pathological inputs** (real lines are <1k). Non-issue.

**Residual items still unproven by this audit (verify during execution, as planned):** (a) the `convertTable` cell path — R4 audit + table tests in Step 3; (b) `withVerseNumbers` post-pass — operates on already-rendered HTML, expected inert; (c) the replica mirrors the source regexes exactly, but execution must re-prove via the real renderer's unit tests + the full gate.

**Audit verdict:** the technical approach is sound and the regression/compliance risk for steps 1–2 is empirically near-zero. Proceed, with the table path (4c) treated as its own gated step.
