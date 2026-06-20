# Plan — GS/HB Methodology-Stamp Re-stamp to v3.4 (verify-then-stamp)

**Status:** PLANNED (awaiting sign-off) · **Date:** 2026-06-20 · **Class:** content metadata + compliance verification · **Risk:** Low (mechanical bump) / Medium (the honesty claim it makes)

> **Self-audit disposition (2026-06-20) — verified against source; findings folded in:**
> 1. **`@@"…"@@` is the reading-guide LEGEND, not real speech** — it sits in every chapter's Reading Guide (`- @@"…"@@ — direct speech of God or Yeshua (Jesus)`). It inflates each chapter's raw `@@` count by exactly 2 (one span). So **real divine-speech spans = (`@@`-count ÷ 2) − 1.** Verification math must subtract it; an executor must not "fix" a chapter whose only `@@` is the legend.
> 2. **The Rule-30 legend requirement is ALREADY met** — present in **75/75** main chapters (verified). One Phase-0 item is therefore already green.
> 3. **Semantic correctness is pre-validated by spot-check** (not just assumed): Matthew 1/2 have **0 real marks** → the *malakh* is correctly excluded; Genesis 3 marks God's speech but **not** the serpent or Eve quoting God; Matthew 3 marks Yeshua + the Bat Qol. So the marks observe Rule-30 scope in every case sampled.
> 4. **All marker types (`@@`, `{t:}`, `{a:}`) have full cross-locale count parity** (e.g. genesis-1 = `{t}=19 {a}=3` in all four locales), confirming systematic, complete application — not just `@@`.
> 5. **The rollout was logged** (genesis.md + mark.md). *Gap:* john.md / matthew.md carry no explicit Rule-30 entry — a minor documentation backfill (Phase 4), not a content gap.

---

## 1. Problem

Every chapter file carries a `Methodology:` metadata line (L9) stamping the ruleset version that governs it. The current project ruleset is **v3.4 / 30 rules** (v3.4 added **Rule 30 — divine-speech marking** + the **Text-Highlight Markers** convention `*added*` / `{t:…}` / `{a:…}` / `@@…@@`). But:

- **3 chapters** are stamped current: `30-Rule … (Ruleset v3.4)` — only `en/mark` 1–3 (authored fresh after v3.4 landed).
- **72 chapters** are stamped stale: `… v3.3` (29-Rule) — *all* of Genesis (1–12), John (1–3), Matthew (1–3), in **all four locales**.

The stamp is a **truth claim** ("this chapter is governed by ruleset vX"), so a blind number-bump is dishonest unless the chapters actually implement what v3.4 added. **Interpretation chosen by project lead (2026-06-20):** the stamp means "**latest project ruleset**" → re-stamping is correct, but only after confirming Rule 30 + markers compliance; it overlaps the pending Rule-28 sign-off and should ride with it.

## 2. Key finding from analysis (changes the cost calculus)

**The v3.4 content features are ALREADY applied across all 72 stale-stamped chapters** — only the stamp was missed. Evidence (verified 2026-06-20):

- `@@…@@` divine-speech marks are present throughout: e.g. `en/genesis/CHAPTER-1` has **50 `@@`** (25 spans, of which 24 real + 1 legend) + **19 `{t:}`** + **3 `{a:}`**; `en/john/1` has 34 `@@` + 15 `{a:}`. Gen 1 reads `@@"Shall be light,"@@`, `{a:wind/spirit}`, `{t:raqia}` — exactly the v3.4 convention.
- **All three marker types have identical counts across all four locales** for every chapter (`@@`: genesis c1=50/c2=12/…, john 34/22/44, matthew 2/2/10; `{t:}`/`{a:}`: genesis-1 19/3, genesis-3 1/9, john-1 0/15 — same in en/pt-br/de/es) → applied systematically and completely, not piecemeal. (Marker *content* is localized, e.g. `{a:wind/spirit}` → `{a:viento/espíritu}`; only the *count* is the parity signal.)
- **Every `@@` count is even** → no unbalanced markers corpus-wide.
- **Each chapter's Reading Guide carries the marker legend** (incl. the `@@"…"@@` example) — the Rule-30 legend requirement — in all 75 main chapters.
- **Semantic spot-check passes Rule-30 scope:** God/Yeshua/Bat-Qol marked; *malakh*, serpent, and human-quoted-divine-speech correctly **not** marked (see audit note 3).
- The renderer (`render-markdown-safe.ts`) already converts `{t:}`/`{a:}`/`@@` → styled spans; markers are render-time, so they do **not** touch stored text or the conservation layer (Rule 30 + markers convention both state this).

**Conclusion:** this is **verify-then-stamp**, not apply-from-scratch. The heavy lifting (authoring markers across the corpus) happened during the 2026-06 cycle; the stamp bump is the cleanup that was forgotten.

## 3. The honesty principle (what the stamp does and doesn't assert)

- **Stamp = ruleset version that governs** (which features apply). It is **orthogonal to review status**: `en/mark` is *both* `v3.4` *and* `provisional`. So bumping to v3.4 does **not** claim "human-signed-off"; the `Status: provisional` line independently tracks that.
- **What the bump legitimately asserts:** the chapter implements the v3.4 feature set (Rule 30 marks + the four markers). Marker *presence + balance + cross-locale parity* (Phase 0) substantiates this.
- **What the bump does NOT assert and must NOT silently imply:** that every individual `@@` span is *semantically* correct per Rule 30's narrow scope (only YHWH/God/Yeshua/Spirit; *malakh YHWH* and human-quoted-divine-speech excluded). Exhaustive per-span correctness is **Rule-28 human sign-off** territory — the content stays `provisional` until then regardless of this stamp.

## 4. Scope

- **In scope:** the `Methodology:` L9 stamp on the **72 v3.3 chapter files** (18 × 4 locales: genesis 1–12, john 1–3, matthew 1–3). Bump `29-Rule … v3.3` → `30-Rule … v3.4` in each locale's wording.
- **Out of scope:** `en/mark` (already v3.4); study/companion, INTRODUCTION, PEOPLE files (**carry no stamp** — verified 0); the markers themselves (already applied — this plan does not author new marks); the Rule-28 human semantic sign-off (separate, pending).

### Exact replacement strings (uniform — one per locale, verified)
| Locale | From (×18) | To |
|---|---|---|
| en | `**Methodology:** 29-Rule Governance System (Ruleset v3.3)` | `**Methodology:** 30-Rule Governance System (Ruleset v3.4)` |
| pt-br | `**Metodologia:** Sistema de Governança de 29 Regras (Conjunto de Regras v3.3)` | `…de 30 Regras (Conjunto de Regras v3.4)` |
| de | `**Methodik:** 29-Regeln-Governance-System (Regelwerk v3.3)` | `**Methodik:** 30-Regeln-Governance-System (Regelwerk v3.4)` |
| es | `**Metodología:** Sistema de Gobernanza de 29 Reglas (Reglas v3.3)` | `…de 30 Reglas (Reglas v3.4)` |

(EN target validated byte-for-byte against `en/mark`'s existing v3.4 stamp.)

## 5. Execution phases

**Phase 0 — Structural verification (AI-automatable; results from self-audit shown):**
- `@@` balance even corpus-wide — ✓ verified (0 odd). Re-confirm at execution.
- Cross-locale `@@`/`{t:}`/`{a:}` count parity per chapter — ✓ verified (full parity; would catch any lagging locale).
- Reading-Guide legend present — ✓ verified (75/75 main chapters).
- `pnpm build` renders every chapter; spot-check served HTML across 4 locales for **no literal `@@`/`{t:}`/`{a:}`** leaking (renderer resolves them) — run at execution.
- **Legend math:** real divine spans = (`@@`÷2)−1. A chapter whose only `@@` is the legend (e.g. matthew 1/2, genesis 5/10 — genealogy/no-divine-speech chapters) is **correct as-is**; do not flag it as "missing marks."

**Phase 1 — Semantic spot-check (already substantially done; broaden the sample):**
- Self-audit confirmed Rule-30 scope holds in every case sampled: Matthew 1/2 = 0 real marks (*malakh* excluded ✓); Genesis 3 marks God but **not** serpent/Eve-quoting-God ✓; Matthew 3 marks Yeshua + Bat Qol ✓.
- At execution, broaden to a few more spans per book/locale (e.g. Gen 1 "Let us make…", a John Yeshua discourse, confirm no narration/human marked). This is a *confidence sample*, not exhaustive.
- Any anomaly → log as a **Rule-28** review item (do **not** silently re-mark unless an unambiguous, uncontested error). Exhaustive per-span correctness is explicitly deferred to the human Rule-28 sign-off.

**Phase 2 — Stamp bump:** per-locale exact-string replace across the 72 files (Python, UTF-8). 1 occurrence per file.

**Phase 3 — Validate (gate).** See §6.

**Phase 4 — Docs:** EXECUTION_HISTORY entry; PENDING (close the stamp-drift item); editorial-log note per book — **including a backfill Rule-30 entry in john.md + matthew.md** (currently only genesis.md + mark.md log the rollout); refresh the CLAUDE.md scope/ruleset line if needed (it already says "RULES-CORE v3.4"). Note the Rule-28 dependency for semantic sign-off.

## 6. Validation gate
| # | Check | Pass |
|---|---|---|
| G1 | `grep` for `v3.3`/`29-Rule` (+ locale variants) in chapter stamps | **0** remaining |
| G2 | chapters stamped v3.4/30-Rule | **75** (72 + en/mark 3) |
| G3 | diff stat | 72 files, 72 ins / 72 del; **only L9 changed** in each |
| G4 | diff content | only `29→30` + `v3.3→v3.4` on the Methodology line; no other token touched |
| G5 | `pnpm test` + conservation | green; **11,831 units unchanged** (stamp is metadata, markers render-time) |
| G6/G7/G8 | lint · content:lint · build | clean; content:lint warning count unchanged |
| G9 | served-HTML spot-check (fresh dev server, 4 locales) | markers render as styled spans; **no literal `@@`/`{t:}`/`{a:}`** leaks; legend present |

## 7. Risks & rollback
- **Risk:** the bump over-claims if a chapter's marks are semantically wrong. *Mitigation:* Phase 1 spot-check + the honesty principle (§3) — stamp = version, `provisional` stays until Rule-28. **Decision point (§8).**
- **Risk:** a locale silently lagging on markers. *Mitigation:* Phase 0 cross-locale parity (current data shows full parity).
- **Rollback:** single-line metadata on a feature branch — `git revert` / `git checkout content/`. No code, no schema, no render dependency.

## 8. Open decision for project lead (one)
**When does the stamp bump land?**
- **(A) Now (recommended).** The v3.4 *features* are demonstrably implemented (Phase 0/1); the stamp tracks *ruleset version*, which is orthogonal to `provisional` (as `en/mark` proves). Bump now; semantic per-span correctness continues under the already-pending Rule-28 sign-off. Gets the corpus internally consistent immediately, claims nothing about human review.
- **(B) Ride with Rule-28.** Hold the bump until the human source-scholar signs off, so "v3.4" and "reviewed" land together. Matches the "should ride with it" instinct, but leaves 72 chapters mis-stamped (v3.3) in the meantime, even though they implement v3.4.

Recommendation: **(A)** — do Phases 0–4 now; the bump is honest under the §3 principle and removes a standing inconsistency, while Rule-28 keeps governing finalization. If you prefer (B), Phases 0–1 (verification) still run now; only the Phase-2 commit waits.
