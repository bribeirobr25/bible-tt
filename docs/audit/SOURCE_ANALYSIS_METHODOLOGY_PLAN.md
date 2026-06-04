# Plan — Source-Analysis Methodology Formalization (HB base → GS / Aramaic adaptation)

**Date:** 2026-06-02
**Scope:** Extract the language-agnostic source-analysis *method* now sitting in raw form under `docs/genesis_template/`, re-brand it as a project-owned asset, organize the worked-example corpus, and wire it into existing governance — while guaranteeing that no contributor name or persona ever reaches end users.
**Status:** CLOSED 2026-06-03 — executed. Decision locks: **Q1=A · Q2=A · Q3=C · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A** (see §Decision locks & closure).
**Ruleset:** v3.3 (+ v3.3.1 / v3.3.2 amendments)
**Estimated effort:** ~5–8 h for the base (method doc + corpus organization + links + scrub + guard); GS/Aramaic deferred per Q5; validation pass deferred per Q6.
**Author:** Claude Opus 4.8 (1M context)
**Revisions:** 2026-06-02 — pre-execution verification table added (repo sweep). 2026-06-02 — feedback edits 1–6 + the Q3 refinement from `docs/audit/FEEDBACK_SOURCE_ANALYSIS_METHODOLOGY_PLAN.md` incorporated (grep-command alignment, line-number → section citations, §PROJECT METADATA scope refresh, §0.13 modeled on §0.12, Aramaic governance-home note, epistemic living-comparand caution). Companion audit verdict: `docs/audit/AUDIT_SOURCE_ANALYSIS_METHODOLOGY_PLAN.md`.

---

## Guiding principle (non-negotiable)

**User-invisibility of the source persona.** The web application and all user-facing content must never expose the external contributor's name or any first-person/channel persona ("my name is…", "subscribe", "my channel", "native Hebrew speaker", membership/patreon chatter). The methodology is absorbed and re-branded as **the TT Source-Analysis Method** — a project asset stated in the TT's institutional, faith-neutral voice. The raw transcripts are treated as **internal working notes**, never quoted verbatim into companion/chapter content, and the contributor's identity is handled per Q2.

This principle governs every decision below; where a choice would risk leakage, the lower-risk option wins.

---

## Context

`docs/genesis_template/` currently holds nine raw video transcripts from an external Hebrew-speaking source-language contributor: eight sequential word-by-word walkthroughs of **Genesis 1:1–1:13** (`genesis1.md` … `genesis11-13.md`) plus `hebrew-grammar.md` (standalone word studies: *ki*, *shalach*, Song of Songs 1:5, *et*, "love thy neighbor", the name *Yitzchak*). The directory name is misleading — these are not templates; they are Hebrew worked examples in transcribed-speech form (no punctuation, ASR artifacts, heavy persona/channel framing).

The material contains two separable assets:

1. **A source-language-agnostic *method*** — faith-neutral stance; lexeme → morphology → full semantic range → cross-textual attestation (concordance) → contrast with the traditional translation → literal-then-smooth → honest uncertainty labeling. This skeleton ports to Hebrew, Aramaic, and Greek.
2. **Language-specific *substance*** — Semitic roots, converting-*vav*, *nikud*, gutturals, and specific Hebrew word-findings. HB-only; Greek and Aramaic need their own substance.

This split mirrors the existing governance architecture (**RULES-CORE** universal → **RULES-HB / RULES-GS** supplements), so the method becomes a universal doc and the substance lives per source language as a worked-example corpus.

---

## What already exists (audit)

| Asset | State |
|-------|-------|
| Method, in raw form | Embedded in 9 transcripts under `docs/genesis_template/` |
| HB substance | Largely already encoded in `RULES-HB.md` glossary, `docs/editorial-log/transliteration-decisions.md`, and `docs/editorial-log/genesis.md` (e.g. *bara*, *raqia*, *tehom*, *ruach*, *shamayim*/*eretz*, *et*, *yom echad*, converting-*vav*, *bereshit* no-article) |
| Per-verse workflow | `RULES-CORE.md` §Implementation Workflow + `RULES-HB.md`/`RULES-GS.md` workflows already describe a per-verse process; the method doc formalizes and unifies it |
| GS substance | None authored (no Greek contributor); `RULES-GS.md` has the grammar scaffolding (aspect, article system) but no worked examples |
| Aramaic substance | None; `RULES-HB.md` §Aramaic Appendix notes the canon's Aramaic passages exist but are unauthored |
| Contributor credit | `RULES-CORE.md` §PROJECT METADATA line "Source Analysis: Video transcripts by Elan (Hebrew speaker)" — the **only** internal-doc occurrence besides this plan. `CLAUDE.md` and `README.md` are name-clean. |
| User-facing leakage | **Confirmed zero** (2026-06-02 sweep, see §Pre-execution verification): exact name token and persona prose absent from `content/`, `src/`, and i18n bundles. |

---

## Pre-execution verification (2026-06-02 repo sweep)

Independent review of this plan against the live repo. No blocking surprises.

| Check | Result |
|---|---|
| Exact name token `\bElan\b` in `content/` + `src/` | **Zero** — user-facing surfaces clean |
| Same in `src/infrastructure/i18n/` message bundles | **Zero** |
| Persona/channel prose ("thank you for watching", "subscribe", "native hebrew speaker", "notification bell", …) in `content/` + `src/` | **Zero** — no verbatim leak |
| Name in root docs (`CLAUDE.md`, `README.md`) | **Zero** |
| Name in internal docs | Only `RULES-CORE.md` §PROJECT METADATA credit + this plan |
| `genesis_template/` referenced outside the dir | **No** doc/code references; one harmless cached permission string in `.claude/settings.local.json` (not documentation — no action) |
| User-facing `/[locale]/rules` route | **Exists** (`src/app/[locale]/rules/page.tsx`), but hand-authored from i18n keys; **does not read the rules docs at runtime** → the PROJECT METADATA credit is **not currently exposed**. Risk is future regression only — covered by the Q7 guard. |
| Next free content-lint rule number | `§0.1`–`§0.12` in use → **`§0.13` is free** |
| `README.md` §"Translation methodology" | About the 29-rule translation governance (public), **not** the source-analysis method; name-clean → **requires no change** (optional pointer to METHOD.md only if desired) |

**Nuance the executor must respect:** the contributor name is woven into *substantive* corpus content, not just framing — e.g. the *etz* (tree) word-study in `genesis11-13.md` uses "my name also means a tree… Elan," and the corpus cites **"Elan Ramon"** (the astronaut — a *different* real person used as an example). A naive find-and-delete of the token would damage the *etz* example and mis-handle the astronaut reference. Step 3 must **rewrite, not blind-delete**: drop the personal tree anecdote, and decide whether the astronaut reference stays (it is not the contributor) or is removed for token-cleanliness. Accordingly the Q7 guard is scoped to **`content/` + `src/` only** — never `docs/source-analysis/`, which may legitimately retain "Elan Ramon" or the internal provenance line.

---

## Proposed target structure (create)

```
docs/source-analysis/
├── README.md            # index; how this feeds RULES-HB/GS + editorial logs; internal-only notice
├── METHOD.md            # the TT Source-Analysis Method (agnostic) + per-language adaptation table
├── hebrew/              # the relocated, anonymized HB worked-example notes (Gen 1:1–1:13 today)
├── greek/               # stub per Q5 (parallel method, Greek substance, authored on demand)
└── aramaic/             # stub per Q5 (Daniel/Ezra fragments; authored much later)
```

`METHOD.md` presents the agnostic skeleton plus a short **per-language adaptation table** (the elegant part): each step gets HB / GS / Aramaic hooks — e.g. "identify lexeme + morphology" → HB: 3-letter root + *binyan*; GS: lemma + tense/voice/mood/case/number; Aramaic: Semitic root. "Living-language comparand" → HB: Modern Israeli Hebrew (a strong move); GS: **no** living Koine (Modern/Patristic Greek only with caution); Aramaic: Neo-Aramaic with caution. "Traditional-translation contrast" → HB: KJV/Almeida/Luther/RV; GS: same + Vulgate. This mirrors how CORE Rule 9 states aspect universally with HB/GS implementations.

**Aramaic governance home:** worked examples live in `aramaic/`, but Aramaic *substance / governance* has no separate ruleset — it lives in `RULES-HB.md §Aramaic Appendix` (HB is the Hebrew *and* Aramaic supplement). The METHOD.md adaptation table's Aramaic column points there.

---

## Decision questions (please audit)

### Q1 — Home and naming

- **A (recommended):** New `docs/source-analysis/` dir as above (METHOD.md + README.md + `hebrew/`/`greek/`/`aramaic/`).
- **B:** Put `METHOD.md` in `docs/rules/` (next to CORE/HB/GS); keep the corpus under `docs/source-analysis/`.
- **C:** Put `METHOD.md` in `docs/guides/`.

*Recommendation: A. Self-contained, keeps bulky raw material out of the rulesets, links cleanly. B scatters the asset; C mixes it with reader-facing guides.*
- **BAR decision =** approved option A

### Q2 — Anonymization depth (the core ask)

- **A (recommended):** **User-facing scrub + full internal re-brand, contributor name retained only in a single internal provenance note.** Method becomes "TT Source-Analysis Method"; corpus stripped of persona; `content/` and `src/` verified clean + guarded (Q7); the `RULES-CORE.md` PROJECT METADATA credit is reworded to a neutral internal form (e.g. "Source analysis: external Hebrew-source contributor, transcripts archived internally"). The name survives **only** in `docs/source-analysis/README.md` as an internal provenance/audit line, never user-facing.
- **B:** User-facing scrub only; retain the name freely across internal docs (CLAUDE.md, RULES-CORE) for audit honesty.
- **C:** Total erasure — remove the name everywhere including internal docs; provenance recorded only as "external source-language contributor."

*Recommendation: A. Satisfies "nothing shows to users" while preserving a minimal internal provenance trail (Rule 28 honesty). B leaves the name in governance docs you may not want it in; C sacrifices the audit trail. If you prefer zero internal trace, choose C.*
- **BAR decision =** approved option A

### Q3 — Corpus treatment

- **A (recommended):** Move to `hebrew/`, strip persona/channel/ASR cruft, keep the linguistic substance as **anonymized prose worked-notes** (light cleanup, prose preserved).
- **B:** Move raw, prepend an "internal raw transcript" header, defer cleanup.
- **C:** **Distill** each file into structured per-verse notes (lexeme · root/morphology · semantic range · cross-textual attestation · traditional-translation contrast · uncertainty), discarding all prose.

*Recommendation: A as the floor. But the corpus's stated purpose is to feed Phase 12 / GS / Aramaic authoring, and lightly-cleaned ASR prose serves that poorly — so **C is the higher-value lock for that purpose** (most reusable, fully de-personalized); A is acceptable only if the corpus is kept purely for archival provenance. C can be staged (A now as a safety move, C as the immediately-following pass) if the 5–8 h envelope is tight.*
- **BAR decision =** keep executed **option C** (confirmed 2026-06-04). The corpus is already structured per-verse notes; the earlier "option A" annotation was a ratification slip and is superseded. Matches §Decision locks & closure (Q3=C).

### Q4 — Touch locked `RULES-CORE.md`?

- **A (recommended):** Yes — emergency amendment: add a one-line pointer to `METHOD.md` from §Implementation Workflow, reword the PROJECT METADATA credit per Q2, **and** opportunistically refresh the same block's three stale scope lines (`Status`/`Completed`/`Pending` still read "Genesis 1–9" + "Greek expansion planned") to current scope as compact pointers. All additive / factual (no rule modified, no signed-off verses affected).
- **B:** Don't touch CORE; link only from HB/GS/CLAUDE; leave the metadata credit as-is.
- **C:** Touch CORE only to reword the credit (no method pointer).

*Recommendation: A. The method is genuinely universal, so CORE is its natural anchor; the metadata reword is part of the scrub. If you want CORE left fully stable, B (and handle the credit via Q2 elsewhere).*
- **BAR decision =** approved option A

### Q5 — Greek / Aramaic now or deferred

- **A (recommended):** Stub now — empty `greek/` + `aramaic/` with READMEs and the per-language hooks present in `METHOD.md`; fill when those books are actively authored (GS on extending John/Matthew or adding Greek books; Aramaic only at Daniel/Ezra).
- **B:** Pilot one Greek worked example (e.g. John 1:1) now to prove the method ports.
- **C:** Defer entirely; HB-only this cycle, no stubs.

*Recommendation: A. Establishes the cross-language architecture without inventing Greek substance that needs a Hellenist (Rule 28). B is a nice proof-of-portability if you want it; note any GS worked example is AI-draft pending Hellenist review.*
- **BAR decision =** approved option A with option B when possible. When doing option B we could review/audit the already shipped work against the updated rules and methods.

### Q6 — Validation cross-check (the earlier "Option B")

- **A (recommended):** Separate follow-up pass after `METHOD.md` lands — cross-check the Gen 1:1–1:13 findings against shipped Gen 1 content + editorial log; report/fix/log gaps.
- **B:** Bundle the cross-check into this effort.

*Recommendation: A. Keeps this effort focused on method + anonymization; the content QA is a distinct task with its own (small) risk surface.*
- **BAR decision =** approved option A

### Q7 — Permanent leakage guard

- **A (recommended):** Add a warn-only content-lint rule (**§0.13** — confirmed free; §0.1–§0.12 are in use) that flags the contributor name + persona markers, **scoped to `content/` + `src/` only** (never `docs/source-analysis/`, which may legitimately retain "Elan Ramon"/provenance); plus the one-time grep already run in §Pre-execution verification. Model §0.13 on the existing **§0.12 `check_cross_book_pointers`** in `scripts/content-lint.sh` (warn-only via `emit_warn`, file-glob–scoped, exceptions registered in `scripts/lint-allowlist.txt`) — a near-copy of working code rather than a from-scratch rule.
- **B:** One-time grep verification only, no permanent guard.

*Recommendation: A. Matches the existing §0.x lint discipline and prevents regression — exactly the mechanism that caught the version-stamp drift.*
- **BAR decision =** approved option A

### Q8 — Editorial-log entry

- **A (recommended):** One `genesis.md` anchor entry recording the methodology formalization + anonymization decision, citing this plan.
- **B:** No entry (treat as docs-only infrastructure).

*Recommendation: A. The anonymization and the method's elevation to a governed asset are governance decisions worth logging.*
- **BAR decision =** approved option A

---

## Proposed execution order (if Q1=A · Q2=A · Q3=A · Q4=A · Q5=A · Q6=A · Q7=A · Q8=A)

**Step 0 — Re-confirm + baseline (~15 min).** *(Baseline already established in §Pre-execution verification, 2026-06-02; re-run at execution time in case content changed.)*
- Re-run the exact-token (`\bElan\b`) + persona-marker grep across `content/` + `src/`; confirm still zero.
- `src/app/[locale]/rules/page.tsx` already confirmed i18n-driven (does not render the credit) — re-confirm unchanged.
- Record the baseline (tests 819, lint state) for the post-change diff.

**Step 1 — Create `docs/source-analysis/METHOD.md` (~2 h).**
- The agnostic method skeleton in the TT's institutional voice (no persona, no name).
- The per-language adaptation table (HB / GS / Aramaic hooks).
- Explicit "facts not interpretation" framing tied to Prime Directive + Rule 3 + Rule 13.
- State the **living-language-comparand caution epistemically**, not merely as scope: a living comparand (Modern Hebrew for HB; Modern/Patristic Greek or Neo-Aramaic elsewhere) **generates hypotheses, never evidences meaning** — Modern Hebrew carries 2,000+ years of semantic drift, so treating it as authoritative would import anachronism (Rule 3). Tie the caution to Rule 3 so the discipline travels with the method.

**Step 2 — Create `docs/source-analysis/README.md` (~30 min).**
- Purpose, internal-only notice, how it feeds RULES-HB/GS + editorial logs, and (per Q2) the single internal provenance line.

**Step 3 — Relocate + anonymize the HB corpus (~1.5–3 h, scales with Q3).**
- Move `docs/genesis_template/*` → `docs/source-analysis/hebrew/`; rename to clear per-verse names (e.g. `genesis-1-01.md` … `genesis-1-11-13.md`, `hebrew-word-studies.md`).
- Strip name/persona/channel/ASR cruft (Q3=A) or distill to structured notes (Q3=C).
- Remove the now-empty `docs/genesis_template/`.

**Step 4 — Wire links + scrub credit (~45 min).**
- `RULES-HB.md`: pointer to METHOD.md + the HB corpus; §Aramaic Appendix note that the same method applies.
- `RULES-GS.md`: pointer to METHOD.md + (stubbed) GS corpus.
- `RULES-CORE.md` (per Q4): §Implementation Workflow pointer + §PROJECT METADATA refresh — reword the *Source Analysis* credit per Q2 **and** correct the same block's three stale scope lines (`Status`/`Completed`/`Pending`, currently "Genesis 1–9" + "Greek expansion planned") to current scope. Keep them **compact and pointer-style** (e.g. "Genesis 1–12, John 1–3, Matthew 1–3 in all four locales; full history in `docs/audit/EXECUTION_HISTORY.md`") — do **not** restate a changelog, to avoid a second drift surface alongside CLAUDE.md / EXECUTION_HISTORY. (If Q4=B, track this metadata refresh as a separate trivial cleanup.)
- `CLAUDE.md`: add `source-analysis/` to the structure tree + one pointer line.

**Step 5 — Stubs (per Q5) (~20 min).** `greek/README.md` + `aramaic/README.md` with the adaptation hooks and a "filled on authoring" note. `aramaic/README.md` states its governance home is `RULES-HB.md §Aramaic Appendix` (no parallel RULES-Aramaic file).

**Step 6 — Leakage guard (per Q7) (~45 min).** Add the **§0.13** warn-only rule modeled on the existing §0.12 `check_cross_book_pointers` (`emit_warn` + `scripts/lint-allowlist.txt`), scanning `\bElan\b` + persona markers in `content/*` and `src/*` globs only (never `docs/source-analysis/`); run `pnpm content:lint`.

**Step 7 — Log + meta-doc sync (~30 min).** `genesis.md` anchor entry (Q8); refresh `CLAUDE.md` Verified-state pointers and `docs/audit/EXECUTION_HISTORY.md` with the closure row.

**Step 8 — Validate (~20 min).** `pnpm test` (819 unchanged), `pnpm build`, `pnpm lint`, `pnpm content:lint` clean; re-run the Step-0 grep to confirm still-zero user-facing references.

---

## Out of scope (deferred / rejected)

| Item | Disposition |
|------|-------------|
| Greek/Aramaic worked-example *content* | DEFERRED per Q5 (stub now, fill on authoring; GS needs Hellenist per Rule 28) |
| Gen 1:1–1:13 vs. shipped-content cross-check | DEFERRED to a separate validation pass per Q6 |
| Extending the HB corpus beyond Gen 1:13 | OUT — depends on Phase 12 (Genesis 13–50) authoring |
| Quoting any corpus prose into user-facing companions | REJECTED — violates the Guiding Principle |
| Reader-facing "methodology" page in the app | OUT — not requested; would risk persona leakage |

---

## Documentation change map

| File | Create / Edit | Note |
|------|---------------|------|
| `docs/source-analysis/METHOD.md` | Create | The agnostic base + adaptation table |
| `docs/source-analysis/README.md` | Create | Index + internal provenance (Q2) |
| `docs/source-analysis/hebrew/*` | Create (moved) | Anonymized HB worked notes |
| `docs/source-analysis/{greek,aramaic}/README.md` | Create | Stubs (Q5) |
| `docs/genesis_template/` | Delete | Emptied after move |
| `RULES-HB.md` | Edit | Pointer + Aramaic-appendix note |
| `RULES-GS.md` | Edit | Pointer + GS-stub note |
| `RULES-CORE.md` | Edit (Q4) | Workflow pointer + metadata reword |
| `CLAUDE.md` | Edit | Tree entry + pointer line |
| `scripts/content-lint.sh` | Edit (Q7) | §0.13 leakage guard (modeled on §0.12) |
| `docs/editorial-log/genesis.md` | Edit (Q8) | Anchor entry |
| `docs/audit/EXECUTION_HISTORY.md` + `PENDING.md` | Edit | Closure row / item update |

---

## Validation checklist (pre-commit)

- [ ] `grep -rnE "\bElan\b" content/ src/` → zero matches (word-boundary, case-sensitive; Step 0 + Step 8)
- [ ] No persona markers in `content/` or `src/`
- [ ] User-facing rules/about route confirmed clean
- [ ] `METHOD.md` written in institutional voice (no name, no persona, no first person)
- [ ] HB corpus relocated + anonymized; `docs/genesis_template/` removed
- [ ] Pointers added in RULES-HB / RULES-GS / CLAUDE (+ CORE per Q4)
- [ ] `greek/` + `aramaic/` stubs present (per Q5)
- [ ] §0.13 leakage-guard lint rule active (per Q7)
- [ ] `pnpm test` → 819/819 · `pnpm build` → success · `pnpm lint` + `pnpm content:lint` clean
- [ ] `genesis.md` anchor entry logged (per Q8)
- [ ] `CLAUDE.md` + `EXECUTION_HISTORY.md` + `PENDING.md` synced

---

## Risk assessment

| Risk | Mitigation |
|------|-----------|
| Persona/name leaks into a user-facing surface now or later | Step-0 grep + §0.13 permanent lint guard (Q7) + Guiding Principle as a hard gate |
| Corpus prose later copied verbatim into companion content | README internal-only notice + REJECTED row above; reviewers reject on sight |
| Touching locked RULES-CORE churns governance | Q4 scoped to additive pointer + factual metadata reword (emergency-amendment criteria met: no rule modified, no signed-off verses) |
| Method doc drifts toward a single contributor's idiom | METHOD.md written as agnostic skeleton + per-language table; HB-specific moves (e.g. living-Hebrew comparand) flagged as HB-only; living-language comparands framed **epistemically** (hypothesis-generating, never meaning-evidencing) per Rule 3 |
| GS worked examples invented without a Hellenist | Q5 keeps Greek stubbed; any pilot marked AI-draft pending Hellenist review (Rule 28) |
| Anonymization erases needed audit provenance | Q2=A keeps one internal provenance line; Rule 28 trail preserved without user exposure |

---

## After execution

- Update `CLAUDE.md` Verified-state pointers (add `docs/source-analysis/`), structure tree, and `docs/audit/EXECUTION_HISTORY.md` closure row.
- Mark this plan CLOSED with its decision locks recorded in a §Decision section (per the project's plan convention).
- The deferred validation pass (Q6) and GS/Aramaic fills (Q5) remain tracked in `PENDING.md`.

---

## Decision locks & closure

**Locked 2026-06-03:** Q1=A (new `docs/source-analysis/`) · Q2=A (user-facing scrub + re-brand; name kept only in README provenance line) · Q3=C (distill transcripts to structured per-verse notes) · Q4=A (CORE workflow pointer + credit reword + compact metadata refresh) · Q5=A (Greek/Aramaic stubbed) · Q6=A (validation cross-check deferred) · Q7=A (§0.13 guard, content/+src only) · Q8=A (one genesis.md anchor entry).

**Executed 2026-06-03.** Deliverables: `docs/source-analysis/{METHOD.md, README.md, hebrew/×9, greek/README.md, aramaic/README.md}`; `docs/genesis_template/` removed; pointers in RULES-CORE (§Implementation Workflow + §PROJECT METADATA reword/refresh), RULES-HB (header + §Aramaic Appendix), RULES-GS (header), CLAUDE.md (tree + pointer); `scripts/content-lint.sh` §0.13; `docs/editorial-log/genesis.md` Entry 2026-06-03-110; `EXECUTION_HISTORY.md` + `PENDING.md` synced.

**Validation:** `pnpm test` 819/819 · `pnpm build` success · `pnpm lint` clean · `pnpm content:lint` 2-warning baseline (§0.10 + §0.11; §0.13 = 0). No version bump (no numbered rule modified). No content files touched.

**Deferred (tracked in PENDING.md):** Q6 corpus-vs-shipped cross-check; Q5 Greek/Aramaic corpus fills.
