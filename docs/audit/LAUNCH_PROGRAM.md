# Launch-Readiness Program — Decisions & Sequence

**Date:** 2026-11-19
**Status:** ACTIVE — decisions locked by the project lead (interview, 2026-11-19); execution not started.
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
| D7 | **ψυχή / נֶפֶשׁ** | Locked rendering **life/being** (keep RULES-GS lock, cross-supplement aligned with nephesh) — **re-confirmed 2026-11-19** knowing it re-renders well-known verses (e.g. Luke 1:46, Acts 2:41) | Fix RULES-CORE §I3 ("soul/being"); fix 1 Peter's "soul" before merge; sweep existing occurrences |
| D8 | **"son of man"** | **Lowercase everywhere** (Rule 20; DE capitalizes nouns grammatically) | Fix Mark (EN + locales, e.g. PT "Filho do Homem") and John's mixed casing |
| D9 | **οἱ Ἰουδαῖοι in German** | **Jehudim** (matches the JHWH / yod→J convention and `john.md` Entry J-006) | Fix the RULES-GS "all four languages" wording; convert the 12 DE files using "Yehudim" |
| D10 | **Reader marker colours** | **The live site / design system is correct** (`{a:}` bold body colour; `@@` red, not bold) | Update the RULES-CORE §Text-Highlight Markers table and stale comments (`globals.css:507-510`, `render-markdown-safe.ts:68-70`); no visual change |
| D11 | **Proper names** | The RULES-HB / RULES-GS **proper-name tables are the single source of truth**; missing names are proposed in the step-4 plan for audit, added to the tables, then **all books aligned** | Resolves Moshe/Mosheh, Natzeret/Natseret, Mattai/Mattityahu, Iakobos/Ya'aqov, DE Kafarnaum/Kapernaum, etc.; enforce the v3.2 first-occurrence-per-section rule (e.g. "Kefa (Peter)" → "Peter") |
| D12 | **EN-only companion entries** | **Translate** the ~30 missing entries into PT-BR / DE / ES (mirror-EN, provisional, marker parity checked) | 9 companions: john 1–3, matthew 1–3, genesis 1/7/11 (audit §4) |

### 1.3 Working agreement

| # | Topic | Decision |
|---|---|---|
| D13 | **Planning** | **One `PLAN_*.md` per step**, each audited by the project lead before execution (`CONTRIBUTING.md` planned-work loop) |
| D14 | **Merging** | **Standing authorization:** the AI assistant merges each step's PR into `main` once the full gate is green (`pnpm test` · `lint` · `typecheck` · `content:lint` · `build`), then reports. Overrides the per-merge authorization in `CONTRIBUTING.md` for this program only |
| D15 | **Rule-28 reviewers** | **Handled entirely by the project lead**, outside this program. The program only ensures the site/docs support status changes (`provisional → reviewed → signed-off`) |
| D16 | **Commit identity** | Commits use the GitHub no-reply address (repo-level git config) — the account blocks pushes exposing a private email |

---

## 2. Sequence

Ordering principles: (1) bring stranded work onto `main` before changing anything; (2) safety net before fixes; (3) decisions before content changes; (4) every step ends with a green gate and an `EXECUTION_HISTORY.md` entry.

| Step | Plan doc (to write) | Content | Est. days |
|---|---|---|---|
| **1 — Baseline** | `PLAN_BASELINE_RECOVERY.md` | (a) Recover orphaned commit `333a373` (review its `content-lint.sh` §0.3b/§0.3c diff; cherry-pick; restores `PIVOT_FIDELITY_AUDIT.md` + live ES/DE fixes). (b) Review `1-peter-expansion` (code, docs, content sample), apply D7/D11 fixes, merge (D1). | ~2 |
| **2 — Safety net** | `PLAN_SAFETY_NET.md` | CI (GitHub Actions running the full gate) first; whole-token label matching; activation-consistency over all 8 touchpoints; content-lint dir lists generated from `content/`, no stderr suppression, §0.3 extended to all `es/`, §0.1 treats < v3.4 as stale; **cross-locale parity test** (file set, verse counts, `{a:}`/`{t:}`/`@@` counts, companion entries) with an explicit, shrinking known-gaps list (playbook T-14). | 1.5–2 |
| **3 — Content sweep** | `PLAN_CONTENT_SWEEP.md` | Scripted rule-compliance scan of all 7 books × 4 locales (inputs logged in Step 1: the PT contraction-italic pivot class — playbook T-20, ~57 in 1 Peter / ~87 Luke / ~16 Genesis — which first needs a PT convention for marking an article fused into a contraction): glossary renderings, Rule 20 casing, names vs tables, divine name per locale, Rule 11 balance, Rule 30 scope, Rule-28 front matter, authoring-meta leaks, stale stamps. Output feeds step 4. | ~1 |
| **4 — Fixes** | `PLAN_LAUNCH_FIXES.md` (may split per strand) | **4a code:** audit B1–B7, B11, B12 + renderer hardening (empty cells, stray `*`/`@@`, table re-processing). **4b content:** D7–D9 (D7/D11 explicitly incl. 1 Peter's ψυχή = "soul" and Kefa naming, plus Luke/Acts ψυχή), D11 name alignment, D12 companion translation, sweep results, ES Genesis accents, YHWH in DE body, meta leaks, mojibake. **4c scope items:** DAAT draft (incl. its open Q2 Ramban-verification question + a new matthew.md log ID), Iakobos/brothers Acts entry. **4d rules & docs:** RULES-CORE (D7, D10, 30-rule wording, stale internals, real 8-touchpoint checklist), RULES-GS (D9), `CHANGELOG-v3.4.md`, version headers, STANDARDS, HOW-TO-READ, templates, README/CLAUDE.md trees, transliteration-decisions, PENDING refresh, v3.3 → v3.4 re-stamp. | 5–7 |
| **5 — Launch** | `PLAN_LAUNCH.md` | License files (D4); CSP/security headers; Vercel project + `bible-translation.breno-bar.com` (D3); analytics (D5); Pagefind search (D6); `not-found` pages; sitemap/hreflang checks; **visual + accessibility pass** (mobile/tablet/desktop × 4 locales, tap targets, contrast, headings); go-live. | 2.5–3.5 |

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
