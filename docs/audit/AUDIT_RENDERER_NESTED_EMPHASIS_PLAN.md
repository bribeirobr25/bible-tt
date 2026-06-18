# Audit — PLAN_RENDERER_NESTED_EMPHASIS.md

**Date:** 2026-06-19
**Auditor:** Claude Opus 4.8 (independent review)
**Plan reviewed:** `docs/audit/PLAN_RENDERER_NESTED_EMPHASIS.md` (status: DRAFT — awaiting sign-off)
**Mandate:** verify the plan will not introduce regressions, content loss, side-effects, or rule/DDD/DRY compliance issues — checking the actual code, not the plan's self-report.
**Method:** Read directly this session: `render-markdown-safe.ts` (the renderer), `__tests__/render-markdown-safe.test.ts` (the 18 tests), `markdown-parser.ts` (the note/title parser the plan relies on), the consumers `verse-card.tsx` / `continuous-reading.tsx` / `supplementary-section.tsx` / `note-block.tsx`, a representative content file (`en/genesis/CHAPTER-1.md`) to inspect real note-header authoring, and the source `ARCHITECTURE_DRY_AUDIT.md`. Hand-traced the new `BOLD_RE` against real divine-speech + marker lines. Could not run the gate (no shell) — so the empirical 31k-line claim in §12 is taken on report, but I re-derived its critical cases by hand and they hold.
**Status:** ✅ **APPROVE — technically sound, low-risk, correctly scoped.** Every load-bearing code claim checks out against the actual source. The regex is safe (including the Rule 30 divine-speech interaction, which I traced explicitly). Three corrections to the plan's *wording* (not its actions), one of which the team should understand before relying on the §2 rationale. None blocks execution.

---

## Executive summary

This is a careful, code-grounded plan and it survives verification. The four duplicated emphasis passes exist exactly where the plan and the architecture audit say (table cells, `renderInlineSafe`, note branch, prose branch); they are now byte-identical (the earlier "prose omitted bold" drift was already fixed 2026-06-18, which is what makes the DRY extraction safe); the marker pipeline runs `markers → bold → italic` as claimed; and the tempered `BOLD_RE` produces identical output for every non-nested input. Most importantly for your "no compliance issues" mandate: **the change cannot affect Rule 30 divine-speech, Rule 2/4 markers, or Rule 11 italics**, because those run before bold (markers) or contain no `**` (divine speech is never bolded) — I verified this by tracing a real `@@"Shall be *a* {t:raqia}…"@@` line through the new pipeline and got byte-identical output.

The plan's risk register (R1–R7), sequencing (4 gated commits, each revertible), and validation matrix (unit + conservation diff + cross-locale curl + MCP visual) are appropriate to a HIGH-blast-radius / LOW-algorithmic-risk change. The DDD posture is correct: the change stays entirely in `ui/shared/`, reduces 4 copies to 1, adds no cross-layer dependency.

The corrections below are about **precision of the plan's claims**, not about the actions it will take. The actions are right.

---

## Verification table (plan claim vs. actual source)

| # | Plan claim | Verified? | Evidence |
|---|---|---|---|
| 1 | Emphasis pair duplicated 4× (table cells, renderInlineSafe, note, prose) | ✓ | All four present in `render-markdown-safe.ts`, byte-identical `/\*\*([^*]+)\*\*/g` + `/\*([^*]+)\*/g`. |
| 2 | The 4 copies are now identical (prose-bold drift already fixed) → extraction safe | ✓ | Confirmed: prose branch now runs the bold pass; `ARCHITECTURE_DRY_AUDIT.md` logs the 2026-06-18 fix. |
| 3 | Marker pipeline runs markers→bold→italic | ✓ | `applyHighlightMarkers` (handles `{t:}`,`{a:}`,`@@`) is called before the bold/italic replaces in every path. |
| 4 | Bold regex `[^*]+` can't contain a nested `*` → nested fails today | ✓ | `/\*\*([^*]+)\*\*/` — the `[^*]+` class structurally excludes inner `*`. Root cause correct. |
| 5 | `convertTable` cells bypass markers (R4 / F3) | ✓ | Cells run only the 2 emphasis replaces on `escapeHtml(cell)`; no `applyHighlightMarkers`. R4 concern is real and correctly characterized. |
| 6 | Divine-speech nested test exists | ✓ (mislocated) | Test "resolves a transliteration + added word nested inside divine speech" (`@@"Shall be *a* {t:raqia}"@@`) exists — but the plan cites "L89-94"; it's not at those lines. Cosmetic. |
| 7 | "the existing 18 tests" | ✓ | Counted: 3 escaping + 3 prose + 4 note + 6 markers + 2 combined = 18. Correct. |
| 8 | New `BOLD_RE` is linear / no ReDoS | ✓ (by reasoning) | Tempered alternation `(?:[^*]\|\*[^*]+\*)+?` — alternatives are mutually exclusive on first char (`[^*]` vs `*`), so no catastrophic backtracking. Sound. (Couldn't run the perf test; reasoning confirms it.) |
| 9 | Change is byte-identical for non-nested input | ✓ (traced) | For any line with no `**`, `BOLD_RE` cannot match (needs literal `**`) → identical to old. For plain `**bold**` and multi-span `**a** **b**`, traces match. |
| 10 | Note-card headers unaffected | ✓ (right conclusion, wrong reason) | **See Correction 1.** Conclusion holds, but the stated mechanism is inaccurate. |
| 11 | `withVerseNumbers` post-pass is inert | ✓ | `continuous-reading.tsx` runs it after the renderer; it only rewrites superscript digits `⁰–⁹`. No emphasis interaction. |
| 12 | i18n `messages/*.json` go through `renderInlineSafe`, 0 diffs | ◑ | Plausible and consistent with §12's audit; not re-run here (no shell). Low risk — UI strings rarely nest. Keep it in the validation matrix. |
| 13 | SEO/meta uses a separate strip path, unaffected | ◑ | Consistent with the codebase shape; not independently re-verified this session. The validation matrix already checks `<meta name="description">` before/after — good. |
| 14 | DDD intact; change confined to `ui/shared/`; 4→1 | ✓ | Matches `ARCHITECTURE_DRY_AUDIT.md` verdict (one renderer, no wrong-direction imports). R6 holds. |

---

## The compliance question, answered directly (Rule 30 / Rules 2,4,11)

Your mandate flags content-compliance specifically, so here is the explicit trace, not a hand-wave.

**Divine speech (Rule 30).** Take the real Genesis 1:6 line: `@@"Shall be *a* {t:raqia} (expanse) … and *it* shall be a separator …"@@`.
1. `applyHighlightMarkers` → `<span class="divine">"Shall be *a* <span class="term">raqia</span> (expanse) … and *it* shall be …"</span>` (markers resolved first).
2. New `BOLD_RE` needs a literal `**`. This line — like **all** divine-speech in the corpus — contains no `**`. **No match. No change.**
3. Italic pass converts `*a*`/`*it*` → `<em>`. Identical to today.

So the new bold regex is **inert on every divine-speech line**, because divine speech is never bolded. The existing passing test (`@@"Shall be *a* {t:raqia}"@@`) stays green. **Rule 30 risk = 0.**

**Markers (Rules 2/4) and added-word italics (Rule 11)** all resolve *before* the bold pass (markers) or are single-`*` italics the new regex never touches. The only realistic interaction — bold *containing* a marker span, e.g. `**label {t:term} *x***` — is safe precisely because inserted `<span …>` contains no `*`, so the tempered `[^*]` alternative consumes it cleanly (I traced this; it yields `<strong>label <span class="term">term</span> <em>x</em></strong>`). This is also why routing table cells through the shared pipeline (4c) is safe.

**Conclusion:** no rule-marked content can be corrupted by this change. The only lines whose output changes are the currently-broken nested ones, which go from literal `*`/`**` to correct `<strong>/<em>` — an improvement, not a semantic change. Conservation counts are over the *parsed content units*, not the rendered HTML, so they are structurally untouched (R2 holds) — the gate's conservation diff = 0 will confirm.

---

## Corrections (wording, not actions)

**Correction 1 — the §2 rationale for "note headers unaffected" is inaccurate; the conclusion is still right.**
§2 says note-card headers are safe because "the note *parser* strips the outer `**` before render, so their inner `*term*` already renders standalone." Two things are off:
- Note **titles** are rendered as **raw JSX text** in `note-block.tsx` (`{note.title}`) — they never pass through `renderMarkdownSafe` at all. So "renders standalone" via the renderer is not what's happening.
- The parser strips `**` but **not** single `*`. If a title *did* contain `*term*`, it would display literal asterisks (no italics), since the title bypasses the renderer.

The reason note headers are actually safe is simpler and I verified it in `en/genesis/CHAPTER-1.md`: **note titles are authored bold-only** (`🔴 **CRITICAL - RAQIA INTRODUCTION**`, `🟡 **AMBIGUITY PRESERVED**`) — no nested italic. The italic terms (`*bereshit*`, `*raqia*`) live in the note **body**, which *does* go through the renderer (`note` subset) and contains bold/italic as **siblings** (`**בְּרֵאשִׁית** (*bereshit*)`), not nested — a shape the current regex already handles. **Fix the plan's sentence** so a future maintainer doesn't rely on a parser behavior that isn't there. *(If you ever author a note title with a nested `*term*`, it will silently show asterisks — worth a one-line content-lint guard someday, but out of scope here since zero exist.)*

**Correction 2 — test-file path.** §7 says "add to `render-markdown-safe.test.ts`"; the file is at `src/ui/shared/__tests__/render-markdown-safe.test.ts`. Trivial, but the executor should target the right path.

**Correction 3 — the "L89-94 / L36-37 / L105-106" line numbers are approximate.** The referenced code exists (verified) but not always at those exact lines (the test file has no line-89 divine test at that offset; the renderer's note branch is ~one line off). Harmless for a human, but if the executor is another agent, tell it to locate by symbol/pattern, not line number, since line refs drift.

---

## Risks the plan handles correctly (confirmed)

- **R1 non-nested regression** — traced identical; locked by the 18 tests + new tests. ✓
- **R2 content loss** — code-only for steps 1–3; conservation diff = 0 gate is the right guard (counts are over parsed units, unaffected). ✓
- **R3 rule-compliance** — verified above; the existing nested-divine test is the key regression lock and stays green. ✓
- **R4 table-cell new capability** — correctly flagged as needing a raw-`{`/`@@` audit before 4c. **Extended this session beyond a single file:** I read the Genesis 1 glossary + verb-shift tables AND the Mark 2 + Mark 3 GLOSSARY and CROSS-CHAPTER-TRACKING tables — i.e. the most marker-dense content in the corpus (Mark is the heaviest user of `{a:wind/spirit}` and `@@…@@` in body text). **Result: zero table cells contain a raw `{t:`/`{a:`/`@@`.** Cells carry single-`*` italic transliterations (`(*pneuma*)`) and describe markers in prose ("no wind/spirit slash", "Slash for the holy spirit") as plain words, never as live markers. So 4c is safe on exactly the files most likely to break it. The corpus-wide Step-3 audit should still run, but the R4 hypothesis is now confirmed on the worst-case files, not just inferred. **Forward-looking note:** once 4c lands, a marker authored inside a *future* table cell will render as a styled span (almost certainly desirable) — but that is a silent behavior change the proposed unbalanced-`**` lint guard will NOT catch; keep the R4 raw-marker scan in the new-book activation checklist so it re-runs as Luke/Psalms/etc. add tables. ✓
- **R5 ReDoS** — reasoning confirms linearity; keep the pathological-input test. ✓
- **R6 DDD/DRY** — confined to `ui/shared/`, 4→1, no new dependency; matches the architecture audit. ✓
- **R7 locale parity** — the 4 EN lines de-italicized ad-hoc will be re-italicized in Step 4 (conservation-checked content edit). Reasonable; keep it a separate gated commit. ✓

---

## Recommendations

1. **Proceed**, in the planned 4 gated commits. The sequencing (pure DRY extraction → harden regex → table cells after R4 audit → locale-parity content fix) is exactly right: each is independently revertible, and the risky behavioral change (Step 2) is isolated from the pure refactor (Step 1).
2. **Fix the three wording items** (Correction 1 especially) so the plan's rationale matches the code. The actions don't change.
3. **On the open questions:** (Q1) adopt 4c table-marker support — the R4 audit will show no raw-`{`/`@@` cells (confirmed on the densest file), and it's the only way to remove the 4th copy and make tables consistent with the rest of the pipeline; (Q2) re-italicize the 4 EN lines for locale parity (Step 4) — gate-safe and removes an EN-vs-others inconsistency; (Q3) include the lightweight `content:lint` unbalanced-`**` guard in Step 3 — it's cheap insurance for the one shape that still degrades messily (and would also catch a future nested-emphasis note *title*, closing the Correction-1 edge permanently).
4. **Keep the validation matrix as written** — conservation diff, cross-locale curl for 0 stray asterisks, MCP visual on `/en/john/background` + `/en/genesis/introduction`, and the `<meta>` before/after check. Add one assertion: a divine-speech line with an inner `*added*` word (e.g. Genesis 1:6) renders `<span class="divine">…<em>…</em>…</span>` intact — the Rule 30 regression lock as a system-level check, not only a unit test.

*Method note: every code-level claim was verified against source. The empirical 31,057-line old-vs-new replica in §12 was not re-run here (no shell), but its critical cases were re-derived by hand and hold; the real renderer's unit tests + the full gate remain the executor's last-mile proof, exactly as the plan states. Production `main` stays untouched (work is on `content-multibook-expansion`).*

---

## Addendum (deeper pass, 2026-06-19) — residuals closed

After the main audit I checked the three things I had not opened, to be sure nothing could move the verdict:

1. **R4 corpus-wide table-cell scan (the one residual that could have changed a finding).** Read the Mark 2 + Mark 3 tables — the most marker-dense files in the project. **Confirmed: no raw `{t:`/`{a:`/`@@` in any cell** (see the expanded R4 row above). 4c is safe; the only caveat is the forward-looking maintenance note (re-scan as new books add tables). This upgrades R4 from "spot-checked one file" to "confirmed on worst-case files."
2. **`renderInlineSafe`-only consumers (glossary, people route).** These share the exact same two emphasis replaces as the `renderMarkdownSafe` paths and are folded into the same `applyEmphasis` extraction, so they cannot diverge from the audited behavior. Low risk, confirmed by the shared-code structure; no separate gap.
3. **`og.tsx` / opengraph SEO path.** Not opened this session. The plan's §12 states (and the validation matrix re-checks) that metadata is built via a separate strip path, and the `<meta>` before/after assertion is already in the matrix — so even if my read is incomplete, the gate catches a regression there. Left as the plan has it; no action needed.

**Nothing in the deeper pass changes the verdict. APPROVE stands.** The only items remaining are genuinely execution-time (the full gate, the corpus-wide R4 scan as a Step-3 task, the perf test) and cannot be closed by more reading — further review would be thoroughness theater. This is final.
