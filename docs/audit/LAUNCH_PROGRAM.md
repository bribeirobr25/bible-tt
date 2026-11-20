# Launch-Readiness Program — Decisions & Sequence

**Date:** 2026-11-19
**Status:** ACTIVE — decisions locked by the project lead (interview, 2026-11-19). **Step 1 done 2026-11-19** (PR #15); **Step 2 done 2026-11-19** (PR #16, after its 5-reviewer implementation review); **Step 3 done 2026-11-20** (PR #17, after its 5-reviewer implementation review; `CONTENT_SWEEP_FINDINGS.md`); **Step 4 (Fixes) next — lead decisions L1–L8 first.**
**Source findings:** `docs/audit/PROJECT_STATE_AUDIT.md` (§ references below point there).
**Goal:** a public, provisional launch of the TT at **`bible-translation.breno-bar.com`** that the project lead is proud of — 7 books, all 4 locales, correct, consistent, and guarded against regression.

> This document is the **single source of decisions** for the program. Each step's `PLAN_*.md` cites it; if a plan and this document disagree, this document wins until the lead amends it here.

---

## 1. Decisions (locked 2026-11-19)

### 1.1 Scope & launch

| # | Topic | Decision | Notes |
|---|---|---|---|
| D1 | **1 Peter** (`origin/1-peter-expansion`) | **Review, then merge** before any other fixes; launch with **7 books** | **Amended 2026-11-19 (lead-confirmed):** ψυχή and Kefa naming are corpus-wide (ψυχή = "soul" also ships in Luke 1:46, 2:35, Acts 2:27, 2:41), so they are fixed uniformly across all 7 books in Step 4 — not 1 Peter-only before merge. Merged in Step 1 |
| D2 | **Launch status** | **Public launch, clearly labelled provisional** (AI-assisted draft; no Rule-28 sign-off yet) | Site already shows PROVISIONAL badges; Sources + AI-provenance must render (audit B2) |
| D3 | **Hosting** | **Vercel**, subdomain **`bible-translation.breno-bar.com`** | breno-bar.com site + DNS are on Vercel (same account) |
| D4 | **License** | Content **CC BY-SA 4.0**; code **MIT** | Replaces "Formal license TBD" (README) |
| D5 | **Analytics** | **Vercel Analytics + Speed Insights** | Cookie-free, no PII; no custom events until there is a question to answer (STANDARDS §10) |
| D6 | **Extra pre-launch scope** | **DAAT draft** (`DAAT_IDIOM_AND_JESUS_BROTHERS_PLAN.md`), **Phase 6 search (Pagefind)**, **Iakobos / Jesus's-brothers entry in Acts PEOPLE** | All other open items (Genesis 13–50, Hebrew poetry groundwork, cross-book PEOPLE merge) stay post-launch in `PENDING.md` |

### 1.2 Translation-rule resolutions (audit §5)

| # | Topic | Decision | Consequences |
|---|---|---|---|
| D7 | **ψυχή / נֶפֶשׁ** | Locked rendering **life/being** (keep RULES-GS lock, cross-supplement aligned with nephesh) — **re-confirmed 2026-11-19** knowing it re-renders well-known verses (e.g. Luke 1:46, Acts 2:41) | Fix RULES-CORE §I3 ("soul/being"); sweep all 7 books (incl. 1 Peter, Luke, Acts) in Step 4b — per the D1 amendment, not before the 1 Peter merge |
| D8 | **"son of man"** | **Lowercase everywhere** (Rule 20; DE capitalizes nouns grammatically) | Fix Mark (EN + locales, e.g. PT "Filho do Homem") and John's mixed casing |
| D9 | **οἱ Ἰουδαῖοι in German** | **Jehudim** (matches the JHWH / yod→J convention and `john.md` Entry J-006) | Fix the RULES-GS "all four languages" wording; convert the 12 DE files using "Yehudim" |
| D10 | **Reader marker colours** | **The live site / design system is correct** (`{a:}` bold body colour; `@@` red, not bold) | Update the RULES-CORE §Text-Highlight Markers table and stale comments (`globals.css:507-510`, `render-markdown-safe.ts:68-70`); no visual change |
| D11 | **Proper names** | The RULES-HB / RULES-GS **proper-name tables are the single source of truth**; missing names are proposed in the step-4 plan for audit, added to the tables, then **all books aligned** | Resolves Moshe/Mosheh, Natzeret/Natseret, Mattai/Mattityahu, Iakobos/Ya'aqov, DE Kafarnaum/Kapernaum, etc.; enforce the v3.2 first-occurrence-per-section rule (e.g. "Kefa (Peter)" → "Peter") |
| D12 | **EN-only companion entries** | **Translate** the 25 missing EN entries into PT-BR / DE / ES (mirror-EN, provisional, marker parity checked) | **10 companions / 29 file×locale pairs** (Step 2 measurement): john 1–3, matthew 1–3, genesis 1/7/11, and genesis 9 (F5 missing in PT-BR/ES only). The exact list is `KNOWN_ENTRY_GAPS` in `locale-parity.test.ts` — each fix must delete its entry there |

### 1.3 Working agreement

| # | Topic | Decision |
|---|---|---|
| D13 | **Planning** | **One `PLAN_*.md` per step**, each audited by the project lead before execution (`CONTRIBUTING.md` planned-work loop). **Amended 2026-11-19 (lead standing instruction):** once a step's plan is written and has passed an adversarial plan review with its findings fixed, the assistant implements it without a separate lead audit, then runs a **5-agent adversarial implementation review** and fixes the findings before merge (D14) — in the lead's words: *"After you have the plan written reviewed and fixed or improved, feel free to implement it. Then after the implementation run a review with 5 different agents to ensure everything is not only working correctly, but also is robust. In case of any issues are found during the review of the implementation kindly fix it."* Lead decisions the plan cannot settle (e.g. Step 3's L1–L8) still go to the lead |
| D14 | **Merging** | **Standing authorization:** the AI assistant merges each step's PR into `main` once the full gate is green (`pnpm test` · `lint` · `typecheck` · `content:lint` · `build`), then reports. Overrides the per-merge authorization in `CONTRIBUTING.md` for this program only |
| D15 | **Rule-28 reviewers** | **Handled entirely by the project lead**, outside this program. The program only ensures the site/docs support status changes (`provisional → reviewed → signed-off`) |
| D16 | **Commit identity** | Commits use the GitHub no-reply address (repo-level git config) — the account blocks pushes exposing a private email |

---

## 2. Sequence

Ordering principles: (1) bring stranded work onto `main` before changing anything; (2) safety net before fixes; (3) decisions before content changes; (4) every step ends with a green gate and an `EXECUTION_HISTORY.md` entry.

| Step | Plan doc (to write) | Content | Est. days |
|---|---|---|---|
| **1 — Baseline** | `PLAN_BASELINE_RECOVERY.md` | (a) Recover orphaned commit `333a373` (review its `content-lint.sh` §0.3b/§0.3c diff; cherry-pick; restores `PIVOT_FIDELITY_AUDIT.md` + live ES/DE fixes). (b) Review `1-peter-expansion` (code, docs, content sample) and merge as authored (D1 amended; D7/D11 → Step 4b). **DONE 2026-11-19.** | ~2 |
| **2 — Safety net** | `PLAN_SAFETY_NET.md` | CI (GitHub Actions running the full gate) first; whole-token label matching; activation-consistency over all 8 touchpoints; content-lint dir lists generated from `content/`, no stderr suppression, §0.3 extended to all `es/`, §0.1 treats < v3.4 as stale; **cross-locale parity test** (file set, verse counts, `{a:}`/`{t:}`/`@@` counts, companion entries) with an explicit, shrinking known-gaps list (playbook T-14). **DONE 2026-11-19.** *As executed:* word-start (not whole-token) label matching, suffixes allowed; activation-consistency covers the generated touchpoints, not row-5 `heroTagline`/`sectionKick` counts or the source-analysis stub (→ 4d). | 1.5–2 |
| **3 — Content sweep** | `PLAN_CONTENT_SWEEP.md` | Scripted rule-compliance scan of all 7 books × 4 locales (inputs logged in Step 1: the PT contraction-italic pivot class — playbook T-20 (upper bound, regex `\b(na\|no\|nas\|nos\|da\|do\|das\|dos\|pela\|pelo\|pelas\|pelos\|à\|às\|ao\|aos) \*[^*]+\*` over `content/pt-br/<book>/CHAPTER-*.md`: 1 Peter 57 · Luke 86 · Genesis 16 · Acts 8 · John 11 · Matthew 11 · Mark 1 — includes some legitimate italics; the exact class is sized in the Step 3 sweep) — which first needs a PT convention for marking an article fused into a contraction; plus the Step-1 review deferrals listed in `PLAN_BASELINE_RECOVERY.md` §10): glossary renderings, Rule 20 casing, names vs tables, divine name per locale, Rule 11 balance, Rule 30 scope, Rule-28 front matter, authoring-meta leaks, stale stamps. Output feeds step 4. **Also (Step 2 review):** ES body-text accent loss in the Gen 4/5/7/8 + John 1–3 companions (~210 pattern hits; headings fixed in Step 2). **DONE 2026-11-20** (PR #17) — `pnpm content:sweep` (S1–S22) + `CONTENT_SWEEP_FINDINGS.md` (counts, sourced precision `content-sweep/precision.tsv`, routing, lead decisions L1–L8); ES backlog re-sized to ≥ 2,119 tokens (lower bound). Only tooling changed (22 stale allow-list entries removed; unused entries now fail content-lint). | ~1 |
| **4 — Fixes** | `PLAN_LAUNCH_FIXES.md` (may split per strand) | **4a code:** audit B1–B7, ~~B11~~ (fixed Step 2), B12 + renderer hardening (empty cells, stray `*`/`@@`, table re-processing). **4b content:** D7–D9 (D7 explicitly incl. 1 Peter's ψυχή = "soul" plus Luke/Acts ψυχή), D11 name alignment (incl. 1 Peter Kefa naming and Silvanus/Silas), the §0.3d lowercase pivot-calque class (~17 lines, Acts 2–3 + Luke 1:35), D12 companion translation, sweep results, ES Genesis accents, YHWH in DE body, meta leaks, mojibake. **4c scope items:** DAAT draft (incl. its open Q2 Ramban-verification question + a new matthew.md log ID), Iakobos/brothers Acts entry. **4d rules & docs:** RULES-CORE (D7, D10, 30-rule wording, stale internals, real 8-touchpoint checklist), RULES-GS (D9), `CHANGELOG-v3.4.md`, version headers, STANDARDS, HOW-TO-READ, templates, README/CLAUDE.md trees, transliteration-decisions, PENDING refresh, v3.3 → v3.4 re-stamp. **4d notes (Step 2 review, sized in Step 3):** the 137 §0.1b lines are 125 stamp fields + 8 prose stamps ("the TT ruleset (v3.3)" — re-stamp) + **4 legitimate citations** ("v3.3.2 cross-book convention", Luke 3 — keep); no blind replace; reconcile RULES-CORE "5 synchronized changes" with the playbook's 8 touchpoints and the non-existent `people.inBook.{slug}` key; add `heroTagline`/`sectionKick` + source-stub checks to activation-consistency; each fixed D12 gap must delete its `KNOWN_ENTRY_GAPS`/`KNOWN_LABEL_GAPS` entry. **Re-sizing from Step 3 (`CONTENT_SWEEP_FINDINGS.md`):** 4b grew — ES accents ≥ 2,119 tokens (Genesis + John), Rule 25 LORD-forms 170 + 105 caps titles, Rule 20 titular nouns 73 verses, glossary-lock breaks ≈ 17 verses/locale (+ DE 5 Eintauchung), meta leaks ≈ 1,000 rendered lines/locale (incl. 2,446 rule refs, 645 AI-provenance lines → L5), Tier-2 length (L8 waiver), the D11 name tables; 4a gained the chapter status pill (i18n term), the rules page (29 → 30 rules, L5) and the ES "TABLA DE CONTENIDOS" TOC. The estimate must be redone in `PLAN_LAUNCH_FIXES.md` once L1–L8 are decided. | 5–7 (re-estimate) |
| **5 — Launch** | `PLAN_LAUNCH.md` | License files (D4); CSP/security headers; Vercel project + `bible-translation.breno-bar.com` (D3); analytics (D5); Pagefind search (D6); `not-found` pages; sitemap/hreflang checks; **visual + accessibility pass** (mobile/tablet/desktop × 4 locales, tap targets, contrast, headings) — known inputs from Step 1 visual check: chapter-head (breadcrumb/title/door pills) has **no left gutter** at 1280px site-wide; long page titles **clip on mobile** (e.g. DE "Personen und Genealogie" at 390px); go-live. | 2.5–3.5 |

**Total to launch: ≈ 13–15 working days**, excluding the lead's Rule-28 reviewer timeline (D15).

---

## 3. Post-launch (not in this program)

Genesis 13–50 (Phase 12) and further epistles — **only** on the strengthened pipeline, with source-anchored Rule-28 review in every propagation (playbook T-13); Hebrew-poetry groundwork (RULES-HB poetry section + renderer line breaks) before any Psalms; cross-book canonical PEOPLE merge; Rule-28 judgment items from the pivot audit (PT `pairando`, PT/ES ταπείνωσις, EN-level κατέλαβεν).

---

## 4. Progress log

| Date | Step | Event |
|---|---|---|
| 2026-11-19 | — | Program defined; decisions D1–D16 locked. |
| 2026-11-19 | 1 | **Baseline recovery done** (`PLAN_BASELINE_RECOVERY.md`): orphaned `333a373` recovered (+2 missed ES fixes, §0.3b tightened); `1-peter-expansion` merged (7 books); D1 amended / D7 re-confirmed by the lead. Gate: 887 tests, conservation 408 files / 20,599 units. |
| 2026-11-19 | 1 | **Implementation review (5 independent reviewers)** — integrity / code+tooling / content / docs / runtime+visual; fixes folded into PR #15 (prophecy fields + glossary markers rendered, glossary mobile overflow, lint guards hardened + §0.3d, 1 Peter Isa 40:8 notes corrected ×4 locales, Rule-11 italics, ES accents, People headers); deferrals routed to Steps 2–5 (`PLAN_BASELINE_RECOVERY.md` §10). |
| 2026-11-19 | 2 | **Safety net done** (`PLAN_SAFETY_NET.md`, PR #16): GitHub Actions CI gate; content-lint lists generated + tool errors fail + widened/portable rules (bash 3.2/5.2, BSD/GNU grep); word-start label matching (6,350-label snapshot unchanged); people-field resolution fixed (start-anchored aliases; DE/ES aliases; B11); new locale-parity, raw-reconciliation (+ canonical verse table), people-field, i18n tests; de-vacuumed tests; npm lockfile removed. **Deviation recorded:** §0.1 now *warns* (not blocks) on v3.3 stamps in content/ until the Step 4d re-stamp (program text says "< v3.4 stale"). Tests 887 → 916. |
| 2026-11-19 | 2 | **Implementation review (5 independent reviewers)** — lint+CI / test quality (mutation-tested) / code correctness (main↔branch differential) / runtime+visual / docs coherence; fixes folded into PR #16 (Luke genealogy note — a genealogy-section parser bug, not the alias fallback — now rendered ×4 locales; list fields split safely; negation/NFC/historicity hardening; parity extended to INTRODUCTION/CONTEXT/PROPHECY; people order + both-direction checks; lint empty-input/Encode/§0.3c/§0.12-generated; CI actions on Node 24; 150 ES heading accents). See `PLAN_SAFETY_NET.md` §11. |
| 2026-11-19 | — | **Lead decision — branch protection on `main`** (requested during Step 3): required status check `gate` (strict), `enforce_admins` on, PR required (0 approvals), force-push + deletion blocked; `CONTRIBUTING.md` gate/branching text updated. Remote branches pruned to `main` + the working branch; annotated tag `archive/333a373` preserves the recovered luke-propagation tip (PR #12 head + 1; content recovered on `main` as `ffea172`). Closes `PLAN_SAFETY_NET.md` I23. |
| 2026-11-19 | — | **D13 amended** (lead standing instruction): plan → adversarial plan review → implement → 5-agent implementation review → fix → merge on green (D14). See D13. |
| 2026-11-19 | 3 | **Content sweep** (first pass) (`PLAN_CONTENT_SWEEP.md`; adversarial plan review: 1 blocker + 21 findings, all resolved §13): committed sweep tool (19 checks, zone + render model, 36 fixture tests, determinism + recall anchors pinned); findings + lead decisions L1–L8 in `CONTENT_SWEEP_FINDINGS.md`; §0.8 allow-list cleaned + `allowlist` lint rule; lint covers `scripts/`. Tests 929 → 967. |
| 2026-11-20 | 3 | **Implementation review (5 adversarial reviewers)** — tool correctness (+ mutation testing), independent recall, precision/rule fidelity, docs, gate/CI/infra; no blockers. Fixed in PR #17: zone/render model (Sources by heading words, PROPHECY parser model, book card), the gloss normalizer (headline 5 was an artifact: 4 real EN word differences, not 58), recall gaps (πίστις, Ἰουδαῖοι, DE Umkehr, DE/ES doubled articles, HERRN, Rule 20 titles, marker governance, labels) as S3/S7a/S13/S14 extensions + new S20–S22; L1–L8 re-cut against the rule text and logs; tests no longer pin live defects (frozen recall anchors); scripts type-checked; CI/branch-protection docs aligned; `archive/*` tag ruleset. **Step 3 done** — see `PLAN_CONTENT_SWEEP.md` §15. |
